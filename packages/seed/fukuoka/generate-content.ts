/**
 * generate-content.ts
 *
 * 議案JSONを読み込み、PDFテキストを抽出してAIで解説コンテンツを生成する。
 *
 * 使い方:
 *   tsx packages/seed/fukuoka/generate-content.ts [会期slug]
 *   例: tsx packages/seed/fukuoka/generate-content.ts r8-1
 *
 * 前提:
 *   - scrape-bills.ts を先に実行して output/<slug>-bills.json が存在すること
 *   - .env に AI_GATEWAY_API_KEY が設定されていること
 *   - pdftotext (poppler-utils) がインストールされていること
 *
 * 出力: packages/seed/fukuoka/output/<slug>-contents.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execSync } from "node:child_process";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
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

// ---- AI クライアント ----

function createAiClient() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    throw new Error("AI_GATEWAY_API_KEY が設定されていません");
  }
  return createOpenAI({
    baseURL: "https://ai-gateway.vercel.sh/v1",
    apiKey,
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
      maxBuffer: 10 * 1024 * 1024, // 10MB
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
以下のJSON形式で出力してください。他のテキストは一切含めないこと。

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
以下のJSON形式で出力してください。他のテキストは一切含めないこと。

{
  "title": "詳細解説用タイトル（公式件名をわかりやすく言い換えたもの。20〜50文字程度）",
  "summary": "1〜2文で議案の目的と背景をまとめた要約",
  "content": "Markdown形式の本文。以下のセクションを含めること：\n## 背景・目的\n（政策的背景、改正理由など）\n## 主な変更点・内容\n（具体的な制度変更、予算額など）\n## 審議経過\n（委員会審査、主な論点）\n## 採決結果\n（会派別賛否の詳細）"
}`;

function formatFactionVotes(
  votes: ScrapedBill["factionVotes"]
): string {
  if (votes.length === 0) return "情報なし";
  return votes
    .map((v) => `${v.factionName}: ${v.vote === "for" ? "賛成○" : v.vote === "against" ? "反対×" : "不明"}`)
    .join(", ");
}

/**
 * PDFテキストから有効な部分を抽出する（最大4000文字）。
 * 条例改正案は「理由」セクション、予算案は冒頭条文を優先。
 */
function extractRelevantText(text: string | null, billName: string): string {
  if (!text) return "（PDFテキスト抽出不可）";

  const maxLength = 4000;

  // 条例改正案：「理由」セクションを優先
  if (billName.includes("条例")) {
    const reasonMatch = text.match(/理由[\s\S]{0,3000}/);
    if (reasonMatch) {
      return reasonMatch[0].slice(0, maxLength);
    }
  }

  // 予算案：冒頭条文を優先
  if (billName.includes("予算")) {
    const articleMatch = text.match(/第\s*一\s*条[\s\S]{0,2000}/);
    if (articleMatch) {
      return articleMatch[0].slice(0, maxLength);
    }
  }

  // デフォルト：先頭から取得
  return text.slice(0, maxLength);
}

async function generateBillContent(
  bill: ScrapedBill,
  pdfText: string | null,
  aiClient: ReturnType<typeof createOpenAI>
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

  const model = aiClient("anthropic/claude-haiku-4.5");

  const parseJsonResponse = (text: string): { title: string; summary: string; content: string } => {
    // コードブロックを除去
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      // JSONパース失敗時はフォールバック
      return {
        title: bill.name,
        summary: `${bill.name}について`,
        content: cleaned,
      };
    }
  };

  // normal コンテンツ生成
  const normalResult = await generateText({
    model,
    prompt: buildPrompt(NORMAL_PROMPT),
    maxOutputTokens: 2000,
  });
  const normal = parseJsonResponse(normalResult.text);

  // 1秒待機（レート制限対策）
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // hard コンテンツ生成
  const hardResult = await generateText({
    model,
    prompt: buildPrompt(HARD_PROMPT),
    maxOutputTokens: 3000,
  });
  const hard = parseJsonResponse(hardResult.text);

  return {
    billNumber: bill.billNumber,
    billName: bill.name,
    normal,
    hard,
  };
}

// ---- メイン ----

async function main() {
  const slug = process.argv[2] || "r8-1";
  const outputDir = path.join(import.meta.dirname, "output");

  // 入力ファイル確認
  const inputPath = path.join(outputDir, `${slug}-bills.json`);
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ ${inputPath} が見つかりません。先に scrape-bills.ts を実行してください。`);
    process.exit(1);
  }

  const bills: ScrapedBill[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  console.log(`📋 ${bills.length} 件の議案を処理します`);

  const aiClient = createAiClient();
  const results: GeneratedContent[] = [];

  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i];
    console.log(`\n[${i + 1}/${bills.length}] ${bill.billNumber} ${bill.name}`);

    // PDF取得・抽出
    let pdfText: string | null = null;
    if (bill.pdfUrl) {
      pdfText = await extractPdfText(bill.pdfUrl);
      // PDF取得後に1〜2秒待機（公式サイトへの配慮）
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      console.log("  ℹ️  PDFリンクなし。タイトルと議決情報のみで生成します。");
    }

    // AI解説生成
    console.log("  🤖 AI解説生成中...");
    const content = await generateBillContent(bill, pdfText, aiClient);
    results.push(content);

    console.log(`  ✅ 完了: "${content.normal.title}"`);
  }

  // 出力
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
