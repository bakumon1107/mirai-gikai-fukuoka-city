"use client";

import { MessageCircle } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import {
  ChatButton,
  type ChatButtonRef,
} from "@/features/chat/client/components/chat-button";

interface SearchChatBridgeProps {
  difficultyLevel: DifficultyLevelEnum;
  // 0件だった検索キーワード。指定時は「AIに聞く」ボタンを表示する
  noHitQuery?: string;
  // チャットのコンテキストに渡す検索結果の議案
  bills: Array<{
    name: string;
    summary?: string;
    tags?: string[];
  }>;
}

/**
 * 検索ページのAIチャット橋渡し。
 * 検索で見つからなかったキーワードをそのままAIチャットへ引き継ぎ、
 * キーワード一致では拾えない曖昧な質問を救済する。
 */
export function SearchChatBridge({
  difficultyLevel,
  noHitQuery,
  bills,
}: SearchChatBridgeProps) {
  const chatRef = useRef<ChatButtonRef>(null);

  return (
    <>
      {noHitQuery && (
        <div className="flex justify-center py-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => chatRef.current?.openWithText(noHitQuery)}
            className="gap-2 text-mirai-text-secondary"
          >
            <MessageCircle className="size-4" />
            AIチャットで「{noHitQuery}」について聞いてみる
          </Button>
        </div>
      )}
      <ChatButton
        ref={chatRef}
        difficultyLevel={difficultyLevel}
        pageContext={{ type: "home", bills }}
      />
    </>
  );
}
