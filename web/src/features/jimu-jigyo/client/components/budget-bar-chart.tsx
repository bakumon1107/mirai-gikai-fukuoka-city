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

type BudgetData = {
  R5決算?: { 歳出?: number; 特定財源?: number; 一般財源?: number };
  R6決算見込?: { 歳出?: number; 特定財源?: number; 一般財源?: number };
  R7予算?: { 歳出?: number; 特定財源?: number; 一般財源?: number };
};

type Props = {
  budgetData?: BudgetData;
};

export function BudgetBarChart({ budgetData }: Props) {
  if (!budgetData) return null;

  const data = [
    {
      year: "R5決算",
      一般財源: budgetData.R5決算?.一般財源,
      特定財源: budgetData.R5決算?.特定財源,
    },
    {
      year: "R6決算見込",
      一般財源: budgetData.R6決算見込?.一般財源,
      特定財源: budgetData.R6決算見込?.特定財源,
    },
    ...(budgetData.R7予算
      ? [
          {
            year: "R7予算",
            一般財源: budgetData.R7予算?.一般財源,
            特定財源: budgetData.R7予算?.特定財源,
          },
        ]
      : []),
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} width={55} unit="千円" />
        <Tooltip formatter={(v) => `${Number(v).toLocaleString()}千円`} />
        <Legend />
        <Bar dataKey="一般財源" stackId="a" fill="#3b82f6" />
        <Bar dataKey="特定財源" stackId="a" fill="#eff6ff" stroke="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
