import "server-only";
import Link from "next/link";
import { BudgetBarChart } from "../../client/components/budget-bar-chart";
import { KpiTrendChart } from "../../client/components/kpi-trend-chart";
import {
  getCurrentBudget,
  getPrevBudget,
} from "../../shared/utils/budget-accessor";
import type {
  ChangeDirection,
  JimuJigyoRecord,
} from "../../shared/types/jimu-jigyo";

type Props = {
  record: JimuJigyoRecord;
  basePath: string;
  year?: string;
};

function DirectionIcon({ direction }: { direction: ChangeDirection }) {
  if (direction === "up")
    return <span className="text-grade-a font-bold">↑ 改善</span>;
  if (direction === "down")
    return <span className="text-grade-d font-bold">↓ 悪化</span>;
  if (direction === "flat")
    return <span className="text-mirai-text-muted font-bold">→ 横ばい</span>;
  return <span className="text-mirai-text-muted">─ 不明</span>;
}

export function JimuJigyoDetailPage({ record, basePath, year = "r6" }: Props) {
  const { analysis } = record;
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

  const prevBudgetEntry = getPrevBudget(record, year);
  const currBudgetEntry = getCurrentBudget(record, year);
  const r5Budget = prevBudgetEntry?.歳出;
  const r6Budget = currBudgetEntry?.歳出;
  const prevLabel = prevBudgetEntry
    ? `${prevBudgetEntry.年度}${prevBudgetEntry.種別}`
    : "前年度";
  const currLabel = currBudgetEntry
    ? `${currBudgetEntry.年度}${currBudgetEntry.種別}`
    : "当年度";
  const budgetChange =
    r5Budget !== undefined && r6Budget !== undefined && r5Budget > 0
      ? ((r6Budget - r5Budget) / r5Budget) * 100
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* 戻るリンク */}
      <Link
        href={basePath}
        className="text-sm text-grade-b flex items-center gap-1"
      >
        ← 一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-mirai-text">{record.事業名}</h1>
        <p className="text-sm text-mirai-text-secondary">
          {record.所管局} › {record.所管課}
          {record.開始年度 && ` | ${record.開始年度}開始`}
        </p>

        {/* 3軸サマリー */}
        <div className="flex flex-wrap gap-4 pt-2">
          {[
            {
              label: "KPI動向",
              dir: analysis.kpi.direction,
              rate: analysis.kpi.changeRate,
            },
            {
              label: "予算動向",
              dir: analysis.budget.direction,
              rate: analysis.budget.changeRate,
            },
            {
              label: "予算効率",
              dir: analysis.efficiency.direction,
              rate: analysis.efficiency.changeRate,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 bg-mirai-surface rounded-lg px-3 py-2"
            >
              <span className="text-xs text-mirai-text-muted">
                {item.label}
              </span>
              <DirectionIcon direction={item.dir} />
              {item.rate !== null && (
                <span className="text-xs text-mirai-text-secondary">
                  ({item.rate >= 0 ? "+" : ""}
                  {(item.rate * 100).toFixed(1)}%)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 事業概要 */}
      {record.事業概要?.実施内容 && (
        <section className="space-y-2">
          <h2 className="text-base font-bold text-mirai-text">事業概要</h2>
          <p className="text-sm text-mirai-text whitespace-pre-line">
            {record.事業概要.実施内容}
          </p>
        </section>
      )}

      {/* ① KPI分析 */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-mirai-text border-b border-mirai-border pb-2">
          ① KPI達成状況
        </h2>
        <div className="bg-mirai-surface-warm border border-mirai-border rounded-lg p-4 text-sm text-mirai-text">
          {analysis.kpi.text}
        </div>

        {allKpis.length > 0 && (
          <div className="space-y-6">
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

                {/* 達成率・実績サマリー */}
                {(() => {
                  const years = Object.keys(kpi.実績 ?? {})
                    .filter((k) => /^R\d+$/.test(k))
                    .sort() as import("../../shared/types/jimu-jigyo").ReiwaYear[];
                  const lastYear = years.at(-1);
                  const nextYearKey = lastYear
                    ? (`R${Number(lastYear.slice(1)) + 1}` as import("../../shared/types/jimu-jigyo").ReiwaYear)
                    : null;
                  const nextYearTarget = nextYearKey
                    ? kpi.目標?.[nextYearKey]
                    : null;
                  return (
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      {years.map((yr) => {
                        const actual = kpi.実績?.[yr];
                        const target = kpi.目標?.[yr];
                        const rate = kpi.達成率?.[yr];
                        return (
                          <div
                            key={yr}
                            className="bg-mirai-surface rounded p-2"
                          >
                            <p className="text-mirai-text-muted">{yr}年度</p>
                            <p className="font-bold text-mirai-text">
                              {actual ?? "─"}
                            </p>
                            <p className="text-mirai-text-muted">
                              目標: {target ?? "─"}
                            </p>
                            {rate != null && (
                              <p className="text-mirai-text-secondary">
                                {rate}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      {nextYearTarget != null && nextYearKey && (
                        <div className="bg-mirai-surface rounded p-2 opacity-70">
                          <p className="text-mirai-text-muted">
                            {nextYearKey}目標
                          </p>
                          <p className="font-bold text-mirai-text">
                            {nextYearTarget}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <KpiTrendChart kpi={kpi} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ② 予算分析 */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-mirai-text border-b border-mirai-border pb-2">
          ② 予算の動き
        </h2>
        <div className="bg-mirai-surface-warm border border-mirai-border rounded-lg p-4 text-sm text-mirai-text">
          {analysis.budget.text}
        </div>

        {record.事業費_千円 && (
          <div className="space-y-2">
            <BudgetBarChart budgetData={record.事業費_千円} />
            <div className="text-sm text-mirai-text-secondary">
              <span>
                歳出: {prevLabel}={r5Budget?.toLocaleString() ?? "─"}千円 →{" "}
                {currLabel}={r6Budget?.toLocaleString() ?? "─"}千円
              </span>
              {budgetChange !== null && (
                <span className="ml-2">
                  ({budgetChange >= 0 ? "+" : ""}
                  {budgetChange.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ③ 効率分析 */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-mirai-text border-b border-mirai-border pb-2">
          ③ 予算効率（KPI/予算）
        </h2>
        <div className="bg-mirai-surface-warm border border-mirai-border rounded-lg p-4 text-sm text-mirai-text">
          {analysis.efficiency.text}
        </div>
      </section>

      {/* ロジックモデル */}
      {record.ロジックモデル && (
        <section className="space-y-3">
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
        </section>
      )}
    </div>
  );
}
