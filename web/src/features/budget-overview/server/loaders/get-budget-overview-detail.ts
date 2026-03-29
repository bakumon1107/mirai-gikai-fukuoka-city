import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { BudgetOverviewWithThemes } from "../../shared/types";
import { findPublishedOverviewBySlug } from "../repositories/budget-repository";

/**
 * 会期ID + department_slug で公開済み予算概要詳細を取得（10分キャッシュ）
 */
export async function getBudgetOverviewDetail(
  councilSessionId: string,
  departmentSlug: string
): Promise<BudgetOverviewWithThemes | null> {
  return _getCachedBudgetOverviewDetail(councilSessionId, departmentSlug);
}

const _getCachedBudgetOverviewDetail = unstable_cache(
  async (
    councilSessionId: string,
    departmentSlug: string
  ): Promise<BudgetOverviewWithThemes | null> => {
    return findPublishedOverviewBySlug(councilSessionId, departmentSlug);
  },
  ["budget-overview-detail"],
  {
    revalidate: 600, // 10分
    tags: [CACHE_TAGS.COUNCIL_SESSIONS],
  }
);
