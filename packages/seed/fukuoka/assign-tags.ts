/**
 * assign-tags.ts
 *
 * r8-1 の議案に対してタグを自動割り当てする。
 * 不足タグは新規作成し、既存タグは再利用する。
 *
 * 使い方:
 *   tsx --env-file=../../.env packages/seed/fukuoka/assign-tags.ts [会期slug]
 *   例: tsx --env-file=../../.env packages/seed/fukuoka/assign-tags.ts r8-1
 */

import { createAdminClient } from "../shared/helper";

// ---- タグ定義 ----

type TagDef = {
  label: string;
  description: string;
  featured_priority: number | null;
};

const TAG_DEFS: TagDef[] = [
  // 既存タグ（featured_priority は既存値を使うので null で指定）
  { label: "まちづくり・環境", description: "まちづくり、環境保護、都市計画に関する議案", featured_priority: null },
  { label: "子育て・教育",     description: "子育て支援、教育政策、若者支援に関する議案", featured_priority: null },
  { label: "福祉・医療",       description: "福祉、医療、高齢者支援に関する議案",         featured_priority: null },
  // 新規タグ
  { label: "財政・予算",   description: "一般会計・特別会計・企業会計の予算・補正予算に関する議案", featured_priority: 4 },
  { label: "産業・経済",   description: "企業誘致、特区、港湾、市場など産業振興に関する議案",       featured_priority: 5 },
  // 注目除外タグ（auto-feature.ts の後処理で is_featured から除外される）
  { label: "指定管理者",   description: "公共施設の指定管理者の指定・更新に関する議案",             featured_priority: null },
  { label: "契約・和解",   description: "工事請負契約の締結、損害賠償額の決定、和解等に関する議案", featured_priority: null },
];

// ---- 議案番号 → タグラベルのマッピング ----

/**
 * 議案番号（例: "第1号"）をキーにタグラベルの配列を返す。
 * 複数タグ可。
 */
const BILL_TAG_MAP: Record<string, string[]> = {
  // 財政・予算 —— 補正予算
  "第1号":  ["財政・予算"],
  "第2号":  ["財政・予算"],
  "第3号":  ["財政・予算"],
  "第4号":  ["財政・予算"],
  "第5号":  ["財政・予算"],
  "第6号":  ["財政・予算"],
  "第7号":  ["財政・予算"],
  "第8号":  ["財政・予算"],
  "第9号":  ["財政・予算"],
  "第10号": ["財政・予算"],
  "第11号": ["財政・予算"],
  "第12号": ["財政・予算"],
  // 条例・契約など
  "第13号": ["まちづくり・環境"],
  "第14号": ["まちづくり・環境"],
  "第15号": ["子育て・教育"],
  "第16号": ["まちづくり・環境"],
  "第17号": ["まちづくり・環境"],
  "第18号": ["福祉・医療"],
  "第19号": ["まちづくり・環境"],
  "第20号": ["まちづくり・環境"],
  "第21号": ["まちづくり・環境"],
  "第22号": ["まちづくり・環境"],
  "第23号": ["財政・予算"],
  "第24号": ["財政・予算"],
  "第25号": ["まちづくり・環境"],
  "第26号": ["まちづくり・環境"],
  // 来年度予算
  "第27号": ["財政・予算"],
  "第28号": ["財政・予算"],
  "第29号": ["財政・予算"],
  "第30号": ["財政・予算"],
  "第31号": ["財政・予算"],
  "第32号": ["財政・予算"],
  "第33号": ["財政・予算"],
  "第34号": ["財政・予算"],
  "第35号": ["財政・予算"],
  "第36号": ["財政・予算"],
  "第37号": ["財政・予算"],
  "第38号": ["財政・予算"],
  "第39号": ["財政・予算"],
  "第40号": ["財政・予算"],
  "第41号": ["財政・予算"],
  "第42号": ["財政・予算"],
  "第43号": ["財政・予算"],
  "第44号": ["財政・予算"],
  "第45号": ["財政・予算"],
  "第46号": ["財政・予算"],
  // 条例改正
  "第47号": ["財政・予算"],
  "第48号": ["まちづくり・環境"],
  "第49号": ["財政・予算"],
  "第50号": ["財政・予算"],
  "第51号": ["財政・予算"],
  "第52号": ["財政・予算"],
  "第53号": ["まちづくり・環境"],
  "第54号": ["子育て・教育"],
  "第55号": ["子育て・教育"],
  "第56号": ["子育て・教育"],
  "第57号": ["子育て・教育"],
  "第58号": ["子育て・教育"],
  "第59号": ["子育て・教育"],
  "第60号": ["子育て・教育"],
  "第61号": ["子育て・教育"],
  "第62号": ["子育て・教育", "福祉・医療"],
  "第63号": ["子育て・教育", "福祉・医療"],
  "第64号": ["子育て・教育", "福祉・医療"],
  "第65号": ["子育て・教育", "福祉・医療"],
  "第66号": ["まちづくり・環境"],
  "第67号": ["福祉・医療"],
  "第68号": ["福祉・医療"],
  "第69号": ["産業・経済"],
  "第70号": ["産業・経済"],
  "第71号": ["産業・経済"],
  "第72号": ["産業・経済"],
  "第73号": ["まちづくり・環境", "産業・経済"],
  "第74号": ["まちづくり・環境"],
  "第75号": ["まちづくり・環境"],
  "第76号": ["まちづくり・環境"],
  "第77号": ["まちづくり・環境"],
  "第78号": ["まちづくり・環境"],
  "第79号": ["まちづくり・環境"],
  "第80号": ["まちづくり・環境"],
  "第81号": ["子育て・教育"],
  "第82号": ["子育て・教育"],
  "第83号": ["子育て・教育"],
  "第84号": ["子育て・教育"],
  "第85号": ["まちづくり・環境"],
  "第86号": ["まちづくり・環境"],
  "第87号": ["まちづくり・環境"],
  "第88号": ["まちづくり・環境"],
  "第89号": ["財政・予算"],
  "第90号": ["まちづくり・環境", "産業・経済"],
};

// ---- メイン ----

async function main() {
  const slug = process.argv[2] || "r8-1";
  const supabase = createAdminClient();

  // ---- 会期ID取得 ----
  const { data: session, error: sessionError } = await supabase
    .from("council_sessions")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (sessionError || !session) {
    console.error(`❌ 会期 slug="${slug}" が見つかりません`);
    process.exit(1);
  }
  console.log(`✅ 会期: ${session.name}`);

  // ---- タグを upsert ----
  console.log("\n🏷️  タグを確認・作成中...");

  const { data: existingTags, error: tagsError } = await supabase
    .from("tags")
    .select("id, label, featured_priority");

  if (tagsError) {
    console.error("❌ タグ取得失敗:", tagsError.message);
    process.exit(1);
  }

  const tagByLabel = new Map(existingTags.map((t) => [t.label, t]));

  for (const def of TAG_DEFS) {
    const existing = tagByLabel.get(def.label);
    if (existing) {
      // 既存タグ: 新規タグの場合のみ featured_priority を更新
      if (def.featured_priority !== null && existing.featured_priority === null) {
        await supabase
          .from("tags")
          .update({ featured_priority: def.featured_priority })
          .eq("id", existing.id);
        console.log(`  更新: "${def.label}" (featured_priority=${def.featured_priority})`);
      } else {
        console.log(`  既存: "${def.label}"`);
      }
    } else {
      // 新規タグ作成
      const { data: created, error } = await supabase
        .from("tags")
        .insert({
          label: def.label,
          description: def.description,
          featured_priority: def.featured_priority,
        })
        .select("id, label")
        .single();

      if (error || !created) {
        console.error(`  ❌ タグ作成失敗 "${def.label}": ${error?.message}`);
        continue;
      }
      tagByLabel.set(created.label, { id: created.id, label: created.label, featured_priority: def.featured_priority });
      console.log(`  新規作成: "${def.label}"`);
    }
  }

  // ---- 議案一覧取得 ----
  const { data: bills, error: billsError } = await supabase
    .from("bills")
    .select("id, bill_number")
    .eq("council_session_id", session.id);

  if (billsError || !bills) {
    console.error("❌ 議案取得失敗:", billsError?.message);
    process.exit(1);
  }

  console.log(`\n📋 ${bills.length} 件の議案にタグを割り当て中...`);

  let assigned = 0;
  let skipped = 0;

  for (const bill of bills) {
    const tagLabels = BILL_TAG_MAP[bill.bill_number] ?? [];
    if (tagLabels.length === 0) {
      skipped++;
      continue;
    }

    // 既存タグ紐づけを削除して再登録（冪等）
    await supabase.from("bills_tags").delete().eq("bill_id", bill.id);

    for (const label of tagLabels) {
      const tag = tagByLabel.get(label);
      if (!tag) {
        console.warn(`  ⚠️  タグが見つかりません: "${label}"`);
        continue;
      }
      await supabase.from("bills_tags").insert({
        bill_id: bill.id,
        tag_id: tag.id,
      });
    }

    console.log(`  ${bill.bill_number}: ${tagLabels.join(", ")}`);
    assigned++;
  }

  console.log(`
🎉 議案番号マッピング完了
  タグ割り当て済み: ${assigned} 件
  タグなし（スキップ）: ${skipped} 件`);

  // ---- 名前パターンによる自動タグ付け（指定管理者・契約・和解） ----
  console.log("\n🔍 名前パターンでタグを自動付与中...");

  type PatternTagDef = { tagLabel: string; pattern: RegExp };
  const PATTERN_TAGS: PatternTagDef[] = [
    { tagLabel: "指定管理者", pattern: /指定管理者/ },
    { tagLabel: "契約・和解", pattern: /契約の締結|契約の一部変更|損害賠償額の決定|和解|外部監査/ },
  ];

  // 全議案を名前つきで再取得
  const { data: allBills } = await supabase
    .from("bills")
    .select("id, bill_number, name")
    .eq("council_session_id", session.id);

  let patternAssigned = 0;

  for (const bill of allBills ?? []) {
    for (const { tagLabel, pattern } of PATTERN_TAGS) {
      if (!pattern.test(bill.name)) continue;

      const tag = tagByLabel.get(tagLabel);
      if (!tag) {
        console.warn(`  ⚠️  タグが見つかりません: "${tagLabel}"`);
        continue;
      }

      // 既に付与済みの場合はスキップ
      const { data: existing } = await supabase
        .from("bills_tags")
        .select("id")
        .eq("bill_id", bill.id)
        .eq("tag_id", tag.id)
        .maybeSingle();

      if (existing) continue;

      await supabase.from("bills_tags").insert({ bill_id: bill.id, tag_id: tag.id });
      console.log(`  ${bill.bill_number} → "${tagLabel}" (${bill.name.slice(0, 30)}...)`);
      patternAssigned++;
    }
  }

  console.log(`  パターンタグ付与: ${patternAssigned} 件`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
