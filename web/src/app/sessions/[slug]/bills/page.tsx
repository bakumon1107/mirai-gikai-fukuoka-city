import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { getBillsByCouncilSession } from "@/features/bills/server/loaders/get-bills-by-council-session";
import { SessionBillsPage as SessionBillsPageFeature } from "@/features/bills/server/components/session-bills-page";
import { getCouncilSessionBySlug } from "@/features/council-sessions/server/loaders/get-council-session-by-slug";

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
    title: `${session.name}の議案一覧 | ${siteConfig.siteName}`,
    description: `${session.name}（${session.start_date}〜${session.end_date}）に上程された議案の一覧です。`,
  };
}

export default async function SessionBillsPage({ params }: Props) {
  const { slug } = await params;
  const session = await getCouncilSessionBySlug(slug);

  if (!session) {
    notFound();
  }

  const bills = await getBillsByCouncilSession(session.id);

  return (
    <Container className="py-8">
      <SessionBillsPageFeature session={session} bills={bills} />
    </Container>
  );
}
