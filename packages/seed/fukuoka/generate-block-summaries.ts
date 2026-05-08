/**
 * generate-block-summaries.ts
 *
 * 複数トピックを持つ一般質問ブロックに対して、
 * AI生成の block_summary を付与してDBに保存する。
 *
 * 使い方:
 *   SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." \
 *   tsx packages/seed/fukuoka/generate-block-summaries.ts [--dry-run]
 *
 * --dry-run: 対象ブロックを表示するだけでDBを更新しない
 */

import { createAdminClient } from "../shared/helper";
import { callClaudeWithRetry, sleep } from "../shared/claude-cli";

// ---- 型定義 ----

type Topic = {
  title: string;
  question_summary: string;
  answer_summary: string;
  answerer_role: string;
  answerer_name: string;
  block_summary?: string | null;
};

type GeneralQuestion = {
  id: string;
  questioner_name: string;
  questioner_party: string | null;
  topics: Topic[];
};

type Block = {
  questionId: string;
  questionerName: string;
  topics: Topic[];
  firstTopicIndex: number;
};

// ---- カテゴリマップ（buildTopicGroups.tsと同等の簡易版）----

const CATEGORY_MAP: Array<{ label: string; keywords: string[] }> = [
  {
    label: "子育て・教育",
    keywords: ["保育", "子ども", "学校", "育児", "教育", "不登校"],
  },
  {
    label: "健康・医療",
    keywords: ["ワクチン", "医療", "コロナ", "健康", "HPV"],
  },
  {
    label: "防災・安全",
    keywords: [
      "耐震",
      "避難",
      "防災",
      "減災",
      "災害",
      "安全",
      "火災",
      "発令",
      "警報",
      "注意報",
      "林野",
      "プッシュ型",
    ],
  },
  {
    label: "高齢者・福祉",
    keywords: ["高齢者", "移動支援", "福祉", "介護", "障害"],
  },
  {
    label: "交通・まちづくり",
    keywords: ["交通", "道路", "鉄道", "バス", "まちづくり", "再開発"],
  },
  {
    label: "環境・脱炭素",
    keywords: ["太陽光", "環境保全", "脱炭素", "温室効果", "海洋ごみ"],
  },
  {
    label: "スポーツ・文化",
    keywords: ["スポーツ", "スタジアム", "博物館", "公民館"],
  },
  {
    label: "地域・国際交流",
    keywords: ["農業", "観光", "外国人", "動物", "自治会", "漁港"],
  },
];

function assignCategory(topicTitle: string): string {
  for (const cat of CATEGORY_MAP) {
    if (cat.keywords.some((kw) => topicTitle.includes(kw))) {
      return cat.label;
    }
  }
  return "その他";
}

// ---- ブロック特定ロジック（buildTopicGroups.tsと同等）----

function findMultiTopicBlocks(questions: GeneralQuestion[]): Block[] {
  const blocks: Block[] = [];

  for (const q of questions) {
    let currentBlockTopics: Topic[] = [];
    let currentCategory = "";
    let currentFirstIndex = 0;

    for (let i = 0; i < q.topics.length; i++) {
      const t = q.topics[i];
      const category = assignCategory(t.title);

      if (currentBlockTopics.length === 0) {
        // 最初のトピック
        currentBlockTopics = [t];
        currentCategory = category;
        currentFirstIndex = i;
      } else if (category === currentCategory) {
        // 同じカテゴリ -> ブロックを継続
        currentBlockTopics.push(t);
      } else {
        // カテゴリが変わった -> 前のブロックを確定
        if (currentBlockTopics.length >= 2) {
          blocks.push({
            questionId: q.id,
            questionerName: q.questioner_name,
            topics: currentBlockTopics,
            firstTopicIndex: currentFirstIndex,
          });
        }
        // 新しいブロックを開始
        currentBlockTopics = [t];
        currentCategory = category;
        currentFirstIndex = i;
      }
    }

    // 最後のブロックを確定
    if (currentBlockTopics.length >= 2) {
      blocks.push({
        questionId: q.id,
        questionerName: q.questioner_name,
        topics: currentBlockTopics,
        firstTopicIndex: currentFirstIndex,
      });
    }
  }

  return blocks;
}

// ---- プロンプト生成 ----

function buildPrompt(
  questionerName: string,
  topics: Topic[]
): string {
  const topicList = topics
    .map(
      (t, i) =>
        `【${i + 1}件目】タイトル: ${t.title}\n質問: ${t.question_summary}\n答弁: ${t.answer_summary}`
    )
    .join("\n\n");

  return `あなたは市議会の議事録を市民向けに整理する専門家です。
以下は福岡市議会で${questionerName}議員が行った一般質問のうち、同じテーマで連続して行われた${topics.length}件のやりとりです。

このやりとり全体を通じて「市がどう答えたか」を市民向けに80字以内でひとことで要約してください。
個別トピックに限定せず、ブロック全体で何が明らかになったかを反映してください。

${topicList}

出力は要約文のみ。JSON不要。前置き不要。`;
}

// ---- メイン ----

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  const supabase = createAdminClient();

  console.log("一般質問データを取得中...");

  // 公開済み一般質問を全件取得
  const { data: questions, error } = await supabase
    .from("general_questions")
    .select("id, questioner_name, questioner_party, topics")
    .eq("publish_status", "published")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("DB取得エラー:", error.message);
    process.exit(1);
  }

  console.log(`取得件数: ${questions.length}件`);

  // 複数トピックブロックを特定
  const allBlocks = findMultiTopicBlocks(questions as GeneralQuestion[]);
  console.log(`複数トピックブロック: ${allBlocks.length}件`);

  // block_summary 未設定（nullまたは空文字）のブロックのみ抽出（冪等性）
  const targetBlocks = allBlocks.filter((block) => {
    const firstTopic = block.topics[0];
    return !firstTopic.block_summary || firstTopic.block_summary.trim() === "";
  });

  console.log(`block_summary 未設定: ${targetBlocks.length}件\n`);

  if (targetBlocks.length === 0) {
    console.log("対象ブロックなし。終了します。");
    return;
  }

  // ドライランの場合は対象を表示して終了
  if (dryRun) {
    console.log("=== ドライラン: 対象ブロック一覧 ===\n");
    for (const block of targetBlocks) {
      console.log(`質問者: ${block.questionerName}`);
      console.log(`質問ID: ${block.questionId}`);
      console.log(`最初のトピックインデックス: ${block.firstTopicIndex}`);
      console.log(`トピック数: ${block.topics.length}`);
      for (const t of block.topics) {
        console.log(`  - ${t.title}`);
      }
      console.log();
    }
    console.log(`合計 ${targetBlocks.length} ブロックに block_summary を生成予定`);
    return;
  }

  // 各ブロックに対してblock_summaryを生成・保存
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < targetBlocks.length; i++) {
    const block = targetBlocks[i];
    console.log(
      `\n[${i + 1}/${targetBlocks.length}] ${block.questionerName} (${block.topics.length}件)`
    );
    for (const t of block.topics) {
      console.log(`  - ${t.title}`);
    }

    const prompt = buildPrompt(block.questionerName, block.topics);

    console.log("  AI生成中...");
    try {
      const raw = await callClaudeWithRetry(prompt);
      const summary = raw.trim().replace(/^[「『""]|[」』""]$/g, "").trim();

      console.log(`  生成された要約: 「${summary}」`);

      // DBからトピックを取得して更新
      const { data: questionData, error: fetchError } = await supabase
        .from("general_questions")
        .select("topics")
        .eq("id", block.questionId)
        .single();

      if (fetchError || !questionData) {
        console.error(`  DB取得エラー: ${fetchError?.message ?? "データなし"}`);
        errorCount++;
        continue;
      }

      const topics = questionData.topics as Topic[];
      topics[block.firstTopicIndex] = {
        ...topics[block.firstTopicIndex],
        block_summary: summary,
      };

      const { error: updateError } = await supabase
        .from("general_questions")
        .update({ topics })
        .eq("id", block.questionId);

      if (updateError) {
        console.error(`  DB更新エラー: ${updateError.message}`);
        errorCount++;
      } else {
        console.log("  DB更新完了");
        successCount++;
      }
    } catch (err) {
      console.error(`  AI生成失敗: ${err}`);
      errorCount++;
    }

    // Claude呼び出し間に待機
    if (i < targetBlocks.length - 1) await sleep(10000);
  }

  console.log(
    `\n完了: ${successCount}件成功, ${errorCount}件エラー`
  );
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
