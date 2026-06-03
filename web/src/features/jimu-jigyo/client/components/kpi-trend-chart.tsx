"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { KpiItem } from "../../shared/types/jimu-jigyo";

type Props = {
  kpi: KpiItem;
};

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

export function KpiTrendChart({ kpi }: Props) {
  const r5actual = toNum(kpi.実績?.R5);
  const r6actual = toNum(kpi.実績?.R6);
  const r7target = toNum(kpi.目標?.R7);
  const finalTarget = toNum(kpi.目標?.最終年度目標値);

  const data = [
    { year: "R5実績", value: r5actual },
    { year: "R6実績", value: r6actual },
    ...(r7target !== null
      ? [{ year: "R7目標", value: r7target, dotted: true }]
      : []),
  ].filter((d) => d.value !== null);

  if (data.length < 2) return null;

  const isImproving =
    r5actual !== null && r6actual !== null && r6actual >= r5actual;

  // 目標値を含めた上で余白を加えたドメインを計算
  const allValues = data
    .map((d) => d.value)
    .filter((v): v is number => v !== null);
  if (finalTarget !== null) allValues.push(finalTarget);
  if (r7target !== null) allValues.push(r7target);

  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = (maxVal - minVal) * 0.15 || maxVal * 0.1;
  const domainMin = Math.max(0, minVal - padding);
  const domainMax = maxVal + padding;

  return (
    <LineChart
      width={400}
      height={160}
      data={data}
      margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-mirai-border)" />
      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
      <YAxis
        tick={{ fontSize: 11 }}
        width={45}
        domain={[domainMin, domainMax]}
      />
      <Tooltip />
      <Line
        dataKey="value"
        stroke={isImproving ? "var(--color-grade-a)" : "var(--color-grade-d)"}
        strokeWidth={2}
        dot={{ r: 4 }}
        name="実績"
      />
      {finalTarget !== null && (
        <ReferenceLine
          y={finalTarget}
          stroke="var(--color-grade-d)"
          strokeDasharray="5 5"
          label={{ value: "最終目標", position: "right", fontSize: 11 }}
        />
      )}
    </LineChart>
  );
}
