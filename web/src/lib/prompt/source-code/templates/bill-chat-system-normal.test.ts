import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site.config";
import { buildBillChatSystemNormalPrompt } from "./bill-chat-system-normal";

describe("buildBillChatSystemNormalPrompt", () => {
  it("4つのパラメータがプロンプトに埋め込まれる", () => {
    const result = buildBillChatSystemNormalPrompt(
      "テスト法案名",
      "テスト法案タイトル",
      "テスト法案要約",
      "テスト法案詳細"
    );

    expect(result).toContain("テスト法案名");
    expect(result).toContain("テスト法案タイトル");
    expect(result).toContain("テスト法案要約");
    expect(result).toContain("テスト法案詳細");
  });

  it("難易度「ふつう」セクションが含まれる", () => {
    const result = buildBillChatSystemNormalPrompt("a", "b", "c", "d");

    expect(result).toContain("回答の難易度：ふつう");
  });

  it("設定されたサービス名・議会名が含まれる", () => {
    const result = buildBillChatSystemNormalPrompt("a", "b", "c", "d");

    expect(result).toContain(siteConfig.siteName);
    expect(result).toContain(siteConfig.councilName);
  });

  it("非公式運営の設定では政党の紹介を含まない", () => {
    expect(siteConfig.features.showTeamMiraiSection).toBe(false);

    const result = buildBillChatSystemNormalPrompt("a", "b", "c", "d");

    expect(result).not.toContain("チームみらいの概要");
  });
});
