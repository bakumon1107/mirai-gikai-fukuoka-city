---
name: update-budget-overview
description: 各局の重点施策（予算概要）データの更新手順。毎年度の当初予算案ページのPDFを要約して budget_overviews / budget_themes / budget_initiatives に取り込む際に必ず参照すること。
---

# 各局重点施策データ更新（budget_overviews / budget_themes / budget_initiatives）

福岡市が毎年度公開する当初予算案の「各局予算概要」PDF（18局分）を要約し、局ごとの重点施策としてDBに取り込む。

DB接続は `db-access` スキルの規約に従う。

## データソース

- 当初予算案ページ（令和8年度の例）: `https://www.city.fukuoka.lg.jp/zaisei/zaisei/shisei/8Ntoushoyosanan_2.html`
  - **年度ごとにURLが変わる**。市の財政局ページから「令和N年度当初予算案」を探すこと
  - 補正予算案の概要ページもある（例: `7nendo2gatsuhosei.html`）
- 各局PDF: `/zaisei/zaisei/shisei/documents/{連番01-18}_R{年}_{局名ローマ字}.pdf`
  - 例: `01_R8_shityoshitsu.pdf`（市長室）〜 `18_R8_kyoiku.pdf`（教育委員会）
  - 令和8年度のPDF一式は [docs/fukuoka/sample/](../../../docs/fukuoka/sample/) にダウンロード済み
- ダウンロードは1件ずつ、1〜2秒のインターバルを置く

## DBマッピング

3階層: 局（budget_overviews）→ テーマ（budget_themes）→ 施策（budget_initiatives）。

### budget_overviews（局単位）
| フィールド | 内容 |
|---|---|
| `council_session_id` | 当初予算を審議する会期（第1回定例会。例: r8-1）のID |
| `department_name` / `department_slug` | 局名 / PDFファイル名のローマ字部分（例: shityoshitsu, somukikaku） |
| `direction` | 局の予算編成方針・方向性の要約 |
| `total_budget` / `prev_budget` | 当年度・前年度予算額 |
| `sort_order` | PDF連番順（01→0, 02→1, …） |
| `source_url` | 当該局PDFのURL |
| `publish_status` | 取込時 `draft` → 確認後 `published` |

> ⚠️ **金額単位に注意**: 基本は**千円単位**で格納する。ただし既存データに円単位で入っている局（財政局: 105,136,440,000）が混在している。INSERT前に既存レコードの桁と表示ページ（`/budget/[session_slug]/[department_slug]`）の見え方を必ず突合し、単位を揃えること。

### budget_themes（テーマ単位）
`overview_id` / `title`（重点分野名）/ `budget_amount` / `ai_summary`（テーマの狙いを市民向けに要約）/ `sort_order`

### budget_initiatives（個別施策）
`theme_id` / `title`（事業名）/ `description`（内容説明）/ `budget_amount` / `badge`（新規・拡充などのラベル。PDF内の表記に従う）/ `sort_order`

## 手順

1. 対象年度の当初予算案ページを特定し、18局分のPDFのURL一覧を取得
2. PDFをダウンロードし `pdftotext` でテキスト抽出（レイアウト崩れがある場合は `-layout` オプションを試す。数値は必ず元PDFを目視照合）
3. 局ごとに以下を抽出・生成:
   - 局の総予算額・前年度額・編成方針（direction）
   - 重点テーマ（budget_themes）と AI 要約
   - テーマ配下の個別施策（budget_initiatives）: 事業名・説明・予算額・新規/拡充バッジ
4. **ユーザーレビュー（必須）**: 生成内容を提示し確認を取る（CLAUDE.md「AI生成コンテンツのDB更新ルール」）。**金額・事業名はPDF原文と1件ずつ照合**する
5. `draft` で INSERT（overviews → themes → initiatives の順）
6. web の `/budget/[session_slug]` 一覧・局別詳細ページで表示確認（金額の桁・テーマの並び順）
7. 確認後 `published` に PATCH

## 議案ページとの連携

予算案の議案（bills）ページからは市公式の予算概要ページへリンクする方針（`update-bills` スキル参照）。本スキルのデータは `/budget` 配下の重点施策ページ用。

## 関連

- 設計書: [docs/fukuoka/20260329_1100_予算概要ページ表示設計.md](../../../docs/fukuoka/20260329_1100_予算概要ページ表示設計.md)
- 財政全般の可視化データ（歳入歳出・財政指標）は `fukuoka-finance-map` スキル（データソースが別物なので混同しない）
