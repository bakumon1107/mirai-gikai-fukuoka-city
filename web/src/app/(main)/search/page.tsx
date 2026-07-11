import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layouts/container";
import { SearchBox } from "@/features/bill-search/client/components/search-box";
import { SearchFilters } from "@/features/bill-search/client/components/search-filters";
import { SearchResults } from "@/features/bill-search/server/components/search-results";
import { getSearchFilterOptions } from "@/features/bill-search/server/loaders/get-search-filter-options";
import { searchBills } from "@/features/bill-search/server/loaders/search-bills";
import { MIN_QUERY_LENGTH } from "@/features/bill-search/shared/constants";
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
  const hasActiveFilters = Boolean(
    filters.session || filters.tag || filters.status || filters.interview
  );
  const hasValidQuery = query.length >= MIN_QUERY_LENGTH;

  // 条件なし（空エンター・初回アクセス）は全公開議案の一覧を表示する
  const [filterOptions, bills] = await Promise.all([
    getSearchFilterOptions(),
    searchBills(query, filters),
  ]);

  // 0件かつフィルタ指定ありの場合、フィルタ解除で何件見つかるかを提示する
  const noHit = bills !== null && bills.length === 0;
  let fallback: { count: number; href: string } | undefined;
  if (noHit && hasActiveFilters && hasValidQuery) {
    const relaxed = await searchBills(query);
    if (relaxed.length > 0) {
      fallback = { count: relaxed.length, href: routes.search(query) };
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
          bills={bills}
          hasActiveFilters={hasActiveFilters}
          fallback={fallback}
        />
      </div>
    </Container>
  );
}
