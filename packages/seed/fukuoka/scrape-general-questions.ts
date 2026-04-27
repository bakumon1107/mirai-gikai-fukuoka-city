/**
 * scrape-general-questions.ts
 *
 * 会議録テキスト（ローカルTXT または 公式サイト）から一般質問を抽出する。
 *
 * 使い方:
 *   # ローカルTXTファイルから取得
 *   tsx packages/seed/fukuoka/scrape-general-questions.ts \
 *     --session r7-5 \
 *     --txt-dir /path/to/meeting-minutes/令和７年第５回定例会
 *
 * 出力: output/<slug>-questions-raw.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- 型 ----

export type RawQuestionerBlock = {
  sessionSlug: string;
  sessionDay: number;
  questionOrder: number;
  questionerName: string;
  questionerNumber: number | null;
  questionerParty: string | null;
  rawText: string;
  sourceUrl: string | null;
};

// ---- パーサー ----

// ◯N番（name）登壇 で始まる行 = 質問者の開会発言（1人1回のみ）
// 議席番号は半角（58番）・全角（２番）どちらもある
const QUESTIONER_OPENING = /^◯([0-9０-９]+)番（(.+?)）登壇/;

function toHalfWidth(s: string): number {
  return parseInt(
    s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xff10 + 0x30)),
    10
  );
}
const PARTY_PATTERN = /私は([^をが]+?)(?:を代表して|が代表して|として)/;

/**
 * 1日分のテキストから質問者ブロックを抽出する。
 *
 * 方針: 各「登壇」行を境界として質問者ブロックを区切る。
 * - 「休憩いたします」は会期内の一時休憩のため終了とせず、散会のみで終了
 * - 議長が同一議員を呼び戻す「○○議員。」は誤検出しないよう登壇行のみで管理
 */
function parseDay(text: string, sessionSlug: string, day: number): RawQuestionerBlock[] {
  const lines = text.split("\n");

  // 一般質問セクション開始行を探す
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("日程第１、一般質問を行います")) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return [];

  // 散会行（セクション終了）を探す
  let endIdx = lines.length;
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes("散会いたします") || line.includes("本日の会議を閉じます")) {
      endIdx = i;
      break;
    }
  }

  // 対象範囲内の「登壇」行のインデックスと質問者情報を収集
  const openings: Array<{ lineIdx: number; name: string; number: number }> = [];
  for (let i = startIdx; i < endIdx; i++) {
    const line = lines[i].trim();
    const m = QUESTIONER_OPENING.exec(line);
    if (m) {
      openings.push({ lineIdx: i, name: m[2].trim(), number: toHalfWidth(m[1]) });
    }
  }

  // 各質問者のブロック: 自分の登壇行〜次の登壇行の直前まで
  const blocks: RawQuestionerBlock[] = [];
  for (let i = 0; i < openings.length; i++) {
    const opening = openings[i];
    const blockEnd = i + 1 < openings.length ? openings[i + 1].lineIdx : endIdx;
    const blockLines = lines
      .slice(opening.lineIdx, blockEnd)
      .map((l) => l.trim())
      .filter(Boolean);
    const rawText = blockLines.join("\n").trim();
    const party = extractParty(rawText);

    blocks.push({
      sessionSlug,
      sessionDay: day,
      questionOrder: i + 1,
      questionerName: opening.name,
      questionerNumber: opening.number,
      questionerParty: party,
      rawText,
      sourceUrl: null,
    });
  }

  return blocks;
}

function extractParty(rawText: string): string | null {
  const match = PARTY_PATTERN.exec(rawText);
  if (!match) return null;
  return match[1].trim().replace(/^私は/, "").trim();
}

// ---- メイン ----

async function main() {
  const args = process.argv.slice(2);

  const sessionIdx = args.indexOf("--session");
  const sessionSlug = sessionIdx >= 0 ? args[sessionIdx + 1] : null;

  const txtDirIdx = args.indexOf("--txt-dir");
  const txtDir = txtDirIdx >= 0 ? args[txtDirIdx + 1] : null;

  if (!sessionSlug) {
    console.error("Usage: tsx scrape-general-questions.ts --session <slug> [--txt-dir <path>]");
    process.exit(1);
  }

  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${sessionSlug}-questions-raw.json`);

  if (!txtDir) {
    console.error("--txt-dir が必要です（公式サイトスクレイピングは未実装）");
    process.exit(1);
  }

  if (!fs.existsSync(txtDir)) {
    console.error(`ディレクトリが見つかりません: ${txtDir}`);
    process.exit(1);
  }

  const txtFiles = fs.readdirSync(txtDir)
    .filter((f) => f.endsWith(".txt"))
    .sort();

  console.log(`\n会期: ${sessionSlug}`);
  console.log(`TXTファイル: ${txtFiles.length}件\n`);

  const allBlocks: RawQuestionerBlock[] = [];

  for (let dayIndex = 0; dayIndex < txtFiles.length; dayIndex++) {
    const file = txtFiles[dayIndex];
    const day = dayIndex + 1;
    const filePath = path.join(txtDir, file);
    const text = fs.readFileSync(filePath, "utf-8");

    const blocks = parseDay(text, sessionSlug, day);
    console.log(`第${day}日 (${file}): ${blocks.length}名`);
    for (const b of blocks) {
      console.log(`  ${b.questionOrder}. ${b.questionerName}（${b.questionerParty ?? "無所属"}）`);
    }
    allBlocks.push(...blocks);
  }

  console.log(`\n合計: ${allBlocks.length}名`);
  fs.writeFileSync(outputPath, JSON.stringify(allBlocks, null, 2), "utf-8");
  console.log(`\n出力: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
