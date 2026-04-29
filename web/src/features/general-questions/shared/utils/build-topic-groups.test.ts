import { describe, expect, it } from "vitest";
import { assignCategory, buildTopicGroups } from "./build-topic-groups";
import type { GeneralQuestion } from "../types";

describe("assignCategory", () => {
  it("保育所 → 子育て・教育", () => {
    expect(assignCategory("保育所の待機児童対策").label).toBe("子育て・教育");
  });
  it("耐震 → 防災・安全", () => {
    expect(assignCategory("木造密集市街地の耐震化促進").label).toBe(
      "防災・安全"
    );
  });
  it("マッチしない → その他", () => {
    expect(assignCategory("特になし").label).toBe("その他");
  });
});

const mockQuestion: GeneralQuestion = {
  id: "q-001",
  council_session_id: "session-1",
  questioner_name: "山田花子",
  questioner_party: "テスト会派",
  questioner_number: 1,
  session_day: 1,
  question_order: 1,
  summary: null,
  topics: [
    {
      title: "保育所の待機児童対策",
      question_summary: "待機児童の解消策は？",
      answer_summary: "令和9年度中に解消予定。",
      answerer_role: "子ども未来局長",
      answerer_name: "田中一郎",
    },
    {
      title: "木造密集市街地の耐震化促進",
      question_summary: "補助を拡充せよ。",
      answer_summary: "令和8年度から150万円に引き上げ。",
      answerer_role: "住宅都市局長",
      answerer_name: "松本雅彦",
    },
  ],
  raw_text: null,
  source_url: null,
  publish_status: "published",
  created_at: "2026-04-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
};

describe("buildTopicGroups", () => {
  it("トピックをカテゴリ別に分類する", () => {
    const groups = buildTopicGroups([mockQuestion]);
    const labels = groups.map((g) => g.categoryLabel);
    expect(labels).toContain("子育て・教育");
    expect(labels).toContain("防災・安全");
  });

  it("各グループにentryが含まれる", () => {
    const groups = buildTopicGroups([mockQuestion]);
    const childCare = groups.find((g) => g.categoryLabel === "子育て・教育");
    expect(childCare?.entries).toHaveLength(1);
    expect(childCare?.entries[0].questioner.id).toBe("q-001");
  });

  it("空配列は空グループを返す", () => {
    expect(buildTopicGroups([])).toHaveLength(0);
  });
});
