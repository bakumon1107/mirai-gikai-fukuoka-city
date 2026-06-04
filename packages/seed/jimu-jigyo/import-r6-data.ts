import { createAdminClient } from "@mirai-gikai/supabase";
import type {
  JimuJigyoData,
  KpiItem,
  ReiwaYear,
} from "@/features/jimu-jigyo/shared/types/jimu-jigyo";
import * as fs from "fs";
import * as path from "path";

/**
 * 事務事業点検データのDB化スクリプト
 * 用途: 既存の部局別JSONファイルをDBに取込
 *
 * 実行方法:
 *   npx tsx packages/seed/jimu-jigyo/import-r6-data.ts
 */

interface ImportResult {
  fiscal_year: number;
  bureau_code: string;
  total_processed: number;
  total_inserted: number;
  total_updated: number;
  errors: string[];
}

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
 * 事業コードを自動採番
 * 例: "somu_001", "somu_002", ...
 */
async function generateItemCode(
  supabase: ReturnType<typeof createAdminClient>,
  bureauCode: string
): Promise<string> {
  const { data, error } = await supabase
    .from("jimu_jigyo_items")
    .select("item_code")
    .like("item_code", `${bureauCode}_%`)
    .order("item_code", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(
      `Failed to query existing item codes: ${error.message}`
    );
  }

  let nextNum = 1;
  if (data && data.length > 0) {
    const lastCode = data[0].item_code;
    const match = lastCode.match(/_(\d+)$/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  return `${bureauCode}_${String(nextNum).padStart(3, "0")}`;
}

/**
 * 既存の事業をマッチング
 * 優先度: 完全一致 > 部分一致 > 類似度スコア
 */
async function matchExistingItem(
  supabase: ReturnType<typeof createAdminClient>,
  itemName: string,
  bureauCode: string,
  departmentCode: string
): Promise<{ id: string; matchScore: number; matchMethod: string } | null> {
  // 1. 完全一致を試行
  const { data: exactMatch } = await supabase
    .from("jimu_jigyo_items")
    .select("id")
    .eq("item_name", itemName)
    .eq("bureau_code", bureauCode)
    .eq("department_code", departmentCode)
    .limit(1);

  if (exactMatch && exactMatch.length > 0) {
    return {
      id: exactMatch[0].id,
      matchScore: 100,
      matchMethod: "exact",
    };
  }

  // 2. 部分一致（同一部局・同一課内で事業名に部分一致）
  const { data: partialMatch } = await supabase
    .from("jimu_jigyo_items")
    .select("id, item_name")
    .ilike("item_name", `%${itemName}%`)
    .eq("bureau_code", bureauCode)
    .eq("department_code", departmentCode)
    .limit(5);

  if (partialMatch && partialMatch.length > 0) {
    return {
      id: partialMatch[0].id,
      matchScore: 75,
      matchMethod: "partial",
    };
  }

  return null;
}

/**
 * JSON ファイルを読込
 */
function loadJsonData(filePath: string): JimuJigyoData[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

/**
 * KPI 指標の取込
 */
async function importKpiData(
  supabase: ReturnType<typeof createAdminClient>,
  itemId: string,
  kpiItems: KpiItem[] | undefined,
  kpiType: "activity" | "achievement",
  fiscalYear: number
): Promise<number> {
  if (!kpiItems || kpiItems.length === 0) {
    return 0;
  }

  let inserted = 0;

  for (let i = 0; i < kpiItems.length; i++) {
    const kpi = kpiItems[i];

    // KPI 指標マスタへの登録
    const { data: kpiTypeData, error: kpiTypeError } = await supabase
      .from("jimu_jigyo_kpi_types")
      .select("id")
      .eq("kpi_type_code", kpiType)
      .limit(1);

    if (kpiTypeError) {
      console.error(`Failed to fetch KPI type: ${kpiTypeError.message}`);
      continue;
    }

    if (!kpiTypeData || kpiTypeData.length === 0) {
      console.error(`KPI type not found: ${kpiType}`);
      continue;
    }

    const kpiTypeId = kpiTypeData[0].id;

    // KPI 指標が既に存在するか確認
    const { data: existingKpi, error: existingError } = await supabase
      .from("jimu_jigyo_kpi_items")
      .select("id")
      .eq("item_id", itemId)
      .eq("kpi_type_id", kpiTypeId)
      .eq("kpi_name", kpi.内容)
      .limit(1);

    if (existingError) {
      console.error(
        `Failed to check existing KPI: ${existingError.message}`
      );
      continue;
    }

    let kpiItemId: string;

    if (existingKpi && existingKpi.length > 0) {
      // 既存の KPI 指標を使用
      kpiItemId = existingKpi[0].id;
    } else {
      // 新規 KPI 指標を作成
      const { data: newKpi, error: createError } = await supabase
        .from("jimu_jigyo_kpi_items")
        .insert({
          item_id: itemId,
          kpi_type_id: kpiTypeId,
          kpi_name: kpi.内容,
          kpi_order: i,
        })
        .select("id");

      if (createError) {
        console.error(`Failed to create KPI item: ${createError.message}`);
        continue;
      }

      if (!newKpi || newKpi.length === 0) {
        console.error("Failed to create KPI item: no data returned");
        continue;
      }

      kpiItemId = newKpi[0].id;
    }

    // KPI 実績を登録
    const reiwaKey = `R${fiscalYear - 2018}` as ReiwaYear;
    const targetValue = kpi.目標?.[reiwaKey];
    const actualValue = kpi.実績?.[reiwaKey];
    const achievementRate = kpi.達成率?.[reiwaKey];

    const { error: resultError } = await supabase
      .from("jimu_jigyo_kpi_results")
      .upsert(
        {
          kpi_item_id: kpiItemId,
          fiscal_year: fiscalYear,
          target_value: targetValue
            ? JSON.stringify(targetValue)
            : null,
          actual_value: actualValue
            ? JSON.stringify(actualValue)
            : null,
          achievement_rate: achievementRate != null ? String(achievementRate) : null,
        },
        {
          onConflict: "kpi_item_id,fiscal_year",
        }
      );

    if (resultError) {
      console.error(
        `Failed to insert KPI result: ${resultError.message}`
      );
      continue;
    }

    inserted++;
  }

  return inserted;
}

/**
 * 単一の部局ファイルを取込
 */
async function importBureauFile(
  supabase: ReturnType<typeof createAdminClient>,
  filePath: string,
  bureauCode: string,
  bureauName: string,
  fiscalYear: number
): Promise<ImportResult> {
  const errors: string[] = [];
  let totalInserted = 0;
  let totalUpdated = 0;

  try {
    const items = loadJsonData(filePath);

    for (const item of items) {
      try {
        // 既存事業をマッチング
        const existingItem = await matchExistingItem(
          supabase,
          item.事業名,
          bureauCode,
          item.所管課
        );

        let itemId: string;

        if (existingItem) {
          // 既存事業の場合、マッチングログを記録
          itemId = existingItem.id;

          await supabase.from("jimu_jigyo_matching_logs").insert({
            fiscal_year: fiscalYear,
            item_id: itemId,
            source_item_name: item.事業名,
            source_bureau_code: bureauCode,
            source_department_name: item.所管課,
            match_score: existingItem.matchScore,
            match_method: existingItem.matchMethod,
            matched_by: "import-r6-data",
          });

          totalUpdated++;
        } else {
          // 新規事業の場合、アイテムを作成
          const itemCode = await generateItemCode(supabase, bureauCode);

          const { data: newItem, error: createError } = await supabase
            .from("jimu_jigyo_items")
            .insert({
              item_code: itemCode,
              item_name: item.事業名,
              bureau_code: bureauCode,
              bureau_name: bureauName,
              department_code: item.所管課,
              department_name: item.所管課,
              start_fiscal_year: item.開始年度,
              root_law: item.根拠法令,
              administrative_plan: item.行政計画,
              establishment_trigger: item.事業きっかけ,
              target_description: item.事業概要?.対象,
              target_goal_state: item.事業概要?.対象の目指す状態,
              implementation_content: item.事業概要?.実施内容,
              achievement_criteria: item.事業概要?.成果見直し判断基準,
              activity_output: item.ロジックモデル?.活動アウトプット,
              result_output: item.ロジックモデル?.結果アウトプット,
              intermediate_outcome: item.ロジックモデル?.中間アウトカム,
              final_outcome: item.ロジックモデル?.最終アウトカム,
            })
            .select("id");

          if (createError) {
            throw new Error(`Failed to create item: ${createError.message}`);
          }

          if (!newItem || newItem.length === 0) {
            throw new Error("Failed to create item: no data returned");
          }

          itemId = newItem[0].id;
          totalInserted++;
        }

        // 年度別データ（予算）を登録
        const budgetData = item.事業費_千円;
        if (budgetData) {
          const reiwaYear = `R${fiscalYear - 2018}` as ReiwaYear;
          const nextReiwaYear = `R${fiscalYear - 2017}` as ReiwaYear;

          // 会計区分なし（合算）を優先、なければ最初のエントリを使用
          const entry =
            budgetData.明細.find(
              (m) => m.年度 === reiwaYear && m.会計区分 === null
            ) ?? budgetData.明細.find((m) => m.年度 === reiwaYear);
          const nextYearEntry =
            budgetData.明細.find(
              (m) =>
                m.年度 === nextReiwaYear &&
                m.種別 === "予算" &&
                m.会計区分 === null
            ) ??
            budgetData.明細.find(
              (m) => m.年度 === nextReiwaYear && m.種別 === "予算"
            );

          if (entry && entry.歳出 > 0) {
            await supabase.from("jimu_jigyo_fiscal_years").upsert(
              {
                item_id: itemId,
                fiscal_year: fiscalYear,
                expenditure_amount: entry.歳出,
                expenditure_type: entry.種別,
                specific_revenue: entry.特定財源,
                general_revenue: entry.一般財源,
                next_year_budget: nextYearEntry?.歳出 ?? null,
                data_source: "福岡市HP",
                imported_by: "import-r6-data-json",
              },
              {
                onConflict: "item_id,fiscal_year",
              }
            );
          }
        }

        // KPI データを登録
        if (item.指標) {
          await importKpiData(supabase, itemId, item.指標.活動指標, "activity", fiscalYear);
          await importKpiData(supabase, itemId, item.指標.成果指標, "achievement", fiscalYear);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`Item "${item.事業名}": ${message}`);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Bureau import failed: ${message}`);
  }

  return {
    fiscal_year: fiscalYear,
    bureau_code: bureauCode,
    total_processed: totalInserted + totalUpdated + errors.length,
    total_inserted: totalInserted,
    total_updated: totalUpdated,
    errors,
  };
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
    "🚀 Starting import of 令和6年度 事務事業評価 data...\n"
  );

  // インポートログを開始
  const { data: logData, error: logError } = await supabase
    .from("jimu_jigyo_import_logs")
    .insert({
      fiscal_year: 2024,
      source_type: "json",
      status: "pending",
      imported_by: "import-r6-data",
    })
    .select("id");

  if (logError) {
    console.error(`Failed to create import log: ${logError.message}`);
    process.exit(1);
  }

  const logId = logData?.[0]?.id;

  let totalInserted = 0;
  let totalUpdated = 0;
  const results: ImportResult[] = [];

  // 各部局ファイルを処理
  for (const [fileName, bureauInfo] of Object.entries(BUREAU_MAPPING)) {
    const filePath = path.join(dataDir, `${fileName}.json`);
    console.log(`📥 Importing ${bureauInfo.name}...`);

    // R6 データの取込
    const result = await importBureauFile(
      supabase,
      filePath,
      bureauInfo.code,
      bureauInfo.name,
      2024
    );

    results.push(result);
    totalInserted += result.total_inserted;
    totalUpdated += result.total_updated;

    if (result.errors.length > 0) {
      console.log(`  ⚠️  ${result.errors.length} errors:`);
      result.errors.forEach((err) => console.log(`    - ${err}`));
    } else {
      console.log(
        `  ✅ Inserted: ${result.total_inserted}, Updated: ${result.total_updated}`
      );
    }
  }

  // インポートログを更新
  if (logId) {
    const allErrors = results.flatMap((r) => r.errors);
    await supabase
      .from("jimu_jigyo_import_logs")
      .update({
        status: allErrors.length > 0 ? "completed_with_errors" : "completed",
        total_items_inserted: totalInserted,
        total_items_updated: totalUpdated,
      })
      .eq("id", logId);
  }

  console.log("\n========================================");
  console.log("✨ Import completed!");
  console.log(`Total inserted: ${totalInserted}`);
  console.log(`Total updated: ${totalUpdated}`);
  console.log("========================================\n");

  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
