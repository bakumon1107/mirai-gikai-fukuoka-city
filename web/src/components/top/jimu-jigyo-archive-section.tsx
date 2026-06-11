import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function JimuJigyoArchiveSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold text-black leading-[1.48]">
          事務事業評価
        </h2>
        <p className="text-xs text-mirai-text-secondary">
          市が実施する事業のKPI・予算・効率の動向を年度ごとに分析します
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-mirai-border">
        <li>
          <Link
            href="/jimu-jigyo/r6"
            className="flex items-center justify-between py-4 px-2 hover:bg-mirai-surface-grouped rounded-lg transition-colors group"
          >
            <span className="font-bold text-mirai-text text-base">
              令和6年度（2024年度）事務事業評価
            </span>
            <ChevronRight className="h-5 w-5 text-mirai-text-muted group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </Link>
        </li>
      </ul>

      <div className="flex justify-center">
        <Button variant="outline" size="lg" asChild className="rounded-full">
          <Link href="/jimu-jigyo/r6">事務事業評価を一覧で表示</Link>
        </Button>
      </div>
    </div>
  );
}
