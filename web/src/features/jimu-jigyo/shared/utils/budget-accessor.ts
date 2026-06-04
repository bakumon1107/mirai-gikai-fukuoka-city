import type {
  BudgetMeisai,
  BudgetShubetsu,
  JimuJigyoData,
  ReiwaYear,
} from "../types/jimu-jigyo";

function findEntry(
  data: JimuJigyoData,
  year: ReiwaYear,
  shubetsuList: BudgetShubetsu[]
): BudgetMeisai | undefined {
  const meisai = data.事業費_千円?.明細;
  if (!meisai) return undefined;
  for (const shubetsu of shubetsuList) {
    const entry =
      meisai.find(
        (m) => m.年度 === year && m.種別 === shubetsu && m.会計区分 === null
      ) ?? meisai.find((m) => m.年度 === year && m.種別 === shubetsu);
    if (entry) return entry;
  }
  return undefined;
}

/** 当年度の歳出データを返す（決算見込 → 決算 → 予算 の順） */
export function getCurrentBudget(
  data: JimuJigyoData,
  year: string
): BudgetMeisai | undefined {
  const n = Number(year.replace(/^r/i, ""));
  return findEntry(data, `R${n}` as ReiwaYear, ["決算見込", "決算", "予算"]);
}

/** 前年度の歳出データを返す（決算 → 決算見込 の順） */
export function getPrevBudget(
  data: JimuJigyoData,
  year: string
): BudgetMeisai | undefined {
  const n = Number(year.replace(/^r/i, ""));
  return findEntry(data, `R${n - 1}` as ReiwaYear, ["決算", "決算見込"]);
}

/** 次年度の予算データを返す */
export function getNextBudget(
  data: JimuJigyoData,
  year: string
): BudgetMeisai | undefined {
  const n = Number(year.replace(/^r/i, ""));
  return findEntry(data, `R${n + 1}` as ReiwaYear, ["予算", "決算見込"]);
}
