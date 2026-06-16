/**
 * 福岡市オープンデータ(CKAN)から財政・人口データを取得し、
 * 表示用に正規化した JSON を web/src/features/city-finance/data/ に出力する。
 *
 * 実行: npx tsx scripts/fetch-fukuoka-finance.ts
 * ネットワークが必要（CKAN API）。年に一度程度、データ更新時に実行する。
 *
 * データ詳細・出典は .claude/skills/fukuoka-finance-map/SKILL.md を参照。
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const CKAN_BASE = "https://ckan.open-governmentdata.org/api/3/action";
const TREND_DATASET = "zaiseijoukyou-no-suii";
const POPULATION_DATASET = "jinkou-nenpou";

const OUTPUT_PATH = path.join(
  process.cwd(),
  "web/src/features/city-finance/data/fukuoka-finance.json"
);

type YearValue = { year: number; value: number };
type Series = { item: string; values: YearValue[] };

type FinanceData = {
  source: {
    name: string;
    url: string;
    datasetId: string;
    fetchedAt: string;
  };
  unit: "thousand_yen";
  years: number[];
  /** 一般会計の推移（歳入総額・歳出総額・実質収支 等） */
  generalAccount: Series[];
  /** 歳入の推移（財源別） */
  revenue: Series[];
  /** 歳出目的別の推移（民生費・教育費 等） */
  expenditure: Series[];
  /** 各年度の総人口（人）。取得できない場合は null */
  population: YearValue[] | null;
};

/** 和暦の年度表記（例「平成26年度」「令和元年度」）を西暦年度に変換 */
export function wareki年度ToYear(label: string): number | null {
  const m = label.match(/(明治|大正|昭和|平成|令和)\s*(元|\d+)\s*年度/);
  if (!m) return null;
  const era = m[1];
  const n = m[2] === "元" ? 1 : Number.parseInt(m[2], 10);
  const base: Record<string, number> = {
    明治: 1867,
    大正: 1911,
    昭和: 1925,
    平成: 1988,
    令和: 2018,
  };
  return base[era] + n;
}

/** 「1,234」「△567」「▲567」「-」等を数値に。数値化できなければ null */
export function parseAmount(raw: string): number | null {
  const s = raw.trim().replace(/["\s]/g, "").replace(/,/g, "");
  if (s === "" || s === "-" || s === "－" || s === "…") return null;
  const negative = /^[△▲−-]/.test(s);
  const digits = s.replace(/^[△▲−-]/, "");
  if (!/^\d+(\.\d+)?$/.test(digits)) return null;
  const value = Number.parseFloat(digits);
  return negative ? -value : value;
}

/** 簡易CSVパーサ（ダブルクオート対応） */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((v) => v.trim() !== "")) rows.push(row);
  }
  return rows;
}

/** UTF-8(BOM)優先、文字化けすれば Shift_JIS で再デコード */
function decode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  const utf8 = new TextDecoder("utf-8").decode(bytes).replace(/^﻿/, "");
  if (!utf8.includes("�")) return utf8;
  try {
    return new TextDecoder("shift_jis").decode(bytes);
  } catch {
    return utf8;
  }
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return (await res.json()) as T;
}

type CkanPackage = {
  result: { resources: { name: string; url: string; format: string }[] };
};

async function getCsv(url: string): Promise<string[][]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return parseCsv(decode(await res.arrayBuffer()));
}

/** 横持ち（1行目=年度ヘッダ, 1列目=項目名）を Series[] に正規化 */
export function normalizeWideTable(rows: string[][]): {
  years: number[];
  series: Series[];
} {
  if (rows.length === 0) return { years: [], series: [] };
  const header = rows[0];
  const colYear: (number | null)[] = header.map((h) => wareki年度ToYear(h));
  const years = colYear.filter((y): y is number => y !== null);
  const series: Series[] = [];
  for (const r of rows.slice(1)) {
    const item = (r[0] ?? "").trim();
    if (!item) continue;
    const values: YearValue[] = [];
    for (let c = 1; c < r.length; c++) {
      const year = colYear[c];
      if (year === null || year === undefined) continue;
      const value = parseAmount(r[c] ?? "");
      if (value !== null) values.push({ year, value });
    }
    if (values.length > 0) series.push({ item, values });
  }
  return { years, series };
}

async function fetchResources(datasetId: string) {
  const pkg = await getJson<CkanPackage>(
    `${CKAN_BASE}/package_show?id=${datasetId}`
  );
  return pkg.result.resources.filter((r) =>
    (r.format ?? "").toUpperCase().includes("CSV")
  );
}

function pickResource(
  resources: { name: string; url: string }[],
  keyword: string
) {
  return resources.find((r) => r.name.includes(keyword));
}

async function main() {
  const trend = await fetchResources(TREND_DATASET);
  const generalRes = pickResource(trend, "一般会計");
  const revenueRes = pickResource(trend, "歳入");
  const expenditureRes = pickResource(trend, "歳出");
  if (!generalRes || !revenueRes || !expenditureRes) {
    throw new Error(
      `必要なリソースが見つかりません: ${trend.map((r) => r.name).join(", ")}`
    );
  }

  const general = normalizeWideTable(await getCsv(generalRes.url));
  const revenue = normalizeWideTable(await getCsv(revenueRes.url));
  const expenditure = normalizeWideTable(await getCsv(expenditureRes.url));

  // 人口（総人口）はベストエフォートで抽出
  let population: YearValue[] | null = null;
  try {
    const popRes = await fetchResources(POPULATION_DATASET);
    if (popRes[0]) {
      const popTable = normalizeWideTable(await getCsv(popRes[0].url));
      const total = popTable.series.find((s) =>
        /総数|総人口|人口総数|計/.test(s.item)
      );
      population = total ? total.values : null;
    }
  } catch (e) {
    console.warn("人口データの取得に失敗（スキップ）:", e);
  }

  const years = general.years.length ? general.years : revenue.years;
  const data: FinanceData = {
    source: {
      name: "福岡市オープンデータ",
      url: `https://ckan.open-governmentdata.org/dataset/${TREND_DATASET}`,
      datasetId: TREND_DATASET,
      fetchedAt: new Date().toISOString().slice(0, 10),
    },
    unit: "thousand_yen",
    years,
    generalAccount: general.series,
    revenue: revenue.series,
    expenditure: expenditure.series,
    population,
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${OUTPUT_PATH}\n  years=${years[0]}..${years[years.length - 1]}` +
      ` revenue=${revenue.series.length} expenditure=${expenditure.series.length}` +
      ` population=${population ? population.length : "なし"}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
