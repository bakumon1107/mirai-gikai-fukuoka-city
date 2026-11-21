import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CommitteeSpeech } from "../../shared/types";
import { ChatTranscript } from "./chat-transcript";

function render(speeches: CommitteeSpeech[]): string {
  return renderToStaticMarkup(
    createElement(ChatTranscript, {
      sections: [{ topic: null, speeches }],
    })
  );
}

function countBubbles(html: string): number {
  return html.match(/data-bubble=""/g)?.length ?? 0;
}

describe("ChatTranscript", () => {
  it("わかりやすい表現の空行ごとに吹き出しを分ける", () => {
    const html = render([
      {
        seq: 1,
        voiceNo: 1,
        speakerType: "member",
        text: "原文です。",
        simpleText: "前半の段落です。\n\n後半の段落です。",
      },
    ]);
    expect(countBubbles(html)).toBe(2);
    expect(html).toContain("前半の段落です。");
    expect(html).toContain("後半の段落です。");
    // 発言者の見出しは1つだけ
    expect(html.match(/質疑・意見/g)).toHaveLength(1);
  });

  it("空行の無い発言は吹き出し1つのまま", () => {
    const html = render([
      {
        seq: 1,
        voiceNo: 1,
        speakerType: "executive",
        text: "答弁の原文。",
        simpleText: "答弁は1段落です。",
      },
    ]);
    expect(countBubbles(html)).toBe(1);
  });
});
