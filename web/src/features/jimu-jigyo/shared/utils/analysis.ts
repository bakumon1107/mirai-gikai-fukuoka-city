import type {
  BudgetAnalysisResult,
  ChangeDirection,
  EfficiencyAnalysisResult,
  JimuJigyoAnalysis,
  JimuJigyoData,
  KpiAnalysisResult,
  ReiwaYear,
} from "../types/jimu-jigyo";
import {
  getCurrentBudget,
  getNextBudget,
  getPrevBudget,
} from "./budget-accessor";

// ─── ユーティリティ ──────────────────────────────────────────

const SCHEDULED_ABSENT = "調査未実施";

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "string" && val.trim() === SCHEDULED_ABSENT) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

function parseRate(rateVal: string | number | null | undefined): number | null {
  if (rateVal === null || rateVal === undefined) return null;
  if (typeof rateVal === "number") return rateVal;
  const trimmed = rateVal.trim();
  if (trimmed === "達成") return 100;
  if (trimmed === "未達成") return 60;
  const n = Number.parseFloat(trimmed.replace("%", ""));
  return Number.isNaN(n) ? null : n;
}

function direction(rate: number | null): ChangeDirection {
  if (rate === null) return "unknown";
  if (rate >= 0.05) return "up";
  if (rate <= -0.05) return "down";
  return "flat";
}

function pct(rate: number): string {
  const sign = rate >= 0 ? "+" : "";
  return `${sign}${(rate * 100).toFixed(1)}%`;
}

// ─── KPI分析 ─────────────────────────────────────────────────

export function analyzeKpi(data: JimuJigyoData): KpiAnalysisResult {
  const kpis = data.指標?.成果指標 ?? [];
  if (kpis.length === 0) {
    return {
      direction: "unknown",
      changeRate: null,
      achievementRate: null,
      text: "成果指標が設定されていません。",
    };
  }

  const primary = kpis[0];
  const label = primary.内容;
  const r5 = toNum(primary.実績?.R5);
  const r6 = toNum(primary.実績?.R6);
  const r6target = toNum(primary.目標?.R6);
  const rateRaw = primary.達成率?.R6;
  const rateText = rateRaw != null ? String(rateRaw).trim() : undefined;

  // 実績が調査未実施
  if (
    typeof primary.実績?.R6 === "string" &&
    primary.実績.R6.trim() === SCHEDULED_ABSENT
  ) {
    return {
      direction: "unknown",
      changeRate: null,
      achievementRate: null,
      text: `「${label}」は令和6年度の調査が実施されていません（定期調査年外）。令和5年度実績は${r5 !== null ? r5 : "不明"}です。`,
    };
  }

  // 達成率テキストのみの場合
  if (rateText === "達成" || rateText === "未達成") {
    const achieved = rateText === "達成";
    let changeText = "";
    if (r5 !== null && r6 !== null && r5 !== 0) {
      const cr = (r6 - r5) / r5;
      changeText = `前年度比${pct(cr)}。`;
    }
    return {
      direction: achieved ? "up" : "down",
      changeRate:
        r5 !== null && r6 !== null && r5 !== 0 ? (r6 - r5) / r5 : null,
      achievementRate: achieved ? 100 : 60,
      text: `「${label}」の令和6年度評価は「${rateText}」です。${changeText}目標値が定性的なため定量比較は困難ですが、行政の評価は${rateText}とされています。`,
    };
  }

  // 数値実績の場合
  if (r6 === null) {
    return {
      direction: "unknown",
      changeRate: null,
      achievementRate: null,
      text: `「${label}」の令和6年度実績データがありません（集計中または未設定）。`,
    };
  }

  const achievementRate =
    r6target !== null && r6target > 0
      ? (r6 / r6target) * 100
      : parseRate(primary.達成率?.R6);

  if (r5 === null || r5 === 0) {
    const achText =
      achievementRate !== null
        ? `達成率は${achievementRate.toFixed(1)}%です。`
        : "";
    return {
      direction: "unknown",
      changeRate: null,
      achievementRate,
      text: `「${label}」の令和6年度実績は${r6}です。${achText}`,
    };
  }

  const changeRate = (r6 - r5) / r5;
  const dir = direction(changeRate);
  const achText =
    achievementRate !== null
      ? `目標に対する達成率は${achievementRate.toFixed(1)}%です。`
      : "";

  // direction() の ±5% 閾値と揃えてテキストとアイコンが矛盾しないようにする
  let trendDesc: string;
  if (changeRate >= 0.1)
    trendDesc = `前年度比${pct(changeRate)}と大幅に改善しました。`;
  else if (changeRate >= 0.05)
    trendDesc = `前年度比${pct(changeRate)}と改善しました。`;
  else if (changeRate >= -0.05)
    trendDesc = `前年度とほぼ同水準です（${pct(changeRate)}）。`;
  else if (changeRate >= -0.1)
    trendDesc = `前年度比${pct(changeRate)}とやや悪化しました。`;
  else trendDesc = `前年度比${pct(changeRate)}と大幅に悪化しました。`;

  return {
    direction: dir,
    changeRate,
    achievementRate,
    text: `「${label}」は令和5年度の${r5}から令和6年度の${r6}へ${trendDesc}${achText}`,
  };
}

// ─── 予算分析 ─────────────────────────────────────────────────

export function analyzeBudget(
  data: JimuJigyoData,
  year: string = "r6"
): BudgetAnalysisResult {
  const prev = getPrevBudget(data, year)?.歳出;
  const curr = getCurrentBudget(data, year)?.歳出;

  if (prev === undefined || curr === undefined) {
    return {
      direction: "unknown",
      changeRate: null,
      nextYearDirection: "unknown",
      nextYearChangeRate: null,
      text: "事業費データがありません。",
    };
  }

  const changeRate = prev > 0 ? (curr - prev) / prev : null;
  const dir = direction(changeRate);

  // 次年度予算の方向と変化率
  const nextYearBudget = getNextBudget(data, year)?.歳出;
  let nextYearDirection: ChangeDirection = "unknown";
  let nextYearChangeRate: number | null = null;
  if (nextYearBudget !== undefined && curr > 0) {
    nextYearChangeRate = (nextYearBudget - curr) / curr;
    nextYearDirection = direction(nextYearChangeRate);
  }

  let trendDesc: string;
  if (changeRate === null) trendDesc = "事業費の変化を計算できません。";
  else if (changeRate >= 0.3)
    trendDesc = `前年度の${prev.toLocaleString()}千円から当年度の${curr.toLocaleString()}千円へ${pct(changeRate)}と大幅に増加しています。`;
  else if (changeRate >= 0.05)
    trendDesc = `前年度の${prev.toLocaleString()}千円から当年度の${curr.toLocaleString()}千円へ${pct(changeRate)}増加しています。`;
  else if (changeRate >= -0.05)
    trendDesc = `歳出は前年度の${prev.toLocaleString()}千円から当年度の${curr.toLocaleString()}千円でほぼ横ばいです（${pct(changeRate)}）。`;
  else
    trendDesc = `前年度の${prev.toLocaleString()}千円から当年度の${curr.toLocaleString()}千円へ${pct(changeRate)}削減されました。`;

  let nextYearText = "";
  if (nextYearBudget !== undefined && nextYearChangeRate !== null) {
    nextYearText = `次年度予算は${nextYearBudget.toLocaleString()}千円（前年度比${pct(nextYearChangeRate)}）の見込みです。`;
  }

  // 財源構成の特記
  const tokutei = getCurrentBudget(data, year)?.特定財源;
  const ippan = getCurrentBudget(data, year)?.一般財源;
  let zaigenText = "";
  if (tokutei !== undefined && curr > 0) {
    const ratio = (tokutei / curr) * 100;
    if (ratio >= 90)
      zaigenText = "全額が特定財源（補助金等）で賄われています。";
    else if (ratio <= 10 && ippan !== undefined)
      zaigenText = "全額が一般財源（市税等）で賄われています。";
  }

  return {
    direction: dir,
    changeRate,
    nextYearDirection,
    nextYearChangeRate,
    text: [trendDesc, nextYearText, zaigenText].filter(Boolean).join(""),
  };
}

// ─── 効率分析 ─────────────────────────────────────────────────

export function analyzeEfficiency(
  data: JimuJigyoData,
  year: string = "r6"
): EfficiencyAnalysisResult {
  const prevBudget = getPrevBudget(data, year)?.歳出;
  const currBudget = getCurrentBudget(data, year)?.歳出;
  const kpis = data.指標?.成果指標 ?? [];

  const yearNum = Number(year.replace(/^r/i, ""));
  const prevKey = `R${yearNum - 1}` as ReiwaYear;
  const currKey = `R${yearNum}` as ReiwaYear;

  if (!prevBudget || !currBudget || prevBudget === 0) {
    return {
      direction: "unknown",
      changeRate: null,
      text: "事業費データが不足しているため、予算効率の分析ができません。",
    };
  }

  // 達成率ペアを収集
  const pairs = kpis
    .map((k) => ({
      prev: parseRate(k.達成率?.[prevKey]),
      curr: parseRate(k.達成率?.[currKey]),
    }))
    .filter(
      (p): p is { prev: number; curr: number } =>
        p.prev !== null && p.curr !== null
    );

  if (pairs.length === 0) {
    // 予算変化のみで判定（絶対値で判定して削減をほぼ維持と誤表示しない）
    const budgetChange = (currBudget - prevBudget) / prevBudget;
    if (Math.abs(budgetChange) <= 0.05) {
      return {
        direction: "flat",
        changeRate: null,
        text: "達成率の数値データが不足しているため定量的な効率分析は困難ですが、予算はほぼ維持されています。",
      };
    }
    return {
      direction: budgetChange > 0.05 ? "down" : "up", // 予算増 = 効率悪化傾向、減 = 効率向上傾向
      changeRate: null,
      text: `達成率の数値データが不足しているため定量的な効率分析は困難です。予算は前年度比${pct(budgetChange)}変化しています。`,
    };
  }

  const prevAvgRate = pairs.reduce((a, p) => a + p.prev, 0) / pairs.length;
  const currAvgRate = pairs.reduce((a, p) => a + p.curr, 0) / pairs.length;

  if (prevAvgRate === 0) {
    return {
      direction: "unknown",
      changeRate: null,
      text: "前年度の達成率が0のため効率変化を算出できません。",
    };
  }

  const prevEff = prevAvgRate / prevBudget;
  const currEff = currAvgRate / currBudget;
  const changeRate = (currEff - prevEff) / prevEff;
  const dir = direction(changeRate);

  let text: string;
  if (changeRate >= 0.1) {
    text = `達成率が向上し予算も効率化されており、コスト効率は${pct(changeRate)}改善しています。予算増加以上に成果が拡大しています。`;
  } else if (changeRate >= 0.01) {
    text = `コスト効率は${pct(changeRate)}とわずかに改善しています。予算変化と成果変化がほぼ比例しています。`;
  } else if (changeRate >= -0.05) {
    text = `コスト効率はほぼ横ばいです（${pct(changeRate)}）。予算と成果のバランスは維持されています。`;
  } else if (changeRate >= -0.15) {
    text = `コスト効率は${pct(changeRate)}とやや低下しています。予算増加に対して成果の改善が限定的です。`;
  } else {
    text = `コスト効率は${pct(changeRate)}と低下しています。予算が増加したにもかかわらず、達成率が改善していないか悪化しています。成果改善への取り組みが求められます。`;
  }

  return { direction: dir, changeRate, text };
}

// ─── 統合 ────────────────────────────────────────────────────

export function analyzeJimuJigyo(
  data: JimuJigyoData,
  year: string = "r6"
): JimuJigyoAnalysis {
  return {
    kpi: analyzeKpi(data),
    budget: analyzeBudget(data, year),
    efficiency: analyzeEfficiency(data, year),
  };
}
