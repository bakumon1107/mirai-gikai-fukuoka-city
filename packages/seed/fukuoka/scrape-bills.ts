/**
 * scrape-bills.ts
 *
 * 福岡市議会公式サイトから議案一覧を取得してJSONに出力する。
 *
 * テーブル構造（転置テーブル）:
 *   左列がフィールド名（議案番号/提出年月日/件名/議決年月日/議決結果/各会派）
 *   横方向に各議案のデータが並ぶ（90件など）
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
  result: string; // 可決 / 否決 / 継続審査 等（空文字=未議決）
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

/**
 * 「無所属１」「無所属2」などを「無所属」に正規化する。
 * 個人名がついた会派名（例: "みらい田中"）はそのまま返す。
 */
function normalizeFactionName(name: string): string {
  if (/^無所属[0-9１-９]?$/.test(name)) return "無所属";
  return name;
}

// ---- スクレイピング本体 ----

/**
 * 指定URLのHTMLを取得してパースし、議案データの配列を返す。
 *
 * 福岡市議会サイトのテーブルは**転置（縦持ち）形式**:
 *   - 各行が1フィールド（議案番号, 件名, 提出日, 議決日, 結果, 各会派...）
 *   - 各列が1議案のデータ
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

  // DataTablesテーブルを探す（id="tablepress-XXXX" 形式）
  const table = $("table[id^='tablepress-']").first();
  if (!table.length) {
    console.warn("⚠️  議案テーブルが見つかりませんでした。HTMLを確認してください。");
    return [];
  }

  // ---- 転置テーブルのパース ----
  // 各行を { fieldName, values[], links[] } として収集する

  type TableRow = {
    fieldName: string;
    values: string[];
    links: (string | null)[];
  };

  const tableRows: TableRow[] = [];

  // thead + tbody 両方の tr を対象にする（「議案番号」行は thead に入っている）
  table.find("tr").each((_, trEl) => {
    const cells = $(trEl).find("td, th");
    if (cells.length === 0) return;

    const fieldName = cells.eq(0).text().trim();
    const values: string[] = [];
    const links: (string | null)[] = [];

    cells.each((colIdx, tdEl) => {
      if (colIdx === 0) return; // フィールド名列はスキップ
      values.push($(tdEl).text().trim());
      const href = $(tdEl).find("a[href]").attr("href") ?? null;
      links.push(href);
    });

    tableRows.push({ fieldName, values, links });
  });

  // 議案数（議案番号行の値の数）
  const billNumberRow = tableRows.find((r) => r.fieldName === "議案番号");
  if (!billNumberRow) {
    console.warn("⚠️  「議案番号」行が見つかりません。");
    return [];
  }
  const billCount = billNumberRow.values.length;

  // 各フィールドをフィールド名でインデックス化
  const rowByField = new Map<string, TableRow>(
    tableRows.map((r) => [r.fieldName, r])
  );

  // 会派行を特定（既知のフィールド名以外は会派とみなす）
  const knownFields = new Set(["議案番号", "提出年月日", "件名", "議決年月日", "議決結果"]);
  const factionRows = tableRows.filter((r) => !knownFields.has(r.fieldName) && r.fieldName !== "");

  // ---- 各議案を組み立て ----
  const bills: ScrapedBill[] = [];

  for (let i = 0; i < billCount; i++) {
    const billNumber = billNumberRow.values[i] ?? "";
    const name = rowByField.get("件名")?.values[i] ?? "";

    if (!billNumber || !name) continue;

    // PDF URL
    const rawHref = rowByField.get("件名")?.links[i] ?? null;
    const pdfUrl = rawHref
      ? rawHref.startsWith("http")
        ? rawHref
        : new URL(rawHref, councilUrl).toString()
      : null;

    // 会派別採決（同一会派（無所属）の複数行はまとめる）
    const factionVoteMap = new Map<string, "for" | "against" | "unknown">();
    for (const frow of factionRows) {
      const normalized = normalizeFactionName(frow.fieldName);
      const vote = parseVoteSymbol(frow.values[i] ?? "");

      // 既にエントリがある場合（無所属の集約）: 反対が1人でもいれば against を優先
      const existing = factionVoteMap.get(normalized);
      if (!existing || (vote === "against" && existing !== "against")) {
        factionVoteMap.set(normalized, vote);
      }
    }

    const factionVotes: FactionVote[] = Array.from(factionVoteMap.entries()).map(
      ([factionName, vote]) => ({ factionName, vote })
    );

    bills.push({
      billNumber: `第${billNumber}号`,
      name: name.replace(/\n.*$/, "").trim(), // 注記（※...）を除去
      submittedDate: parseJapaneseDate(rowByField.get("提出年月日")?.values[i] ?? ""),
      resolvedDate: parseJapaneseDate(rowByField.get("議決年月日")?.values[i] ?? ""),
      result: rowByField.get("議決結果")?.values[i] ?? "",
      factionVotes,
      pdfUrl,
    });
  }

  return bills;
}

// ---- メイン ----

/**
 * slug形式: "r8-1" → URL path: "r8_gikai1"
 */
function slugToUrlPath(slug: string): string {
  const match = slug.match(/^r(\d+)-(\d+)$/);
  if (!match) return slug;
  return `r${match[1]}_gikai${match[2]}`;
}

async function main() {
  const slug = process.argv[2] || "r8-1";

  const councilUrl =
    slug === "r7-4"
      ? "https://gikai.city.fukuoka.lg.jp/result/result/"
      : `https://gikai.city.fukuoka.lg.jp/result/${slugToUrlPath(slug)}/`;

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
    resultCounts[bill.result || "(未議決)"] = (resultCounts[bill.result || "(未議決)"] ?? 0) + 1;
  }
  for (const [result, count] of Object.entries(resultCounts)) {
    console.log(`  ${result}: ${count}件`);
  }

  // 先頭5件をプレビュー
  console.log("\n📋 先頭5件プレビュー:");
  for (const bill of bills.slice(0, 5)) {
    console.log(`  ${bill.billNumber} ${bill.name.slice(0, 40)}`);
    console.log(`    結果: ${bill.result || "(未議決)"} / PDF: ${bill.pdfUrl ? "あり" : "なし"}`);
  }
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
