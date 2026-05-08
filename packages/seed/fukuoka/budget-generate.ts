/**
 * budget-generate.ts
 *
 * budget-scrape.ts の出力JSONを読み込み、Claude CLIで予算内容を構造化する。
 * 局ごとに1回のClaude呼び出しを行い、テーマ・施策を抽出する。
 *
 * 使い方:
 *   tsx --env-file=../../.env fukuoka/budget-generate.ts
 *
 * 前提:
 *   - budget-scrape.ts を先に実行して output/r8-1-budget-raw.json が存在すること
 *   - claude コマンドが使えること（CLAUDE_CLI_PATH で指定可。省略時は PATH 上の "claude"）
 *
 * 出力: packages/seed/fukuoka/output/r8-1-budget-contents.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { ScrapedDepartment } from "./budget-scrape";
import { callClaudeWithRetry, resolveCLIPath, sleep } from "../shared/claude-cli";

// ---- 型定義 ----

export type GeneratedDepartment = {
  departmentName: string;
  departmentSlug: string;
  direction: string;
  total_budget: number;
  prev_budget: number;
  themes: Array<{
    title: string;
    budget_amount: number;
    ai_summary: string;
    initiatives: Array<{
      title: string;
      budget_amount: number | null;
      badge: "new" | "expanded" | "continued" | null;
      description: string;
    }>;
  }>;
};

// ---- Claude CLI 呼び出し ----





// ---- プロンプト ----

const BUDGET_PROMPT = `あなたは自治体の予算書を構造化するアシスタントです。
以下の予算PDF抽出テキストを読み込み、指定のJSON形式で予算情報を抽出・整理してください。

## 重要な制約（必ず守ること）
- 採決の賛否理由は推測しない。予算額・施策名・方向性はPDFに記載の事実のみ記載。
- 予算額はPDFに記載の数字をそのまま使用（単位: 万円）。不明な場合は0とする。
- badge は施策の特性をPDFの記載から判断: new=新規, expanded=拡充, continued=継続。不明な場合はnull。

## 局名
{departmentName}

## PDF抽出テキスト
{pdfText}

## 出力形式（JSON）
以下のJSON形式のみを出力してください。説明文や前置きは不要です。

{
  "direction": "この局の令和8年度予算の方向性（1〜2文）",
  "total_budget": 123456,
  "prev_budget": 123000,
  "themes": [
    {
      "title": "テーマ名（例: こども・子育て支援の充実）",
      "budget_amount": 12345,
      "ai_summary": "このテーマの概要（1〜2文）",
      "initiatives": [
        {
          "title": "施策名",
          "budget_amount": 1234,
          "badge": "new",
          "description": "施策の概要（1〜2文）"
        }
      ]
    }
  ]
}`;

async function generateDepartmentContent(
  department: ScrapedDepartment
): Promise<GeneratedDepartment> {
  const maxPdfLength = 8000;
  const pdfText =
    department.pdfText.length > maxPdfLength
      ? department.pdfText.slice(0, maxPdfLength)
      : department.pdfText;

  const prompt = BUDGET_PROMPT.replace(
    "{departmentName}",
    department.departmentName
  ).replace("{pdfText}", pdfText);

  console.log("  🤖 Claude で予算情報を抽出中...");
  const raw = await callClaudeWithRetry(prompt);

  let parsed: Omit<GeneratedDepartment, "departmentName" | "departmentSlug">;
  try {
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    console.warn("  ⚠️  JSON パース失敗。フォールバックデータを使用します。");
    parsed = {
      direction: `${department.departmentName}の令和8年度予算`,
      total_budget: 0,
      prev_budget: 0,
      themes: [],
    };
  }

  return {
    departmentName: department.departmentName,
    departmentSlug: department.departmentSlug,
    ...parsed,
  };
}

// ---- メイン ----

async function main() {
  const slug = process.argv[2] || "r8-1";
  const outputDir = path.join(import.meta.dirname, "output");
  const inputPath = path.join(outputDir, `${slug}-budget-raw.json`);
  const outputPath = path.join(outputDir, `${slug}-budget-contents.json`);

  if (!fs.existsSync(inputPath)) {
    console.error(
      `❌ ${inputPath} が見つかりません。先に budget-scrape.ts を実行してください。`
    );
    process.exit(1);
  }

  const departments: ScrapedDepartment[] = JSON.parse(
    fs.readFileSync(inputPath, "utf-8")
  );
  console.log(`📋 ${departments.length} 局の予算情報を処理します`);
  console.log(`🤖 Claude CLI: ${resolveCLIPath()}`);

  fs.mkdirSync(outputDir, { recursive: true });

  // 既存の生成済みデータを読み込んで途中再開できるようにする
  let existingResults: GeneratedDepartment[] = [];
  if (fs.existsSync(outputPath)) {
    try {
      existingResults = JSON.parse(
        fs.readFileSync(outputPath, "utf-8")
      ) as GeneratedDepartment[];
      console.log(
        `♻️  既存データ読み込み: ${existingResults.length} 局（スキップします）`
      );
    } catch {
      // 読み込み失敗は無視
    }
  }

  const doneSet = new Set(existingResults.map((r) => r.departmentSlug));
  const results: GeneratedDepartment[] = [...existingResults];

  const save = () => {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
  };

  for (let i = 0; i < departments.length; i++) {
    const dept = departments[i];

    if (doneSet.has(dept.departmentSlug)) {
      console.log(
        `[${i + 1}/${departments.length}] ${dept.departmentName} スキップ（生成済み）`
      );
      continue;
    }

    console.log(`\n[${i + 1}/${departments.length}] ${dept.departmentName}`);

    try {
      const content = await generateDepartmentContent(dept);
      results.push(content);
      save(); // 1局ごとに保存
      console.log(
        `  ✅ 完了: テーマ数=${content.themes.length}, 総予算=${content.total_budget}万円`
      );
    } catch (err) {
      console.error(`  ❌ スキップ: ${err}`);
    }

    // 局間に10秒待機
    if (i < departments.length - 1) {
      await sleep(10000);
    }
  }

  save();
  console.log(`\n📄 出力: ${outputPath}`);
  console.log(`🎉 ${results.length} 局の予算コンテンツを生成しました`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
