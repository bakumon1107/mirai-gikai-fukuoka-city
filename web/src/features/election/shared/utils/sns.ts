import type { SnsChannel, SnsKind } from "../types";

type SnsMeta = {
  /** アイコンタイルの文字。各社の公式ロゴは商標のため文字で代用する */
  icon: string;
  /** そのチャンネルが何に使われるかの一言 */
  description: string;
  tileClass: string;
  borderClass: string;
};

const SNS_META: Record<SnsKind, SnsMeta> = {
  公式サイト: {
    icon: "WEB",
    description: "政策や活動の一次情報",
    tileClass: "bg-sns-website",
    borderClass: "border-sns-website",
  },
  X: {
    icon: "X",
    description: "日々の発信",
    tileClass: "bg-sns-x",
    borderClass: "border-sns-x",
  },
  YouTube: {
    icon: "▶",
    description: "演説や対談の動画",
    tileClass: "bg-sns-youtube",
    borderClass: "border-sns-youtube",
  },
  TikTok: {
    icon: "♪",
    description: "短い動画",
    tileClass: "bg-sns-tiktok",
    borderClass: "border-sns-tiktok",
  },
  Instagram: {
    icon: "IG",
    description: "活動の写真",
    tileClass: "bg-sns-instagram",
    borderClass: "border-sns-instagram",
  },
  Facebook: {
    icon: "f",
    description: "告知や長めの投稿",
    tileClass: "bg-sns-facebook",
    borderClass: "border-sns-facebook",
  },
  note: {
    icon: "note",
    description: "まとまった文章",
    tileClass: "bg-sns-note",
    borderClass: "border-sns-note",
  },
};

export function getSnsMeta(kind: SnsKind): SnsMeta {
  return SNS_META[kind];
}

/** URLが確認できているチャンネルだけを返す */
export function getConfirmedChannels(sns: SnsChannel[]): SnsChannel[] {
  return sns.filter((channel) => channel.url !== "");
}

/** URLが確認できていないチャンネルの種別 */
export function getUnconfirmedKinds(sns: SnsChannel[]): SnsKind[] {
  return sns
    .filter((channel) => channel.url === "")
    .map((channel) => channel.kind);
}
