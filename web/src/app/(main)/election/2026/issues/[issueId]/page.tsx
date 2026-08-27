import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { IssueCompareView } from "@/features/election/server/components/issue-compare-view";
import {
  getCurrentElectionPhase,
  getIssuePageData,
} from "@/features/election/server/loaders/get-election-page-data";
import { ISSUES } from "@/features/election/shared/data/issues";
import { getCandidateNoun } from "@/features/election/shared/utils/election-phase";

type Props = {
  params: Promise<{ issueId: string }>;
};

/**
 * 告示日・投開票日をまたぐと呼称（立候補予定者／候補者）と並び順ラベルが変わるため、
 * ビルド時の判定で固定されないよう定期的に再生成する。
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return ISSUES.map((issue) => ({ issueId: issue.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { issueId } = await params;
  const data = await getIssuePageData(issueId);
  if (!data) {
    return {};
  }

  const noun = getCandidateNoun(getCurrentElectionPhase());
  return {
    title: `${data.issue.label} | 福岡市長選挙 2026 | みらい議会＠福岡市`,
    description: `福岡市長選挙の${noun}について、${data.issue.label}に関する公表内容を横並びで整理しています。分類は記述にもとづく整理であり、優劣を示すものではありません。`,
  };
}

export default async function IssueComparePage({ params }: Props) {
  const { issueId } = await params;
  const data = await getIssuePageData(issueId);
  if (!data) {
    notFound();
  }

  return (
    <Container className="py-8">
      <IssueCompareView
        issue={data.issue}
        phase={data.phase}
        questionsSlug={data.questionsSlug}
      />
    </Container>
  );
}
