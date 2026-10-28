import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { CANDIDATE_UPDATES, SITE_UPDATES } from "../data/update-history";
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
        CANDIDATE_UPDATES[candidate.id]?.length ?? 0,
        candidate.id
      ).toBeGreaterThan(0);
    }
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
});
