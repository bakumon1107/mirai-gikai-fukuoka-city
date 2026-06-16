import {
  formatJapaneseYen,
  formatPct,
} from "../../shared/utils/finance-format";

export type CompositionBarItem = {
  label: string;
  amount: number;
  pct: number;
  /** バーの色トークン（Tailwindクラス）。省略時は primary */
  colorClass?: string;
};

type CompositionBarsProps = {
  items: CompositionBarItem[];
};

/**
 * 構成比を横棒で表示（CSSのみ・Server Component）。
 */
export function CompositionBars({ items }: CompositionBarsProps) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="font-medium text-mirai-text">{item.label}</span>
            <span className="text-mirai-text-secondary tabular-nums">
              {formatJapaneseYen(item.amount)}
              <span className="ml-2 text-mirai-text-muted">
                {formatPct(item.pct)}
              </span>
            </span>
          </div>
          <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-mirai-surface-muted">
            <div
              className={`h-full rounded-full ${item.colorClass ?? "bg-primary"}`}
              style={{ width: `${Math.max(item.pct, 1.5)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
