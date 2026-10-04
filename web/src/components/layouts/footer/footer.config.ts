import { isPlaceholderUrl } from "@/config/is-placeholder-url";
import { siteConfig } from "@/config/site.config";
import { routes } from "@/lib/routes";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterPolicyLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryLinks: FooterLink[] = [
  {
    label: "TOP",
    href: routes.home(),
  },
  ...(siteConfig.externalLinks.aboutNote
    ? [
        {
          label: `${siteConfig.siteName}とは`,
          href: siteConfig.externalLinks.aboutNote,
          external: true,
        },
      ]
    : []),
  ...(siteConfig.features.showTeamMiraiSection
    ? ([
        {
          label: "チームみらいについて",
          href: siteConfig.externalLinks.teamAbout,
          external: true,
        },
        {
          label: "寄附で応援する",
          href: siteConfig.externalLinks.donation,
          external: true,
        },
      ] as FooterLink[])
    : []),
];

export const policyLinks: FooterPolicyLink[] = [
  {
    label: "よくあるご質問",
    href: "/faq",
  },
  {
    label: "利用規約",
    href: routes.terms(),
  },
  {
    label: "プライバシーポリシー",
    href: routes.privacy(),
  },
  /**
   * AGPL-3.0 第13条により、稼働中のバージョンのソースコード入手手段の提示が必要。
   * siteConfig.sourceCodeUrl が未設定、またはテンプレートのプレースホルダのままの場合は
   * 表示されない（＝ライセンス違反状態）ため、fork 時は必ず自身の公開リポジトリ URL を
   * 設定すること。
   *
   * プレースホルダを弾くのは、404 するリンクを出すと「提示済み」に見えて
   * 違反に気づけなくなるため。リンクが無いほうが未設定だと分かる。
   */
  ...(isPlaceholderUrl(siteConfig.sourceCodeUrl)
    ? []
    : [
        {
          label: "ソースコード（GitHub）",
          href: siteConfig.sourceCodeUrl,
          external: true,
        },
      ]),
];
