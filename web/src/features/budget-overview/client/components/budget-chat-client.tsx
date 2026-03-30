"use client";

import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import { ChatButton } from "@/features/chat/client/components/chat-button";
import type { BudgetChatContext } from "@/features/chat/server/services/handle-chat-request";

interface BudgetChatClientProps {
  currentDifficulty: DifficultyLevelEnum;
  budget: BudgetChatContext;
}

export function BudgetChatClient({
  currentDifficulty,
  budget,
}: BudgetChatClientProps) {
  return (
    <ChatButton
      difficultyLevel={currentDifficulty}
      pageContext={{
        type: "budget",
        budget,
      }}
    />
  );
}
