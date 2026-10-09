import { cn } from "@/lib/utils";
import type { Stance } from "../../shared/types";
import { getStanceClass } from "../../shared/utils/stance";

type Props = {
  stance: Stance;
};

export function StancePill({ stance }: Props) {
  return (
    <span
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold",
        getStanceClass(stance)
      )}
    >
      {stance}
    </span>
  );
}
