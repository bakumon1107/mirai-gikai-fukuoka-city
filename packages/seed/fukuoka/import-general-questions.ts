/**
 * import-general-questions.ts
 *
 * AI構造化済みの一般質問データをSupabaseにUPSERTする。
 *
 * 使い方:
 *   SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." \
 *   tsx packages/seed/fukuoka/import-general-questions.ts <session-slug>
 *
 * 前提:
 *   - generate-general-questions.ts で output/<slug>-questions.json が生成済み
 *   - council_sessions に対象会期が登録済みであること
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { createAdminClient } from "../shared/helper";
import type { GeneratedQuestion } from "./generate-general-questions";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  const sessionSlug = args[0];

  if (!sessionSlug) {
    console.error("Usage: tsx import-general-questions.ts <session-slug>");
    process.exit(1);
  }

  const outputDir = path.join(__dirname, "output");
  const inputPath = path.join(outputDir, `${sessionSlug}-questions.json`);

  if (!fs.existsSync(inputPath)) {
    console.error(`生成済みJSON が見つかりません: ${inputPath}`);
    console.error("先に generate-general-questions.ts を実行してください。");
    process.exit(1);
  }

  const questions: GeneratedQuestion[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  console.log(`\n会期: ${sessionSlug}`);
  console.log(`件数: ${questions.length}件\n`);

  const supabase = createAdminClient();

  // 会期ID取得
  const { data: session } = await supabase
    .from("council_sessions")
    .select("id")
    .eq("slug", sessionSlug)
    .single();

  if (!session) {
    console.error(`会期が見つかりません: ${sessionSlug}`);
    process.exit(1);
  }

  console.log(`会期ID: ${session.id}`);

  let successCount = 0;
  let errorCount = 0;

  for (const q of questions) {
    const record = {
      council_session_id: session.id,
      questioner_name: q.questionerName,
      questioner_party: q.questionerParty,
      questioner_number: q.questionerNumber,
      session_day: q.sessionDay,
      question_order: q.questionOrder,
      summary: q.summary,
      topics: q.topics,
      raw_text: q.rawText,
      source_url: q.sourceUrl,
      publish_status: "draft" as const,
    };

    // UPSERT: 同一会期・日・順番・質問者名で重複排除
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("general_questions")
      .upsert(record, {
        onConflict: "council_session_id,session_day,question_order",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error(`  ❌ ${q.questionerName}: ${error.message}`);
      errorCount++;
    } else {
      console.log(`  ✅ ${q.sessionDay}日${q.questionOrder}番 ${q.questionerName}`);
      successCount++;
    }
  }

  console.log(`\n完了: ${successCount}件登録, ${errorCount}件エラー`);
  console.log("publish_status は 'draft' で登録されました。Admin画面で確認・公開してください。");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
