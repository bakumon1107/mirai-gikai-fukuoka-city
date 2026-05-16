import { Container } from "@/components/layouts/container";
import { PressConferenceList } from "@/features/press-conferences/client/components/press-conference-list";
import { samplePressConference } from "@/features/press-conferences/shared/fixtures/sample";

// TODO: DB から取得する。現在はフィクスチャを使用
const pressConferences = [samplePressConference];

export default function PressConferencesPage() {
  return (
    <Container className="py-8">
      <PressConferenceList pressConferences={pressConferences} />
    </Container>
  );
}
