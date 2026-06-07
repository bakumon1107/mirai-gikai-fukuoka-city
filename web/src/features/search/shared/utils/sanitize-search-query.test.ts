import { describe, expect, it } from "vitest";
import { sanitizeSearchQuery } from "./sanitize-search-query";

describe("sanitizeSearchQuery", () => {
  it("通常の検索語句はそのまま返す", () => {
    expect(sanitizeSearchQuery("子育て支援")).toBe("子育て支援");
  });

  it("カンマを除去する", () => {
    expect(sanitizeSearchQuery("a,id.neq.0")).toBe("aidneq0");
  });

  it("ピリオドを除去する", () => {
    expect(sanitizeSearchQuery("R6.予算")).toBe("R6予算");
  });

  it("丸括弧を除去する", () => {
    expect(sanitizeSearchQuery("テスト(注入)")).toBe("テスト注入");
  });

  it("アスタリスクを除去する", () => {
    expect(sanitizeSearchQuery("a*b")).toBe("ab");
  });

  it("PostgRESTフィルタ構文への注入を試みる入力を無害化する", () => {
    expect(sanitizeSearchQuery("x,title.eq.漏洩,(or.true")).toBe(
      "xtitleeq漏洩ortrue"
    );
  });
});
