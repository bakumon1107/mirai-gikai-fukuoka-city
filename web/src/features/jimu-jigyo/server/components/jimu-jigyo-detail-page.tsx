import "server-only";
import Link from "next/link";
import { BudgetBarChart } from "../../client/components/budget-bar-chart";
import { GradeBadge } from "../../client/components/grade-badge";
import { KpiProgressBar } from "../../client/components/kpi-progress-bar";
import { KpiTrendChart } from "../../client/components/kpi-trend-chart";
import { ScoreBreakdownAccordion } from "../../client/components/score-breakdown";
import { WatchdogFlagTooltip } from "../../client/components/watchdog-flag-tooltip";
import type { JimuJigyoRecord } from "../../shared/types/jimu-jigyo";

type Props = {
  record: JimuJigyoRecord;
  basePath: string;
};

export function JimuJigyoDetailPage({ record, basePath }: Props) {
  const r5Budget = record.事業費_千円?.R5決算?.歳出;
  const r6Budget = record.事業費_千円?.R6決算見込?.歳出;
  const budgetChange =
    r5Budget && r6Budget && r5Budget > 0
      ? ((r6Budget - r5Budget) / r5Budget) * 100
      : null;

  const allKpis = [
    ...(record.指標?.活動指標 ?? []).map((k) => ({
      ...k,
      kpiType: "活動指標" as const,
    })),
    ...(record.指標?.成果指標 ?? []).map((k) => ({
      ...k,
      kpiType: "成果指標" as const,
    })),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* 戻るリンク */}
      <Link
        href={basePath}
        className="text-sm text-grade-b flex items-center gap-1"
      >
        ← 一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <GradeBadge grade={record.grade} score={record.score} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-mirai-text">
              {record.事業名}
            </h1>
            <p className="text-sm text-mirai-text-secondary mt-1">
              {record.所管局} › {record.所管課}
              {record.開始年度 && ` | ${record.開始年度}開始`}
              {record.行政計画 && ` | ${record.行政計画}`}
            </p>
          </div>
        </div>
        <WatchdogFlagTooltip flags={record.flags} />
      </div>

      {/* 概要 + スコア */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-mirai-text">事業概要</h2>
          {record.事業概要.対象 && (
            <div>
              <p className="text-xs font-medium text-mirai-text-muted mb-0.5">
                対象
              </p>
              <p className="text-sm text-mirai-text">{record.事業概要.対象}</p>
            </div>
          )}
          {record.事業概要.対象の目指す状態 && (
            <div>
              <p className="text-xs font-medium text-mirai-text-muted mb-0.5">
                目指す状態
              </p>
              <p className="text-sm text-mirai-text">
                {record.事業概要.対象の目指す状態}
              </p>
            </div>
          )}
          {record.事業概要.実施内容 && (
            <div>
              <p className="text-xs font-medium text-mirai-text-muted mb-0.5">
                実施内容
              </p>
              <p className="text-sm text-mirai-text whitespace-pre-line">
                {record.事業概要.実施内容}
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base font-bold text-mirai-text mb-3">
            総合スコア
          </h2>
          <ScoreBreakdownAccordion
            score={record.score}
            breakdown={record.breakdown}
          />
        </div>
      </div>

      {/* KPI達成状況 */}
      {allKpis.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-mirai-text">KPI達成状況</h2>
          {allKpis.map((kpi) => (
            <div
              key={`${kpi.kpiType}-${kpi.内容}`}
              className="border border-mirai-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-mirai-surface border border-mirai-border text-mirai-text-muted shrink-0">
                  {kpi.kpiType}
                </span>
                <p className="text-sm font-medium text-mirai-text">
                  {kpi.内容}
                </p>
              </div>

              <KpiProgressBar
                label={kpi.内容}
                r5Actual={kpi.実績?.R5}
                r6Actual={kpi.実績?.R6}
                r6Target={kpi.目標?.R6 ?? null}
              />

              <KpiTrendChart kpi={kpi} />

              {/* 達成率150%超の場合に警告 */}
              {(() => {
                const t = Number(kpi.目標?.R6);
                const a = Number(kpi.実績?.R6);
                if (
                  !Number.isNaN(t) &&
                  !Number.isNaN(a) &&
                  t > 0 &&
                  a / t >= 1.5
                ) {
                  return (
                    <p className="text-xs text-grade-c">
                      ⚠️ 達成率が{Math.round((a / t) * 100)}
                      %と非常に高くなっています。目標値の見直しが必要な可能性があります。
                    </p>
                  );
                }
                return null;
              })()}
            </div>
          ))}
        </div>
      )}

      {/* 事業費推移 */}
      {record.事業費_千円 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-mirai-text">事業費推移</h2>
          <BudgetBarChart budgetData={record.事業費_千円} />
          <div className="text-sm text-mirai-text-secondary">
            <span>
              歳出: R5={r5Budget?.toLocaleString() ?? "─"}千円 → R6=
              {r6Budget?.toLocaleString() ?? "─"}千円
            </span>
            {budgetChange !== null && (
              <span
                className={`ml-2 ${budgetChange > 30 ? "text-grade-d font-medium" : ""}`}
              >
                ({budgetChange >= 0 ? "+" : ""}
                {budgetChange.toFixed(1)}%)
                {budgetChange > 30 && " ⚠️ 前年比30%超の予算増加"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ロジックモデル */}
      {record.ロジックモデル && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-mirai-text">
            ロジックモデル
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {[
                {
                  label: "活動",
                  value: record.ロジックモデル.活動アウトプット,
                },
                {
                  label: "結果",
                  value: record.ロジックモデル.結果アウトプット,
                },
                {
                  label: "中間アウトカム",
                  value: record.ロジックモデル.中間アウトカム,
                },
                {
                  label: "最終アウトカム",
                  value: record.ロジックモデル.最終アウトカム,
                },
              ]
                .filter((item) => item.value)
                .map((item, i, arr) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-40 border border-mirai-border rounded p-2">
                      <p className="text-xs font-bold text-mirai-text-muted mb-1">
                        {item.label}
                      </p>
                      <p className="text-xs text-mirai-text whitespace-pre-line">
                        {item.value}
                      </p>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-mirai-text-muted">→</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 政策体系 */}
      {record.基本計画 && (
        <div className="space-y-2">
          <h2 className="text-base font-bold text-mirai-text">政策体系</h2>
          <div className="text-sm text-mirai-text-secondary space-y-1">
            {record.基本計画.施策コード?.主 && (
              <p>施策コード: {record.基本計画.施策コード.主}</p>
            )}
            {record.基本計画.分野別目標 && (
              <p>
                {record.基本計画.分野別目標} › {record.基本計画.施策} ›{" "}
                {record.基本計画.事業群}
              </p>
            )}
          </div>
          {record.事業概要.成果見直し判断基準 && (
            <div className="border border-mirai-border rounded-lg p-3">
              <p className="text-xs font-medium text-mirai-text-muted mb-1">
                成果見直し判断基準（行政の記述）
              </p>
              <p className="text-sm text-mirai-text">
                {record.事業概要.成果見直し判断基準}
              </p>
              {record.flags.some((f) => f.type === "vague_goal") && (
                <p className="text-xs text-grade-c mt-2">
                  ⚠️ 終了条件の判断基準が曖昧な可能性があります。
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
