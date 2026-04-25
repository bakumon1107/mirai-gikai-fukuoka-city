# add-session アダプタ（福岡市版）

## スクリプトリポジトリ
MASTER_DATA_REPO: ../mirai-gikai-fukuoka-master-data

## スクリプトパス
SCRAPE_SCRIPT: packages/seed/fukuoka/scrape-bills.ts
GENERATE_SCRIPT: packages/seed/fukuoka/generate-content.ts
IMPORT_SCRIPT: packages/seed/fukuoka/import-bills.ts
IMPORT_SPECIAL_SCRIPT: packages/seed/fukuoka/import-special-bills.ts
PUBLISH_SCRIPT: packages/seed/fukuoka/publish-bills.ts

## 意見書案・請願等の引数
SPECIAL_BILLS_ARGS: --url {url} --session {slug}

## 対応している bill_type（特殊系）
SUPPORTED_SPECIAL_TYPES: opinion, resolution, member_bill, petition

## 無所属議員マッピング（会期ごとに追記）
# r8-1: 無所属１=あべひでき, 無所属２=新開ゆうじ, 無所属３=木村てつあき, 無所属４=森あやこ, 無所属５=川口浩
# r7-4: 無所属１=あべひでき, 無所属２=新開ゆうじ, 無所属３=木村てつあき（r7-4 の実際のマッピングは採決結果ページで確認要）

## 福岡市議案ページの HTML 形式（スクレイピング上の注意点）

### 会期によって tablepress テーブルの形式が異なる

**通常形式（r8-1 等）**:
- 1行目第1セル: `"議案番号"` というラベル
- 1行目以降: 議案番号の数値（"1", "2" ...）が続く

**番号ヘッダ形式（r7-4 以前）**:
- 1行目第1セル: **空**（ラベルなし）
- 1行目: `<th>145</th>`, `<th>146</th>` ... と議案番号が直接 `<th>` に入る
- 2行目以降: `提出年月日`, `件名`, `議決年月日`, `議決結果`, 各会派 の順

→ `scrape-bills.ts` はどちらの形式も自動判別して処理する（`isHeaderFormat` ブランチ）。

### URL の命名規則
- slug `r7-4` → URL path `r7_gikai4`（`slugToUrlPath()` で変換）
- 変換ルール: `r{年}-{回}` → `r{年}_gikai{回}`

### 議決結果の種類（r7-4）
- `認定`: 決算認定（`approved` にマッピング）
- `可決`: 通常可決（`approved`）
- `同意`: 同意案件（スクレイパーはスキップ対象）
