import { cn } from "@/lib/utils";
import type { Candidate } from "../../shared/types";
import {
  getCandidateInitial,
  getCandidatePhotoClass,
} from "../../shared/utils/candidate-photo";

type Props = {
  candidate: Candidate;
  /** 表明順（0始まり）。プレースホルダーの配色に使う */
  index: number;
  size: "hero" | "card" | "detail" | "row";
  /** PHOTO ラベルを出すか（実画像未提供であることの明示） */
  showPlaceholderLabel?: boolean;
};

const SIZE_CLASS = {
  hero: "w-full aspect-[3/4] rounded-[10px] shadow-candidate-photo-lg",
  card: "w-[88px] h-[112px] rounded-[9px] shadow-candidate-photo",
  detail: "w-[132px] h-[168px] rounded-[10px] shadow-candidate-photo",
  row: "w-[38px] h-[38px] rounded-lg",
} as const;

const INITIAL_CLASS = {
  hero: "text-[32px]",
  card: "text-[34px]",
  detail: "text-[46px]",
  row: "text-[15px]",
} as const;

/**
 * 顔写真のプレースホルダー。
 * 実画像の提供を受けたら、この中を aspect-ratio 固定の object-cover な画像に差し替える。
 */
export function CandidatePhoto({
  candidate,
  index,
  size,
  showPlaceholderLabel = false,
}: Props) {
  return (
    <div
      className={cn(
        "relative shrink-0 grid place-items-center overflow-hidden",
        SIZE_CLASS[size],
        getCandidatePhotoClass(index)
      )}
    >
      <span
        className={cn(
          "font-bold tracking-tight text-white/90",
          INITIAL_CLASS[size]
        )}
      >
        {getCandidateInitial(candidate.name)}
      </span>
      {size !== "row" && (
        <span className="absolute left-2 top-[7px] font-lexend text-[9.5px] font-extrabold tracking-wider text-white/90">
          {candidate.no}
        </span>
      )}
      {showPlaceholderLabel && (
        <span className="absolute inset-x-0 bottom-[5px] text-center text-[8px] tracking-[0.1em] text-white/80">
          PHOTO
        </span>
      )}
    </div>
  );
}
