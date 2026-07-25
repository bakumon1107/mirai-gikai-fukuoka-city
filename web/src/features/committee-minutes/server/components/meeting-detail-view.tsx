import "server-only";
import { ArrowLeft, CalendarDays, FileText } from "lucide-react";
import Link from "next/link";
import type { CommitteeMeetingDetail } from "../../shared/types";
import { getCommitteeTypeLabel } from "../../shared/utils/committee-type";
import { formatJapaneseDate } from "../../shared/utils/format-japanese-date";

type Props = {
  meeting: CommitteeMeetingDetail;
};

export function MeetingDetailView({ meeting }: Props) {
  const transcriptPath = `/committees/${meeting.committeeSlug}/${meeting.sourceDocumentId}/transcript`;
  const exchangeCount = meeting.speeches.filter(
    (s) => s.speakerType !== "note"
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href={`/committees/${meeting.committeeSlug}`}
          className="inline-flex items-center gap-1 text-sm text-mirai-text-muted hover:text-mirai-text"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {meeting.committeeName}の一覧へ戻る
        </Link>
        <div className="rounded-2xl bg-gradient-to-br from-mirai-gradient-start to-mirai-gradient-end px-6 py-6 flex flex-col gap-2">
          <span className="text-xs font-medium text-primary-accent bg-white/70 rounded-full px-3 py-1 w-fit">
            {getCommitteeTypeLabel(meeting.committeeType)}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-mirai-text leading-snug">
            {meeting.committeeName}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-mirai-text-secondary">
            <CalendarDays className="w-4 h-4" />
            {formatJapaneseDate(meeting.meetingDate)} 開催
          </p>
          {meeting.summary && (
            <p className="mt-1 text-sm text-mirai-text-secondary leading-relaxed">
              {meeting.summary}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-mirai-border bg-white p-5">
        <Link
          href={transcriptPath}
          className="inline-flex items-center gap-2 font-bold text-primary-accent hover:underline"
        >
          <FileText className="w-4 h-4" />
          発言のやり取りを読む（質疑・答弁{exchangeCount}件）
        </Link>
        <p className="mt-2 text-xs text-mirai-text-muted">
          チャット形式で会議のやり取りを読めます。わかりやすい表現と原文を切り替えられます。
        </p>
      </div>
    </div>
  );
}
