import type { ElectionSchedule } from "../types";

/**
 * 特設ページを非公開にする日時を過ぎたか。hiddenAt ちょうどから非公開。
 * hiddenAt が null（期日が決まっていない）の間は公開する。
 */
export function isElectionPageHidden(
  now: Date,
  schedule: Pick<ElectionSchedule, "hiddenAt">
): boolean {
  if (schedule.hiddenAt === null) {
    return false;
  }
  return now.getTime() >= new Date(schedule.hiddenAt).getTime();
}

/** 特設ページ配下のパスか（/election と /election/...）。 */
export function isElectionPath(pathname: string): boolean {
  return pathname === "/election" || pathname.startsWith("/election/");
}
