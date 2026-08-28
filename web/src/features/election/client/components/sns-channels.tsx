import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SnsChannel } from "../../shared/types";
import {
  getConfirmedChannels,
  getSnsMeta,
  getUnconfirmedKinds,
} from "../../shared/utils/sns";

type Props = {
  sns: SnsChannel[];
  candidateName: string;
};

/**
 * 発信チャンネル。リンクの掲載のみで、タイムラインの埋め込みは行わない。
 * 確認できた人だけプレーヤーが出る状態を避け、全員を同じ見た目に揃えるため。
 */
export function SnsChannels({ sns, candidateName }: Props) {
  const confirmed = getConfirmedChannels(sns);
  const unconfirmed = getUnconfirmedKinds(sns);

  if (confirmed.length === 0) {
    return (
      <div className="rounded-xl border border-mirai-border bg-mirai-surface px-4.5 py-4">
        <p className="text-[13px] font-bold text-mirai-text">発信チャンネル</p>
        <p className="mt-1.5 text-[11.5px] leading-[1.8] text-mirai-text-note text-pretty">
          {candidateName}
          の公式サイトやSNSは、いまのところ確認できていません。本人のものと確認できた時点で掲載します。
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-mirai-border">
      <div className="flex items-center justify-between gap-3 bg-mirai-light-gradient px-4 py-3.5">
        <div>
          <p className="font-lexend text-[8.5px] font-bold tracking-[0.2em] text-primary">
            CHANNELS
          </p>
          <h2 className="mt-1 text-base font-bold text-mirai-text">
            発信チャンネル
          </h2>
        </div>
        <p className="shrink-0 text-[11px] text-mirai-text-muted">
          <span className="font-lexend text-[22px] font-extrabold text-mirai-text">
            {confirmed.length}
          </span>
          {" / "}
          {sns.length} 件を確認
        </p>
      </div>

      <ul className="grid gap-2.5 bg-card p-4 sm:grid-cols-2">
        {confirmed.map((channel) => {
          const meta = getSnsMeta(channel.kind);
          return (
            <li key={channel.kind}>
              <a
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "flex h-full flex-col rounded-xl border border-mirai-border border-t-[3px] bg-card transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-primary",
                  meta.borderClass
                )}
              >
                <span className="flex items-start gap-2.5 p-3">
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-[10px] text-[11px] font-bold text-white",
                      meta.tileClass
                    )}
                  >
                    {meta.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-mirai-text">
                      {channel.kind}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-[1.6] text-mirai-text-note">
                      {meta.description}
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-primary" />
                </span>
                <span className="block truncate border-t border-mirai-surface-grouped px-3 py-2 text-[10px] text-mirai-text-subtle">
                  {channel.handle}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-mirai-surface-muted bg-mirai-surface px-4 py-3">
        {unconfirmed.length > 0 && (
          <p className="text-[10.5px] leading-[1.7] text-mirai-text-muted">
            未確認：{unconfirmed.join("・")}
          </p>
        )}
        <p className="mt-1 text-[10.5px] leading-[1.7] text-mirai-text-muted text-pretty">
          本人のものと確認できたアカウントのみを掲載しています。内容の転載や埋め込みは行っていません。
        </p>
      </div>
    </div>
  );
}
