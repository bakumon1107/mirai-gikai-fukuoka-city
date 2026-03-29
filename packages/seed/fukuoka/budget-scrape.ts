/**
 * budget-scrape.ts
 *
 * ローカルのPDFファイルを読み込み、pdftotext でテキスト抽出してJSONに出力する。
 *
 * 使い方:
 *   tsx --env-file=../../.env fukuoka/budget-scrape.ts
 *
 * 出力: packages/seed/fukuoka/output/r8-1-budget-raw.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

// ---- 型定義 ----

export type ScrapedDepartment = {
  departmentName: string; // e.g. "福祉局"
  departmentSlug: string; // e.g. "fukushi"
  pdfPath: string;
  sourceUrl: string;
  pdfText: string;
};

// ---- 対象PDF一覧 ----

const BASE_PDF_DIR =
  "/home/tajuu/bakumon1107/mirai-gikai-fukuoka-city/docs/fukuoka/sample";
const BASE_URL =
  "https://www.city.fukuoka.lg.jp/zaisei/zaisei/shisei/documents";

const PDF_SOURCES = [
  {
    departmentName: "市長室",
    departmentSlug: "shityoshitsu",
    pdfPath: `${BASE_PDF_DIR}/01_R8_shityoshitsu.pdf`,
    sourceUrl: `${BASE_URL}/01_R8_shityoshitsu.pdf`,
  },
  {
    departmentName: "総務企画局",
    departmentSlug: "somukikaku",
    pdfPath: `${BASE_PDF_DIR}/02_R8_somukikaku.pdf`,
    sourceUrl: `${BASE_URL}/02_R8_somukikaku.pdf`,
  },
  {
    departmentName: "財政局",
    departmentSlug: "zaisei",
    pdfPath: `${BASE_PDF_DIR}/03_R8_zaisei.pdf`,
    sourceUrl: `${BASE_URL}/03_R8_zaisei.pdf`,
  },
  {
    departmentName: "市民局",
    departmentSlug: "shimin",
    pdfPath: `${BASE_PDF_DIR}/04_R8_shiminn.pdf`,
    sourceUrl: `${BASE_URL}/04_R8_shiminn.pdf`,
  },
  {
    departmentName: "こども未来局",
    departmentSlug: "kodomomirai",
    pdfPath: `${BASE_PDF_DIR}/05_R8_kodomomirai.pdf`,
    sourceUrl: `${BASE_URL}/05_R8_kodomomirai.pdf`,
  },
  {
    departmentName: "福祉局",
    departmentSlug: "fukushi",
    pdfPath: `${BASE_PDF_DIR}/06_R8_fukushi.pdf`,
    sourceUrl: `${BASE_URL}/06_R8_fukushi.pdf`,
  },
  {
    departmentName: "保健医療局",
    departmentSlug: "hokeniryo",
    pdfPath: `${BASE_PDF_DIR}/07_R8_hokeniryo.pdf`,
    sourceUrl: `${BASE_URL}/07_R8_hokeniryo.pdf`,
  },
  {
    departmentName: "環境局",
    departmentSlug: "kankyo",
    pdfPath: `${BASE_PDF_DIR}/08_R8_kankyo.pdf`,
    sourceUrl: `${BASE_URL}/08_R8_kankyo.pdf`,
  },
  {
    departmentName: "経済観光文化局",
    departmentSlug: "keizai",
    pdfPath: `${BASE_PDF_DIR}/09_R8_keizai.pdf`,
    sourceUrl: `${BASE_URL}/09_R8_keizai.pdf`,
  },
  {
    departmentName: "農林水産局",
    departmentSlug: "norinsuisan",
    pdfPath: `${BASE_PDF_DIR}/10_R8_norinsuisan.pdf`,
    sourceUrl: `${BASE_URL}/10_R8_norinsuisan.pdf`,
  },
  {
    departmentName: "住宅都市局",
    departmentSlug: "jyutakutoshi",
    pdfPath: `${BASE_PDF_DIR}/11_R8_jyutakutoshi.pdf`,
    sourceUrl: `${BASE_URL}/11_R8_jyutakutoshi.pdf`,
  },
  {
    departmentName: "道路下水道局",
    departmentSlug: "dorogesui",
    pdfPath: `${BASE_PDF_DIR}/12_R8_dorogesui.pdf`,
    sourceUrl: `${BASE_URL}/12_R8_dorogesui.pdf`,
  },
  {
    departmentName: "港湾空港局",
    departmentSlug: "kowankuko",
    pdfPath: `${BASE_PDF_DIR}/13_R8_kowankuko.pdf`,
    sourceUrl: `${BASE_URL}/13_R8_kowankuko.pdf`,
  },
  {
    departmentName: "消防局",
    departmentSlug: "shobo",
    pdfPath: `${BASE_PDF_DIR}/15_R8_syobo.pdf`,
    sourceUrl: `${BASE_URL}/15_R8_syobo.pdf`,
  },
  {
    departmentName: "水道局",
    departmentSlug: "suido",
    pdfPath: `${BASE_PDF_DIR}/16_R8_suido.pdf`,
    sourceUrl: `${BASE_URL}/16_R8_suido.pdf`,
  },
  {
    departmentName: "交通局",
    departmentSlug: "kotsu",
    pdfPath: `${BASE_PDF_DIR}/17_R8_kotsu.pdf`,
    sourceUrl: `${BASE_URL}/17_R8_kotsu.pdf`,
  },
  {
    departmentName: "教育委員会事務局",
    departmentSlug: "kyoiku",
    pdfPath: `${BASE_PDF_DIR}/18_R8_kyoiku.pdf`,
    sourceUrl: `${BASE_URL}/18_R8_kyoiku.pdf`,
  },
];

// ---- PDF テキスト抽出 ----

function extractPdfText(pdfPath: string): string {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDFファイルが見つかりません: ${pdfPath}`);
  }

  const text = execSync(`pdftotext -layout "${pdfPath}" -`, {
    encoding: "utf-8",
    maxBuffer: 10 * 1024 * 1024,
  });

  return text.trim();
}

// ---- メイン ----

async function main() {
  const outputDir = path.join(import.meta.dirname, "output");
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, "r8-1-budget-raw.json");

  const results: ScrapedDepartment[] = [];

  for (const source of PDF_SOURCES) {
    console.log(`\n📄 処理中: ${source.departmentName} (${source.pdfPath})`);

    let pdfText: string;
    try {
      pdfText = extractPdfText(source.pdfPath);
      console.log(`  ✅ テキスト抽出完了: ${pdfText.length} 文字`);
    } catch (err) {
      console.error(`  ❌ テキスト抽出失敗: ${err}`);
      continue;
    }

    results.push({
      departmentName: source.departmentName,
      departmentSlug: source.departmentSlug,
      pdfPath: source.pdfPath,
      sourceUrl: source.sourceUrl,
      pdfText,
    });
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n📄 出力: ${outputPath}`);
  console.log(`🎉 ${results.length} 局の予算データを抽出しました`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
