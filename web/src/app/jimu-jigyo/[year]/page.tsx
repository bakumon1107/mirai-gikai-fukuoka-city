import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JimuJigyoListPage } from "@/features/jimu-jigyo/server/components/jimu-jigyo-list-page";
import { isValidYear } from "@/features/jimu-jigyo/server/loaders/load-jimu-jigyo-list";

const YEAR_LABELS: Record<string, string> = {
  r6: "令和6年度",
};

type Props = {
  params: Promise<{ year: string }>;
  searchParams: Promise<{
    kyoku?: string;
    grade?: string;
    flag?: string;
    sort?: string;
  }>;
};

export async function generateStaticParams() {
  return [{ year: "r6" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const label = YEAR_LABELS[year] ?? year.toUpperCase();
  return {
    title: `事務事業評価（${label}）`,
    description: `福岡市の事務事業マネジメントシートをもとに、市民の視点で客観的に評価・可視化したページです。`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { year } = await params;
  if (!isValidYear(year)) notFound();

  const sp = await searchParams;
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-mirai-text-muted">
          読み込み中...
        </div>
      }
    >
      <JimuJigyoListPage
        year={year}
        basePath={`/jimu-jigyo/${year}`}
        searchParams={sp}
      />
    </Suspense>
  );
}
