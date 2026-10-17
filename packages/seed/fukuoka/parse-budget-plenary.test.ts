import { describe, expect, it } from "vitest";
import type { Segment } from "./parse-committee-minutes";
import {
  buildBlockRawText,
  extractSpeakerName,
  splitIntoBlocks,
} from "./parse-budget-plenary";

function seg(
  seq: number,
  speakerType: Segment["speakerType"],
  text: string
): Segment {
  return { seq, voiceNo: seq, speakerType, text };
}

describe("extractSpeakerName", () => {
  it("発言冒頭の委員名を取り出す", () => {
    expect(extractSpeakerName("調委員　自由民主党福岡市議団を代表し")).toBe(
      "調"
    );
  });

  it("同姓を書き分けた表記も取り出す", () => {
    expect(extractSpeakerName("田中（た）委員　福岡市民クラブを代表して")).toBe(
      "田中（た）"
    );
    expect(extractSpeakerName("あべ（ひ）委員　５歳児健診について")).toBe(
      "あべ（ひ）"
    );
  });

  it("答弁（局長）は委員名として取り出さない", () => {
    expect(extractSpeakerName("経済観光文化局長　市内には、")).toBeNull();
  });

  it("名前の後に区切りがない場合はnullを返す", () => {
    expect(extractSpeakerName("委員会の運営について")).toBeNull();
  });
});

describe("splitIntoBlocks", () => {
  const speeches: Segment[] = [
    seg(1, "note", "３月23日　　午前10時０分開会"),
    seg(2, "member", "調委員　自由民主党福岡市議団を代表し、質疑を行う。"),
    seg(3, "executive", "経済観光文化局長　約100社が立地している。"),
    seg(4, "member", "調委員　重ねて尋ねる。"),
    seg(5, "executive", "教育長　令和11年４月の開校を目指している。"),
    seg(6, "member", "新村委員　新しい風ふくおかを代表して、質疑を行う。"),
    seg(7, "executive", "市民局長　啓発に取り組んでいる。"),
  ];

  it("質問者が替わるところで分割し、答弁は直前の質問者に含める", () => {
    const blocks = splitIntoBlocks(speeches);
    expect(blocks).toHaveLength(2);

    expect(blocks[0].startSeq).toBe(2);
    expect(blocks[0].endSeq).toBe(5);
    expect(blocks[0].questionerName).toBe("調崇史");
    expect(blocks[0].party).toBe("自由民主党福岡市議団");
    expect(blocks[0].memberCount).toBe(2);
    expect(blocks[0].executiveCount).toBe(2);

    expect(blocks[1].startSeq).toBe(6);
    expect(blocks[1].endSeq).toBe(7);
    expect(blocks[1].questionerName).toBe("新村まさる");
  });

  it("冒頭の記録（note）はどのブロックにも含めない", () => {
    const blocks = splitIntoBlocks(speeches);
    const seqs = blocks.flatMap((b) => b.segments.map((s) => s.seq));
    expect(seqs).not.toContain(1);
    expect(seqs).toEqual([2, 3, 4, 5, 6, 7]);
  });

  it("名寄せできない発言者があればエラーにする", () => {
    const unknown = [
      seg(1, "member", "架空委員　会派を代表して質疑を行う。"),
    ];
    expect(() => splitIntoBlocks(unknown)).toThrow(/名寄せできません/);
  });

  it("原文は発言順に連結する", () => {
    const blocks = splitIntoBlocks(speeches);
    expect(buildBlockRawText(blocks[1])).toBe(
      "新村委員　新しい風ふくおかを代表して、質疑を行う。\n\n市民局長　啓発に取り組んでいる。"
    );
  });
});
