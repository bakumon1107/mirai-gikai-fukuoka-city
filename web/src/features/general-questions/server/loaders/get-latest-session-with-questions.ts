import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { findLatestSessionSlugWithPublishedQuestions } from "../repositories/general-questions-repository";

/**
 * 取得失敗時は null（バナー非表示）にする。
 * 例外は unstable_cache に保存されないため、失敗結果が使い回されることはない
 */
export async function getLatestSessionWithQuestions(): Promise<string | null> {
  try {
    return await _getCached();
  } catch (error) {
    console.error(error);
    return null;
  }
}

const _getCached = unstable_cache(
  async (): Promise<string | null> => {
    return findLatestSessionSlugWithPublishedQuestions();
  },
  ["latest-session-with-questions"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.GENERAL_QUESTIONS, CACHE_TAGS.COUNCIL_SESSIONS],
  }
);
