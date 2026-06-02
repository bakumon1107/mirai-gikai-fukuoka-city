import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type {
  JimuJigyoData,
  JimuJigyoRecord,
} from "../../shared/types/jimu-jigyo";
import { calcFlags } from "../../shared/utils/flags";
import { calcScore, slugify } from "../../shared/utils/score";

const DATA_DIR = path.join(process.cwd(), "../../packages/seed/fukuoka");

async function loadAllJson(): Promise<JimuJigyoData[]> {
  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter(
    (f) => f.startsWith("jimu-jigyo-r6-") && f.endsWith(".json")
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

let cache: JimuJigyoRecord[] | null = null;

export async function loadJimuJigyoList(): Promise<JimuJigyoRecord[]> {
  if (cache) return cache;
  const raw = await loadAllJson();
  cache = raw.map(toRecord);
  return cache;
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
