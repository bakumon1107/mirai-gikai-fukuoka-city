import type { Database } from "@mirai-gikai/supabase";

// ─────────────────────────────────────────────────────────────
// テーブルロー型（Supabase 生成型から派生）
// ─────────────────────────────────────────────────────────────

export type JimuJigyoItem =
  Database["public"]["Tables"]["jimu_jigyo_items"]["Row"];
export type JimuJigyoFiscalYear =
  Database["public"]["Tables"]["jimu_jigyo_fiscal_years"]["Row"];
export type JimuJigyoKpiItem =
  Database["public"]["Tables"]["jimu_jigyo_kpi_items"]["Row"];
export type JimuJigyoKpiResult =
  Database["public"]["Tables"]["jimu_jigyo_kpi_results"]["Row"];
export type JimuJigyoKpiTarget =
  Database["public"]["Tables"]["jimu_jigyo_kpi_targets"]["Row"];
export type JimuJigyoImportLog =
  Database["public"]["Tables"]["jimu_jigyo_import_logs"]["Row"];
export type JimuJigyoMatchingLog =
  Database["public"]["Tables"]["jimu_jigyo_matching_logs"]["Row"];

// ─────────────────────────────────────────────────────────────
// ビジネスロジック用の結合型
// ─────────────────────────────────────────────────────────────

export interface JimuJigyoDetail extends JimuJigyoItem {
  fiscal_years: JimuJigyoFiscalYearDetail[];
  kpi_items: JimuJigyoKpiItemDetail[];
}

export interface JimuJigyoFiscalYearDetail extends JimuJigyoFiscalYear {
  kpi_results: JimuJigyoKpiResultDetail[];
}

export interface JimuJigyoKpiItemDetail extends JimuJigyoKpiItem {
  kpi_type_code: string;
  kpi_type_name: string;
  results: JimuJigyoKpiResultDetail[];
  targets: JimuJigyoKpiTarget[];
}

export interface JimuJigyoKpiResultDetail extends JimuJigyoKpiResult {
  target_value_parsed?: number | string | null;
  actual_value_parsed?: number | string | null;
  achievement_rate_parsed?: number | null;
}

// ─────────────────────────────────────────────────────────────
// 推移分析用の集約型
// ─────────────────────────────────────────────────────────────

export interface BudgetTimeline {
  fiscal_year: number;
  expenditure_amount: number;
  specific_revenue: number;
  general_revenue: number;
  change_rate_percent?: number | null;
  prev_year_amount?: number | null;
}

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

export interface JimuJigyoTimlineAnalysis {
  item: JimuJigyoItem;
  budget_timeline: BudgetTimeline[];
  kpi_timelines: KpiTimeline[];
  available_fiscal_years: number[];
}

// ─────────────────────────────────────────────────────────────
// 検索・フィルタリング用型
// ─────────────────────────────────────────────────────────────

export interface JimuJigyoSearchQuery {
  keyword?: string;
  bureau_code?: string;
  fiscal_year?: number;
  limit?: number;
  offset?: number;
}

export interface JimuJigyoSearchResult {
  items: JimuJigyoItem[];
  total_count: number;
  has_more: boolean;
}

// ─────────────────────────────────────────────────────────────
// API レスポンス型
// ─────────────────────────────────────────────────────────────

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

export interface JimuJigyoBureauList {
  bureau: string;
  items: JimuJigyoItem[];
  count: number;
}

// ─────────────────────────────────────────────────────────────
// ローリングウィンドウ制御
// ─────────────────────────────────────────────────────────────

export interface FinancialYearWindow {
  min_fiscal_year: number;
  max_fiscal_year: number;
  window_size: number;
}

export const FISCAL_YEAR_WINDOW_SIZE = 5;

export function getYearsToDelete(newFiscalYear: number): number[] {
  const yearsToDelete: number[] = [];
  const oldestYearToKeep = newFiscalYear - (FISCAL_YEAR_WINDOW_SIZE - 1);
  for (let year = 2020; year < oldestYearToKeep; year++) {
    yearsToDelete.push(year);
  }
  return yearsToDelete;
}
