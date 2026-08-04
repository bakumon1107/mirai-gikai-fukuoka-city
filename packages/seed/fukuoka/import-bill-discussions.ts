/**
 * import-bill-discussions.ts
 *
 * 議案質疑（定例会第１日）を bill_discussions に取り込み、
 * 議案カードの「議会での審議」欄に表示する総論を bills.discussion_overview_points に反映する。
 *
 * 質疑本文は会議録アーカイブ（docs/fukuoka/meeting-minutes/）から行番号で切り出すため、
 * このリポジトリにテキストを二重に持たない。要約・答弁者・行範囲は JSON 側で管理する。
 *
 * 実行方法:
 *   pnpm --filter @mirai-gikai/seed exec tsx --env-file=../../.env.production \
 *     fukuoka/import-bill-discussions.ts fukuoka/bill-discussions-r8-3.json [--dry-run]
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { createAdminClient } from "../shared/helper";
import { extractLineRanges, type LineRange } from "./extract-speech";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

type OverviewEntry = {
  billNumbers: string[];
  points: string[];
};

type DiscussionEntry = {
  billNumbers: string[];
  questionerName: string;
  questionerNumber: string;
  questionerParty: string | null;
  answererRole: string;
  exchangeCount: number;
  questionSummary: string;
  answerSummary: string;
  questionLines: LineRange[];
  answerLines: LineRange[];
};

type DiscussionFile = {
  councilSessionSlug: string;
  sessionDay: number;
  minutesFile: string;
  sourceUrl: string;
  overviewPoints: OverviewEntry[];
  discussions: DiscussionEntry[];
};

async function main() {
  const [dataArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const isDryRun = process.argv.includes("--dry-run");

  if (!dataArg) {
    console.error(
      "❌ 取り込むJSONファイルを指定してください（例: fukuoka/bill-discussions-r8-3.json）"
    );
    process.exit(1);
  }

  const dataPath = path.resolve(process.cwd(), dataArg);
  const data: DiscussionFile = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const minutesPath = path.resolve(REPO_ROOT, data.minutesFile);
  if (!fs.existsSync(minutesPath)) {
    console.error(`❌ 会議録が見つかりません: ${minutesPath}`);
    process.exit(1);
  }
  const minutesLines = fs.readFileSync(minutesPath, "utf-8").split("\n");

  console.log(
    isDryRun ? "🔍 DRY RUN モード（DB更新なし）" : "🚀 議案質疑の取り込み開始"
  );
  console.log(`📄 会議録: ${data.minutesFile}（${minutesLines.length}行）`);

  const supabase = createAdminClient();

  const { data: session, error: sessionError } = await supabase
    .from("council_sessions")
    .select("id, name")
    .eq("slug", data.councilSessionSlug)
    .single();

  if (sessionError || !session) {
    console.error(
      `❌ 会期が見つかりません: ${data.councilSessionSlug}（${sessionError?.message}）`
    );
    process.exit(1);
  }
  console.log(`🗓️  会期: ${session.name}`);

  const { data: bills, error: billsError } = await supabase
    .from("bills")
    .select("id, bill_number")
    .eq("council_session_id", session.id);

  if (billsError) {
    console.error(`❌ bills取得エラー: ${billsError.message}`);
    process.exit(1);
  }

  const billMap = new Map(
    (bills ?? [])
      .filter((b): b is typeof b & { bill_number: string } =>
        Boolean(b.bill_number)
      )
      .map((b) => [b.bill_number, b.id])
  );

  /** 議案番号をIDに解決する。未登録があれば取り違えの可能性が高いので中断する */
  function resolveBillIds(billNumbers: string[]): string[] {
    return billNumbers.map((num) => {
      const id = billMap.get(num);
      if (!id) {
        console.error(`❌ 議案が見つかりません: ${num}`);
        process.exit(1);
      }
      return id;
    });
  }

  let discussionCount = 0;

  for (const entry of data.discussions) {
    const questionRaw = extractLineRanges(minutesLines, entry.questionLines);
    const answerRaw = extractLineRanges(minutesLines, entry.answerLines);
    const billIds = resolveBillIds(entry.billNumbers);

    console.log(
      `\n${entry.questionerName}（${entry.questionerNumber}番）→ ${entry.billNumbers.join("、")}`
    );
    console.log(
      `  質問 ${questionRaw.length}字 / 答弁 ${answerRaw.length}字 / 答弁者: ${entry.answererRole}`
    );

    for (const billId of billIds) {
      const record = {
        bill_id: billId,
        session_day: data.sessionDay,
        questioner_name: entry.questionerName,
        questioner_number: entry.questionerNumber,
        questioner_party: entry.questionerParty,
        question_summary: entry.questionSummary,
        question_raw: questionRaw,
        // 答弁者が複数の場合、役職と氏名を別フィールドに分けるとUIで
        // 「局長A・局長B・氏名A・氏名B」と並んでしまうため role 側にまとめる
        answerer_role: entry.answererRole,
        answerer_name: null,
        answer_summary: entry.answerSummary,
        answer_raw: answerRaw,
        exchange_count: entry.exchangeCount,
      };

      if (isDryRun) {
        discussionCount++;
        continue;
      }

      const { error } = await supabase
        .from("bill_discussions")
        .upsert(record, { onConflict: "bill_id,questioner_name" });

      if (error) {
        console.error(`  ❌ upsertエラー: ${error.message}`);
        process.exit(1);
      }
      discussionCount++;
    }
  }

  let overviewCount = 0;

  for (const entry of data.overviewPoints) {
    const billIds = resolveBillIds(entry.billNumbers);

    for (const billId of billIds) {
      if (isDryRun) {
        overviewCount++;
        continue;
      }

      const { error } = await supabase
        .from("bills")
        .update({ discussion_overview_points: entry.points })
        .eq("id", billId);

      if (error) {
        console.error(`  ❌ 総論の更新エラー: ${error.message}`);
        process.exit(1);
      }
      overviewCount++;
    }
  }

  console.log("\n🎉 完了");
  console.log(`  bill_discussions: ${discussionCount} 件`);
  console.log(`  discussion_overview_points: ${overviewCount} 議案`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
