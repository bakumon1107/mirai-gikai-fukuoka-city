import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { PressConference } from "../../shared/types";
import { findPublishedPressConferences } from "../repositories/press-conference-repository";

/** 一覧用。発言（turns）は含まない */
export async function getPressConferences(): Promise<PressConference[]> {
  return _getCached();
}

const _getCached = unstable_cache(
  async (): Promise<PressConference[]> => {
    return findPublishedPressConferences();
  },
  ["press-conferences-list"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.PRESS_CONFERENCES],
  }
);
