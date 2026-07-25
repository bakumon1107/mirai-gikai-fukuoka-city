import "server-only";
import { ArrowLeft, CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CommitteeMeetingSummary } from "../../shared/types";
import { getCommitteeTypeLabel } from "../../shared/utils/committee-type";
import { formatJapaneseDate } from "../../shared/utils/format-japanese-date";

type Props = {
  meetings: CommitteeMeetingSummary[];
};

export function CommitteeArchiveView({ meetings }: Props) {
  const committeeName = meetings[0]?.committeeName ?? "委員会";
  const committeeType = meetings[0]?.committeeType ?? "standing";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/committees"
          className="inline-flex items-center gap-1 text-sm text-mirai-text-muted hover:text-mirai-text"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          委員会一覧へ戻る
        </Link>
        <div className="rounded-2xl bg-gradient-to-br from-mirai-gradient-start to-mirai-gradient-end px-6 py-6 flex flex-col gap-2">
          <span className="text-xs font-medium text-primary-accent bg-white/70 rounded-full px-3 py-1 w-fit">
            {getCommitteeTypeLabel(committeeType)}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-mirai-text leading-snug">
            {committeeName}
          </h1>
          <p className="text-sm text-mirai-text-secondary">
            開催日ごとの質疑・意見と答弁を、新しい順に並べています。
          </p>
        </div>
      </div>

      {meetings.length === 0 ? (
        <p className="text-sm text-mirai-text-muted">
          この委員会の記録は準備中です。
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {meetings.map((m) => (
            <li key={m.id}>
              <Link
                href={`/committees/${m.committeeSlug}/${m.sourceDocumentId}`}
                className="block rounded-2xl border border-mirai-border bg-white p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-mirai-text">
                  <CalendarDays className="w-4 h-4 text-primary-accent" />
                  {formatJapaneseDate(m.meetingDate)}
                </div>
                <p className="mt-3 text-sm text-mirai-text-secondary leading-relaxed line-clamp-3">
                  {m.summary ??
                    "委員から出された質疑・意見と、市の答弁を記録しています。"}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-accent">
                  くわしく見る
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
