"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type GradeCounts = { A: number; B: number; C: number; D: number };

type Props = {
  counts: GradeCounts;
  total: number;
  averageScore: number;
  totalBudgetManYen: number;
};

const GRADE_COLORS = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#ef4444",
};

export function GradeSummaryChart({
  counts,
  total,
  averageScore,
  totalBudgetManYen,
}: Props) {
  const data = [
    { name: "A", count: counts.A },
    { name: "B", count: counts.B },
    { name: "C", count: counts.C },
    { name: "D", count: counts.D },
  ].filter((d) => d.count > 0);

  return (
    <div className="bg-white border border-mirai-border rounded-lg p-4">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* ドーナツチャート */}
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={GRADE_COLORS[entry.name as keyof typeof GRADE_COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}件`, `グレード${name}`]}
              />
            </PieChart>
          </ResponsiveContainer>
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
