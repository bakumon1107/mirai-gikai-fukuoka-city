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
# r7-4: （要確認）
