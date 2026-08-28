import "server-only";
import { getLatestSessionWithQuestions } from "@/features/general-questions/server/loaders/get-latest-session-with-questions";
import { CANDIDATES } from "../../shared/data/candidates";
import { ISSUES } from "../../shared/data/issues";
import { ELECTION_SCHEDULE } from "../../shared/data/schedule";
import type {
  Candidate,
  CandidateTab,
  ElectionPhase,
  Issue,
} from "../../shared/types";
import { parseCandidateTab } from "../../shared/utils/candidate-tab";
import { getElectionPhase } from "../../shared/utils/election-phase";

export type ElectionTopPageData = {
  phase: ElectionPhase;
  questionsSlug: string | null;
};

export type CandidatePageData = {
  candidate: Candidate;
  /** 表明順（0始まり）。顔写真プレースホルダーの配色に使う */
  index: number;
  phase: ElectionPhase;
  tab: CandidateTab;
};

export type IssuePageData = {
  issue: Issue;
  phase: ElectionPhase;
  questionsSlug: string | null;
};

export async function getElectionTopPageData(): Promise<ElectionTopPageData> {
  return {
    phase: getElectionPhase(new Date(), ELECTION_SCHEDULE),
    questionsSlug: await getLatestSessionWithQuestions(),
  };
}

/** 該当する立候補予定者がいない場合は null（呼び出し側で notFound する） */
export function getCandidatePageData(
  id: string,
  tab?: string
): CandidatePageData | null {
  const index = CANDIDATES.findIndex((candidate) => candidate.id === id);
  if (index === -1) {
    return null;
  }

  return {
    candidate: CANDIDATES[index],
    index,
    phase: getElectionPhase(new Date(), ELECTION_SCHEDULE),
    tab: parseCandidateTab(tab),
  };
}

/** 該当する争点がない場合は null（呼び出し側で notFound する） */
export async function getIssuePageData(
  issueId: string
): Promise<IssuePageData | null> {
  const issue = ISSUES.find((item) => item.id === issueId);
  if (!issue) {
    return null;
  }

  return {
    issue,
    phase: getElectionPhase(new Date(), ELECTION_SCHEDULE),
    questionsSlug: await getLatestSessionWithQuestions(),
  };
}

/** メタデータ用。現在のフェーズだけが必要な場面で使う */
export function getCurrentElectionPhase(): ElectionPhase {
  return getElectionPhase(new Date(), ELECTION_SCHEDULE);
}
