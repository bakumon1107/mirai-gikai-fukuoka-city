"use client";

import { Button } from "@/components/ui/button";

interface QuickReplyButtonsProps {
  replies: string[];
  onSelect: (reply: string) => void;
  disabled?: boolean;
}

export function QuickReplyButtons({
  replies,
  onSelect,
  disabled = false,
}: QuickReplyButtonsProps) {
  if (replies.length === 0) {
    return null;
  }

  const isHorizontal = replies.length >= 5;

  return (
    <div
      className={
        isHorizontal
          ? "flex flex-row flex-wrap justify-end gap-2 mt-2 ml-auto w-1/2"
          : "flex flex-col items-end gap-2 mt-2"
      }
    >
      {replies.map((reply) => (
        <Button
          key={reply}
          type="button"
          variant="outline"
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="h-auto px-4 py-2 text-sm font-medium text-primary-accent border-primary-accent rounded-full bg-transparent shadow-none hover:bg-primary-accent/5 animate-fade-in disabled:cursor-not-allowed"
        >
          {reply}
        </Button>
      ))}
    </div>
  );
}
