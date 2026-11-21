/**
 * import-bill-discussions.ts
 *
 * 議案質疑（定例会第１日）を bill_discussions に取り込み、
 * 議案カードの「議会での審議」欄に表示する総論を bills.discussion_overview_points に反映する。
 *
 * 質疑本文は会議録の全文テキストから行番号で切り出す。全文はリポジトリに置かず、
 * 取り込み時にだけ手元に用意して `--minutes` で渡す（取得・テキスト化は update-bills スキル参照）。
 * 要約・答弁者・行範囲は JSON 側で管理する。
 *
 * 実行方法:
 *   pnpm --filter @mirai-gikai/seed exec tsx --env-file=../../.env.production \
 *     fukuoka/import-bill-discussions.ts fukuoka/bill-discussions-r8-4.json \
 *     --minutes <会議録テキストのパス> [--dry-run]
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { createAdminClient } from "../shared/helper";
import {
  extractLineRanges,
  findSpeakerMismatches,
  type LineRange,
} from "./extract-speech";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../.."
);

/**
 * 会議録のパスを解決する。pnpm exec は packages/seed で実行されるため、
 * 相対パスはカレントディレクトリで見つからなければリポジトリルート基準でも探す。
 */
function resolveMinutesPath(p: string): string | null {
  const candidates = path.isAbsolute(p)
    ? [p]
    : [path.resolve(process.cwd(), p), path.resolve(REPO_ROOT, p)];
  return candidates.find((c) => fs.existsSync(c)) ?? null;
}

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

type DiscussionRecord = {
  bill_id: string;
  session_day: number;
  questioner_name: string;
  questioner_number: string;
  questioner_party: string | null;
  question_summary: string;
  question_raw: string;
  answerer_role: string;
  answerer_name: null;
  answer_summary: string;
  answer_raw: string;
  exchange_count: number;
};

type DiscussionFile = {
  councilSessionSlug: string;
  sessionDay: number;
  sourceUrl: string;
  overviewPoints: OverviewEntry[];
  discussions: DiscussionEntry[];
};

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      minutes: { type: "string" },
      "dry-run": { type: "boolean", default: false },
    },
  });
  const [dataArg] = positionals;
  const isDryRun = values["dry-run"];

  if (!dataArg || !values.minutes) {
    console.error(
      "❌ 取り込むJSONと会議録テキストを指定してください（例: fukuoka/bill-discussions-r8-4.json --minutes docs/fukuoka/meeting-minutes/令和８年第４回定例会/2026-09-02_1日目.txt）"
    );
    process.exit(1);
  }

  const dataPath = path.resolve(process.cwd(), dataArg);
  const data: DiscussionFile = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const minutesPath = resolveMinutesPath(values.minutes);
  if (!minutesPath) {
    console.error(`❌ 会議録が見つかりません: ${values.minutes}`);
    process.exit(1);
  }
  const minutesLines = fs.readFileSync(minutesPath, "utf-8").split(/\r?\n/);

  console.log(
    isDryRun ? "🔍 DRY RUN モード（DB更新なし）" : "🚀 議案質疑の取り込み開始"
  );
  console.log(
    `📄 会議録: ${path.basename(minutesPath)}（${minutesLines.length}行）`
  );
  console.log(`🔗 出典: ${data.sourceUrl}`);

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

  const errors: string[] = [];

  /** 議案番号をIDに解決する。未登録は取り違えの可能性が高いので後でまとめて中断する */
  function resolveBillIds(billNumbers: string[], context: string): string[] {
    const ids: string[] = [];
    for (const num of billNumbers) {
      const id = billMap.get(num);
      if (id) {
        ids.push(id);
      } else {
        errors.push(`議案が見つかりません: ${num}（${context}）`);
      }
    }
    return ids;
  }

  // 検証エラー（議案番号・行範囲・発言者の不一致）で途中まで書き込まないよう、
  // 書き込む前に全レコードを組み立てて検証する。
  // 書き込み自体はトランザクションではないため、通信エラー等で途中失敗した場合は
  // 再実行すること（upsert / update なので同じ内容で上書きされ、整合した状態に戻る）
  const discussionRecords: { billNumber: string; record: DiscussionRecord }[] =
    [];
  const seenKeys = new Set<string>();

  for (const entry of data.discussions) {
    const context = `${entry.questionerName}`;
    let questionRaw = "";
    let answerRaw = "";

    try {
      questionRaw = extractLineRanges(minutesLines, entry.questionLines);
      answerRaw = extractLineRanges(minutesLines, entry.answerLines);
    } catch (e) {
      errors.push(`${context}: ${(e as Error).message}`);
      continue;
    }

    // 会議録の取り違え・行ずれで別人の発言を取り込まないよう、範囲内の発言者を照合する
    const speakerErrors = [
      ...findSpeakerMismatches(
        minutesLines,
        entry.questionLines,
        entry.questionerName
      ),
      ...findSpeakerMismatches(
        minutesLines,
        entry.answerLines,
        entry.answererRole
      ),
    ];
    if (speakerErrors.length > 0) {
      errors.push(...speakerErrors.map((m) => `${context}: ${m}`));
      continue;
    }

    const billIds = resolveBillIds(entry.billNumbers, context);

    console.log(
      `\n${entry.questionerName}（${entry.questionerNumber}番）→ ${entry.billNumbers.join("、")}`
    );
    console.log(
      `  質問 ${questionRaw.length}字 / 答弁 ${answerRaw.length}字 / 答弁者: ${entry.answererRole}`
    );

    billIds.forEach((billId, i) => {
      const key = `${billId}\u0000${entry.questionerName}`;
      if (seenKeys.has(key)) {
        errors.push(
          `同じ議案・質問者の重複: ${entry.billNumbers[i]} / ${entry.questionerName}`
        );
        return;
      }
      seenKeys.add(key);

      discussionRecords.push({
        billNumber: entry.billNumbers[i],
        record: {
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
        },
      });
    });
  }

  const overviewUpdates: { billId: string; points: string[] }[] = [];

  for (const entry of data.overviewPoints) {
    const billIds = resolveBillIds(entry.billNumbers, "総論");
    for (const billId of billIds) {
      overviewUpdates.push({ billId, points: entry.points });
    }
  }

  if (errors.length > 0) {
    console.error("\n❌ 検証に失敗したため取り込みを中止します");
    for (const message of errors) {
      console.error(`  - ${message}`);
    }
    process.exit(1);
  }

  if (!isDryRun) {
    for (const { billNumber, record } of discussionRecords) {
      const { error } = await supabase
        .from("bill_discussions")
        .upsert(record, { onConflict: "bill_id,questioner_name" });

      if (error) {
        console.error(`❌ ${billNumber} のupsertエラー: ${error.message}`);
        process.exit(1);
      }
    }

    for (const { billId, points } of overviewUpdates) {
      const { error } = await supabase
        .from("bills")
        .update({ discussion_overview_points: points })
        .eq("id", billId);

      if (error) {
        console.error(`❌ 総論の更新エラー: ${error.message}`);
        process.exit(1);
      }
    }
  }

  console.log(isDryRun ? "\n✅ 検証OK（DB更新なし）" : "\n🎉 完了");
  console.log(`  bill_discussions: ${discussionRecords.length} 件`);
  console.log(`  discussion_overview_points: ${overviewUpdates.length} 議案`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
