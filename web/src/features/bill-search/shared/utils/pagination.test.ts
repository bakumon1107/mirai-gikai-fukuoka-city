import { describe, expect, it } from "vitest";
import { buildPageItems, calcPageCount, clampPage } from "./pagination";

describe("calcPageCount", () => {
  it("端数は切り上げる", () => {
    expect(calcPageCount(52, 20)).toBe(3);
    expect(calcPageCount(40, 20)).toBe(2);
    expect(calcPageCount(1, 20)).toBe(1);
  });

  it("0件・負数は1ページ扱い", () => {
    expect(calcPageCount(0, 20)).toBe(1);
    expect(calcPageCount(-5, 20)).toBe(1);
  });
});

describe("clampPage", () => {
  it("範囲内はそのまま", () => {
    expect(clampPage(2, 3)).toBe(2);
  });

  it("範囲外は端に丸める", () => {
    expect(clampPage(99, 3)).toBe(3);
    expect(clampPage(0, 3)).toBe(1);
    expect(clampPage(-1, 3)).toBe(1);
  });

  it("不正値（NaN・小数）は安全に処理", () => {
    expect(clampPage(Number.NaN, 3)).toBe(1);
    expect(clampPage(2.7, 3)).toBe(2);
  });
});

describe("buildPageItems", () => {
  it("1ページ以下ならナビ不要（空配列）", () => {
    expect(buildPageItems(1, 1)).toEqual([]);
  });

  it("少ページは全番号を列挙", () => {
    expect(buildPageItems(2, 3)).toEqual([1, 2, 3]);
  });

  it("多ページは先頭・末尾＋現在ページ周辺のみで省略記号を挟む", () => {
    expect(buildPageItems(5, 9)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      9,
    ]);
    expect(buildPageItems(1, 9)).toEqual([1, 2, "ellipsis", 9]);
    expect(buildPageItems(9, 9)).toEqual([1, "ellipsis", 8, 9]);
  });
});
