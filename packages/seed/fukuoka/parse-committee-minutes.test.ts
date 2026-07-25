import { describe, expect, it } from "vitest";
import {
  buildRawText,
  buildSourceUrl,
  committeeFromTitle,
  extractHitCount,
  extractSessionId,
  parseDocPage,
  parseListPage,
} from "./parse-committee-minutes";

describe("extractSessionId", () => {
  it("URLパスからセッションIDを取り出す", () => {
    expect(extractSessionId('<a href="/index.php/1234567?x=1">')).toBe(
      "1234567"
    );
    expect(extractSessionId("<a href=\"/other\">")).toBeNull();
  });
});

describe("extractHitCount", () => {
  it("ヒット件数を取り出す", () => {
    expect(
      extractHitCount('<span class="color--red">6,796</span>文書')
    ).toBe(6796);
  });
});

describe("parseListPage", () => {
  it("全角コロンの開催日を含む一覧を抽出する", () => {
    const html = `
      <a href="?Template=doc-one-frame&DocumentID=3521">令和８年条例予算特別委員会教育こども分科会  質疑・意見</a>
      <span class="result-title__date">開催日：2026-03-17</span>
      <a href="?Template=doc-one-frame&DocumentID=8721">令和８年交通対策特別委員会</a>
      <span class="result-title__date">開催日：2026-01-19</span>
      <a href="?Template=list&Page=2">次 &gt;</a>
    `;
    const { docs, hasNext } = parseListPage(html);
    expect(docs).toEqual([
      {
        documentId: 3521,
        title: "令和８年条例予算特別委員会教育こども分科会  質疑・意見",
        date: "2026-03-17",
      },
      { documentId: 8721, title: "令和８年交通対策特別委員会", date: "2026-01-19" },
    ]);
    expect(hasNext).toBe(true);
  });

  it("次ページリンクが無ければhasNextはfalse", () => {
    const html = `
      <a href="?DocumentID=1">議会運営委員会</a>
      <span class="result-title__date">開催日：2026-02-10</span>
    `;
    expect(parseListPage(html).hasNext).toBe(false);
  });
});

describe("parseDocPage - 予算分科会（［質疑・意見］／［答弁］形式）", () => {
  const html = `
    <div class="page-text__voice" id="VoiceNo1">
      <p class="page-text__text"><span class="page-text__number">1</span>
      ［質疑・意見］<br />　予算の内訳を尋ねる。<br /><br />［答弁］<br />　640万円である。</p>
    </div>
    <div class="page-text__voice" id="VoiceNo2">
      <p class="page-text__text"><span class="page-text__number">2</span>
      ［質疑・意見］<br />　慎重に進めるべきと意見を述べておく。</p>
    </div>
  `;

  it("ブロック内の質疑・意見と答弁を別セグメントに分ける", () => {
    const segs = parseDocPage(html);
    expect(segs).toEqual([
      { seq: 1, voiceNo: 1, speakerType: "member", text: "予算の内訳を尋ねる。" },
      { seq: 2, voiceNo: 1, speakerType: "executive", text: "640万円である。" },
      {
        seq: 3,
        voiceNo: 2,
        speakerType: "member",
        text: "慎重に進めるべきと意見を述べておく。",
      },
    ]);
  });
});

describe("parseDocPage - 特別委員会（◯／△形式）", () => {
  const html = `
    <div class="page-text__voice" id="VoiceNo1">
      <p><span class="page-text__number">1</span>
      １月19日 午前10時0分開会<br />１．公共交通に関する調査</p>
    </div>
    <div class="page-text__voice" id="VoiceNo2">
      <p><span class="page-text__number">2</span>◯ 早急な対応が必要である。</p>
    </div>
    <div class="page-text__voice" id="VoiceNo3">
      <p><span class="page-text__number">3</span>△ 検討していく。</p>
    </div>
  `;

  it("冒頭ブロックはnote、◯は委員、△は執行部にする", () => {
    const segs = parseDocPage(html);
    expect(segs[0]).toMatchObject({ voiceNo: 1, speakerType: "note" });
    expect(segs[0].text).toContain("開会");
    expect(segs[1]).toEqual({
      seq: 2,
      voiceNo: 2,
      speakerType: "member",
      text: "早急な対応が必要である。",
    });
    expect(segs[2]).toEqual({
      seq: 3,
      voiceNo: 3,
      speakerType: "executive",
      text: "検討していく。",
    });
  });
});

describe("committeeFromTitle", () => {
  it("長い名称を優先して照合する", () => {
    expect(committeeFromTitle("令和８年都市交通対策特別委員会")?.slug).toBe(
      "toshi-kotsu-taisaku"
    );
    expect(committeeFromTitle("令和８年交通対策特別委員会")?.slug).toBe(
      "kotsu-taisaku"
    );
  });

  it("予算分科会は分科会スラッグに、全体会は yosan に対応する", () => {
    expect(
      committeeFromTitle("令和８年条例予算特別委員会総務財政分科会  質疑・意見")
        ?.slug
    ).toBe("yosan-somu-zaisei");
    expect(committeeFromTitle("令和８年条例予算特別委員会")?.slug).toBe("yosan");
  });

  it("対象外はnull", () => {
    expect(committeeFromTitle("令和８年第１回定例会（第１日）　本文")).toBeNull();
  });
});

describe("buildSourceUrl / buildRawText", () => {
  it("安定URLを組み立てる", () => {
    expect(buildSourceUrl(3521)).toBe(
      "https://www.city.fukuoka.fukuoka.dbsr.jp/index.php/1?Template=doc-one-frame&VoiceType=onehit&DocumentID=3521"
    );
  });

  it("セグメントからラベル付き原文を復元する", () => {
    const raw = buildRawText([
      { seq: 1, voiceNo: 1, speakerType: "member", text: "尋ねる。" },
      { seq: 2, voiceNo: 1, speakerType: "executive", text: "答える。" },
    ]);
    expect(raw).toBe("［質疑・意見］\n尋ねる。\n\n［答弁］\n答える。");
  });
});
