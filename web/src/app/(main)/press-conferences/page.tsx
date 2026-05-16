import { Container } from "@/components/layouts/container";
import { PressConferenceList } from "@/features/press-conferences/client/components/press-conference-list";
import { pressConference20260420 } from "@/features/press-conferences/shared/fixtures/2026-04-20";
import { pressConference20260511 } from "@/features/press-conferences/shared/fixtures/2026-05-11";

// TODO: DB から取得する。現在はフィクスチャを使用（新しい順）
const pressConferences = [pressConference20260511, pressConference20260420];

export default function PressConferencesPage() {
  return (
    <Container className="py-8">
      <PressConferenceList pressConferences={pressConferences} />
    </Container>
  );
}
