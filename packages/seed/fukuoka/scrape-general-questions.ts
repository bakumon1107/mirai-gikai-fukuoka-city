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

const QUESTIONER_OPENING = /^◯(\d+)番（(.+?)）登壇/;
const QUESTIONER_CONTINUE = /^◯(\d+)番（(.+?)）(?!登壇)/;
const CHAIRPERSON = /^◯議長（/;
const NEXT_QUESTIONER_CALL = /^◯議長（.+?）\s+(.+?)議員。/;
const PARTY_PATTERN = /私は([^をが]+?)(?:を代表して|が代表して|として)/;

function parseDay(text: string, sessionSlug: string, day: number): RawQuestionerBlock[] {
  const lines = text.split("\n");
  const blocks: RawQuestionerBlock[] = [];

  let inGeneralQuestions = false;
  let currentQuestioner: { name: string; number: number | null } | null = null;
  let currentLines: string[] = [];
  let questionOrder = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 一般質問の開始検出
    if (line.includes("日程第１、一般質問を行います")) {
      inGeneralQuestions = true;
      continue;
    }

    // 本日の会議終了
    if (inGeneralQuestions && (line.includes("本日の会議を閉じます") || line.includes("散会いたします") || line.includes("休憩いたします"))) {
      break;
    }

    if (!inGeneralQuestions) continue;

    // 新しい質問者（登壇）
    const openingMatch = QUESTIONER_OPENING.exec(line);
    if (openingMatch) {
      // 前の質問者を確定
      if (currentQuestioner && currentLines.length > 0) {
        const rawText = currentLines.join("\n").trim();
        const party = extractParty(rawText);
        blocks.push({
          sessionSlug,
          sessionDay: day,
          questionOrder,
          questionerName: currentQuestioner.name,
          questionerNumber: currentQuestioner.number,
          questionerParty: party,
          rawText,
          sourceUrl: null,
        });
      }

      questionOrder++;
      currentQuestioner = {
        name: openingMatch[2].trim(),
        number: parseInt(openingMatch[1], 10),
      };
      currentLines = [line];
      continue;
    }

    if (currentQuestioner) {
      // 議長の発言 — 次の質問者呼び出しかどうか確認
      if (CHAIRPERSON.test(line)) {
        const nextCall = NEXT_QUESTIONER_CALL.exec(line);
        if (nextCall) {
          // 議長が別の議員名を呼び出した → 現在の質問者ブロックを終了
          const rawText = currentLines.join("\n").trim();
          const party = extractParty(rawText);
          blocks.push({
            sessionSlug,
            sessionDay: day,
            questionOrder,
            questionerName: currentQuestioner.name,
            questionerNumber: currentQuestioner.number,
            questionerParty: party,
            rawText,
            sourceUrl: null,
          });
          currentQuestioner = null;
          currentLines = [];
        } else {
          // 議長の通常の発言（答弁者指名など）→ ブロックに含める
          currentLines.push(line);
        }
        continue;
      }

      // 同一質問者の追加発言 or 答弁者の発言 → ブロックに含める
      currentLines.push(line);
    }
  }

  // 最後の質問者
  if (currentQuestioner && currentLines.length > 0) {
    const rawText = currentLines.join("\n").trim();
    const party = extractParty(rawText);
    blocks.push({
      sessionSlug,
      sessionDay: day,
      questionOrder,
      questionerName: currentQuestioner.name,
      questionerNumber: currentQuestioner.number,
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
