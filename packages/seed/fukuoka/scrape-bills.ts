/**
 * scrape-bills.ts
 *
 * 福岡市議会公式サイトから議案一覧を取得してJSONに出力する。
 *
 * 使い方:
 *   tsx packages/seed/fukuoka/scrape-bills.ts [会期slug]
 *   例: tsx packages/seed/fukuoka/scrape-bills.ts r8-1
 *
 * 出力: packages/seed/fukuoka/output/<slug>-bills.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { load } from "cheerio";

// ---- 型定義 ----

export type FactionVote = {
  factionName: string; // サイト上の略称（例: "自民", "公明"）
  vote: "for" | "against" | "unknown";
};

export type ScrapedBill = {
  billNumber: string; // 例: "第1号"
  name: string; // 議案タイトル
  submittedDate: string | null; // ISO形式 "YYYY-MM-DD"
  resolvedDate: string | null; // ISO形式 "YYYY-MM-DD"
  result: string; // 可決 / 否決 / 継続審査 等
  factionVotes: FactionVote[];
  pdfUrl: string | null;
};

// ---- 令和→西暦変換 ----

/**
 * 「R8.2.17」「令和8年2月17日」などを "2026-02-17" 形式に変換する。
 * 変換できない場合は null を返す。
 */
export function parseJapaneseDate(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();

  // "R8.2.17" 形式
  const reiwaShort = trimmed.match(/^R(\d+)\.(\d+)\.(\d+)$/);
  if (reiwaShort) {
    const year = 2018 + Number(reiwaShort[1]);
    const month = reiwaShort[2].padStart(2, "0");
    const day = reiwaShort[3].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // "令和8年2月17日" 形式
  const reiwaFull = trimmed.match(/令和(\d+)年(\d+)月(\d+)日/);
  if (reiwaFull) {
    const year = 2018 + Number(reiwaFull[1]);
    const month = reiwaFull[2].padStart(2, "0");
    const day = reiwaFull[3].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // "2026-02-17" 形式はそのまま
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  return null;
}

// ---- 会派別採決パース ----

/**
 * ○ → "for", × → "against", それ以外 → "unknown"
 */
function parseVoteSymbol(symbol: string): "for" | "against" | "unknown" {
  const s = symbol.trim();
  if (s === "○" || s === "〇") return "for";
  if (s === "×" || s === "✕") return "against";
  return "unknown";
}

// ---- スクレイピング本体 ----

/**
 * 指定URLのHTMLを取得してパースし、議案データの配列を返す。
 */
export async function scrapeBills(councilUrl: string): Promise<ScrapedBill[]> {
  console.log(`🌐 Fetching: ${councilUrl}`);

  const response = await fetch(councilUrl, {
    headers: {
      "User-Agent":
        "mirai-gikai-data-import/1.0 (+https://github.com/bakumon0907)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${councilUrl}: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const $ = load(html);

  const bills: ScrapedBill[] = [];

  // DataTablesテーブルを探す（id="tablepress-XXXX" 形式）
  const table = $("table[id^='tablepress-']").first();
  if (!table.length) {
    console.warn("⚠️  議案テーブルが見つかりませんでした。HTMLを確認してください。");
    return bills;
  }

  // ヘッダー行から会派名を取得
  const headers: string[] = [];
  table.find("thead th, thead td").each((_, el) => {
    headers.push($(el).text().trim());
  });

  // ヘッダーが取れない場合は tbody の最初の行をヘッダーとして扱う
  let factionStartIndex = -1;
  if (headers.length === 0) {
    table.find("tbody tr").first().find("th, td").each((i, el) => {
      headers.push($(el).text().trim());
    });
  }

  // 会派列の開始インデックスを特定（「議決結果」列の次）
  const resultIndex = headers.findIndex(
    (h) => h.includes("議決") || h.includes("結果")
  );
  if (resultIndex >= 0) {
    factionStartIndex = resultIndex + 1;
  }

  const factionNames = factionStartIndex >= 0
    ? headers.slice(factionStartIndex).filter((h) => h.length > 0)
    : [];

  // データ行をパース
  table.find("tbody tr").each((rowIndex, row) => {
    const cells = $(row).find("td");
    if (cells.length < 3) return; // ヘッダー行などをスキップ

    // 列インデックスは公式サイトの構造に合わせて調整
    // 想定: 議案番号 | 件名 | 提出日 | 議決日 | 議決結果 | [会派...]
    const billNumber = cells.eq(0).text().trim();
    const nameCell = cells.eq(1);
    const name = nameCell.text().trim();
    const submittedDateRaw = cells.eq(2).text().trim();
    const resolvedDateRaw = cells.eq(3).text().trim();
    const resultText = cells.eq(4).text().trim();

    if (!billNumber || !name) return;

    // PDFリンク
    const pdfHref = nameCell.find("a[href$='.pdf'], a[href*='.pdf']").attr("href");
    let pdfUrl: string | null = null;
    if (pdfHref) {
      pdfUrl = pdfHref.startsWith("http")
        ? pdfHref
        : new URL(pdfHref, councilUrl).toString();
    }

    // 会派別採決
    const factionVotes: FactionVote[] = [];
    if (factionStartIndex >= 0) {
      factionNames.forEach((factionName, i) => {
        const voteCell = cells.eq(factionStartIndex + i);
        factionVotes.push({
          factionName,
          vote: parseVoteSymbol(voteCell.text()),
        });
      });
    }

    bills.push({
      billNumber,
      name,
      submittedDate: parseJapaneseDate(submittedDateRaw),
      resolvedDate: parseJapaneseDate(resolvedDateRaw),
      result: resultText,
      factionVotes,
      pdfUrl,
    });
  });

  return bills;
}

// ---- メイン ----

async function main() {
  const slug = process.argv[2] || "r8-1";

  // 会期スラッグからURLを組み立て
  const councilUrl =
    slug === "r7-4"
      ? "https://gikai.city.fukuoka.lg.jp/result/result/"
      : `https://gikai.city.fukuoka.lg.jp/result/${slug}_gikai1/`;

  const bills = await scrapeBills(councilUrl);
  console.log(`✅ ${bills.length} 件の議案を取得しました`);

  // 出力先ディレクトリを作成
  const outputDir = path.join(import.meta.dirname, "output");
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${slug}-bills.json`);
  fs.writeFileSync(outputPath, JSON.stringify(bills, null, 2), "utf-8");
  console.log(`📄 出力: ${outputPath}`);

  // サマリー表示
  console.log("\n📊 議決結果サマリー:");
  const resultCounts: Record<string, number> = {};
  for (const bill of bills) {
    resultCounts[bill.result] = (resultCounts[bill.result] ?? 0) + 1;
  }
  for (const [result, count] of Object.entries(resultCounts)) {
    console.log(`  ${result || "(未記載)"}: ${count}件`);
  }
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
