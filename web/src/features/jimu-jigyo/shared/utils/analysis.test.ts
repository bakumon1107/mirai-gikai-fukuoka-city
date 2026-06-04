import { describe, expect, it } from "vitest";
import type { JimuJigyoData } from "../types/jimu-jigyo";
import { analyzeJimuJigyo } from "./analysis";

const baseData: JimuJigyoData = {
  事業名: "テスト事業",
  所管局: "テスト局",
  所管課: "テスト課",
  事業概要: {},
  指標: {
    成果指標: [
      {
        内容: "テスト指標",
        目標: { R5: 100, R6: 100, 最終年度: "R8年度" },
        実績: { R5: 80, R6: 90 },
        達成率: { R5: "80.0%", R6: "90.0%" },
      },
    ],
  },
  事業費_千円: {
    明細: [
      {
        年度: "R5",
        種別: "決算",
        会計区分: null,
        歳出: 10000,
        特定財源: 0,
        一般財源: 10000,
      },
      {
        年度: "R6",
        種別: "決算見込",
        会計区分: null,
        歳出: 10000,
        特定財源: 0,
        一般財源: 10000,
      },
    ],
    備考: null,
  },
};

describe("analyzeJimuJigyo", () => {
  it("KPI改善時の方向は up", () => {
    const result = analyzeJimuJigyo(baseData);
    expect(result.kpi.direction).toBe("up");
    expect(result.kpi.changeRate).toBeCloseTo(0.125, 2);
  });

  it("予算横ばい時の方向は flat", () => {
    const result = analyzeJimuJigyo(baseData);
    expect(result.budget.direction).toBe("flat");
  });

  it("KPI改善 + 予算横ばい → 効率改善", () => {
    const result = analyzeJimuJigyo(baseData);
    expect(result.efficiency.direction).toBe("up");
  });

  it("KPI悪化時の方向は down", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "悪化指標",
            目標: { R6: 100 },
            実績: { R5: 100, R6: 80 },
            達成率: { R5: "100.0%", R6: "80.0%" },
          },
        ],
      },
    };
    const result = analyzeJimuJigyo(data);
    expect(result.kpi.direction).toBe("down");
  });

  it("予算大幅増加時の方向は up", () => {
    const data: JimuJigyoData = {
      ...baseData,
      事業費_千円: {
        明細: [
          {
            年度: "R5",
            種別: "決算",
            会計区分: null,
            歳出: 10000,
            特定財源: 0,
            一般財源: 10000,
          },
          {
            年度: "R6",
            種別: "決算見込",
            会計区分: null,
            歳出: 15000,
            特定財源: 0,
            一般財源: 15000,
          },
        ],
        備考: null,
      },
    };
    const result = analyzeJimuJigyo(data);
    expect(result.budget.direction).toBe("up");
  });

  it("達成率テキスト「達成」は正常評価", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "テキスト達成指標",
            目標: { R6: null },
            実績: { R6: "各団体が実施" },
            達成率: { R5: "達成", R6: "達成" },
          },
        ],
      },
    };
    const result = analyzeJimuJigyo(data);
    expect(result.kpi.achievementRate).toBe(100);
    expect(result.kpi.text).toContain("達成");
  });

  it("調査未実施は unknown", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "調査指標",
            目標: { R6: 55 },
            実績: { R5: "調査未実施", R6: "調査未実施" },
            達成率: {},
          },
        ],
      },
    };
    const result = analyzeJimuJigyo(data);
    expect(result.kpi.direction).toBe("unknown");
    expect(result.kpi.text).toContain("調査");
  });

  it("分析テキストが空でない", () => {
    const result = analyzeJimuJigyo(baseData);
    expect(result.kpi.text.length).toBeGreaterThan(10);
    expect(result.budget.text.length).toBeGreaterThan(10);
    expect(result.efficiency.text.length).toBeGreaterThan(10);
  });
});

describe("slugify", () => {
  it("日本語事業名をスラッグ化する", async () => {
    const { slugify } = await import("./score");
    expect(slugify("認知症施策推進事業")).toBe("認知症施策推進事業");
  });
});
