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

function DirectionBadge({
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
      {rateText && <span className={`${color}`}>{rateText}</span>}
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
          <DirectionBadge
            direction={analysis.kpi.direction}
            changeRate={analysis.kpi.changeRate}
            label="KPI"
          />
          <DirectionBadge
            direction={analysis.budget.direction}
            changeRate={analysis.budget.changeRate}
            label="予算"
          />
          <DirectionBadge
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
