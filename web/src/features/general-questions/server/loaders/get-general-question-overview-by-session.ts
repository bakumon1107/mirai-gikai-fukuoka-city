import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { findGeneralQuestionOverviewBySession } from "../repositories/general-questions-repository";

/**
 * セッション単位の「3行サマリー」を取得する。未生成なら null。
 */
export async function getGeneralQuestionOverviewBySession(
  sessionId: string
): Promise<string[] | null> {
  return _getCached(sessionId);
}

const _getCached = unstable_cache(
  async (sessionId: string): Promise<string[] | null> => {
    return findGeneralQuestionOverviewBySession(sessionId);
  },
  ["general-question-overview-by-session"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.GENERAL_QUESTIONS],
  }
);
