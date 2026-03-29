"use client";

type BadgeType = "new" | "expanded" | "continued" | null;

type BudgetInitiativeBadgeProps = {
  badge: BadgeType;
};

const BADGE_CONFIG: Record<
  NonNullable<BadgeType>,
  { label: string; className: string }
> = {
  new: {
    label: "新規",
    className:
      "bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded",
  },
  expanded: {
    label: "拡充",
    className:
      "bg-mirai-info-blue text-mirai-text text-xs font-semibold px-2 py-0.5 rounded",
  },
  continued: {
    label: "継続",
    className:
      "bg-mirai-surface-muted text-mirai-text-secondary text-xs font-semibold px-2 py-0.5 rounded",
  },
};

export function BudgetInitiativeBadge({ badge }: BudgetInitiativeBadgeProps) {
  if (!badge) return null;

  const config = BADGE_CONFIG[badge];
  return <span className={config.className}>{config.label}</span>;
}
