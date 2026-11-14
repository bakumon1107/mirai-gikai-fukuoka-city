import { describe, expect, it } from "vitest";
import { ELECTION_SCHEDULE } from "../data/schedule";
import { isElectionPageHidden, isElectionPath } from "./visibility";

const schedule = { hiddenAt: "2026-11-14T23:59:00+09:00" };

describe("isElectionPageHidden", () => {
  it("非公開日時の直前は表示する", () => {
    const now = new Date("2026-11-14T23:58:59+09:00");
    expect(isElectionPageHidden(now, schedule)).toBe(false);
  });

  it("非公開日時ちょうどから非表示にする", () => {
    const now = new Date("2026-11-14T23:59:00+09:00");
    expect(isElectionPageHidden(now, schedule)).toBe(true);
  });

  it("投票日当日は非表示にする", () => {
    const now = new Date("2026-11-15T10:00:00+09:00");
    expect(isElectionPageHidden(now, schedule)).toBe(true);
  });

  it("UTCで表した同じ時刻でも判定が変わらない", () => {
    const now = new Date("2026-11-14T14:59:00Z");
    expect(isElectionPageHidden(now, schedule)).toBe(true);
  });
});

describe("ELECTION_SCHEDULE.hiddenAt", () => {
  it("投票日前日の23:59（日本時間）に非公開にする", () => {
    expect(ELECTION_SCHEDULE.hiddenAt).toBe("2026-11-14T23:59:00+09:00");
  });

  it("投票締切より前に非公開になる", () => {
    expect(new Date(ELECTION_SCHEDULE.hiddenAt).getTime()).toBeLessThan(
      new Date(ELECTION_SCHEDULE.voteClosesAt).getTime()
    );
  });
});

describe("isElectionPath", () => {
  it.each([
    "/election",
    "/election/2026",
    "/election/2026/candidates/abc",
    "/election/2026/debates/rehacq",
  ])("%s は特設ページ配下", (path) => {
    expect(isElectionPath(path)).toBe(true);
  });

  it.each([
    "/",
    "/elections",
    "/electionx",
    "/bills/election",
  ])("%s は特設ページ配下ではない", (path) => {
    expect(isElectionPath(path)).toBe(false);
  });
});
