import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * 非公式・AI整理であることの注記バー。
 * トップ・立候補予定者個別・争点比較の各画面に必ず配置する（中立性の担保）。
 */
export function DisclaimerBar({ children }: Props) {
  return (
    <div className="flex items-start gap-2.5 bg-mirai-surface border-b border-mirai-border px-6 py-3">
      <span className="shrink-0 mt-px rounded-sm border border-stance-neutral/40 px-1.5 py-0.5 text-[10px] font-bold text-stance-neutral">
        注記
      </span>
      <p className="text-[11px] leading-[1.8] text-mirai-text-note text-pretty">
        {children}
      </p>
    </div>
  );
}
