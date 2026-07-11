import "server-only";
import { BillList } from "@/features/bills/client/components/bill-list/bill-list";
import type { BillWithContent } from "@/features/bills/shared/types";
import { sanitizeSearchQuery } from "@/features/bills/shared/utils/sanitize-search-query";
import { MIN_QUERY_LENGTH } from "../../shared/constants";

interface SearchResultsProps {
  query: string;
  bills: BillWithContent[] | null;
}

export function SearchResults({ query, bills }: SearchResultsProps) {
  // 未検索（クエリなし）
  if (bills === null) {
    return (
      <p className="text-mirai-text-secondary text-center py-12">
        キーワードを入力して議案を検索できます。
      </p>
    );
  }

  // クエリが短すぎる（ローダーと同じ基準＝サニタイズ後の長さで判定する）
  if (sanitizeSearchQuery(query).length < MIN_QUERY_LENGTH) {
    return (
      <p className="text-mirai-text-secondary text-center py-12">
        {MIN_QUERY_LENGTH}文字以上で検索してください。
      </p>
    );
  }

  // ヒットなし
  if (bills.length === 0) {
    return (
      <p className="text-mirai-text-secondary text-center py-12">
        「{query}」に一致する議案は見つかりませんでした。
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-mirai-text-secondary">
        「{query}」の検索結果: {bills.length}件
      </p>
      <BillList bills={bills} />
    </div>
  );
}
