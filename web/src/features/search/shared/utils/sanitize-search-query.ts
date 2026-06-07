// PostgREST の or() フィルタ構文で構造的な意味を持つ文字（, . ( ) *）を除去し、
// ユーザー入力をそのままフィルタ文字列へ埋め込む際の条件注入を防ぐ。
// 例: "a,id.neq.0" のような入力が `or=(title.ilike.%a,id.neq.0%, ...)` として
// 解釈され、意図しないフィルタ条件が追加されるのを防止する。
const POSTGREST_FILTER_SPECIAL_CHARS = /[,.()*]/g;

export function sanitizeSearchQuery(query: string): string {
  return query.replace(POSTGREST_FILTER_SPECIAL_CHARS, "");
}
