import "server-only";
import { createAdminClient } from "@mirai-gikai/supabase";
import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import { buildSearchQueryVariants } from "@/features/bill-search/shared/utils/normalize-search-query";
import type { BillStatusEnum } from "../../shared/types";
import {
  escapeIlikePattern,
  sanitizeSearchQuery,
} from "../../shared/utils/sanitize-search-query";

// ============================================================
// Bills
// ============================================================

/**
 * 公開済み議案を難易度コンテンツ付きで取得
 */
export async function findPublishedBillsWithContents(
  difficultyLevel: DifficultyLevelEnum
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills")
    .select(
      `
      *,
      bill_contents!inner (
        id,
        bill_id,
        title,
        summary,
        content,
        difficulty_level,
        created_at,
        updated_at
      )
    `
    )
    .eq("publish_status", "published")
    .eq("bill_contents.difficulty_level", difficultyLevel)
    .order("submitted_date", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Failed to fetch bills: ${error.message}`);
  }

  return data;
}

/** 検索の絞り込み条件 */
export type BillSearchFilters = {
  dietSessionId?: string;
  tagId?: string;
  statuses?: BillStatusEnum[];
  // true のとき公開中のAIインタビューがある議案に絞る
  hasPublicInterview?: boolean;
};

/**
 * フリーワードで公開済み議案を検索する。
 *
 * - 表記ゆれ吸収: NFKC 正規化 + かな相互変換のバリエーションで検索する
 * - 難易度またぎ: マッチ判定は全難易度の bill_contents を対象にし、
 *   表示コンテンツは現在難易度のものを返す（別難易度の文言にしか
 *   含まれない語でも取りこぼさない）
 * - 注入対策: 構造文字の除去とワイルドカードのエスケープを行ってから埋め込む
 *
 * クエリが空でもフィルタ指定があれば絞り込み一覧として機能する。
 */
export async function findPublishedBillsBySearch(
  query: string,
  difficultyLevel: DifficultyLevelEnum,
  pagination: { limit: number; offset: number },
  filters: BillSearchFilters = {}
) {
  const safeVariants = buildSearchQueryVariants(query)
    .map((variant) => escapeIlikePattern(sanitizeSearchQuery(variant)))
    .filter((variant) => variant !== "");
  // クエリもフィルタも無い場合は全公開議案の一覧として機能する

  const supabase = createAdminClient();

  // キーワードマッチは全難易度の bill_contents から bill_id を先に解決する
  // （表示難易度と別の難易度にしか含まれない語も拾う。データ量が増えて
  //   in() が長大になる場合は pg_trgm / RPC への移行を検討）
  let matchedBillIds: string[] | null = null;
  if (safeVariants.length > 0) {
    const orExpr = safeVariants
      .flatMap((v) => [`title.ilike.%${v}%`, `summary.ilike.%${v}%`])
      .join(",");
    const { data: matchedRows, error: matchError } = await supabase
      .from("bill_contents")
      .select("bill_id")
      .or(orExpr);

    if (matchError) {
      throw new Error(`Failed to match bill contents: ${matchError.message}`);
    }
    matchedBillIds = [...new Set((matchedRows ?? []).map((r) => r.bill_id))];
    if (matchedBillIds.length === 0) {
      return { data: [], count: 0 };
    }
  }

  // AIインタビュー絞り込みも対象bill_idを先に解決する
  let interviewBillIds: string[] | null = null;
  if (filters.hasPublicInterview) {
    const { data: interviewRows, error: interviewError } = await supabase
      .from("interview_configs")
      .select("bill_id")
      .eq("status", "public");

    if (interviewError) {
      throw new Error(
        `Failed to resolve interview filter: ${interviewError.message}`
      );
    }
    interviewBillIds = [
      ...new Set((interviewRows ?? []).map((row) => row.bill_id)),
    ];
    if (interviewBillIds.length === 0) {
      return { data: [], count: 0 };
    }
  }

  // タグ絞り込みも対象bill_idを先に解決する
  // （selectの動的組み立てを避けて型推論を保つため2段階で問い合わせる）
  let tagBillIds: string[] | null = null;
  if (filters.tagId) {
    const { data: tagRows, error: tagError } = await supabase
      .from("bills_tags")
      .select("bill_id")
      .eq("tag_id", filters.tagId);

    if (tagError) {
      throw new Error(`Failed to resolve tag filter: ${tagError.message}`);
    }
    tagBillIds = (tagRows ?? []).map((row) => row.bill_id);
    if (tagBillIds.length === 0) {
      return { data: [], count: 0 };
    }
  }

  let builder = supabase
    .from("bills")
    .select(
      `
      *,
      bill_contents!inner (
        id,
        bill_id,
        title,
        summary,
        content,
        difficulty_level,
        created_at,
        updated_at
      )
    `,
      { count: "exact" }
    )
    .eq("publish_status", "published")
    .eq("bill_contents.difficulty_level", difficultyLevel);

  if (matchedBillIds) {
    builder = builder.in("id", matchedBillIds);
  }
  if (tagBillIds) {
    builder = builder.in("id", tagBillIds);
  }
  if (interviewBillIds) {
    builder = builder.in("id", interviewBillIds);
  }
  if (filters.dietSessionId) {
    builder = builder.eq("diet_session_id", filters.dietSessionId);
  }
  if (filters.statuses && filters.statuses.length > 0) {
    builder = builder.in("status", filters.statuses);
  }

  const { data, error, count } = await builder
    .order("submitted_date", { ascending: false, nullsFirst: false })
    .range(pagination.offset, pagination.offset + pagination.limit - 1);

  if (error) {
    // 範囲外オフセット（URL直打ち等）はPostgRESTが416を返す。
    // エラーにせず「空＋総数不明」として返し、呼び出し側でページを丸め直す
    if (error.code === "PGRST103") {
      return { data: [], count: null };
    }
    throw new Error(`Failed to search bills: ${error.message}`);
  }

  return { data, count: count ?? 0 };
}

/**
 * 公開済み議案を1件取得
 */
export async function findPublishedBillById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("id", id)
    .eq("publish_status", "published")
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * 管理者用: ステータス問わず議案を1件取得
 */
export async function findBillById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * 議案のmirai_stanceを取得
 */
export async function findMiraiStanceByBillId(billId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("mirai_stances")
    .select("*")
    .eq("bill_id", billId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * 議案のタグを取得
 */
export async function findTagsByBillId(billId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills_tags")
    .select("tags(id, label)")
    .eq("bill_id", billId);

  if (error) {
    return null;
  }

  return data;
}

// ============================================================
// Bill Contents
// ============================================================

/**
 * 指定された難易度の議案コンテンツを取得
 */
export async function findBillContentByDifficulty(
  billId: string,
  difficultyLevel: DifficultyLevelEnum
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bill_contents")
    .select("*")
    .eq("bill_id", billId)
    .eq("difficulty_level", difficultyLevel)
    .single();

  if (error) {
    console.error(`Failed to fetch bill content: ${error.message}`);
    return null;
  }

  return data;
}

// ============================================================
// Tags (bulk)
// ============================================================

import { groupTagsByBillId } from "../../shared/utils/group-tags";

/**
 * 複数のbill_idに紐づくタグを一括取得し、bill_idごとにグループ化して返す
 */
export async function findTagsByBillIds(
  billIds: string[]
): Promise<Map<string, Array<{ id: string; label: string }>>> {
  if (billIds.length === 0) {
    return new Map();
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills_tags")
    .select("bill_id, tags(id, label)")
    .in("bill_id", billIds);

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return groupTagsByBillId(data ?? []);
}

// ============================================================
// Diet Session Bills
// ============================================================

/**
 * 国会会期IDに紐づく公開済み議案を取得
 */
export async function findPublishedBillsByDietSession(
  dietSessionId: string,
  difficultyLevel: DifficultyLevelEnum
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills")
    .select(
      `
      *,
      bill_contents!inner (
        id,
        bill_id,
        title,
        summary,
        content,
        difficulty_level,
        created_at,
        updated_at
      )
    `
    )
    .eq("diet_session_id", dietSessionId)
    .eq("publish_status", "published")
    .eq("bill_contents.difficulty_level", difficultyLevel)
    .order("status_order", { ascending: true })
    .order("submitted_date", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Failed to fetch bills by diet session: ${error.message}`);
  }

  return data;
}

/**
 * 前回の国会会期の公開済み議案を取得（成立法案を優先、件数制限あり）
 */
export async function findPreviousSessionBills(
  dietSessionId: string,
  difficultyLevel: DifficultyLevelEnum,
  limit: number
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills")
    .select(
      `
      *,
      bill_contents!inner (
        id,
        bill_id,
        title,
        summary,
        content,
        difficulty_level,
        created_at,
        updated_at
      )
    `
    )
    .eq("diet_session_id", dietSessionId)
    .eq("publish_status", "published")
    .eq("bill_contents.difficulty_level", difficultyLevel)
    .order("status_order", { ascending: true })
    .order("submitted_date", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch previous session bills:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 前回の国会会期の公開済み議案数を取得
 */
export async function countPublishedBillsByDietSession(
  dietSessionId: string,
  difficultyLevel: DifficultyLevelEnum
): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("bills")
    .select("*, bill_contents!inner(difficulty_level)", {
      count: "exact",
      head: true,
    })
    .eq("diet_session_id", dietSessionId)
    .eq("publish_status", "published")
    .eq("bill_contents.difficulty_level", difficultyLevel);

  if (error) {
    console.error("Failed to count previous session bills:", error);
    return 0;
  }

  return count ?? 0;
}

// ============================================================
// Featured
// ============================================================

/**
 * featured_priorityが設定されているタグを取得
 */
export async function findFeaturedTags() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, label, description, featured_priority")
    .not("featured_priority", "is", null)
    .order("featured_priority", { ascending: true });

  if (error) {
    console.error("Failed to fetch featured tags:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 特定タグに紐づく公開済み議案を取得（bill_contents + タグ付き）
 */
export async function findPublishedBillsByTag(
  tagId: string,
  difficultyLevel: DifficultyLevelEnum,
  dietSessionId: string | null
) {
  const supabase = createAdminClient();
  let query = supabase
    .from("bills_tags")
    .select(
      `
      bill_id,
      bills!inner (
        *,
        bill_contents!inner (
          id,
          bill_id,
          title,
          summary,
          content,
          difficulty_level,
          created_at,
          updated_at
        ),
        bills_tags!inner (
          tags (
            id,
            label
          )
        )
      )
    `
    )
    .eq("tag_id", tagId)
    .eq("bills.publish_status", "published")
    .eq("bills.bill_contents.difficulty_level", difficultyLevel);

  if (dietSessionId) {
    query = query.eq("bills.diet_session_id", dietSessionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to fetch bills for tag:`, error);
    return null;
  }

  return data;
}

/**
 * 注目の議案を取得（is_featured = true）
 */
export async function findFeaturedBillsWithContents(
  difficultyLevel: DifficultyLevelEnum,
  dietSessionId: string | null
) {
  const supabase = createAdminClient();
  let query = supabase
    .from("bills")
    .select(
      `
      *,
      bill_contents!inner (
        id,
        bill_id,
        title,
        summary,
        content,
        difficulty_level,
        created_at,
        updated_at
      ),
      tags:bills_tags(
        tag:tags(
          id,
          label
        )
      )
    `
    )
    .eq("is_featured", true)
    .eq("bill_contents.difficulty_level", difficultyLevel)
    .order("submitted_date", { ascending: false, nullsFirst: false });

  if (dietSessionId) {
    query = query.eq("diet_session_id", dietSessionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch featured bills:", error);
    return [];
  }

  return data ?? [];
}

// ============================================================
// Coming Soon
// ============================================================

/**
 * Coming Soon議案を取得
 */
export async function findComingSoonBills(dietSessionId: string | null) {
  const supabase = createAdminClient();
  let query = supabase
    .from("bills")
    .select(
      `
      id,
      name,
      originating_house,
      shugiin_url,
      bill_contents (
        title,
        difficulty_level
      )
    `
    )
    .eq("publish_status", "coming_soon")
    .order("created_at", { ascending: false });

  if (dietSessionId) {
    query = query.eq("diet_session_id", dietSessionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch coming soon bills:", error);
    return [];
  }

  return data ?? [];
}

// ============================================================
// Preview Tokens
// ============================================================

/**
 * プレビュートークンを検証
 */
export async function findPreviewToken(billId: string, token: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("preview_tokens")
    .select("expires_at")
    .eq("bill_id", billId)
    .eq("token", token)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// ============================================================
// Interview Status
// ============================================================

/**
 * 複数のbill_idに対して、公開中のインタビュー設定があるかを一括判定
 *
 * status="public" のみで判定する。論理削除（deleted_at）された設定は
 * 削除時に status="closed" へ変更されるため、ここで自然に除外される
 * （softDeleteInterviewConfigRecord 参照）。
 */
export async function findBillIdsWithPublicInterview(
  billIds: string[]
): Promise<Set<string>> {
  if (billIds.length === 0) {
    return new Set();
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_configs")
    .select("bill_id")
    .in("bill_id", billIds)
    .eq("status", "public");

  if (error) {
    console.error("Failed to fetch interview configs:", error);
    return new Set();
  }

  return new Set(data.map((row) => row.bill_id));
}
