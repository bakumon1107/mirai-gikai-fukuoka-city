import { mockGeneralQuestions } from "@/app/dev/_lib/mock-data";
import { OverviewClient } from "./_components/overview-client";

export default function OverviewDevPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-mirai-text mb-1">
        一般質問 概観ビュー（案）
      </h1>
      <p className="text-sm text-mirai-text-secondary mb-8">
        テーマタグで絞り込み、どの議員が何を質問しているか一覧で把握できる
      </p>
      <OverviewClient questions={mockGeneralQuestions} />
    </div>
  );
}
