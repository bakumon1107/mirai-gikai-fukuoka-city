import { describe, expect, it } from "vitest";
import { getCandidateInitial, getCandidatePhotoClass } from "./candidate-photo";

describe("getCandidatePhotoClass", () => {
  it("表明順に4色を割り当てる", () => {
    expect(getCandidatePhotoClass(0)).toBe("bg-candidate-photo-1");
    expect(getCandidatePhotoClass(1)).toBe("bg-candidate-photo-2");
    expect(getCandidatePhotoClass(2)).toBe("bg-candidate-photo-3");
    expect(getCandidatePhotoClass(3)).toBe("bg-candidate-photo-4");
  });

  it("5人目以降は循環する", () => {
    expect(getCandidatePhotoClass(4)).toBe("bg-candidate-photo-1");
    expect(getCandidatePhotoClass(9)).toBe("bg-candidate-photo-2");
  });

  it("負のindexでも範囲内のクラスを返す", () => {
    expect(getCandidatePhotoClass(-1)).toBe("bg-candidate-photo-4");
  });
});

describe("getCandidateInitial", () => {
  it("姓の1文字目を返す", () => {
    expect(getCandidateInitial("渡辺 久也")).toBe("渡");
    expect(getCandidateInitial("西脇 ひろき")).toBe("西");
  });

  it("前後の空白を無視する", () => {
    expect(getCandidateInitial("  高島 宗一郎 ")).toBe("高");
  });

  it("空文字なら空文字を返す", () => {
    expect(getCandidateInitial("")).toBe("");
  });
});
