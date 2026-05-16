import { MessageCircle, User } from "lucide-react";
import { mockGeneralQuestions } from "@/app/dev/_lib/mock-data";
import type { GeneralQuestion } from "@/features/general-questions/shared/types";

function ChatBubbleQuestion({ text }: { text: string }) {
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="max-w-[75%] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3">
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <User className="h-4 w-4" />
      </div>
    </div>
  );
}

function ChatBubbleAnswer({
  text,
  role,
  name,
}: {
  text: string;
  role: string;
  name: string;
}) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mirai-surface-muted border border-border">
        <MessageCircle className="h-4 w-4 text-mirai-text-secondary" />
      </div>
      <div className="max-w-[75%]">
        <p className="mb-1 text-xs text-mirai-text-secondary">
          {role}
          {name ? `　${name}` : ""}
        </p>
        <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3">
          <p className="text-sm leading-relaxed text-mirai-text">{text}</p>
        </div>
      </div>
    </div>
  );
}

function GeneralQuestionChatView({ question }: { question: GeneralQuestion }) {
  const dayLabel = `第${question.session_day}日`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
            {question.questioner_name[0]}
          </div>
          <div>
            <h2 className="font-bold text-lg text-mirai-text">
              {question.questioner_name} 議員
            </h2>
            <p className="text-sm text-mirai-text-secondary">
              {question.questioner_party}　|　{dayLabel}・
              {question.question_order}番目
            </p>
          </div>
        </div>
        {question.summary && (
          <p className="mt-3 text-sm text-mirai-text-secondary bg-mirai-surface-muted rounded-lg px-4 py-3">
            {question.summary}
          </p>
        )}
      </div>

      {/* トピックごとの会話 */}
      <div className="flex flex-col gap-8">
        {question.topics.map((topic, i) => (
          <div key={`${topic.title}-${i}`} className="flex flex-col gap-3">
            <p className="text-center text-xs font-medium text-mirai-text-secondary bg-mirai-surface-muted rounded-full px-3 py-1 mx-auto">
              {topic.title}
            </p>
            <ChatBubbleQuestion text={topic.question_summary} />
            <ChatBubbleAnswer
              text={topic.answer_summary}
              role={topic.answerer_role}
              name={topic.answerer_name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatStyleDevPage() {
  const question = mockGeneralQuestions[0];

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-2xl font-bold text-mirai-text mb-1">
          一般質問 チャット形式（案）
        </h1>
        <p className="text-sm text-mirai-text-secondary mb-8">
          質問を右バブル・答弁を左バブルで表示するLINE風レイアウト
        </p>
        <GeneralQuestionChatView question={question} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-mirai-text mb-4 pb-2 border-b border-border">
          別の議員（2人目）
        </h2>
        <GeneralQuestionChatView question={mockGeneralQuestions[1]} />
      </div>
    </div>
  );
}
