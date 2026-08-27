import type { StatementLog } from "../types";

/**
 * 発言ログを新しい順に並べ替える。
 *
 * データ側は追記順（古い順）で書くほうが更新しやすいので、
 * 並べ替えは表示側で行う。date は "2026-08" と "2026-08-26" が混在するが、
 * ゼロ埋めされた同一書式のプレフィックスなので辞書順の降順で正しく並ぶ
 * （"2026-08-26" > "2026-08" となり、日まで判明している方が先に来る）。
 */
export function sortStatementsNewestFirst(log: StatementLog[]): StatementLog[] {
  return [...log].sort((a, b) => b.date.localeCompare(a.date));
}

/** "2026-08" → "2026年8月" / "2026-08-26" → "2026年8月26日" */
export function formatStatementDate(date: string): string {
  const [year, month, day] = date.split("-");
  if (!year || !month) {
    return date;
  }

  const base = `${year}年${Number(month)}月`;
  return day ? `${base}${Number(day)}日` : base;
}
