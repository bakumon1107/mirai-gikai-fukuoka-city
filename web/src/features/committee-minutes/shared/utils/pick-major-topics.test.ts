import { describe, expect, it } from "vitest";
import type { CommitteeMeetingTopic } from "../types";
import { pickMajorTopics } from "./pick-major-topics";

function topic(
  topicOrder: number,
  startVoiceNo: number | null,
  endVoiceNo: number | null
): CommitteeMeetingTopic {
  return {
    id: `t${topicOrder}`,
    topicOrder,
    title: `議題${topicOrder}`,
    summary: null,
    discussionSummary: null,
    startVoiceNo,
    endVoiceNo,
  };
}

describe("pickMajorTopics", () => {
  it("seq範囲が広い順に上位limit件を選ぶ", () => {
    const topics = [
      topic(1, 1, 3), // size 3
      topic(2, 4, 20), // size 17
      topic(3, 21, 25), // size 5
      topic(4, 26, 40), // size 15
    ];
    const result = pickMajorTopics(topics, 2);
    expect(result.map((t) => t.topicOrder)).toEqual([2, 4]);
  });

  it("範囲が同じ場合はtopicOrder昇順で安定させる", () => {
    const topics = [topic(2, 10, 14), topic(1, 1, 5)]; // どちらもsize5
    const result = pickMajorTopics(topics, 2);
    expect(result.map((t) => t.topicOrder)).toEqual([1, 2]);
  });

  it("範囲(startVoiceNo/endVoiceNo)が無いトピックは除外する", () => {
    const topics = [topic(1, null, null), topic(2, 1, 5)];
    expect(pickMajorTopics(topics, 5).map((t) => t.topicOrder)).toEqual([2]);
  });

  it("limitが件数より多くても全件返す", () => {
    const topics = [topic(1, 1, 5), topic(2, 6, 10)];
    expect(pickMajorTopics(topics, 10)).toHaveLength(2);
  });
});
