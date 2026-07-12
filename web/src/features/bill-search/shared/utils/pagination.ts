// 検索結果ページネーションの計算ロジック（純粋関数）

/** 総件数とページサイズから総ページ数を返す（0件は1ページ扱い） */
export function calcPageCount(totalCount: number, pageSize: number): number {
  if (totalCount <= 0) {
    return 1;
  }
  return Math.ceil(totalCount / pageSize);
}

/** ページ番号を 1..pageCount の範囲に丸める（不正値は1） */
export function clampPage(page: number, pageCount: number): number {
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }
  return Math.min(Math.trunc(page), Math.max(pageCount, 1));
}

export type PageItem = number | "ellipsis";

// ナビに表示するページ番号の最大個数（現在ページ±1 + 先頭末尾）
const WINDOW = 1;

/**
 * ページナビに表示する項目列を返す。
 * 先頭・末尾は常に表示し、現在ページの前後 WINDOW ページを表示、
 * 間が飛ぶ場合は "ellipsis" を挟む。例: [1, "ellipsis", 4, 5, 6, "ellipsis", 9]
 */
export function buildPageItems(current: number, pageCount: number): PageItem[] {
  if (pageCount <= 1) {
    return [];
  }

  const pages = new Set<number>([1, pageCount]);
  for (let p = current - WINDOW; p <= current + WINDOW; p++) {
    if (p >= 1 && p <= pageCount) {
      pages.add(p);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev !== 0 && p - prev > 1) {
      items.push("ellipsis");
    }
    items.push(p);
    prev = p;
  }
  return items;
}
