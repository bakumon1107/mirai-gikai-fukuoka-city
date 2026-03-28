/**
 * import-bills.ts
 *
 * スクレイピング結果とAI生成コンテンツをSupabaseに一括登録する。
 * 議案番号 + 会期IDの組み合わせで冪等性を保つ（select → upsert）。
 *
 * 使い方:
 *   tsx packages/seed/fukuoka/import-bills.ts [会期slug]
 *   例: tsx packages/seed/fukuoka/import-bills.ts r8-1
 *
 * 前提:
 *   - scrape-bills.ts で output/<slug>-bills.json が生成済みであること
 *   - generate-content.ts で output/<slug>-contents.json が生成済みであること
 *   - .env に SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が設定されていること
 *   - council_sessions・factions のマスターデータが登録済みであること（pnpm seed 実行済み）
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { createAdminClient } from "../shared/helper";
import type { ScrapedBill } from "./scrape-bills";
import type { ContentOutput, GeneratedContent } from "./generate-content";
import type { Database } from "@mirai-gikai/supabase";

type BillStatusEnum = Database["public"]["Enums"]["bill_status_enum"];
type StanceTypeEnum = Database["public"]["Enums"]["stance_type_enum"];

// ---- ステータスマッピング ----

/**
 * 公式サイトの議決結果文字列をDBのステータスEnumに変換する。
 */
function mapResultToStatus(result: string): BillStatusEnum {
  const r = result.trim();
  if (r.includes("可決")) return "approved";
  if (r.includes("否決")) return "rejected";
  if (r.includes("継続") || r.includes("審査")) return "in_committee";
  if (r.includes("承認")) return "approved";
  if (r.includes("採択")) return "adopted";
  return "submitted";
}

// ---- 会派名マッピング ----

/**
 * 公式サイトの会派略称をDBのdisplay_nameに対応づけるテーブル。
 * factions.display_name と照合するために使用する。
 */
const FACTION_NAME_MAP: Record<string, string> = {
  みらい: "みらい",
  自民: "自由民主党福岡市議団",
  公明: "公明党福岡市議団",
  市民ク: "福岡市民クラブ",
  共産: "日本共産党福岡市議団",
  新風: "新しい風ふくおか",
  維新: "日本維新の会福岡市議団",
  自民新: "自民党新福岡",
  無所属: "無所属",
};

function normalizeVote(vote: "for" | "against" | "unknown"): StanceTypeEnum | null {
  if (vote === "for") return "for";
  if (vote === "against") return "against";
  return null; // unknown は登録しない
}

// ---- メイン ----

async function main() {
  const slug = process.argv[2] || "r8-1";
  const outputDir = path.join(import.meta.dirname, "output");

  // 入力ファイル確認
  const billsPath = path.join(outputDir, `${slug}-bills.json`);
  const contentsPath = path.join(outputDir, `${slug}-contents.json`);

  if (!fs.existsSync(billsPath)) {
    console.error(`❌ ${billsPath} が見つかりません。先に scrape-bills.ts を実行してください。`);
    process.exit(1);
  }
  if (!fs.existsSync(contentsPath)) {
    console.error(`❌ ${contentsPath} が見つかりません。先に generate-content.ts を実行してください。`);
    process.exit(1);
  }

  const scrapedBills: ScrapedBill[] = JSON.parse(fs.readFileSync(billsPath, "utf-8"));
  const contentOutput: ContentOutput = JSON.parse(fs.readFileSync(contentsPath, "utf-8"));

  // コンテンツをbillNumberでインデックス化
  const contentMap = new Map<string, GeneratedContent>(
    contentOutput.bills.map((c) => [c.billNumber, c])
  );

  const supabase = createAdminClient();

  // ---- 会期IDを取得 ----
  const { data: session, error: sessionError } = await supabase
    .from("council_sessions")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (sessionError || !session) {
    console.error(`❌ 会期 slug="${slug}" が見つかりません。pnpm seed を実行してマスターデータを登録してください。`);
    process.exit(1);
  }
  console.log(`✅ 会期: ${session.name} (${session.id})`);

  // ---- 会派一覧を取得してdisplay_nameでインデックス化 ----
  const { data: factions, error: factionsError } = await supabase
    .from("factions")
    .select("id, name, display_name, alternative_names");

  if (factionsError || !factions) {
    console.error("❌ 会派データの取得に失敗しました:", factionsError);
    process.exit(1);
  }

  const factionByDisplayName = new Map(factions.map((f) => [f.display_name, f]));

  // ---- 既存の議案を取得（会期内）----
  const { data: existingBills } = await supabase
    .from("bills")
    .select("id, bill_number")
    .eq("council_session_id", session.id);

  const existingBillMap = new Map(
    (existingBills ?? []).map((b) => [b.bill_number, b.id])
  );

  console.log(`\n📋 ${scrapedBills.length} 件の議案を登録します（既存: ${existingBillMap.size} 件）`);

  let insertedBills = 0;
  let updatedBills = 0;
  let insertedContents = 0;
  let insertedStances = 0;

  for (const bill of scrapedBills) {
    process.stdout.write(`  [${bill.billNumber}] ${bill.name.slice(0, 30)}... `);

    const status = mapResultToStatus(bill.result);
    const existingId = existingBillMap.get(bill.billNumber);

    let billId: string;

    if (existingId) {
      // 更新
      const { error } = await supabase
        .from("bills")
        .update({
          name: bill.name,
          status,
          council_session_id: session.id,
        })
        .eq("id", existingId);

      if (error) {
        console.error(`\n  ❌ 更新失敗: ${error.message}`);
        continue;
      }
      billId = existingId;
      updatedBills++;
      process.stdout.write("更新 ");
    } else {
      // 新規登録
      const { data: inserted, error } = await supabase
        .from("bills")
        .insert({
          bill_number: bill.billNumber,
          name: bill.name,
          status,
          council_session_id: session.id,
          publish_status: "draft",
        })
        .select("id")
        .single();

      if (error || !inserted) {
        console.error(`\n  ❌ 登録失敗: ${error?.message}`);
        continue;
      }
      billId = inserted.id;
      insertedBills++;
      process.stdout.write("新規 ");
    }

    // ---- bill_contents の登録 ----
    const content = contentMap.get(bill.billNumber);
    if (content) {
      for (const [level, data] of [
        ["normal", content.normal],
        ["hard", content.hard],
      ] as const) {
        // 既存コンテンツを削除して再登録（upsertキーが bill_id + difficulty_level）
        await supabase
          .from("bill_contents")
          .delete()
          .eq("bill_id", billId)
          .eq("difficulty_level", level);

        const { error: contentError } = await supabase
          .from("bill_contents")
          .insert({
            bill_id: billId,
            difficulty_level: level,
            title: data.title,
            summary: data.summary,
            content: data.content,
          });

        if (contentError) {
          console.error(`\n  ⚠️  コンテンツ登録失敗 (${level}): ${contentError.message}`);
        } else {
          insertedContents++;
        }
      }
      process.stdout.write("コンテンツ✓ ");
    } else {
      process.stdout.write("コンテンツなし ");
    }

    // ---- faction_stances の登録 ----
    if (bill.factionVotes.length > 0) {
      // 既存スタンスを削除して再登録
      await supabase.from("faction_stances").delete().eq("bill_id", billId);

      for (const vote of bill.factionVotes) {
        const stanceType = normalizeVote(vote.vote);
        if (!stanceType) continue; // unknown はスキップ

        // 会派を名前でマッピング
        const displayName = FACTION_NAME_MAP[vote.factionName] ?? vote.factionName;
        const faction = factionByDisplayName.get(displayName);

        if (!faction) {
          // alternative_namesでも検索
          const byAlt = factions.find(
            (f) =>
              f.alternative_names?.includes(vote.factionName) ||
              f.display_name.includes(vote.factionName)
          );
          if (!byAlt) {
            console.warn(`\n  ⚠️  会派が見つかりません: "${vote.factionName}"`);
            continue;
          }
          const { error } = await supabase.from("faction_stances").insert({
            bill_id: billId,
            faction_id: byAlt.id,
            type: stanceType,
          });
          if (!error) insertedStances++;
          continue;
        }

        const { error } = await supabase.from("faction_stances").insert({
          bill_id: billId,
          faction_id: faction.id,
          type: stanceType,
        });
        if (!error) insertedStances++;
      }
      process.stdout.write("会派✓");
    }

    console.log();
  }

  console.log(`
🎉 インポート完了
  議案 新規: ${insertedBills}件 / 更新: ${updatedBills}件
  解説コンテンツ: ${insertedContents}件
  会派採決: ${insertedStances}件

📝 登録した議案は publish_status="draft" です。
   Admin画面から内容を確認してから公開してください。`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
