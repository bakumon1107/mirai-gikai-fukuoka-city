import { cn } from "@/lib/utils";

type Props = {
  /** 表明順（告示後は届出順）の番号。"01" 形式 */
  no: string;
  size?: "sm" | "md" | "lg";
  /** 番号の上に添える小さな見出し（「表明順」「届出順」）。lg のときだけ表示する */
  label?: string;
  /** 立候補を取りやめた人の番号。番号は残し、配色だけ灰色にする */
  muted?: boolean;
};

const SIZE_CLASS = {
  sm: "size-8 rounded-md text-[11px]",
  md: "size-10 rounded-lg text-[13px]",
  lg: "size-[52px] rounded-[10px] text-[17px]",
} as const;

/**
 * 候補者の番号マーク。顔写真は載せない方針のため、写真枠の代わりに置く。
 * 候補者ごとに色を変えると見た目で差が付くので、全員同じ配色にそろえる。
 */
export function CandidateNumber({ no, size = "md", label, muted }: Props) {
  const showLabel = size === "lg" && label;
  return (
    <span
      className={cn(
        "flex shrink-0 flex-col items-center justify-center font-lexend font-bold leading-none",
        muted
          ? "bg-mirai-surface-grouped text-mirai-text-muted"
          : "bg-mirai-gradient text-primary-darkest",
        SIZE_CLASS[size]
      )}
    >
      {showLabel && (
        <span className="mb-1 font-sans text-[8.5px] font-bold tracking-[0.06em] text-primary-deep">
          {label}
        </span>
      )}
      {no}
    </span>
  );
}
