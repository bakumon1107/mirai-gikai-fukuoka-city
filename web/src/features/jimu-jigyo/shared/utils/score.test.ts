import { describe, expect, it } from "vitest";
import type { JimuJigyoData } from "../types/jimu-jigyo";
import {
  calcBudgetScore,
  calcKpiScore,
  calcScore,
  calcTrendScore,
  slugify,
} from "./score";

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
    R5決算: { 歳出: 10000, 特定財源: 0, 一般財源: 10000 },
    R6決算見込: { 歳出: 10000, 特定財源: 0, 一般財源: 10000 },
  },
};

describe("calcKpiScore", () => {
  it("成果指標なしの場合は0.5を返す", () => {
    expect(calcKpiScore(undefined)).toBe(0.5);
    expect(calcKpiScore([])).toBe(0.5);
  });

  it("達成率80〜100%は係数0.7", () => {
    const kpi = [
      {
        内容: "test",
        目標: { R6: 100 },
        実績: { R6: 85 },
        達成率: { R6: "85.0%" },
      },
    ];
    expect(calcKpiScore(kpi)).toBe(0.7);
  });

  it("達成率100〜150%は係数1.0", () => {
    const kpi = [
      {
        内容: "test",
        目標: { R6: 100 },
        実績: { R6: 110 },
        達成率: { R6: "110.0%" },
      },
    ];
    expect(calcKpiScore(kpi)).toBe(1.0);
  });

  it("達成率150%超は係数0.8（目標低すぎ）", () => {
    const kpi = [
      {
        内容: "test",
        目標: { R6: 100 },
        実績: { R6: 200 },
        達成率: { R6: "200.0%" },
      },
    ];
    expect(calcKpiScore(kpi)).toBe(0.8);
  });

  it("実績が集計中は係数0.1", () => {
    const kpi = [
      {
        内容: "test",
        目標: { R6: 100 },
        実績: { R6: "集計中" },
        達成率: {},
      },
    ];
    expect(calcKpiScore(kpi)).toBe(0.1);
  });

  it("目標値なしは係数0.5", () => {
    const kpi = [
      {
        内容: "test",
        目標: { R6: null },
        実績: { R6: 50 },
        達成率: {},
      },
    ];
    expect(calcKpiScore(kpi)).toBe(0.5);
  });
});

describe("calcTrendScore", () => {
  it("R5→R6で10%以上改善は1.0", () => {
    const data = {
      ...baseData,
      指標: {
        成果指標: [
          { 内容: "t", 目標: {}, 実績: { R5: 100, R6: 115 }, 達成率: {} },
        ],
      },
    };
    expect(calcTrendScore(data)).toBe(1.0);
  });

  it("R5→R6で0〜10%改善は20/30", () => {
    const data = {
      ...baseData,
      指標: {
        成果指標: [
          { 内容: "t", 目標: {}, 実績: { R5: 100, R6: 105 }, 達成率: {} },
        ],
      },
    };
    expect(calcTrendScore(data)).toBeCloseTo(20 / 30, 5);
  });

  it("R5→R6で-10%超悪化は0", () => {
    const data = {
      ...baseData,
      指標: {
        成果指標: [
          { 内容: "t", 目標: {}, 実績: { R5: 100, R6: 80 }, 達成率: {} },
        ],
      },
    };
    expect(calcTrendScore(data)).toBe(0);
  });

  it("実績が未集計の場合は0.5", () => {
    const data = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "t",
            目標: {},
            実績: { R5: "調査未実施", R6: "調査未実施" },
            達成率: {},
          },
        ],
      },
    };
    expect(calcTrendScore(data)).toBe(0.5);
  });
});

// 達成率なしデータ（フォールバックテスト用）
const noRateData: JimuJigyoData = {
  ...baseData,
  指標: {
    成果指標: [
      {
        内容: "テスト指標",
        目標: { R6: 100 },
        実績: { R5: 80, R6: 90 },
        達成率: {}, // 達成率なし → フォールバック
      },
    ],
  },
};

describe("calcBudgetScore", () => {
  it("達成率データなし・予算安定はフォールバック0.75", () => {
    const data = {
      ...noRateData,
      事業費_千円: {
        R5決算: { 歳出: 10000 },
        R6決算見込: { 歳出: 10000 },
      },
    };
    expect(calcBudgetScore(data)).toBe(0.75);
  });

  it("達成率データなし・5〜30%増加はフォールバック0.5", () => {
    const data = {
      ...noRateData,
      事業費_千円: {
        R5決算: { 歳出: 10000 },
        R6決算見込: { 歳出: 12000 },
      },
    };
    expect(calcBudgetScore(data)).toBe(0.5);
  });

  it("達成率データなし・30%超増加はフォールバック0.25", () => {
    const data = {
      ...noRateData,
      事業費_千円: {
        R5決算: { 歳出: 10000 },
        R6決算見込: { 歳出: 14000 },
      },
    };
    expect(calcBudgetScore(data)).toBe(0.25);
  });

  it("予算増加でもKPI効率が10%以上向上なら1.0", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "利用者数",
            目標: { R6: 100 },
            実績: { R5: 80, R6: 90 },
            達成率: { R5: "80.0%", R6: "100.0%" }, // R6で達成率大幅改善
          },
        ],
      },
      事業費_千円: {
        R5決算: { 歳出: 10000 },
        R6決算見込: { 歳出: 10500 }, // 予算5%増
      },
    };
    // R5効率 = 80/10000 = 0.008, R6効率 = 100/10500 ≈ 0.00952
    // 効率変化 ≈ +19% → 1.0
    expect(calcBudgetScore(data)).toBe(1.0);
  });

  it("予算増加 + KPI効率悪化は最低0.25（下限あり）", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "利用者数",
            目標: { R6: 100 },
            実績: { R5: 90, R6: 85 },
            達成率: { R5: "90.0%", R6: "80.0%" }, // 達成率低下
          },
        ],
      },
      事業費_千円: {
        R5決算: { 歳出: 10000 },
        R6決算見込: { 歳出: 13000 }, // 予算30%増
      },
    };
    // R5効率 = 90/10000 = 0.009, R6効率 = 80/13000 ≈ 0.00615
    // 効率変化 ≈ -32% → 0
    expect(calcBudgetScore(data)).toBe(0.25);
  });
});

describe("calcScore", () => {
  it("スコアが0〜100の範囲に収まる", () => {
    const result = calcScore(baseData);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("スコア80以上はグレードA", () => {
    const highData: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "t",
            目標: { R6: 100, 最終年度: "R8年度" },
            実績: { R5: 90, R6: 100 },
            達成率: { R6: "100.0%" },
          },
        ],
      },
      事業費_千円: {
        R5決算: { 歳出: 10000 },
        R6決算見込: { 歳出: 9000 },
      },
    };
    const result = calcScore(highData);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.grade).toBe("A");
  });

  it("内訳の合計が総合スコアと一致する", () => {
    const result = calcScore(baseData);
    const sum =
      result.breakdown.kpiScore +
      result.breakdown.trendScore +
      result.breakdown.transparencyScore +
      result.breakdown.budgetScore;
    expect(Math.abs(result.score - sum)).toBeLessThanOrEqual(4);
  });
});

describe("slugify", () => {
  it("日本語文字列をslug化する", () => {
    const result = slugify("認知症施策推進事業");
    expect(result).toBe("認知症施策推進事業");
  });

  it("スペースをハイフンに変換する", () => {
    const result = slugify("test 事業");
    expect(result).toBe("test-事業");
  });
});
