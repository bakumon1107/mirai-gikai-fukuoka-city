/**
 * generate-special-contents.ts
 *
 * 意見書案・決議案・議員提出議案の bill_contents を AI で生成して cloud DB に書き込む。
 *
 * 使い方:
 *   tsx packages/seed/fukuoka/generate-special-contents.ts \
 *     --session r8-1 \
 *     [--dry-run]
 *
 * 前提:
 *   - SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が設定されていること
 *   - claude コマンドが使えること（CLAUDE_CLI_PATH で指定可）
 *   - pdftotext (poppler-utils) がインストールされていること
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execSync, spawn } from "node:child_process";
import { createAdminClient } from "../shared/helper";

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

// ---- PDF テキスト抽出 ----

async function extractPdfText(pdfUrl: string): Promise<string | null> {
  let tmpFile: string | null = null;
  try {
    console.log(`  📥 PDF取得中: ${pdfUrl}`);
    const response = await fetch(pdfUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!response.ok) {
      console.warn(`  ⚠️  PDF取得失敗: ${response.status}`);
      return null;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    tmpFile = path.join(os.tmpdir(), `fukuoka-special-${Date.now()}.pdf`);
    fs.writeFileSync(tmpFile, buffer);
    const text = execSync(`pdftotext -layout "${tmpFile}" -`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
    return text.trim() || null;
  } catch (err) {
    console.warn(`  ⚠️  PDF抽出エラー: ${err}`);
    return null;
  } finally {
    if (tmpFile && fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

// ---- AI 生成プロンプト ----

const PROMPT_TEMPLATE = `あなたは市議会の議案を市民に向けて解説する専門家です。
以下の議案情報をもとに、2種類の解説コンテンツを一度に生成してください。

**出力は必ず最初の文字から最後の文字まで JSON のみとすること。前置きや説明文は一切不要。**

## 重要な制約（必ず守ること）
- 採決の賛成・反対理由は**絶対に推測・創作しない**。
- 賛否に関する記述は、提供された「会派別採決」データとPDFの事実のみを記載する。
- 理由が不明な場合は「理由は公開情報にありません」と明記する。

## 議案情報
- 議案番号: {billNumber}
- 種別: {billType}
- 件名: {billName}
- 議決結果: {result}
- 会派別採決: {factionVotes}

## PDF抽出テキスト（抜粋）
{pdfText}

## 出力形式（JSON のみ。説明文・前置き不要）

{
  "normal": {
    "title": "市民が理解しやすいわかりやすいタイトル（20〜40文字程度）",
    "summary": "1〜2文で議案の目的をまとめた要約（中学生レベル）",
    "content": "Markdown形式の本文。以下のセクションを含めること：\\n## この議案は何をするものですか？\\n（市民が日常生活との関連で理解できる説明）\\n## 誰に影響がありますか？\\n（対象者・範囲）\\n## 審議の結果は？\\n（議決結果と会派別賛否の事実のみ。理由は推測しない）"
  },
  "hard": {
    "title": "詳細解説用タイトル（公式件名をわかりやすく言い換えたもの。20〜50文字程度）",
    "summary": "1〜2文で議案の目的と背景をまとめた要約（専門的）",
    "content": "Markdown形式の本文。以下のセクションを含めること：\\n## 背景・目的\\n（政策的背景、提出理由など）\\n## 主な内容\\n（具体的な要求事項、決議内容など）\\n## 審議経過\\n（PDFに記載のある事実のみ）\\n## 採決結果\\n（会派別賛否の事実のみ。理由は推測しない）"
  }
}`;

const BILL_TYPE_LABEL: Record<string, string> = {
  opinion: "意見書案（議会が国・都道府県へ提出する意見書）",
  resolution: "決議案（議会の意思を表明する決議）",
  member_bill: "議員提出議案",
  petition: "請願（市民・団体から提出された請願）",
  bill: "議案",
};

const STATUS_LABEL: Record<string, string> = {
  approved: "可決",
  rejected: "否決",
  submitted: "審議中",
};

// ---- メイン ----

async function main() {
  const args = process.argv.slice(2);
  const sessionIdx = args.indexOf("--session");
  const sessionSlug = sessionIdx >= 0 ? args[sessionIdx + 1] : null;
  const dryRun = args.includes("--dry-run");

  if (!sessionSlug) {
    console.error("Usage: tsx generate-special-contents.ts --session <slug> [--dry-run]");
    process.exit(1);
  }

  console.log(`\n会期slug: ${sessionSlug}`);
  console.log(`dry-run: ${dryRun}\n`);

  const supabase = createAdminClient();

  // 会期ID取得
  const { data: session } = await supabase
    .from("council_sessions")
    .select("id")
    .eq("slug", sessionSlug)
    .single();

  if (!session) {
    console.error(`会期が見つかりません: ${sessionSlug}`);
    process.exit(1);
  }

  // 対象議案を取得（通常議案以外）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bills, error: billsError } = await (supabase as any)
    .from("bills")
    .select(`
      id, bill_number, bill_type, name, status, source_url,
      faction_stances ( type, factions ( display_name ) )
    `)
    .eq("council_session_id", session.id)
    .in("bill_type", ["opinion", "resolution", "member_bill", "petition"])
    .order("bill_type")
    .order("bill_number") as {
    data: Array<{
      id: string;
      bill_number: string;
      bill_type: string;
      name: string;
      status: string;
      source_url: string | null;
      faction_stances: Array<{ type: string; factions: { display_name: string } | null }>;
    }> | null;
    error: { message: string } | null;
  };

  if (billsError || !bills) {
    console.error(`議案取得失敗: ${billsError?.message}`);
    process.exit(1);
  }

  console.log(`対象議案: ${bills.length}件`);
  for (const b of bills) {
    console.log(`  [${b.bill_type}] ${b.bill_number} ${b.name}`);
  }

  if (dryRun) {
    console.log("\n--dry-run モードのため AI 生成をスキップします。");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i];
    console.log(`\n[${i + 1}/${bills.length}] ${bill.bill_number} ${bill.name}`);

    // PDF テキスト抽出
    let pdfText: string | null = null;
    if (bill.source_url) {
      pdfText = await extractPdfText(bill.source_url);
      await sleep(2000);
    } else {
      console.log("  ℹ️  PDFリンクなし");
    }

    // 会派別採決の整形
    const stances = (bill.faction_stances ?? []) as Array<{
      type: string;
      factions: { display_name: string } | null;
    }>;
    const factionVotes = stances.length > 0
      ? stances
          .filter((s) => s.factions)
          .map((s) => `${s.factions!.display_name}: ${s.type === "for" ? "賛成○" : "反対×"}`)
          .join(", ")
      : "情報なし";

    // プロンプト構築
    const petitionStatusLabel =
      bill.bill_type === "petition"
        ? bill.status === "approved" ? "採択" : "不採択"
        : (STATUS_LABEL[bill.status] ?? bill.status);
    const prompt = PROMPT_TEMPLATE
      .replace("{billNumber}", bill.bill_number)
      .replace("{billType}", BILL_TYPE_LABEL[bill.bill_type] ?? bill.bill_type)
      .replace("{billName}", bill.name)
      .replace("{result}", petitionStatusLabel)
      .replace("{factionVotes}", factionVotes)
      .replace("{pdfText}", pdfText ? pdfText.slice(0, 4000) : "（PDFテキスト抽出不可）");

    // AI 生成
    console.log("  🤖 AI解説生成中...");
    let normal: { title: string; summary: string; content: string };
    let hard: { title: string; summary: string; content: string };

    try {
      const raw = await callClaudeWithRetry(prompt);
      // コードブロック除去
      let cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      // 先頭の { を探して JSON 部分だけ抽出
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }
      const parsed = JSON.parse(cleaned) as {
        normal: { title: string; summary: string; content: string };
        hard: { title: string; summary: string; content: string };
      };
      normal = parsed.normal;
      hard = parsed.hard;
    } catch (err) {
      console.error(`  ❌ AI生成失敗: ${err}`);
      errorCount++;
      continue;
    }

    // DB に書き込み
    for (const [level, content] of [["normal", normal], ["hard", hard]] as const) {
      const { error } = await supabase
        .from("bill_contents")
        .update({
          title: content.title,
          summary: content.summary,
          content: content.content,
        })
        .eq("bill_id", bill.id)
        .eq("difficulty_level", level);

      if (error) {
        console.error(`  ❌ DB書き込み失敗 (${level}): ${error.message}`);
        errorCount++;
      }
    }

    console.log(`  ✅ 完了: "${normal.title}"`);
    successCount++;

    // 議案間に10秒待機
    if (i < bills.length - 1) await sleep(10000);
  }

  console.log(`\n完了: ${successCount}件生成, ${errorCount}件エラー`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
