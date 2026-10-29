import type { Candidate } from "../types";

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

/** "2026-10-29" → "10月29日に立候補を取りやめ"。取りやめていなければ null */
export function formatWithdrawalLabel(
  candidate: Pick<Candidate, "withdrawal">
): string | null {
  if (!candidate.withdrawal) {
    return null;
  }
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(candidate.withdrawal.date);
  const day = match
    ? `${Number(match[1])}月${Number(match[2])}日`
    : candidate.withdrawal.date;
  return `${day}に立候補を取りやめ`;
}
