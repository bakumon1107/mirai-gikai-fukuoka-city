import { SessionQuestionsOverview } from "../../client/components/session-questions-overview";
import type {
  GeneralQuestion,
  SessionQuestionOverview,
} from "../../shared/types";
import { buildTopicGroups } from "../../shared/utils/build-topic-groups";

interface SessionTopicsViewProps {
  questions: GeneralQuestion[];
  /** セッション単位のオーバービュー（全体3行＋テーマ別3行）。 */
  overview: SessionQuestionOverview;
}

export function SessionTopicsView({
  questions,
  overview,
}: SessionTopicsViewProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-16 text-mirai-text-secondary">
        <p>現在、一般質問のデータを準備中です。</p>
        <p className="text-sm mt-2">しばらくお待ちください。</p>
      </div>
    );
  }

  const groups = buildTopicGroups(questions);

  return <SessionQuestionsOverview groups={groups} overview={overview} />;
}
