import type { UpdateEntry } from "../types";

/**
 * 更新履歴を新しい順に並べ替える。
 * データは古い順に追記するので、同じ日のものは後に書いたほうを先に出す。
 */
export function sortUpdatesNewestFirst(entries: UpdateEntry[]): UpdateEntry[] {
  return [...entries].reverse().sort((a, b) => b.date.localeCompare(a.date));
}

/** いちばん新しい掲載日。履歴が空なら null */
export function getLatestUpdateDate(entries: UpdateEntry[]): string | null {
  return entries.reduce<string | null>(
    (latest, entry) =>
      latest === null || entry.date > latest ? entry.date : latest,
    null
  );
}
