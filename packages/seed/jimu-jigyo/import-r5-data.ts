import { createAdminClient } from "@mirai-gikai/supabase";
import type { JimuJigyoData } from "@/features/jimu-jigyo/shared/types/jimu-jigyo";
import * as fs from "fs";
import * as path from "path";

/**
 * 令和5年度データの統合スクリプト
 * 用途: 既存JSONに含まれるR5データをDB化し、R6データと関連付け
 *
 * 実行方法:
 *   npx tsx packages/seed/jimu-jigyo/import-r5-data.ts
 *
 * 動作:
 * 1. 既存JSONの R5 セクションから年度データを抽出
 * 2. R6で作成されたitem_idにR5レコードを紐付け
 * 3. データマッチングログを記録
 */


const BUREAU_MAPPING: Record<string, { code: string; name: string }> = {
  "jimu-jigyo-r6-somu": { code: "somu", name: "総務企画局" },
  "jimu-jigyo-r6-fukushi": { code: "fukushi", name: "福祉局" },
  "jimu-jigyo-r6-hoken": { code: "hoken", name: "保健福祉局" },
  "jimu-jigyo-r6-kyouiku": { code: "kyouiku", name: "教育委員会" },
  "jimu-jigyo-r6-kodomo": { code: "kodomo", name: "こども青年局" },
  "jimu-jigyo-r6-juto": { code: "juto", name: "建設局" },
  "jimu-jigyo-r6-keizai": { code: "keizai", name: "経済局" },
  "jimu-jigyo-r6-kankyo": { code: "kankyo", name: "環境局" },
  "jimu-jigyo-r6-shimin": { code: "shimin", name: "市民局" },
  "jimu-jigyo-r6-nousui": { code: "nousui", name: "農業委員会" },
  "jimu-jigyo-r6-kouwan": { code: "kouwan", name: "港湾空港局" },
};

/**
 * JSONファイルを読込
 */
function loadJsonData(filePath: string): JimuJigyoData[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

/**
 * R5データを既存のitem_idに紐付け
 */
async function linkR5DataToExistingItem(
  supabase: ReturnType<typeof createAdminClient>,
  item: JimuJigyoData,
  bureauCode: string
): Promise<{ itemId: string; matched: boolean } | null> {
  // R6で作成されたitem_idを検索
  const { data: existingItems } = await supabase
    .from("jimu_jigyo_items")
    .select("id")
    .eq("item_name", item.事業名)
    .eq("bureau_code", bureauCode)
    .eq("department_code", item.所管課)
    .limit(1);

  if (existingItems && existingItems.length > 0) {
    return {
      itemId: existingItems[0].id,
      matched: true,
    };
  }

  return null;
}

/**
 * R5データを登録
 */
async function importR5Data(
  supabase: ReturnType<typeof createAdminClient>,
  bureauCode: string,
  _bureauName: string,
  items: JimuJigyoData[]
): Promise<{
  inserted: number;
  skipped: number;
  errors: string[];
}> {
  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const item of items) {
    try {
      // R5データが存在するか確認（会計区分なし優先）
      const r5Entry =
        item.事業費_千円?.明細.find(
          (m) => m.年度 === "R5" && m.種別 === "決算" && m.会計区分 === null
        ) ??
        item.事業費_千円?.明細.find(
          (m) => m.年度 === "R5" && m.種別 === "決算"
        );
      if (!r5Entry) {
        skipped++;
        continue;
      }

      // R6で既に登録されたitem_idを検索
      const result = await linkR5DataToExistingItem(
        supabase,
        item,
        bureauCode
      );

      if (!result) {
        // R6に該当事業がない場合、新規登録は行わない
        skipped++;
        continue;
      }

      const itemId = result.itemId;

      // R5の年度データを登録（UPSERT）
      const { error: upsertError } = await supabase
        .from("jimu_jigyo_fiscal_years")
        .upsert(
          {
            item_id: itemId,
            fiscal_year: 2023, // 令和5年
            expenditure_amount: r5Entry.歳出,
            expenditure_type: r5Entry.種別,
            specific_revenue: r5Entry.特定財源,
            general_revenue: r5Entry.一般財源,
            data_source: "福岡市HP",
            imported_by: "import-r5-data-json",
          },
          {
            onConflict: "item_id,fiscal_year",
          }
        );

      if (upsertError) {
        throw new Error(`Failed to upsert fiscal year data: ${upsertError.message}`);
      }

      // KPIデータを登録
      if (item.指標) {
        // 活動指標（R5）
        if (item.指標.活動指標) {
          for (const kpi of item.指標.活動指標) {
            await importKpiForFiscalYear(
              supabase,
              itemId,
              "activity",
              kpi,
              2023
            );
          }
        }

        // 成果指標（R5）
        if (item.指標.成果指標) {
          for (const kpi of item.指標.成果指標) {
            await importKpiForFiscalYear(
              supabase,
              itemId,
              "achievement",
              kpi,
              2023
            );
          }
        }
      }

      inserted++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Item "${item.事業名}": ${message}`);
    }
  }

  return { inserted, skipped, errors };
}

/**
 * 特定年度のKPIを登録
 */
async function importKpiForFiscalYear(
  supabase: ReturnType<typeof createAdminClient>,
  itemId: string,
  kpiType: "activity" | "achievement",
  kpi: any,
  fiscalYear: number
) {
  // KPIタイプを取得
  const { data: kpiTypeData } = await supabase
    .from("jimu_jigyo_kpi_types")
    .select("id")
    .eq("kpi_type_code", kpiType)
    .limit(1);

  if (!kpiTypeData || kpiTypeData.length === 0) {
    return;
  }

  const kpiTypeId = kpiTypeData[0].id;

  // 既存のKPI指標を検索
  const { data: existingKpi } = await supabase
    .from("jimu_jigyo_kpi_items")
    .select("id")
    .eq("item_id", itemId)
    .eq("kpi_type_id", kpiTypeId)
    .eq("kpi_name", kpi.内容)
    .limit(1);

  let kpiItemId: string;

  if (existingKpi && existingKpi.length > 0) {
    kpiItemId = existingKpi[0].id;
  } else {
    // 新規KPI指標を作成
    const { data: newKpi } = await supabase
      .from("jimu_jigyo_kpi_items")
      .insert({
        item_id: itemId,
        kpi_type_id: kpiTypeId,
        kpi_name: kpi.内容,
      })
      .select("id");

    if (!newKpi || newKpi.length === 0) {
      return;
    }

    kpiItemId = newKpi[0].id;
  }

  // KPI結果を登録
  const targetValue = kpi.目標?.R5;
  const actualValue = kpi.実績?.R5;
  const achievementRate = kpi.達成率?.R5;

  await supabase.from("jimu_jigyo_kpi_results").upsert(
    {
      kpi_item_id: kpiItemId,
      fiscal_year: fiscalYear,
      target_value: targetValue ? JSON.stringify(targetValue) : null,
      actual_value: actualValue ? JSON.stringify(actualValue) : null,
      achievement_rate: achievementRate || null,
    },
    {
      onConflict: "kpi_item_id,fiscal_year",
    }
  );
}

/**
 * メイン処理
 */
async function main() {
  const supabase = createAdminClient();

  const dataDir = path.resolve(
    __dirname,
    "../../web/src/features/jimu-jigyo/server/data"
  );

  console.log(`📂 Data directory: ${dataDir}`);
  console.log(
    "🚀 Starting import of 令和5年度 data from existing JSON files...\n"
  );

  // インポートログを開始
  const { data: logData } = await supabase
    .from("jimu_jigyo_import_logs")
    .insert({
      fiscal_year: 2023,
      source_type: "json",
      status: "pending",
      imported_by: "import-r5-data",
    })
    .select("id");

  const logId = logData?.[0]?.id;

  let totalInserted = 0;
  let totalSkipped = 0;
  let allErrors: string[] = [];

  // 各部局ファイルを処理
  for (const [fileName, bureauInfo] of Object.entries(BUREAU_MAPPING)) {
    const filePath = path.join(dataDir, `${fileName}.json`);
    console.log(`📥 Processing ${bureauInfo.name}...`);

    try {
      const items = loadJsonData(filePath);
      const result = await importR5Data(
        supabase,
        bureauInfo.code,
        bureauInfo.name,
        items
      );

      totalInserted += result.inserted;
      totalSkipped += result.skipped;
      allErrors = allErrors.concat(result.errors);

      console.log(
        `  ✅ Inserted: ${result.inserted}, Skipped: ${result.skipped}`
      );

      if (result.errors.length > 0) {
        console.log(`  ⚠️  ${result.errors.length} errors`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  ❌ Failed: ${message}`);
    }
  }

  // インポートログを更新
  if (logId) {
    await supabase
      .from("jimu_jigyo_import_logs")
      .update({
        status: "completed",
        total_items_inserted: totalInserted,
      })
      .eq("id", logId);
  }

  console.log("\n========================================");
  console.log("✨ R5 Data import completed!");
  console.log(`Total inserted: ${totalInserted}`);
  console.log(`Total skipped: ${totalSkipped}`);
  if (allErrors.length > 0) {
    console.log(`Total errors: ${allErrors.length}`);
  }
  console.log("========================================\n");

  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
