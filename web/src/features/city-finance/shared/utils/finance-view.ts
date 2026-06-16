/** 整形済み財政データ → 画面表示用ビューモデル（純粋関数） */
import type {
  CompositionItem,
  FinanceData,
  FinanceSeries,
  RevenueKind,
  YearValue,
} from "../types";
import {
  alignSeries,
  classifyRevenue,
  findSeries,
  isTotalRow,
  latestYear,
  perCapitaYen,
  toLatestComposition,
  valueForYear,
  withShares,
  yoyPct,
} from "./finance-analysis";
import {
  buildExpenditureCommentary,
  buildPopulationCommentary,
  buildRevenueCommentary,
} from "./finance-commentary";
import { thousandYenToYen } from "./finance-format";

/** 指標系列リストから指定指標の最新値を取得 */
function latestIndicator(
  indicators: FinanceSeries[] | undefined,
  name: string
): number | null {
  const s = indicators?.find((i) => i.item === name);
  if (!s || s.values.length === 0) return null;
  return [...s.values].sort((a, b) => b.year - a.year)[0].value;
}

/** 民生費の1人あたり（円）推移を作る */
function buildPerCapitaWelfare(
  data: FinanceData,
  years: number[]
): YearValue[] | null {
  const minsei = data.expenditure.find((s) => s.item === "民生費");
  if (!minsei || !data.population) return null;
  const popMap = new Map(data.population.map((p) => [p.year, p.value]));
  const out: YearValue[] = [];
  for (const year of years) {
    const v = valueForYear(minsei, year);
    const pop = popMap.get(year);
    if (v !== null && pop) {
      out.push({ year, value: thousandYenToYen(v) / pop });
    }
  }
  return out.length ? out : null;
}

export type RevenueCompositionItem = CompositionItem & { kind: RevenueKind };

/** 折れ線チャート用の系列（値は億円） */
export type TrendSeries = { name: string; values: YearValue[] };

export type CityFinanceView = {
  hasData: boolean;
  source: FinanceData["source"];
  years: number[];
  latestYear: number | null;
  /** 円 */
  revenueTotalYen: number | null;
  expenditureTotalYen: number | null;
  revenueYoyPct: number | null;
  population: number | null;
  /** 1人あたり歳出（円） */
  perCapitaExpenditureYen: number | null;
  /** 最新年度の歳入構成（円・構成比・区分） */
  revenueComposition: RevenueCompositionItem[];
  /** 自主財源比率（%） */
  selfPct: number | null;
  /** 依存財源比率（%） */
  dependentPct: number | null;
  /** 最新年度の歳出目的別構成 */
  expenditureComposition: CompositionItem[];
  /** 収入構造の推移（自主財源/依存財源・億円） */
  revenueTrend: TrendSeries[];
  /** 主要財源の推移（上位5＋その他・億円, 積み上げ用） */
  revenueSourceTrend: TrendSeries[];
  /** 歳出目的別の推移（億円・全項目） */
  expenditureTrend: TrendSeries[];
  /** 歳出目的別の推移（上位6＋その他・億円, 積み上げ用） */
  expenditureStackedTrend: TrendSeries[];
  /** 人口推移（人） */
  populationTrend: YearValue[] | null;
  /** 1人あたり歳出の推移（円） */
  perCapitaTrend: YearValue[] | null;
  /** 1人あたり民生費（福祉）の推移（円） */
  perCapitaWelfareTrend: YearValue[] | null;
  /** 高齢化率（65歳以上比率・%）の推移 */
  agingTrend: YearValue[] | null;
  /** 歳入（収入構造）の分析コメント */
  revenueCommentary: string[];
  /** 歳出（使いみち）の分析コメント */
  expenditureCommentary: string[];
  /** 人口と財政の分析コメント */
  populationCommentary: string[];
};

const REVENUE_TOTAL = /歳入(総額|合計)/;
const EXPENDITURE_TOTAL = /歳出(総額|合計)/;

function toOkuValues(values: YearValue[]): YearValue[] {
  return values.map((v) => ({
    year: v.year,
    value: thousandYenToYen(v.value) / 100_000_000,
  }));
}

/**
 * 系列リストを「最新年度の大きい順 上位topN ＋ その他」の積み上げ用系列（億円）に変換。
 * 合計行は除外。色かぶり回避と「何が増減したか」の把握に使う。
 */
function buildStackedTrend(
  list: FinanceSeries[],
  years: number[],
  topN: number,
  latest: number
): TrendSeries[] {
  const ranked = list
    .filter((s) => !isTotalRow(s.item))
    .map((s) => ({ series: s, latestVal: valueForYear(s, latest) ?? 0 }))
    .sort((a, b) => b.latestVal - a.latestVal);
  const top = ranked.slice(0, topN);
  const rest = ranked.slice(topN);
  const result: TrendSeries[] = top.map((t) => ({
    name: t.series.item,
    values: toOkuValues(alignSeries(t.series, years)),
  }));
  if (rest.length > 0) {
    result.push({
      name: "その他",
      values: years.map((year) => ({
        year,
        value: rest.reduce(
          (s, r) =>
            s +
            thousandYenToYen(valueForYear(r.series, year) ?? 0) / 100_000_000,
          0
        ),
      })),
    });
  }
  return result;
}

/** 千円系列の指定年度合計（合計行除外）を円で返す */
function sumComposition(items: { label: string; amount: number }[]): number {
  return thousandYenToYen(items.reduce((s, i) => s + i.amount, 0));
}

export function buildFinanceView(data: FinanceData): CityFinanceView {
  const years = [...data.years].sort((a, b) => a - b);
  const ly = latestYear(years);
  const prevYear = ly !== null ? (years[years.indexOf(ly) - 1] ?? null) : null;
  const empty: CityFinanceView = {
    hasData: false,
    source: data.source,
    years,
    latestYear: ly,
    revenueTotalYen: null,
    expenditureTotalYen: null,
    revenueYoyPct: null,
    population: null,
    perCapitaExpenditureYen: null,
    revenueComposition: [],
    selfPct: null,
    dependentPct: null,
    expenditureComposition: [],
    revenueTrend: [],
    revenueSourceTrend: [],
    expenditureTrend: [],
    expenditureStackedTrend: [],
    populationTrend: null,
    perCapitaTrend: null,
    perCapitaWelfareTrend: null,
    agingTrend: null,
    revenueCommentary: [],
    expenditureCommentary: [],
    populationCommentary: [],
  };
  if (ly === null) return empty;

  // --- 総額（円） ---
  const revTotalSeries = findSeries(data.generalAccount, REVENUE_TOTAL);
  const expTotalSeries =
    findSeries(data.generalAccount, EXPENDITURE_TOTAL) ??
    findSeries(data.expenditure, /(歳出合計|総額|合計)/);

  const revLatestComp = toLatestComposition(data.revenue, ly);
  const expLatestComp = toLatestComposition(data.expenditure, ly);

  const revenueTotalFromSeries = revTotalSeries
    ? thousandYenToYen(valueForYear(revTotalSeries, ly) ?? 0)
    : null;
  const revenueTotalYenResolved =
    revenueTotalFromSeries ??
    (revLatestComp.length ? sumComposition(revLatestComp) : null);

  const expenditureTotalFromSeries = expTotalSeries
    ? thousandYenToYen(valueForYear(expTotalSeries, ly) ?? 0)
    : null;
  const expenditureTotalYenResolved =
    expenditureTotalFromSeries ??
    (expLatestComp.length ? sumComposition(expLatestComp) : null);

  // --- 前年比（歳入総額） ---
  const revPrevYen =
    revTotalSeries && prevYear !== null
      ? thousandYenToYen(valueForYear(revTotalSeries, prevYear) ?? 0)
      : null;
  const revenueYoyPct = yoyPct(revPrevYen, revenueTotalYenResolved);

  // --- 人口・1人あたり ---
  const population = data.population?.find((v) => v.year === ly)?.value ?? null;
  const perCapitaExpenditureYen = perCapitaYen(
    expenditureTotalYenResolved,
    population
  );

  // --- 構成（最新年度） ---
  const revenueComposition: RevenueCompositionItem[] = withShares(
    revLatestComp.map((i) => ({
      label: i.label,
      amount: thousandYenToYen(i.amount),
    }))
  ).map((c) => ({ ...c, kind: classifyRevenue(c.label) }));

  const selfPct = sumPctByKind(revenueComposition, "self");
  const dependentPct = sumPctByKind(revenueComposition, "dependent");

  const expenditureComposition = withShares(
    expLatestComp.map((i) => ({
      label: i.label,
      amount: thousandYenToYen(i.amount),
    }))
  );

  // --- 推移（億円） ---
  const revenueTrend = buildRevenueTrend(data, years);
  const revenueSourceTrend = buildStackedTrend(data.revenue, years, 5, ly);
  const expenditureTrend = data.expenditure
    .filter((s) => !/(合計|総額)/.test(s.item))
    .map((s) => ({ name: s.item, values: toOkuValues(alignSeries(s, years)) }));
  const expenditureStackedTrend = buildStackedTrend(
    data.expenditure,
    years,
    6,
    ly
  );

  // --- 人口・1人あたりの推移 ---
  const populationTrend = data.population
    ? [...data.population].sort((a, b) => a.year - b.year)
    : null;
  const perCapitaTrend = expTotalSeries
    ? buildPerCapitaTrend(expTotalSeries.values, data.population, years)
    : null;
  const perCapitaWelfareTrend = buildPerCapitaWelfare(data, years);
  const agingTrend = data.agingRate?.length
    ? [...data.agingRate].sort((a, b) => a.year - b.year)
    : null;

  // --- 分析コメント ---
  const zaiseiRyoku = latestIndicator(data.indicators, "財政力指数");
  const shoraiFutan = latestIndicator(data.indicators, "将来負担比率");
  const firstYear = years[0];
  const pcFirst = (t: YearValue[] | null) =>
    t?.find((v) => v.year === firstYear)?.value ?? null;
  const pcLast = (t: YearValue[] | null) =>
    t?.find((v) => v.year === ly)?.value ?? null;
  const revenueCommentary = buildRevenueCommentary(data, selfPct, zaiseiRyoku);
  const expenditureCommentary = buildExpenditureCommentary(
    data,
    expenditureTotalYenResolved,
    shoraiFutan
  );
  const populationCommentary = buildPopulationCommentary(
    data,
    { first: pcFirst(perCapitaTrend), last: pcLast(perCapitaTrend) },
    {
      first: pcFirst(perCapitaWelfareTrend),
      last: pcLast(perCapitaWelfareTrend),
    }
  );

  return {
    hasData: true,
    source: data.source,
    years,
    latestYear: ly,
    revenueTotalYen: revenueTotalYenResolved,
    expenditureTotalYen: expenditureTotalYenResolved,
    revenueYoyPct,
    population,
    perCapitaExpenditureYen,
    revenueComposition,
    selfPct,
    dependentPct,
    expenditureComposition,
    revenueTrend,
    revenueSourceTrend,
    expenditureStackedTrend,
    expenditureTrend,
    populationTrend,
    perCapitaTrend,
    perCapitaWelfareTrend,
    agingTrend,
    revenueCommentary,
    expenditureCommentary,
    populationCommentary,
  };
}

function sumPctByKind(
  items: RevenueCompositionItem[],
  kind: RevenueKind
): number | null {
  const matched = items.filter((i) => i.kind === kind);
  if (matched.length === 0) return null;
  return matched.reduce((s, i) => s + i.pct, 0);
}

function buildRevenueTrend(data: FinanceData, years: number[]): TrendSeries[] {
  const self: YearValue[] = [];
  const dependent: YearValue[] = [];
  for (const year of years) {
    let s = 0;
    let d = 0;
    for (const series of data.revenue) {
      if (/(合計|総額)/.test(series.item)) continue;
      const v = valueForYear(series, year);
      if (v === null) continue;
      const kind = classifyRevenue(series.item);
      if (kind === "self") s += v;
      else if (kind === "dependent") d += v;
    }
    self.push({ year, value: thousandYenToYen(s) / 100_000_000 });
    dependent.push({ year, value: thousandYenToYen(d) / 100_000_000 });
  }
  return [
    { name: "自主財源", values: self },
    { name: "依存財源", values: dependent },
  ];
}

function buildPerCapitaTrend(
  expTotalValues: YearValue[],
  population: YearValue[] | null,
  years: number[]
): YearValue[] | null {
  if (!population) return null;
  const popMap = new Map(population.map((p) => [p.year, p.value]));
  const expMap = new Map(expTotalValues.map((e) => [e.year, e.value]));
  const out: YearValue[] = [];
  for (const year of years) {
    const exp = expMap.get(year);
    const pop = popMap.get(year);
    const pc = perCapitaYen(
      exp !== undefined ? thousandYenToYen(exp) : null,
      pop ?? null
    );
    if (pc !== null) out.push({ year, value: pc });
  }
  return out.length ? out : null;
}
