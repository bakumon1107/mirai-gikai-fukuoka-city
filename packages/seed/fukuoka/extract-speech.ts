/**
 * extract-speech.ts
 *
 * 会議録アーカイブ（docs/fukuoka/meeting-minutes/）から、
 * 行番号の範囲を指定して発言テキストを切り出す純粋関数群。
 *
 * 議案質疑では1人の質問者が複数の議案を続けて質疑するため、
 * 「誰が」だけでなく「どの議案について話した段落か」で切り出す必要がある。
 * 行範囲は bill-discussions-*.json 側で議案ごとに持たせる。
 */

/** 1始まり・両端を含む行範囲 */
export type LineRange = [number, number];

// ◯39番（前野真実子）登壇　／ ◯福祉局長（藤本広一）　／ ◯市長（高島宗一郎）
const SPEAKER_PREFIX_RE = /^◯[^（）]*（[^（）]*）(?:登壇)?[　\s]*/;

/**
 * 行頭の発言者表記（◯39番（前野真実子）登壇　など）を取り除く。
 * 発言者は answerer_role / questioner_name に別途持たせるため、本文からは落とす。
 */
export function stripSpeakerPrefix(line: string): string {
  return line.replace(SPEAKER_PREFIX_RE, "");
}

/**
 * 行範囲の並びから発言テキストを組み立てる。
 * 範囲が会議録の行数を超える場合は、取り違えに気づけるようエラーにする。
 */
export function extractLineRanges(
  lines: string[],
  ranges: readonly LineRange[]
): string {
  const parts: string[] = [];

  for (const [start, end] of ranges) {
    if (start < 1 || end < start || end > lines.length) {
      throw new Error(
        `行範囲が不正です: [${start}, ${end}]（会議録は ${lines.length} 行）`
      );
    }
    for (let i = start; i <= end; i++) {
      parts.push(stripSpeakerPrefix(lines[i - 1]));
    }
  }

  return parts.join("\n").trim();
}
