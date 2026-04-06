import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";
import type { CouncilSession } from "../../shared/types";

/**
 * アクティブな定例会を取得
 */
export async function findActiveCouncilSession(): Promise<CouncilSession | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("council_sessions")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch active council session:", error);
    return null;
  }

  return data;
}

/**
 * 指定日時点で開催中の定例会を取得
 */
export async function findCurrentCouncilSession(
  targetDate: string
): Promise<CouncilSession | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("council_sessions")
    .select("*")
    .lte("start_date", targetDate)
    .or(`end_date.gte.${targetDate},end_date.is.null`)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch current council session:", error);
    return null;
  }

  return data;
}

/**
 * 全定例会を新しい順に取得（アクティブなものを除く、公開済み議案が1件以上あるもののみ）
 */
export async function findAllPastCouncilSessions(): Promise<CouncilSession[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("council_sessions")
    .select("*, bills!inner(id)")
    .eq("is_active", false)
    .eq("bills.publish_status", "published")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch past council sessions:", error);
    return [];
  }

  // bills の重複を除いて CouncilSession の形に戻す
  const seen = new Set<string>();
  const sessions: CouncilSession[] = [];
  for (const row of data ?? []) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      const { bills: _, ...session } = row;
      sessions.push(session as CouncilSession);
    }
  }
  return sessions;
}

/**
 * 指定日より前の直近の定例会を取得
 */
export async function findPreviousCouncilSession(
  beforeStartDate: string
): Promise<CouncilSession | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("council_sessions")
    .select("*")
    .lt("start_date", beforeStartDate)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch previous council session:", error);
    return null;
  }

  return data;
}
