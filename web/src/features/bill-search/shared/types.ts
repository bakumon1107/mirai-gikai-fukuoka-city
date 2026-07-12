// 検索の絞り込み条件（URLパラメータと1:1対応）
export type SearchFilterParams = {
  // diet_sessions.id
  session?: string;
  // tags.id
  tag?: string;
  // ステータスフィルタ値（status-filter.ts の STATUS_FILTER_OPTIONS のキー）
  status?: string;
  // "1" のとき公開中のAIインタビューがある議案に絞る
  interview?: string;
};

// フィルタ選択肢の表示用データ
export type SearchFilterOptions = {
  sessions: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; label: string }>;
};
