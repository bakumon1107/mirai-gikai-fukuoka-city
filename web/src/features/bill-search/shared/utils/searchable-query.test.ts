import { describe, expect, it } from "vitest";
import { toSearchableQuery } from "./searchable-query";

describe("toSearchableQuery", () => {
  it("NFKC正規化とサニタイズを合成する（判定ズレの原因になる入力）", () => {
    // 組文字は正規化で展開される（1文字 → 4文字）
    expect(toSearchableQuery("㍿")).toBe("株式会社");
    // 半角カナ+濁点は1文字に合成される（2文字 → 1文字）
    expect(toSearchableQuery("ﾊﾟ")).toBe("パ");
  });

  it("構造文字の除去も適用される", () => {
    expect(toSearchableQuery("医,療")).toBe("医療");
  });

  it("通常の日本語はそのまま", () => {
    expect(toSearchableQuery("医療")).toBe("医療");
  });
});
