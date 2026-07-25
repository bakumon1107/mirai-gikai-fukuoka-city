/**
 * seed-committee-meetings.ts（福岡市版）
 *
 * スクレイパーが保存した委員会議事録JSON（docs/data/committee-minutes/<年>/）を
 * committee_meetings に投入する。
 *
 * - 会議録の原文・発言セグメントのみを投入する（AI生成なし）
 * - AI要約（summary）は確認後に apply-committee-ai-content.ts で更新する
 * - source_document_id で既存行を確認し、登録済みの会議はスキップする
 * - 市の議事録には委員長の議題宣言が無いため議題（committee_meeting_topics）は作らない
 *
 * 使い方:
 *   cd packages/seed
 *   npx tsx --env-file=../../.env fukuoka/seed-committee-meetings.ts
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createAdminClient } from "../shared/helper";
import type { Segment } from "./parse-committee-minutes";

const TARGET_YEAR = 2026;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(
  __dirname,
  "../../../docs/data/committee-minutes",
  String(TARGET_YEAR)
);

/** スクレイパーが出力するJSONのシェイプ */
type MeetingJson = {
  documentId: number;
  title: string;
  committee: {
    dbsrName: string;
    currentName: string;
    slug: string;
    type: string;
  };
  meetingDate: string;
  sourceUrl: string;
  scrapedAt: string;
  segmentCount: number;
  speeches: Segment[];
  rawText: string;
};

async function main(): Promise<void> {
  const supabase = createAdminClient();

  const files = readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
  console.log(`対象ファイル: ${files.length}件`);

  let inserted = 0;
  let skipped = 0;

  for (const file of files) {
    const meeting: MeetingJson = JSON.parse(
      readFileSync(join(DATA_DIR, file), "utf-8")
    );

    const { data: existing, error: existingError } = await supabase
      .from("committee_meetings")
      .select("id")
      .eq("source_document_id", meeting.documentId)
      .maybeSingle();
    if (existingError) {
      throw new Error(`既存確認に失敗 (${file}): ${existingError.message}`);
    }
    if (existing) {
      skipped++;
      continue;
    }

    const { error: meetingError } = await supabase
      .from("committee_meetings")
      .insert({
        committee_name: meeting.committee.currentName,
        committee_slug: meeting.committee.slug,
        committee_type: meeting.committee.type,
        meeting_date: meeting.meetingDate,
        title: meeting.title,
        source_document_id: meeting.documentId,
        source_url: meeting.sourceUrl,
        speeches: meeting.speeches,
        raw_text: meeting.rawText,
        publish_status: "draft",
      });
    if (meetingError) {
      throw new Error(`会議の投入に失敗 (${file}): ${meetingError.message}`);
    }

    inserted++;
    console.log(`投入: ${file}（${meeting.speeches.length}セグメント）`);
  }

  console.log(
    `完了: 会議${inserted}件投入 / スキップ（登録済み）${skipped}件`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
