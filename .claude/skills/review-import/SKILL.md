---
name: review-import
description: DB登録前にインポートデータをレビューし、ユーザー承認後にDB登録を実行するスキル
---

# Review Import

`import-bills.ts` / `import-special-bills.ts` の `--review-only` 出力を受け取り、
品質チェックを行ってユーザーに提示する。承認後にDB登録を実行する。

## 使い方

```
/review-import <slug> <type> [url]

type: bills          → import-bills.ts を対象
      special-bills  → import-special-bills.ts を対象（url 必須）

例（通常議案）:
  /review-import r7-4 bills

例（意見書案・請願）:
  /review-import r7-4 special-bills https://gikai.city.fukuoka.lg.jp/result/r7_gikai4/
```

## ワークフロー

### Step 1: レビューデータ取得

`--review-only` フラグでスクリプトを実行し、ReviewRecord[] JSON を取得する。

```bash
# type=bills の場合
tsx --env-file=../../.env packages/seed/fukuoka/import-bills.ts {slug} --review-only

# type=special-bills の場合
tsx --env-file=../../.env packages/seed/fukuoka/import-special-bills.ts \
  --url {url} --session {slug} --review-only
```

スクリプトの実行ディレクトリ: `{MASTER_DATA_REPO}` （adapter.md を参照）

### Step 2: 自己チェック（7項目）

取得した ReviewRecord[] に対して以下を自動チェックし、懸念点を記録する。

| # | チェック項目 | 対象 |
|---|------------|------|
| 1 | 日本語の自然さ（語尾・助詞・文体の統一） | summary のある議案 |
| 2 | 情報の整合性（factionVotes と result の整合） | 全件 |
| 3 | トピック混入（A の内容が B のレコードに入っていないか） | 全件 |
| 4 | 中国漢字混入（「议」「务」「该」「们」等） | summary のある議案 |
| 5 | 答弁者フォーマット（複数答弁者は「役職（氏名）」形式） | answerers フィールドがある議案 |
| 6 | 請願の受理番号フォーマット（「請願○年○号」形式） | petition のみ |
| 7 | 意見書案・請願の賛否と可否の整合性 | opinion / resolution / petition |

**チェック2の詳細**: 「可決」なのに反対会派が多数を占めていないか、「否決」なのに賛成が多数でないか確認する。

### Step 3: レビュー表の提示

以下のフォーマットでユーザーに提示する。

```
## 登録前レビュー（{slug} {type} {件数}件）

| # | 種別 | 番号 | 件名（冒頭30字） | 結果 | 懸念点 |
|---|------|------|----------------|------|--------|
| 1 | 意見書案 | 意見書案第1号 | 教育予算の充実… | 可決 | なし |
| 2 | 請願 | 請願６年４号 | 旧柏原公民館への… | 不採択 | なし |

### 自己フィードバックサマリー
- 全 {n} 件チェック完了
- 懸念あり: {m} 件
- （懸念がある場合は具体的な内容を記載）

承認して DB に登録しますか？
  → `yes`: 登録実行
  → `no`: 修正内容を指示してください
  → 番号指定（例: `1, 3`）: 該当件の詳細を確認
```

### Step 4: ユーザー応答を処理

**`yes` の場合**: DB登録スクリプトを実行する（`--review-only` なし）。

```bash
# type=bills の場合
tsx --env-file=../../.env packages/seed/fukuoka/import-bills.ts {slug}

# type=special-bills の場合
tsx --env-file=../../.env packages/seed/fukuoka/import-special-bills.ts \
  --url {url} --session {slug}
```

**`no` の場合**: 修正内容を確認し、必要に応じてスクリプトやJSONファイルの修正を促す。

**番号指定の場合**: 指定された番号の ReviewRecord の全フィールドを表示し、
ユーザーが問題を確認できるようにする。その後 Step 3 に戻る。

### Step 5: 完了サマリー

```
## 登録完了（{slug} {type}）
- 新規: {n}件 / 更新: {m}件 / エラー: {e}件
```

## 注意事項

- スクリプトの実行は `{MASTER_DATA_REPO}` ディレクトリで行う（adapter.md 参照）
- `--review-only` フラグは標準出力にJSONを出力するため、ログ混入に注意
- 請願のフォーマット確認: `billNumber` が `"請願"` で始まり、年号・号数が含まれるか
