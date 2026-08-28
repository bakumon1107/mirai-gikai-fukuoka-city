import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { CandidateDetailView } from "@/features/election/server/components/candidate-detail-view";
import {
  getCandidatePageData,
  getCurrentElectionPhase,
} from "@/features/election/server/loaders/get-election-page-data";
import { CANDIDATES } from "@/features/election/shared/data/candidates";
import { ISSUES } from "@/features/election/shared/data/issues";
import { getCandidateNoun } from "@/features/election/shared/utils/election-phase";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

/**
 * 告示日・投開票日をまたぐと呼称（立候補予定者／候補者）と並び順ラベルが変わるため、
 * ビルド時の判定で固定されないよう定期的に再生成する。
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return CANDIDATES.map((candidate) => ({ id: candidate.id }));
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { id } = await params;
  const data = getCandidatePageData(id);
  if (!data) {
    return {};
  }

  const { candidate } = data;
  const noun = getCandidateNoun(getCurrentElectionPhase());
  return {
    title: `${candidate.name} | 福岡市長選挙 2026 | みらい議会＠福岡市`,
    description: `${candidate.name}（${candidate.kana}）の公表内容を${ISSUES.length}つの分野で整理しています。非公式サイトによる整理で、特定の${noun}への投票を呼びかけるものではありません。`,
  };
}

export default async function CandidateDetailPage({
  params,
  searchParams,
}: Props) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  const data = getCandidatePageData(id, tab);
  if (!data) {
    notFound();
  }

  return (
    <Container className="py-8">
      <CandidateDetailView
        candidate={data.candidate}
        index={data.index}
        phase={data.phase}
        tab={data.tab}
      />
    </Container>
  );
}
