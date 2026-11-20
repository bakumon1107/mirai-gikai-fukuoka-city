import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { filterRerunCandidates, formatRerunReport } from "./rerun";

const RERUN = { date: "2026-11-18", source: "TNC", url: "https://x" };
const WITHDRAWAL = { date: "2026-10-29", source: "s", url: "https://x" };

describe("filterRerunCandidates", () => {
  it("意向がある人だけを、元の並び順のまま残す", () => {
    const list = [
      { id: "a" },
      { id: "b", rerun: RERUN },
      { id: "c" },
      { id: "d", rerun: RERUN },
    ];
    expect(filterRerunCandidates(list).map((item) => item.id)).toEqual([
      "b",
      "d",
    ]);
  });

  it("取りやめた人は、意向があっても外す", () => {
    const list = [{ id: "a", rerun: RERUN, withdrawal: WITHDRAWAL }];
    expect(filterRerunCandidates(list)).toEqual([]);
  });
});

describe("formatRerunReport", () => {
  it("報道の日付と媒体を書く（本人の表明日としては書かない）", () => {
    expect(formatRerunReport(RERUN)).toBe("11月18日の報道（TNC）");
  });
});

describe("再選挙の意向のデータ", () => {
  it("意向がある人は出典のURLと YYYY-MM-DD の日付を持つ", () => {
    for (const candidate of CANDIDATES) {
      if (!candidate.rerun) {
        continue;
      }
      expect(candidate.rerun.date, candidate.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(candidate.rerun.url, candidate.id).toMatch(/^https:\/\//);
      expect(candidate.rerun.source, candidate.id).not.toBe("");
    }
  });

  it("意向の日付は11月15日の投開票より後", () => {
    for (const candidate of CANDIDATES) {
      if (candidate.rerun) {
        expect(candidate.rerun.date > "2026-11-15", candidate.id).toBe(true);
      }
    }
  });
});
