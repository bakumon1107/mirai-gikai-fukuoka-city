"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
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

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} width={45} />
        <Tooltip />
        <Line
          dataKey="value"
          stroke={isImproving ? "#22c55e" : "#ef4444"}
          strokeWidth={2}
          dot={{ r: 4 }}
          name="実績"
        />
        {finalTarget !== null && (
          <ReferenceLine
            y={finalTarget}
            stroke="#dc2626"
            strokeDasharray="5 5"
            label={{ value: "最終目標", position: "right", fontSize: 11 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
