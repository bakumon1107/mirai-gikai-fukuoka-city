"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ScoreBreakdown } from "../../shared/types/jimu-jigyo";

type Props = {
  breakdown: ScoreBreakdown;
};

export function ScoreRadarChart({ breakdown }: Props) {
  const data = [
    { subject: "成果KPI", value: Math.round((breakdown.kpiScore / 40) * 100) },
    {
      subject: "改善トレンド",
      value: Math.round((breakdown.trendScore / 30) * 100),
    },
    {
      subject: "透明性",
      value: Math.round((breakdown.transparencyScore / 20) * 100),
    },
    {
      subject: "予算効率",
      value: Math.round((breakdown.budgetScore / 10) * 100),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
        <Radar
          dataKey="value"
          stroke="var(--color-grade-b)"
          fill="var(--color-grade-b)"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
