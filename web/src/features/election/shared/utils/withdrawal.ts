import type { Candidate, CandidateWithdrawal } from "../types";

/** 立候補を取りやめたか */
export function isWithdrawn(candidate: Pick<Candidate, "withdrawal">): boolean {
  return candidate.withdrawal !== undefined;
}

/**
 * 取りやめた人を除いた立候補予定者。人数・争点の比較・個人ページはこちらを使う。
 * 並び順は元の配列（表明順）のまま。
 */
export function filterActiveCandidates<T extends Pick<Candidate, "withdrawal">>(
  candidates: readonly T[]
): T[] {
  return candidates.filter((candidate) => !isWithdrawn(candidate));
}

/** "2026-10-29" → "10月29日に立候補を取りやめ" */
export function formatWithdrawalLabel(withdrawal: CandidateWithdrawal): string {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(withdrawal.date);
  const day = match
    ? `${Number(match[1])}月${Number(match[2])}日`
    : withdrawal.date;
  return `${day}に立候補を取りやめ`;
}
