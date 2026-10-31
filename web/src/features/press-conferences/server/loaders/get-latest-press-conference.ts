import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { PressConference } from "../../shared/types";
import { findLatestPublishedPressConference } from "../repositories/press-conference-repository";

/** バナー用。発言（turns）は含まない */
export async function getLatestPressConference(): Promise<PressConference | null> {
  return _getCached();
}

const _getCached = unstable_cache(
  async (): Promise<PressConference | null> => {
    return findLatestPublishedPressConference();
  },
  ["latest-press-conference"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.PRESS_CONFERENCES],
  }
);
