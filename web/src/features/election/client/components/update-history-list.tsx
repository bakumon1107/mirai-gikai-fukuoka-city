"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { UpdateEntry } from "../../shared/types";
import { formatStatementDate } from "../../shared/utils/statement-log";
import { sortUpdatesNewestFirst } from "../../shared/utils/update-history";

/** 畳まずに見せる件数。それより古いものは「それ以前の更新」に畳む */
const VISIBLE_COUNT = 3;

type Props = {
  entries: UpdateEntry[];
};

function UpdateRows({ entries }: Props) {
  return (
    <ul className="flex flex-col">
      {entries.map((entry, index) => (
        <li
          key={`${entry.date}-${index}-${entry.text}`}
          className="grid grid-cols-[88px_1fr] gap-2.5 border-b border-mirai-surface-grouped py-2 last:border-b-0"
        >
          <span className="font-lexend text-[10px] leading-[1.9] text-primary-deep">
            {formatStatementDate(entry.date)}
          </span>
          <span className="text-[11.5px] leading-[1.8] text-mirai-text-secondary">
            {entry.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** このページへの反映の記録。新しい順に並べ、古い分は畳む */
export function UpdateHistoryList({ entries }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (entries.length === 0) {
    return null;
  }

  const sorted = sortUpdatesNewestFirst(entries);
  const recent = sorted.slice(0, VISIBLE_COUNT);
  const older = sorted.slice(VISIBLE_COUNT);

  return (
    <div>
      <UpdateRows entries={recent} />
      {older.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <div className="border-t border-mirai-surface-grouped">
              <UpdateRows entries={older} />
            </div>
          </CollapsibleContent>
          <CollapsibleTrigger className="mt-1.5 flex cursor-pointer items-center gap-1 text-[11px] font-bold text-primary-accent transition-colors hover:text-primary-deep">
            {isOpen ? "閉じる" : `それ以前の更新 ${older.length}件 を見る`}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
        </Collapsible>
      )}
    </div>
  );
}
