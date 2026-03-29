import "server-only";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { BudgetOverview } from "../../shared/types";

type BudgetOverviewListProps = {
  overviews: BudgetOverview[];
  sessionSlug: string;
};

function formatBudget(amount: number | null): string {
  if (amount === null) return "—";
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}億円`;
  }
  return `${amount.toLocaleString()}万円`;
}

function BudgetDiffIcon({
  total,
  prev,
}: {
  total: number | null;
  prev: number | null;
}) {
  if (total === null || prev === null || prev === 0) {
    return <Minus className="w-4 h-4 text-mirai-text-muted" />;
  }
  const diff = total - prev;
  if (diff > 0) {
    return <TrendingUp className="w-4 h-4 text-primary" />;
  }
  if (diff < 0) {
    return <TrendingDown className="w-4 h-4 text-stance-against" />;
  }
  return <Minus className="w-4 h-4 text-mirai-text-muted" />;
}

export function BudgetOverviewList({
  overviews,
  sessionSlug,
}: BudgetOverviewListProps) {
  if (overviews.length === 0) {
    return (
      <p className="text-mirai-text-muted text-center py-10">
        公開中の予算概要はありません。
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {overviews.map((overview) => (
        <li key={overview.id}>
          <Link
            href={`/budget/${sessionSlug}/${overview.department_slug}`}
            className="block bg-card rounded-lg border border-border p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-bold text-mirai-text text-lg leading-snug">
                {overview.department_name}
              </h2>
              <BudgetDiffIcon
                total={overview.total_budget}
                prev={overview.prev_budget}
              />
            </div>

            {overview.direction && (
              <p className="mt-2 text-sm text-mirai-text-secondary line-clamp-2">
                {overview.direction}
              </p>
            )}

            <div className="mt-3 flex items-center gap-3 text-sm text-mirai-text-muted">
              <span>
                予算総額:{" "}
                <span className="font-semibold text-mirai-text">
                  {formatBudget(overview.total_budget)}
                </span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
