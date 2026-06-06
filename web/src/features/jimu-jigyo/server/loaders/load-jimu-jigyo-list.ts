import "server-only";
import { createAdminClient } from "@mirai-gikai/supabase";
import type {
  JimuJigyoAnalysis,
  JimuJigyoData,
  JimuJigyoRecord,
} from "../../shared/types/jimu-jigyo";
import { analyzeJimuJigyo } from "../../shared/utils/analysis";
import { getCurrentBudget } from "../../shared/utils/budget-accessor";

// 年度メタデータ: 新年度追加時はここだけ変更する
export const YEAR_METADATA = [
  {
    slug: "r6",
    label: "令和6年度（2024年度）",
    description: "74事業の執行状況を分析",
    fiscalYear: 2024,
  },
] as const;

export type JimuJigyoYear = (typeof YEAR_METADATA)[number]["slug"];

export const AVAILABLE_YEARS = YEAR_METADATA.map(
  (m) => m.slug
) as JimuJigyoYear[];

export function isValidYear(year: string): year is JimuJigyoYear {
  return (AVAILABLE_YEARS as string[]).includes(year);
}

export function getYearLabel(year: JimuJigyoYear): string {
  return (
    YEAR_METADATA.find((m) => m.slug === year)?.label ?? year.toUpperCase()
  );
}

function getFiscalYear(year: JimuJigyoYear): number {
  return YEAR_METADATA.find((m) => m.slug === year)?.fiscalYear ?? 2024;
}

const cache = new Map<JimuJigyoYear, JimuJigyoRecord[]>();

export async function loadJimuJigyoList(
  year: JimuJigyoYear
): Promise<JimuJigyoRecord[]> {
  if (cache.has(year)) return cache.get(year)!;

  const supabase = createAdminClient();
  const fiscalYear = getFiscalYear(year);

  // 当年度データを持つ items に絞り込む（年度フィルター）
  const { data: fyRows } = await supabase
    .from("jimu_jigyo_fiscal_years")
    .select("item_id, analysis_json")
    .eq("fiscal_year", fiscalYear);

  if (!fyRows || fyRows.length === 0) return [];

  const validItemIds = fyRows.map((f) => f.item_id);
  const analysisMap = new Map<string, JimuJigyoAnalysis>(
    fyRows
      .filter((f) => f.analysis_json != null)
      .map((f) => [f.item_id, f.analysis_json as JimuJigyoAnalysis])
  );

  const { data: items, error } = await supabase
    .from("jimu_jigyo_items")
    .select("id, slug, raw_data")
    .in("id", validItemIds)
    .not("raw_data", "is", null);

  if (error || !items) {
    console.error("Failed to load jimu_jigyo_items:", error?.message);
    return [];
  }

  const records: JimuJigyoRecord[] = items
    .map((item) => {
      const jimuData = item.raw_data as unknown as JimuJigyoData;
      const analysis =
        analysisMap.get(item.id) ?? analyzeJimuJigyo(jimuData, year);
      return { ...jimuData, id: item.slug ?? item.id, analysis };
    })
    .filter((r) => r.事業名);

  cache.set(year, records);
  return records;
}

export type DirectionSummary = {
  total: number;
  kpiUp: number;
  kpiDown: number;
  kpiFlat: number;
  kpiUnknown: number;
  budgetUp: number;
  budgetDown: number;
  efficiencyUp: number;
  efficiencyDown: number;
  totalBudgetManYen: number;
};

export async function getDirectionSummary(
  records: JimuJigyoRecord[],
  year: JimuJigyoYear
): Promise<DirectionSummary> {
  let totalBudget = 0;
  let kpiUp = 0,
    kpiDown = 0,
    kpiFlat = 0,
    kpiUnknown = 0;
  let budgetUp = 0,
    budgetDown = 0;
  let efficiencyUp = 0,
    efficiencyDown = 0;

  for (const r of records) {
    totalBudget += getCurrentBudget(r, year)?.歳出 ?? 0;
    const kd = r.analysis.kpi.direction;
    if (kd === "up") kpiUp++;
    else if (kd === "down") kpiDown++;
    else if (kd === "flat") kpiFlat++;
    else kpiUnknown++;

    if (r.analysis.budget.direction === "up") budgetUp++;
    else if (r.analysis.budget.direction === "down") budgetDown++;

    if (r.analysis.efficiency.direction === "up") efficiencyUp++;
    else if (r.analysis.efficiency.direction === "down") efficiencyDown++;
  }

  return {
    total: records.length,
    kpiUp,
    kpiDown,
    kpiFlat,
    kpiUnknown,
    budgetUp,
    budgetDown,
    efficiencyUp,
    efficiencyDown,
    totalBudgetManYen: Math.round(totalBudget / 100),
  };
}
