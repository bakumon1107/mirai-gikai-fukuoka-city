/**
 * claude-cli.ts
 *
 * Claude CLI の呼び出しを共通化するヘルパー。
 *
 * ## バイナリ解決ルール（優先順位順）
 * 1. CLAUDE_CLI_PATH 環境変数
 * 2. CLAUDE_CODE_EXECPATH 環境変数（Claude Code 拡張が設定するバイナリパス）
 * 3. PATH 上の "claude"
 *
 * ## ネスト起動対策
 * Claude Code の内側から呼び出す際に発生する H.effortLevel エラーを回避するため、
 * Claude 関連の環境変数をすべて削除してから子プロセスを起動する。
 */

import { spawn } from "node:child_process";

// ---- バイナリパスの解決 ----

/**
 * 実際に使用する Claude CLI バイナリのパスを返す。
 *
 * - CLAUDE_CLI_PATH が設定されていればそれを優先する
 * - 未設定なら CLAUDE_CODE_EXECPATH（Claude Code 拡張が設定するパス）を使う
 * - どちらも未設定なら PATH 上の "claude" を使う
 */
export function resolveCLIPath(): string {
  return (
    process.env.CLAUDE_CLI_PATH ||
    process.env.CLAUDE_CODE_EXECPATH ||
    "claude"
  );
}

// ---- 環境変数の準備 ----

/**
 * Claude Code のネスト起動を防ぐため、Claude 関連の環境変数を削除した env オブジェクトを返す。
 */
export function buildChildEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  delete env.CLAUDECODE;
  delete env.CLAUDE_CODE;
  delete env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING;
  delete env.CLAUDE_CODE_SESSION_ID;
  delete env.AI_AGENT;
  delete env.CLAUDE_AGENT_SDK_VERSION;
  delete env.CLAUDE_CODE_ENTRYPOINT;
  delete env.CLAUDE_CODE_EXECPATH;
  return env;
}

// ---- 非同期呼び出し ----

/**
 * Claude CLI を非同期で呼び出してテキストを返す。
 *
 * --output-format json を使い、result フィールドを取り出す。
 * is_error が true の場合はエラーをスローする。
 */
export function callClaude(prompt: string): Promise<string> {
  const claudePath = resolveCLIPath();
  const env = buildChildEnv();

  return new Promise((resolve, reject) => {
    const proc = spawn(
      claudePath,
      ["-p", prompt, "--output-format", "json"],
      { stdio: ["ignore", "pipe", "pipe"], env }
    );

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      reject(new Error(`claude の起動に失敗しました: ${err.message}`));
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `claude がコード ${code} で終了しました。stderr: ${stderr.slice(0, 300)}`
          )
        );
        return;
      }
      try {
        const parsed = JSON.parse(stdout) as {
          result?: string;
          is_error?: boolean;
        };
        if (parsed.is_error) {
          reject(
            new Error(`Claude エラー: ${String(parsed.result ?? "不明")}`)
          );
          return;
        }
        resolve(parsed.result ?? "");
      } catch {
        // JSON パース失敗時は stdout をそのまま返す
        resolve(stdout.trim());
      }
    });
  });
}

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * callClaude のリトライラッパー。
 *
 * @param prompt プロンプト文字列
 * @param retries 最大リトライ回数（デフォルト 3）
 * @param retryWaitBase リトライ間隔の基準ミリ秒（attempt * retryWaitBase で増加、デフォルト 15000ms）
 */
export async function callClaudeWithRetry(
  prompt: string,
  retries = 3,
  retryWaitBase = 15000
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callClaude(prompt);
    } catch (err) {
      if (attempt < retries) {
        const wait = attempt * retryWaitBase;
        console.warn(
          `  リトライ ${attempt}/${retries}（${wait / 1000}秒後）: ${err}`
        );
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
  throw new Error("unreachable");
}
