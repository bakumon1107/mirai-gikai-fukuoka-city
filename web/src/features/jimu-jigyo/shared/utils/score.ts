import type {
  Grade,
  JimuJigyoData,
  KpiAchievement,
  KpiItem,
  ScoreBreakdown,
  ScoreResult,
} from "../types/jimu-jigyo";
import { getCurrentBudget, getPrevBudget } from "./budget-accessor";

// 「調査未実施」は定期調査年でないだけで評価対象外（ペナルティなし）
const MISSING_VALUES = ["集計中", "─", "設定なし", "-"];

function isMissing(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return MISSING_VALUES.includes(val.trim());
  return false;
}

/** 調査未実施: 定期調査年でないだけなのでスコアには影響させない */
function isScheduledSurveyAbsent(val: unknown): boolean {
  if (typeof val === "string") return val.trim() === "調査未実施";
  return false;
}

/** 達成率文字列 "87.0%" → 87.0（数値）にパース。失敗時 null */
function parseAchievementRate(rateStr: string | undefined): number | null {
  if (!rateStr) return null;
  const n = Number.parseFloat(rateStr.replace("%", "").trim());
  return Number.isNaN(n) ? null : n;
}

// ─── 成果KPIスコア（0〜1） ───────────────────────────────────

function calcKpiItemCoeff(kpi: KpiItem, year: "R6"): number {
  const actual = kpi.実績?.[year];
  const target = kpi.目標?.[year];

  if (isScheduledSurveyAbsent(actual)) return 0.5;
  if (isMissing(actual)) return 0.1;
  if (isMissing(target) || target === null || target === undefined) return 0.5;

  const t = Number(target);
  const a = Number(actual);
  if (Number.isNaN(t) || Number.isNaN(a) || t === 0) return 0.5;

  const rate = a / t;
  if (rate >= 1.5) return 0.8;
  if (rate >= 1.0) return 1.0;
  if (rate >= 0.8) return 0.7;
  if (rate >= 0.6) return 0.4;
  return 0.1;
}

export function calcKpiScore(kpis: KpiItem[] | undefined): number {
  if (!kpis || kpis.length === 0) return 0.5;
  const coeffs = kpis.map((k) => calcKpiItemCoeff(k, "R6"));
  return coeffs.reduce((a, b) => a + b, 0) / coeffs.length;
}

// ─── 改善トレンドスコア（0〜1） ─────────────────────────────

export function calcTrendScore(data: JimuJigyoData): number {
  const kpis = data.指標?.成果指標;
  if (!kpis || kpis.length === 0) return 0.5;

  const primary = kpis[0];
  const r5 = primary.実績?.R5;
  const r6 = primary.実績?.R6;

  if (isMissing(r5) || isMissing(r6)) return 0.5;

  const r5n = Number(r5);
  const r6n = Number(r6);
  if (Number.isNaN(r5n) || Number.isNaN(r6n) || r5n === 0) return 0.5;

  const change = (r6n - r5n) / r5n;
  if (change >= 0.1) return 1.0;
  if (change >= 0) return 20 / 30;
  if (change >= -0.1) return 10 / 30;
  return 0;
}

// ─── 透明性スコア（0〜1）※ 最大10点に対応 ───────────────────

export function calcTransparencyScore(data: JimuJigyoData): number {
  let deduction = 0;
  const kpis = data.指標?.成果指標 ?? [];

  if (kpis.some((k) => isMissing(k.目標?.R6))) deduction += 5;

  const primaryKpi = kpis[0];
  if (primaryKpi) {
    const r6actual = primaryKpi.実績?.R6;
    if (!isScheduledSurveyAbsent(r6actual) && isMissing(r6actual))
      deduction += 5;
  }

  const allKpis = [...(data.指標?.活動指標 ?? []), ...kpis];
  const missingRateCount = allKpis.filter((k) => {
    const r = k.達成率?.R6;
    return !r || ["─", "設定なし", "-"].includes(r.trim());
  }).length;
  if (missingRateCount >= 2) deduction += 5;

  if (
    allKpis.some(
      (k) => k.目標?.最終年度 === "R年度" || k.目標?.最終年度 === null
    )
  )
    deduction += 3;

  return Math.max(0, 20 - deduction) / 20;
}

// ─── 予算効率スコア（0〜1）※ 最大20点に対応 ─────────────────

/**
 * コスト効率 = 全成果指標の達成率平均（%） ÷ 歳出（千円）
 * R5→R6 でこの効率がどれだけ改善したかで評価する。
 * 達成率データがない場合は予算変化量でフォールバック。
 */
export function calcBudgetScore(
  data: JimuJigyoData,
  year: string = "r6"
): number {
  const prevBudget = getPrevBudget(data, year)?.歳出;
  const currBudget = getCurrentBudget(data, year)?.歳出;

  if (!prevBudget || !currBudget || prevBudget === 0) return 0.5;

  const kpis = data.指標?.成果指標 ?? [];
  const yearNum = Number(year.replace(/^r/i, "")); // "r6" → 6
  const prevKey = `R${yearNum - 1}` as keyof KpiAchievement;
  const currKey = `R${yearNum}` as keyof KpiAchievement;

  // 同一KPIに前年・当年の達成率が両方ある組み合わせのみ比較
  const paired = kpis
    .map((k) => ({
      prev: parseAchievementRate(k.達成率?.[prevKey]),
      curr: parseAchievementRate(k.達成率?.[currKey]),
    }))
    .filter(
      (p): p is { prev: number; curr: number } =>
        p.prev !== null && p.curr !== null
    );

  if (paired.length > 0) {
    const r5AvgRate = paired.reduce((a, p) => a + p.prev, 0) / paired.length;
    const r6AvgRate = paired.reduce((a, p) => a + p.curr, 0) / paired.length;

    if (r5AvgRate > 0 && prevBudget > 0 && currBudget > 0) {
      const r5Efficiency = r5AvgRate / prevBudget;
      const r6Efficiency = r6AvgRate / currBudget;
      const efficiencyChange = (r6Efficiency - r5Efficiency) / r5Efficiency;

      if (efficiencyChange >= 0.1) return 1.0;
      if (efficiencyChange >= 0) return 0.75;
      if (efficiencyChange >= -0.1) return 0.5;
      return 0;
    }
  }

  // フォールバック: 予算変化量のみで評価
  const budgetChange = (currBudget - prevBudget) / prevBudget;
  if (budgetChange <= 0.05) return 0.75;
  if (budgetChange <= 0.3) return 0.5;
  return 0.25;
}

// ─── コスト効率サマリー（詳細ページ表示用） ─────────────────

export type KpiEfficiency = {
  label: string;
  r5Rate: number | null;
  r6Rate: number | null;
  r5Budget: number | null;
  r6Budget: number | null;
  efficiencyChangeRate: number | null; // null = 計算不能
};

export function calcKpiEfficiencies(
  data: JimuJigyoData,
  year: string = "r6"
): KpiEfficiency[] {
  const kpis = data.指標?.成果指標 ?? [];
  const prevBudget = getPrevBudget(data, year)?.歳出 ?? null;
  const currBudget = getCurrentBudget(data, year)?.歳出 ?? null;

  return kpis.map((kpi) => {
    const r5Rate = parseAchievementRate(kpi.達成率?.R5);
    const r6Rate = parseAchievementRate(kpi.達成率?.R6);

    let efficiencyChangeRate: number | null = null;
    if (
      r5Rate !== null &&
      r6Rate !== null &&
      prevBudget !== null &&
      currBudget !== null &&
      prevBudget > 0 &&
      currBudget > 0
    ) {
      const r5Eff = r5Rate / prevBudget;
      const r6Eff = r6Rate / currBudget;
      if (r5Eff > 0) {
        efficiencyChangeRate = (r6Eff - r5Eff) / r5Eff;
      }
    }

    return {
      label: kpi.内容,
      r5Rate,
      r6Rate,
      r5Budget: prevBudget,
      r6Budget: currBudget,
      efficiencyChangeRate,
    };
  });
}

// ─── 総合スコア ───────────────────────────────────────────────

function scoreToGrade(score: number): Grade {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

/**
 * スコア配分（合計100点）:
 *   成果KPI達成  40点
 *   改善トレンド 30点
 *   透明性       10点
 *   予算効率     20点
 */
export function calcScore(
  data: JimuJigyoData,
  year: string = "r6"
): ScoreResult {
  const kpiCoeff = calcKpiScore(data.指標?.成果指標);
  const trendCoeff = calcTrendScore(data);
  const transparencyCoeff = calcTransparencyScore(data);
  const budgetCoeff = calcBudgetScore(data, year);

  const kpiScore = kpiCoeff * 40;
  const trendScore = trendCoeff * 30;
  const transparencyScore = transparencyCoeff * 10; // 10点満点に変更
  const budgetScore = budgetCoeff * 20; // 20点満点に変更

  const total = kpiScore + trendScore + transparencyScore + budgetScore;
  const rounded = Math.round(total);

  const breakdown: ScoreBreakdown = {
    kpiScore: Math.round(kpiScore),
    trendScore: Math.round(trendScore),
    transparencyScore: Math.round(transparencyScore),
    budgetScore: Math.round(budgetScore),
  };

  return {
    score: rounded,
    grade: scoreToGrade(rounded),
    breakdown,
  };
}

export function slugify(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .toLowerCase();
}
