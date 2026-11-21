import { describe, expect, it } from "vitest";
import { splitBubbleParagraphs } from "./split-bubble-paragraphs";

describe("splitBubbleParagraphs", () => {
  it("空行が無ければ1つのまま返す", () => {
    expect(splitBubbleParagraphs("一文目です。二文目です。")).toEqual([
      "一文目です。二文目です。",
    ]);
  });

  it("空行ごとに分ける", () => {
    expect(splitBubbleParagraphs("前半です。\n\n後半です。")).toEqual([
      "前半です。",
      "後半です。",
    ]);
  });

  it("単独の改行では分けない", () => {
    expect(splitBubbleParagraphs("1行目\n2行目")).toEqual(["1行目\n2行目"]);
  });

  it("3つ以上の改行や空白だけの行も1つの区切りとして扱う", () => {
    expect(splitBubbleParagraphs("A。\n\n\nB。\n \nC。")).toEqual([
      "A。",
      "B。",
      "C。",
    ]);
  });

  it("前後の空行は無視する", () => {
    expect(splitBubbleParagraphs("\n\nA。\n\n")).toEqual(["A。"]);
  });

  it("空文字はそのまま返す", () => {
    expect(splitBubbleParagraphs("")).toEqual([""]);
  });

  it("空行だけの本文は空文字1つにする", () => {
    expect(splitBubbleParagraphs(" \n \n")).toEqual([""]);
  });

  it("同じ段落が繰り返されてもそれぞれ残す", () => {
    expect(splitBubbleParagraphs("以上です。\n\n本文。\n\n以上です。")).toEqual(
      ["以上です。", "本文。", "以上です。"]
    );
  });
});
