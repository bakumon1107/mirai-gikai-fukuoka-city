import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div>
      <p className="font-lexend text-[9px] font-bold tracking-[0.22em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-2.5 text-[22px] font-bold tracking-[-0.025em] text-mirai-text">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-xs leading-[1.9] text-mirai-text-muted text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
