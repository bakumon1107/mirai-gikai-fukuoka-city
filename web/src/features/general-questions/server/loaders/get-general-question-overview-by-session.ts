import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { SessionQuestionOverview } from "../../shared/types";
import { findGeneralQuestionOverviewBySession } from "../repositories/general-questions-repository";

/**
 * セッション単位のオーバービュー（全体3行＋テーマ別3行）を取得する。
 */
export async function getGeneralQuestionOverviewBySession(
  sessionId: string
): Promise<SessionQuestionOverview> {
  return _getCached(sessionId);
}

const _getCached = unstable_cache(
  async (sessionId: string): Promise<SessionQuestionOverview> => {
    return findGeneralQuestionOverviewBySession(sessionId);
  },
  ["general-question-overview-by-session"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.GENERAL_QUESTIONS],
  }
);
