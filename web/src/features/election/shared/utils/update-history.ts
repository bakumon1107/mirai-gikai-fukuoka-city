import type { UpdateEntry } from "../types";

/** 更新履歴を新しい順に並べ替える。同じ日のものは書いた順を保つ */
export function sortUpdatesNewestFirst(entries: UpdateEntry[]): UpdateEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

/** いちばん新しい掲載日。履歴が空なら null */
export function getLatestUpdateDate(entries: UpdateEntry[]): string | null {
  if (entries.length === 0) {
    return null;
  }
  return sortUpdatesNewestFirst(entries)[0].date;
}
