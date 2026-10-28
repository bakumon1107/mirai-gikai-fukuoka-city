import type { UpdateEntry } from "../types";

/**
 * 更新履歴を新しい順に並べ替える。
 * データは古い順に追記するので、同じ日のものは後に書いたほうを先に出す。
 */
export function sortUpdatesNewestFirst(
  entries: readonly UpdateEntry[]
): UpdateEntry[] {
  return [...entries].reverse().sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * いちばん新しい日付。空なら null。
 * 更新履歴の掲載日にも発言ログの日付にも使う。"2026-10" のような月までの日付は、
 * 文字列比較で同じ月の日付より前に来る。
 */
export function getLatestUpdateDate(
  entries: readonly { date: string }[]
): string | null {
  return entries.reduce<string | null>(
    (latest, entry) =>
      latest === null || entry.date > latest ? entry.date : latest,
    null
  );
}
