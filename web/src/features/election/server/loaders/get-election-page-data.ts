import "server-only";
import { getLatestSessionWithQuestions } from "@/features/general-questions/server/loaders/get-latest-session-with-questions";
import { ACTIVE_CANDIDATES } from "../../shared/data/candidates";
import { DEBATES } from "../../shared/data/debates";
import { ISSUES } from "../../shared/data/issues";
import { ELECTION_SCHEDULE } from "../../shared/data/schedule";
import type {
  Candidate,
  CandidateTab,
  Debate,
  ElectionPhase,
  Issue,
} from "../../shared/types";
import { parseCandidateTab } from "../../shared/utils/candidate-tab";
import { parseDebateCandidate } from "../../shared/utils/debate";
import { getElectionPhase } from "../../shared/utils/election-phase";

export type ElectionTopPageData = {
  phase: ElectionPhase;
  questionsSlug: string | null;
};

export type CandidatePageData = {
  candidate: Candidate;
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

/**
 * 該当する立候補予定者がいない場合は null（呼び出し側で notFound する）。
 * 立候補を取りやめた人の個人ページは掲載を終えたため、同じく null を返す。
 */
export function getCandidatePageData(
  id: string,
  tab?: string
): CandidatePageData | null {
  const candidate = ACTIVE_CANDIDATES.find((item) => item.id === id);
  if (!candidate) {
    return null;
  }

  return {
    candidate,
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

export type DebatePageData = {
  debate: Debate;
  phase: ElectionPhase;
  selectedCandidateId: string | null;
};

/** 該当する討論会がない場合は null（呼び出し側で notFound する） */
export function getDebatePageData(
  debateId: string,
  candidate?: string
): DebatePageData | null {
  const debate = DEBATES.find((item) => item.id === debateId);
  if (!debate) {
    return null;
  }

  return {
    debate,
    phase: getElectionPhase(new Date(), ELECTION_SCHEDULE),
    selectedCandidateId: parseDebateCandidate(candidate, debate.participantIds),
  };
}

/** メタデータ用。現在のフェーズだけが必要な場面で使う */
export function getCurrentElectionPhase(): ElectionPhase {
  return getElectionPhase(new Date(), ELECTION_SCHEDULE);
}
