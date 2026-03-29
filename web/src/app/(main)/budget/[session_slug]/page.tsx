import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { getDifficultyLevel } from "@/features/bill-difficulty/server/loaders/get-difficulty-level";
import { getCouncilSessionBySlug } from "@/features/council-sessions/server/loaders/get-council-session-by-slug";
import { getBudgetOverviews } from "@/features/budget-overview/server/loaders/get-budget-overviews";
import { BudgetOverviewList } from "@/features/budget-overview/server/components/budget-overview-list";
import { BudgetChatClient } from "@/features/budget-overview/client/components/budget-chat-client";
import { siteConfig } from "@/config/site.config";

interface BudgetListPageProps {
  params: Promise<{
    session_slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BudgetListPageProps): Promise<Metadata> {
  const { session_slug } = await params;
  const session = await getCouncilSessionBySlug(session_slug);

  if (!session) {
    return { title: "会期が見つかりません" };
  }

  return {
    title: `${session.name} 各局の重点施策`,
    description: `${session.name}の各局予算の重点施策・方向性をわかりやすく解説します。`,
  };
}

export default async function BudgetListPage({ params }: BudgetListPageProps) {
  const { session_slug } = await params;

  const [session, currentDifficulty] = await Promise.all([
    getCouncilSessionBySlug(session_slug),
    getDifficultyLevel(),
  ]);
  if (!session) {
    notFound();
  }

  const overviews = await getBudgetOverviews(session.id);

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mirai-text">各局の重点施策</h1>
        <p className="mt-2 text-sm text-mirai-text-secondary">
          {session.name} の各局予算の方向性と主要施策をまとめています。
        </p>
      </div>

      <BudgetOverviewList overviews={overviews} sessionSlug={session_slug} />

      {siteConfig.features.aiChat && overviews.length > 0 && (
        <BudgetChatClient
          currentDifficulty={currentDifficulty}
          budget={{
            departmentName: `${session.name} 各局`,
            themes: overviews.map((o) => ({
              title: o.department_name,
              aiSummary: o.direction,
            })),
          }}
        />
      )}
    </Container>
  );
}
