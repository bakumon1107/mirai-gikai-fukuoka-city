"use client";

import { Pie, PieChart, Tooltip } from "recharts";

type GradeCounts = { A: number; B: number; C: number; D: number };

type Props = {
  counts: GradeCounts;
  total: number;
  averageScore: number;
  totalBudgetManYen: number;
};

const GRADE_COLORS = {
  A: "var(--color-grade-a)",
  B: "var(--color-grade-b)",
  C: "var(--color-grade-c)",
  D: "var(--color-grade-d)",
};

export function GradeSummaryChart({
  counts,
  total,
  averageScore,
  totalBudgetManYen,
}: Props) {
  const data = [
    { name: "A", count: counts.A, fill: GRADE_COLORS.A },
    { name: "B", count: counts.B, fill: GRADE_COLORS.B },
    { name: "C", count: counts.C, fill: GRADE_COLORS.C },
    { name: "D", count: counts.D, fill: GRADE_COLORS.D },
  ].filter((d) => d.count > 0);

  return (
    <div className="bg-white border border-mirai-border rounded-lg p-4">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* ドーナツチャート: 固定サイズで SSR 時の width=-1 を回避 */}
        <div className="w-40 h-40 shrink-0">
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              strokeWidth={0}
            />
            <Tooltip
              formatter={(value, name) => [`${value}件`, `グレード${name}`]}
            />
          </PieChart>
        </div>

        {/* サマリー数値 */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-mirai-text">{total}</p>
            <p className="text-xs text-mirai-text-muted">総事業数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-mirai-text">{averageScore}</p>
            <p className="text-xs text-mirai-text-muted">平均スコア</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-mirai-text">
              {totalBudgetManYen.toLocaleString()}
            </p>
            <p className="text-xs text-mirai-text-muted">総事業費（万円）</p>
          </div>
          <div className="flex flex-col gap-1">
            {(["A", "B", "C", "D"] as const).map((g) => (
              <div key={g} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: GRADE_COLORS[g] }}
                />
                <span className="font-bold text-mirai-text">{g}</span>
                <span className="text-mirai-text-muted">{counts[g]}件</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
