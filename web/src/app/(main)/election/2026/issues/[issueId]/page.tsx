import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { IssueCompareView } from "@/features/election/server/components/issue-compare-view";
import { ISSUES } from "@/features/election/shared/data/issues";
import { ELECTION_SCHEDULE } from "@/features/election/shared/data/schedule";
import {
  getCandidateNoun,
  getElectionPhase,
} from "@/features/election/shared/utils/election-phase";
import { getLatestSessionWithQuestions } from "@/features/general-questions/server/loaders/get-latest-session-with-questions";

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
  const issue = ISSUES.find((item) => item.id === issueId);
  if (!issue) {
    return {};
  }

  const noun = getCandidateNoun(
    getElectionPhase(new Date(), ELECTION_SCHEDULE)
  );
  return {
    title: `${issue.label} | 福岡市長選挙 2026 | みらい議会＠福岡市`,
    description: `福岡市長選挙の${noun}について、${issue.label}に関する公表内容を横並びで整理しています。分類は記述にもとづく整理であり、優劣を示すものではありません。`,
  };
}

export default async function IssueComparePage({ params }: Props) {
  const { issueId } = await params;
  const issue = ISSUES.find((item) => item.id === issueId);
  if (!issue) {
    notFound();
  }

  const questionsSlug = await getLatestSessionWithQuestions();
  const phase = getElectionPhase(new Date(), ELECTION_SCHEDULE);

  return (
    <Container className="py-8">
      <IssueCompareView
        issue={issue}
        phase={phase}
        questionsSlug={questionsSlug}
      />
    </Container>
  );
}
