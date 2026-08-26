import type { ElectionPhase, ElectionSchedule } from "../types";

/**
 * 選挙の進行段階を判定する。
 * 告示日の 00:00 までは before-kokuji、投票締切までは campaigning、
 * それ以降は after-vote。
 */
export function getElectionPhase(
  now: Date,
  schedule: ElectionSchedule
): ElectionPhase {
  const nowMs = now.getTime();
  if (nowMs < new Date(schedule.kokujiAt).getTime()) {
    return "before-kokuji";
  }
  if (nowMs < new Date(schedule.voteClosesAt).getTime()) {
    return "campaigning";
  }
  return "after-vote";
}

/**
 * 立候補予定者の呼称。
 * 公職選挙法上「候補者」は届出後の呼称のため、告示前は「立候補予定者」を使う。
 */
export function getCandidateNoun(phase: ElectionPhase): string {
  return phase === "before-kokuji" ? "立候補予定者" : "候補者";
}

/** 並び順のラベル。告示前は出馬表明順、告示後は届出順で固定する。 */
export function getOrderLabel(phase: ElectionPhase): string {
  return phase === "before-kokuji" ? "表明順" : "届出順";
}
