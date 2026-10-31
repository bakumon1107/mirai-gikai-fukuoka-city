import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { PressConference } from "../../shared/types";
import { findPublishedPressConferenceBySlug } from "../repositories/press-conference-repository";

export async function getPressConferenceBySlug(
  slug: string
): Promise<PressConference | null> {
  return _getCached(slug);
}

const _getCached = unstable_cache(
  async (slug: string): Promise<PressConference | null> => {
    return findPublishedPressConferenceBySlug(slug);
  },
  ["press-conference-by-slug"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.PRESS_CONFERENCES],
  }
);
