import { describe, expect, it } from "vitest";
import { buildContentRichnessPrompt } from "./build-content-richness-prompt";

describe("buildContentRichnessPrompt", () => {
  it("会話ログ・要約・意見・背景をすべて含むプロンプトを生成する", () => {
    const result = buildContentRichnessPrompt({
      summary: "テスト要約",
      opinions: [{ title: "意見1", content: "内容1" }],
      roleDescription: "IT企業経営者",
      messages: [
        { role: "assistant", content: "こんにちは" },
        { role: "user", content: "議案に賛成です" },
      ],
      residentTerm: "市民",
    });

    expect(result).toContain("会話ログ");
    expect(result).toContain("[assistant] こんにちは");
    expect(result).toContain("[user] 議案に賛成です");
    expect(result).toContain("テスト要約");
    expect(result).toContain("意見1");
    expect(result).toContain("内容1");
    expect(result).toContain("IT企業経営者");
    expect(result).toContain("情報充実度を評価する専門家");
  });

  it("内容がない場合は「内容なし」を含む", () => {
    const result = buildContentRichnessPrompt({
      summary: null,
      opinions: null,
      roleDescription: null,
      messages: [],
      residentTerm: "市民",
    });

    expect(result).toContain("（内容なし）");
  });

  it("共通の情報充実度評価基準が含まれる", () => {
    const result = buildContentRichnessPrompt({
      summary: "要約",
      opinions: null,
      roleDescription: null,
      messages: [],
      residentTerm: "市民",
    });

    expect(result).toContain("content_richness（情報充実度）");
    expect(result).toContain("**total**");
    expect(result).toContain("**clarity**");
    expect(result).toContain("**specificity**");
    expect(result).toContain("**impact**");
    expect(result).toContain("**constructiveness**");
    expect(result).toContain("スコアリング基準");
  });

  it("意見が空配列の場合は意見セクションを含まない", () => {
    const result = buildContentRichnessPrompt({
      summary: "要約",
      opinions: [],
      roleDescription: null,
      messages: [],
      residentTerm: "市民",
    });

    expect(result).not.toContain("## 意見");
  });

  it("residentTerm を住民の呼称として差し込む", () => {
    const result = buildContentRichnessPrompt({
      summary: "要約",
      opinions: null,
      roleDescription: null,
      messages: [],
      residentTerm: "県民",
    });

    expect(result).toContain("県民意見の情報充実度");
    expect(result).not.toContain("市民意見の情報充実度");
  });

  it("国会前提の「法案」ではなく地方議会の「議案」を使う", () => {
    const result = buildContentRichnessPrompt({
      summary: "要約",
      opinions: null,
      roleDescription: null,
      messages: [],
      residentTerm: "市民",
    });

    expect(result).toContain("議案検討");
    expect(result).not.toContain("法案");
  });
});
