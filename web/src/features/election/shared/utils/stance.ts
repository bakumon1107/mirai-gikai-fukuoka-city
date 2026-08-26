import type { Candidate, Stance } from "../types";

/**
 * 立場ピルの配色クラス。
 * 分類は記述にもとづく整理であり、優劣を示すものではない。
 */
const STANCE_CLASS: Record<Stance, string> = {
  推進: "text-stance-for bg-stance-for-bg border-stance-for/35",
  条件付き: "text-stance-neutral bg-stance-neutral-bg border-stance-neutral/35",
  慎重: "text-stance-against bg-stance-against-bg border-stance-against/30",
  表明済み: "text-stance-stated bg-stance-stated-bg border-stance-stated/30",
  未表明:
    "text-mirai-text-note bg-mirai-surface-grouped border-mirai-border-muted",
};

export function getStanceClass(stance: Stance): string {
  return STANCE_CLASS[stance];
}

/** 9分野のうち、何らかの言及が確認できている分野の数 */
export function countStatedIssues(candidate: Candidate): number {
  return Object.values(candidate.positions).filter(
    (position) => position.stance !== "未表明"
  ).length;
}
