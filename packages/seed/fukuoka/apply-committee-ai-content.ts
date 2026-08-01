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
  /**
   * 発言セグメントごとのわかりやすい表現（seqで対応、noteセグメントは対象外）。
   * トピックのみ生成した文書では省略・空配列でよい。
   */
  speechSimpleTexts?: { seq: number; simpleText: string }[];
  /**
   * 議題（トピック）分割。市の議事録は議題マーカーが無いため境界もAIで判定する。
   * startSeq/endSeq は CommitteeSpeech.seq（会議全体の発言連番）を指し、
   * committee_meeting_topics.start_voice_no/end_voice_no にそのまま格納する。
   * 省略された文書はトピック未生成として扱い、summary/speeches のみ更新する。
   */
  topics?: {
    topicOrder: number;
    title: string;
    summary: string;
    startSeq: number;
    endSeq: number;
  }[];
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

    // わかりやすい表現（simpleText）が生成済みの場合のみ、seqでマージする。
    // トピックのみ生成した文書（simpleText未生成）は speeches を変更しない。
    const update: { summary: string; speeches?: Segment[] } = {
      summary: patch.meetingSummary,
    };
    if (patch.speechSimpleTexts && patch.speechSimpleTexts.length > 0) {
      const { speeches, warnings } = mergeSimpleTexts(
        meeting.speeches as Segment[],
        patch.speechSimpleTexts
      );
      for (const w of warnings) {
        console.warn(`警告 (DocumentID=${patch.documentId}): ${w}`);
      }
      update.speeches = speeches;
    }

    const { error: updateError } = await supabase
      .from("committee_meetings")
      .update(update)
      .eq("id", meeting.id);
    if (updateError) {
      throw new Error(
        `会議の更新に失敗 (DocumentID=${patch.documentId}): ${updateError.message}`
      );
    }

    // トピックは毎回すべて置き換える（冪等）。既存を全削除してから挿入する。
    if (patch.topics) {
      const { error: deleteError } = await supabase
        .from("committee_meeting_topics")
        .delete()
        .eq("meeting_id", meeting.id);
      if (deleteError) {
        throw new Error(
          `議題の削除に失敗 (DocumentID=${patch.documentId}): ${deleteError.message}`
        );
      }
      if (patch.topics.length > 0) {
        const rows = patch.topics.map((t) => ({
          meeting_id: meeting.id,
          topic_order: t.topicOrder,
          title: t.title,
          summary: t.summary,
          discussion_summary: null,
          start_voice_no: t.startSeq,
          end_voice_no: t.endSeq,
        }));
        const { error: insertError } = await supabase
          .from("committee_meeting_topics")
          .insert(rows);
        if (insertError) {
          throw new Error(
            `議題の挿入に失敗 (DocumentID=${patch.documentId}): ${insertError.message}`
          );
        }
      }
    }

    console.log(
      `反映: DocumentID=${patch.documentId}（発言${patch.speechSimpleTexts?.length ?? 0}件` +
        (patch.topics ? `・議題${patch.topics.length}件` : "") +
        `）`
    );
  }

  console.log("完了");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
