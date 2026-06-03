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
    ...(r7target !== null ? [{ year: "R7目標", value: r7target }] : []),
  ].filter((d) => d.value !== null);

  if (data.length < 2) return null;

  // 目標値・参照線を含めたドメイン計算
  const allValues = data.map((d) => d.value as number);
  if (finalTarget !== null) allValues.push(finalTarget);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = Math.max((maxVal - minVal) * 0.15, 1);
  const domainMin = Math.max(0, Math.floor(minVal - padding));
  const domainMax = Math.ceil(maxVal + padding);

  return (
    <LineChart
      width={380}
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
        allowDecimals={false}
        tickFormatter={(v) => Math.round(v).toLocaleString()}
      />
      <Tooltip
        formatter={(v) => [Math.round(Number(v)).toLocaleString(), "値"]}
      />
      <Line
        dataKey="value"
        stroke="var(--color-mirai-text-secondary)"
        strokeWidth={1.5}
        dot={{ r: 4, fill: "var(--color-grade-b)" }}
        name="実績/目標"
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
