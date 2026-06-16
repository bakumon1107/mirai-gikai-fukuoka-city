"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendSeries } from "../../shared/utils/finance-view";

type TrendLineChartProps = {
  series: TrendSeries[];
  /** 値の単位ラベル（例: 億円, 万人, 円） */
  unitLabel: string;
  /** 値の整形（ツールチップ・軸） */
  formatValue?: (value: number) => string;
};

const PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-primary)",
  "var(--color-stance-against)",
  "var(--color-stance-neutral)",
];

/**
 * 年度推移の折れ線チャート（複数系列）。
 * series: [{ name, values: [{year, value}] }]
 */
export function TrendLineChart({
  series,
  unitLabel,
  formatValue,
}: TrendLineChartProps) {
  const years = Array.from(
    new Set(series.flatMap((s) => s.values.map((v) => v.year)))
  ).sort((a, b) => a - b);

  const data = years.map((year) => {
    const row: Record<string, number | string> = { year: `${year}` };
    for (const s of series) {
      const found = s.values.find((v) => v.year === year);
      if (found) row[s.name] = found.value;
    }
    return row;
  });

  const fmt = formatValue ?? ((v: number) => v.toLocaleString("ja-JP"));

  return (
    <div
      className="w-full h-72"
      role="img"
      aria-label={`年度推移（単位: ${unitLabel}）`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "var(--color-mirai-text-secondary)" }}
          />
          <YAxis
            width={56}
            tick={{ fontSize: 12, fill: "var(--color-mirai-text-secondary)" }}
            tickFormatter={(v: number) => fmt(v)}
          />
          <Tooltip
            formatter={(value) => `${fmt(Number(value))} ${unitLabel}`}
            labelFormatter={(label) => `${String(label)}年度`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s, i) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
