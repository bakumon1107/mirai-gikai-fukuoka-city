"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ScoreBreakdown } from "../../shared/types/jimu-jigyo";
import { ScoreRadarChart } from "./score-radar-chart";

type Props = {
  score: number;
  breakdown: ScoreBreakdown;
};

export function ScoreBreakdownAccordion({ score, breakdown }: Props) {
  const [open, setOpen] = useState(false);

  const items = [
    { label: "成果KPI達成", value: breakdown.kpiScore, max: 40 },
    { label: "改善トレンド", value: breakdown.trendScore, max: 30 },
    { label: "透明性", value: breakdown.transparencyScore, max: 20 },
    { label: "予算効率", value: breakdown.budgetScore, max: 10 },
  ];

  return (
    <div className="border border-mirai-border rounded-lg overflow-hidden">
      <div className="p-4">
        <ScoreRadarChart breakdown={breakdown} />
        <p className="text-center text-2xl font-bold text-mirai-text mt-2">
          {score}{" "}
          <span className="text-sm font-normal text-mirai-text-muted">
            / 100点
          </span>
        </p>
      </div>

      <Button
        variant="ghost"
        onClick={() => setOpen((o) => !o)}
        className="w-full justify-start px-4 py-2 bg-mirai-surface border-t border-mirai-border rounded-none text-sm text-grade-b font-medium"
      >
        {open ? "▲" : "▼"} スコアの内訳を見る
      </Button>

      {open && (
        <div className="p-4 border-t border-mirai-border space-y-3">
          {items.map((item) => {
            const pct = Math.round((item.value / item.max) * 100);
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-mirai-text-secondary w-28 shrink-0">
                  {item.label}
                </span>
                <div className="flex-1 h-2 bg-mirai-surface-light rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-grade-b rounded-full progress-fill"
                    style={
                      { "--progress-width": `${pct}%` } as React.CSSProperties
                    }
                  />
                </div>
                <span className="text-sm font-bold text-mirai-text w-16 text-right shrink-0">
                  {item.value} / {item.max}点
                </span>
              </div>
            );
          })}
          <Link
            href="/jimu-jigyo/about-score"
            className="text-xs text-grade-b underline block mt-2"
          >
            計算方法を詳しく見る →
          </Link>
        </div>
      )}
    </div>
  );
}
