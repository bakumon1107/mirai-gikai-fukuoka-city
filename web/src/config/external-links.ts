import { siteConfig } from "./site.config";

/**
 * 外部リンク定数
 * siteConfig.externalLinks から値を取得する
 */
export const EXTERNAL_LINKS = {
  REPORT: siteConfig.externalLinks.report,
  ABOUT_NOTE: siteConfig.externalLinks.aboutNote,
  DONATION: siteConfig.externalLinks.donation,
  TEAM_MIRAI_ABOUT: siteConfig.externalLinks.teamAbout,
  TERMS: siteConfig.externalLinks.terms,
  PRIVACY: siteConfig.externalLinks.privacy,
  FAQ: siteConfig.externalLinks.faq,
  /** このサイト自身のソースコード公開先（AGPL-3.0 第13条） */
  SOURCE_CODE: siteConfig.sourceCodeUrl,
} as const;
