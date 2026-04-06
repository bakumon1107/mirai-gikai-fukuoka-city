import Link from "next/link";
import type { CouncilSession } from "@/features/council-sessions/shared/types";
import { formatSessionPeriod } from "@/features/council-sessions/shared/utils/group-sessions-by-year";
import type { BillWithContent } from "../../shared/types";
import { CompactBillCard } from "../../client/components/bill-list/compact-bill-card";

interface SessionBillsPageProps {
  session: CouncilSession;
  bills: BillWithContent[];
}

export function SessionBillsPage({ session, bills }: SessionBillsPageProps) {
  const period = formatSessionPeriod(session);

  return (
    <div className="flex flex-col gap-6">
      {/* ヘッダー */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-mirai-text">{session.name}</h1>
        <p className="text-sm text-mirai-text-secondary">
          {period} ・ 議案 {bills.length}件
        </p>
      </div>

      {/* 議案リスト */}
      {bills.length === 0 ? (
        <p className="text-mirai-text-secondary text-sm py-8 text-center">
          このページの議案はまだ掲載されていません
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {bills.map((bill) => (
            <Link key={bill.id} href={`/bills/${bill.id}`}>
              <CompactBillCard bill={bill} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
