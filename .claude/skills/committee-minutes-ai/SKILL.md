---
name: committee-minutes-ai
description: 福岡市議会の委員会議事録の「わかりやすい表現」「会議の要約」をAI生成してDBに反映する。委員会アーカイブ（/committees）のコンテンツ作成を依頼されたら使用。
---

# 委員会議事録のわかりやすい表現・要約生成スキル（福岡市版）

委員会議事録アーカイブ（`/committees` ページ群）の市民向けコンテンツを生成し、DBに反映する手順。

## 前提: 福岡市の議事録の特徴

福岡市の委員会議事録は**発言者名が無い匿名・要約Q&A形式**。スクレイパーが各発言を次のセグメントに正規化している：

- `speakerType: "member"` … 委員の質疑・意見（元は ［質疑・意見］ または ◯）
- `speakerType: "executive"` … 執行部の答弁（元は ［答弁］ または △）
- `speakerType: "note"` … 開会時刻・傍聴・調査事項などの記録・進行
- 各セグメントは `seq`（会議内の連番）で一意

## 全体像

```
docs/data/committee-minutes/<年>/<開催日>_<スラッグ>_<DocumentID>.json  ← スクレイパー出力（原文）
        ↓ ①このスキルでAI生成
docs/data/committee-minutes/<年>/ai/<DocumentID>.json                 ← パッチファイル
        ↓ ②ユーザー確認（必須！）
        ↓ ③適用スクリプト
committee_meetings.summary / speeches[].simpleText
```

- 生成済み・未生成の確認: `ls docs/data/committee-minutes/2026/ai/` と元データの差分を見る
- 会議の規模は元JSONの `segmentCount` で分かる。**200セグメント超の分科会は1会議ずつ**処理する

## ① パッチファイルの生成

元JSON（`speeches` 配列）を読み、以下の形式で `ai/<DocumentID>.json` を作る：

```json
{
  "documentId": 3521,
  "meetingSummary": "会議全体の要約（2〜3文）",
  "speechSimpleTexts": [{ "seq": 1, "simpleText": "わかりやすい表現の本文" }]
}
```

- `speechSimpleTexts` は `speakerType` が `member`／`executive` の**全セグメント**に付ける（`note` は対象外）。`seq` で対応させる
- 予算分科会は「◯◯局の予算」を局ごとに質疑するため、`meetingSummary` は「どの局の何が議論され、どんな質問・答弁があったか」を優先

### 文体ルール（最重要）

1. **政治に詳しくない中学生でも伝わる**表現。専門用語には短い説明を添える
2. です・ます調で統一。質疑・意見（委員）と答弁（市の担当者）の立場を保つ
3. **数値は必ず原文と照合**する。漢数字・全角数字は算用数字に直す（六百四十万円→640万円）
4. 中国語簡体字・繁体字（议・务・该 等）を混入させない
5. 要約は「何が問われ、市がどう答えたか」を優先。結論を先に

## ② ユーザー確認（スキップ禁止）

CLAUDE.md「AI生成コンテンツのDB更新ルール」に従い、**DB反映前に必ず生成内容を提示して承認を得る**。提示時は自己レビュー（日本語の自然さ・数値の整合・文字コード）の結果も添える。全文が長い場合は、会議全体要約＋simpleTextの代表例を示し、パッチファイルのパスを案内する。

## ③ DB反映

```bash
cd packages/seed
npx tsx --env-file=../../.env fukuoka/apply-committee-ai-content.ts
```

- `ai/` ディレクトリの**全ファイル**を毎回処理する（再実行は冪等・上書き）

## ④ 検証

```bash
cd /path/to/worktree && npx dotenv -e .env -- pnpm --filter web dev  # port 3002
```

- `/committees/<slug>/<DocumentID>` … 全体要約（ヘッダー内）が出るか
- `/committees/<slug>/<DocumentID>/transcript` … デフォルト（わかりやすい表現）で「準備中」の注記が消え、simpleTextが表示されるか。「詳しく（原文）」との切替も確認

## 関連ファイル

- スクレイパー: `packages/seed/fukuoka/scrape-committee-minutes.ts`（再取得・翌年分は `--year`）
- パーサ: `packages/seed/fukuoka/parse-committee-minutes.ts`（委員会マスタ `CURRENT_COMMITTEES`・セグメント化）
- 初回シード: `packages/seed/fukuoka/seed-committee-meetings.ts`
- AI反映: `packages/seed/fukuoka/apply-committee-ai-content.ts`
- 表示ロジック: `web/src/features/committee-minutes/`

## 既知の注意点

- データソースは福岡市会議録検索システム（`https://www.city.fukuoka.fukuoka.dbsr.jp`）。**レート制限が強い**ため再スクレイプ時はウェイトを守る
- R8（2026年）の委員会は36文書。予算分科会（教育こども/経済振興/総務財政/生活環境/福祉都市）28件が中心で、特別委・議会運営委が8件
- 特別委員会の中には発言が数件のみの短い記録もある。その場合 `meetingSummary` に手続き内容を1文で書き、`speechSimpleTexts` は該当セグメントのみ
