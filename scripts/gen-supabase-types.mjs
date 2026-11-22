// ローカルの Supabase から型定義を生成し、Biome で整形して書き出す。
//
// - Supabase CLI 3 の出力は整形されていないため、Biome でプロジェクトの書式に揃える
//   （生成のたびに型ファイル全体が差分になるのを防ぐ）
// - 生成か整形に失敗したときは、既存の型ファイルを書き換えない
//   （シェルのリダイレクトだと、失敗時に型ファイルが空になる）
// - Windows でも動くように、シェルの機能（パイプ・リダイレクト）を使わない
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const OUTPUT = "packages/supabase/types/supabase.types.ts";

function run(command, input) {
  return execSync(command, {
    input,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["pipe", "pipe", "inherit"],
  });
}

// 既定は supabase/config.toml のローカル DB。別の DB から作るときは SUPABASE_DB_URL を指定する
const dbUrl = process.env.SUPABASE_DB_URL;
const genCommand = dbUrl
  ? `npx supabase gen types typescript --db-url "${dbUrl}"`
  : "npx supabase gen types typescript --local";

let generated;
try {
  generated = run(genCommand);
} catch {
  console.error(
    "型定義の生成に失敗しました。`npx supabase start` でローカルの Supabase が起動しているか確認してください。"
  );
  process.exit(1);
}

if (!generated.includes("export type Database")) {
  console.error("型定義の出力が想定と違うため、型ファイルを書き換えません。");
  process.exit(1);
}

let formatted;
try {
  formatted = run(`npx biome format --stdin-file-path=${OUTPUT}`, generated);
} catch {
  console.error("型定義の整形（Biome）に失敗したため、型ファイルを書き換えません。");
  process.exit(1);
}

writeFileSync(OUTPUT, formatted);
console.log(`✅ ${OUTPUT} を更新しました`);
