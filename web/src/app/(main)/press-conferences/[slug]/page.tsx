import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { PressConferenceDetail } from "@/features/press-conferences/client/components/press-conference-detail";
import { samplePressConference } from "@/features/press-conferences/shared/fixtures/sample";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PressConferencePage({ params }: Props) {
  const { slug } = await params;

  // TODO: DB から取得する。現在はフィクスチャを使用
  if (slug !== samplePressConference.slug) {
    notFound();
  }

  return (
    <Container className="py-8">
      <PressConferenceDetail pressConference={samplePressConference} />
    </Container>
  );
}
