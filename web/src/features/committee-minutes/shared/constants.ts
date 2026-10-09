/**
 * 福岡市議会 会議録検索システムの「会議名でさがす」ページ。
 *
 * 同システムは文書を指す DocumentID を随時振り直す（委員会ごとの連番ブロックで
 * 管理されており、前のブロックに文書が追加されると後続が全てずれる）。
 * 個別文書への直リンクは市が新しい議事録を公開するたびに別の会議を指してしまうため、
 * 出典リンクは委員会名から辿れるこの検索ページに固定する。
 * パス中の数字はセッションIDで、任意の値を渡すとサーバー側が新しいセッションを払い出す。
 */
export const MINUTES_SEARCH_BY_MEETING_URL =
  "https://www.city.fukuoka.fukuoka.dbsr.jp/index.php/1?Template=search-meeting";
