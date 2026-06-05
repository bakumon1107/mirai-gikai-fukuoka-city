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
import type { KpiItem, ReiwaYear } from "../../shared/types/jimu-jigyo";

type Props = {
  kpi: KpiItem;
};

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

export function KpiTrendChart({ kpi }: Props) {
  // 実績がある年度を動的に収集（R3〜R7 等、順番通りにソート）
  const actualYears = Object.keys(kpi.実績 ?? {})
    .filter((k): k is ReiwaYear => /^R\d+$/.test(k))
    .sort();

  const data = [
    ...actualYears.map((yr) => ({
      year: `${yr}実績`,
      value: toNum(kpi.実績?.[yr]),
    })),
  ].filter((d) => d.value !== null);

  // 次年度目標があれば末尾に追加
  const lastYear = actualYears.at(-1);
  if (lastYear) {
    const nextYearKey = `R${Number(lastYear.slice(1)) + 1}` as ReiwaYear;
    const nextTarget = toNum(kpi.目標?.[nextYearKey]);
    if (nextTarget !== null) {
      data.push({ year: `${nextYearKey}目標`, value: nextTarget });
    }
  }

  const finalTarget = toNum(kpi.目標?.最終年度目標値);

  if (data.length < 2) return null;

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
