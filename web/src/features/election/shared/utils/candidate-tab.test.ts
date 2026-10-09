import { describe, expect, it } from "vitest";
import { CANDIDATE_TABS, parseCandidateTab } from "./candidate-tab";

describe("parseCandidateTab", () => {
  it("policies を指定したときだけ政策タブになる", () => {
    expect(parseCandidateTab("policies")).toBe("policies");
  });

  it("profile はそのままプロフィールタブ", () => {
    expect(parseCandidateTab("profile")).toBe("profile");
  });

  it("未指定はプロフィールに倒す", () => {
    expect(parseCandidateTab(undefined)).toBe("profile");
  });

  it("不正な値でも404にせずプロフィールに倒す", () => {
    expect(parseCandidateTab("")).toBe("profile");
    expect(parseCandidateTab("POLICIES")).toBe("profile");
    expect(parseCandidateTab("../etc/passwd")).toBe("profile");
  });
});

describe("CANDIDATE_TABS", () => {
  it("プロフィール・政策の順に並ぶ", () => {
    expect(CANDIDATE_TABS.map((tab) => tab.id)).toEqual([
      "profile",
      "policies",
    ]);
  });

  it("parseCandidateTab がすべてのタブIDを往復できる", () => {
    for (const tab of CANDIDATE_TABS) {
      expect(parseCandidateTab(tab.id)).toBe(tab.id);
    }
  });
});
