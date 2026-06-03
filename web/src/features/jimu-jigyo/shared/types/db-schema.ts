/**
 * DB化した事務事業評価データの型定義
 * ファイル場所: web/src/features/jimu-jigyo/shared/types/db-schema.ts
 */

// ─────────────────────────────────────────────────────────────
// テーブルエンティティ型
// ─────────────────────────────────────────────────────────────

/**
 * jimu_jigyo_items テーブルのロー型
 */
export interface JimuJigyoItem {
  id: string;
  item_code: string;
  item_name: string;
  bureau_code: string;
  bureau_name: string;
  department_code: string;
  department_name: string;
  start_fiscal_year?: string | null;
  root_law?: string | null;
  administrative_plan?: string | null;
  establishment_trigger?: string | null;
  target_description?: string | null;
  target_goal_state?: string | null;
  implementation_content?: string | null;
  achievement_criteria?: string | null;
  activity_output?: string | null;
  result_output?: string | null;
  intermediate_outcome?: string | null;
  final_outcome?: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

/**
 * jimu_jigyo_fiscal_years テーブルのロー型
 */
export interface JimuJigyoFiscalYear {
  id: string;
  item_id: string;
  fiscal_year: number;
  expenditure_amount?: number | null;
  expenditure_type?: string | null;
  specific_revenue?: number | null;
  general_revenue?: number | null;
  next_year_budget?: number | null;
  basic_plan_data?: Record<string, any> | null;
  administrative_plan_data?: Record<string, any> | null;
  data_source?: string | null;
  imported_at: string;
  imported_by?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * jimu_jigyo_kpi_items テーブルのロー型
 */
export interface JimuJigyoKpiItem {
  id: string;
  item_id: string;
  kpi_type_id: string;
  kpi_name: string;
  kpi_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * jimu_jigyo_kpi_results テーブルのロー型
 */
export interface JimuJigyoKpiResult {
  id: string;
  kpi_item_id: string;
  fiscal_year: number;
  target_value?: string | null;
  actual_value?: string | null;
  achievement_rate?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * jimu_jigyo_kpi_targets テーブルのロー型
 */
export interface JimuJigyoKpiTarget {
  id: string;
  kpi_item_id: string;
  target_fiscal_year: number;
  target_value: string;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────
// ビジネスロジック用の結合型
// ─────────────────────────────────────────────────────────────

/**
 * 事業の詳細情報（基本情報 + 複数年度のデータ）
 */
export interface JimuJigyoDetail extends JimuJigyoItem {
  fiscal_years: JimuJigyoFiscalYearDetail[];
  kpi_items: JimuJigyoKpiItemDetail[];
}

/**
 * 年度別データ（KPI結果を含む）
 */
export interface JimuJigyoFiscalYearDetail extends JimuJigyoFiscalYear {
  kpi_results: JimuJigyoKpiResultDetail[];
}

/**
 * KPI指標詳細（年度別結果を含む）
 */
export interface JimuJigyoKpiItemDetail extends JimuJigyoKpiItem {
  kpi_type_code: string;
  kpi_type_name: string;
  results: JimuJigyoKpiResultDetail[];
  targets: JimuJigyoKpiTarget[];
}

/**
 * KPI結果詳細
 */
export interface JimuJigyoKpiResultDetail extends JimuJigyoKpiResult {
  target_value_parsed?: number | string | null;
  actual_value_parsed?: number | string | null;
  achievement_rate_parsed?: number | null;
}

// ─────────────────────────────────────────────────────────────
// 推移分析用の集約型
// ─────────────────────────────────────────────────────────────

/**
 * 予算推移データ
 */
export interface BudgetTimeline {
  fiscal_year: number;
  expenditure_amount: number;
  specific_revenue: number;
  general_revenue: number;
  change_rate_percent?: number | null;
  prev_year_amount?: number | null;
}

/**
 * KPI推移データ（1指標の複数年度結果）
 */
export interface KpiTimeline {
  kpi_name: string;
  kpi_type: "activity" | "achievement";
  results: {
    fiscal_year: number;
    target_value?: string | null;
    actual_value?: string | null;
    achievement_rate?: string | null;
  }[];
}

/**
 * 事業の推移分析結果
 */
export interface JimuJigyoTimlineAnalysis {
  item: JimuJigyoItem;
  budget_timeline: BudgetTimeline[];
  kpi_timelines: KpiTimeline[];
  available_fiscal_years: number[];
}

// ─────────────────────────────────────────────────────────────
// 検索・フィルタリング用型
// ─────────────────────────────────────────────────────────────

/**
 * 検索条件
 */
export interface JimuJigyoSearchQuery {
  keyword?: string;
  bureau_code?: string;
  fiscal_year?: number;
  limit?: number;
  offset?: number;
}

/**
 * 検索結果
 */
export interface JimuJigyoSearchResult {
  items: JimuJigyoItem[];
  total_count: number;
  has_more: boolean;
}

// ─────────────────────────────────────────────────────────────
// 取込・マッチング用型
// ─────────────────────────────────────────────────────────────

/**
 * インポートログ
 */
export interface JimuJigyoImportLog {
  id: string;
  fiscal_year: number;
  source_type: "json" | "scrape" | "pdf" | "manual";
  source_url?: string | null;
  total_items_processed?: number | null;
  total_items_inserted?: number | null;
  total_items_updated?: number | null;
  status: "pending" | "completed" | "failed";
  error_message?: string | null;
  imported_by?: string | null;
  imported_at: string;
}

/**
 * マッチングログ
 */
export interface JimuJigyoMatchingLog {
  id: string;
  fiscal_year: number;
  item_id: string;
  source_item_name: string;
  source_bureau_code: string;
  source_department_name: string;
  match_score: number;
  match_method: "exact" | "partial" | "similarity" | "manual";
  matched_at: string;
  matched_by?: string | null;
}

// ─────────────────────────────────────────────────────────────
// API レスポンス型
// ─────────────────────────────────────────────────────────────

/**
 * 統計情報のレスポンス
 */
export interface JimuJigyoStatistics {
  fiscal_year: number;
  total_items: number;
  total_budget: number;
  avg_achievement_rate: number;
  bureau_breakdown: {
    bureau_code: string;
    bureau_name: string;
    item_count: number;
    total_budget: number;
  }[];
}

/**
 * 部局別一覧のレスポンス
 */
export interface JimuJigyoBureauList {
  bureau: string;
  items: JimuJigyoItem[];
  count: number;
}

/**
 * ローリングウィンドウ制御用型
 * 常に最新5年間のデータを保持
 */
export interface FinancialYearWindow {
  min_fiscal_year: number; // 最も古い年度
  max_fiscal_year: number; // 最も新しい年度
  window_size: number; // 常に5
}

export const FISCAL_YEAR_WINDOW_SIZE = 5;

/**
 * 翌年度データ取込時のローリングウィンドウ制御
 * 例: 令和7年度データ取込時、令和2年度データを削除
 */
export function getYearsToDelete(newFiscalYear: number): number[] {
  const yearsToDelete: number[] = [];
  const oldestYearToKeep = newFiscalYear - (FISCAL_YEAR_WINDOW_SIZE - 1);

  // 既存のデータから対象年度より古い年度を削除
  for (let year = 2020; year < oldestYearToKeep; year++) {
    yearsToDelete.push(year);
  }

  return yearsToDelete;
}
