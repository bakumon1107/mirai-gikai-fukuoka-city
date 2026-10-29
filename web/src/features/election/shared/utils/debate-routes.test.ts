import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { DEBATES } from "../data/debates";
import { ISSUES } from "../data/issues";
import type { Debate } from "../types";
import {
  attachDebateLinks,
  debatePath,
  findDebateQuestionsForIssue,
  findDebateSectionLink,
  findNewDebate,
  formatDebateMonthDay,
} from "./debate-routes";

const VIDEO = "https://www.youtube.com/watch?v=abc123";

function makeDebate(overrides: Partial<Debate> = {}): Debate {
  return {
    id: "d1",
    title: "討論会",
    shortTitle: "討論会",
    date: "2026-10-28",
    dateLabel: "",
    channel: "",
    videoTitle: "",
    videoUrl: VIDEO,
    duration: "",
    venue: "",
    moderator: "",
    participantIds: ["a", "b"],
    notAppearingIds: [],
    segments: [],
    moderatorPolicy: null,
    takashima: { time: "00:10:00", summary: "", answers: [] },
    questions: [
      {
        no: "01",
        title: "交通",
        proposerIds: ["a"],
        issueIds: ["kotsu"],
        time: "00:20:00",
        summary: "",
        proposals: [{ candidateId: "a", time: "00:20:10", text: "" }],
        answers: [
          { candidateId: "b", time: "00:21:00", text: "" },
          { candidateId: "a", time: "00:22:00", text: "" },
        ],
        closings: [{ candidateId: "a", time: "00:23:00", text: "" }],
        followUps: [],
      },
      {
        no: "02",
        title: "財政",
        proposerIds: ["b"],
        issueIds: ["zaisei", "kotsu"],
        time: "00:30:00",
        summary: "",
        proposals: [],
        answers: [],
        closings: [],
        followUps: [],
      },
    ],
    messages: { time: "00:40:00", answers: [] },
    ...overrides,
  };
}

describe("debatePath", () => {
  it("出演者を渡すと、その人の発言だけを並べる表示にする", () => {
    expect(debatePath("d1")).toBe("/election/2026/debates/d1");
    expect(debatePath("d1", "a")).toBe("/election/2026/debates/d1?candidate=a");
  });
});

describe("formatDebateMonthDay", () => {
  it("月/日 にする", () => {
    expect(formatDebateMonthDay("2026-10-28")).toBe("10/28");
    expect(formatDebateMonthDay("2026-01-05")).toBe("1/5");
  });

  it("書式が崩れていたらそのまま返す", () => {
    expect(formatDebateMonthDay("10月28日")).toBe("10月28日");
  });
});

describe("findNewDebate", () => {
  const debate = makeDebate();

  it("配信日当日から14日目までは新着", () => {
    // 2026-10-28 20:00 JST
    expect(findNewDebate([debate], new Date("2026-10-28T11:00:00Z"))).toBe(
      debate
    );
    // 2026-11-10 23:59 JST（14日目）
    expect(findNewDebate([debate], new Date("2026-11-10T14:59:00Z"))).toBe(
      debate
    );
  });

  it("15日目からは新着にしない", () => {
    // 2026-11-11 00:00 JST
    expect(
      findNewDebate([debate], new Date("2026-11-10T15:00:00Z"))
    ).toBeNull();
  });

  it("日付は日本時間で判定する", () => {
    // 2026-10-27 23:00 UTC = 2026-10-28 08:00 JST
    expect(findNewDebate([debate], new Date("2026-10-27T23:00:00Z"))).toBe(
      debate
    );
    // 2026-10-27 14:00 UTC = 2026-10-27 23:00 JST（配信前日）
    expect(
      findNewDebate([debate], new Date("2026-10-27T14:00:00Z"))
    ).toBeNull();
  });

  it("複数あればいちばん新しいもの", () => {
    const newer = makeDebate({ id: "d2", date: "2026-11-02" });
    expect(
      findNewDebate([debate, newer], new Date("2026-11-03T03:00:00Z"))?.id
    ).toBe("d2");
  });
});

describe("findDebateQuestionsForIssue", () => {
  it("分野に対応づけた問いを、発言した人数とともに返す", () => {
    const result = findDebateQuestionsForIssue([makeDebate()], "kotsu");
    expect(result.map((item) => item.question.no)).toEqual(["01", "02"]);
    expect(result[0].speakerCount).toBe(2);
    expect(result[1].speakerCount).toBe(0);
  });

  it("対応がなければ空", () => {
    expect(findDebateQuestionsForIssue([makeDebate()], "bosai")).toEqual([]);
  });
});

describe("findDebateSectionLink", () => {
  const debates = [makeDebate()];
  const at = (seconds: number) => ({ url: `${VIDEO}&t=${seconds}s` });

  it("問いの時間帯の発言は、その問いへのリンクにする", () => {
    expect(findDebateSectionLink(debates, at(21 * 60))).toEqual({
      href: "/election/2026/debates/d1#q-01",
      label: "この問いでの全員の回答を見る（問い01 交通）",
    });
    expect(findDebateSectionLink(debates, at(30 * 60))?.href).toBe(
      "/election/2026/debates/d1#q-02"
    );
  });

  it("高島市政の評価とメッセージの時間帯も場面へ飛ばす", () => {
    expect(findDebateSectionLink(debates, at(10 * 60 + 5))?.href).toBe(
      "/election/2026/debates/d1#takashima"
    );
    expect(findDebateSectionLink(debates, at(45 * 60))?.href).toBe(
      "/election/2026/debates/d1#messages"
    );
  });

  it("自己紹介など、どの場面にも入らない時刻は null", () => {
    expect(findDebateSectionLink(debates, at(60))).toBeNull();
  });

  it("討論会以外の動画・再生位置のないURL・URLなしは null", () => {
    expect(
      findDebateSectionLink(debates, {
        url: "https://www.youtube.com/watch?v=other&t=1300s",
      })
    ).toBeNull();
    expect(findDebateSectionLink(debates, { url: VIDEO })).toBeNull();
    expect(findDebateSectionLink(debates, { url: undefined })).toBeNull();
    expect(findDebateSectionLink(debates, { url: "not a url" })).toBeNull();
  });
});

describe("attachDebateLinks", () => {
  it("討論会の発言にだけリンクを付け、ほかの行は変えない", () => {
    const other = {
      date: "2026-09-01",
      place: "記者会見",
      source: "会見",
      text: "x",
      url: "https://example.com/",
    };
    const debateLog = {
      date: "2026-10-28",
      place: "討論会",
      source: "討論会",
      text: "y",
      url: `${VIDEO}&t=1260s`,
    };
    const [first, second] = attachDebateLinks(
      [makeDebate()],
      [other, debateLog]
    );
    expect(first).toEqual(other);
    expect(second.related?.href).toBe("/election/2026/debates/d1#q-01");
  });
});

describe("実データ", () => {
  const issueIds = ISSUES.map((issue) => issue.id);

  it("どの問いも、実在する分野に1つ以上対応づけてある", () => {
    for (const debate of DEBATES) {
      for (const question of debate.questions) {
        expect(question.issueIds.length, question.no).toBeGreaterThan(0);
        for (const id of question.issueIds) {
          expect(issueIds).toContain(id);
        }
      }
    }
  });

  it("候補者ページの討論会の発言は、すべて討論会ページの場面に飛べる", () => {
    const debateLogs = CANDIDATES.flatMap((candidate) => [
      ...(candidate.takashimaAssessment?.log ?? []),
      ...Object.values(candidate.positions).flatMap((position) => position.log),
    ]).filter((log) => log.place === "討論会");
    expect(debateLogs.length).toBeGreaterThan(0);
    for (const log of debateLogs) {
      expect(
        findDebateSectionLink(DEBATES, log),
        log.text.slice(0, 30)
      ).not.toBeNull();
    }
  });

  // 争点ページの「討論会でこの分野が問われました」と、候補者ページで発言を載せた分野がずれないようにする
  it("各問いの発言をいちばん多く載せた分野は、その問いの issueIds に入っている", () => {
    const counts = new Map<string, Map<string, number>>();
    for (const candidate of CANDIDATES) {
      for (const [issueId, position] of Object.entries(candidate.positions)) {
        for (const log of position.log) {
          const href = findDebateSectionLink(DEBATES, log)?.href;
          if (!href?.includes("#q-")) {
            continue;
          }
          const byIssue = counts.get(href) ?? new Map<string, number>();
          byIssue.set(issueId, (byIssue.get(issueId) ?? 0) + 1);
          counts.set(href, byIssue);
        }
      }
    }
    expect(counts.size).toBeGreaterThan(0);
    for (const debate of DEBATES) {
      for (const question of debate.questions) {
        const byIssue = counts.get(
          `/election/2026/debates/${debate.id}#q-${question.no}`
        );
        if (!byIssue) {
          continue;
        }
        const [top] = [...byIssue.entries()].sort((a, b) => b[1] - a[1]);
        expect(question.issueIds, `問い${question.no}`).toContain(top[0]);
      }
    }
  });
});
