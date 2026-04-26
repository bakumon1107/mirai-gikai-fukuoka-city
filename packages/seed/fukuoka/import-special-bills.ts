/**
 * import-special-bills.ts
 *
 * 公式採決結果ページから意見書案・決議案・議員提出議案をスクレイピングし、
 * cloud Supabase に登録する。
 *
 * 使い方:
 *   tsx --env-file=../../.env packages/seed/fukuoka/import-special-bills.ts \
 *     --url https://gikai.city.fukuoka.lg.jp/result/r8_gikai1/ \
 *     --session r8-1 \
 *     [--dry-run]
 *
 * 前提:
 *   - .env に SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が設定されていること
 *   - council_sessions のマスターデータが登録済みであること
 *   - 意見書案・決議案のタグが DB に存在すること
 *     （存在しない場合は自動作成する）
 *
 * 会期ごとの無所属マッピング:
 *   - r8-1: 無所属１=あべひでき, 無所属２=新開ゆうじ, 無所属３=木村てつあき,
 *           無所属４=森あやこ, 無所属５=川口浩
 *   - それ以外: 無所属N のまま登録（個人名マッピングなし）
 */

import { createAdminClient } from "../shared/helper";

// ---- 型定義 ----

type BillType = "opinion" | "resolution" | "member_bill" | "petition";

type ScrapedSpecialBill = {
  billType: BillType;
  number: string;        // "1", "2" 等
  billNumber: string;    // "意見書案第1号" 等
  title: string;
  sourceUrl: string | null;
  submittedDate: string;
  decidedDate: string;
  result: string;        // "可決" | "否決" 等
  votes: Record<string, "○" | "×">;
};

// ---- 会期ごとの無所属マッピング ----

const MUSHOZOKU_BY_SESSION: Record<string, Record<string, string>> = {
  "r8-1": {
    "無所属１": "あべ ひでき",
    "無所属２": "新開 ゆうじ",
    "無所属３": "木村 てつあき",
    "無所属４": "森 あやこ",
    "無所属５": "川口 浩",
  },
};

// ---- 会派略称 → DB display_name ----

const FACTION_NAME_MAP: Record<string, string> = {
  自民:   "自由民主党福岡市議団",
  公明:   "公明党福岡市議団",
  市民ク: "福岡市民クラブ",
  共産:   "日本共産党福岡市議団",
  新風:   "新しい風ふくおか",
  維新:   "日本維新の会福岡市議団",
  自民新: "自民党新福岡",
  みらい: "みらい",
};

// ---- bill_type ごとの設定 ----

const BILL_TYPE_CONFIG: Record<BillType, {
  numberPrefix: string;
  tagLabel: string;
  tagDescription: string;
  submittedDateLabel: string;
}> = {
  opinion: {
    numberPrefix: "意見書案",
    tagLabel: "意見書案",
    tagDescription: "議会が国・都道府県等へ提出する意見書の議案",
    submittedDateLabel: "提出年月日",
  },
  resolution: {
    numberPrefix: "決議案",
    tagLabel: "決議案",
    tagDescription: "議会の意思を表明する決議の議案",
    submittedDateLabel: "提出年月日",
  },
  member_bill: {
    numberPrefix: "",
    tagLabel: "",
    tagDescription: "",
    submittedDateLabel: "提出年月日",
  },
  petition: {
    numberPrefix: "請願",
    tagLabel: "請願",
    tagDescription: "市民・団体から提出された請願",
    submittedDateLabel: "受理年月日",
  },
};

// ---- 非採決フィールド（スキップ対象）----

const NON_VOTE_FIELDS = new Set([
  "提出年月日", "受理年月日", "件名", "議決年月日", "議決結果",
]);

// ---- ステータスマッピング ----

function mapResultToStatus(result: string) {
  if (result.includes("可決") || result.includes("承認") || result.includes("同意") || result.includes("採択")) return "approved";
  if (result.includes("否決") || result.includes("不採択")) return "rejected";
  return "submitted";
}

// ---- スクレイピング ----

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function scrapeSpecialBills(html: string): ScrapedSpecialBill[] {
  const results: ScrapedSpecialBill[] = [];

  // テーブルを全て抽出
  const tableRegex = /<table id="(tablepress[^"]*)"[^>]*>(.*?)<\/table>/gs;
  let tableMatch: RegExpExecArray | null;

  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableId = tableMatch[1];
    const tableContent = tableMatch[2];

    // 各行を解析
    const rows: string[][] = [];
    const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
    let rowMatch: RegExpExecArray | null;
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const cells: string[] = [];
      const cellRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gs;
      let cellMatch: RegExpExecArray | null;
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(stripTags(cellMatch[1]));
      }
      if (cells.length > 0) {
        // 1列目（フィールド名）の内部スペースを除去して正規化
        cells[0] = cells[0].replace(/\s/g, "");
        rows.push(cells);
      }
    }

    if (rows.length === 0) continue;

    // 1列目はrow構築時に正規化済み（内部スペース除去）
    const firstLabel = rows[0][0];

    // 種別を判定
    let billType: BillType | null = null;
    if (firstLabel === "意見書案番号") billType = "opinion";
    else if (firstLabel === "決議案番号") billType = "resolution";
    else if (firstLabel === "受理番号" || firstLabel === "請願受理番号") billType = "petition";
    else if (firstLabel === "議案番号") {
      // 議員提出議案かどうかは tableId の直前の注記で判断
      const tablePos = html.indexOf(`id="${tableId}"`);
      const preceding = html.slice(Math.max(0, tablePos - 1000), tablePos);
      if (preceding.includes("議員提出議案")) billType = "member_bill";
    }

    if (!billType) continue;

    // 列数（議案数）
    const colCount = rows[0].length - 1;

    // 件名URLを抽出
    const sourceUrls: (string | null)[] = (() => {
      const titleIdx = html.indexOf(`id="${tableId}"`);
      const tableHtml = html.slice(titleIdx);
      const hrefMatches = tableHtml.match(/件名.*?(<\/tr>)/s)?.[0] ?? "";
      return [...hrefMatches.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    })();

    for (let col = 0; col < colCount; col++) {
      const getCell = (rowLabel: string): string => {
        const row = rows.find(r => r[0] === rowLabel);
        return row ? (row[col + 1] ?? "") : "";
      };

      const config = BILL_TYPE_CONFIG[billType];
      const number = rows[0][col + 1] ?? "";
      const title = getCell("件名");
      const submittedDate = getCell(config.submittedDateLabel);
      const decidedDate = getCell("議決年月日");
      const result = getCell("議決結果");

      // bill_number の組み立て
      // 請願: "請願６年４号"（受理番号そのまま連結）
      // 意見書案・決議案: "意見書案第N号" / 議員提出議案: "第N号"
      const billNumber = billType === "petition"
        ? `${config.numberPrefix}${number}`
        : config.numberPrefix
          ? `${config.numberPrefix}第${number}号`
          : `第${number}号`;

      // 採決データ（非採決フィールドはスキップ）
      const votes: Record<string, "○" | "×"> = {};
      for (const row of rows) {
        const label = row[0];
        if (label === rows[0][0] || NON_VOTE_FIELDS.has(label)) continue;
        const val = row[col + 1];
        if (val === "○" || val === "×") {
          votes[label] = val;
        }
      }

      results.push({
        billType,
        number,
        billNumber,
        title,
        sourceUrl: sourceUrls[col] ?? null,
        submittedDate,
        decidedDate,
        result,
        votes,
      });
    }
  }

  return results;
}

// ---- メイン処理 ----

async function main() {
  const args = process.argv.slice(2);
  const urlArg = args[args.indexOf("--url") + 1];
  const sessionSlug = args[args.indexOf("--session") + 1];
  const dryRun = args.includes("--dry-run");

  if (!urlArg || !sessionSlug) {
    console.error("Usage: tsx import-special-bills.ts --url <URL> --session <slug> [--dry-run]");
    process.exit(1);
  }

  console.log(`\n対象URL: ${urlArg}`);
  console.log(`会期slug: ${sessionSlug}`);
  console.log(`dry-run: ${dryRun}\n`);

  // フェッチ
  const res = await fetch(urlArg, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();

  // スクレイピング
  const bills = scrapeSpecialBills(html);
  console.log(`スクレイピング結果: ${bills.length}件`);
  for (const b of bills) {
    console.log(`  [${b.billType}] ${b.billNumber} ${b.title} → ${b.result}`);
  }

  if (dryRun) {
    console.log("\n--dry-run モードのため DB 更新をスキップします。");
    return;
  }

  const supabase = createAdminClient();

  // 会期を取得
  const { data: session } = await supabase
    .from("council_sessions")
    .select("id")
    .eq("slug", sessionSlug)
    .single();

  if (!session) {
    console.error(`会期が見つかりません: ${sessionSlug}`);
    process.exit(1);
  }

  // 全 factions を取得
  const { data: allFactions } = await supabase
    .from("factions")
    .select("id, display_name");
  const factionByName = new Map((allFactions ?? []).map(f => [f.display_name, f.id]));

  // 無所属マッピング（会期ごと）
  const mushozokuMap = MUSHOZOKU_BY_SESSION[sessionSlug] ?? {};

  // タグを確保（意見書案・決議案・請願）
  const tagIdByType = new Map<BillType, string>();
  for (const billType of ["opinion", "resolution", "petition"] as BillType[]) {
    const config = BILL_TYPE_CONFIG[billType];
    if (!config.tagLabel) continue;

    const { data: existingTag } = await supabase
      .from("tags")
      .select("id")
      .eq("label", config.tagLabel)
      .maybeSingle();

    if (existingTag) {
      tagIdByType.set(billType, existingTag.id);
    } else {
      const { data: newTag } = await supabase
        .from("tags")
        .insert({ label: config.tagLabel, description: config.tagDescription })
        .select("id")
        .single();
      if (newTag) {
        tagIdByType.set(billType, newTag.id);
        console.log(`  タグ新規作成: ${config.tagLabel}`);
      }
    }
  }

  let insertedCount = 0;
  let errorCount = 0;

  for (const bill of bills) {
    const status = mapResultToStatus(bill.result);

    // published_at の変換
    const publishedAt = bill.decidedDate
      ? new Date(
          bill.decidedDate
            .replace("R", "")
            .replace(/^(\d+)\.(\d+)\.(\d+)$/, (_, y, m, d) =>
              `${2018 + Number(y)}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
            )
        ).toISOString()
      : null;

    // 既存レコードを検索（partial index のため onConflict が使えないので select → insert/update）
    const { data: existing } = await supabase
      .from("bills")
      .select("id")
      .eq("council_session_id", session.id)
      .eq("bill_number", bill.billNumber)
      .eq("bill_type", bill.billType)
      .maybeSingle();

    let billId: string;

    if (existing) {
      // 更新
      const { error: updateError } = await supabase
        .from("bills")
        .update({
          name: bill.title,
          status,
          published_at: publishedAt,
          source_url: bill.sourceUrl,
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error(`  ERROR: ${bill.billNumber} - ${updateError.message}`);
        errorCount++;
        continue;
      }
      billId = existing.id;
    } else {
      // 新規登録
      const { data: inserted, error: insertError } = await supabase
        .from("bills")
        .insert({
          council_session_id: session.id,
          bill_number: bill.billNumber,
          bill_type: bill.billType,
          name: bill.title,
          status,
          publish_status: "published",
          published_at: publishedAt,
          source_url: bill.sourceUrl,
          is_featured: false,
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        console.error(`  ERROR: ${bill.billNumber} - ${insertError?.message}`);
        errorCount++;
        continue;
      }
      billId = inserted.id;
    }

    // タグを付与（意見書案・決議案・請願）
    const tagId = tagIdByType.get(bill.billType);
    if (tagId) {
      await supabase
        .from("bills_tags")
        .upsert({ bill_id: billId, tag_id: tagId }, { onConflict: "bill_id,tag_id" });
    }

    // faction_stances を登録
    // 請願の○× は「委員長報告（採択/不採択）への賛否」を表す。
    // つまり○=採択に賛成 → for、×=採択に反対 → against として統一して扱う。
    // 不採択案の○は「不採択に賛成」だが、faction_stances では結果への賛否ではなく
    // 「その議案を通すことへの賛否」で記録する慣習のため、反転して格納する。
    const isPetition = bill.billType === "petition";
    const isRejected = bill.result.includes("不採択") || bill.result.includes("否決");
    for (const [siteName, vote] of Object.entries(bill.votes)) {
      // 請願かつ不採択の場合: ○=不採択賛成=議案に反対 → "against"、×=不採択反対=議案に賛成 → "for"
      const rawFor = vote === "○";
      const stanceType = (isPetition && isRejected)
        ? (rawFor ? "against" : "for")
        : (rawFor ? "for" : "against");

      // 無所属N → 個人名 or そのまま
      const resolvedName = mushozokuMap[siteName]
        ?? FACTION_NAME_MAP[siteName]
        ?? siteName;

      let factionId = factionByName.get(resolvedName);

      // なければ faction を作成
      if (!factionId) {
        const slug = resolvedName.replace(/\s/g, "-");
        const { data: newFaction } = await supabase
          .from("factions")
          .insert({ name: slug, display_name: resolvedName, alternative_names: [], is_active: true, sort_order: 100 })
          .select("id")
          .single();
        if (newFaction) {
          factionId = newFaction.id;
          factionByName.set(resolvedName, factionId);
          console.log(`  faction 新規作成: ${resolvedName}`);
        }
      }

      if (!factionId) continue;

      await supabase
        .from("faction_stances")
        .upsert(
          { bill_id: billId, faction_id: factionId, type: stanceType, comment: null },
          { onConflict: "bill_id,faction_id" }
        );
    }

    // bill_contents（空で登録 → 後でAI生成）
    for (const level of ["normal", "hard"] as const) {
      await supabase
        .from("bill_contents")
        .upsert(
          {
            bill_id: billId,
            difficulty_level: level,
            title: bill.title,
            summary: "",
            content: "",
          },
          { onConflict: "bill_id,difficulty_level" }
        );
    }

    console.log(`  ✓ ${bill.billNumber} ${bill.title}`);
    insertedCount++;
  }

  console.log(`\n完了: ${insertedCount}件登録, ${errorCount}件エラー`);
}

main().catch(console.error);
