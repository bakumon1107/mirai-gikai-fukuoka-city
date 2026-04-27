/**
 * generate-content.ts
 *
 * 議案JSONを読み込み、PDFテキストを抽出してAIで解説コンテンツを生成する。
 * AI呼び出しには Claude CLI（claude コマンド）を使用するため、APIクレジット不要。
 *
 * 使い方:
 *   tsx packages/seed/fukuoka/generate-content.ts [会期slug] [--limit N]
 *   例: tsx packages/seed/fukuoka/generate-content.ts r8-1
 *   例: tsx packages/seed/fukuoka/generate-content.ts r8-1 --limit 5
 *
 * 前提:
 *   - scrape-bills.ts を先に実行して output/<slug>-bills.json が存在すること
 *   - claude コマンドが使えること（CLAUDE_CLI_PATH で指定可。省略時は PATH 上の "claude"）
 *   - pdftotext (poppler-utils) がインストールされていること
 *
 * 出力: packages/seed/fukuoka/output/<slug>-contents.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execSync, spawn } from "node:child_process";
import type { ScrapedBill } from "./scrape-bills";

// ---- 型定義 ----

export type GeneratedContent = {
  billNumber: string;
  billName: string;
  normal: {
    title: string;
    summary: string;
    content: string;
  };
  hard: {
    title: string;
    summary: string;
    content: string;
  };
};

export type ContentOutput = {
  slug: string;
  generatedAt: string;
  bills: GeneratedContent[];
};

// ---- Claude CLI 呼び出し ----

const CLAUDE_PATH = process.env.CLAUDE_CLI_PATH || "claude";

/**
 * Claude CLI を呼び出してテキストを生成する。
 * admin/src/features/ai-collection/server/utils/execute-claude.ts と同じパターン。
 */
function callClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // CLAUDECODE を unset: ネスト起動を検出してブロックされるため
    const env = { ...process.env };
    delete env.CLAUDECODE;

    const proc = spawn(
      CLAUDE_PATH,
      ["-p", prompt, "--output-format", "json"],
      { stdio: ["ignore", "pipe", "pipe"], env }
    );

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      reject(new Error(`claude の起動に失敗しました: ${err.message}`));
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `claude がコード ${code} で終了しました。stderr: ${stderr.slice(0, 300)}`
          )
        );
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
        // JSON パース失敗時は stdout をそのまま返す
        resolve(stdout.trim());
      }
    });
  });
}

// ---- PDF テキスト抽出 ----

/**
 * PDFをダウンロードして pdftotext でテキスト抽出する。
 * 失敗した場合は null を返す。
 */
async function extractPdfText(pdfUrl: string): Promise<string | null> {
  let tmpFile: string | null = null;
  try {
    console.log(`  📥 PDF取得中: ${pdfUrl}`);

    const response = await fetch(pdfUrl, {
      headers: {
        "User-Agent":
          "mirai-gikai-data-import/1.0 (+https://github.com/bakumon0907)",
      },
    });

    if (!response.ok) {
      console.warn(`  ⚠️  PDF取得失敗: ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    tmpFile = path.join(os.tmpdir(), `fukuoka-bill-${Date.now()}.pdf`);
    fs.writeFileSync(tmpFile, buffer);

    // pdftotext でテキスト抽出（-layout でレイアウト保持）
    const text = execSync(`pdftotext -layout "${tmpFile}" -`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

    return text.trim() || null;
  } catch (err) {
    console.warn(`  ⚠️  PDF抽出エラー: ${err}`);
    return null;
  } finally {
    if (tmpFile && fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }
}

// ---- AI 解説生成 ----

const COMBINED_PROMPT = `あなたは市議会の議案を解説する専門家です。
以下の議案情報をもとに、2種類の解説コンテンツを一度に生成してください。

## 重要な制約（必ず守ること）
- 採決の賛成・反対理由は**絶対に推測・創作しない**。
- 賛否に関する記述は、提供された「会派別採決」データと「PDF抽出テキスト」に明示されている事実のみを記載する。
- 理由が不明な場合は「理由は公開情報にありません」と明記するか、賛否の事実のみ記載する。

## 議案情報
- 議案番号: {billNumber}
- 件名: {billName}
- 議決結果: {result}
- 会派別採決: {factionVotes}

## PDF抽出テキスト（抜粋）
{pdfText}

## 出力形式（JSON）
以下のJSON形式のみを出力してください。説明文や前置きは不要です。

{
  "normal": {
    "title": "市民が理解しやすいわかりやすいタイトル（20〜40文字程度）",
    "summary": "1〜2文で議案の目的をまとめた要約（中学生レベル）",
    "content": "Markdown形式の本文。以下のセクションを含めること：\n## この議案は何をするものですか？\n（市民が日常生活との関連で理解できる説明）\n## 誰に影響がありますか？\n（対象者・範囲）\n## 審議の結果は？\n（議決結果と会派別賛否の事実のみ。理由は推測しない。会派別採決はMarkdownの**表ではなく箇条書き**で「- 賛成：〇〇、△△」「- 反対：〇〇」の形式で書くこと）"
  },
  "hard": {
    "title": "詳細解説用タイトル（公式件名をわかりやすく言い換えたもの。20〜50文字程度）",
    "summary": "1〜2文で議案の目的と背景をまとめた要約（専門的）",
    "content": "Markdown形式の本文。以下のセクションを含めること：\n## 背景・目的\n（政策的背景、改正理由など）\n## 主な変更点・内容\n（具体的な制度変更、予算額など）\n## 審議経過\n（委員会審査など、PDFに記載のある事実のみ）\n## 採決結果\n（会派別賛否の事実のみ。理由は推測しない。会派別採決はMarkdownの**表ではなく箇条書き**で「- 賛成：〇〇、△△」「- 反対：〇〇」の形式で書くこと）"
  }
}`;

function formatFactionVotes(votes: ScrapedBill["factionVotes"]): string {
  if (votes.length === 0) return "情報なし";
  return votes
    .map(
      (v) =>
        `${v.factionName}: ${v.vote === "for" ? "賛成○" : v.vote === "against" ? "反対×" : "不明"}`
    )
    .join(", ");
}

/**
 * PDFテキストから有効な部分を抽出する（最大4000文字）。
 */
function extractRelevantText(text: string | null, billName: string): string {
  if (!text) return "（PDFテキスト抽出不可）";

  const maxLength = 4000;

  if (billName.includes("条例")) {
    const reasonMatch = text.match(/理由[\s\S]{0,3000}/);
    if (reasonMatch) return reasonMatch[0].slice(0, maxLength);
  }

  if (billName.includes("予算")) {
    const articleMatch = text.match(/第\s*一\s*条[\s\S]{0,2000}/);
    if (articleMatch) return articleMatch[0].slice(0, maxLength);
  }

  return text.slice(0, maxLength);
}


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callClaudeWithRetry(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callClaude(prompt);
    } catch (err) {
      if (attempt < retries) {
        const wait = attempt * 15000; // 15秒, 30秒 と増やす
        console.warn(`  ⚠️  Claude エラー（${attempt}/${retries}）。${wait / 1000}秒後にリトライ...`);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
  throw new Error("unreachable");
}

async function generateBillContent(
  bill: ScrapedBill,
  pdfText: string | null
): Promise<GeneratedContent> {
  const relevantText = extractRelevantText(pdfText, bill.name);
  const factionVotesStr = formatFactionVotes(bill.factionVotes);

  const buildPrompt = (template: string) =>
    template
      .replace("{billNumber}", bill.billNumber)
      .replace("{billName}", bill.name)
      .replace("{result}", bill.result || "未議決")
      .replace("{factionVotes}", factionVotesStr)
      .replace("{pdfText}", relevantText);

  const combinedText = await callClaudeWithRetry(buildPrompt(COMBINED_PROMPT));

  // combined レスポンスをパース: { normal: {...}, hard: {...} }
  let normal: { title: string; summary: string; content: string };
  let hard: { title: string; summary: string; content: string };
  try {
    const cleaned = combinedText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned) as {
      normal: { title: string; summary: string; content: string };
      hard: { title: string; summary: string; content: string };
    };
    normal = parsed.normal;
    hard = parsed.hard;
  } catch {
    // パース失敗時はフォールバック
    const fallback = { title: bill.name, summary: `${bill.name}について`, content: combinedText };
    normal = fallback;
    hard = fallback;
  }

  return { billNumber: bill.billNumber, billName: bill.name, normal, hard };
}

// ---- メイン ----

async function main() {
  const slug = process.argv[2] || "r8-1";
  const limitArg = process.argv.indexOf("--limit");
  const limit = limitArg >= 0 ? Number(process.argv[limitArg + 1]) : undefined;

  const outputDir = path.join(import.meta.dirname, "output");
  const inputPath = path.join(outputDir, `${slug}-bills.json`);

  if (!fs.existsSync(inputPath)) {
    console.error(
      `❌ ${inputPath} が見つかりません。先に scrape-bills.ts を実行してください。`
    );
    process.exit(1);
  }

  const allBills: ScrapedBill[] = JSON.parse(
    fs.readFileSync(inputPath, "utf-8")
  );
  const bills = limit ? allBills.slice(0, limit) : allBills;
  console.log(
    `📋 ${bills.length} 件の議案を処理します${limit ? ` (全${allBills.length}件中)` : ""}`
  );
  console.log(`🤖 Claude CLI: ${CLAUDE_PATH}`);

  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}-contents.json`);

  // 既存の生成済みデータを読み込んで途中再開できるようにする
  let existingResults: GeneratedContent[] = [];
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, "utf-8")) as ContentOutput;
      existingResults = existing.bills ?? [];
      console.log(`♻️  既存データ読み込み: ${existingResults.length} 件（スキップします）`);
    } catch {
      // 読み込み失敗は無視
    }
  }
  const doneSet = new Set(existingResults.map((r) => r.billNumber));
  const results: GeneratedContent[] = [...existingResults];

  const save = () => {
    const output: ContentOutput = {
      slug,
      generatedAt: new Date().toISOString(),
      bills: results,
    };
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");
  };

  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i];

    if (doneSet.has(bill.billNumber)) {
      console.log(`[${i + 1}/${bills.length}] ${bill.billNumber} スキップ（生成済み）`);
      continue;
    }

    console.log(`\n[${i + 1}/${bills.length}] ${bill.billNumber} ${bill.name}`);

    let pdfText: string | null = null;
    if (bill.pdfUrl) {
      pdfText = await extractPdfText(bill.pdfUrl);
      await sleep(2000);
    } else {
      console.log("  ℹ️  PDFリンクなし");
    }

    console.log("  🤖 AI解説生成中...");
    try {
      const content = await generateBillContent(bill, pdfText);
      results.push(content);
      save(); // 1件ごとに保存
      console.log(`  ✅ 完了: "${content.normal.title}"`);
    } catch (err) {
      console.error(`  ❌ スキップ: ${err}`);
    }

    // 議案間に10秒待機
    await sleep(10000);
  }

  save();
  console.log(`\n📄 出力: ${outputPath}`);
  console.log(`🎉 ${results.length} 件の解説コンテンツを生成しました`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
