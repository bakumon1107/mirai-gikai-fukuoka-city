"use client";

import Link from "next/link";
import type {
  ChangeDirection,
  JimuJigyoRecord,
} from "../../shared/types/jimu-jigyo";

type Props = {
  record: JimuJigyoRecord;
  basePath: string;
};

function KpiEfficiencyBadge({
  direction,
  changeRate,
  label,
}: {
  direction: ChangeDirection;
  changeRate: number | null;
  label: string;
}) {
  const icon =
    direction === "up"
      ? "↑"
      : direction === "down"
        ? "↓"
        : direction === "flat"
          ? "→"
          : "─";
  const color =
    direction === "up"
      ? "text-grade-a"
      : direction === "down"
        ? "text-grade-d"
        : "text-mirai-text-muted";
  const rateText =
    changeRate !== null
      ? `${changeRate >= 0 ? "+" : ""}${(changeRate * 100).toFixed(1)}%`
      : "";

  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-mirai-text-muted w-8 shrink-0">{label}</span>
      <span className={`font-bold ${color}`}>{icon}</span>
      {rateText && <span className={color}>{rateText}</span>}
    </div>
  );
}

function BudgetBadge({
  direction,
  changeRate,
  nextYearDirection,
  nextYearChangeRate,
}: {
  direction: ChangeDirection;
  changeRate: number | null;
  nextYearDirection: ChangeDirection;
  nextYearChangeRate: number | null;
}) {
  const isUp = direction === "up";
  const isDown = direction === "down";
  const label = isUp
    ? "増加"
    : isDown
      ? "減少"
      : direction === "flat"
        ? "横ばい"
        : "─";
  const icon = isUp ? "↑" : isDown ? "↓" : direction === "flat" ? "→" : "─";
  const rateText =
    changeRate !== null
      ? `${changeRate >= 0 ? "+" : ""}${(changeRate * 100).toFixed(1)}%`
      : "";

  const nextYearLabel =
    nextYearDirection === "up"
      ? "増加"
      : nextYearDirection === "down"
        ? "減少"
        : nextYearDirection === "flat"
          ? "横ばい"
          : null;
  const nextYearIcon =
    nextYearDirection === "up"
      ? "↑"
      : nextYearDirection === "down"
        ? "↓"
        : nextYearDirection === "flat"
          ? "→"
          : null;
  const nextYearRateText =
    nextYearChangeRate !== null
      ? `(${nextYearChangeRate >= 0 ? "+" : ""}${(nextYearChangeRate * 100).toFixed(1)}%)`
      : "";

  return (
    <div className="flex items-center gap-1 text-xs flex-wrap">
      <span className="text-mirai-text-muted w-8 shrink-0">予算</span>
      <span className="text-mirai-text-secondary font-bold">{icon}</span>
      <span className="text-mirai-text-secondary">{label}</span>
      {rateText && <span className="text-mirai-text-muted">({rateText})</span>}
      {nextYearLabel && (
        <span className="text-mirai-text-muted">
          · 次年度
          <span className="text-mirai-text-secondary font-bold">
            {" "}
            {nextYearIcon}
            {nextYearLabel}
          </span>
          {nextYearRateText && (
            <span className="text-mirai-text-secondary">
              {nextYearRateText}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

export function JimuJigyoCard({ record, basePath }: Props) {
  const { analysis } = record;

  return (
    <Link href={`${basePath}/${record.id}`} className="block group">
      <div className="bg-white rounded-lg border border-mirai-border shadow-sm hover:shadow-md transition-shadow p-4 h-full flex flex-col gap-3">
        {/* ヘッダー */}
        <div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-mirai-surface-warm text-mirai-text-secondary border border-mirai-border">
            {record.所管局}
          </span>
          <h3 className="mt-2 text-sm font-bold text-mirai-text line-clamp-2 group-hover:underline">
            {record.事業名}
          </h3>
          <p className="text-xs text-mirai-text-muted mt-0.5">
            {record.所管課}
            {record.開始年度 && ` · ${record.開始年度}開始`}
          </p>
        </div>

        {/* 3軸サマリー */}
        <div className="space-y-1 border-t border-mirai-border pt-2">
          <KpiEfficiencyBadge
            direction={analysis.kpi.direction}
            changeRate={analysis.kpi.changeRate}
            label="KPI"
          />
          <BudgetBadge
            direction={analysis.budget.direction}
            changeRate={analysis.budget.changeRate}
            nextYearDirection={analysis.budget.nextYearDirection}
            nextYearChangeRate={analysis.budget.nextYearChangeRate}
          />
          <KpiEfficiencyBadge
            direction={analysis.efficiency.direction}
            changeRate={analysis.efficiency.changeRate}
            label="効率"
          />
        </div>

        <div className="mt-auto text-xs text-grade-b font-medium">
          詳細を見る →
        </div>
      </div>
    </Link>
  );
}
