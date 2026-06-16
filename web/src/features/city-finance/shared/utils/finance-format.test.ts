import { describe, expect, test } from "vitest";
import {
  formatJapaneseYen,
  formatPerCapita,
  formatPct,
  formatReiwaFiscalYear,
  thousandYenToYen,
  yenToOku,
} from "./finance-format";

describe("formatReiwaFiscalYear", () => {
  test("令和元年度（2019）は「元」表記", () => {
    expect(formatReiwaFiscalYear(2019)).toBe("令和元年度");
  });
  test("令和6年度（2024）", () => {
    expect(formatReiwaFiscalYear(2024)).toBe("令和6年度");
  });
  test("2018以前は西暦のまま", () => {
    expect(formatReiwaFiscalYear(2018)).toBe("2018年度");
  });
});

describe("thousandYenToYen / yenToOku", () => {
  test("千円→円", () => {
    expect(thousandYenToYen(1_131_768)).toBe(1_131_768_000);
  });
  test("円→億円", () => {
    expect(yenToOku(100_000_000)).toBe(1);
    expect(yenToOku(1_131_768_000_000)).toBeCloseTo(11317.68, 2);
  });
});

describe("formatJapaneseYen", () => {
  test("兆＋億", () => {
    expect(formatJapaneseYen(1_131_768_000_000)).toBe("1兆1,317億円");
  });
  test("兆ちょうど", () => {
    expect(formatJapaneseYen(1_000_000_000_000)).toBe("1兆円");
  });
  test("億のみ", () => {
    expect(formatJapaneseYen(386_970_000_000)).toBe("3,869億円");
  });
  test("万", () => {
    expect(formatJapaneseYen(280_000)).toBe("28万円");
  });
  test("負の値", () => {
    expect(formatJapaneseYen(-500_000_000)).toBe("−5億円");
  });
  test("非数", () => {
    expect(formatJapaneseYen(Number.NaN)).toBe("—");
  });
});

describe("formatPct", () => {
  test("小数1桁", () => {
    expect(formatPct(33.913)).toBe("33.9%");
  });
  test("桁指定", () => {
    expect(formatPct(4.98, 2)).toBe("4.98%");
  });
  test("非数", () => {
    expect(formatPct(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

describe("formatPerCapita", () => {
  test("万円表示", () => {
    expect(formatPerCapita(690_000)).toBe("約69.0万円");
  });
  test("円表示", () => {
    expect(formatPerCapita(5_000)).toBe("約5,000円");
  });
});
