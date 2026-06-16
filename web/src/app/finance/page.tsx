import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { CityFinanceSections } from "@/features/city-finance/server/components/city-finance-view";
import { getFinanceView } from "@/features/city-finance/server/loaders/get-finance-view";

export const metadata: Metadata = {
  title: "福岡市のお金の使い道（財政）",
  description:
    "福岡市の歳入・歳出、収入構造、人口との関係を、公開データをもとに市民にわかりやすく可視化します。",
};

export default function FinancePage() {
  const view = getFinanceView();
  return (
    <Container className="py-8">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-mirai-text-secondary hover:text-mirai-text"
        >
          <ChevronLeft className="h-4 w-4" />
          トップに戻る
        </Link>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-mirai-text">
        福岡市のお金の使い道
      </h1>
      <p className="mb-8 text-sm text-mirai-text-secondary">
        市の収入と支出、収入構造の移り変わり、人口との関係をわかりやすくまとめました。
      </p>
      <CityFinanceSections view={view} />
    </Container>
  );
}
