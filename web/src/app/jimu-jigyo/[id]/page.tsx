import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JimuJigyoDetailPage } from "@/features/jimu-jigyo/server/components/jimu-jigyo-detail-page";
import {
  getAllJimuJigyoIds,
  loadJimuJigyoDetail,
} from "@/features/jimu-jigyo/server/loaders/load-jimu-jigyo-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getAllJimuJigyoIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = await loadJimuJigyoDetail(id);
  if (!record) return { title: "事業が見つかりません" };
  return {
    title: `${record.事業名} | 事務事業評価`,
    description: `${record.所管局}・${record.所管課}が実施する「${record.事業名}」の評価スコアと詳細情報です。`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const record = await loadJimuJigyoDetail(id);
  if (!record) notFound();
  return <JimuJigyoDetailPage record={record} />;
}
