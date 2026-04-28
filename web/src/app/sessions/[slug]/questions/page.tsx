import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { getCouncilSessionBySlug } from "@/features/council-sessions/server/loaders/get-council-session-by-slug";
import { GeneralQuestionList } from "@/features/general-questions/server/components/general-question-list";
import { getGeneralQuestionsBySession } from "@/features/general-questions/server/loaders/get-general-questions-by-session";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const session = await getCouncilSessionBySlug(slug);

  if (!session) {
    return { title: "定例会が見つかりません" };
  }

  return {
    title: `${session.name}の一般質問 | ${siteConfig.siteName}`,
    description: `${session.name}で行われた一般質問の一覧です。議員が市長・局長に直接質問した内容をわかりやすく解説します。`,
  };
}

export default async function SessionQuestionsPage({ params }: Props) {
  const { slug } = await params;
  const session = await getCouncilSessionBySlug(slug);

  if (!session) {
    notFound();
  }

  const questions = await getGeneralQuestionsBySession(session.id);

  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-mirai-text">
          {session.name}の一般質問
        </h1>
        <p className="mt-2 text-sm text-mirai-text-secondary">
          議員が市長・局長に直接質問した内容をわかりやすく解説します
        </p>
      </div>
      <GeneralQuestionList questions={questions} />
    </Container>
  );
}
