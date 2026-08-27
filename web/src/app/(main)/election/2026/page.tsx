import { Container } from "@/components/layouts/container";
import { ElectionTopView } from "@/features/election/server/components/election-top-view";
import { getElectionTopPageData } from "@/features/election/server/loaders/get-election-page-data";

export const metadata = {
  title: "福岡市長選挙 2026 | みらい議会＠福岡市",
  description:
    "2026年11月15日投開票の福岡市長選挙について、出馬を表明した人の公表内容を9つの分野で同じ物差しに並べて掲載します。非公式サイトによる整理で、評価や推薦は行いません。",
};

/**
 * 告示日・投開票日をまたぐと呼称（立候補予定者／候補者）と並び順ラベルが変わるため、
 * ビルド時の判定で固定されないよう定期的に再生成する。
 */
export const revalidate = 3600;

export default async function ElectionTopPage() {
  const { phase, questionsSlug } = await getElectionTopPageData();

  return (
    <Container className="py-8">
      <ElectionTopView phase={phase} questionsSlug={questionsSlug} />
    </Container>
  );
}
