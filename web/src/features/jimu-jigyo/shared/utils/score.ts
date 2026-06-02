import type {
  Grade,
  JimuJigyoData,
  KpiItem,
  ScoreBreakdown,
  ScoreResult,
} from "../types/jimu-jigyo";

const MISSING_VALUES = ["集計中", "調査未実施", "─", "設定なし", "-"];

function isMissing(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return MISSING_VALUES.includes(val.trim());
  return false;
}

// 成果指標1件あたりのスコア係数（0〜1）
function calcKpiItemCoeff(kpi: KpiItem, year: "R6"): number {
  const actual = kpi.実績?.[year];
  const target = kpi.目標?.[year];

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
  const avg = coeffs.reduce((a, b) => a + b, 0) / coeffs.length;
  return avg;
}

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

export function calcTransparencyScore(data: JimuJigyoData): number {
  let deduction = 0;
  const kpis = data.指標?.成果指標 ?? [];

  const hasUnsetTarget = kpis.some((k) => isMissing(k.目標?.R6));
  if (hasUnsetTarget) deduction += 5;

  const primaryKpi = kpis[0];
  if (primaryKpi) {
    const r6actual = primaryKpi.実績?.R6;
    if (isMissing(r6actual)) deduction += 5;
  }

  const allKpis = [...(data.指標?.活動指標 ?? []), ...kpis];
  const missingRateCount = allKpis.filter((k) => {
    const r6rate = k.達成率?.R6;
    return !r6rate || ["─", "設定なし", "-"].includes(r6rate.trim());
  }).length;
  if (missingRateCount >= 2) deduction += 5;

  const hasVagueGoal = allKpis.some(
    (k) => k.目標?.最終年度 === "R年度" || k.目標?.最終年度 === null
  );
  if (hasVagueGoal) deduction += 3;

  return Math.max(0, 20 - deduction) / 20;
}

export function calcBudgetScore(data: JimuJigyoData): number {
  const r5 = data.事業費_千円?.R5決算?.歳出;
  const r6 = data.事業費_千円?.R6決算見込?.歳出;

  if (!r5 || !r6 || r5 === 0) return 0.5;

  const change = (r6 - r5) / r5;
  if (change <= 0.05) return 1.0;
  if (change <= 0.3) return 0.5;
  return 0;
}

function scoreToGrade(score: number): Grade {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

export function calcScore(data: JimuJigyoData): ScoreResult {
  const kpiCoeff = calcKpiScore(data.指標?.成果指標);
  const trendCoeff = calcTrendScore(data);
  const transparencyCoeff = calcTransparencyScore(data);
  const budgetCoeff = calcBudgetScore(data);

  const kpiScore = kpiCoeff * 40;
  const trendScore = trendCoeff * 30;
  const transparencyScore = transparencyCoeff * 20;
  const budgetScore = budgetCoeff * 10;

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
