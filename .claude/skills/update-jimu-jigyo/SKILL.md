---
name: update-jimu-jigyo
description: 事務事業評価データの更新手順。市の点検結果PDFを構造化JSONにして jimu_jigyo_* テーブルへ取り込む（新年度追加・過年度補完）際に必ず参照すること。
---

# 事務事業評価データ更新（jimu_jigyo_*）

福岡市が毎年公開する「事務事業の点検結果」（事務事業マネジメントシート）を構造化し、KPI・実績推移を複数年度で見られる形でDBに取り込む。

DB接続は `db-access` スキルの規約に従う。

## データソース

- 点検結果ページ（令和6年度実施分の例）: `https://www.city.fukuoka.lg.jp/soki/s_teisu/shisei/6jisshi_tenkenkekka.html`
  - **年度ごとに別ページ**になる。市サイトで「事務事業 点検結果 令和N年度」を検索して特定する
- 局別PDF: `/soki/manage/shisei/documents/{連番}R{年}{局名ローマ字}.pdf`（例: `03R6somu.pdf`）
  - 11局区分（総務企画局〜港湾空港局・教育委員会）、重点事業の個票がPDFで提供される
- ダウンロードは1件ずつ、1〜2秒のインターバルを置く

## データ経路

```text
局別PDF → 構造化JSON（packages/seed/fukuoka/jimu-jigyo-r{N}-*.json）
        → importスクリプト（packages/seed/jimu-jigyo/import-r6-data.ts を年度用に流用）
        → jimu_jigyo_* テーブル
```

### 構造化JSONの形式

既存の `jimu-jigyo-r6-*.json`（11ファイル・74事業）が形式の正。1ファイル = 1局の事業配列で、キーは日本語:

```text
事業名 / 所管局 / 所管課 / 根拠法令 / 開始年度 / 行政計画 / 事業きっかけ
事業概要 { 対象, 対象の目指す状態, 実施内容, 成果見直し判断基準 }
ロジックモデル { 活動アウトプット, 結果, 成果 }
（ほか KPI・予算・実績の年度別データ。既存ファイルの構造に完全に合わせること）
```

局コードは importスクリプトの `BUREAU_MAPPING` に従う（somu / fukushi / hoken / kyouiku / kodomo / juto / keizai / kankyo / shimin / nousui / kouwan）。

## DB構造（正規化済み・複数年度対応）

- `jimu_jigyo_items`: 事業の基本情報。`item_code` は `{局コード}_{連番}` 形式で**スクリプトが自動採番**（手で振らない）
- `jimu_jigyo_fiscal_years`: 年度別データ（予算・実績など）。fiscal_year は西暦（R6 = 2024）
- `jimu_jigyo_kpi_types` / `kpi_items` / `kpi_results` / `kpi_targets`: KPI定義と年度別実績・目標
- `jimu_jigyo_bureaus`: 局マスター
- `jimu_jigyo_import_logs` / `jimu_jigyo_matching_logs`: 取込・年度間マッチングの記録
- ビュー: `jimu_jigyo_latest`（最新年度）、`jimu_jigyo_budget_timeline`（予算推移）

### 年度間マッチング（重要）

新年度データの取込時は、**同一事業を既存の `item_id` に紐付ける**（新規レコードを作らない）。事業名＋局コードでマッチングし、事業名が年度間で微妙に変わることがあるため、マッチしなかった事業は新規作成する前に既存事業一覧と目視照合すること。判断に迷うものはユーザーに確認する。

## 手順（新年度データの追加）

1. 新年度の点検結果ページ公表を確認し、局別PDFのURL一覧を取得
2. PDFをダウンロードし、個票を構造化JSON化（既存 `jimu-jigyo-r6-*.json` と同一構造・同一キー名）
   - 数値（予算額・KPI実績）はPDF原文と照合。単位（千円/件/％等）の取り違えに注意
3. **ユーザーレビュー（必須）**: 生成したJSONのサンプル（数事業分）と全体件数を提示して確認を取る
4. importスクリプトを新年度用に用意（`import-r6-data.ts` の `BUREAU_MAPPING`・年度定数を更新）し、まず dry-run 相当で処理内容を確認
5. 実行して取込 → `jimu_jigyo_import_logs` と件数（局×事業数）を突合
6. web の `/jimu-jigyo` 一覧・詳細ページで表示確認（KPI推移グラフ・予算推移に新年度が反映されているか）

評価スコア（grade A〜D・逆張りフラグ）はサーバーサイドで算出されるため、データ投入のみでよい。

## 初期データ整備（過去5年分）の方針

新規自治体展開時は過去5年分（R2〜R6相当）を投入し、KPI・実績推移を見られる形にする。過年度分は市サイトに残っていない場合があり、取得困難な年度は欠損のまま取り込む（UIは欠損年度に対応済み）。詳細は設計書参照。

## 関連

- 設計書: [docs/20260602_1100_事務事業評価ページ設計.md](../../../docs/20260602_1100_事務事業評価ページ設計.md)、[docs/20260603_0700_事務事業評価複数年度DB化設計書.md](../../../docs/20260603_0700_事務事業評価複数年度DB化設計書.md)
- importスクリプト: `packages/seed/jimu-jigyo/import-r6-data.ts`
- 既存JSON: `packages/seed/fukuoka/jimu-jigyo-r6-*.json`
