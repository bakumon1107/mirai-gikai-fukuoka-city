import { describe, expect, it } from "vitest";
import type { ElectionSchedule } from "../types";
import {
  getCandidateNoun,
  getElectionPhase,
  getOrderLabel,
} from "./election-phase";

const schedule = {
  kokujiAt: "2026-11-01T00:00:00+09:00",
  voteClosesAt: "2026-11-15T20:00:00+09:00",
} as ElectionSchedule;

describe("getElectionPhase", () => {
  it("告示日の直前は before-kokuji", () => {
    const now = new Date("2026-10-31T23:59:59+09:00");
    expect(getElectionPhase(now, schedule)).toBe("before-kokuji");
  });

  it("告示日の00:00ちょうどは campaigning", () => {
    const now = new Date("2026-11-01T00:00:00+09:00");
    expect(getElectionPhase(now, schedule)).toBe("campaigning");
  });

  it("告示日から投票締切までは campaigning", () => {
    const now = new Date("2026-11-15T19:59:59+09:00");
    expect(getElectionPhase(now, schedule)).toBe("campaigning");
  });

  it("投票締切ちょうどは after-vote", () => {
    const now = new Date("2026-11-15T20:00:00+09:00");
    expect(getElectionPhase(now, schedule)).toBe("after-vote");
  });

  it("投票日翌日は after-vote", () => {
    const now = new Date("2026-11-16T09:00:00+09:00");
    expect(getElectionPhase(now, schedule)).toBe("after-vote");
  });
});

describe("getCandidateNoun", () => {
  it("告示前は法令上の呼称に合わせて立候補予定者とする", () => {
    expect(getCandidateNoun("before-kokuji")).toBe("立候補予定者");
  });

  it("告示後は候補者とする", () => {
    expect(getCandidateNoun("campaigning")).toBe("候補者");
    expect(getCandidateNoun("after-vote")).toBe("候補者");
  });
});

describe("getOrderLabel", () => {
  it("告示前は表明順", () => {
    expect(getOrderLabel("before-kokuji")).toBe("表明順");
  });

  it("告示後は届出順", () => {
    expect(getOrderLabel("campaigning")).toBe("届出順");
    expect(getOrderLabel("after-vote")).toBe("届出順");
  });
});
