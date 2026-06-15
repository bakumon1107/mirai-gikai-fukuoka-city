const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * runId が crypto.randomUUID() 由来の UUID 形式かどうかを検証する。
 * ファイルパス組み立てに使う前にパストラバーサルを防ぐためのガード。
 */
export function isValidRunId(runId: string): boolean {
  return UUID_REGEX.test(runId);
}
