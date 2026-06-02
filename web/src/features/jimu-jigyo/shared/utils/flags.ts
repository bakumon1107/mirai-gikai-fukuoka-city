import type { JimuJigyoData, KpiItem, WatchdogFlag } from "../types/jimu-jigyo";

const MISSING_VALUES = ["集計中", "調査未実施", "─", "設定なし", "-"];

function isMissing(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return MISSING_VALUES.includes(val.trim());
  return false;
}

function hasLowTarget(kpis: KpiItem[]): { flagged: boolean; detail: string } {
  for (const kpi of kpis) {
    const target = kpi.目標?.R6;
    const actual = kpi.実績?.R6;
    if (isMissing(target) || isMissing(actual)) continue;
    const t = Number(target);
    const a = Number(actual);
    if (Number.isNaN(t) || Number.isNaN(a) || t === 0) continue;
    if (a / t >= 1.5) {
      return {
        flagged: true,
        detail: `「${kpi.内容}」目標:${t.toLocaleString()} → 実績:${a.toLocaleString()}（達成率${Math.round((a / t) * 100)}%）`,
      };
    }
  }
  return { flagged: false, detail: "" };
}

function hasMissingKpi(kpis: KpiItem[]): boolean {
  return kpis.some((k) => isMissing(k.目標?.R6));
}

function hasBudgetSurge(data: JimuJigyoData): {
  flagged: boolean;
  detail: string;
} {
  const r5 = data.事業費_千円?.R5決算?.歳出;
  const r6 = data.事業費_千円?.R6決算見込?.歳出;
  if (!r5 || !r6 || r5 === 0) return { flagged: false, detail: "" };
  const change = (r6 - r5) / r5;
  if (change > 0.3) {
    return {
      flagged: true,
      detail: `R5:${r5.toLocaleString()}千円 → R6:${r6.toLocaleString()}千円（+${Math.round(change * 100)}%増）`,
    };
  }
  return { flagged: false, detail: "" };
}

function hasDeclining(kpis: KpiItem[]): { flagged: boolean; detail: string } {
  if (kpis.length === 0) return { flagged: false, detail: "" };
  const primary = kpis[0];
  const r5 = primary.実績?.R5;
  const r6 = primary.実績?.R6;
  if (isMissing(r5) || isMissing(r6)) return { flagged: false, detail: "" };
  const r5n = Number(r5);
  const r6n = Number(r6);
  if (Number.isNaN(r5n) || Number.isNaN(r6n) || r5n === 0)
    return { flagged: false, detail: "" };
  const change = (r6n - r5n) / r5n;
  if (change < -0.1) {
    return {
      flagged: true,
      detail: `「${primary.内容}」R5:${r5n} → R6:${r6n}（${Math.round(change * 100)}%減少）`,
    };
  }
  return { flagged: false, detail: "" };
}

function hasVagueGoal(data: JimuJigyoData): boolean {
  const allKpis = [
    ...(data.指標?.活動指標 ?? []),
    ...(data.指標?.成果指標 ?? []),
  ];
  return allKpis.some(
    (k) =>
      k.目標?.最終年度 === "R年度" ||
      k.目標?.最終年度 === null ||
      k.目標?.最終年度 === undefined
  );
}

function hasNoData(kpis: KpiItem[]): boolean {
  return kpis.some((k) => isMissing(k.実績?.R6));
}

export function calcFlags(data: JimuJigyoData): WatchdogFlag[] {
  const flags: WatchdogFlag[] = [];
  const seiskaKpis = data.指標?.成果指標 ?? [];
  const allKpis = [...(data.指標?.活動指標 ?? []), ...seiskaKpis];

  const lowTarget = hasLowTarget(allKpis);
  if (lowTarget.flagged) {
    flags.push({
      type: "low_target",
      label: "目標が低すぎる",
      detail: lowTarget.detail,
    });
  }

  if (hasMissingKpi(seiskaKpis)) {
    flags.push({
      type: "missing_kpi",
      label: "KPI未設定",
      detail: "成果指標の目標値が設定されていない指標があります。",
    });
  }

  const budgetSurge = hasBudgetSurge(data);
  if (budgetSurge.flagged) {
    flags.push({
      type: "budget_surge",
      label: "予算急増",
      detail: budgetSurge.detail,
    });
  }

  const declining = hasDeclining(seiskaKpis);
  if (declining.flagged) {
    flags.push({
      type: "declining",
      label: "実績悪化",
      detail: declining.detail,
    });
  }

  if (hasVagueGoal(data)) {
    flags.push({
      type: "vague_goal",
      label: "終了基準不明",
      detail:
        "最終年度が「R年度（未定）」となっており、事業終了の基準が不明確です。",
    });
  }

  if (hasNoData(seiskaKpis)) {
    flags.push({
      type: "no_data",
      label: "データ未集計",
      detail: "成果指標の実績値が「集計中」または「調査未実施」です。",
    });
  }

  return flags;
}
