export type GeneralQuestionTopic = {
  title: string;
  question_summary: string;
  answer_summary: string;
  answerer_role: string;
  answerer_name: string;
  block_summary?: string | null;
};

/**
 * セッション単位のオーバービュー。
 * - lines: セッション全体の「どんな話があった？」3行（未生成なら null）
 * - themeLines: カテゴリラベル → そのテーマの3行（未生成テーマはキーなし）
 */
export type SessionQuestionOverview = {
  lines: string[] | null;
  themeLines: Record<string, string[]>;
};

/**
 * 質疑の区分。
 * - general: 本会議の一般質問
 * - budget_plenary: 条例予算特別委員会の総会質疑
 *
 * 表示側は general に絞り込む。budget_plenary の見せ方は別途検討する。
 */
export type QuestionType = "general" | "budget_plenary";

export type GeneralQuestion = {
  id: string;
  council_session_id: string;
  question_type: QuestionType;
  questioner_name: string;
  questioner_party: string | null;
  questioner_number: number | null;
  session_day: number;
  question_order: number;
  summary: string | null;
  topics: GeneralQuestionTopic[];
  raw_text: string | null;
  source_url: string | null;
  publish_status: string;
  created_at: string;
  updated_at: string;
};
