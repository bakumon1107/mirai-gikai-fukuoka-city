"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BudgetData } from "../../shared/types/jimu-jigyo";

type Props = {
  budgetData?: BudgetData | null;
};

export function BudgetBarChart({ budgetData }: Props) {
  if (!budgetData) return null;

  const data = budgetData.明細
    .filter((m) => m.会計区分 === null)
    .map((m) => ({
      year: `${m.年度}${m.種別}`,
      一般財源: m.一般財源,
      特定財源: m.特定財源,
    }));

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-mirai-border)"
        />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} width={55} unit="千円" />
        <Tooltip formatter={(v) => `${Number(v).toLocaleString()}千円`} />
        <Legend />
        <Bar dataKey="一般財源" stackId="a" fill="var(--color-grade-b)" />
        <Bar
          dataKey="特定財源"
          stackId="a"
          fill="var(--color-grade-b-bg)"
          stroke="var(--color-grade-b)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
