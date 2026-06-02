"use client";

import Link from "next/link";
import type { JimuJigyoRecord } from "../../shared/types/jimu-jigyo";
import { GradeBadge, gradeBorderColor } from "./grade-badge";
import { KpiProgressBar } from "./kpi-progress-bar";
import { WatchdogFlagTooltip } from "./watchdog-flag-tooltip";

type Props = {
  record: JimuJigyoRecord;
  basePath: string;
};

export function JimuJigyoCard({ record, basePath }: Props) {
  const r5Budget = record.事業費_千円?.R5決算?.歳出;
  const r6Budget = record.事業費_千円?.R6決算見込?.歳出;
  const budgetChange =
    r5Budget !== undefined && r6Budget !== undefined && r5Budget > 0
      ? ((r6Budget - r5Budget) / r5Budget) * 100
      : null;

  const kpis = record.指標?.成果指標?.slice(0, 2) ?? [];

  return (
    <Link href={`${basePath}/${record.id}`} className="block group">
      <div
        className={`
          bg-white rounded-lg border-l-4 ${gradeBorderColor(record.grade)}
          border border-mirai-border shadow-sm
          hover:shadow-md transition-shadow p-4 h-full flex flex-col gap-3
        `}
      >
        {/* ヘッダー */}
        <div className="flex items-start gap-3">
          <GradeBadge grade={record.grade} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-mirai-surface-warm text-mirai-text-secondary border border-mirai-border">
                {record.所管局}
              </span>
              <span className="text-xs text-mirai-text-muted">
                {record.score}点
              </span>
            </div>
            <h3 className="text-sm font-bold text-mirai-text line-clamp-2 group-hover:underline">
              {record.事業名}
            </h3>
            <p className="text-xs text-mirai-text-muted mt-0.5">
              {record.所管課}
              {record.開始年度 && ` · ${record.開始年度}開始`}
            </p>
          </div>
        </div>

        {/* KPI */}
        {kpis.length > 0 && (
          <div className="space-y-2">
            {kpis.map((kpi) => (
              <KpiProgressBar
                key={kpi.内容}
                label={kpi.内容}
                r5Actual={kpi.実績?.R5}
                r6Actual={kpi.実績?.R6}
                r6Target={typeof kpi.目標?.R6 === "number" ? kpi.目標.R6 : null}
              />
            ))}
          </div>
        )}

        {/* 事業費 */}
        {r6Budget !== undefined && (
          <div className="text-xs text-mirai-text-secondary">
            <span>R6歳出: {r6Budget.toLocaleString()}千円</span>
            {budgetChange !== null && (
              <span
                className={`ml-2 ${budgetChange > 30 ? "text-grade-d" : budgetChange > 5 ? "text-grade-c" : "text-mirai-text-muted"}`}
              >
                {budgetChange >= 0 ? "↑" : "↓"}
                {Math.abs(budgetChange).toFixed(1)}%
              </span>
            )}
          </div>
        )}

        {/* フラグ */}
        {record.flags.length > 0 && (
          <WatchdogFlagTooltip flags={record.flags} compact />
        )}

        <div className="mt-auto text-xs text-grade-b font-medium">
          詳細を見る →
        </div>
      </div>
    </Link>
  );
}
