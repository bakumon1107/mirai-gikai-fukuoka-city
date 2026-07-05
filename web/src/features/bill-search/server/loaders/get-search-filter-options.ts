import "server-only";
import { findFeaturedTags } from "@/features/bills/server/repositories/bill-repository";
import { findAllDietSessions } from "@/features/diet-sessions/server/repositories/diet-session-repository";
import type { SearchFilterOptions } from "../../shared/types";

/**
 * 検索フィルタの選択肢（会期・カテゴリタグ）を取得する
 */
export async function getSearchFilterOptions(): Promise<SearchFilterOptions> {
  const [sessions, tags] = await Promise.all([
    findAllDietSessions(),
    findFeaturedTags(),
  ]);

  return {
    sessions: sessions.map((s) => ({ id: s.id, name: s.name })),
    tags: tags.map((t) => ({ id: t.id, label: t.label })),
  };
}
