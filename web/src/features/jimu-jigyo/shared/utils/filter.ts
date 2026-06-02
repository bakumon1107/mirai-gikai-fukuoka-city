import type {
  Grade,
  JimuJigyoRecord,
  WatchdogFlagType,
} from "../types/jimu-jigyo";

export function filterAndSort(
  records: JimuJigyoRecord[],
  params: { kyoku: string; grade: string; flag: string; sort: string }
): JimuJigyoRecord[] {
  let filtered = [...records];

  if (params.kyoku) {
    filtered = filtered.filter((r) => r.所管局 === params.kyoku);
  }

  const grades = params.grade.split(",").filter(Boolean) as Grade[];
  if (grades.length > 0) {
    filtered = filtered.filter((r) => grades.includes(r.grade));
  }

  const flags = params.flag.split(",").filter(Boolean) as WatchdogFlagType[];
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
          (b.事業費_千円?.R6決算見込?.歳出 ?? 0) -
          (a.事業費_千円?.R6決算見込?.歳出 ?? 0)
      );
      break;
    default:
      filtered.sort((a, b) => a.score - b.score);
  }

  return filtered;
}
