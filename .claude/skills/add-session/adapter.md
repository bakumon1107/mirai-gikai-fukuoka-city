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
- `採択`: 請願が採択（`approved`）
- `不採択`: 請願が不採択（`rejected`）

### 請願テーブルのヘッダ（r7-4 実績）
- 1行目第1セル: `"請願受理番号"`（`"受理番号"` ではない点に注意）
- 番号例: `"６年４号"` → billNumber: `"請願６年４号"`

### スクリプトパス追加（タグ付け・注目タグ付け）
ASSIGN_TAGS_SCRIPT: packages/seed/fukuoka/assign-tags.ts
AUTO_FEATURE_SCRIPT: packages/seed/fukuoka/auto-feature.ts

## インポート実行の注意点

### 本番 DB への接続方法
スクリプトは `.env` の `SUPABASE_URL` を参照する。**ローカル Supabase（127.0.0.1）ではなく本番 DB に投入する場合**は、環境変数を明示的に上書きすること:

```bash
SUPABASE_URL="https://<project-ref>.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<key>" \
packages/seed/node_modules/.bin/tsx packages/seed/fukuoka/import-bills.ts <slug>
```

`.env.production` の値は `mirai-gikai-fukuoka-city/.env.production` に格納されている（gitignore済み）。

### tsx の実行方法
`npx tsx` や `pnpm exec tsx` は動作しない場合がある。必ず以下を使うこと:

```bash
packages/seed/node_modules/.bin/tsx <script>
```

### bill_type チェック制約の確認（petition 等の新種別を追加した場合）
`petition` など新しい `bill_type` を追加した際は、本番 DB の `bills_bill_type_check` 制約が更新済みかを確認すること。マイグレーションが未マージ・未適用の場合は `import-special-bills.ts` が `check constraint` エラーで失敗する。

確認・修正手順:
1. 対応するマイグレーション PR が `fukuoka-city/develop` にマージ済みかを確認
2. 未マージの場合は Supabase management API で直接適用:
   ```bash
   curl -s -X POST "https://api.supabase.com/v1/projects/<ref>/database/query" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -d '{"query": "alter table bills drop constraint if exists bills_bill_type_check; alter table bills add constraint bills_bill_type_check check (bill_type in (''bill'', ''opinion'', ''resolution'', ''member_bill'', ''petition''));"}'
   ```

### assign-tags.ts: 会期ごとのタグマッピング
`BILL_TAG_MAP_BY_SESSION` に新会期のマッピングを追加すること（r8-1 以降は番号が変わるため、`BILL_TAG_MAP` は r8-1 用の番号が入っている）。マッピング不要な議案（契約締結・和解・損害賠償等）はパターンマッチ（`PATTERN_TAGS`）で自動付与されるため省略可。

### generate-special-contents.ts: 意見書案・決議案・請願のコンテンツ生成

`import-special-bills.ts` でインポートした議案は bill_contents が空のまま登録される。インポート後に以下を実行してコンテンツを生成すること:

```bash
SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." \
packages/seed/node_modules/.bin/tsx packages/seed/fukuoka/generate-special-contents.ts \
  --session <slug>
```

- Claude CLI がレート制限に当たると `SyntaxError: Unexpected end of JSON input` で失敗する。**何度か再実行すれば全件成功する**（既に更新済みのものも上書きされるが問題なし）
- 請願（petition）の議決結果ラベルは「採択」「不採択」であり、通常議案の「可決」「否決」とは異なる。スクリプト内で `bill_type === "petition"` の場合は別ラベルを使用するよう実装済み

### mapResultToStatus バグ（修正済み）

`"不採択".includes("採択")` が `true` になるため、`"採択"` を先にチェックすると「不採択」が `approved` にマッピングされる。必ず以下の順で確認すること:

```typescript
if (result.includes("不採択") || result.includes("否決")) return "rejected";
if (result.includes("可決") || result.includes("採択") || ...) return "approved";
```

### Next.js キャッシュのリフレッシュ

インポート・コンテンツ生成後は ISR キャッシュが残るため、本番 Web URL の `/api/revalidate` に `REVALIDATE_SECRET` を Bearer トークンとして POST すること。
`WEB_URL` と `REVALIDATE_SECRET` は `mirai-gikai-fukuoka-city/.env.production` に格納済み（gitignore対象）。

```bash
curl -X POST "<WEB_URL>/api/revalidate" \
  -H "Authorization: Bearer <REVALIDATE_SECRET>"
```

成功時: `{"success":true,"revalidated":true,...}` が返る。
