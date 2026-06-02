import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type {
  JimuJigyoData,
  JimuJigyoRecord,
} from "../../shared/types/jimu-jigyo";
import { calcFlags } from "../../shared/utils/flags";
import { calcScore, slugify } from "../../shared/utils/score";

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

async function loadAllJson(year: JimuJigyoYear): Promise<JimuJigyoData[]> {
  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter(
    (f) => f.startsWith(`jimu-jigyo-${year}-`) && f.endsWith(".json")
  );

  const all: JimuJigyoData[] = [];
  for (const file of jsonFiles) {
    const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
    const records: JimuJigyoData[] = JSON.parse(raw);
    all.push(...records);
  }
  return all;
}

function toRecord(data: JimuJigyoData): JimuJigyoRecord {
  const { score, grade, breakdown } = calcScore(data);
  const flags = calcFlags(data);
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
  const records = raw.map(toRecord);
  cache.set(year, records);
  return records;
}

export async function getGradeSummary(records: JimuJigyoRecord[]) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  let totalBudget = 0;
  let totalScore = 0;

  for (const r of records) {
    counts[r.grade]++;
    totalScore += r.score;
    totalBudget += r.事業費_千円?.R6決算見込?.歳出 ?? 0;
  }

  return {
    total: records.length,
    counts,
    averageScore: Math.round(totalScore / records.length),
    totalBudgetManYen: Math.round(totalBudget / 100),
  };
}
