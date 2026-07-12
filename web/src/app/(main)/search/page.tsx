import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layouts/container";
import { SearchBox } from "@/features/bill-search/client/components/search-box";
import { SearchFilters } from "@/features/bill-search/client/components/search-filters";
import { SearchPagination } from "@/features/bill-search/server/components/search-pagination";
import { SearchResults } from "@/features/bill-search/server/components/search-results";
import { getSearchFilterOptions } from "@/features/bill-search/server/loaders/get-search-filter-options";
import { searchBills } from "@/features/bill-search/server/loaders/search-bills";
import { MIN_QUERY_LENGTH } from "@/features/bill-search/shared/constants";
import { toSearchableQuery } from "@/features/bill-search/shared/utils/searchable-query";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "議案を検索",
};

type SearchParamValue = string | string[] | undefined;

// 同名パラメータが複数付くと string[] が渡るため string のみ採用する
function asString(value: SearchParamValue): string {
  return typeof value === "string" ? value.trim() : "";
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: SearchParamValue;
    session?: SearchParamValue;
    tag?: SearchParamValue;
    status?: SearchParamValue;
    interview?: SearchParamValue;
    page?: SearchParamValue;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = asString(params.q);
  const filters = {
    session: asString(params.session) || undefined,
    tag: asString(params.tag) || undefined,
    status: asString(params.status) || undefined,
    interview: asString(params.interview) || undefined,
  };
  const requestedPage = Number.parseInt(asString(params.page), 10) || 1;
  const hasActiveFilters = Boolean(
    filters.session || filters.tag || filters.status || filters.interview
  );
  // ローダー・結果表示と同じ基準（サニタイズ後の長さ）で判定する
  const hasValidQuery = toSearchableQuery(query).length >= MIN_QUERY_LENGTH;

  // 条件なし（空エンター・初回アクセス）は全公開議案の一覧を表示する
  const [filterOptions, result] = await Promise.all([
    getSearchFilterOptions(),
    searchBills(query, filters, requestedPage),
  ]);

  // 0件かつフィルタ指定ありの場合、フィルタ解除で何件見つかるかを提示する
  let fallback: { count: number; href: string } | undefined;
  if (result.totalCount === 0 && hasActiveFilters && hasValidQuery) {
    const relaxed = await searchBills(query);
    if (relaxed.totalCount > 0) {
      fallback = { count: relaxed.totalCount, href: routes.search(query) };
    }
  }

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold text-mirai-text mb-6">議案を検索</h1>
      <div className="flex flex-col gap-4">
        <Suspense>
          <SearchBox />
        </Suspense>
        <Suspense>
          <SearchFilters options={filterOptions} />
        </Suspense>
      </div>
      <div className="mt-8">
        <SearchResults
          query={query}
          bills={result.bills}
          totalCount={result.totalCount}
          hasActiveFilters={hasActiveFilters}
          fallback={fallback}
        />
        <SearchPagination
          page={result.page}
          pageCount={result.pageCount}
          query={query}
          filters={filters}
        />
      </div>
    </Container>
  );
}
