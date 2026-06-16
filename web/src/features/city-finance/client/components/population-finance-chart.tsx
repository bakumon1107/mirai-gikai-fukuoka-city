"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearValue } from "../../shared/types";

type PopulationFinanceChartProps = {
  /** 高齢化率（%）の推移 */
  aging: YearValue[];
  /** 1人あたり民生費（円）の推移 */
  welfarePerCapita: YearValue[];
};

const AGING = "高齢化率";
const WELFARE = "1人あたり民生費";

/**
 * 高齢化と福祉コストの関係（2軸）。
 * 棒＝高齢化率(%)・左軸／折れ線＝1人あたり民生費(万円)・右軸。
 * 「高齢化が進むほど、市民1人あたりの福祉コストが増える」関係を1枚で示す。
 */
export function PopulationFinanceChart({
  aging,
  welfarePerCapita,
}: PopulationFinanceChartProps) {
  const years = Array.from(
    new Set([...aging, ...welfarePerCapita].map((v) => v.year))
  ).sort((a, b) => a - b);
  const agingMap = new Map(aging.map((v) => [v.year, v.value]));
  const welfareMap = new Map(welfarePerCapita.map((v) => [v.year, v.value]));

  const data = years.map((year) => ({
    year: `${year}`,
    [AGING]: agingMap.get(year) ?? null,
    // 円→万円
    [WELFARE]: welfareMap.has(year)
      ? (welfareMap.get(year) as number) / 10_000
      : null,
  }));

  return (
    <div
      className="w-full h-80"
      role="img"
      aria-label="高齢化率と1人あたり民生費の推移"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 0, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "var(--color-mirai-text-secondary)" }}
          />
          <YAxis
            yAxisId="left"
            width={44}
            tick={{ fontSize: 12, fill: "var(--color-mirai-text-secondary)" }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            width={52}
            tick={{ fontSize: 12, fill: "var(--color-mirai-text-secondary)" }}
            tickFormatter={(v) => `${Number(v).toFixed(0)}万`}
          />
          <Tooltip
            formatter={(value, name) =>
              name === AGING
                ? `${Number(value).toFixed(1)}%`
                : `${Number(value).toFixed(1)}万円`
            }
            labelFormatter={(label) => `${String(label)}年`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            yAxisId="left"
            dataKey={AGING}
            fill="var(--color-chart-3)"
            fillOpacity={0.5}
            barSize={28}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={WELFARE}
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
