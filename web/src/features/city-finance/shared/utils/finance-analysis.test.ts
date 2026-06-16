import { describe, expect, test } from "vitest";
import type { FinanceSeries } from "../types";
import {
  alignSeries,
  classifyRevenue,
  findSeries,
  isTotalRow,
  latestYear,
  perCapitaYen,
  toLatestComposition,
  valueForYear,
  withShares,
  yoyPct,
} from "./finance-analysis";

const minsei: FinanceSeries = {
  item: "民生費",
  values: [
    { year: 2022, value: 380_000 },
    { year: 2023, value: 386_970 },
  ],
};

describe("valueForYear / latestYear", () => {
  test("該当年度の値", () => {
    expect(valueForYear(minsei, 2023)).toBe(386_970);
    expect(valueForYear(minsei, 2019)).toBeNull();
  });
  test("最新年度", () => {
    expect(latestYear([2014, 2023, 2019])).toBe(2023);
    expect(latestYear([])).toBeNull();
  });
});

describe("yoyPct", () => {
  test("増加率", () => {
    expect(yoyPct(100, 110)).toBeCloseTo(10, 5);
  });
  test("減少率", () => {
    expect(yoyPct(200, 150)).toBeCloseTo(-25, 5);
  });
  test("前年0やnullはnull", () => {
    expect(yoyPct(0, 100)).toBeNull();
    expect(yoyPct(null, 100)).toBeNull();
  });
});

describe("perCapitaYen", () => {
  test("1人あたり", () => {
    expect(perCapitaYen(1_640_000_000, 1_640_000)).toBe(1000);
  });
  test("人口0はnull", () => {
    expect(perCapitaYen(100, 0)).toBeNull();
  });
});

describe("withShares", () => {
  test("構成比を付与", () => {
    const r = withShares([
      { label: "A", amount: 30 },
      { label: "B", amount: 70 },
    ]);
    expect(r[0].pct).toBeCloseTo(30, 5);
    expect(r[1].pct).toBeCloseTo(70, 5);
  });
  test("合計0でも例外を出さない", () => {
    expect(withShares([{ label: "A", amount: 0 }])[0].pct).toBe(0);
  });
});

describe("classifyRevenue", () => {
  test("自主財源", () => {
    expect(classifyRevenue("地方税")).toBe("self");
    expect(classifyRevenue("使用料及び手数料")).toBe("self");
  });
  test("依存財源", () => {
    expect(classifyRevenue("地方交付税")).toBe("dependent");
    expect(classifyRevenue("国庫支出金")).toBe("dependent");
    expect(classifyRevenue("地方債")).toBe("dependent");
    expect(classifyRevenue("地方消費税交付金")).toBe("dependent");
  });
  test("地方税は交付税に誤分類されない", () => {
    expect(classifyRevenue("地方税")).not.toBe("dependent");
  });
  test("その他", () => {
    expect(classifyRevenue("不明な項目")).toBe("other");
  });
});

describe("isTotalRow / toLatestComposition", () => {
  test("合計行判定", () => {
    expect(isTotalRow("歳出合計")).toBe(true);
    expect(isTotalRow("民生費")).toBe(false);
  });
  test("最新年度の構成（合計除外・降順）", () => {
    const list: FinanceSeries[] = [
      { item: "合計", values: [{ year: 2023, value: 999 }] },
      { item: "教育費", values: [{ year: 2023, value: 188 }] },
      { item: "民生費", values: [{ year: 2023, value: 386 }] },
    ];
    const comp = toLatestComposition(list, 2023);
    expect(comp.map((c) => c.label)).toEqual(["民生費", "教育費"]);
  });
});

describe("findSeries", () => {
  test("パターン一致の系列を返す", () => {
    const list: FinanceSeries[] = [
      { item: "歳入総額", values: [{ year: 2023, value: 100 }] },
      { item: "歳出総額", values: [{ year: 2023, value: 90 }] },
    ];
    expect(findSeries(list, /歳入(総額|合計)/)?.item).toBe("歳入総額");
    expect(findSeries(list, /該当なし/)).toBeNull();
  });
});

describe("alignSeries", () => {
  test("年度昇順・欠損は0", () => {
    const r = alignSeries(minsei, [2023, 2022, 2021]);
    expect(r).toEqual([
      { year: 2021, value: 0 },
      { year: 2022, value: 380_000 },
      { year: 2023, value: 386_970 },
    ]);
  });
});
