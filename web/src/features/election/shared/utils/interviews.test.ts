import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { CANDIDATE_INTERVIEWS, INTERVIEW_SERIES } from "../data/interviews";
import type { CandidateInterview, InterviewSeries } from "../types";
import {
  buildInterviewLinks,
  findCandidateInterviews,
  findInterviewLink,
  formatInterviewLinkLabel,
} from "./interviews";

const make = (
  candidateId: string,
  date: string,
  url = `https://www.youtube.com/watch?v=${candidateId}${date}`
): CandidateInterview => ({
  candidateId,
  title: "t",
  url,
  date,
  channel: "c",
});

describe("findCandidateInterviews", () => {
  it("その人の分だけを配信日の新しい順に返す", () => {
    const list = [
      make("a", "2026-10-01"),
      make("b", "2026-10-05"),
      make("a", "2026-10-09"),
    ];
    expect(findCandidateInterviews(list, "a").map((i) => i.date)).toEqual([
      "2026-10-09",
      "2026-10-01",
    ]);
    expect(findCandidateInterviews(list, "z")).toEqual([]);
  });
});

const SERIES: InterviewSeries = {
  title: "s",
  channel: "c",
  playlistUrl: "https://www.youtube.com/playlist?list=PL",
  candidateIds: ["a", "b"],
};

describe("findInterviewLink", () => {
  it("個々の動画があればそれを返す", () => {
    expect(findInterviewLink([make("a", "2026-10-05")], SERIES, "a")).toEqual({
      candidateId: "a",
      href: "https://www.youtube.com/watch?v=a2026-10-05",
      kind: "video",
      date: "2026-10-05",
    });
  });

  it("動画が分からなくてもシリーズに出ていれば再生リストを返す", () => {
    expect(findInterviewLink([], SERIES, "b")).toEqual({
      candidateId: "b",
      href: SERIES.playlistUrl,
      kind: "playlist",
      date: null,
    });
  });

  it("シリーズに出ていない人は null", () => {
    expect(findInterviewLink([], SERIES, "z")).toBeNull();
  });
});

describe("buildInterviewLinks", () => {
  it("渡された並びのまま、シリーズに出ている人だけを並べる", () => {
    const links = buildInterviewLinks([make("b", "2026-10-05")], SERIES, [
      "z",
      "b",
      "a",
    ]);
    expect(links.map((link) => [link.candidateId, link.kind])).toEqual([
      ["b", "video"],
      ["a", "playlist"],
    ]);
  });
});

describe("formatInterviewLinkLabel", () => {
  it("動画は配信日、再生リストは「再生リストから」", () => {
    expect(
      formatInterviewLinkLabel({
        candidateId: "a",
        href: "",
        kind: "video",
        date: "2026-10-19",
      })
    ).toBe("10/19 配信");
    expect(
      formatInterviewLinkLabel({
        candidateId: "a",
        href: "",
        kind: "playlist",
        date: null,
      })
    ).toBe("再生リストから");
  });
});

describe("実データ", () => {
  const candidateIds = CANDIDATES.map((candidate) => candidate.id);

  it("候補者IDが実在し、URL・日付の書式がそろっている", () => {
    for (const interview of CANDIDATE_INTERVIEWS) {
      expect(candidateIds).toContain(interview.candidateId);
      expect(interview.url).toMatch(
        /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/
      );
      expect(interview.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(interview.title).not.toBe("");
    }
  });

  it("シリーズの出演者は実在し、個々の動画はシリーズの出演者の分だけ", () => {
    for (const id of INTERVIEW_SERIES.candidateIds) {
      expect(candidateIds).toContain(id);
    }
    for (const interview of CANDIDATE_INTERVIEWS) {
      expect(INTERVIEW_SERIES.candidateIds).toContain(interview.candidateId);
    }
  });

  it("同じ動画を二重に載せない", () => {
    const urls = CANDIDATE_INTERVIEWS.map((interview) => interview.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
