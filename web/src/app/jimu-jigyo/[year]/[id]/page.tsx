import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JimuJigyoDetailPage } from "@/features/jimu-jigyo/server/components/jimu-jigyo-detail-page";
import {
  getAllJimuJigyoIds,
  loadJimuJigyoDetail,
} from "@/features/jimu-jigyo/server/loaders/load-jimu-jigyo-detail";
import {
  isValidYear,
  type JimuJigyoYear,
} from "@/features/jimu-jigyo/server/loaders/load-jimu-jigyo-list";

// generateStaticParams が空でも動的レンダリングにフォールバックする
export const dynamicParams = true;

type Props = {
  params: Promise<{ year: string; id: string }>;
};

export async function generateStaticParams() {
  const years: JimuJigyoYear[] = ["r6"];
  const result = [];
  for (const year of years) {
    const ids = await getAllJimuJigyoIds(year);
    for (const id of ids) {
      result.push({ year, id });
    }
  }
  return result;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, id } = await params;
  if (!isValidYear(year)) return { title: "事業が見つかりません" };
  const record = await loadJimuJigyoDetail(year, id);
  if (!record) return { title: "事業が見つかりません" };
  return {
    title: `${record.事業名} | 事務事業評価`,
    description: `${record.所管局}・${record.所管課}が実施する「${record.事業名}」の評価スコアと詳細情報です。`,
  };
}

export default async function Page({ params }: Props) {
  const { year, id } = await params;
  if (!isValidYear(year)) notFound();
  const record = await loadJimuJigyoDetail(year, id);
  if (!record) notFound();
  return (
    <JimuJigyoDetailPage record={record} basePath={`/jimu-jigyo/${year}`} />
  );
}
