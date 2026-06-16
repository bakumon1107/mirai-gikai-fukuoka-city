"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendSeries } from "../../shared/utils/finance-view";

type StackedAreaChartProps = {
  series: TrendSeries[];
  /** 値の単位ラベル（例: 億円） */
  unitLabel: string;
};

const PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-primary)",
  "var(--color-mirai-border-light)",
];

/**
 * 年度推移の積み上げエリアチャート。
 * 各系列を積み上げて「総量の変化」と「内訳の増減」を同時に示す。
 * Server→Client へ関数propは渡さない（整形は内部で実施）。
 */
export function StackedAreaChart({ series, unitLabel }: StackedAreaChartProps) {
  const years = Array.from(
    new Set(series.flatMap((s) => s.values.map((v) => v.year)))
  ).sort((a, b) => a - b);

  const data = years.map((year) => {
    const row: Record<string, number | string> = { year: `${year}` };
    for (const s of series) {
      const found = s.values.find((v) => v.year === year);
      // 値は精度を保持し、表示時のみ丸める（小さな項目が潰れないように）
      row[s.name] = found ? found.value : 0;
    }
    return row;
  });

  return (
    <div
      className="w-full h-80"
      role="img"
      aria-label={`年度推移（積み上げ・単位: ${unitLabel}）`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
            tickFormatter={(v) => Math.round(Number(v)).toLocaleString("ja-JP")}
          />
          <Tooltip
            formatter={(value) =>
              `${Math.round(Number(value)).toLocaleString("ja-JP")} ${unitLabel}`
            }
            labelFormatter={(label) => `${String(label)}年度`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s, i) => (
            <Area
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stackId="1"
              stroke={PALETTE[i % PALETTE.length]}
              fill={PALETTE[i % PALETTE.length]}
              fillOpacity={0.7}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
