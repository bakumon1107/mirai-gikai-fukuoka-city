"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { GeneralQuestionTopic } from "../../shared/types";

interface GeneralQuestionTopicsProps {
  topics: GeneralQuestionTopic[];
}

export function GeneralQuestionTopics({ topics }: GeneralQuestionTopicsProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));

  function toggle(index: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {topics.map((topic, index) => {
        const isOpen = openIndices.has(index);
        const key = `${topic.title}-${index}`;
        return (
          <div
            key={key}
            className="border border-border rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-card hover:bg-muted transition-colors"
            >
              <span className="font-medium text-mirai-text">{topic.title}</span>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-mirai-text-muted shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-mirai-text-muted shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-4 py-4 border-t border-border bg-card space-y-4">
                <div>
                  <p className="text-xs font-semibold text-mirai-text-secondary mb-1">
                    質問
                  </p>
                  <p className="text-sm text-mirai-text">
                    {topic.question_summary}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-mirai-text-secondary mb-1">
                    答弁｜{topic.answerer_role}
                    {topic.answerer_name ? `　${topic.answerer_name}` : ""}
                  </p>
                  <p className="text-sm text-mirai-text">
                    {topic.answer_summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
