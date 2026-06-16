/** 財政データの分析・集計（純粋関数） */
import type {
  CompositionItem,
  FinanceSeries,
  RevenueKind,
  YearValue,
} from "../types";

/** 項目名が pattern に一致する最初の系列を返す（無ければ null） */
export function findSeries(
  list: FinanceSeries[],
  pattern: RegExp
): FinanceSeries | null {
  return list.find((s) => pattern.test(s.item)) ?? null;
}

/** 系列から指定年度の値を取得（無ければ null） */
export function valueForYear(
  series: FinanceSeries,
  year: number
): number | null {
  return series.values.find((v) => v.year === year)?.value ?? null;
}

/** 年度配列の最新年度 */
export function latestYear(years: number[]): number | null {
  return years.length ? Math.max(...years) : null;
}

/** 前年比（%）。prev が 0 / 無効なら null */
export function yoyPct(
  prev: number | null,
  curr: number | null
): number | null {
  if (prev === null || curr === null || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev)) * 100;
}

/** 1人あたり金額（円）。population が 0 / 無効なら null */
export function perCapitaYen(
  totalYen: number | null,
  population: number | null
): number | null {
  if (totalYen === null || population === null || population === 0) return null;
  return totalYen / population;
}

/**
 * 項目リストに構成比（%）を付与する。
 * 合計項目（合計・総額・歳出合計 等）は除外したうえで割合を計算する。
 */
export function withShares(
  items: { label: string; amount: number }[]
): CompositionItem[] {
  const total = items.reduce((s, i) => s + i.amount, 0);
  return items.map((i) => ({
    label: i.label,
    amount: i.amount,
    pct: total > 0 ? (i.amount / total) * 100 : 0,
  }));
}

const SELF_KEYWORDS = [
  "地方税",
  "市税",
  "使用料",
  "手数料",
  "財産収入",
  "寄附",
  "寄付",
  "繰入",
  "繰越",
  "諸収入",
  "分担金",
  "負担金",
];

const DEPENDENT_KEYWORDS = [
  "交付税",
  "交付金",
  "国庫",
  "県支出金",
  "都道府県支出金",
  "譲与税",
  "地方債",
  "特例交付金",
  "国・県",
];

/**
 * 歳入項目名を自主財源 / 依存財源 / その他 に分類する。
 * 「自分で集める財源」と「国・借入に頼る財源」の対比に使う。
 */
export function classifyRevenue(item: string): RevenueKind {
  if (DEPENDENT_KEYWORDS.some((k) => item.includes(k))) return "dependent";
  if (SELF_KEYWORDS.some((k) => item.includes(k))) return "self";
  return "other";
}

/** 合計・総額系の項目かどうか（構成比の分母から除外する用） */
export function isTotalRow(item: string): boolean {
  return /(合計|総額|総計|歳入合計|歳出合計)/.test(item);
}

/** 系列を最新年度の降順に並べた {label, amount} に変換（合計行は除外） */
export function toLatestComposition(
  seriesList: FinanceSeries[],
  year: number
): { label: string; amount: number }[] {
  return seriesList
    .filter((s) => !isTotalRow(s.item))
    .map((s) => ({ label: s.item, amount: valueForYear(s, year) ?? 0 }))
    .filter((i) => i.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

/** 系列を YearValue 配列にそろえる（折れ線用, 年度昇順） */
export function alignSeries(
  series: FinanceSeries,
  years: number[]
): YearValue[] {
  return [...years]
    .sort((a, b) => a - b)
    .map((year) => ({ year, value: valueForYear(series, year) ?? 0 }));
}
