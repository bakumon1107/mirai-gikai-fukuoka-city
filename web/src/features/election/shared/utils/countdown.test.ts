import { describe, expect, it } from "vitest";
import { getCountdown } from "./countdown";

const voteClosesAt = "2026-11-15T20:00:00+09:00";

describe("getCountdown", () => {
  it("ちょうど1日前は days=1 / clock=00:00:00", () => {
    const now = new Date("2026-11-14T20:00:00+09:00");
    expect(getCountdown(now, voteClosesAt)).toEqual({
      days: 1,
      clock: "00:00:00",
    });
  });

  it("端数のある残り時間を日数と HH:MM:SS に分解する", () => {
    // 締切の 2日 3時間 4分 5秒 前
    const now = new Date("2026-11-13T16:55:55+09:00");
    expect(getCountdown(now, voteClosesAt)).toEqual({
      days: 2,
      clock: "03:04:05",
    });
  });

  it("24時間未満は days=0 になる", () => {
    const now = new Date("2026-11-15T09:30:00+09:00");
    expect(getCountdown(now, voteClosesAt)).toEqual({
      days: 0,
      clock: "10:30:00",
    });
  });

  it("締切ちょうどは 0 になる", () => {
    const now = new Date(voteClosesAt);
    expect(getCountdown(now, voteClosesAt)).toEqual({
      days: 0,
      clock: "00:00:00",
    });
  });

  it("締切を過ぎても負値にならず 0 にクランプされる", () => {
    const now = new Date("2026-12-01T12:00:00+09:00");
    expect(getCountdown(now, voteClosesAt)).toEqual({
      days: 0,
      clock: "00:00:00",
    });
  });

  it("1時間未満・1分未満もゼロ埋めされる", () => {
    const now = new Date("2026-11-15T19:59:01+09:00");
    expect(getCountdown(now, voteClosesAt)).toEqual({
      days: 0,
      clock: "00:00:59",
    });
  });
});
