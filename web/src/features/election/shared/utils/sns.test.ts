import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import type { SnsChannel, SnsKind } from "../types";
import { getConfirmedChannels, getSnsMeta, getUnconfirmedKinds } from "./sns";

const ALL_KINDS: SnsKind[] = [
  "公式サイト",
  "X",
  "YouTube",
  "TikTok",
  "Instagram",
  "Facebook",
  "note",
];

const channel = (kind: SnsKind, url: string): SnsChannel => ({
  kind,
  handle: url ? "handle" : "",
  url,
});

describe("getSnsMeta", () => {
  it("6種すべてにアイコンと配色クラスがある", () => {
    for (const kind of ALL_KINDS) {
      const meta = getSnsMeta(kind);
      expect(meta.icon).not.toBe("");
      expect(meta.description).not.toBe("");
      expect(meta.tileClass).toMatch(/^bg-sns-/);
      expect(meta.borderClass).toMatch(/^border-sns-/);
    }
  });

  it("配色クラスにインラインカラーコードを含まない", () => {
    for (const kind of ALL_KINDS) {
      const meta = getSnsMeta(kind);
      expect(meta.tileClass).not.toMatch(/#[0-9a-f]{3,8}/i);
      expect(meta.borderClass).not.toMatch(/#[0-9a-f]{3,8}/i);
    }
  });
});

describe("getConfirmedChannels / getUnconfirmedKinds", () => {
  const sns = [
    channel("公式サイト", "https://example.com"),
    channel("X", ""),
    channel("YouTube", "https://youtube.com/channel/UC1"),
    channel("TikTok", ""),
    channel("Instagram", ""),
    channel("Facebook", ""),
    channel("note", ""),
  ];

  it("URLがあるものだけを確認済みとして返す", () => {
    expect(getConfirmedChannels(sns).map((c) => c.kind)).toEqual([
      "公式サイト",
      "YouTube",
    ]);
  });

  it("URLが空のものを未確認として返す", () => {
    expect(getUnconfirmedKinds(sns)).toEqual([
      "X",
      "TikTok",
      "Instagram",
      "Facebook",
      "note",
    ]);
  });

  it("確認済みと未確認を足すと全件になる", () => {
    expect(
      getConfirmedChannels(sns).length + getUnconfirmedKinds(sns).length
    ).toBe(sns.length);
  });

  it("すべて未確認なら確認済みは空", () => {
    const none = ALL_KINDS.map((kind) => channel(kind, ""));
    expect(getConfirmedChannels(none)).toEqual([]);
    expect(getUnconfirmedKinds(none)).toEqual(ALL_KINDS);
  });
});

describe("立候補予定者のSNSデータ", () => {
  it("全員が6種すべてを共通の並びで持つ（露出差を作らない）", () => {
    for (const candidate of CANDIDATES) {
      expect(candidate.sns.map((c) => c.kind)).toEqual(ALL_KINDS);
    }
  });

  it("URLがあるチャンネルはhandleも持ち、httpsで始まる", () => {
    for (const candidate of CANDIDATES) {
      for (const c of getConfirmedChannels(candidate.sns)) {
        expect(c.handle).not.toBe("");
        expect(c.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("未確認チャンネルはURLもhandleも空（ダミーを置かない）", () => {
    for (const candidate of CANDIDATES) {
      for (const c of candidate.sns) {
        if (c.url === "") {
          expect(c.handle).toBe("");
        }
      }
    }
  });
});
