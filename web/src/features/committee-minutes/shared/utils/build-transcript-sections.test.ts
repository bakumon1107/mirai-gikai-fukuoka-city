import { describe, expect, it } from "vitest";
import type { CommitteeMeetingTopic, CommitteeSpeech } from "../types";
import { buildTranscriptSections } from "./build-transcript-sections";

function speech(seq: number, voiceNo = seq): CommitteeSpeech {
  return { seq, voiceNo, speakerType: "member", text: `t${seq}` };
}

function topic(
  topicOrder: number,
  startVoiceNo: number | null,
  endVoiceNo: number | null
): CommitteeMeetingTopic {
  return {
    id: `topic-${topicOrder}`,
    topicOrder,
    title: `議題${topicOrder}`,
    summary: null,
    discussionSummary: null,
    startVoiceNo,
    endVoiceNo,
  };
}

describe("buildTranscriptSections", () => {
  it("議題が無ければ全発言を1セクションにまとめる", () => {
    const speeches = [speech(1), speech(2), speech(3)];
    const sections = buildTranscriptSections(speeches, []);
    expect(sections).toHaveLength(1);
    expect(sections[0].topic).toBeNull();
    expect(sections[0].speeches).toHaveLength(3);
  });

  it("発言が無ければ空", () => {
    expect(buildTranscriptSections([], [])).toEqual([]);
  });

  it("議題より前の発言は先頭のnullセクションに入る", () => {
    const speeches = [speech(1), speech(2), speech(3)];
    const sections = buildTranscriptSections(speeches, [topic(1, 2, null)]);
    expect(sections[0].topic).toBeNull();
    expect(sections[0].speeches.map((s) => s.seq)).toEqual([1]);
    expect(sections[1].topic?.topicOrder).toBe(1);
    expect(sections[1].speeches.map((s) => s.seq)).toEqual([2, 3]);
  });

  it("endVoiceNoを尊重し、議題の範囲外の発言を取り込まない", () => {
    const speeches = [speech(1), speech(2), speech(3), speech(4), speech(5)];
    // 議題1は seq1〜2、議題2は seq4〜5。seq3はどちらの範囲外
    const sections = buildTranscriptSections(speeches, [
      topic(1, 1, 2),
      topic(2, 4, 5),
    ]);
    expect(sections[0].speeches.map((s) => s.seq)).toEqual([1, 2]);
    expect(sections[1].speeches.map((s) => s.seq)).toEqual([4, 5]);
  });

  it("範囲判定は voiceNo ではなく seq で行う", () => {
    // seq と voiceNo を意図的にずらす。startVoiceNo/endVoiceNo は seq を指す契約
    // のため、範囲は seq（1〜2, 3〜4）で判定され voiceNo(101〜104)には依存しない。
    const speeches = [
      speech(1, 101),
      speech(2, 102),
      speech(3, 103),
      speech(4, 104),
    ];
    const sections = buildTranscriptSections(speeches, [
      topic(1, 1, 2),
      topic(2, 3, 4),
    ]);
    expect(sections[0].speeches.map((s) => s.seq)).toEqual([1, 2]);
    expect(sections[1].speeches.map((s) => s.seq)).toEqual([3, 4]);
  });

  it("endVoiceNoが無い最終議題は残り全部を含む", () => {
    const speeches = [speech(1), speech(2), speech(3)];
    const sections = buildTranscriptSections(speeches, [topic(1, 1, null)]);
    expect(sections[0].topic?.topicOrder).toBe(1);
    expect(sections[0].speeches.map((s) => s.seq)).toEqual([1, 2, 3]);
  });
});
