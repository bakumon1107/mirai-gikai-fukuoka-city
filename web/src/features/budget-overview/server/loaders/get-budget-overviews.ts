import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { BudgetOverview } from "../../shared/types";
import { findPublishedOverviewsBySession } from "../repositories/budget-repository";

/**
 * 会期IDに紐づく公開済み予算概要一覧を取得（10分キャッシュ）
 */
export async function getBudgetOverviews(
  councilSessionId: string
): Promise<BudgetOverview[]> {
  return _getCachedBudgetOverviews(councilSessionId);
}

const _getCachedBudgetOverviews = unstable_cache(
  async (councilSessionId: string): Promise<BudgetOverview[]> => {
    return findPublishedOverviewsBySession(councilSessionId);
  },
  ["budget-overviews"],
  {
    revalidate: 600, // 10分
    tags: [CACHE_TAGS.COUNCIL_SESSIONS],
  }
);
