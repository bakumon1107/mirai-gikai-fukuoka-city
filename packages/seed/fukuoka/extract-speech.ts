/**
 * extract-speech.ts
 *
 * 会議録の全文テキスト（取り込み時に手元に用意するもの）から、
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

const SPEAKER_NAME_RE = /^◯[^（）]*（([^（）]*)）/;

/** 氏名の比較用に空白（全角・半角）を除く。「山嶋　剛」と「山嶋剛」を同一視する */
function normalizeName(name: string): string {
  return name.replace(/[\s　]/g, "");
}

/** 発言者行（◯52番（川口　浩）など）から括弧内の氏名を取り出す。発言者行でなければ null */
export function speakerNameOf(line: string): string | null {
  const m = line.match(SPEAKER_NAME_RE);
  return m ? normalizeName(m[1]) : null;
}

/**
 * 各行範囲で発言している人物が、期待する発言者かを検証する。
 * 範囲の先頭が継続行の場合は、直前の発言者行までさかのぼって発言者を決める。
 * 会議録ファイルの取り違えや行ずれがあると別人の発言を切り出してしまうため、
 * 不一致を文字列の配列で返す（空なら問題なし）。
 *
 * @param expected 期待する発言者の表記（質問者名、または「役職（氏名）・…」形式の答弁者）。
 *   発言者行の氏名がこの表記に含まれていれば一致とみなす。
 */
export function findSpeakerMismatches(
  lines: string[],
  ranges: readonly LineRange[],
  expected: string
): string[] {
  const expectedNorm = normalizeName(expected);
  const mismatches: string[] = [];

  for (const [start, end] of ranges) {
    let speaker: string | null = null;
    for (let i = Math.min(start, lines.length); i >= 1; i--) {
      speaker = speakerNameOf(lines[i - 1] ?? "");
      if (speaker) break;
    }

    const check = (name: string | null, lineNo: number) => {
      if (!name || !expectedNorm.includes(name)) {
        mismatches.push(
          `${lineNo}行目の発言者「${name ?? "不明"}」が「${expected}」と一致しません（範囲 [${start}, ${end}]）`
        );
      }
    };

    check(speaker, start);
    for (let i = start + 1; i <= Math.min(end, lines.length); i++) {
      const name = speakerNameOf(lines[i - 1]);
      if (name) check(name, i);
    }
  }

  return mismatches;
}
