import { describe, expect, it } from "vitest";
import { extractLineRanges, stripSpeakerPrefix } from "./extract-speech";

describe("stripSpeakerPrefix", () => {
  it("質問者の登壇行から発言者表記を取り除く", () => {
    expect(
      stripSpeakerPrefix("◯39番（前野真実子）登壇　おはようございます。")
    ).toBe("おはようございます。");
  });

  it("2回目以降の質問行（登壇なし）からも取り除く", () => {
    expect(stripSpeakerPrefix("◯39番（前野真実子）　それでは、２回目に")).toBe(
      "それでは、２回目に"
    );
  });

  it("答弁者の役職付き行から取り除く", () => {
    expect(
      stripSpeakerPrefix("◯福祉局長（藤本広一）　御質問にお答えします。")
    ).toBe("御質問にお答えします。");
  });

  it("氏名に全角スペースを含む発言者にも対応する", () => {
    expect(stripSpeakerPrefix("◯52番（川口　浩）　答弁ありがとう")).toBe(
      "答弁ありがとう"
    );
  });

  it("発言者表記のない継続行は変更しない", () => {
    const line = "　次に、寄附金の使い道についてですが、";
    expect(stripSpeakerPrefix(line)).toBe(line);
  });

  it("本文中に現れる丸括弧は誤って削らない", () => {
    const line = "　令和８年度福岡市一般会計補正予算案（第１号）について";
    expect(stripSpeakerPrefix(line)).toBe(line);
  });
});

describe("extractLineRanges", () => {
  const lines = ["一行目", "二行目", "三行目", "四行目", "五行目"];

  it("指定した範囲を連結する", () => {
    expect(extractLineRanges(lines, [[2, 3]])).toBe("二行目\n三行目");
  });

  it("離れた複数の範囲を指定順に連結する", () => {
    expect(
      extractLineRanges(lines, [
        [1, 1],
        [4, 5],
      ])
    ).toBe("一行目\n四行目\n五行目");
  });

  it("切り出しながら発言者表記を取り除く", () => {
    expect(
      extractLineRanges(["◯51番（中山郁美）登壇　私は", "　まず、"], [[1, 2]])
    ).toBe("私は\n　まず、");
  });

  it("会議録の行数を超える範囲はエラーにする", () => {
    expect(() => extractLineRanges(lines, [[4, 6]])).toThrow(/行範囲が不正/);
  });

  it("開始行が終了行より後ろの範囲はエラーにする", () => {
    expect(() => extractLineRanges(lines, [[3, 2]])).toThrow(/行範囲が不正/);
  });

  it("0以下の行番号はエラーにする", () => {
    expect(() => extractLineRanges(lines, [[0, 2]])).toThrow(/行範囲が不正/);
  });
});
