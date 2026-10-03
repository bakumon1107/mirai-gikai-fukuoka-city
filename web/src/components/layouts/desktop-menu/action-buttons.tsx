import { LinkButton } from "@/components/top/link-button";
import { siteConfig } from "@/config/site.config";

/**
 * デスクトップメニュー: アクションボタン（サイドバー内）
 *
 * 党への寄附リンクは公式運営時（showTeamMiraiSection=true）のみ表示する。
 * 非公式運営のサイトから党の寄附ページへ誘導しないこと。
 */
export function DesktopMenuActionButtons() {
  const { aboutNote, donation } = siteConfig.externalLinks;
  const showDonation = siteConfig.features.showTeamMiraiSection && donation;

  if (!aboutNote && !showDonation) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {aboutNote && (
        <LinkButton
          href={aboutNote}
          icon={{
            src: "/icons/note-icon.png",
            alt: "note",
            width: 20,
            height: 20,
          }}
        >
          {siteConfig.siteName}とは
        </LinkButton>
      )}

      {showDonation && (
        <LinkButton
          href={donation}
          icon={{
            src: "/icons/heart-icon.svg",
            alt: "寄附",
            width: 20,
            height: 20,
          }}
        >
          寄附で応援する
        </LinkButton>
      )}
    </div>
  );
}
