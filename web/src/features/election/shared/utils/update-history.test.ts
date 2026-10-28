import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import {
  CANDIDATE_UPDATES,
  getCandidateUpdates,
  SITE_UPDATES,
} from "../data/update-history";
import type { UpdateEntry } from "../types";
import { getLatestUpdateDate, sortUpdatesNewestFirst } from "./update-history";

const entry = (date: string, text = ""): UpdateEntry => ({ date, text });

describe("sortUpdatesNewestFirst", () => {
  it("古い順に書かれた履歴を新しい順に並べ替える", () => {
    const entries = [
      entry("2026-08-28"),
      entry("2026-10-28"),
      entry("2026-09-04"),
    ];
    expect(sortUpdatesNewestFirst(entries).map((e) => e.date)).toEqual([
      "2026-10-28",
      "2026-09-04",
      "2026-08-28",
    ]);
  });

  it("同じ日のものは後に書いたほうを先に出す", () => {
    const entries = [
      entry("2026-09-30", "a"),
      entry("2026-10-28", "b"),
      entry("2026-10-28", "c"),
    ];
    expect(sortUpdatesNewestFirst(entries).map((e) => e.text)).toEqual([
      "c",
      "b",
      "a",
    ]);
  });

  it("元の配列を破壊しない", () => {
    const entries = [entry("2026-08-28"), entry("2026-10-28")];
    sortUpdatesNewestFirst(entries);
    expect(entries.map((e) => e.date)).toEqual(["2026-08-28", "2026-10-28"]);
  });
});

describe("getLatestUpdateDate", () => {
  it("いちばん新しい掲載日を返す", () => {
    expect(
      getLatestUpdateDate([entry("2026-09-04"), entry("2026-10-22")])
    ).toBe("2026-10-22");
  });

  it("並び順にかかわらず最大の日付を返す", () => {
    expect(
      getLatestUpdateDate([entry("2026-10-22"), entry("2026-09-04")])
    ).toBe("2026-10-22");
  });

  it("履歴が空なら null を返す", () => {
    expect(getLatestUpdateDate([])).toBeNull();
  });
});

describe("更新履歴のデータ", () => {
  const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
  const allEntries = [
    ...SITE_UPDATES,
    ...Object.values(CANDIDATE_UPDATES).flat(),
  ];

  it("全候補者に履歴が1件以上ある", () => {
    for (const candidate of CANDIDATES) {
      expect(
        getCandidateUpdates(candidate.id).length,
        candidate.id
      ).toBeGreaterThan(0);
    }
  });

  it("登録のないIDには空の履歴を返す", () => {
    expect(getCandidateUpdates("no-such-candidate")).toEqual([]);
  });

  it("履歴のキーはすべて実在する候補者のID", () => {
    const ids = new Set(CANDIDATES.map((candidate) => candidate.id));
    for (const key of Object.keys(CANDIDATE_UPDATES)) {
      expect(ids.has(key), key).toBe(true);
    }
  });

  it("日付は日まで含む形式で、本文は空でない", () => {
    for (const update of allEntries) {
      expect(update.date).toMatch(DATE_FORMAT);
      expect(update.text.trim()).not.toBe("");
    }
  });

  it("古い順に追記されている", () => {
    const lists = [SITE_UPDATES, ...Object.values(CANDIDATE_UPDATES)];
    for (const list of lists) {
      const dates = list.map((update) => update.date);
      expect(dates).toEqual([...dates].sort());
    }
  });

  // 新しい発言を載せたのに履歴を書き忘れると、カードの「個別の更新」が古いまま残る。
  // 発言の日付は掲載より前なので、履歴の最新日は発言ログの最新日以上になるはず
  // （"2026-10" のような月までの日付も、文字列比較で同じ月の日付より前に来る）。
  // これは最低限の歯止めで、書き忘れをすべて拾えるわけではない。履歴の最新日より古い日付の
  // 発言を後から載せた場合や、経歴・主張・SNSの変更は検知できないので、反映のたびに履歴を足すこと。
  it("履歴の最新日は、その人の発言ログの最新日より前にならない", () => {
    for (const candidate of CANDIDATES) {
      const logs = [
        ...Object.values(candidate.positions).flatMap(
          (position) => position.log
        ),
        ...(candidate.takashimaAssessment?.log ?? []),
      ];
      const newestLog = getLatestUpdateDate(logs) ?? "";
      const latestUpdate = getLatestUpdateDate(
        getCandidateUpdates(candidate.id)
      );
      expect(
        (latestUpdate ?? "") >= newestLog,
        `${candidate.id}: 履歴 ${latestUpdate} / 発言 ${newestLog}`
      ).toBe(true);
    }
  });
});
