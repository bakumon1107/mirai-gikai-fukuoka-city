/**
 * parse-budget-plenary.ts（福岡市版）
 *
 * 条例予算特別委員会の総会（slug: yosan）の議事録を、質問者ブロック単位に切り出す。
 *
 * 総会の記録は本会議の一般質問と同じ構造（発言者名つきの逐語・質問者ごとの長いブロック・
 * 局長級の答弁）を持つため、committee_meetings ではなく general_questions に取り込む。
 * このファイルは、その前段となるブロック分割と発言者の名寄せを担う純粋関数群。
 */

import type { Segment } from "./parse-committee-minutes";

/** 総会の発言者（姓のみ）→ 議員のフルネームと会派 */
type Member = { name: string; party: string };

/**
 * 議事録の発言者表記（姓のみ、同姓は「田中（た）」のように書き分けられる）を
 * 議員名簿の表記に対応づける。
 *
 * - フルネームは既に general_questions に登録済みの表記を優先し、
 *   未登録の議員は福岡市議会の議員名簿（gikai.city.fukuoka.lg.jp）の表記に合わせた
 * - 会派は各ブロック冒頭の「◯◯を代表し」が一次情報。この表は突合用
 */
export const PLENARY_MEMBERS: Record<string, Member> = {
  調: { name: "調崇史", party: "自由民主党福岡市議団" },
  新村: { name: "新村まさる", party: "新しい風ふくおか" },
  中山: { name: "中山郁美", party: "日本共産党市議団" },
  堤: { name: "堤　健太郎", party: "公明党福岡市議団" },
  勝見: { name: "勝見美代", party: "福岡市民クラブ" },
  中島: { name: "中島まさひろ", party: "自民党新福岡" },
  和田: { name: "和田あきひこ", party: "日本維新の会福岡市議団" },
  前野: { name: "前野真実子", party: "福岡市民クラブ" },
  石本: { name: "石本優子", party: "公明党福岡市議団" },
  堀内: { name: "堀内徹夫", party: "日本共産党市議団" },
  坂口: { name: "坂口よしまさ", party: "新しい風ふくおか" },
  もろくま: { name: "もろくま英文", party: "自由民主党福岡市議団" },
  鬼塚: { name: "鬼塚昌宏", party: "自由民主党福岡市議団" },
  はしだ: { name: "はしだ和義", party: "新しい風ふくおか" },
  松野: { name: "松野隆", party: "公明党福岡市議団" },
  小竹: { name: "小竹りか", party: "福岡市民クラブ" },
  // 田中しんすけ・田中たかしが同一会派のため会派では判別できない。
  // 議事録の「（た）」表記から田中たかしと判断している（要確認事項）。
  "田中（た）": { name: "田中たかし", party: "福岡市民クラブ" },
  おばた: { name: "おばた英達", party: "自由民主党福岡市議団" },
  淀川: { name: "淀川幸二郎", party: "自由民主党福岡市議団" },
  とみなが: { name: "とみながひろゆき", party: "自由民主党福岡市議団" },
  藤野: { name: "藤野哲司", party: "自民党新福岡" },
  // 維新の阿部正剛は「阿部（正）」と書かれるため、ひらがなの「あべ（ひ）」はあべひでき。
  "あべ（ひ）": { name: "あべひでき", party: "無所属" },
  木村: { name: "木村てつあき", party: "無所属" },
  川口: { name: "川口　浩", party: "無所属" },
  森: { name: "森　あやこ", party: "無所属" },
  新開: { name: "新開ゆうじ", party: "無所属" },
};

/** 発言の冒頭にある発言者名を取り出す（「調委員　…」→「調」） */
export function extractSpeakerName(text: string): string | null {
  const m = text.match(/^([^\s　]{1,12}?)委員[　\s]/);
  return m ? m[1] : null;
}

export type PlenaryBlock = {
  /** 議事録内の発言連番（開始・終了） */
  startSeq: number;
  endSeq: number;
  /** 議事録上の発言者表記（姓のみ） */
  speaker: string;
  /** 議員名簿の表記 */
  questionerName: string;
  party: string;
  /** 質疑・意見の件数 */
  memberCount: number;
  /** 答弁の件数 */
  executiveCount: number;
  segments: Segment[];
};

/**
 * 質問者が替わるところでブロックに分割する。
 * 答弁（executive）は直前の質問者のブロックに含める。
 * 冒頭の記録（note）はどのブロックにも属さない。
 */
export function splitIntoBlocks(speeches: Segment[]): PlenaryBlock[] {
  const blocks: PlenaryBlock[] = [];

  for (const s of speeches) {
    if (s.speakerType === "note") continue;

    if (s.speakerType === "member") {
      const speaker = extractSpeakerName(s.text);
      const previous = blocks.length ? blocks[blocks.length - 1] : undefined;
      // 発言者名が取れない、または同じ質問者が続く場合は現在のブロックに積む
      if (speaker && speaker !== previous?.speaker) {
        const resolved = PLENARY_MEMBERS[speaker];
        if (!resolved) {
          throw new Error(
            `発言者を名寄せできません: 「${speaker}委員」（seq=${s.seq}）。PLENARY_MEMBERS に追加してください`
          );
        }
        blocks.push({
          startSeq: s.seq,
          endSeq: s.seq,
          speaker,
          questionerName: resolved.name,
          party: resolved.party,
          memberCount: 0,
          executiveCount: 0,
          segments: [],
        });
      }
    }

    const current = blocks.length ? blocks[blocks.length - 1] : undefined;
    if (!current) {
      throw new Error(`質問者が決まる前の発言があります（seq=${s.seq}）`);
    }
    current.endSeq = s.seq;
    current.segments.push(s);
    if (s.speakerType === "member") current.memberCount++;
    else current.executiveCount++;
  }

  return blocks;
}

/** ブロックの原文（発言者名を含む逐語）を組み立てる */
export function buildBlockRawText(block: PlenaryBlock): string {
  return block.segments.map((s) => s.text).join("\n\n");
}
