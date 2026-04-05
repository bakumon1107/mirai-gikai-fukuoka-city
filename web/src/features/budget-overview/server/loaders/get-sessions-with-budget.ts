import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { CouncilSession } from "@/features/council-sessions/shared/types";
import { findAllPastCouncilSessions } from "@/features/council-sessions/server/repositories/council-session-repository";
import { hasPublishedOverviewsBySession } from "../repositories/budget-repository";

/**
 * budget_overviews が存在する全会期を新しい順に取得
 */
export async function getSessionsWithBudget(): Promise<CouncilSession[]> {
  return _getCachedSessionsWithBudget();
}

const _getCachedSessionsWithBudget = unstable_cache(
  async (): Promise<CouncilSession[]> => {
    const allSessions = await findAllPastCouncilSessions();

    const results = await Promise.all(
      allSessions.map(async (session) => {
        const hasBudget = await hasPublishedOverviewsBySession(session.id);
        return hasBudget ? session : null;
      })
    );

    return results.filter((s): s is CouncilSession => s !== null);
  },
  ["sessions-with-budget"],
  {
    revalidate: 3600,
    tags: [CACHE_TAGS.COUNCIL_SESSIONS],
  }
);
