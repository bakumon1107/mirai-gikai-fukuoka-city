import { describe, expect, it } from "vitest";
import type { CommitteeSpeech } from "../types";
import { countSpeechTypes } from "./count-speech-types";

function speech(
  seq: number,
  speakerType: CommitteeSpeech["speakerType"]
): CommitteeSpeech {
  return { seq, voiceNo: seq, speakerType, text: `t${seq}` };
}

describe("countSpeechTypes", () => {
  it("委員と執行部を数え、noteは除外する", () => {
    const speeches: CommitteeSpeech[] = [
      speech(1, "note"),
      speech(2, "member"),
      speech(3, "executive"),
      speech(4, "member"),
      speech(5, "note"),
    ];
    expect(countSpeechTypes(speeches)).toEqual({ member: 2, executive: 1 });
  });

  it("空配列は0件", () => {
    expect(countSpeechTypes([])).toEqual({ member: 0, executive: 0 });
  });
});
