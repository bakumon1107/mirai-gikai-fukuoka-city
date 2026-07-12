import { describe, expect, it } from "vitest";
import {
  buildSearchQueryVariants,
  normalizeSearchQuery,
  toHiragana,
  toKatakana,
} from "./normalize-search-query";

describe("normalizeSearchQuery", () => {
  it("全角英数を半角に正規化する", () => {
    expect(normalizeSearchQuery("ＡＩ５０")).toBe("AI50");
  });

  it("半角カナを全角カナに正規化する", () => {
    expect(normalizeSearchQuery("ｽﾄｰｶｰ")).toBe("ストーカー");
  });

  it("前後の空白（全角含む）をトリムする", () => {
    expect(normalizeSearchQuery("　医療 ")).toBe("医療");
  });
});

describe("toKatakana / toHiragana", () => {
  it("ひらがな→カタカナ変換", () => {
    expect(toKatakana("すとーかー")).toBe("ストーカー");
    expect(toKatakana("でじたる庁")).toBe("デジタル庁");
  });

  it("カタカナ→ひらがな変換", () => {
    expect(toHiragana("ストーカー")).toBe("すとーかー");
  });

  it("漢字・英数は変換されない", () => {
    expect(toKatakana("医療50")).toBe("医療50");
    expect(toHiragana("医療50")).toBe("医療50");
  });
});

describe("buildSearchQueryVariants", () => {
  it("かな違いのバリエーションを重複なしで返す", () => {
    expect(buildSearchQueryVariants("すとーかー")).toEqual([
      "すとーかー",
      "ストーカー",
    ]);
  });

  it("かなを含まないクエリは1件のみ", () => {
    expect(buildSearchQueryVariants("医療")).toEqual(["医療"]);
  });

  it("半角カナ入力も正規化してバリエーション展開する", () => {
    expect(buildSearchQueryVariants("ｽﾄｰｶｰ")).toEqual([
      "ストーカー",
      "すとーかー",
    ]);
  });

  it("空文字・空白のみは空配列", () => {
    expect(buildSearchQueryVariants("")).toEqual([]);
    expect(buildSearchQueryVariants("  ")).toEqual([]);
  });
});
