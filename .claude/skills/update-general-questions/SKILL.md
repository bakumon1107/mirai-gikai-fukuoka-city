---
name: update-general-questions
description: 一般質問データの更新手順。会議録検索システムから全文を取得し、要約・トピック分割して general_questions に取り込む際に必ず参照すること。
---

# 一般質問データ更新（general_questions）

福岡市議会 会議録検索システムから一般質問の全文を取得し、質問者ごとに分割・AI要約して `general_questions` に取り込む。

UI設計・カテゴリ分類・品質基準は `general-questions` スキルを必ず併読すること。DB接続は `db-access` スキルの規約に従う。

## データソース（会議録検索システム）

- 会議一覧: `https://www.city.fukuoka.fukuoka.dbsr.jp/index.php/{検索ID}?Template=list`（ページネーションは `&Page=N`）
- **全文表示（取得用）**: `https://www.city.fukuoka.fukuoka.dbsr.jp/index.php/{DocumentID}?Template=doc-all-frame&VoiceType=all`
  - このURLは curl で直接取得できる。従来の「1日ずつ開いて全文表示に切り替えてダウンロード」は不要
  - DocumentID は一覧ページのリンク（`Template=doc-one-frame&...&DocumentID=...`）から拾える

### 一般質問の日の見分け方

一覧の文書名は「令和８年第１回定例会（第８日）」形式で、一般質問かどうかは文書名からは分からない。各日の本文冒頭（議事日程）に「一般質問」とあるか、議長発言「これより一般質問を行います」等で判別する。定例会の後半日程（条例予算特別委員会の後）に置かれることが多い。

## 生テキストの保存先

取得した全文は会期ごとに `docs/fukuoka/meeting-minutes/<会期名>/` に保存する（例: `令和８年第１回定例会/2026-03-04_4日目.txt`）。再パース・検証時のソースとして残す。

## パース

発言者の行パターンは `packages/seed/fukuoka/parse-minutes.ts` の正規表現を流用できる:

- 質問者: `◯57番（田中たかし）` → 議席番号＋氏名
- 答弁者: `◯農林水産局長（姉川雄一）`、`◯市長（高島宗一郎）` など役職＋氏名
- 議長: `◯議長（…）`
- 会派: 登壇冒頭の「〜を代表して」前の会派名（`extractParty`）

1質問者 = 1レコード。質問者の登壇から次の質問者までを1ブロックとして分割する。

## DBマッピング（general_questions）

| フィールド | 内容 |
|---|---|
| `council_session_id` | 会期ID（slug は `r8-1` 形式） |
| `session_day` | 何日目か（数値） |
| `question_order` | その日の中での質問順 |
| `questioner_name` / `questioner_number` / `questioner_party` | 質問者情報 |
| `raw_text` | 原文逐語録（その質問者の全発言＋答弁） |
| `summary` | 全体サマリー |
| `topics` | トピック配列（下記JSON） |
| `source_url` | 全文表示URL（`Template=doc-all-frame&VoiceType=all`） |
| `publish_status` | 取込時 `draft` → 確認後 `published` |

### topics の JSON 形（`GeneralQuestionTopic`）

```json
{
  "title": "…",
  "question_summary": "…",
  "answer_summary": "…",
  "answerer_role": "○○局長（氏名）・市長（氏名）",
  "answerer_name": "",
  "block_summary": null
}
```

## 品質基準（要約生成時に必ず守る）

`general-questions` スキルの詳細を参照。要点:

- **タイトル**: 原文の行政用語・略語はそのまま使う。カテゴリ分類はタイトルのキーワードで判定されるため、`build-topic-groups.ts` の `CATEGORY_MAP` にあるキーワードをタイトルに含めないと「その他」に落ちる
- **Qサマリー文体**: 「質した」「問いただした」はNG。「確認した」「求めた」「質問した」を使う
- **複数答弁者**: `answerer_role` に「役職（氏名）・役職（氏名）」形式でまとめ、`answerer_name` は空にする
- **答弁者の混入注意**: 同一質問者が複数トピックを質疑した場合、トピックAの答弁者がトピックBに混入しないよう照合する
- 中国語簡体字・繁体字の混入チェック（例: 议・务・该）

## 手順

1. 一覧ページから対象定例会の各日の DocumentID を特定
2. 一般質問の日を判別し、全文表示URLを curl で取得 → `docs/fukuoka/meeting-minutes/` に保存
3. 質問者ごとに分割・パース
4. AI要約（summary + topics）を生成
5. **ユーザーレビュー（必須）**: 生成内容を提示し確認を取ってから書き込む（CLAUDE.md「AI生成コンテンツのDB更新ルール」）
6. `publish_status: draft` で INSERT
7. web で表示確認（`/sessions/[session_slug]/questions` のテーマ別ビューでカテゴリ分類も目視確認）
8. 確認後、会期単位で `published` に PATCH:

```bash
source .env.production
curl -s -X PATCH "$SUPABASE_URL/rest/v1/general_questions?council_session_id=eq.<session_id>" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"publish_status": "published"}'
```

トップページの一般質問バナーは最新の公開済みセッションを自動で拾うため、追加作業は不要。

## 関連

- 機能リファレンス: `general-questions` スキル（UI設計・カテゴリ分類・品質基準）
- パーサー: `packages/seed/fukuoka/parse-minutes.ts`（議案質疑用だが行パターンは共通）
