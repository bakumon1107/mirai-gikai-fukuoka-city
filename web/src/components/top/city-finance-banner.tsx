import { ArrowRight, Coins } from "lucide-react";
import Link from "next/link";

/**
 * トップページから福岡市財政ページ（/finance）への導線バナー。
 */
export function CityFinanceBanner() {
  return (
    <Link
      href="/finance"
      className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg px-5 py-4 hover:border-primary transition-colors"
    >
      <div className="flex items-start gap-3">
        <Coins className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-mirai-text">福岡市のお金の使い道</p>
          <p className="mt-0.5 text-sm text-mirai-text-secondary">
            市の収入と支出、収入構造の移り変わりをわかりやすく解説します
          </p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-mirai-text-muted shrink-0" />
    </Link>
  );
}
