import type { Metadata } from "next";
import { AboutScorePage } from "@/features/jimu-jigyo/server/components/about-score-page";

export const metadata: Metadata = {
  title: "分析の見方 | 事務事業評価",
  description:
    "事務事業評価ページの分析の見方を解説します。KPI達成状況・予算の動き・予算効率の3軸で事業の動向を分析しています。",
};

export default function Page() {
  return <AboutScorePage />;
}
