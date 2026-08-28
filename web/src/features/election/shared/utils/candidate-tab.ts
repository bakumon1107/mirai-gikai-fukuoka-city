import type { CandidateTab } from "../types";

export const CANDIDATE_TABS: { id: CandidateTab; label: string }[] = [
  { id: "profile", label: "プロフィール" },
  { id: "policies", label: "政策・主張" },
];

/**
 * URLの ?tab= をタブに解決する。
 * 未指定や不正な値はプロフィールに倒す（404にはしない）。
 */
export function parseCandidateTab(value: string | undefined): CandidateTab {
  return value === "policies" ? "policies" : "profile";
}
