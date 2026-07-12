import "server-only";
import type { Route } from "next";
import Link from "next/link";
import { BillList } from "@/features/bills/client/components/bill-list/bill-list";
import type { BillWithContent } from "@/features/bills/shared/types";
import { routes } from "@/lib/routes";
import { MIN_QUERY_LENGTH, SUGGESTED_KEYWORDS } from "../../shared/constants";
import { toSearchableQuery } from "../../shared/utils/searchable-query";

interface SearchResultsProps {
  query: string;
  bills: BillWithContent[];
  // ページをまたいだ総ヒット件数（件数表示に使う）
  totalCount: number;
  hasActiveFilters?: boolean;
  // 0件時にフィルタ解除で見つかる件数と遷移先（絞り込み緩和ヒント）
  fallback?: { count: number; href: string };
}

export function SearchResults({
  query,
  bills,
  totalCount,
  hasActiveFilters = false,
  fallback,
}: SearchResultsProps) {
  // ローダーと同じ基準（サニタイズ後の長さ）で判定する
  const hasValidQuery = toSearchableQuery(query).length >= MIN_QUERY_LENGTH;
  const queryTooShort = query !== "" && !hasValidQuery;

  // クエリが短すぎてフィルタもない場合は案内のみ表示
  if (queryTooShort && !hasActiveFilters) {
    return (
      <p className="text-mirai-text-secondary text-center py-12">
        キーワードは{MIN_QUERY_LENGTH}文字以上で入力してください。
      </p>
    );
  }

  // ヒットなし：行き止まりにせず、緩和リンク・キーワード提案で次の一手を示す
  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-mirai-text-secondary text-center">
          {hasValidQuery
            ? `「${query}」に一致する議案は見つかりませんでした。`
            : "条件に一致する議案は見つかりませんでした。"}
        </p>
        {fallback && fallback.count > 0 && (
          <Link
            href={fallback.href as Route}
            className="text-sm text-primary underline underline-offset-4"
          >
            絞り込みを解除すると{fallback.count}件見つかります
          </Link>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_KEYWORDS.map((kw) => (
            <Link
              key={kw}
              href={routes.search(kw) as Route}
              className="px-3 py-1 text-xs rounded-full border border-mirai-border text-mirai-text-secondary hover:bg-mirai-surface"
            >
              {kw}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* クエリが短くフィルタのみで検索された場合の注意書き */}
      {queryTooShort && (
        <p className="text-xs text-mirai-text-secondary">
          キーワードは{MIN_QUERY_LENGTH}
          文字以上で指定してください（絞り込み条件のみで表示しています）。
        </p>
      )}
      <p className="text-sm text-mirai-text-secondary">
        {hasValidQuery
          ? `「${query}」の検索結果: ${totalCount}件`
          : hasActiveFilters
            ? `絞り込み結果: ${totalCount}件`
            : `すべての議案: ${totalCount}件`}
      </p>
      <BillList bills={bills} />
    </div>
  );
}
