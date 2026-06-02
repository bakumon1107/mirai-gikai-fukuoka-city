"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Grade, WatchdogFlagType } from "../../shared/types/jimu-jigyo";

const GRADES: Grade[] = ["A", "B", "C", "D"];
const FLAGS: { type: WatchdogFlagType; label: string; icon: string }[] = [
  { type: "low_target", label: "目標低すぎ", icon: "🎯" },
  { type: "missing_kpi", label: "KPI未設定", icon: "📊" },
  { type: "budget_surge", label: "予算急増", icon: "💰" },
  { type: "declining", label: "実績悪化", icon: "📉" },
  { type: "vague_goal", label: "終了基準不明", icon: "❓" },
  { type: "no_data", label: "データ未集計", icon: "🔒" },
];

const SORT_OPTIONS = [
  { value: "score_asc", label: "スコア昇順" },
  { value: "score_desc", label: "スコア降順" },
  { value: "name_asc", label: "事業名順" },
  { value: "budget_desc", label: "事業費降順" },
];

type Props = {
  kyokuList: string[];
};

export function JimuJigyoFilterBar({ kyokuList }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentKyoku = searchParams.get("kyoku") ?? "";
  const currentGrades = (searchParams.get("grade") ?? "")
    .split(",")
    .filter(Boolean);
  const currentFlags = (searchParams.get("flag") ?? "")
    .split(",")
    .filter(Boolean);
  const currentSort = searchParams.get("sort") ?? "score_asc";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const toggleMulti = useCallback(
    (key: string, current: string[], value: string) => {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      update(key, next.join(","));
    },
    [update]
  );

  return (
    <div className="bg-white border border-mirai-border rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* 局フィルター */}
        <div>
          <label
            htmlFor="filter-kyoku"
            className="text-xs text-mirai-text-muted block mb-1"
          >
            局
          </label>
          <select
            id="filter-kyoku"
            value={currentKyoku}
            onChange={(e) => update("kyoku", e.target.value)}
            className="text-sm border border-mirai-border rounded px-2 py-1 bg-white"
          >
            <option value="">全て</option>
            {kyokuList.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* ソート */}
        <div>
          <label
            htmlFor="filter-sort"
            className="text-xs text-mirai-text-muted block mb-1"
          >
            並び
          </label>
          <select
            id="filter-sort"
            value={currentSort}
            onChange={(e) => update("sort", e.target.value)}
            className="text-sm border border-mirai-border rounded px-2 py-1 bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* グレードフィルター */}
      <div>
        <p className="text-xs text-mirai-text-muted mb-2">グレード</p>
        <div className="flex gap-2 flex-wrap">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => toggleMulti("grade", currentGrades, g)}
              className={`
                px-3 py-1 rounded-full text-sm font-bold border transition-colors
                ${
                  currentGrades.includes(g) || currentGrades.length === 0
                    ? `bg-grade-${g.toLowerCase()}-bg text-grade-${g.toLowerCase()} border-grade-${g.toLowerCase()}`
                    : "bg-mirai-surface text-mirai-text-muted border-mirai-border opacity-40"
                }
              `}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* フラグフィルター */}
      <div>
        <p className="text-xs text-mirai-text-muted mb-2">フラグ</p>
        <div className="flex gap-2 flex-wrap">
          {FLAGS.map((f) => (
            <button
              key={f.type}
              type="button"
              onClick={() => toggleMulti("flag", currentFlags, f.type)}
              className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors
                ${
                  currentFlags.includes(f.type)
                    ? "bg-mirai-surface-warm border-mirai-border-light text-mirai-text"
                    : "bg-mirai-surface border-mirai-border text-mirai-text-muted"
                }
              `}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function filterAndSort(
  records: import("../../shared/types/jimu-jigyo").JimuJigyoRecord[],
  params: { kyoku: string; grade: string; flag: string; sort: string }
) {
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
