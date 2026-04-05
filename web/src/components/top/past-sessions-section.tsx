import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CouncilSession } from "@/features/council-sessions/shared/types";

interface PastSessionsSectionProps {
  sessions: CouncilSession[];
  activeSessionYear: number | null;
}

const MAX_VISIBLE_SESSIONS = 5;

export function PastSessionsSection({
  sessions,
  activeSessionYear,
}: PastSessionsSectionProps) {
  // 当年（アクティブ会期と同じ年）のセッションを最大5件取得
  const filteredSessions = activeSessionYear
    ? sessions
        .filter(
          (s) => new Date(s.start_date).getFullYear() === activeSessionYear
        )
        .slice(0, MAX_VISIBLE_SESSIONS)
    : sessions.slice(0, MAX_VISIBLE_SESSIONS);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold text-black leading-[1.48]">
          過去の定例会
        </h2>
        <p className="text-xs text-mirai-text-secondary">
          過去に開催された定例会の議案をご覧いただけます
        </p>
      </div>

      {filteredSessions.length === 0 ? (
        <p className="text-mirai-text-secondary text-sm py-4">
          過去の定例会はまだ掲載されていません。
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-mirai-border">
          {filteredSessions.map((session) => {
            if (!session.slug) return null;
            return (
              <li key={session.id}>
                <Link
                  href={`/sessions/${session.slug}/bills`}
                  className="flex items-center justify-between py-4 px-2 hover:bg-mirai-surface-grouped rounded-lg transition-colors group"
                >
                  <span className="font-bold text-mirai-text text-base">
                    {session.name}
                  </span>
                  <ChevronRight className="h-5 w-5 text-mirai-text-muted group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex justify-center">
        <Button variant="outline" size="lg" asChild className="rounded-full">
          <Link href="/sessions">さらに前の議会を一覧で表示</Link>
        </Button>
      </div>
    </section>
  );
}
