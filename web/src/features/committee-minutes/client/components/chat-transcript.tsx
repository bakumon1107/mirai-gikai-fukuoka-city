"use client";

import { BookOpenText, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CommitteeSpeech } from "../../shared/types";
import type { TranscriptSection } from "../../shared/utils/build-transcript-sections";

type Props = {
  sections: TranscriptSection[];
};

/** 執行部の答弁を右、委員の質疑・意見を左に出す */
function isRightSide(speech: CommitteeSpeech): boolean {
  return speech.speakerType === "executive";
}

function SpeechBubble({
  speech,
  detailMode,
}: {
  speech: CommitteeSpeech;
  detailMode: boolean;
}) {
  const body = detailMode ? speech.text : (speech.simpleText ?? speech.text);

  // 開会時刻・傍聴・調査事項などの記録は中央のシステムメッセージとして表示する
  if (speech.speakerType === "note") {
    return (
      <p className="whitespace-pre-wrap text-center text-xs text-mirai-text-muted leading-relaxed">
        {body}
      </p>
    );
  }

  const right = isRightSide(speech);
  const badgeLabel = right ? "答弁" : "質疑・意見";
  const speakerLabel = right ? "執行部" : "委員";

  return (
    <div className={`flex ${right ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${right ? "text-right" : ""}`}>
        <div
          className={`mb-1 flex items-center gap-1.5 text-xs ${
            right ? "justify-end" : ""
          }`}
        >
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              right
                ? "bg-mirai-surface-grouped text-mirai-text-secondary"
                : "bg-mirai-gradient-start text-primary-accent"
            }`}
          >
            {badgeLabel}
          </span>
          <span className="font-bold text-mirai-text">{speakerLabel}</span>
        </div>
        <div
          className={`rounded-2xl px-4 py-3 text-left text-sm text-mirai-text-secondary leading-relaxed whitespace-pre-wrap border ${
            right
              ? "rounded-tr-sm bg-white border-mirai-border"
              : "rounded-tl-sm bg-mirai-gradient-end border-mirai-gradient-start"
          }`}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

export function ChatTranscript({ sections }: Props) {
  const [detailMode, setDetailMode] = useState(false);
  const hasSimpleText = sections.some((section) =>
    section.speeches.some((s) => s.simpleText)
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          aria-pressed={!detailMode}
          variant={detailMode ? "outline" : "default"}
          size="sm"
          onClick={() => setDetailMode(false)}
        >
          <MessageCircle className="w-4 h-4" />
          わかりやすい表現
        </Button>
        <Button
          aria-pressed={detailMode}
          variant={detailMode ? "default" : "outline"}
          size="sm"
          onClick={() => setDetailMode(true)}
        >
          <BookOpenText className="w-4 h-4" />
          詳しく（原文）
        </Button>
        {!detailMode && !hasSimpleText && (
          <p className="w-full text-xs text-mirai-text-muted">
            わかりやすい表現は現在準備中のため、原文を表示しています。
          </p>
        )}
      </div>

      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section
            key={section.topic?.id ?? "opening"}
            id={section.topic ? `topic-${section.topic.topicOrder}` : undefined}
            className="scroll-mt-24 flex flex-col gap-4"
          >
            {section.topic && (
              <h2 className="rounded-full bg-mirai-surface-grouped px-4 py-2 text-sm font-bold text-mirai-text leading-relaxed w-fit">
                {section.topic.topicOrder}. {section.topic.title}
              </h2>
            )}
            {section.speeches.map((speech) => (
              <SpeechBubble
                key={speech.seq}
                speech={speech}
                detailMode={detailMode}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
