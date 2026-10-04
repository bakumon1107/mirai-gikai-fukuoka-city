import { describe, expect, it } from "vitest";
import {
  buildCommonRules,
  buildPartySections,
  buildServiceOverview,
  buildWebSearchRules,
} from "./shared-sections";

describe("buildPartySections", () => {
  it("党の公式サービスとして運営する場合は政党紹介を含める", () => {
    const result = buildPartySections(true);

    expect(result).toContain("チームみらいの概要");
    expect(result).toContain("2026年プラン");
  });

  it("非公式運営の場合は空文字列を返す（政党の紹介をプロンプトに混入させない）", () => {
    expect(buildPartySections(false)).toBe("");
  });
});

describe("buildServiceOverview", () => {
  const params = {
    siteName: "みらい議会＠サンプル市",
    councilName: "サンプル市議会",
    residentTerm: "市民",
  };

  it("サービス名・議会名・住民呼称が差し込まれる", () => {
    const result = buildServiceOverview(params);

    expect(result).toContain("みらい議会＠サンプル市");
    expect(result).toContain("サンプル市議会");
    expect(result).toContain("市民の意見を政治に届けるプラットフォーム");
  });

  it("県議会向けの呼称でも破綻しない", () => {
    const result = buildServiceOverview({
      siteName: "みらい議会＠サンプル県",
      councilName: "サンプル県議会",
      residentTerm: "県民",
    });

    expect(result).toContain("サンプル県議会");
    expect(result).toContain("県民の意見を政治に届けるプラットフォーム");
    expect(result).not.toContain("市民");
  });

  it("国会前提の表現と政党への言及を含まない", () => {
    const result = buildServiceOverview(params);

    expect(result).not.toContain("国会");
    expect(result).not.toContain("永田町");
    expect(result).not.toContain("チームみらい");
  });
});

describe("buildCommonRules", () => {
  const RECOMMENDATION_BAN =
    "特定の政党・会派・候補者を推奨したり、投票を呼びかけたりしない";

  it("サービス名が差し込まれ、政党名を含まない", () => {
    const result = buildCommonRules("みらい議会＠サンプル市", false);

    expect(result).toContain("みらい議会＠サンプル市");
    expect(result).not.toContain("チームみらい");
  });

  it("非公式運営では選挙運動とみなされうる振る舞いを禁止している", () => {
    const result = buildCommonRules("みらい議会＠サンプル市", false);

    expect(result).toContain(RECOMMENDATION_BAN);
  });

  /**
   * 公式運営時は buildPartySections が党の紹介・政策を差し込むため、
   * 推奨禁止ルールを併記すると指示が自己矛盾する。
   */
  it("公式運営では推奨禁止ルールを入れない（政党紹介との矛盾を避ける）", () => {
    const result = buildCommonRules("みらい議会", true);

    expect(result).not.toContain(RECOMMENDATION_BAN);
    expect(result).toContain("政治的に中立な立場を保つ");
  });

  it("どちらの構成でもルール行が壊れない", () => {
    for (const isOfficial of [true, false]) {
      const result = buildCommonRules("サンプル", isOfficial);

      expect(result.startsWith("ルール：\n")).toBe(true);
      expect(result).not.toContain("\n\n");
    }
  });
});

describe("buildWebSearchRules", () => {
  it("サービス名が差し込まれ、政党名を含まない", () => {
    const result = buildWebSearchRules("みらい議会＠サンプル市");

    expect(result).toContain("みらい議会＠サンプル市");
    expect(result).not.toContain("チームみらい");
  });
});
