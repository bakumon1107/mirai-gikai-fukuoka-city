import { describe, expect, it } from "vitest";
import { mergeSimpleTexts } from "./apply-ai-content-utils";
import type { Segment } from "./parse-committee-minutes";

const speeches: Segment[] = [
  { seq: 1, voiceNo: 1, speakerType: "member", text: "質問です。" },
  { seq: 2, voiceNo: 1, speakerType: "executive", text: "答えです。" },
  { seq: 3, voiceNo: 2, speakerType: "note", text: "開会。" },
];

describe("mergeSimpleTexts", () => {
  it("seqでsimpleTextをマージする", () => {
    const { speeches: merged } = mergeSimpleTexts(speeches, [
      { seq: 1, simpleText: "かんたんな質問。" },
      { seq: 2, simpleText: "かんたんな答え。" },
    ]);
    expect(merged[0].simpleText).toBe("かんたんな質問。");
    expect(merged[1].simpleText).toBe("かんたんな答え。");
    expect(merged[2].simpleText).toBeUndefined();
  });

  it("seqが重複したら例外", () => {
    expect(() =>
      mergeSimpleTexts(speeches, [
        { seq: 1, simpleText: "a" },
        { seq: 1, simpleText: "b" },
      ])
    ).toThrow(/重複/);
  });

  it("simpleTextが空なら例外", () => {
    expect(() =>
      mergeSimpleTexts(speeches, [{ seq: 1, simpleText: "  " }])
    ).toThrow(/空/);
  });

  it("発言に存在しないseqは警告", () => {
    const { warnings } = mergeSimpleTexts(speeches, [
      { seq: 1, simpleText: "a" },
      { seq: 2, simpleText: "b" },
      { seq: 99, simpleText: "存在しない" },
    ]);
    expect(warnings.some((w) => w.includes("99"))).toBe(true);
  });

  it("未被覆の質疑・答弁は警告（noteは対象外）", () => {
    const { warnings } = mergeSimpleTexts(speeches, [
      { seq: 1, simpleText: "a" },
    ]);
    // seq2(executive)が未被覆で警告、seq3(note)は対象外
    expect(warnings.some((w) => w.includes("2"))).toBe(true);
    expect(warnings.some((w) => w.includes("3"))).toBe(false);
  });

  it("全被覆なら警告なし", () => {
    const { warnings } = mergeSimpleTexts(speeches, [
      { seq: 1, simpleText: "a" },
      { seq: 2, simpleText: "b" },
    ]);
    expect(warnings).toEqual([]);
  });
});
