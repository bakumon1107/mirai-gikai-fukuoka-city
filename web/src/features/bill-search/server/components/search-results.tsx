import { BillList } from "@/features/bills/client/components/bill-list/bill-list";
import type { BillWithContent } from "@/features/bills/shared/types";
import { MIN_QUERY_LENGTH } from "../../shared/constants";

interface SearchResultsProps {
  query: string;
  bills: BillWithContent[] | null;
  hasActiveFilters?: boolean;
}

export function SearchResults({
  query,
  bills,
  hasActiveFilters = false,
}: SearchResultsProps) {
  // 未検索（クエリ・フィルタなし）
  if (bills === null) {
    return (
      <p className="text-mirai-text-secondary text-center py-12">
        キーワードまたは絞り込み条件を指定して議案を検索できます。
      </p>
    );
  }

  const hasValidQuery = query.trim().length >= MIN_QUERY_LENGTH;
  const queryTooShort = query !== "" && !hasValidQuery;

  // クエリが短すぎてフィルタもない場合は案内のみ表示
  if (queryTooShort && !hasActiveFilters) {
    return (
      <p className="text-mirai-text-secondary text-center py-12">
        キーワードは{MIN_QUERY_LENGTH}文字以上で入力してください。
      </p>
    );
  }

  // ヒットなし
  if (bills.length === 0) {
    return (
      <p className="text-mirai-text-secondary text-center py-12">
        {hasValidQuery
          ? `「${query}」に一致する議案は見つかりませんでした。`
          : "条件に一致する議案は見つかりませんでした。"}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* クエリが短くフィルタのみで検索された場合の注意書き */}
      {queryTooShort && (
        <p className="text-xs text-mirai-text-secondary">
          キーワードは{MIN_QUERY_LENGTH}
          文字以上で指定してください（絞り込み条件のみで表示しています）。
        </p>
      )}
      <p className="text-sm text-mirai-text-secondary">
        {hasValidQuery
          ? `「${query}」の検索結果: ${bills.length}件`
          : `絞り込み結果: ${bills.length}件`}
      </p>
      <BillList bills={bills} />
    </div>
  );
}
