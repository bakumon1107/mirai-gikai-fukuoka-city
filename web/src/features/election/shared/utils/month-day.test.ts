import { describe, expect, it } from "vitest";
import { formatMonthDayJa } from "./month-day";

describe("formatMonthDayJa", () => {
  it("月日を日本語で表し、先頭の0を落とす", () => {
    expect(formatMonthDayJa("2026-01-03")).toBe("1月3日");
    expect(formatMonthDayJa("2026-11-18")).toBe("11月18日");
  });

  it("形式が崩れていればそのまま返す", () => {
    expect(formatMonthDayJa("11/18")).toBe("11/18");
  });
});
