import { describe, expect, it } from "vitest";
import type { JimuJigyoData } from "../types/jimu-jigyo";
import { calcFlags } from "./flags";

const baseData: JimuJigyoData = {
  事業名: "テスト事業",
  所管局: "テスト局",
  所管課: "テスト課",
  事業概要: {},
  指標: {
    成果指標: [
      {
        内容: "テスト指標",
        目標: { R6: 100, 最終年度: "R8年度" },
        実績: { R5: 90, R6: 95 },
        達成率: { R5: "90.0%", R6: "95.0%" },
      },
    ],
  },
  事業費_千円: {
    R5決算: { 歳出: 10000 },
    R6決算見込: { 歳出: 10000 },
  },
};

describe("calcFlags", () => {
  it("正常なデータにはフラグなし", () => {
    const flags = calcFlags(baseData);
    expect(flags).toHaveLength(0);
  });

  it("達成率150%超でlow_targetフラグ", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "件数",
            目標: { R6: 1000, 最終年度: "R8年度" },
            実績: { R5: 1000, R6: 2000 },
            達成率: { R6: "200.0%" },
          },
        ],
      },
    };
    const flags = calcFlags(data);
    expect(flags.some((f) => f.type === "low_target")).toBe(true);
  });

  it("目標値なしでmissing_kpiフラグ", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "割合",
            目標: { R6: null, 最終年度: "R8年度" },
            実績: { R6: 50 },
            達成率: {},
          },
        ],
      },
    };
    const flags = calcFlags(data);
    expect(flags.some((f) => f.type === "missing_kpi")).toBe(true);
  });

  it("予算30%超増加でbudget_surgeフラグ", () => {
    const data: JimuJigyoData = {
      ...baseData,
      事業費_千円: {
        R5決算: { 歳出: 10000 },
        R6決算見込: { 歳出: 15000 },
      },
    };
    const flags = calcFlags(data);
    expect(flags.some((f) => f.type === "budget_surge")).toBe(true);
  });

  it("主要指標10%超悪化でdecliningフラグ", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "割合",
            目標: { R6: 100, 最終年度: "R8年度" },
            実績: { R5: 100, R6: 80 },
            達成率: { R6: "80.0%" },
          },
        ],
      },
    };
    const flags = calcFlags(data);
    expect(flags.some((f) => f.type === "declining")).toBe(true);
  });

  it("最終年度未定でvague_goalフラグ", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "割合",
            目標: { R6: 100, 最終年度: "R年度" },
            実績: { R6: 95 },
            達成率: { R6: "95.0%" },
          },
        ],
      },
    };
    const flags = calcFlags(data);
    expect(flags.some((f) => f.type === "vague_goal")).toBe(true);
  });

  it("集計中でno_dataフラグ", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "割合",
            目標: { R6: 100, 最終年度: "R8年度" },
            実績: { R6: "集計中" },
            達成率: {},
          },
        ],
      },
    };
    const flags = calcFlags(data);
    expect(flags.some((f) => f.type === "no_data")).toBe(true);
  });

  it("調査未実施はno_dataフラグにならない（定期調査年外）", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "割合",
            目標: { R6: 100, 最終年度: "R8年度" },
            実績: { R6: "調査未実施" },
            達成率: {},
          },
        ],
      },
    };
    const flags = calcFlags(data);
    expect(flags.some((f) => f.type === "no_data")).toBe(false);
  });

  it("複数フラグが同時に付く", () => {
    const data: JimuJigyoData = {
      ...baseData,
      指標: {
        成果指標: [
          {
            内容: "割合",
            目標: { R6: null, 最終年度: "R年度" },
            実績: { R6: "集計中" },
            達成率: {},
          },
        ],
      },
      事業費_千円: {
        R5決算: { 歳出: 10000 },
        R6決算見込: { 歳出: 20000 },
      },
    };
    const flags = calcFlags(data);
    expect(flags.length).toBeGreaterThanOrEqual(3);
  });
});
