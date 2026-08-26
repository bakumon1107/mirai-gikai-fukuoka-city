import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { CandidateDetailView } from "@/features/election/server/components/candidate-detail-view";
import { CANDIDATES } from "@/features/election/shared/data/candidates";
import { ELECTION_SCHEDULE } from "@/features/election/shared/data/schedule";
import {
  getCandidateNoun,
  getElectionPhase,
} from "@/features/election/shared/utils/election-phase";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * 告示日・投開票日をまたぐと呼称（立候補予定者／候補者）と並び順ラベルが変わるため、
 * ビルド時の判定で固定されないよう定期的に再生成する。
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return CANDIDATES.map((candidate) => ({ id: candidate.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const candidate = CANDIDATES.find((item) => item.id === id);
  if (!candidate) {
    return {};
  }

  const noun = getCandidateNoun(
    getElectionPhase(new Date(), ELECTION_SCHEDULE)
  );
  return {
    title: `${candidate.name} | 福岡市長選挙 2026 | みらい議会＠福岡市`,
    description: `${candidate.name}（${candidate.kana}）の公表内容を9つの分野で整理しています。非公式サイトによる整理で、特定の${noun}への投票を呼びかけるものではありません。`,
  };
}

export default async function CandidateDetailPage({ params }: Props) {
  const { id } = await params;
  const index = CANDIDATES.findIndex((candidate) => candidate.id === id);
  if (index === -1) {
    notFound();
  }

  const phase = getElectionPhase(new Date(), ELECTION_SCHEDULE);

  return (
    <Container className="py-8">
      <CandidateDetailView
        candidate={CANDIDATES[index]}
        index={index}
        phase={phase}
      />
    </Container>
  );
}
