import "server-only";
import Link from "next/link";
import { GradeSummaryChart } from "../../client/components/grade-summary-chart";
import { JimuJigyoCard } from "../../client/components/jimu-jigyo-card";
import {
  JimuJigyoFilterBar,
  filterAndSort,
} from "../../client/components/jimu-jigyo-filter-bar";
import {
  type JimuJigyoYear,
  getGradeSummary,
  loadJimuJigyoList,
} from "../loaders/load-jimu-jigyo-list";

type Props = {
  year: JimuJigyoYear;
  basePath: string;
  searchParams: {
    kyoku?: string;
    grade?: string;
    flag?: string;
    sort?: string;
  };
};

export async function JimuJigyoListPage({
  year,
  basePath,
  searchParams,
}: Props) {
  const allRecords = await loadJimuJigyoList(year);
  const summary = await getGradeSummary(allRecords);

  const kyokuList = [...new Set(allRecords.map((r) => r.所管局))].sort((a, b) =>
    a.localeCompare(b, "ja")
  );

  const filtered = filterAndSort(allRecords, {
    kyoku: searchParams.kyoku ?? "",
    grade: searchParams.grade ?? "",
    flag: searchParams.flag ?? "",
    sort: searchParams.sort ?? "score_asc",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-mirai-text">
          事務事業評価（令和6年度）
        </h1>
        <p className="text-sm text-mirai-text-secondary mt-1">
          福岡市 {summary.total}事業の執行状況を市民の目線で評価します。
        </p>
        <div className="mt-2">
          <Link
            href="/jimu-jigyo/about-score"
            className="text-sm text-grade-b underline"
          >
            このスコアの計算方法について →
          </Link>
        </div>

        {/* 監視者注意書き */}
        <div className="mt-4 p-3 bg-mirai-surface-warm border border-mirai-border rounded-lg text-xs text-mirai-text-secondary">
          ⚠️ このページは市民・議員の視点から、行政の自己評価ではなく
          <strong>客観的な指標達成状況</strong>を可視化したものです。
          スコアは公開データをもとに算出した参考値であり、事業の優劣を断定するものではありません。
        </div>
      </div>

      {/* サマリーチャート */}
      <GradeSummaryChart
        counts={summary.counts}
        total={summary.total}
        averageScore={summary.averageScore}
        totalBudgetManYen={summary.totalBudgetManYen}
      />

      {/* フィルター */}
      <JimuJigyoFilterBar kyokuList={kyokuList} />

      {/* 件数 */}
      <p className="text-sm text-mirai-text-secondary">
        {filtered.length}件表示
        {filtered.length !== allRecords.length &&
          `（全${allRecords.length}件中）`}
      </p>

      {/* カードグリッド */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 pc:grid-cols-3 gap-4">
          {filtered.map((record) => (
            <JimuJigyoCard
              key={record.id}
              record={record}
              basePath={basePath}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-mirai-text-muted">
          条件に合う事業が見つかりませんでした。
        </div>
      )}
    </div>
  );
}
