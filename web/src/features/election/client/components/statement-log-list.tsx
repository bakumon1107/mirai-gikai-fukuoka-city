"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { StatementLog } from "../../shared/types";
import {
  formatStatementDate,
  sortStatementsNewestFirst,
} from "../../shared/utils/statement-log";

type Props = {
  log: StatementLog[];
};

/**
 * 発言の記録。畳んだ状態が既定で、開いても閉じた状態のカードの高さは変わらない。
 * 要約（summary）の根拠がここに残るので、要約の書き換えを後から検証できる。
 */
export function StatementLogList({ log }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (log.length === 0) {
    return null;
  }

  const statements = sortStatementsNewestFirst(log);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mt-3 border-t border-mirai-surface-grouped pt-2.5"
    >
      <CollapsibleTrigger className="flex cursor-pointer items-center gap-1 text-[11.5px] font-bold text-primary-accent transition-colors hover:text-primary-deep">
        発言の記録 {log.length}件 を{isOpen ? "閉じる" : "見る"}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-2.5 flex flex-col gap-2">
          {statements.map((statement) => (
            <li
              key={`${statement.date}-${statement.source}-${statement.text}`}
              className="rounded-lg bg-mirai-surface px-3.5 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-lexend text-[9.5px] text-primary-deep">
                  {formatStatementDate(statement.date)}
                </span>
                <span className="rounded-sm border border-mirai-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-mirai-text-note">
                  {statement.place}
                </span>
                <span className="text-[10px] text-mirai-text-muted">
                  {statement.source}
                </span>
                {statement.url && (
                  <a
                    href={statement.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 text-[10px]"
                  >
                    出典
                    <ExternalLink className="size-2.5" />
                  </a>
                )}
              </div>
              <p className="mt-1.5 text-xs leading-[1.85] text-mirai-text-secondary text-pretty">
                {statement.text}
              </p>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
