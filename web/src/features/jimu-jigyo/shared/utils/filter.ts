import type {
  Grade,
  JimuJigyoRecord,
  WatchdogFlagType,
} from "../types/jimu-jigyo";
import { getCurrentBudget } from "./budget-accessor";

const VALID_GRADES: Grade[] = ["A", "B", "C", "D"];
const VALID_FLAGS: WatchdogFlagType[] = [
  "low_target",
  "missing_kpi",
  "budget_surge",
  "declining",
  "vague_goal",
  "no_data",
];

export function filterAndSort(
  records: JimuJigyoRecord[],
  params: { kyoku: string; grade: string; flag: string; sort: string },
  year: string = "r6"
): JimuJigyoRecord[] {
  let filtered = [...records];

  if (params.kyoku) {
    filtered = filtered.filter((r) => r.所管局 === params.kyoku);
  }

  const grades = params.grade
    .split(",")
    .filter((g): g is Grade => VALID_GRADES.includes(g as Grade));
  if (grades.length > 0) {
    filtered = filtered.filter((r) => grades.includes(r.grade));
  }

  const flags = params.flag
    .split(",")
    .filter((f): f is WatchdogFlagType =>
      VALID_FLAGS.includes(f as WatchdogFlagType)
    );
  if (flags.length > 0) {
    filtered = filtered.filter((r) =>
      flags.every((f) => r.flags.some((rf) => rf.type === f))
    );
  }

  switch (params.sort) {
    case "score_desc":
      filtered.sort((a, b) => b.score - a.score);
      break;
    case "name_asc":
      filtered.sort((a, b) => a.事業名.localeCompare(b.事業名, "ja"));
      break;
    case "budget_desc":
      filtered.sort(
        (a, b) =>
          (getCurrentBudget(b, year)?.歳出 ?? 0) -
          (getCurrentBudget(a, year)?.歳出 ?? 0)
      );
      break;
    default:
      filtered.sort((a, b) => a.score - b.score);
  }

  return filtered;
}
