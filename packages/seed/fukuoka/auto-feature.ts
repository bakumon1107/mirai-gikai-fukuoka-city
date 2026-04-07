/**
 * auto-feature.ts
 *
 * 議案の概要をAIで評価し、市民影響度が高い議案に is_featured = true を設定する。
 *
 * 評価指標（100点満点）:
 *   - 市民への直接影響範囲 (45点): 広く市民全体に影響するか
 *   - 生活への具体的変化  (35点): 日常生活・家計・サービスが変わるか
 *   - 話題性・関心度      (20点): 子育て・医療・福祉・防災等の関心が高いテーマか
 *
 * 閾値: 70点以上 → is_featured = true（全体の 5〜10件 程度を想定）
 *
 * 除外ルール（スコアに関係なく注目対象外）:
 *   - 予算補正のみ（条例改正なし）
 *   - 職員給与・定数・手当の内部調整
 *   - 和解・契約締結のみの議案
 *   - 法令改正に伴う形式的な整備
 *
 * 使い方:
 *   tsx --env-file=../../.env fukuoka/auto-feature.ts [会期slug]
 *   例: tsx --env-file=../../.env fukuoka/auto-feature.ts r8-1
 *
 *   --dry-run オプションで実際のDB更新をせずスコアのみ確認可能:
 *   tsx --env-file=../../.env fukuoka/auto-feature.ts r8-1 --dry-run
 */

import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { createAdminClient } from "../shared/helper";

// ---- 設定 ----

const FEATURE_THRESHOLD = 75;
const CLAUDE_PATH = process.env.CLAUDE_CLI_PATH || "claude";

// ---- 型定義 ----

type BillForEval = {
  id: string;
  bill_number: string;
  name: string;
  title: string;
  summary: string;
  content: string;
};

type EvalResult = {
  bill_number: string;
  score: number;
  excluded: boolean;
  reason: string;
  breakdown: {
    influence_range: number;
    life_impact: number;
    interest: number;
  };
};

// ---- Claude CLI 呼び出し ----

function callClaude(prompt: string): string {
  const tmpFile = path.join(os.tmpdir(), `auto-feature-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, prompt, "utf-8");

  try {
    const env = { ...process.env };
    delete env.CLAUDECODE;
    delete env.CLAUDE_CODE;

    const result = execSync(
      `"${CLAUDE_PATH}" --dangerously-skip-permissions -p "$(cat ${tmpFile})"`,
      {
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
        env,
        shell: "/bin/bash",
      }
    );
    return result.trim();
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

// ---- 評価プロンプト ----

function buildEvalPrompt(bills: BillForEval[]): string {
  const billsText = bills
    .map(
      (b) =>
        `【${b.bill_number}】${b.name}\nタイトル: ${b.title}\n概要: ${b.summary}\n本文:\n${b.content.slice(0, 800)}`
    )
    .join("\n\n---\n\n");

  return `あなたは福岡市議会の議案を市民目線で評価する専門家です。
以下の議案それぞれについて、市民への影響度を評価してください。

## 【最優先】除外判定
**以下に該当する場合は、議案の内容に関わらず必ず excluded: true、score: 0 にしてください。**
評価基準より優先されます。内容がどれだけ市民に関係していても除外です。

- 議案名に「予算案」「補正予算」が含まれるもの（一般会計・特別会計・企業会計すべて）
- 議案名に「給与」「手当」「定数」が含まれるもの（職員の内部調整）
- 議案名に「外部監査」が含まれるもの

## 評価基準（100点満点）
※上記の除外対象でない議案のみ評価してください。

### 1. 市民への直接影響範囲（45点満点）
- 45点: 福岡市民全体に広く影響する（医療・福祉・教育・交通・税など）
- 30点: 特定の世代や状況の市民に影響する（子育て世代、高齢者、障害者など）
- 15点: 一部の市民・事業者に影響する
- 0点:  市役所内部や特定業者のみ、一般市民への影響がほぼない

### 2. 生活への具体的変化（35点満点）
高く評価するのは「市民自身の」行動・選択肢・費用・受けられるサービスが変わる場合。
行政や業者・専門職の手続きや権限が変わるだけで、市民の日常に変化が生じない場合は低く評価すること。

- 35点: 市民自身の家計・日常生活に直接的・具体的な変化をもたらす
- 20点: 市民が受けられるサービスや手続きに変化が生じる
- 10点: 市民生活に間接的に影響する可能性がある
-  0点: 行政・業者・専門職側の手続きや権限・体制が変わるだけで、
        市民自身の行動・生活は変わらない
        （例：「〜できるようにする」「体制を整備する」「公表する」が行政側の話の場合）

### 3. 話題性・関心度（20点満点）
- 20点: 子育て・医療・防災・環境・貧困支援など市民関心が高いテーマ
- 10点: 都市整備・産業・交通など一定の関心があるテーマ
- 0点:  行政内部の手続き・人事・会計処理など関心が低いテーマ

## 補足除外ルール
以下も excluded: true にしてください：
- 法令改正に伴う形式的な規定整備のみの議案

## 出力形式
必ずJSON配列のみを出力してください。説明文は不要です。

\`\`\`json
[
  {
    "bill_number": "第〇号",
    "breakdown": {
      "influence_range": <0-45の整数>,
      "life_impact": <0-35の整数>,
      "interest": <0-20の整数>
    },
    "score": <合計点>,
    "excluded": <true|false>,
    "reason": "<50文字以内で評価理由>"
  }
]
\`\`\`

## 評価対象議案

${billsText}`;
}

// ---- JSON抽出 ----

function extractJson(text: string): EvalResult[] {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (match) {
    return JSON.parse(match[1]);
  }
  // コードブロックなしの場合
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return JSON.parse(arrayMatch[0]);
  }
  throw new Error("JSON が見つかりませんでした");
}

// ---- メイン ----

async function main() {
  const slug = process.argv[2] || "r8-1";
  const isDryRun = process.argv.includes("--dry-run");

  if (isDryRun) {
    console.log("🔍 DRY RUN モード（DBは更新しません）\n");
  }

  const supabase = createAdminClient();

  // 会期を取得
  const { data: session } = await supabase
    .from("council_sessions")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!session) {
    console.error(`❌ 会期 "${slug}" が見つかりません`);
    process.exit(1);
  }
  console.log(`✅ 会期: ${session.name}`);

  // 議案と解説コンテンツ・タグを取得
  const { data: bills } = await supabase
    .from("bills")
    .select("id, bill_number, name, bill_contents(title, summary, content), bills_tags(tags(label))")
    .eq("council_session_id", session.id)
    .in("publish_status", ["draft", "published"])
    .order("bill_number");

  if (!bills || bills.length === 0) {
    console.error("❌ 議案が見つかりません");
    process.exit(1);
  }

  // bill_contentsがある議案のみ評価対象
  const billsForEval: BillForEval[] = bills
    .filter((b) => b.bill_contents && b.bill_contents.length > 0)
    .map((b) => {
      const content = Array.isArray(b.bill_contents)
        ? b.bill_contents[0]
        : b.bill_contents;
      return {
        id: b.id,
        bill_number: b.bill_number ?? "",
        name: b.name,
        title: (content as { title?: string })?.title ?? "",
        summary: (content as { summary?: string })?.summary ?? "",
        content: (content as { content?: string })?.content ?? "",
      };
    })
    .filter((b) => b.title || b.summary);

  console.log(`📋 評価対象: ${billsForEval.length} 件\n`);

  // バッチサイズ5件ずつ処理（contentを含むためプロンプトが長くなる）
  const BATCH_SIZE = 5;
  const allResults: EvalResult[] = [];

  for (let i = 0; i < billsForEval.length; i += BATCH_SIZE) {
    const batch = billsForEval.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(billsForEval.length / BATCH_SIZE);
    console.log(
      `🤖 AI評価中... バッチ ${batchNum}/${totalBatches} (${batch[0].bill_number}〜${batch[batch.length - 1].bill_number})`
    );

    const prompt = buildEvalPrompt(batch);
    const response = callClaude(prompt);

    try {
      const results = extractJson(response);
      allResults.push(...results);
    } catch (err) {
      console.error(`  ❌ JSON解析失敗: ${err}`);
      console.error("  レスポンス:", response.slice(0, 200));
    }
  }

  // 結果をスコア順にソートして表示
  const sorted = [...allResults].sort((a, b) => b.score - a.score);

  console.log("\n📊 評価結果（スコア順）\n");
  console.log(
    "議案番号   | スコア | 除外 | 内訳(影響/生活/話題) | 理由"
  );
  console.log("-".repeat(80));

  const featuredNumbers = new Set<string>();

  for (const r of sorted) {
    const featured = !r.excluded && r.score >= FEATURE_THRESHOLD;
    const mark = featured ? "★" : " ";
    const excl = r.excluded ? "除外" : "  ";
    const breakdown = `${r.breakdown.influence_range}/${r.breakdown.life_impact}/${r.breakdown.interest}`;
    console.log(
      `${mark} ${r.bill_number.padEnd(8)} | ${String(r.score).padStart(4)}点 | ${excl} | ${breakdown.padEnd(18)} | ${r.reason}`
    );
    if (featured) featuredNumbers.add(r.bill_number);
  }

  console.log(`\n★ 注目対象: ${featuredNumbers.size} 件`);
  console.log([...featuredNumbers].join(", "));

  if (isDryRun) {
    console.log("\n✅ DRY RUN 完了（DBは更新されていません）");
    return;
  }

  // DB更新: 対象会期の全議案を一旦 is_featured = false に
  console.log("\n🔄 DB更新中...");
  const billIds = bills.map((b) => b.id);
  await supabase.from("bills").update({ is_featured: false }).in("id", billIds);

  // タグによる後処理除外: 除外タグを持つ議案は注目対象から除く
  const EXCLUSION_TAGS = ["指定管理者", "契約・和解"];

  const candidateIds = bills
    .filter((b) => featuredNumbers.has(b.bill_number ?? ""))
    .map((b) => b.id);

  const tagExcludedIds = new Set(
    bills
      .filter((b) => candidateIds.includes(b.id))
      .filter((b) => {
        const tagLabels = (b.bills_tags as { tags: { label: string } | null }[] | null)
          ?.map((bt) => bt.tags?.label)
          .filter(Boolean) ?? [];
        return tagLabels.some((label) => EXCLUSION_TAGS.includes(label as string));
      })
      .map((b) => b.id)
  );

  if (tagExcludedIds.size > 0) {
    const excluded = bills
      .filter((b) => tagExcludedIds.has(b.id))
      .map((b) => b.bill_number);
    console.log(`  🏷️  タグで除外: ${excluded.join(", ")}`);
  }

  const featuredIds = candidateIds.filter((id) => !tagExcludedIds.has(id));

  if (featuredIds.length > 0) {
    await supabase
      .from("bills")
      .update({ is_featured: true })
      .in("id", featuredIds);
  }

  console.log(`✅ 完了: ${featuredIds.length} 件を注目に設定しました`);

  // 結果をJSONファイルに保存
  const outputDir = path.join(import.meta.dirname, "output");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}-featured-eval.json`);
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2), "utf-8");
  console.log(`📄 評価結果を保存: ${outputPath}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
