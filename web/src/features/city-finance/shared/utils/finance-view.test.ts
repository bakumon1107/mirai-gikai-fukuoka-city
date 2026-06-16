import { describe, expect, test } from "vitest";
import type { FinanceData } from "../types";
import { buildFinanceView } from "./finance-view";

const fixture: FinanceData = {
  source: {
    name: "福岡市オープンデータ",
    url: "https://example.com",
    datasetId: "zaiseijoukyou-no-suii",
    fetchedAt: "2026-06-16",
  },
  unit: "thousand_yen",
  years: [2022, 2023],
  // 千円単位
  generalAccount: [
    {
      item: "歳入総額",
      values: [
        { year: 2022, value: 900_000_000 },
        { year: 2023, value: 1_000_000_000 },
      ],
    },
    {
      item: "歳出総額",
      values: [
        { year: 2022, value: 880_000_000 },
        { year: 2023, value: 980_000_000 },
      ],
    },
  ],
  revenue: [
    {
      item: "地方税",
      values: [
        { year: 2022, value: 350_000_000 },
        { year: 2023, value: 400_000_000 },
      ],
    },
    {
      item: "国庫支出金",
      values: [
        { year: 2022, value: 200_000_000 },
        { year: 2023, value: 220_000_000 },
      ],
    },
    {
      item: "地方交付税",
      values: [
        { year: 2022, value: 50_000_000 },
        { year: 2023, value: 60_000_000 },
      ],
    },
    { item: "合計", values: [{ year: 2023, value: 680_000_000 }] },
  ],
  expenditure: [
    {
      item: "民生費",
      values: [
        { year: 2022, value: 380_000_000 },
        { year: 2023, value: 400_000_000 },
      ],
    },
    {
      item: "教育費",
      values: [
        { year: 2022, value: 180_000_000 },
        { year: 2023, value: 190_000_000 },
      ],
    },
    { item: "一般会計歳出合計", values: [{ year: 2023, value: 980_000_000 }] },
  ],
  population: [
    { year: 2022, value: 1_600_000 },
    { year: 2023, value: 1_640_000 },
  ],
};

describe("buildFinanceView", () => {
  const v = buildFinanceView(fixture);

  test("最新年度と総額（円）", () => {
    expect(v.hasData).toBe(true);
    expect(v.latestYear).toBe(2023);
    // 1,000,000,000 千円 = 1,000,000,000,000 円
    expect(v.revenueTotalYen).toBe(1_000_000_000_000);
    expect(v.expenditureTotalYen).toBe(980_000_000_000);
  });

  test("前年比（歳入総額）", () => {
    // (1000 - 900) / 900 = 11.11%
    expect(v.revenueYoyPct).toBeCloseTo(11.11, 1);
  });

  test("人口・1人あたり歳出", () => {
    expect(v.population).toBe(1_640_000);
    // 980,000,000,000 / 1,640,000 ≈ 597,560 円
    expect(v.perCapitaExpenditureYen).toBeCloseTo(597_561, 0);
  });

  test("歳入構成と自主/依存比率", () => {
    // 合計行は除外される
    expect(v.revenueComposition.map((c) => c.label)).toEqual([
      "地方税",
      "国庫支出金",
      "地方交付税",
    ]);
    const jichi = v.revenueComposition.find((c) => c.label === "地方税");
    expect(jichi?.kind).toBe("self");
    // 地方税 400 / (400+220+60)=680 ≈ 58.8%
    expect(v.selfPct).toBeCloseTo(58.82, 1);
    expect(v.dependentPct).toBeCloseTo(41.18, 1);
  });

  test("歳出構成（合計行除外・降順）", () => {
    expect(v.expenditureComposition.map((c) => c.label)).toEqual([
      "民生費",
      "教育費",
    ]);
  });

  test("収入構造の推移（自主/依存・億円）", () => {
    expect(v.revenueTrend.map((t) => t.name)).toEqual(["自主財源", "依存財源"]);
    // 2023 自主財源 = 地方税400,000,000千円 = 4,000億円
    const self2023 = v.revenueTrend[0].values.find((x) => x.year === 2023);
    expect(self2023?.value).toBeCloseTo(4000, 0);
  });

  test("空データは hasData=false", () => {
    const empty = buildFinanceView({
      ...fixture,
      years: [],
      generalAccount: [],
      revenue: [],
      expenditure: [],
      population: null,
    });
    expect(empty.hasData).toBe(false);
  });
});
