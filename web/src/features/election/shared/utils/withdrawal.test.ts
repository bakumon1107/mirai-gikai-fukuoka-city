import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import {
  filterActiveCandidates,
  formatWithdrawalLabel,
  isWithdrawn,
} from "./withdrawal";

const WITHDRAWAL = { date: "2026-10-29", source: "s", url: "https://x" };

describe("isWithdrawn", () => {
  it("withdrawal があれば取りやめ", () => {
    expect(isWithdrawn({ withdrawal: WITHDRAWAL })).toBe(true);
    expect(isWithdrawn({})).toBe(false);
  });
});

describe("filterActiveCandidates", () => {
  it("取りやめた人を除き、元の並び順を保つ", () => {
    const list = [
      { id: "a" },
      { id: "b", withdrawal: WITHDRAWAL },
      { id: "c" },
    ];
    expect(filterActiveCandidates(list).map((item) => item.id)).toEqual([
      "a",
      "c",
    ]);
  });
});

describe("formatWithdrawalLabel", () => {
  it("月日を日本語で表す", () => {
    expect(formatWithdrawalLabel(WITHDRAWAL)).toBe(
      "10月29日に立候補を取りやめ"
    );
  });

  it("日付の形式が崩れていればそのまま出す", () => {
    expect(formatWithdrawalLabel({ ...WITHDRAWAL, date: "10/29" })).toBe(
      "10/29に立候補を取りやめ"
    );
  });
});

describe("取りやめのデータ", () => {
  it("取りやめた人は出典のURLと YYYY-MM-DD の日付を持つ", () => {
    for (const candidate of CANDIDATES.filter(isWithdrawn)) {
      expect(candidate.withdrawal?.date, candidate.id).toMatch(
        /^\d{4}-\d{2}-\d{2}$/
      );
      expect(candidate.withdrawal?.url, candidate.id).toMatch(/^https:\/\//);
      expect(candidate.withdrawal?.source, candidate.id).not.toBe("");
    }
  });
});
