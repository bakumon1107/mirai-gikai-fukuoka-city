# 福岡市事務事業評価 複数年度DB化 実装ガイド

## 概要

このプロジェクトは、福岡市事務事業点検のデータを、令和２年～令和６年（5年間）のローリングウィンドウで管理するDB化の実装です。

### 目標
- ✅ 同一事業の複数年度推移を追跡・分析可能に
- ✅ 全部局横断検索を実現
- ✅ 新年度データの段階的追加時に古いデータを自動削除
- ✅ 予算・KPIの5年推移を可視化

---

## ファイル構成

```
mirai-gikai-jimu-jigyo-multi-year/
├── docs/
│   └── 20260603_0700_事務事業評価複数年度DB化設計書.md
│       ↳ 詳細設計・スキーマ・クエリ例
│
├── supabase/
│   └── migrations/
│       └── 20260603_000000_create_jimu_jigyo_tables.sql
│           ↳ テーブル定義・RLS・ビュー・関数
│
├── packages/seed/jimu-jigyo/
│   ├── import-r6-data.ts
│   │   ↳ 令和6年度（R5・R6データ含む）のDB化
│   └── import-r5-data.ts
│       ↳ 令和5年度データの追加統合
│
└── web/src/features/jimu-jigyo/shared/types/
    └── db-schema.ts
        ↳ DB化後の型定義
```

---

## 実装の流れ

### Phase 1: DB構築（完了）

マイグレーション SQL が準備完了。

```bash
# 1. Supabase にマイグレーションを適用
npx supabase migration up --include-all

# 2. 型定義を再生成
pnpm run db:types:gen
```

### Phase 2: 令和6年度データのDB化

既存JSONファイルから R6（＆R5）データをDB化。

```bash
# 1. R6データを取込
pnpm run seed:jimu-jigyo:import-r6

# ✅ Output:
# 📥 Importing 総務企画局...
#   ✅ Inserted: 24, Updated: 0
# 📥 Importing 福祉局...
#   ✅ Inserted: 18, Updated: 0
# ...
# ✨ Import completed!
# Total inserted: XXX
# Total updated: 0
```

**動作:**
- 11部局のJSONファイルから事業をRead
- `item_code` を自動採番（"somu_001", "somu_002", ...）
- `jimu_jigyo_items` に新規事業を登録
- `jimu_jigyo_fiscal_years` にR6・R5の予算データを登録
- `jimu_jigyo_kpi_items` / `jimu_jigyo_kpi_results` にKPI指標を登録
- `jimu_jigyo_import_logs` にインポート履歴を記録

### Phase 3: 令和5年度データの統合

既存JSONに含まれる R5 セクションをDB化。R6で既に登録されている事業に R5データを追加。

```bash
# 2. R5データを統合
pnpm run seed:jimu-jigyo:import-r5

# ✅ Output:
# 📥 Processing 総務企画局...
#   ✅ Inserted: 24, Skipped: 0
# ...
# ✨ R5 Data import completed!
# Total inserted: XXX
# Total skipped: 0
```

**動作:**
- JSONの R5 セクションから予算・KPIデータを抽出
- R6で登録された同一事業（item_id）に紐付け
- マッチング情報を `jimu_jigyo_matching_logs` に記録
- R6と同じ方法でKPIを登録

### Phase 4: 令和4年～2年度データの取込（将来）

PDF/Webスクレイピング等で R4～R2 データを取込。

```bash
# 将来: R4～R2 データの取込スクリプト追加予定
pnpm run seed:jimu-jigyo:import-r4
pnpm run seed:jimu-jigyo:import-r3
pnpm run seed:jimu-jigyo:import-r2
```

### Phase 5: API・UI実装（将来）

推移分析画面の実装。

```bash
# 推移データの取得例
GET /api/jimu-jigyo/item/:itemId/timeline
→ { item_name, budget_timeline[], kpi_timeline[] }

# 全体統計
GET /api/jimu-jigyo/statistics?fiscalYear=2024
→ { total_items, total_budget, avg_achievement_rate, bureau_breakdown[] }
```

---

## データベーススキーマ

### テーブル一覧

| テーブル | 説明 | 保持データ |
|---------|------|---------|
| `jimu_jigyo_bureaus` | 部局マスタ | 11部局 |
| `jimu_jigyo_items` | 事務事業マスタ | 事業名、所管局・課、事業概要、ロジックモデル |
| `jimu_jigyo_fiscal_years` | 年度別データ | 予算（歳出・特定財源・一般財源）、メタデータ |
| `jimu_jigyo_kpi_types` | KPI分類 | "活動指標", "成果指標" |
| `jimu_jigyo_kpi_items` | KPI指標マスタ | 指標名称 |
| `jimu_jigyo_kpi_results` | KPI実績（年度別） | 目標値・実績値・達成率 |
| `jimu_jigyo_kpi_targets` | KPI目標 | 中期目標・最終年度目標 |
| `jimu_jigyo_import_logs` | インポート履歴 | 取込日時、ソース、件数、ステータス |
| `jimu_jigyo_matching_logs` | マッチング履歴 | 年度間の事業紐付け記録 |

### 主要なクエリ

#### 📊 同一事業の複数年度推移

```sql
SELECT
  fy.fiscal_year,
  fy.expenditure_amount,
  fy.specific_revenue,
  fy.general_revenue,
  (fy.expenditure_amount - LAG(fy.expenditure_amount)
   OVER (ORDER BY fy.fiscal_year)) AS budget_change
FROM jimu_jigyo_items jj
JOIN jimu_jigyo_fiscal_years fy ON jj.id = fy.item_id
WHERE jj.item_name = '事業名' AND jj.bureau_code = 'somu'
ORDER BY fy.fiscal_year;
```

#### 📈 全部局の予算削減事業

```sql
SELECT DISTINCT
  jj.item_name,
  r5.expenditure_amount AS r5_budget,
  r6.expenditure_amount AS r6_budget,
  (r6.expenditure_amount - r5.expenditure_amount) AS budget_change
FROM jimu_jigyo_items jj
JOIN jimu_jigyo_fiscal_years r5 ON jj.id = r5.item_id AND r5.fiscal_year = 2023
JOIN jimu_jigyo_fiscal_years r6 ON jj.id = r6.item_id AND r6.fiscal_year = 2024
WHERE r6.expenditure_amount < r5.expenditure_amount
ORDER BY budget_change;
```

#### 🎯 KPI達成率の推移

```sql
SELECT
  ki.kpi_name,
  kr.fiscal_year,
  kr.achievement_rate
FROM jimu_jigyo_kpi_items ki
JOIN jimu_jigyo_kpi_results kr ON ki.id = kr.kpi_item_id
WHERE ki.item_id = ? AND ki.kpi_type_id = (
  SELECT id FROM jimu_jigyo_kpi_types WHERE kpi_type_code = 'achievement'
)
ORDER BY kr.fiscal_year DESC;
```

---

## ローリングウィンドウ制御

常に最新5年間のデータを保持します。

### 令和7年度データ取込時

```typescript
// 令和7年度（2025年）データ取込時、令和2年度（2020年）データを削除

const newFiscalYear = 2025; // R7
const oldestToKeep = newFiscalYear - 4; // 2021（R3）

// 削除対象: 2020年（R2）以前
DELETE FROM jimu_jigyo_fiscal_years
WHERE fiscal_year < 2021
  AND item_id IN (
    SELECT id FROM jimu_jigyo_items
    WHERE is_active = true
  );
```

詳細は [db-schema.ts](web/src/features/jimu-jigyo/shared/types/db-schema.ts) の `getYearsToDelete()` 参照。

---

## トラブルシューティング

### Q. インポート時に「File not found」エラー

**A.** JSONファイルが正しいディレクトリにあるか確認。

```bash
ls -la web/src/features/jimu-jigyo/server/data/
# jimu-jigyo-r6-*.json が 11ファイル存在すること
```

### Q. マッチングに失敗した事業がある

**A.** `jimu_jigyo_matching_logs` で確認。確信度が低い場合は手動で修正。

```sql
SELECT * FROM jimu_jigyo_matching_logs
WHERE match_score < 80
ORDER BY match_score;
```

### Q. 予算データが NULL になった

**A.** JSONの構造が年度により異なる可能性。スクリプトログで確認。

```bash
# スクリプト実行時のログを確認
grep "budget" import-r6-data.log
```

---

## 設計書との対応

詳細はこちらを参照：

- [事務事業評価複数年度DB化設計書](docs/20260603_0700_事務事業評価複数年度DB化設計書.md)
  - スキーマ詳細
  - データ取込戦略
  - API・UI仕様例

---

## 次のステップ

1. **✅ DB構築** → マイグレーション適用
2. **→ 📊 R6データのDB化** → `pnpm run seed:jimu-jigyo:import-r6`
3. **→ 📊 R5データの統合** → `pnpm run seed:jimu-jigyo:import-r5`
4. **→ 📋 検証** → クエリで推移データが取得できることを確認
5. **→ 🎨 UI実装** → 推移分析画面の作成
6. **→ 📦 R4～R2の取込スクリプト作成** → スクレイピング等

---

## 参考リンク

- 福岡市事務事業点検: https://www.city.fukuoka.lg.jp/soki/s_teisu/shisei/jimujigyoutennkenn.html
- 既存JSONスキーマ: `web/src/features/jimu-jigyo/shared/types/jimu-jigyo.ts`
- DB型定義: `web/src/features/jimu-jigyo/shared/types/db-schema.ts`

---

**作成日**: 2026-06-03  
**バージョン**: 1.0  
**ステータス**: 実装準備完了（Phase 1-3 スクリプト完成）
