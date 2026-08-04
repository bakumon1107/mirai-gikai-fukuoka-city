---
name: update-bills
description: 議案データの更新手順。新会期の議案取込・議決結果と会派別採決の反映・AI解説（bill_contents）生成を行う際に必ず参照すること。
---

# 議案データ更新（bills / bill_contents / faction_stances）

福岡市議会公式サイトの議決結果ページをスクレイピングし、議案・議決結果・会派別採決・AI解説をDBに反映する。

DB接続は `db-access` スキルの規約に従う（本番Supabaseに `.env.production` の Service Role Key + curl REST でアクセス）。

## データソース

- 一覧トップ: `https://gikai.city.fukuoka.lg.jp/result/result/`
- 会期別ページ: `https://gikai.city.fukuoka.lg.jp/result/r{年}_gikai{回}/`（例: `r8_gikai3/` = 令和8年第3回）
  - 議案テーブルのほか、意見書案・決議案（`#ikensyo` アンカー）、請願（`#seigan` アンカー）も同ページにある
- 議案PDFは件名からリンクされている。PDF 1.6形式で `pdftotext`（poppler-utils）で抽出可能
- スクレイピング時は1〜2秒のインターバルを置き、PDFは1件ずつ順次ダウンロードする

## 対象範囲（重要）

- 取り込む: 通常議案（bill）・議員提出議案（member_bill）・意見書案（opinion）・決議案（resolution）・請願（petition）
- **取り込まない: 同意案・人事案件**（教育委員任命・固定資産評価員選任・人権擁護委員推薦など、議決結果が「同意」のもの）。DB全体でこれらは0件を維持する

## DBマッピング

### council_sessions
slug は `r8-3` 形式（令和8年第3回 → r8-3）。`name` は「令和8年 第3回定例会（6月）」形式。`council_url` に会期別ページURLを設定。

### bills
- 一意キー: `(council_session_id, bill_number, bill_type)`。upsert時はこの組で冪等に
- `bill_number`: 「第1号」形式
- `status` マッピング（**「不採択」を「採択」より先に判定すること**。部分一致で petition が誤って approved になるバグが過去にあった）:

| 議決結果 | status | status_note |
|---|---|---|
| 可決・採択 | `approved` | null |
| 承認 | `approved` | `承認` |
| 否決・不採択 | `rejected` | null |
| 継続審査・審議中 | `in_committee` | null |
| 未議決 | `submitted` | null |

- `status_order`・`publish_status_order` は GENERATED カラムなので**設定しない**
- 初回登録は `publish_status: draft`（意見書案・決議案は内容が短く即公開実績あり。ユーザー確認のうえ published 可）
- `source_url` に会期別ページURL、`committee_id` は未設定のまま（本会議中心運用）

### factions / faction_stances
会派別採決（○/×）を `faction_stances` に反映。○→`type: "for"`、×→`type: "against"`。

| 公式ページの略称 | factions.id |
|---|---|
| 自民 | jimin-fukuoka |
| 公明 | komei |
| 市民ク | fukuoka-shimin |
| 共産 | kyosan |
| 新風 | atarashii-kaze |
| 維新 | ishin |
| 自民新 | jimin-shin-fukuoka |

**無所属N は汎用の「無所属１〜６」レコードではなく議員個人名の faction レコードを使う**。マッピングは member/party ページの議席番号順:
無所属１→あべ ひでき / ２→新開 ゆうじ / ３→木村 てつあき / ４→森 あやこ / ５→川口 浩
（会派構成は改選等で変わるため、新会期の初回反映時に公式ページの構成と factions テーブルを突合すること）

### bill_contents（AI解説）
1議案につき `normal`（やさしい解説）と `hard`（詳しい解説）の2件。`title` は公式名称とは別のわかりやすいタイトル、`summary` は1〜2文、`content` は Markdown。

出力テンプレートは [docs/fukuoka/20260329_1000_福岡市議会データ取込設計.md](../../../docs/fukuoka/20260329_1000_福岡市議会データ取込設計.md) §5 を踏襲。

**会派別採決は Markdown の表ではなく箇条書きで書くこと**（既存コンテンツと統一）:

```text
- 賛成：自由民主党福岡市議団、公明党福岡市議団、…
- 反対：日本共産党福岡市議団
```

## 手順

1. **会期の確認・作成**: `council_sessions` に対象会期があるか確認。なければ作成
2. **GitHub/DB状態の確認**: 対象会期の bills 既存件数を確認し、二重取込を防ぐ
3. **スクレイピング**: 会期別ページから議案番号・件名・提出日・議決日・議決結果・会派別採決・PDFリンクを抽出。令和表記は西暦に変換（R8.2.17 → 2026-02-17）
4. **PDF取得とテキスト抽出**: `pdftotext` で抽出。種別ごとの品質差に注意
   - 条例改正案: 「理由」セクションが明確で要約に最適
   - 補正予算案: 冒頭条文は良好だが数値テーブルは断片化する。予算案は市公式の予算概要ページへのリンク提供が基本方針（`update-budget-overview` スキル参照）
   - 抽出困難な場合は公式タイトル・議決結果のみで生成し手動補記を促す
5. **AI解説生成**: normal / hard を生成。採決は箇条書き形式
6. **ユーザーレビュー（必須）**: 生成内容を提示し確認を取ってからDBに書き込む。チェック観点は CLAUDE.md「AI生成コンテンツのDB更新ルール」（日本語の自然さ・ソースとの整合・中国語漢字混入・答弁者フォーマット）
7. **DB反映**: bills → bill_contents → faction_stances の順に REST で upsert
8. **検証**: 件数突合（公式ページの議案数 × 会派数 = stances 件数）、web の議案一覧・詳細ページで表示確認
9. **公開**: Admin画面またはユーザー確認後に `publish_status: published` へ PATCH

## 議決結果のみの更新（会期閉会後）

会期中に draft/submitted で取り込み済みの場合は、閉会後に `status`・`status_note` の PATCH と `faction_stances` の INSERT のみ行う。r8-3 では「議案125〜152＋議員提出1号を更新、意見書案・決議案を新規作成、計31 bills × 12会派 = 372 stances」の実績あり。

## 継続審査案件

継続審査になった議案は最新の会期IDに `council_session_id` を更新する（1議案=1会期のまま運用）。

## 議案質疑（定例会第１日）

議案カードの「議会での審議」欄（`bill_discussions` と `bills.discussion_overview_points`）は、定例会第１日の議案質疑から作る。

1. 会議録を `docs/fukuoka/meeting-minutes/<会期名>/<YYYY-MM-DD>_1日目.txt` に保存する（[README](../../../docs/fukuoka/meeting-minutes/README.md) 参照）
2. `packages/seed/fukuoka/bill-discussions-<会期slug>.json` に、議案ごとの要約・答弁者・質疑本文の行範囲を書く
3. ユーザーレビュー後に取り込む:
   ```bash
   cd packages/seed && pnpm exec tsx --env-file=../../.env.production \
     fukuoka/import-bill-discussions.ts fukuoka/bill-discussions-<会期slug>.json --dry-run
   ```

**1人の質問者が複数議案を続けて質疑する点に注意**。質問段落と答弁ブロックを議案ごとに切り分け、JSONの `questionLines` / `answerLines` に議案別の行範囲を持たせること。質問者単位でまとめると、所管の異なる答弁者が無関係な議案のレコードに載る（過去に発生済み）。答弁者が複数のときは `answererRole` に「役職（氏名）」を「・」で連結し、`answerer_name` は入れない。

旧 `seed-bill-discussions.ts` / `parse-minutes.ts` は質問者単位でのグループ化しかできず、上記の取り違えが起きるため新規の取り込みには使わない。

## 関連

- 設計書: [docs/fukuoka/20260329_1000_福岡市議会データ取込設計.md](../../../docs/fukuoka/20260329_1000_福岡市議会データ取込設計.md)、[docs/fukuoka/20260405_1500_意見書案・決議案・議員提出議案取込設計書.md](../../../docs/fukuoka/20260405_1500_意見書案・決議案・議員提出議案取込設計書.md)
- 議案質疑（第1日の質疑要約）は `packages/seed/fukuoka/seed-bill-discussions.ts` + `parse-minutes.ts` を使用
