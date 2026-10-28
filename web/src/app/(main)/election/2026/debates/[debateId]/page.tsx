import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { DebateView } from "@/features/election/server/components/debate-view";
import {
  getCurrentElectionPhase,
  getDebatePageData,
} from "@/features/election/server/loaders/get-election-page-data";
import { DEBATES } from "@/features/election/shared/data/debates";
import { getCandidateNoun } from "@/features/election/shared/utils/election-phase";

type Props = {
  params: Promise<{ debateId: string }>;
  searchParams: Promise<{ candidate?: string }>;
};

/**
 * 告示日・投開票日をまたぐと呼称（立候補予定者／候補者）と並び順ラベルが変わるため、
 * ビルド時の判定で固定されないよう定期的に再生成する。
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return DEBATES.map((debate) => ({ debateId: debate.id }));
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { debateId } = await params;
  const data = getDebatePageData(debateId);
  if (!data) {
    return {};
  }

  const { debate } = data;
  const noun = getCandidateNoun(getCurrentElectionPhase());
  return {
    title: `${debate.shortTitle}（${debate.dateLabel}） | 福岡市長選挙 2026 | みらい議会＠福岡市`,
    description: `${debate.title}での${noun}の発言を、問いごとに並べて整理しています。各発言は動画の再生位置から確かめられます。非公式サイトによる整理で、評価や勝ち負けは付けていません。`,
  };
}

export default async function DebatePage({ params, searchParams }: Props) {
  const [{ debateId }, { candidate }] = await Promise.all([
    params,
    searchParams,
  ]);
  const data = getDebatePageData(debateId, candidate);
  if (!data) {
    notFound();
  }

  return (
    <Container className="py-8">
      <DebateView
        debate={data.debate}
        phase={data.phase}
        selectedCandidateId={data.selectedCandidateId}
      />
    </Container>
  );
}
