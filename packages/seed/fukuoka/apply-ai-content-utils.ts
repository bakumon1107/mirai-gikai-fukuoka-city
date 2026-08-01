/**
 * apply-ai-content-utils.ts
 *
 * AIパッチ（わかりやすい表現）を発言セグメントへマージする純粋関数。
 * DBに書き込む前にパッチの妥当性（重複・未知seq・被覆率）を検証する。
 */
import type { Segment } from "./parse-committee-minutes";

export type SimpleTextPatch = { seq: number; simpleText: string };

export type MergeResult = {
  /** simpleText をマージ済みのセグメント一覧 */
  speeches: Segment[];
  /** 運用者向けの警告（未知seq・未被覆の質疑/答弁など） */
  warnings: string[];
};

/**
 * speechSimpleTexts を seq で発言セグメントにマージする。
 * - パッチ内の seq 重複は誤り（後勝ちで欠落を招く）のため例外にする
 * - simpleText が空文字のエントリも誤りとして例外にする
 * - 発言に存在しない seq は警告（取り違えの可能性）
 * - simpleText が付かない member/executive セグメントは警告（被覆漏れ）
 */
export function mergeSimpleTexts(
  speeches: Segment[],
  patchTexts: SimpleTextPatch[]
): MergeResult {
  const bySeq = new Map<number, string>();
  for (const p of patchTexts) {
    if (typeof p.seq !== "number" || !Number.isInteger(p.seq)) {
      throw new Error(`不正なseqです: ${JSON.stringify(p)}`);
    }
    if (!p.simpleText || p.simpleText.trim().length === 0) {
      throw new Error(`simpleTextが空です (seq=${p.seq})`);
    }
    if (bySeq.has(p.seq)) {
      throw new Error(`seqが重複しています: ${p.seq}`);
    }
    bySeq.set(p.seq, p.simpleText);
  }

  const warnings: string[] = [];
  const knownSeqs = new Set(speeches.map((s) => s.seq));
  for (const seq of bySeq.keys()) {
    if (!knownSeqs.has(seq)) {
      warnings.push(`発言に存在しないseqのパッチがあります: ${seq}`);
    }
  }

  const uncovered = speeches
    .filter((s) => s.speakerType !== "note" && !bySeq.has(s.seq))
    .map((s) => s.seq);
  if (uncovered.length > 0) {
    warnings.push(
      `わかりやすい表現が未設定の質疑・答弁があります (seq: ${uncovered.join(", ")})`
    );
  }

  const speechesMerged = speeches.map((s) => {
    const simpleText = bySeq.get(s.seq);
    return simpleText ? { ...s, simpleText } : s;
  });

  return { speeches: speechesMerged, warnings };
}
