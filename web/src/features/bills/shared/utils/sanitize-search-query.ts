// PostgREST の or() フィルタ構文で構造的な意味を持つ文字（, . ( ) *）を除去し、
// ユーザー入力をそのままフィルタ文字列へ埋め込む際の条件注入を防ぐ。
// 例: "a,id.neq.0" のような入力が `or=(title.ilike.%a,id.neq.0%, ...)` として
// 解釈され、意図しないフィルタ条件が追加されるのを防止する。
// 構造文字の除去は冪等（2回適用しても結果が変わらない）。
const POSTGREST_FILTER_SPECIAL_CHARS = /[,.()*]/g;

export function sanitizeSearchQuery(query: string): string {
  return query.replace(POSTGREST_FILTER_SPECIAL_CHARS, "").trim();
}

// ILIKE パターンで特殊な意味を持つ文字（% _ \）をエスケープし、
// ユーザー入力がワイルドカードとして解釈されるのを防ぐ。
// 例: "%%" が全件マッチになる、"50%" が「50で始まる任意の文字列」になる等。
// エスケープは冪等ではないため、クエリ埋め込み直前に1回だけ適用すること。
const ILIKE_SPECIAL_CHARS = /[\\%_]/g;

export function escapeIlikePattern(query: string): string {
  return query.replace(ILIKE_SPECIAL_CHARS, "\\$&");
}
