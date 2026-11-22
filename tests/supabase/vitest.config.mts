import path from "node:path";
import { defineConfig } from "vitest/config";

const testsDir = path.resolve(__dirname);

export default defineConfig({
  test: {
    globals: true,
    root: testsDir,
    include: ["**/*.test.ts"],
    // テスト間のデータ干渉を防ぐためシーケンシャル実行
    // （Vitest 4 で poolOptions.forks.singleFork は maxWorkers: 1 に置き換わった）
    pool: "forks",
    maxWorkers: 1,
    globalSetup: [path.resolve(testsDir, "setup.ts")],
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      "@mirai-gikai/supabase": path.resolve(
        __dirname,
        "../../packages/supabase/src"
      ),
    },
  },
});
