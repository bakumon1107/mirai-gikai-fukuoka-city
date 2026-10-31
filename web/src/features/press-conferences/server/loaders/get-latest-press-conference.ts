import "server-only";
import type { PressConference } from "../../shared/types";
import { getPressConferences } from "./get-press-conferences";

/**
 * バナー用。発言（turns）は含まない。
 * 一覧（held_at 降順）の先頭を使い、一覧と同じキャッシュを共有する
 */
export async function getLatestPressConference(): Promise<PressConference | null> {
  const pressConferences = await getPressConferences();
  return pressConferences[0] ?? null;
}
