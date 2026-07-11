import "server-only";
import { getDifficultyLevel } from "@/features/bill-difficulty/server/loaders/get-difficulty-level";
import {
  type BillSearchFilters,
  findBillIdsWithPublicInterview,
  findPublishedBillsBySearch,
  findTagsByBillIds,
} from "@/features/bills/server/repositories/bill-repository";
import type { BillWithContent } from "@/features/bills/shared/types";
import { sanitizeSearchQuery } from "@/features/bills/shared/utils/sanitize-search-query";
import { MIN_QUERY_LENGTH, SEARCH_RESULT_LIMIT } from "../../shared/constants";
import type { SearchFilterParams } from "../../shared/types";
import { normalizeSearchQuery } from "../../shared/utils/normalize-search-query";
import { resolveStatusFilter } from "../../shared/utils/status-filter";

/**
 * フリーワード + 絞り込み条件で公開議案を検索する。
 * クエリが最小文字数未満でもフィルタ指定があれば絞り込み一覧として検索する。
 * フリーワードはカーディナリティが高くキャッシュ効率が悪いため unstable_cache は使わない。
 */
export async function searchBills(
  query: string,
  filterParams: SearchFilterParams = {}
): Promise<BillWithContent[]> {
  // 最小文字数は実際に検索に使われる文字列（正規化・サニタイズ後）で判定する
  const sanitized = sanitizeSearchQuery(normalizeSearchQuery(query));
  const filters: BillSearchFilters = {
    dietSessionId: filterParams.session || undefined,
    tagId: filterParams.tag || undefined,
    statuses: resolveStatusFilter(filterParams.status) ?? undefined,
    hasPublicInterview: filterParams.interview === "1" || undefined,
  };
  const hasFilters = Boolean(
    filters.dietSessionId ||
      filters.tagId ||
      filters.statuses ||
      filters.hasPublicInterview
  );

  const effectiveQuery = sanitized.length >= MIN_QUERY_LENGTH ? sanitized : "";
  // 空入力は「全議案の一覧」として扱う。入力があるのに短すぎる場合のみ
  // （フィルタも無ければ）結果を返さない
  const rawEmpty = query.trim() === "";
  if (!rawEmpty && effectiveQuery === "" && !hasFilters) {
    return [];
  }

  // Cookie アクセスはキャッシュ外
  const difficultyLevel = await getDifficultyLevel();
  const data = await findPublishedBillsBySearch(
    effectiveQuery,
    difficultyLevel,
    SEARCH_RESULT_LIMIT,
    filters
  );

  if (data.length === 0) {
    return [];
  }

  const billIds = data.map((item) => item.id);
  const [tagsByBillId, interviewBillIds] = await Promise.all([
    findTagsByBillIds(billIds),
    findBillIdsWithPublicInterview(billIds),
  ]);

  return data.map((item) => {
    const { bill_contents, ...bill } = item;
    return {
      ...bill,
      bill_content: Array.isArray(bill_contents) ? bill_contents[0] : undefined,
      tags: tagsByBillId.get(item.id) ?? [],
      hasPublicInterview: interviewBillIds.has(item.id),
    };
  });
}
