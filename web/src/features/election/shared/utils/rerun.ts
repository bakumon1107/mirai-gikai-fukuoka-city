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

/**
 * 日付と出典を並べる。日付は報道の日付のこともあるため、「○日に表明」とは書かない。
 * → "11月18日・TNCテレビ西日本" / "11月21日・本人サイト"
 */
export function formatRerunReport(rerun: CandidateRerun): string {
  return `${formatMonthDayJa(rerun.date)}・${rerun.source}`;
}
