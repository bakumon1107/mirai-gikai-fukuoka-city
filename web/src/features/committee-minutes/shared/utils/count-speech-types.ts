import type { CommitteeSpeech } from "../types";

/** 発言セグメント群のうち、委員の質疑・意見と執行部の答弁の件数を数える（noteは除外） */
export function countSpeechTypes(speeches: CommitteeSpeech[]): {
  member: number;
  executive: number;
} {
  let member = 0;
  let executive = 0;
  for (const s of speeches) {
    if (s.speakerType === "member") member++;
    else if (s.speakerType === "executive") executive++;
  }
  return { member, executive };
}
