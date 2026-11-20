import type { Candidate, CandidateRerun } from "../types";
import { formatMonthDayJa } from "./month-day";
import { isWithdrawn } from "./withdrawal";

/**
 * 再選挙への出馬の意向が確認できた人。特設トップ・争点の比較・人数はこちらを使う。
 * 並び順と番号は元の配列（11月15日の選挙の表明順）のまま。
 */
export function filterRerunCandidates<
  T extends Pick<Candidate, "withdrawal" | "rerun">,
>(candidates: readonly T[]): T[] {
  return candidates.filter(
    (candidate) => candidate.rerun !== undefined && !isWithdrawn(candidate)
  );
}

/** "2026-11-18" → "11月18日に再選挙への出馬の意向" */
export function formatRerunLabel(rerun: CandidateRerun): string {
  return `${formatMonthDayJa(rerun.date)}に再選挙への出馬の意向`;
}
