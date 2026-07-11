import { describe, expect, it } from "vitest";
import {
  escapeIlikePattern,
  MAX_SEARCH_QUERY_LENGTH,
  sanitizeSearchQuery,
} from "./sanitize-search-query";

describe("sanitizeSearchQuery", () => {
  it("通常の日本語キーワードはそのまま保持する", () => {
    expect(sanitizeSearchQuery("医療")).toBe("医療");
    expect(sanitizeSearchQuery("子育て支援")).toBe("子育て支援");
  });

  it("PostgREST フィルタ構造文字 ( , . ( ) * ) を除去する", () => {
    expect(sanitizeSearchQuery("a,id.neq.0")).toBe("aidneq0");
    expect(sanitizeSearchQuery("foo(bar)*")).toBe("foobar");
    expect(sanitizeSearchQuery("税.金,(")).toBe("税金");
  });

  it("前後の空白をトリムする", () => {
    expect(sanitizeSearchQuery("  医療  ")).toBe("医療");
  });

  it("空文字・空白のみは空文字を返す", () => {
    expect(sanitizeSearchQuery("")).toBe("");
    expect(sanitizeSearchQuery("   ")).toBe("");
  });

  it("ilike ワイルドカード（% _）は除去しない（エスケープは escapeIlikePattern が担当）", () => {
    expect(sanitizeSearchQuery("50%")).toBe("50%");
    expect(sanitizeSearchQuery("a_b")).toBe("a_b");
  });

  it('引用符（"）を除去する（PostgRESTクォート値としての解釈を防ぐ）', () => {
    expect(sanitizeSearchQuery('医"療')).toBe("医療");
  });

  it("最大長を超える入力は切り詰める（DoS対策）", () => {
    const long = "あ".repeat(MAX_SEARCH_QUERY_LENGTH + 50);
    expect(sanitizeSearchQuery(long)).toHaveLength(MAX_SEARCH_QUERY_LENGTH);
  });

  it("2回適用しても結果が変わらない（冪等）", () => {
    const once = sanitizeSearchQuery("a,id.neq.0");
    expect(sanitizeSearchQuery(once)).toBe(once);
  });
});

describe("escapeIlikePattern", () => {
  it("通常の日本語キーワードはそのまま保持する", () => {
    expect(escapeIlikePattern("医療")).toBe("医療");
  });

  it("ワイルドカード % _ をエスケープする", () => {
    expect(escapeIlikePattern("50%")).toBe("50\\%");
    expect(escapeIlikePattern("a_b")).toBe("a\\_b");
    expect(escapeIlikePattern("%%")).toBe("\\%\\%");
  });

  it("バックスラッシュをエスケープする（末尾 \\ でパターンが壊れない）", () => {
    expect(escapeIlikePattern("abc\\")).toBe("abc\\\\");
  });

  it("空文字は空文字を返す", () => {
    expect(escapeIlikePattern("")).toBe("");
  });
});
