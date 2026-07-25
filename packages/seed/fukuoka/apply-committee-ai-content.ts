/**
 * apply-committee-ai-content.ts（福岡市版）
 *
 * AI生成した「わかりやすい表現」「要約」を委員会議事録に反映する。
 * docs/data/committee-minutes/<年>/ai/<DocumentID>.json を読み、
 * - committee_meetings.summary（会議全体の要約）
 * - committee_meetings.speeches の各セグメントへの simpleText 追記（seqで対応）
 * を更新する（冪等・再実行で上書き）。
 *
 * 重要: パッチファイルの内容はAI生成物のため、ユーザーの確認を得てから実行すること。
 *
 * 使い方:
 *   cd packages/seed
 *   pnpm exec tsx --env-file=../../.env fukuoka/apply-committee-ai-content.ts
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeSimpleTexts } from "./apply-ai-content-utils";
import { createAdminClient } from "../shared/helper";
import type { Segment } from "./parse-committee-minutes";

const TARGET_YEAR = 2026;

const __dirname = dirname(fileURLToPath(import.meta.url));
const AI_DIR = resolve(
  __dirname,
  "../../../docs/data/committee-minutes",
  String(TARGET_YEAR),
  "ai"
);

type AiPatch = {
  documentId: number;
  /** 会議全体の要約（2〜3文） */
  meetingSummary: string;
  /** 発言セグメントごとのわかりやすい表現（seqで対応、noteセグメントは対象外） */
  speechSimpleTexts: { seq: number; simpleText: string }[];
};

async function main(): Promise<void> {
  const supabase = createAdminClient();
  const files = readdirSync(AI_DIR).filter((f) => f.endsWith(".json"));
  console.log(`AIパッチ: ${files.length}件`);

  for (const file of files) {
    const patch: AiPatch = JSON.parse(readFileSync(join(AI_DIR, file), "utf-8"));

    const { data: meeting, error: fetchError } = await supabase
      .from("committee_meetings")
      .select("id, speeches")
      .eq("source_document_id", patch.documentId)
      .single();
    if (fetchError || !meeting) {
      throw new Error(
        `会議が見つかりません (DocumentID=${patch.documentId}): ${fetchError?.message}`
      );
    }

    // セグメントにsimpleTextをseqでマージする（重複・未知seq・被覆漏れを検証）
    const { speeches, warnings } = mergeSimpleTexts(
      meeting.speeches as Segment[],
      patch.speechSimpleTexts
    );
    for (const w of warnings) {
      console.warn(`警告 (DocumentID=${patch.documentId}): ${w}`);
    }

    const { error: updateError } = await supabase
      .from("committee_meetings")
      .update({ summary: patch.meetingSummary, speeches })
      .eq("id", meeting.id);
    if (updateError) {
      throw new Error(
        `会議の更新に失敗 (DocumentID=${patch.documentId}): ${updateError.message}`
      );
    }

    console.log(
      `反映: DocumentID=${patch.documentId}（発言${patch.speechSimpleTexts.length}件）`
    );
  }

  console.log("完了");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
