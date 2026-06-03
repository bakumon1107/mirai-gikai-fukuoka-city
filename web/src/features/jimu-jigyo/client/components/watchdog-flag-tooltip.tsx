"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { WatchdogFlag } from "../../shared/types/jimu-jigyo";

const FLAG_ICON: Record<string, string> = {
  low_target: "🎯",
  missing_kpi: "📊",
  budget_surge: "💰",
  declining: "📉",
  vague_goal: "❓",
  no_data: "🔒",
};

const FLAG_ANCHOR: Record<string, string> = {
  low_target: "low-target",
  missing_kpi: "missing-kpi",
  budget_surge: "budget-surge",
  declining: "declining",
  vague_goal: "vague-goal",
  no_data: "no-data",
};

type Props = {
  flags: WatchdogFlag[];
  compact?: boolean;
};

export function WatchdogFlagTooltip({ flags, compact = false }: Props) {
  if (flags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((flag) => (
        <div key={flag.type} className="relative group/flag">
          {/* フォーカス・ホバー両対応のトリガー */}
          <Button
            variant="ghost"
            size="sm"
            aria-label={`${flag.label}: ${flag.detail}`}
            className={`
              rounded-full border border-mirai-border
              bg-mirai-surface-warm text-xs font-medium
              hover:bg-mirai-surface-warm focus-visible:ring-2
              ${compact ? "px-1.5 py-0.5 h-auto" : "px-2 py-1 h-auto"}
            `}
          >
            <span>{FLAG_ICON[flag.type]}</span>
            {!compact && (
              <span className="text-mirai-text-secondary ml-1">
                {flag.label}
              </span>
            )}
          </Button>

          {/* ツールチップ: hover と focus-within で表示 */}
          <div className="absolute bottom-full left-0 mb-2 z-50 w-64 hidden group-hover/flag:block group-focus-within/flag:block">
            <div className="bg-white border border-mirai-border rounded-lg shadow-lg p-3 text-xs">
              <p className="font-bold text-mirai-text mb-1">
                {FLAG_ICON[flag.type]} {flag.label}
              </p>
              <p className="text-mirai-text-secondary mb-2">{flag.detail}</p>
              <Link
                href={`/jimu-jigyo/about-score#${FLAG_ANCHOR[flag.type]}`}
                className="text-grade-b underline"
              >
                計算方法を詳しく見る →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
