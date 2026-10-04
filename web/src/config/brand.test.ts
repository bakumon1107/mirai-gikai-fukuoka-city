import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { brandColors, brandGradient } from "./brand";

/**
 * brandColors は globals.css の CSS 変数を参照できない箇所（OGP 画像生成など）のために
 * 同じ色を二重に持っている。手で揃える運用なのでズレても誰も気づけない。
 * ここで実ファイルを読んで突き合わせ、片方だけ変えたら落ちるようにしておく。
 *
 * 参照: web/src/config/brand.ts の fork 時チェックリスト
 */
const repoRoot = join(__dirname, "..", "..");

function readFileFromWebRoot(relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), "utf-8");
}

/** `:root { ... }` ブロック内の CSS 変数を読む（`.dark` 等の再定義は拾わない） */
function readRootCssVariable(css: string, name: string): string | undefined {
  const rootBlock = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!rootBlock) {
    return undefined;
  }
  const matched = rootBlock[1].match(
    new RegExp(`--${name}\\s*:\\s*([^;]+);`, "i")
  );
  return matched?.[1].trim();
}

function readThemeVariable(css: string, name: string): string | undefined {
  const matched = css.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`, "i"));
  return matched?.[1].trim();
}

describe("brandColors", () => {
  const globalsCss = readFileFromWebRoot("src/app/globals.css");

  it("primary が globals.css の --primary と一致する", () => {
    expect(readRootCssVariable(globalsCss, "primary")).toBe(
      brandColors.primary
    );
  });

  it("primaryAccent が globals.css の --primary-accent と一致する", () => {
    expect(readRootCssVariable(globalsCss, "primary-accent")).toBe(
      brandColors.primaryAccent
    );
  });

  it("gradientStart が globals.css の --color-mirai-gradient-start と一致する", () => {
    expect(readThemeVariable(globalsCss, "color-mirai-gradient-start")).toBe(
      brandColors.gradientStart
    );
  });

  it("gradientEnd が globals.css の --color-mirai-gradient-end と一致する", () => {
    expect(readThemeVariable(globalsCss, "color-mirai-gradient-end")).toBe(
      brandColors.gradientEnd
    );
  });

  it("layout.tsx の themeColor と一致する", () => {
    const layout = readFileFromWebRoot("src/app/layout.tsx");
    const themeColor = layout.match(/themeColor:\s*"([^"]+)"/)?.[1];

    expect(themeColor).toBe(brandColors.primary);
  });

  it("manifest.json の theme_color と一致する", () => {
    const manifest = JSON.parse(readFileFromWebRoot("public/manifest.json"));

    expect(manifest.theme_color).toBe(brandColors.primary);
  });

  it("本家（team-mirai）の配色をそのまま使っていない", () => {
    // 本家の primary。fork 時に差し替え漏れがあれば落とす
    expect(brandColors.primary).not.toBe("#2aa693");
    expect(brandColors.primaryAccent).not.toBe("#0f8472");
  });
});

describe("brandGradient", () => {
  it("グラデーションの両端に brandColors の値を使う", () => {
    expect(brandGradient).toContain(brandColors.gradientStart);
    expect(brandGradient).toContain(brandColors.gradientEnd);
  });
});
