import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { DEBATES } from "../data/debates";
import type { Debate } from "../types";
import {
  collectCandidateStatements,
  collectDebateCandidateIds,
  collectDebateTimes,
  parseDebateCandidate,
  sortByCandidateOrder,
} from "./debate";

const DEBATE: Debate = {
  id: "test",
  title: "テスト討論会",
  shortTitle: "テスト",
  date: "2026-10-28",
  dateLabel: "2026年10月28日",
  channel: "ch",
  videoTitle: "v",
  videoUrl: "https://example.com/watch?v=x",
  duration: "1時間",
  venue: "会場",
  moderator: "司会",
  participantIds: ["a", "b"],
  notAppearingIds: [],
  segments: [{ label: "自己紹介", detail: "1人45秒", time: "00:01:00" }],
  moderatorPolicy: null,
  takashima: {
    time: "00:02:00",
    summary: "まとめ",
    answers: [
      {
        candidateId: "a",
        time: "00:02:10",
        flipKeep: "続",
        flipChange: "変",
        keep: "続ける点",
        change: "変える点",
        followUp: { time: "00:03:00", text: "追加の答え" },
      },
      {
        candidateId: "b",
        time: "00:02:40",
        flipKeep: "FK",
        flipChange: "FC",
        keep: "K",
        change: "C",
      },
    ],
  },
  questions: [
    {
      no: "01",
      title: "問いの題",
      proposerIds: ["b"],
      issueIds: ["kotsu"],
      time: "00:10:00",
      summary: "問いのまとめ",
      proposals: [{ candidateId: "b", time: "00:10:10", text: "提起" }],
      answers: [
        { candidateId: "a", time: "00:11:00", text: "回答" },
        { candidateId: "b", time: "00:11:30", text: "回答B" },
      ],
      closings: [{ candidateId: "b", time: "00:12:00", text: "まとめ" }],
      followUps: [
        {
          title: "追加",
          time: "00:13:00",
          answers: [{ candidateId: "a", time: "00:13:10", text: "追加回答" }],
        },
      ],
    },
  ],
  messages: {
    time: "00:20:00",
    answers: [{ candidateId: "a", time: "00:20:10", text: "メッセージ" }],
  },
};

describe("sortByCandidateOrder", () => {
  it("並びの順にそろえ、同じ人の中では元の順を保つ", () => {
    const items = [
      { candidateId: "c", n: 1 },
      { candidateId: "a", n: 2 },
      { candidateId: "c", n: 3 },
      { candidateId: "b", n: 4 },
    ];
    expect(
      sortByCandidateOrder(items, ["a", "b", "c"]).map((item) => item.n)
    ).toEqual([2, 4, 1, 3]);
  });

  it("並びにない ID は末尾に回す", () => {
    const items = [{ candidateId: "x" }, { candidateId: "a" }];
    expect(
      sortByCandidateOrder(items, ["a"]).map((item) => item.candidateId)
    ).toEqual(["a", "x"]);
  });

  it("元の配列は変えない", () => {
    const items = [{ candidateId: "b" }, { candidateId: "a" }];
    sortByCandidateOrder(items, ["a", "b"]);
    expect(items[0].candidateId).toBe("b");
  });
});

describe("parseDebateCandidate", () => {
  it("出演者の ID だけを受け付ける", () => {
    expect(parseDebateCandidate("a", ["a", "b"])).toBe("a");
    expect(parseDebateCandidate("z", ["a", "b"])).toBeNull();
    expect(parseDebateCandidate(undefined, ["a"])).toBeNull();
    expect(parseDebateCandidate("", ["a"])).toBeNull();
  });
});

describe("collectCandidateStatements", () => {
  it("フリップ・回答・追加の問い・メッセージを討論会の順に集める", () => {
    const result = collectCandidateStatements(DEBATE, "a");
    expect(result.map((item) => [item.role, item.statement.time])).toEqual([
      ["フリップ", "00:02:10"],
      ["回答", "00:03:00"],
      ["回答", "00:11:00"],
      ["追加の問い", "00:13:10"],
      ["メッセージ", "00:20:10"],
    ]);
    expect(result[0].statement.text).toBe(
      "継続すること「続」：続ける点／変更すること「変」：変える点"
    );
    expect(result[3].section).toBe("問い01 問いの題（追加）");
  });

  it("フリップ以上の説明がなければフリップだけを載せる", () => {
    const debate: Debate = {
      ...DEBATE,
      takashima: {
        ...DEBATE.takashima,
        answers: [
          {
            candidateId: "a",
            time: "00:02:10",
            flipKeep: "続",
            flipChange: "変",
            keep: "",
            change: "変える点",
          },
        ],
      },
    };
    expect(collectCandidateStatements(debate, "a")[0].statement.text).toBe(
      "継続すること「続」／変更すること「変」：変える点"
    );
  });

  it("提起した人の問題提起とまとめも拾う", () => {
    const roles = collectCandidateStatements(DEBATE, "b").map(
      (item) => item.role
    );
    expect(roles).toEqual(["フリップ", "問題提起", "回答", "まとめ"]);
  });

  it("発言のない人は空", () => {
    expect(collectCandidateStatements(DEBATE, "zzz")).toEqual([]);
  });
});

describe("討論会データの整合性", () => {
  const candidateIds = CANDIDATES.map((candidate) => candidate.id);

  for (const debate of DEBATES) {
    it(`${debate.id}: 候補者IDがすべて実在し、出演者に含まれる`, () => {
      for (const id of collectDebateCandidateIds(debate)) {
        expect(candidateIds).toContain(id);
        expect(debate.participantIds).toContain(id);
      }
    });

    it(`${debate.id}: 再生位置がすべて "HH:MM:SS" 形式`, () => {
      for (const time of collectDebateTimes(debate)) {
        expect(time).toMatch(/^\d{2}:[0-5]\d:[0-5]\d$/);
      }
    });

    it(`${debate.id}: 出演しなかった人は実在し、出演者と重ならない`, () => {
      for (const id of debate.notAppearingIds) {
        expect(candidateIds).toContain(id);
        expect(debate.participantIds).not.toContain(id);
      }
    });

    it(`${debate.id}: 高島市政の評価は全員、フリップの下に説明がある`, () => {
      for (const answer of debate.takashima.answers) {
        expect(answer.keep, answer.candidateId).not.toBe("");
        expect(answer.change, answer.candidateId).not.toBe("");
      }
    });

    it(`${debate.id}: 高島市政の評価は出演者1人につき1件`, () => {
      const ids = debate.takashima.answers.map((answer) => answer.candidateId);
      expect(new Set(ids).size).toBe(ids.length);
    });

    // ざっくりまとめはこちらの整理なので、候補者を名指ししない（くくり方に解釈が入るため）
    it(`${debate.id}: ざっくりまとめは空でなく、候補者の名前を挙げていない`, () => {
      const summaries = [
        debate.takashima.summary,
        ...debate.questions.map((question) => question.summary),
      ];
      const names = CANDIDATES.flatMap((candidate) => {
        const [surname] = candidate.name.split(" ");
        return [candidate.name, `${surname}氏`];
      });
      for (const summary of summaries) {
        expect(summary.trim()).not.toBe("");
        for (const name of names) {
          expect(summary, name).not.toContain(name);
        }
      }
    });

    it(`${debate.id}: 問いの提起者が問題提起・まとめの話者と一致する`, () => {
      for (const question of debate.questions) {
        for (const statement of [...question.proposals, ...question.closings]) {
          expect(question.proposerIds).toContain(statement.candidateId);
        }
      }
    });
  }

  it("討論会の ID は重複しない", () => {
    const ids = DEBATES.map((debate) => debate.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
