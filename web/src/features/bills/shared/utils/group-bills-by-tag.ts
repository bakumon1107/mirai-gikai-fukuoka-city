import type { BillsByTag, BillWithContent } from "../types";

/**
 * 議案リストをタグでグループ化する。
 * 同じ議案が複数タグに属する場合は各タグに含まれる。
 * タグのないタググループは除外される。
 */
export function groupBillsByTag(bills: BillWithContent[]): BillsByTag[] {
  const tagMap = new Map<
    string,
    { tag: BillsByTag["tag"]; bills: BillWithContent[] }
  >();

  for (const bill of bills) {
    for (const tag of bill.tags ?? []) {
      let entry = tagMap.get(tag.id);
      if (!entry) {
        entry = { tag: { ...tag, priority: 0 }, bills: [] };
        tagMap.set(tag.id, entry);
      }
      entry.bills.push(bill);
    }
  }

  return [...tagMap.values()].sort((a, b) =>
    a.tag.label.localeCompare(b.tag.label, "ja")
  );
}
