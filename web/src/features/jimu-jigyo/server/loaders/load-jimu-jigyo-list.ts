import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type {
  JimuJigyoData,
  JimuJigyoRecord,
} from "../../shared/types/jimu-jigyo";
import { calcFlags } from "../../shared/utils/flags";
import { calcScore, slugify } from "../../shared/utils/score";
import { getCurrentBudget } from "../../shared/utils/budget-accessor";

// 年度メタデータ: 新年度追加時はここだけ変更する
export const YEAR_METADATA = [
  {
    slug: "r6",
    label: "令和6年度（2024年度）",
    description: "74事業の執行状況を評価",
  },
] as const;

export type JimuJigyoYear = (typeof YEAR_METADATA)[number]["slug"];

export const AVAILABLE_YEARS = YEAR_METADATA.map(
  (m) => m.slug
) as JimuJigyoYear[];

export function isValidYear(year: string): year is JimuJigyoYear {
  return (AVAILABLE_YEARS as string[]).includes(year);
}

export function getYearLabel(year: JimuJigyoYear): string {
  return (
    YEAR_METADATA.find((m) => m.slug === year)?.label ?? year.toUpperCase()
  );
}

// Next.js ビルド時の cwd は web/ パッケージディレクトリ
const DATA_DIR = path.join(process.cwd(), "../packages/seed/fukuoka");

/** JSON から読み込んだレコードの最低限の形を検証する */
function sanitizeRecord(raw: unknown): JimuJigyoData | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.事業名 !== "string" || !r.事業名) return null;
  if (typeof r.所管局 !== "string" || !r.所管局) return null;
  if (typeof r.所管課 !== "string" || !r.所管課) return null;
  return r as unknown as JimuJigyoData;
}

async function loadAllJson(year: JimuJigyoYear): Promise<JimuJigyoData[]> {
  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter(
    (f) => f.startsWith(`jimu-jigyo-${year}-`) && f.endsWith(".json")
  );

  const all: JimuJigyoData[] = [];
  for (const file of jsonFiles) {
    const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
    const parsed: unknown[] = JSON.parse(raw);
    for (const item of parsed) {
      const record = sanitizeRecord(item);
      if (record) {
        all.push(record);
      } else {
        console.warn(`[jimu-jigyo] Skipping invalid record in ${file}`);
      }
    }
  }
  return all;
}

function toRecord(data: JimuJigyoData, year: JimuJigyoYear): JimuJigyoRecord {
  const { score, grade, breakdown } = calcScore(data, year);
  const flags = calcFlags(data, year);
  return {
    ...data,
    id: slugify(data.事業名),
    score,
    grade,
    breakdown,
    flags,
  };
}

const cache = new Map<JimuJigyoYear, JimuJigyoRecord[]>();

export async function loadJimuJigyoList(
  year: JimuJigyoYear
): Promise<JimuJigyoRecord[]> {
  if (cache.has(year)) return cache.get(year)!;
  const raw = await loadAllJson(year);
  const records = raw.map((d) => toRecord(d, year));
  cache.set(year, records);
  return records;
}

export async function getGradeSummary(
  records: JimuJigyoRecord[],
  year: JimuJigyoYear
) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  let totalBudget = 0;
  let totalScore = 0;

  for (const r of records) {
    counts[r.grade]++;
    totalScore += r.score;
    totalBudget += getCurrentBudget(r, year)?.歳出 ?? 0;
  }

  return {
    total: records.length,
    counts,
    averageScore: Math.round(totalScore / records.length),
    totalBudgetManYen: Math.round(totalBudget / 100),
  };
}
