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
import { MIN_QUERY_LENGTH, SEARCH_PAGE_SIZE } from "../../shared/constants";
import type { SearchFilterParams } from "../../shared/types";
import { normalizeSearchQuery } from "../../shared/utils/normalize-search-query";
import { calcPageCount, clampPage } from "../../shared/utils/pagination";
import { resolveStatusFilter } from "../../shared/utils/status-filter";

export type BillSearchResult = {
  bills: BillWithContent[];
  totalCount: number;
  page: number;
  pageCount: number;
};

const EMPTY_RESULT: BillSearchResult = {
  bills: [],
  totalCount: 0,
  page: 1,
  pageCount: 1,
};

/**
 * フリーワード + 絞り込み条件で公開議案を検索する（ページネーション付き）。
 * クエリが最小文字数未満でもフィルタ指定があれば絞り込み一覧として検索する。
 * フリーワードはカーディナリティが高くキャッシュ効率が悪いため unstable_cache は使わない。
 */
export async function searchBills(
  query: string,
  filterParams: SearchFilterParams = {},
  requestedPage = 1
): Promise<BillSearchResult> {
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
    return EMPTY_RESULT;
  }

  // Cookie アクセスはキャッシュ外
  const difficultyLevel = await getDifficultyLevel();

  const fetchPage = (page: number) =>
    findPublishedBillsBySearch(
      effectiveQuery,
      difficultyLevel,
      { limit: SEARCH_PAGE_SIZE, offset: (page - 1) * SEARCH_PAGE_SIZE },
      filters
    );

  const page = clampPage(requestedPage, Number.MAX_SAFE_INTEGER);
  let result = await fetchPage(page);
  let effectivePage = page;

  // 範囲外ページ（URL直打ち・結果数の変動）は最終ページに丸めて取り直す。
  // PostgRESTは範囲外オフセットで総数を返さない（count: null）ため、
  // 1ページ目を取得して総数を得てから最終ページへ移動する
  if (result.count === null) {
    effectivePage = 1;
    result = await fetchPage(1);
    const lastPage = calcPageCount(result.count ?? 0, SEARCH_PAGE_SIZE);
    if (lastPage > 1) {
      effectivePage = lastPage;
      result = await fetchPage(lastPage);
    }
  }

  const totalCount = result.count ?? 0;
  const pageCount = calcPageCount(totalCount, SEARCH_PAGE_SIZE);

  if (result.data.length === 0) {
    return { ...EMPTY_RESULT, totalCount, pageCount };
  }

  const billIds = result.data.map((item) => item.id);
  const [tagsByBillId, interviewBillIds] = await Promise.all([
    findTagsByBillIds(billIds),
    findBillIdsWithPublicInterview(billIds),
  ]);

  const bills = result.data.map((item) => {
    const { bill_contents, ...bill } = item;
    return {
      ...bill,
      bill_content: Array.isArray(bill_contents) ? bill_contents[0] : undefined,
      tags: tagsByBillId.get(item.id) ?? [],
      hasPublicInterview: interviewBillIds.has(item.id),
    };
  });

  return {
    bills,
    totalCount,
    page: effectivePage,
    pageCount,
  };
}
