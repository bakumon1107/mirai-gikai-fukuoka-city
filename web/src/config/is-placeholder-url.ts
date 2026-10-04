/**
 * 設定値の URL が「未設定、またはテンプレートのプレースホルダのまま」かを判定する。
 *
 * fork 時に書き換えられていない URL をそのままリンクとして描画すると、
 * 一見設定済みに見えて 404 する「死んだリンク」になる。
 * とくに AGPL-3.0 第13条で提示が必要なソースコード URL では、
 * リンクが存在すること自体が要件を満たした証拠に見えてしまうため、
 * 表示する前にこの関数で弾く。
 *
 * 判定に使う文字列は RFC 2606 の予約ドメインと、本リポジトリのテンプレートが
 * 既定値として置いているプレースホルダ。
 */
const PLACEHOLDER_MARKERS = [
  "your_account",
  "your_repository",
  "example.com",
  "example.lg.jp",
] as const;

export function isPlaceholderUrl(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === "") {
    return true;
  }
  const lowered = trimmed.toLowerCase();
  return PLACEHOLDER_MARKERS.some((marker) => lowered.includes(marker));
}
