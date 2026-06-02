import type { JimuJigyoData } from "../types/jimu-jigyo";

type BudgetEntry = {
  歳出?: number;
  特定財源?: number;
  一般財源?: number;
};

/** 当年度の歳出データを返す（R6 → R6決算見込, R7 → R7予算 または R7決算見込） */
export function getCurrentBudget(
  data: JimuJigyoData,
  year: string
): BudgetEntry | undefined {
  const b = data.事業費_千円;
  if (!b) return undefined;
  const n = Number(year.replace(/^r/i, "")); // "r6" -> 6
  return (
    (b as Record<string, BudgetEntry>)[`R${n}決算見込`] ??
    (b as Record<string, BudgetEntry>)[`R${n}予算`]
  );
}

/** 前年度の歳出データを返す（R6 → R5決算, R7 → R6決算見込） */
export function getPrevBudget(
  data: JimuJigyoData,
  year: string
): BudgetEntry | undefined {
  const b = data.事業費_千円;
  if (!b) return undefined;
  const n = Number(year.replace(/^r/i, ""));
  return (
    (b as Record<string, BudgetEntry>)[`R${n - 1}決算`] ??
    (b as Record<string, BudgetEntry>)[`R${n - 1}決算見込`]
  );
}
