import { describe, expect, it } from "vitest";
import { isPlaceholderUrl } from "./is-placeholder-url";

describe("isPlaceholderUrl", () => {
  it("空文字列を未設定として扱う", () => {
    expect(isPlaceholderUrl("")).toBe(true);
  });

  it("空白のみの文字列を未設定として扱う", () => {
    expect(isPlaceholderUrl("   ")).toBe(true);
  });

  it("テンプレートのリポジトリURLをプレースホルダと判定する", () => {
    expect(
      isPlaceholderUrl("https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY")
    ).toBe(true);
  });

  it("プレースホルダの大文字小文字を区別しない", () => {
    expect(isPlaceholderUrl("https://github.com/your_account/my-fork")).toBe(
      true
    );
  });

  it("example.com をプレースホルダと判定する", () => {
    expect(isPlaceholderUrl("https://example.com/contact")).toBe(true);
  });

  it("example.lg.jp をプレースホルダと判定する", () => {
    expect(isPlaceholderUrl("https://www.example.lg.jp/gikai/giketsu/")).toBe(
      true
    );
  });

  it("前後に空白があってもプレースホルダを検出する", () => {
    expect(
      isPlaceholderUrl("  https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY  ")
    ).toBe(true);
  });

  it("設定済みのリポジトリURLはプレースホルダではない", () => {
    expect(
      isPlaceholderUrl("https://github.com/bakumon1107/mirai-gikai-newcity")
    ).toBe(false);
  });

  it("設定済みの自治体サイトURLはプレースホルダではない", () => {
    expect(isPlaceholderUrl("https://www.city.osaka.lg.jp/shikai/")).toBe(
      false
    );
  });

  it("プレースホルダに似ていない任意のURLはプレースホルダではない", () => {
    expect(isPlaceholderUrl("https://x.com/some_account")).toBe(false);
  });
});
