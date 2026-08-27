import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { ISSUES } from "../data/issues";
import type { Candidate, CandidatePosition, Stance } from "../types";
import { countStatedIssues, getStanceClass } from "./stance";

const buildPositions = (stances: Stance[]): Candidate["positions"] => {
  const positions = {} as Candidate["positions"];
  ISSUES.forEach((issue, index) => {
    positions[issue.id] = {
      stance: stances[index] ?? "未表明",
      summary: "",
      updated: "",
      log: [],
    } satisfies CandidatePosition;
  });
  return positions;
};

const buildCandidate = (stances: Stance[]): Candidate => ({
  id: "test",
  no: "01",
  name: "テスト 太郎",
  kana: "てすと たろう",
  age: 50,
  title: "テスト",
  party: "無所属",
  lead: "",
  bioSource: "",
  bio: [],
  claims: [],
  takashimaAssessment: null,
  links: [],
  positions: buildPositions(stances),
});

describe("getStanceClass", () => {
  it("立場ごとに異なる配色クラスを返す", () => {
    const classes = (
      ["推進", "条件付き", "慎重", "表明済み", "未表明"] as const
    ).map(getStanceClass);
    expect(new Set(classes).size).toBe(5);
  });

  it("インラインカラーではなくトークンのクラス名を返す", () => {
    for (const stance of [
      "推進",
      "条件付き",
      "慎重",
      "表明済み",
      "未表明",
    ] as const) {
      expect(getStanceClass(stance)).not.toMatch(/#[0-9a-f]{3,8}/i);
    }
  });
});

describe("countStatedIssues", () => {
  it("すべて未表明なら0", () => {
    expect(countStatedIssues(buildCandidate([]))).toBe(0);
  });

  it("未表明以外の分野だけを数える", () => {
    const candidate = buildCandidate([
      "表明済み",
      "未表明",
      "推進",
      "未表明",
      "慎重",
    ]);
    expect(countStatedIssues(candidate)).toBe(3);
  });

  it("全分野に言及があれば9", () => {
    expect(countStatedIssues(buildCandidate(ISSUES.map(() => "推進")))).toBe(9);
  });
});

describe("立候補予定者データの整合性", () => {
  it("全員が9分野すべてのキーを持つ（分野を省略しない）", () => {
    for (const candidate of CANDIDATES) {
      for (const issue of ISSUES) {
        expect(candidate.positions[issue.id]).toBeDefined();
      }
      expect(Object.keys(candidate.positions)).toHaveLength(ISSUES.length);
    }
  });

  it("表明順の番号が重複せず連番になっている", () => {
    const numbers = CANDIDATES.map((candidate) => candidate.no);
    expect(numbers).toEqual(
      CANDIDATES.map((_, index) => String(index + 1).padStart(2, "0"))
    );
  });

  it("idが重複しない", () => {
    const ids = CANDIDATES.map((candidate) => candidate.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("要約は必ず書かれている（空欄のまま公開しない）", () => {
    for (const candidate of CANDIDATES) {
      for (const position of Object.values(candidate.positions)) {
        expect(position.summary).not.toBe("");
      }
    }
  });

  it("発言ログがあるなら要約の最終更新も入っている", () => {
    for (const candidate of CANDIDATES) {
      for (const position of Object.values(candidate.positions)) {
        if (position.log.length > 0) {
          expect(position.updated).not.toBe("");
        }
      }
    }
  });

  it("発言ログは出典の媒体名を必ず持ち、URLがあるならhttps（ダミーリンクを置かない）", () => {
    const allLogs = CANDIDATES.flatMap((candidate) => [
      ...Object.values(candidate.positions).flatMap((p) => p.log),
      ...(candidate.takashimaAssessment?.log ?? []),
    ]);

    expect(allLogs.length).toBeGreaterThan(0);
    for (const statement of allLogs) {
      expect(statement.source).not.toBe("");
      expect(statement.place).not.toBe("");
      expect(statement.date).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
      if (statement.url) {
        expect(statement.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("言及ありの分野には根拠となる発言ログがある（要約の検証可能性）", () => {
    for (const candidate of CANDIDATES) {
      for (const position of Object.values(candidate.positions)) {
        if (position.stance !== "未表明") {
          expect(position.log.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("高島市政への評価は、あるなら要約と根拠ログをセットで持つ", () => {
    for (const candidate of CANDIDATES) {
      const assessment = candidate.takashimaAssessment;
      if (assessment) {
        expect(assessment.summary).not.toBe("");
        expect(assessment.updated).not.toBe("");
        expect(assessment.log.length).toBeGreaterThan(0);
      }
    }
  });
});
