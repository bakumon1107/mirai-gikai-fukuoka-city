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

const NORMAL_PROMPT = `あなたは市議会の議案をわかりやすく解説する専門家です。
以下の議案情報をもとに、市民向けのわかりやすい解説を生成してください。

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
  "title": "市民が理解しやすいわかりやすいタイトル（公式件名とは別に設定。20〜40文字程度）",
  "summary": "1〜2文で議案の目的をまとめた要約",
  "content": "Markdown形式の本文。以下のセクションを含めること：\n## この議案は何をするものですか？\n（市民が日常生活との関連で理解できる説明）\n## 誰に影響がありますか？\n（対象者・範囲）\n## 審議の結果は？\n（議決結果と会派別賛否の簡潔なまとめ）"
}`;

const HARD_PROMPT = `あなたは市議会の議案を詳しく解説する専門家です。
以下の議案情報をもとに、政策的背景・論点を含む詳細な解説を生成してください。

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
  "title": "詳細解説用タイトル（公式件名をわかりやすく言い換えたもの。20〜50文字程度）",
  "summary": "1〜2文で議案の目的と背景をまとめた要約",
  "content": "Markdown形式の本文。以下のセクションを含めること：\n## 背景・目的\n（政策的背景、改正理由など）\n## 主な変更点・内容\n（具体的な制度変更、予算額など）\n## 審議経過\n（委員会審査、主な論点）\n## 採決結果\n（会派別賛否の詳細）"
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

function parseJsonResponse(
  text: string,
  fallbackName: string
): { title: string; summary: string; content: string } {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      title: fallbackName,
      summary: `${fallbackName}について`,
      content: cleaned,
    };
  }
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

  const normalText = await callClaude(buildPrompt(NORMAL_PROMPT));
  const normal = parseJsonResponse(normalText, bill.name);

  // 1秒待機
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const hardText = await callClaude(buildPrompt(HARD_PROMPT));
  const hard = parseJsonResponse(hardText, bill.name);

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

  const results: GeneratedContent[] = [];

  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i];
    console.log(`\n[${i + 1}/${bills.length}] ${bill.billNumber} ${bill.name}`);

    let pdfText: string | null = null;
    if (bill.pdfUrl) {
      pdfText = await extractPdfText(bill.pdfUrl);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      console.log("  ℹ️  PDFリンクなし");
    }

    console.log("  🤖 AI解説生成中...");
    const content = await generateBillContent(bill, pdfText);
    results.push(content);

    console.log(`  ✅ 完了: "${content.normal.title}"`);
  }

  const output: ContentOutput = {
    slug,
    generatedAt: new Date().toISOString(),
    bills: results,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}-contents.json`);
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n📄 出力: ${outputPath}`);
  console.log(`🎉 ${results.length} 件の解説コンテンツを生成しました`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
