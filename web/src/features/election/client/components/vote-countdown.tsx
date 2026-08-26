"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "../../shared/utils/countdown";

type Props = {
  voteClosesAt: string;
  /** サーバー側で算出した残り日数。マウント前はこの値だけを描画する */
  initialDays: number;
};

/**
 * 投票締切までのカウントダウン。
 * 秒表示はサーバーとクライアントで必ずずれるため、マウント後にのみ描画する。
 */
export function VoteCountdown({ voteClosesAt, initialDays }: Props) {
  const [days, setDays] = useState(initialDays);
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const countdown = getCountdown(new Date(), voteClosesAt);
      setDays(countdown.days);
      setClock(countdown.clock);
    };

    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [voteClosesAt]);

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="mr-0.5 text-[11px] font-bold text-primary-deep">
        投票日まで
      </span>
      <span className="font-lexend text-[40px] font-black leading-[0.9] tracking-[-0.05em] text-mirai-text">
        {days}
      </span>
      <span className="text-xs font-bold text-mirai-text-secondary">日</span>
      {clock && (
        <span className="ml-1.5 font-lexend text-[13px] text-mirai-text-muted tabular-nums">
          {clock}
        </span>
      )}
    </div>
  );
}
