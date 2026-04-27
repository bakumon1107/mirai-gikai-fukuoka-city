import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { GeneralQuestionTopics } from "@/features/general-questions/client/components/general-question-topics";
import { getGeneralQuestionById } from "@/features/general-questions/server/loaders/get-general-question-by-id";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const question = await getGeneralQuestionById(id);

  if (!question) {
    return { title: "質問が見つかりません" };
  }

  return {
    title: `${question.questioner_name} 議員の一般質問 | ${siteConfig.siteName}`,
    description: question.summary ?? undefined,
  };
}

const DAY_LABELS: Record<number, string> = {
  1: "第1日",
  2: "第2日",
  3: "第3日",
  4: "第4日",
  5: "第5日",
  6: "第6日",
};

export default async function GeneralQuestionDetailPage({ params }: Props) {
  const { id } = await params;
  const question = await getGeneralQuestionById(id);

  if (!question) {
    notFound();
  }

  const dayLabel =
    DAY_LABELS[question.session_day] ?? `第${question.session_day}日`;

  return (
    <Container className="py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-mirai-text">
          {question.questioner_name} 議員
        </h1>
        <p className="mt-1 text-sm text-mirai-text-secondary">
          {question.questioner_party && (
            <span>{question.questioner_party}　｜　</span>
          )}
          {dayLabel}
        </p>
      </div>

      {question.summary && (
        <p className="mb-6 text-mirai-text leading-relaxed">
          {question.summary}
        </p>
      )}

      <GeneralQuestionTopics topics={question.topics} />

      {question.source_url && (
        <div className="mt-8 pt-6 border-t border-border">
          <Link
            href={question.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            公式会議録を見る
          </Link>
        </div>
      )}
    </Container>
  );
}
