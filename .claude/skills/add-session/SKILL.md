---
name: add-session
description: 新しい会期のデータを追加する定型ワークフロー（スクレイピング→AI生成→レビュー→インポート→公開）
---

# Add Session

新しい会期のデータを追加する際の定型ワークフローを自動化するスキル。
`.claude/skills/add-session/adapter.md` の自治体固有設定を読み込んで動作する。

## 使い方

```
/add-session <slug> <url>
例: /add-session r7-4 https://gikai.city.fukuoka.lg.jp/result/r7_gikai4/
```

## ワークフロー

### Step 1: アダプタ読み込み

`.claude/skills/add-session/adapter.md` を読み込み、スクリプトパス等の設定を取得する。
ファイルが存在しない場合はユーザーに作成を促して終了する。

### Step 2: 前提確認

`council_sessions` に当該 slug が存在するかを確認するための SQL を提示し、
ユーザーに Supabase Studio の SQL Editor での実行を促す。

```sql
SELECT id, name, slug FROM council_sessions WHERE slug = '{slug}';
```

存在しない場合は以下の INSERT SQL を提示する:

```sql
INSERT INTO council_sessions (name, slug, council_url, start_date, end_date, is_active)
VALUES (
  '（会期名を入力）',
  '{slug}',
  '{url}',
  '（開始日を入力）',
  '（終了日を入力）',
  false
);
```

ユーザーの確認（または「実行した」の応答）を待ってから Step 3 へ進む。

### Step 3: スクレイピング実行

adapter.md の `MASTER_DATA_REPO` と `SCRAPE_SCRIPT` を参照して実行する。

```bash
cd {MASTER_DATA_REPO}
tsx {SCRAPE_SCRIPT} {slug}
# → output/{slug}-bills.json が生成される
```

実行後、以下を確認してユーザーに報告する:
- 件数
- 議案番号の範囲
- 会派賛否データの有無（factionVotes が空でないか）

確認事項に問題があれば修正方法をユーザーと相談してから次へ進む。

### Step 4: AI コンテンツ生成 ＋ 自己フィードバック

```bash
cd {MASTER_DATA_REPO}
tsx {GENERATE_SCRIPT} {slug}
# → output/{slug}-contents.json が生成される（時間がかかる）
```

生成後、`/review-import {slug} bills` スキルを呼び出してレビューを実施する。
ユーザーが承認したら Step 5 へ進む。

### Step 5: 通常議案インポート

`/review-import` の承認応答 `yes` により自動実行される。

### Step 6: 意見書案・請願等インポート

adapter.md の `IMPORT_SPECIAL_SCRIPT` と `SPECIAL_BILLS_ARGS` を参照して、
`/review-import {slug} special-bills {url}` スキルを呼び出す。

ユーザーが承認したら DB 登録を実行する。

### Step 7: 公開

```bash
cd {MASTER_DATA_REPO}
tsx --env-file=../../.env {PUBLISH_SCRIPT} {slug}
```

### Step 8: 完了サマリー出力

```
## 追加完了（{slug}）
- 通常議案: 新規{n}件 / 更新{m}件
- 意見書案・請願等: {k}件
- 公開: {p}件
```

## adapter.md のフォーマット

各自治体リポジトリは `.claude/skills/add-session/adapter.md` を持つ。
コアスキルはこのファイルから設定を読み込む。

```markdown
# add-session アダプタ

## スクリプトリポジトリ
MASTER_DATA_REPO: ../mirai-gikai-xxx-master-data

## スクリプトパス
SCRAPE_SCRIPT: packages/seed/{city}/scrape-bills.ts
GENERATE_SCRIPT: packages/seed/{city}/generate-content.ts
IMPORT_SCRIPT: packages/seed/{city}/import-bills.ts
IMPORT_SPECIAL_SCRIPT: packages/seed/{city}/import-special-bills.ts
PUBLISH_SCRIPT: packages/seed/{city}/publish-bills.ts

## 意見書案・請願等の引数
SPECIAL_BILLS_ARGS: --url {url} --session {slug}

## 対応している bill_type（特殊系）
SUPPORTED_SPECIAL_TYPES: opinion, resolution, member_bill, petition

## 無所属議員マッピング（会期ごとに追記）
# r8-1: 無所属１=あべひでき, 無所属２=新開ゆうじ, ...
```
