import type { Metadata } from "next";
import { AboutScorePage } from "@/features/jimu-jigyo/server/components/about-score-page";

export const metadata: Metadata = {
  title: "スコアの計算方法 | 事務事業評価",
  description:
    "事務事業評価スコアの計算方法を解説します。成果KPI達成・改善トレンド・透明性・予算効率の4軸で算出しています。",
};

export default function Page() {
  return <AboutScorePage />;
}
