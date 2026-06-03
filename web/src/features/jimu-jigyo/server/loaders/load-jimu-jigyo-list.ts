import "server-only";
import type {
  JimuJigyoData,
  JimuJigyoRecord,
} from "../../shared/types/jimu-jigyo";
import { analyzeJimuJigyo } from "../../shared/utils/analysis";
import { slugify } from "../../shared/utils/score";
import { getCurrentBudget } from "../../shared/utils/budget-accessor";
import r6Fukushi from "../data/jimu-jigyo-r6-fukushi.json";
import r6Hoken from "../data/jimu-jigyo-r6-hoken.json";
import r6Juto from "../data/jimu-jigyo-r6-juto.json";
import r6Kankyo from "../data/jimu-jigyo-r6-kankyo.json";
import r6Keizai from "../data/jimu-jigyo-r6-keizai.json";
import r6Kodomo from "../data/jimu-jigyo-r6-kodomo.json";
import r6Kouwan from "../data/jimu-jigyo-r6-kouwan.json";
import r6Kyouiku from "../data/jimu-jigyo-r6-kyouiku.json";
import r6Nousui from "../data/jimu-jigyo-r6-nousui.json";
import r6Shimin from "../data/jimu-jigyo-r6-shimin.json";
import r6Somu from "../data/jimu-jigyo-r6-somu.json";

// 年度メタデータ: 新年度追加時はここだけ変更する
export const YEAR_METADATA = [
  {
    slug: "r6",
    label: "令和6年度（2024年度）",
    description: "74事業の執行状況を分析",
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

// JSON データを静的 import でバンドル（Vercel ランタイムで fs は使えないため）
const STATIC_DATA: Record<JimuJigyoYear, unknown[]> = {
  r6: [
    ...r6Fukushi,
    ...r6Hoken,
    ...r6Juto,
    ...r6Kankyo,
    ...r6Keizai,
    ...r6Kodomo,
    ...r6Kouwan,
    ...r6Kyouiku,
    ...r6Nousui,
    ...r6Shimin,
    ...r6Somu,
  ],
};

function sanitizeRecord(raw: unknown): JimuJigyoData | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.事業名 !== "string" || !r.事業名) return null;
  if (typeof r.所管局 !== "string" || !r.所管局) return null;
  if (typeof r.所管課 !== "string" || !r.所管課) return null;
  return r as unknown as JimuJigyoData;
}

function toRecord(data: JimuJigyoData, year: JimuJigyoYear): JimuJigyoRecord {
  return {
    ...data,
    id: slugify(data.事業名),
    analysis: analyzeJimuJigyo(data, year),
  };
}

const cache = new Map<JimuJigyoYear, JimuJigyoRecord[]>();

export async function loadJimuJigyoList(
  year: JimuJigyoYear
): Promise<JimuJigyoRecord[]> {
  if (cache.has(year)) return cache.get(year)!;
  const raw = STATIC_DATA[year] ?? [];
  const records = raw
    .map(sanitizeRecord)
    .filter((r): r is JimuJigyoData => r !== null)
    .map((d) => toRecord(d, year));
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
