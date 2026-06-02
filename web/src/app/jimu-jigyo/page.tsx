import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "事務事業評価",
  description:
    "福岡市の事務事業マネジメントシートをもとに、市民の視点で客観的に評価・可視化したアーカイブです。",
};

const YEARS = [
  {
    slug: "r6",
    label: "令和6年度（2024年度）",
    count: 74,
    description: "R6事業の執行状況を評価",
  },
];

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-mirai-text">事務事業評価</h1>
        <p className="text-sm text-mirai-text-secondary mt-1">
          福岡市が公開する事務事業マネジメントシートをもとに、市民の視点で評価・可視化しています。
        </p>
        <div className="mt-2">
          <Link
            href="/jimu-jigyo/about-score"
            className="text-sm text-grade-b underline"
          >
            このスコアの計算方法について →
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-mirai-text">年度一覧</h2>
        {YEARS.map((year) => (
          <Link
            key={year.slug}
            href={`/jimu-jigyo/${year.slug}`}
            className="block bg-white border border-mirai-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-mirai-text">{year.label}</p>
                <p className="text-sm text-mirai-text-secondary mt-0.5">
                  {year.count}事業 · {year.description}
                </p>
              </div>
              <span className="text-grade-b font-medium text-sm">見る →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
