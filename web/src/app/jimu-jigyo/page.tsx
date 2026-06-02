import type { Metadata } from "next";
import { Suspense } from "react";
import { JimuJigyoListPage } from "@/features/jimu-jigyo/server/components/jimu-jigyo-list-page";

export const metadata: Metadata = {
  title: "事務事業評価（令和6年度）",
  description:
    "福岡市の事務事業マネジメントシートをもとに、市民の視点で客観的に評価・可視化したページです。",
};

type Props = {
  searchParams: Promise<{
    kyoku?: string;
    grade?: string;
    flag?: string;
    sort?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-mirai-text-muted">
          読み込み中...
        </div>
      }
    >
      <JimuJigyoListPage searchParams={params} />
    </Suspense>
  );
}
