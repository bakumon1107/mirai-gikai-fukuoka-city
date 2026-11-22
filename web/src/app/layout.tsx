// フォントは npm パッケージ（@fontsource、SIL Open Font License 1.1）から同梱する。
// next/font/google はビルド中に Google Fonts から取得するため、取得に失敗するとビルドが止まる
// （Noto Sans JP は文字の範囲ごとに100以上のファイルに分かれていて、失敗しやすい）。
// CSS 変数 --font-noto-sans-jp / --font-lexend-giga は globals.css の :root で定義している。
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/lexend-giga/400.css";
import "@fontsource/lexend-giga/500.css";
import "@fontsource/lexend-giga/700.css";
import "@fontsource/lexend-giga/800.css";
import "@fontsource/lexend-giga/900.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import { brandColors } from "@/config/brand";
import { siteConfig } from "@/config/site.config";
import type { ReactNode } from "react";
import { env } from "@/lib/env";

const isDev = process.env.NODE_ENV === "development";
const ogImage = {
  url: "/ogp.jpg",
  width: 1200,
  height: 630,
  alt: `${siteConfig.siteName}のOGPイメージ`,
};

export const metadata: Metadata = {
  metadataBase: new URL(env.webUrl),
  title: siteConfig.siteName,
  description: siteConfig.siteDescription,
  keywords: [...siteConfig.keywords],
  icons: {
    icon: isDev
      ? "/icons/pwa/icon_dev_192_v3.png"
      : "/icons/pwa/icon_android_192.png",
    apple: "/icons/pwa/icon_ios.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.siteDescription,
    images: [ogImage],
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.siteDescription,
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  /** globals.css の --primary と揃えること（FORK_GUIDELINES 4. カラーテーマの変更） */
  themeColor: "#4f6d8c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased bg-mirai-surface-light">
        <NextTopLoader showSpinner={false} color={brandColors.primary} />
        {children}
      </body>
    </html>
  );
}
