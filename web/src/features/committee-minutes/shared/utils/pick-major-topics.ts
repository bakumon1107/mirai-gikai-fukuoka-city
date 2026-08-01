import type { CommitteeMeetingTopic } from "../types";

/**
 * 主要トピックを「やりとりが多い順」（＝seq範囲が広い順）に上位 limit 件選ぶ。
 * 一覧カード用。発言本体を持たない一覧データでも使えるよう、質疑・答弁の件数の
 * 近似として seq 範囲の広さ（endVoiceNo - startVoiceNo + 1）を用いる
 * （note は会議冒頭に偏在するため範囲内の誤差は小さい）。
 * 範囲が同じ場合は topicOrder 昇順で安定させる。
 */
export function pickMajorTopics(
  topics: CommitteeMeetingTopic[],
  limit: number
): CommitteeMeetingTopic[] {
  return topics
    .filter((t) => t.startVoiceNo != null && t.endVoiceNo != null)
    .map((t) => ({
      topic: t,
      size: (t.endVoiceNo as number) - (t.startVoiceNo as number) + 1,
    }))
    .sort((a, b) => b.size - a.size || a.topic.topicOrder - b.topic.topicOrder)
    .slice(0, Math.max(0, limit))
    .map((x) => x.topic);
}
