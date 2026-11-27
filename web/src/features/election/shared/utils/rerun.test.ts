import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import {
  describeRerunIntent,
  filterRerunCandidates,
  formatRerunReport,
} from "./rerun";

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
  it("日付と出典を並べる（「○日に表明」とは書かない）", () => {
    expect(formatRerunReport(RERUN)).toBe("11月18日・TNC");
  });
});

describe("describeRerunIntent", () => {
  it("報道が出典なら「報じられています」", () => {
    expect(describeRerunIntent(RERUN)).toBe(
      "再選挙への出馬の意向が報じられています"
    );
  });

  it("本人の発信が出典なら「示されています」", () => {
    expect(describeRerunIntent({ ...RERUN, source: "本人サイト" })).toBe(
      "再選挙への出馬の意向が示されています"
    );
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
      for (const entry of [candidate.rerun, candidate.rerunDeclined]) {
        if (entry) {
          expect(entry.date > "2026-11-15", candidate.id).toBe(true);
        }
      }
    }
  });

  it("出馬の意向と不出馬の表明を同時に持つ人はいない", () => {
    for (const candidate of CANDIDATES) {
      expect(
        candidate.rerun !== undefined && candidate.rerunDeclined !== undefined,
        candidate.id
      ).toBe(false);
    }
  });

  it("不出馬を表明した人は出典のURLを持つ", () => {
    for (const candidate of CANDIDATES) {
      if (candidate.rerunDeclined) {
        expect(candidate.rerunDeclined.date, candidate.id).toMatch(
          /^\d{4}-\d{2}-\d{2}$/
        );
        expect(candidate.rerunDeclined.url, candidate.id).toMatch(
          /^https:\/\//
        );
        expect(candidate.rerunDeclined.source, candidate.id).not.toBe("");
      }
    }
  });
});
