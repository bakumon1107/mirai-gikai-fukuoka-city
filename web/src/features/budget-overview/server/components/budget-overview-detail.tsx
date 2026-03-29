import "server-only";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import type { BudgetOverviewWithThemes } from "../../shared/types";

type BudgetOverviewDetailProps = {
  overview: BudgetOverviewWithThemes;
  sessionSlug: string;
};

function formatBudget(amount: number | null): string {
  if (amount === null) return "—";
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}億円`;
  }
  return `${amount.toLocaleString()}万円`;
}

function BudgetChange({
  total,
  prev,
}: {
  total: number | null;
  prev: number | null;
}) {
  if (total === null || prev === null || prev === 0) return null;
  const diff = total - prev;
  const sign = diff >= 0 ? "+" : "";
  const colorClass =
    diff > 0
      ? "text-primary"
      : diff < 0
        ? "text-stance-against"
        : "text-mirai-text-muted";

  return (
    <span className={`text-sm font-medium ${colorClass}`}>
      {sign}
      {formatBudget(diff)}（前年比）
    </span>
  );
}

export function BudgetOverviewDetail({
  overview,
  sessionSlug,
}: BudgetOverviewDetailProps) {
  return (
    <div>
      {/* ナビゲーション */}
      <Link
        href={`/budget/${sessionSlug}`}
        className="inline-flex items-center gap-1 text-sm text-mirai-text-muted hover:text-mirai-text mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        予算一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h1 className="text-2xl font-bold text-mirai-text">
          {overview.department_name}
        </h1>
        <h2 className="text-base text-mirai-text-secondary mt-1">
          令和8年度 重点施策
        </h2>

        {overview.direction && (
          <p className="mt-4 text-sm text-mirai-text-secondary leading-relaxed">
            {overview.direction}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-mirai-text-muted">予算総額</span>
            <div className="font-bold text-xl text-mirai-text mt-0.5">
              {formatBudget(overview.total_budget)}
            </div>
          </div>
          <div>
            <span className="text-mirai-text-muted">前年度予算</span>
            <div className="font-semibold text-mirai-text mt-0.5">
              {formatBudget(overview.prev_budget)}
            </div>
          </div>
          <div className="flex items-end pb-0.5">
            <BudgetChange
              total={overview.total_budget}
              prev={overview.prev_budget}
            />
          </div>
        </div>

        {overview.source_url && (
          <Link
            href={overview.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-4 text-xs text-mirai-text-muted hover:text-mirai-text"
          >
            <ExternalLink className="w-3 h-3" />
            予算書PDF（福岡市公式サイト）
          </Link>
        )}
      </div>
    </div>
  );
}
