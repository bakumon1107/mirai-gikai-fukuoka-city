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
  const actualYears = Object.keys(kpi.実績 ?? {})
    .filter((k): k is ReiwaYear => /^R\d+$/.test(k))
    .sort();

  // 実績データ（solid line 用）
  const actualData = actualYears
    .map((yr) => ({
      year: `${yr}実績`,
      actual: toNum(kpi.実績?.[yr]),
      target: null as number | null,
    }))
    .filter((d) => d.actual !== null);

  // 次年度目標があれば点線用のデータを追加
  const lastYear = actualYears.at(-1);
  let hasNextTarget = false;
  if (lastYear && actualData.length > 0) {
    const nextYearKey = `R${Number(lastYear.slice(1)) + 1}` as ReiwaYear;
    const nextTarget = toNum(kpi.目標?.[nextYearKey]);
    if (nextTarget !== null) {
      hasNextTarget = true;
      // 最後の実績点に target を同値でセット（点線の起点）
      const lastPoint = actualData.at(-1);
      if (lastPoint) lastPoint.target = lastPoint.actual;
      // 次年度目標点を追加（actual は null）
      actualData.push({
        year: `${nextYearKey}目標`,
        actual: null,
        target: nextTarget,
      });
    }
  }

  const finalTarget = toNum(kpi.目標?.最終年度目標値);

  if (actualData.filter((d) => d.actual !== null).length < 2) return null;

  const allValues = actualData
    .flatMap((d) => [d.actual, d.target])
    .filter((v): v is number => v !== null);
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
      data={actualData}
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
        formatter={(v, name) => [
          Math.round(Number(v)).toLocaleString(),
          name === "target" ? "次年度目標" : "実績",
        ]}
      />
      {/* 実績ライン（solid） */}
      <Line
        dataKey="actual"
        stroke="var(--color-mirai-text-secondary)"
        strokeWidth={1.5}
        dot={{ r: 4, fill: "var(--color-grade-b)" }}
        name="actual"
        connectNulls={false}
      />
      {/* 次年度目標への点線 */}
      {hasNextTarget && (
        <Line
          dataKey="target"
          stroke="var(--color-mirai-text-muted)"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={{ r: 4, fill: "var(--color-mirai-text-muted)" }}
          name="target"
          connectNulls={false}
        />
      )}
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
