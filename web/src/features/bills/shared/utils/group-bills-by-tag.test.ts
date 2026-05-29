import { describe, it, expect } from "vitest";
import { groupBillsByTag } from "./group-bills-by-tag";
import type { BillWithContent } from "../types";

const makeBill = (
  id: string,
  tags: { id: string; label: string }[]
): BillWithContent =>
  ({
    id,
    name: `議案${id}`,
    tags,
    is_featured: false,
  }) as unknown as BillWithContent;

describe("groupBillsByTag", () => {
  it("タグなしの議案は含まれない", () => {
    const bills = [makeBill("1", [])];
    expect(groupBillsByTag(bills)).toHaveLength(0);
  });

  it("1つのタグに議案が集まる", () => {
    const tag = { id: "t1", label: "福祉" };
    const bills = [makeBill("1", [tag]), makeBill("2", [tag])];
    const result = groupBillsByTag(bills);
    expect(result).toHaveLength(1);
    expect(result[0].bills).toHaveLength(2);
  });

  it("複数タグに属する議案は各タグに含まれる", () => {
    const tagA = { id: "tA", label: "A" };
    const tagB = { id: "tB", label: "B" };
    const bill = makeBill("1", [tagA, tagB]);
    const result = groupBillsByTag([bill]);
    expect(result).toHaveLength(2);
    expect(result[0].bills[0].id).toBe("1");
    expect(result[1].bills[0].id).toBe("1");
  });

  it("タグがないものと有るものが混在していても正しく分類される", () => {
    const tag = { id: "t1", label: "環境" };
    const bills = [makeBill("1", [tag]), makeBill("2", [])];
    const result = groupBillsByTag(bills);
    expect(result).toHaveLength(1);
    expect(result[0].bills).toHaveLength(1);
    expect(result[0].bills[0].id).toBe("1");
  });
});
