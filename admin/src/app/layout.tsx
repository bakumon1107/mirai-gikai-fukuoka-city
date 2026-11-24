// フォントは Vercel 公式の geist パッケージ（SIL Open Font License 1.1）から同梱する。
// next/font/google はビルド中に Google Fonts から取得するため、取得に失敗するとビルドが止まる。
// CSS 変数名（--font-geist-sans / --font-geist-mono）は next/font/google のときと同じ。
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site.config";

const geistSans = GeistSans;
const geistMono = GeistMono;

const isDev = process.env.NODE_ENV === "development";

export const metadata: Metadata = {
  title: `${siteConfig.siteName} Admin`,
  description: `${siteConfig.siteName}の管理者向けダッシュボード`,
  icons: {
    icon: isDev ? "/icons/pwa/icon_admin_dev.svg" : "/icons/pwa/icon_admin.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#3b82f6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
