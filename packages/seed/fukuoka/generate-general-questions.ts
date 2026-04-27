/**
 * generate-general-questions.ts
 *
 * スクレイピング済みの会議録テキストを Claude CLI で AI 構造化する。
 *
 * 使い方:
 *   tsx packages/seed/fukuoka/generate-general-questions.ts --session r7-5 [--dry-run]
 *
 * 前提:
 *   - scrape-general-questions.ts で output/<slug>-questions-raw.json が生成済み
 *   - claude コマンドが使えること
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { RawQuestionerBlock } from "./scrape-general-questions";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- 型 ----

export type GeneratedTopic = {
  title: string;
  question_summary: string;
  answer_summary: string;
  answerer_role: string;
  answerer_name: string;
};

export type GeneratedQuestion = {
  sessionSlug: string;
  sessionDay: number;
  questionOrder: number;
  questionerName: string;
  questionerNumber: number | null;
  questionerParty: string | null;
  summary: string;
  topics: GeneratedTopic[];
  rawText: string;
  sourceUrl: string | null;
};

// ---- Claude CLI ----

const CLAUDE_PATH = process.env.CLAUDE_CLI_PATH || "claude";

function callClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.CLAUDECODE;

    const proc = spawn(CLAUDE_PATH, ["-p", prompt, "--output-format", "json"], {
      stdio: ["ignore", "pipe", "pipe"],
      env,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on("error", (err) => {
      reject(new Error(`claude の起動に失敗しました: ${err.message}`));
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`claude がコード ${code} で終了しました。stderr: ${stderr.slice(0, 300)}`));
        return;
      }
      try {
        const parsed = JSON.parse(stdout) as { result?: string; is_error?: boolean };
        if (parsed.is_error) {
          reject(new Error(`Claude エラー: ${String(parsed.result ?? "不明")}`));
          return;
        }
        resolve(parsed.result ?? "");
      } catch {
        resolve(stdout.trim());
      }
    });
  });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callClaudeWithRetry(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callClaude(prompt);
    } catch (err) {
      if (attempt < retries) {
        const wait = attempt * 15000;
        console.warn(`  ⚠️  リトライ ${attempt}/${retries}（${wait / 1000}秒後）: ${err}`);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
  throw new Error("unreachable");
}

// ---- プロンプト ----

const PROMPT_TEMPLATE = `あなたは市議会の会議録を市民向けに整理する専門家です。
以下の一般質問の会議録テキスト（{questioner_name}議員）を市民がわかりやすい形に構造化してください。

**出力は必ず最初の文字から最後の文字まで JSON のみとすること。前置きや説明文は一切不要。**

## 会議録テキスト
{raw_text}

## 出力形式（JSONのみ。説明文・前置き不要）
{
  "questioner_party": "会派名（テキストから読み取れない場合はnull）",
  "summary": "質問全体の要約（80字以内、市民向け）",
  "topics": [
    {
      "title": "テーマタイトル（20字以内）",
      "question_summary": "質問内容の要約（100字以内）",
      "answer_summary": "答弁内容の要約（100字以内）",
      "answerer_role": "答弁者の役職（複数いる場合は「○○局長・市長」のように連記）",
      "answerer_name": "答弁者の氏名（複数の場合は「氏名A・氏名B」のように連記。不明の場合は空文字）"
    }
  ]
}

## 制約
- 事実のみを要約し、政治的評価や推測は含めない
- topicsは質問者が取り上げたテーマ単位で分割する
- 中国語簡体字・繁体字を使わず、必ず日本語の漢字を使用すること`;

// ---- メイン ----

async function main() {
  const args = process.argv.slice(2);
  const sessionIdx = args.indexOf("--session");
  const sessionSlug = sessionIdx >= 0 ? args[sessionIdx + 1] : null;
  const dryRun = args.includes("--dry-run");

  if (!sessionSlug) {
    console.error("Usage: tsx generate-general-questions.ts --session <slug> [--dry-run]");
    process.exit(1);
  }

  const outputDir = path.join(__dirname, "output");
  const rawPath = path.join(outputDir, `${sessionSlug}-questions-raw.json`);
  const outputPath = path.join(outputDir, `${sessionSlug}-questions.json`);

  if (!fs.existsSync(rawPath)) {
    console.error(`Raw JSON が見つかりません: ${rawPath}`);
    console.error("先に scrape-general-questions.ts を実行してください。");
    process.exit(1);
  }

  const rawBlocks: RawQuestionerBlock[] = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
  console.log(`\n会期: ${sessionSlug}`);
  console.log(`対象: ${rawBlocks.length}名`);
  console.log(`dry-run: ${dryRun}\n`);

  if (dryRun) {
    for (const block of rawBlocks) {
      console.log(`  第${block.sessionDay}日 ${block.questionOrder}番 ${block.questionerName}`);
    }
    return;
  }

  // 既存の出力があれば読み込んでスキップ処理
  const existing: Map<string, GeneratedQuestion> = new Map();
  if (fs.existsSync(outputPath)) {
    const existingData: GeneratedQuestion[] = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    for (const q of existingData) {
      const key = `${q.sessionDay}-${q.questionOrder}-${q.questionerName}`;
      existing.set(key, q);
    }
    console.log(`既存の出力: ${existing.size}件（スキップ対象）`);
  }

  const results: GeneratedQuestion[] = [];
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i];
    const key = `${block.sessionDay}-${block.questionOrder}-${block.questionerName}`;
    console.log(`\n[${i + 1}/${rawBlocks.length}] 第${block.sessionDay}日 ${block.questionOrder}番 ${block.questionerName}`);

    if (existing.has(key)) {
      console.log("  ⏭  スキップ（生成済み）");
      results.push(existing.get(key)!);
      skipCount++;
      continue;
    }

    const rawTextSlice = block.rawText.slice(0, 6000);
    const prompt = PROMPT_TEMPLATE
      .replace("{questioner_name}", block.questionerName)
      .replace("{raw_text}", rawTextSlice);

    console.log("  🤖 AI構造化中...");
    try {
      const raw = await callClaudeWithRetry(prompt);
      let cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(cleaned) as {
        questioner_party: string | null;
        summary: string;
        topics: GeneratedTopic[];
      };

      const result: GeneratedQuestion = {
        sessionSlug: block.sessionSlug,
        sessionDay: block.sessionDay,
        questionOrder: block.questionOrder,
        questionerName: block.questionerName,
        questionerNumber: block.questionerNumber,
        questionerParty: parsed.questioner_party ?? block.questionerParty,
        summary: parsed.summary,
        topics: parsed.topics,
        rawText: block.rawText,
        sourceUrl: block.sourceUrl,
      };

      results.push(result);
      successCount++;

      console.log(`  ✅ 完了（${parsed.topics.length}トピック）`);

      // 中間保存
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
    } catch (err) {
      console.error(`  ❌ AI生成失敗: ${err}`);
      errorCount++;
    }

    if (i < rawBlocks.length - 1) await sleep(10000);
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n完了: ${successCount}件生成, ${skipCount}件スキップ, ${errorCount}件エラー`);
  console.log(`出力: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
