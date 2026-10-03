/**
 * ブランドカラー定数
 *
 * CSS 変数（globals.css の `--primary` 等）を参照できない箇所で使用します。
 * 具体的には OGP 画像生成（Satori / next/og）や、CSS 変数を受け取れない
 * サードパーティコンポーネントへの色指定です。
 *
 * ★ fork 時は本家（team-mirai）と同じ配色を使わず、独自の配色に変更してください。
 *   変更時は以下をすべて揃える必要があります。
 *   - web/src/app/globals.css の `--primary` / `--primary-accent` / `--color-mirai-gradient-*`
 *   - web/src/app/layout.tsx の `themeColor`
 *   - web/public/manifest.json の `theme_color`
 *   - web/public/icons/ 配下の SVG に直接書かれた塗り色
 *
 * @see FORK_GUIDELINES.md 4. カラーテーマの変更
 */
export const brandColors = {
  /** globals.css の --primary と一致させる */
  primary: "#4f6d8c",
  /** globals.css の --primary-accent と一致させる */
  primaryAccent: "#37506b",
  /** globals.css の --color-mirai-gradient-start と一致させる */
  gradientStart: "#9fc0d8",
  /** globals.css の --color-mirai-gradient-end と一致させる */
  gradientEnd: "#cfe1ec",
} as const;

/** OGP 画像等で使うブランドグラデーション（CSS の linear-gradient 文字列） */
export const brandGradient = `linear-gradient(-30deg, ${brandColors.gradientEnd} 1%, ${brandColors.gradientStart} 99%)`;
