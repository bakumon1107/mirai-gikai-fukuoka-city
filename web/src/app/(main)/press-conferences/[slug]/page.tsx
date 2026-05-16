import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { PressConferenceDetail } from "@/features/press-conferences/client/components/press-conference-detail";
import { pressConference20260420 } from "@/features/press-conferences/shared/fixtures/2026-04-20";
import { pressConference20260511 } from "@/features/press-conferences/shared/fixtures/2026-05-11";
import type { PressConference } from "@/features/press-conferences/shared/types";

// TODO: DB から取得する。現在はフィクスチャを使用
const ALL_FIXTURES: PressConference[] = [
  pressConference20260511,
  pressConference20260420,
];

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PressConferencePage({ params }: Props) {
  const { slug } = await params;

  const pressConference = ALL_FIXTURES.find((pc) => pc.slug === slug);
  if (!pressConference) {
    notFound();
  }

  return (
    <Container className="py-8">
      <PressConferenceDetail pressConference={pressConference} />
    </Container>
  );
}
