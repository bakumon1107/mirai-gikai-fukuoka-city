import type { CandidateInterview, InterviewSeries } from "../types";
import { formatDebateMonthDay } from "./debate-routes";

/** その候補者のインタビュー。配信日の新しい順 */
export function findCandidateInterviews(
  interviews: readonly CandidateInterview[],
  candidateId: string
): CandidateInterview[] {
  return interviews
    .filter((interview) => interview.candidateId === candidateId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export type InterviewLink = {
  candidateId: string;
  href: string;
  /** 個々の動画なら "video"、URLが分からず再生リストで案内するなら "playlist" */
  kind: "video" | "playlist";
  /** 個々の動画の配信日。再生リストなら null */
  date: string | null;
};

/**
 * 候補者のインタビューへのリンク。個々の動画が分かればそれを、
 * 分からなければシリーズの再生リストを返す。シリーズに出ていない人は null。
 */
export function findInterviewLink(
  interviews: readonly CandidateInterview[],
  series: InterviewSeries,
  candidateId: string
): InterviewLink | null {
  const video = findCandidateInterviews(interviews, candidateId)[0];
  if (video) {
    return { candidateId, href: video.url, kind: "video", date: video.date };
  }
  if (series.candidateIds.includes(candidateId)) {
    return {
      candidateId,
      href: series.playlistUrl,
      kind: "playlist",
      date: null,
    };
  }
  return null;
}

/**
 * 討論会ページの「事前インタビュー」の行。渡された並び（表明順）で、シリーズに出ている人だけを並べる。
 */
export function buildInterviewLinks(
  interviews: readonly CandidateInterview[],
  series: InterviewSeries,
  candidateIds: readonly string[]
): InterviewLink[] {
  return candidateIds
    .map((candidateId) => findInterviewLink(interviews, series, candidateId))
    .filter((link): link is InterviewLink => link !== null);
}

/** リンクに添える文言。個々の動画は配信日、再生リストで案内する人は「再生リストから」 */
export function formatInterviewLinkLabel(link: InterviewLink): string {
  return link.kind === "video" && link.date
    ? `${formatDebateMonthDay(link.date)} 配信`
    : "再生リストから";
}
