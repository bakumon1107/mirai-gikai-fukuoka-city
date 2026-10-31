import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { findLatestSessionWithBudget } from "../repositories/budget-repository";

export async function getLatestBudgetSession(): Promise<{
  id: string;
  slug: string | null;
} | null> {
  return _getCached();
}

const _getCached = unstable_cache(
  async (): Promise<{ id: string; slug: string | null } | null> => {
    return findLatestSessionWithBudget();
  },
  ["latest-budget-session"],
  {
    revalidate: 3600,
    tags: [CACHE_TAGS.COUNCIL_SESSIONS],
  }
);
