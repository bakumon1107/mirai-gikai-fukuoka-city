import { describe, expect, test } from "vitest";
import financeJson from "../../data/fukuoka-finance.json";
import type { FinanceData } from "../types";
import { buildFinanceView } from "./finance-view";

/**
 * 同梱済みの実データ（福岡市 地方財政状況資料集 由来）の健全性チェック。
 * 取得スクリプト更新時の回帰検知も兼ねる。
 */
describe("同梱データ fukuoka-finance.json", () => {
  const data = financeJson as FinanceData;
  const view = buildFinanceView(data);

  test("年度が連続して存在する", () => {
    expect(data.years.length).toBeGreaterThanOrEqual(2);
    expect(view.hasData).toBe(true);
    expect(view.latestYear).toBe(Math.max(...data.years));
  });

  test("歳入総額・歳出総額が妥当な桁（兆円規模・円換算）", () => {
    // 福岡市の歳入総額は概ね1兆円超
    expect(view.revenueTotalYen).toBeGreaterThan(1_000_000_000_000);
    expect(view.expenditureTotalYen).toBeGreaterThan(1_000_000_000_000);
    // 歳出 < 歳入（実質収支が黒字）
    expect(view.expenditureTotalYen ?? 0).toBeLessThan(
      view.revenueTotalYen ?? 0
    );
  });

  test("歳出目的別の合計 ≒ 歳出総額（同梱データの整合）", () => {
    const sumPurpose = view.expenditureComposition.reduce(
      (s, c) => s + c.amount,
      0
    );
    const total = view.expenditureTotalYen ?? 0;
    // 1%以内で一致
    expect(Math.abs(sumPurpose - total) / total).toBeLessThan(0.01);
  });

  test("民生費が最大の歳出費目", () => {
    expect(view.expenditureComposition[0]?.label).toBe("民生費");
  });

  test("自主財源・依存財源が算出され、合計が概ね100%", () => {
    expect(view.selfPct).not.toBeNull();
    expect(view.dependentPct).not.toBeNull();
    const total = (view.selfPct ?? 0) + (view.dependentPct ?? 0);
    expect(total).toBeGreaterThan(95);
    expect(total).toBeLessThanOrEqual(100.5);
  });

  test("人口が政令市規模（100万人超）", () => {
    expect(view.population ?? 0).toBeGreaterThan(1_000_000);
  });

  test("積み上げ系列は上位＋その他で構成され末尾がその他", () => {
    // 歳入: 上位5＋その他 = 最大6系列
    expect(view.revenueSourceTrend.length).toBeLessThanOrEqual(6);
    expect(view.revenueSourceTrend.at(-1)?.name).toBe("その他");
    // 歳出: 上位6＋その他 = 最大7系列
    expect(view.expenditureStackedTrend.length).toBeLessThanOrEqual(7);
    expect(view.expenditureStackedTrend.at(-1)?.name).toBe("その他");
    // 各系列が全年度分の値を持つ
    for (const s of view.expenditureStackedTrend) {
      expect(s.values.length).toBe(view.years.length);
    }
  });
});
