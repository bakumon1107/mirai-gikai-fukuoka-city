import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { ISSUES } from "../data/issues";
import type { Candidate, CandidatePosition, Stance } from "../types";
import { countStatedIssues, getStanceClass } from "./stance";

const buildCandidate = (stances: Stance[]): Candidate =>
  ({
    positions: Object.fromEntries(
      ISSUES.map((issue, index) => [
        issue.id,
        {
          stance: stances[index] ?? "未表明",
          text: "",
          source: "",
        } satisfies CandidatePosition,
      ])
    ),
  }) as Candidate;

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

  it("出典URLを持つ項目は必ず出典表記も持つ（ダミーリンクを置かない）", () => {
    for (const candidate of CANDIDATES) {
      for (const position of Object.values(candidate.positions)) {
        if (position.sourceUrl) {
          expect(position.source).not.toBe("");
          expect(position.sourceUrl).toMatch(/^https:\/\//);
        }
      }
    }
  });
});
