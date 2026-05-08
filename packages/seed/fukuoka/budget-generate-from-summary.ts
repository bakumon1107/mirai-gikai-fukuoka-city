/**
 * budget-generate-from-summary.ts
 *
 * 重要施策PDF（全局統合版）を読み込み、局ごとに予算コンテンツを生成する。
 * budget-generate.ts の代替版。個別局PDFではなく重要施策まとめPDFを使用。
 *
 * 使い方:
 *   tsx --env-file=../../.env packages/seed/fukuoka/budget-generate-from-summary.ts [会期slug]
 *   例: tsx packages/seed/fukuoka/budget-generate-from-summary.ts r7-1
 *       tsx packages/seed/fukuoka/budget-generate-from-summary.ts r8-1
 *
 * 出力:
 *   - packages/seed/fukuoka/output/<slug>-budget-raw.json   (上書き)
 *   - packages/seed/fukuoka/output/<slug>-budget-contents.json (上書き)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execSync } from "node:child_process";
import type { ScrapedDepartment } from "./budget-scrape";
import type { GeneratedDepartment } from "./budget-generate";
import { callClaudeWithRetry, resolveCLIPath, sleep } from "../shared/claude-cli";

// ---- 会期別設定 ----

// 各局当初予算案等の概要より（単位: 万円、一般会計歳出）
// 出典: https://www.city.fukuoka.lg.jp/zaisei/zaisei/shisei/7Ntoushoyosanan_2.html
//       https://www.city.fukuoka.lg.jp/zaisei/zaisei/shisei/8Ntoushoyosanan_2.html

const SLUG_CONFIG: Record<
  string,
  {
    summaryPdfUrl: string;
    fiscalYear: string;
    departments: {
      departmentName: string;
      departmentSlug: string;
      totalBudget: number;  // 当初予算額（万円）
      prevBudget: number;   // 前年度予算額（万円）
    }[];
  }
> = {
  "r7-1": {
    summaryPdfUrl:
      "https://www.city.fukuoka.lg.jp/zaisei/zaisei/shisei/documents/05_R7_juuyousesaku.pdf",
    fiscalYear: "令和7年度",
    departments: [
      { departmentName: "市長室",         departmentSlug: "shityoshitsu", totalBudget:    61265, prevBudget:    67896 },
      { departmentName: "総務企画局",      departmentSlug: "somukikaku",   totalBudget:  2805861, prevBudget:  2633036 },
      { departmentName: "財政局",          departmentSlug: "zaisei",       totalBudget: 10490139, prevBudget: 10576569 },
      { departmentName: "市民局",          departmentSlug: "shimin",       totalBudget:  2446290, prevBudget:  2411673 },
      { departmentName: "こども未来局",    departmentSlug: "kodomomirai",  totalBudget: 15856407, prevBudget: 14275914 },
      { departmentName: "福祉局",          departmentSlug: "fukushi",      totalBudget: 18254655, prevBudget: 18398557 },
      { departmentName: "保健医療局",      departmentSlug: "hokeniryo",    totalBudget:  8760937, prevBudget:  8189509 },
      { departmentName: "環境局",          departmentSlug: "kankyo",       totalBudget:  3062398, prevBudget:  3088504 },
      { departmentName: "経済観光文化局",  departmentSlug: "keizai",       totalBudget: 19939581, prevBudget: 19486347 },
      { departmentName: "農林水産局",      departmentSlug: "norinsuisan",  totalBudget:   848130, prevBudget:   943785 },
      { departmentName: "住宅都市局",      departmentSlug: "jyutakutoshi", totalBudget:  3019839, prevBudget:  2611314 },
      { departmentName: "道路下水道局",    departmentSlug: "dorogesui",    totalBudget:  5263232, prevBudget:  5300391 },
      { departmentName: "港湾空港局",      departmentSlug: "kowankuko",    totalBudget:  1016313, prevBudget:  1081154 },
      { departmentName: "消防局",          departmentSlug: "shobo",        totalBudget:  1980850, prevBudget:  1643760 },
      { departmentName: "水道局",          departmentSlug: "suido",        totalBudget:   205537, prevBudget:   150893 },
      { departmentName: "交通局",          departmentSlug: "kotsu",        totalBudget:   713226, prevBudget:   646333 },
      { departmentName: "教育委員会",      departmentSlug: "kyoiku",       totalBudget: 15289099, prevBudget: 15284942 },
    ],
  },
  "r8-1": {
    summaryPdfUrl:
      "https://www.city.fukuoka.lg.jp/zaisei/zaisei/shisei/documents/05_R8_juuyousesaku.pdf",
    fiscalYear: "令和8年度",
    departments: [
      { departmentName: "市長室",           departmentSlug: "shityoshitsu", totalBudget:    68588, prevBudget:    61265 },
      { departmentName: "総務企画局",        departmentSlug: "somukikaku",   totalBudget:  2888132, prevBudget:  2805861 },
      { departmentName: "財政局",            departmentSlug: "zaisei",       totalBudget: 10513644, prevBudget: 10490139 },
      { departmentName: "市民局",            departmentSlug: "shimin",       totalBudget:  2725566, prevBudget:  2446290 },
      { departmentName: "こども未来局",      departmentSlug: "kodomomirai",  totalBudget: 16865591, prevBudget: 15856407 },
      { departmentName: "福祉局",            departmentSlug: "fukushi",      totalBudget: 18363341, prevBudget: 18254655 },
      { departmentName: "保健医療局",        departmentSlug: "hokeniryo",    totalBudget:  8891790, prevBudget:  8760937 },
      { departmentName: "環境局",            departmentSlug: "kankyo",       totalBudget:  3395210, prevBudget:  3062398 },
      { departmentName: "経済観光文化局",    departmentSlug: "keizai",       totalBudget: 17514614, prevBudget: 19939581 },
      { departmentName: "農林水産局",        departmentSlug: "norinsuisan",  totalBudget:   970826, prevBudget:   848130 },
      { departmentName: "住宅都市みどり局",  departmentSlug: "jyutakutoshi", totalBudget:  3444662, prevBudget:  3019839 },
      { departmentName: "道路下水道局",      departmentSlug: "dorogesui",    totalBudget:  5490038, prevBudget:  5263232 },
      { departmentName: "港湾空港局",        departmentSlug: "kowankuko",    totalBudget:  1013497, prevBudget:  1016313 },
      { departmentName: "消防局",            departmentSlug: "shobo",        totalBudget:  2088047, prevBudget:  1980850 },
      { departmentName: "水道局",            departmentSlug: "suido",        totalBudget:   177784, prevBudget:   205537 },
      { departmentName: "交通局",            departmentSlug: "kotsu",        totalBudget:   804502, prevBudget:   713226 },
      { departmentName: "教育委員会",        departmentSlug: "kyoiku",       totalBudget: 16536549, prevBudget: 15289099 },
    ],
  },
};

// ---- PDF ダウンロード・テキスト抽出 ----

async function downloadAndExtractPdf(pdfUrl: string): Promise<string> {
  console.log(`📥 PDF取得中: ${pdfUrl}`);

  const response = await fetch(pdfUrl, {
    headers: { "User-Agent": "mirai-gikai-data-import/1.0" },
  });

  if (!response.ok) {
    throw new Error(`PDF取得失敗: ${response.status} ${pdfUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const tmpFile = path.join(os.tmpdir(), `fukuoka-summary-${Date.now()}.pdf`);

  try {
    fs.writeFileSync(tmpFile, buffer);
    const text = execSync(`pdftotext -layout "${tmpFile}" -`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
    return text.trim();
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

// ---- 局ごとにテキストを分割 ----

function splitByDepartment(
  fullText: string,
  departments: { departmentName: string; departmentSlug: string }[]
): Map<string, string> {
  const result = new Map<string, string>();
  const lines = fullText.split("\n");

  let currentDeptSlug: string | null = null;
  let currentLines: string[] = [];

  // 局名 → slug のマップ
  const deptNameToSlug = new Map(
    departments.map((d) => [d.departmentName, d.departmentSlug])
  );

  const detectDept = (line: string): string | null => {
    // ページ区切り文字・前後の空白を除去し、空白を全て削除して比較
    const normalized = line.replace(/\x0c/g, "").trim();
    if (!normalized.startsWith("○")) return null;
    // ○以降の文字を取り出してスペースを全削除
    const afterCircle = normalized.slice(1).replace(/\s/g, "");
    for (const [name, slug] of deptNameToSlug) {
      const nameNormalized = name.replace(/\s/g, "");
      if (afterCircle === nameNormalized) {
        return slug;
      }
    }
    return null;
  };

  for (const line of lines) {
    const detected = detectDept(line);
    if (detected) {
      if (currentDeptSlug && currentLines.length > 0) {
        result.set(currentDeptSlug, currentLines.join("\n"));
      }
      currentDeptSlug = detected;
      currentLines = [line];
    } else if (currentDeptSlug) {
      currentLines.push(line);
    }
  }

  if (currentDeptSlug && currentLines.length > 0) {
    result.set(currentDeptSlug, currentLines.join("\n"));
  }

  return result;
}

// ---- Claude CLI 呼び出し ----





// ---- プロンプト ----

const BUDGET_PROMPT = `あなたは自治体の予算書を構造化するアシスタントです。
以下の重要施策PDFテキスト（指定局の部分）を読み込み、JSON形式で予算情報を抽出・整理してください。

## 重要な制約（必ず守ること）
- total_budget と prev_budget は【以下に明示した正確な値】を必ずそのまま使用すること（変更・計算禁止）
- テーマ・施策のbudget_amountはPDFに記載の千円単位の数字を万円に変換（例: 612,641千円 → 61264万円）
- 金額が記載されていない項目はbudget_amountを0とする
- badge は new=新規, expanded=拡充, continued=継続。不明な場合はnull
- direction は1〜2文で局の重点方向を説明（事実のみ、意見・推測不可）
- ai_summary は各テーマの概要を1〜2文
- description は各施策の概要を1文

## 対象局
{departmentName}（{fiscalYear}）

## 確定済み予算総額（各局当初予算案等の概要より・一般会計歳出）
- {fiscalYear} 当初予算: {totalBudget}万円
- 前年度予算: {prevBudget}万円

## 重要施策PDFテキスト（この局の部分のみ）
{pdfText}

## 出力形式（JSONのみ。説明文・前置き・コードブロック不要）
{
  "direction": "局の重点方向（1〜2文）",
  "total_budget": {totalBudget},
  "prev_budget": {prevBudget},
  "themes": [
    {
      "title": "テーマ名（番号なし）",
      "budget_amount": 12345,
      "ai_summary": "テーマの概要（1〜2文）",
      "initiatives": [
        {
          "title": "施策名",
          "budget_amount": 1234,
          "badge": null,
          "description": "施策の概要（1文）"
        }
      ]
    }
  ]
}`;

// ---- メイン ----

async function main() {
  const slug = process.argv[2] || "r7-1";
  const config = SLUG_CONFIG[slug];

  if (!config) {
    console.error(`❌ "${slug}" の設定が見つかりません`);
    process.exit(1);
  }

  const outputDir = path.join(import.meta.dirname, "output");
  fs.mkdirSync(outputDir, { recursive: true });

  const rawPath = path.join(outputDir, `${slug}-budget-raw.json`);
  const contentsPath = path.join(outputDir, `${slug}-budget-contents.json`);

  // PDF ダウンロード・テキスト抽出
  const fullText = await downloadAndExtractPdf(config.summaryPdfUrl);
  console.log(`📄 PDF テキスト取得完了 (${fullText.length} 文字)`);

  // 局ごとに分割
  const deptTexts = splitByDepartment(fullText, config.departments);
  console.log(`✅ ${deptTexts.size} / ${config.departments.length} 局のセクションを検出`);

  if (deptTexts.size === 0) {
    console.error("❌ 局セクションが検出できませんでした。PDFのフォーマットを確認してください。");
    console.log("--- PDF テキスト先頭500文字 ---");
    console.log(fullText.slice(0, 500));
    process.exit(1);
  }

  // raw JSON を生成・保存
  const rawDepartments: ScrapedDepartment[] = config.departments.map((dept) => ({
    departmentName: dept.departmentName,
    departmentSlug: dept.departmentSlug,
    pdfPath: "",
    sourceUrl: config.summaryPdfUrl,
    pdfText: deptTexts.get(dept.departmentSlug) ?? "",
  }));
  fs.writeFileSync(rawPath, JSON.stringify(rawDepartments, null, 2), "utf-8");
  console.log(`💾 raw JSON 保存: ${rawPath}`);

  // 既存のcontentsを読み込んで途中再開
  let existingResults: GeneratedDepartment[] = [];
  if (fs.existsSync(contentsPath)) {
    try {
      existingResults = JSON.parse(fs.readFileSync(contentsPath, "utf-8"));
      console.log(`♻️  既存データ: ${existingResults.length} 局（スキップ可能）`);
    } catch {
      /* ignore */
    }
  }

  const doneSet = new Set(existingResults.map((r) => r.departmentSlug));
  const results: GeneratedDepartment[] = [...existingResults];

  const save = () => {
    fs.writeFileSync(contentsPath, JSON.stringify(results, null, 2), "utf-8");
  };

  console.log(`\n🤖 ${config.departments.length} 局の予算コンテンツを生成します`);

  for (let i = 0; i < config.departments.length; i++) {
    const dept = config.departments[i];

    if (doneSet.has(dept.departmentSlug)) {
      console.log(
        `[${i + 1}/${config.departments.length}] ${dept.departmentName} スキップ（生成済み）`
      );
      continue;
    }

    console.log(`\n[${i + 1}/${config.departments.length}] ${dept.departmentName}`);

    const deptText = deptTexts.get(dept.departmentSlug) ?? "";
    if (!deptText) {
      console.warn(`  ⚠️  テキストが見つかりません。スキップ`);
      continue;
    }

    console.log(`  📝 テキスト長: ${deptText.length} 文字`);

    const prompt = BUDGET_PROMPT.replace(
      /\{departmentName\}/g,
      dept.departmentName
    )
      .replace(/\{fiscalYear\}/g, config.fiscalYear)
      .replace(/\{totalBudget\}/g, String(dept.totalBudget))
      .replace(/\{prevBudget\}/g, String(dept.prevBudget))
      .replace("{pdfText}", deptText.slice(0, 8000));

    try {
      console.log("  🤖 Claude で予算情報を抽出中...");
      const raw = await callClaudeWithRetry(prompt);
      const cleaned = raw
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);

      results.push({
        departmentName: dept.departmentName,
        departmentSlug: dept.departmentSlug,
        ...parsed,
      });
      save();
      console.log(
        `  ✅ 完了: テーマ数=${parsed.themes?.length ?? 0}, 総予算=${parsed.total_budget}万円`
      );
    } catch (err) {
      console.error(`  ❌ スキップ: ${err}`);
    }

    if (i < config.departments.length - 1) {
      await sleep(10000);
    }
  }

  save();
  console.log(`\n📄 出力: ${contentsPath}`);
  console.log(`🎉 ${results.length} 局の予算コンテンツを生成しました`);
  console.log(`\n次のステップ:`);
  console.log(
    `  tsx --env-file=../../.env packages/seed/fukuoka/budget-import.ts ${slug}`
  );
  console.log(
    `  tsx --env-file=../../.env packages/seed/fukuoka/budget-publish.ts ${slug}`
  );
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
