import { sanitizeSearchQuery } from "@/features/bills/shared/utils/sanitize-search-query";
import { normalizeSearchQuery } from "./normalize-search-query";

/**
 * 入力文字列を「実際に検索へ使われる形」（NFKC正規化 → サニタイズ）に変換する。
 * 最小文字数などの判定はローダー・ページ・結果表示すべてこの結果の長さで行い、
 * 判定のズレ（例: 「㍿」は正規化で「株式会社」の4文字になる）を防ぐ。
 */
export function toSearchableQuery(query: string): string {
  return sanitizeSearchQuery(normalizeSearchQuery(query));
}
