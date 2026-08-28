import { describe, expect, it } from "vitest";
import type { StatementLog } from "../types";
import {
  formatStatementDate,
  sortStatementsNewestFirst,
} from "./statement-log";

const entry = (date: string): StatementLog => ({
  date,
  place: "報道",
  source: "テスト",
  text: "",
});

describe("sortStatementsNewestFirst", () => {
  it("追記順（古い順）で書かれたログを新しい順に並べ替える", () => {
    const log = [entry("2026-08"), entry("2026-09-14"), entry("2026-10-02")];
    expect(sortStatementsNewestFirst(log).map((e) => e.date)).toEqual([
      "2026-10-02",
      "2026-09-14",
      "2026-08",
    ]);
  });

  it("同じ月でも日まで判明している方を先に置く", () => {
    const log = [entry("2026-08"), entry("2026-08-26")];
    expect(sortStatementsNewestFirst(log).map((e) => e.date)).toEqual([
      "2026-08-26",
      "2026-08",
    ]);
  });

  it("年をまたいでも正しく並ぶ", () => {
    const log = [entry("2025-12-31"), entry("2026-01-01")];
    expect(sortStatementsNewestFirst(log).map((e) => e.date)).toEqual([
      "2026-01-01",
      "2025-12-31",
    ]);
  });

  it("元の配列を破壊しない", () => {
    const log = [entry("2026-08"), entry("2026-10")];
    sortStatementsNewestFirst(log);
    expect(log.map((e) => e.date)).toEqual(["2026-08", "2026-10"]);
  });

  it("空配列でも落ちない", () => {
    expect(sortStatementsNewestFirst([])).toEqual([]);
  });
});

describe("formatStatementDate", () => {
  it("年月をゼロ埋めなしの和暦風表記にする", () => {
    expect(formatStatementDate("2026-08")).toBe("2026年8月");
  });

  it("日まであれば日も出す", () => {
    expect(formatStatementDate("2026-08-26")).toBe("2026年8月26日");
  });

  it("2桁の月日はそのまま出す", () => {
    expect(formatStatementDate("2026-11-15")).toBe("2026年11月15日");
  });

  it("想定外の書式はそのまま返す", () => {
    expect(formatStatementDate("2026")).toBe("2026");
    expect(formatStatementDate("")).toBe("");
  });
});
