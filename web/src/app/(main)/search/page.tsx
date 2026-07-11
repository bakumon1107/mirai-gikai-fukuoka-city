import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layouts/container";
import { SearchBox } from "@/features/bill-search/client/components/search-box";
import { SearchResults } from "@/features/bill-search/server/components/search-results";
import { searchBills } from "@/features/bill-search/server/loaders/search-bills";

export const metadata: Metadata = {
  title: "議案を検索",
};

interface SearchPageProps {
  // 同名パラメータが複数付くと string[] が渡るため union で受ける
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "").trim();
  const bills = query ? await searchBills(query) : null;

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold text-mirai-text mb-6">議案を検索</h1>
      <Suspense>
        <SearchBox />
      </Suspense>
      <div className="mt-8">
        <SearchResults query={query} bills={bills} />
      </div>
    </Container>
  );
}
