// 検索を実行する最小クエリ文字数（これ未満はノイズが多いため検索しない）
export const MIN_QUERY_LENGTH = 2;

// 検索結果の最大件数（全件表示ケースを収容できる値。超えたらページネーションを検討）
export const SEARCH_RESULT_LIMIT = 100;

// 未入力時・0件時に提案するキーワード
export const SUGGESTED_KEYWORDS = ["医療", "教育", "税金", "防災", "デジタル"];
