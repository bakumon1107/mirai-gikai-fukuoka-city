"use client";

type Props = {
  label: string;
  r5Actual?: number | string | null;
  r6Actual?: number | string | null;
  r6Target?: number | null;
  unit?: string;
};

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

export function KpiProgressBar({
  label,
  r5Actual,
  r6Actual,
  r6Target,
  unit = "",
}: Props) {
  const r5 = toNum(r5Actual);
  const r6 = toNum(r6Actual);
  const target = toNum(r6Target);

  const rate =
    r6 !== null && target !== null && target > 0 ? r6 / target : null;
  const barWidth = rate !== null ? Math.min(rate * 100, 100) : null;
  const isImproving = r5 !== null && r6 !== null && r6 >= r5;
  const barColor = isImproving ? "bg-grade-a" : "bg-grade-d";

  const diff =
    r5 !== null && r6 !== null
      ? `${r6 >= r5 ? "+" : ""}${((r6 - r5) / (r5 || 1)) * 100 >= 0 ? "+" : ""}${Math.round(((r6 - r5) / (r5 || 1)) * 100)}%`
      : null;

  return (
    <div className="space-y-1">
      <p className="text-xs text-mirai-text-secondary line-clamp-1">{label}</p>
      <div className="flex items-center gap-2 text-xs text-mirai-text">
        {r5 !== null && (
          <span className="shrink-0">
            R5: {r5.toLocaleString()}
            {unit}
          </span>
        )}
        <span className="text-mirai-text-muted">→</span>
        {r6 !== null && (
          <span className="font-medium shrink-0">
            R6: {r6.toLocaleString()}
            {unit}
          </span>
        )}
        {diff && (
          <span
            className={`shrink-0 ${isImproving ? "text-grade-a" : "text-grade-d"}`}
          >
            ({diff})
          </span>
        )}
        {target !== null && (
          <span className="text-mirai-text-muted shrink-0">
            目標:{target.toLocaleString()}
            {unit}
          </span>
        )}
      </div>
      {barWidth !== null && (
        <div className="relative h-2 rounded-full bg-mirai-surface-light overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-2 rounded-full transition-all progress-fill ${barColor}`}
            style={
              { "--progress-width": `${barWidth}%` } as React.CSSProperties
            }
          />
        </div>
      )}
      {typeof r6Actual === "string" && (
        <p className="text-xs text-mirai-text-muted italic">{r6Actual}</p>
      )}
    </div>
  );
}
