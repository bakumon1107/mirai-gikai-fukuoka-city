import "server-only";
import { getDifficultyLevel } from "@/features/bill-difficulty/server/loaders/get-difficulty-level";
import {
  findBillIdsWithPublicInterview,
  findPublishedBillsBySearch,
  findTagsByBillIds,
} from "@/features/bills/server/repositories/bill-repository";
import type { BillWithContent } from "@/features/bills/shared/types";
import { sanitizeSearchQuery } from "@/features/bills/shared/utils/sanitize-search-query";
import { MIN_QUERY_LENGTH, SEARCH_RESULT_LIMIT } from "../../shared/constants";

/**
 * フリーワードで公開済み議案を検索する。
 * フリーワードはカーディナリティが高くキャッシュ効率が悪いため unstable_cache は使わない。
 */
export async function searchBills(query: string): Promise<BillWithContent[]> {
  // 最小文字数は実際に検索に使われる文字列（サニタイズ後）で判定する
  const sanitized = sanitizeSearchQuery(query);
  if (sanitized.length < MIN_QUERY_LENGTH) {
    return [];
  }

  // Cookie アクセスはキャッシュ外
  const difficultyLevel = await getDifficultyLevel();
  const data = await findPublishedBillsBySearch(
    sanitized,
    difficultyLevel,
    SEARCH_RESULT_LIMIT
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
