import { ExternalLink } from "lucide-react";
import type { FinanceData } from "../../shared/types";

/**
 * 出典・免責の表示。福岡市オープンデータの活用をページ上に明示する。
 */
export function FinanceSource({
  source,
  latestYear,
}: {
  source: FinanceData["source"];
  latestYear: number;
}) {
  return (
    <section className="rounded-lg border border-border bg-card px-5 py-4 text-sm text-mirai-text-secondary">
      <h2 className="text-base font-bold text-mirai-text">
        出典・ご利用にあたって
      </h2>
      <p className="mt-2">
        本ページは{" "}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary underline hover:opacity-80"
        >
          {source.name}（福岡市財政状況の推移）
          <ExternalLink className="h-3.5 w-3.5" />
        </a>{" "}
        の公開データを加工して作成しています（最新: {latestYear}年度
        {source.fetchedAt ? `／取得日 ${source.fetchedAt}` : ""}）。
      </p>
      <p className="mt-1">
        正確な内容は、出典元の公式資料をご確認ください。金額は表示の都合で四捨五入している場合があります。
      </p>
    </section>
  );
}
