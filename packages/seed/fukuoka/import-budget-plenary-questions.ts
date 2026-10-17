/**
 * import-budget-plenary-questions.ts（福岡市版）
 *
 * 条例予算特別委員会の総会（slug: yosan）の議事録を、質問者ブロック単位で
 * general_questions に取り込む（question_type = 'budget_plenary'）。
 *
 * 総会の記録は本会議の一般質問と同じ構造（発言者名つき・質問者ごとのブロック・
 * 局長級の答弁）を持つため、匿名前提の committee_meetings では発言者名・会派・
 * 答弁者の役職を構造として保持できない。そのためこちらに取り込む。
 *
 * 入力:
 *   docs/data/budget-plenary/<年>/<開催日>_yosan_<DocumentID>.json  ← スクレイパー出力
 *   docs/data/budget-plenary/<年>/ai/<DocumentID>.json              ← AI生成（要約・トピック）
 *
 * 使い方:
 *   cd packages/seed
 *   pnpm exec tsx --env-file=../../.env fukuoka/import-budget-plenary-questions.ts
 *
 * - 同じ会期・区分・日次の既存行を削除してから入れ直すため、再実行は冪等
 * - 表示側は question_type='general' に絞っているため、取り込んでも
 *   一般質問のページ・検索結果には現れない
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createAdminClient } from "../shared/helper";
import type { Segment } from "./parse-committee-minutes";
import { buildBlockRawText, splitIntoBlocks } from "./parse-budget-plenary";

const TARGET_YEAR = 2026;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(
  __dirname,
  "../../../docs/data/budget-plenary",
  String(TARGET_YEAR)
);

/** スクレイパー出力のシェイプ（必要な部分だけ） */
type PlenaryJson = {
  documentId: number;
  title: string;
  meetingDate: string;
  segmentCount: number;
  speeches: Segment[];
};

/** AI生成ファイルのシェイプ */
type AiTopic = {
  title: string;
  question_summary: string;
  answer_summary: string;
  answerer_role: string;
  answerer_name: string;
};

type AiBlock = {
  startSeq: number;
  endSeq: number;
  questioner: string;
  summary: string;
  topics: AiTopic[];
};

type AiFile = {
  documentId: number;
  /** 紐付ける会期の slug（例: r8-1） */
  councilSessionSlug: string;
  /** 総会の日次（1日目=1）。general_questions.session_day に入る */
  sessionDay: number;
  blocks: AiBlock[];
};

async function main(): Promise<void> {
  const supabase = createAdminClient();

  const files = readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
  console.log(`対象ファイル: ${files.length}件`);

  let inserted = 0;

  for (const file of files) {
    const src: PlenaryJson = JSON.parse(
      readFileSync(join(DATA_DIR, file), "utf-8")
    );
    const aiPath = join(DATA_DIR, "ai", `${src.documentId}.json`);
    if (!existsSync(aiPath)) {
      console.log(`スキップ（AI生成なし）: ${file}`);
      continue;
    }
    const ai: AiFile = JSON.parse(readFileSync(aiPath, "utf-8"));

    const blocks = splitIntoBlocks(src.speeches);

    // AI生成の範囲が実データのブロックと一致しているか検証する
    if (ai.blocks.length !== blocks.length) {
      throw new Error(
        `ブロック数が一致しません (${file}): 実データ${blocks.length} / AI${ai.blocks.length}`
      );
    }
    for (const [i, b] of blocks.entries()) {
      const a = ai.blocks[i];
      if (a.startSeq !== b.startSeq || a.endSeq !== b.endSeq) {
        throw new Error(
          `ブロックの範囲が一致しません (${file} ${i + 1}番目): ` +
            `実データ seq${b.startSeq}-${b.endSeq} / AI seq${a.startSeq}-${a.endSeq}`
        );
      }
      if (a.questioner !== b.questionerName) {
        throw new Error(
          `質問者が一致しません (${file} seq${b.startSeq}): ` +
            `実データ${b.questionerName} / AI${a.questioner}`
        );
      }
      if (a.topics.length === 0) {
        throw new Error(`トピックが空です (${file} seq${b.startSeq})`);
      }
    }

    const { data: session, error: sessionError } = await supabase
      .from("council_sessions")
      .select("id, name")
      .eq("slug", ai.councilSessionSlug)
      .maybeSingle();
    if (sessionError) throw new Error(sessionError.message);
    if (!session) {
      throw new Error(`会期が見つかりません: ${ai.councilSessionSlug}`);
    }

    // 同じ会期・区分・日次を入れ直す（冪等）
    const { error: deleteError } = await supabase
      .from("general_questions")
      .delete()
      .eq("council_session_id", session.id)
      .eq("question_type", "budget_plenary")
      .eq("session_day", ai.sessionDay);
    if (deleteError) {
      throw new Error(`既存行の削除に失敗 (${file}): ${deleteError.message}`);
    }

    const rows = blocks.map((b, i) => ({
      council_session_id: session.id,
      question_type: "budget_plenary",
      questioner_name: b.questionerName,
      questioner_party: b.party,
      questioner_number: null,
      session_day: ai.sessionDay,
      question_order: i + 1,
      summary: ai.blocks[i].summary,
      topics: ai.blocks[i].topics,
      raw_text: buildBlockRawText(b),
      // 会議録検索システムのDocumentIDは随時振り直されるため直リンクは持たせない
      source_url: null,
      // 公式会議録の原文とユーザー確認済みのAI生成テキストのため公開扱い
      publish_status: "published",
    }));

    const { error: insertError } = await supabase
      .from("general_questions")
      .insert(rows);
    if (insertError) {
      throw new Error(`投入に失敗 (${file}): ${insertError.message}`);
    }

    inserted += rows.length;
    console.log(
      `投入: ${file}（${session.name} ${ai.sessionDay}日目 / ${rows.length}ブロック）`
    );
  }

  console.log(`完了: ${inserted}ブロックを投入`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
