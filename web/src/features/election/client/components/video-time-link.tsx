import { Play } from "lucide-react";
import { withVideoTimestamp } from "../../shared/utils/video-timestamp";

type Props = {
  videoUrl: string;
  /** "01:23:45" 形式 */
  time: string;
};

/**
 * 動画をその位置から再生するリンク。
 * 要約はこちらの言い換えなので、どの発言にも元の発言を確かめる道を付ける。
 */
export function VideoTimeLink({ videoUrl, time }: Props) {
  return (
    <a
      href={withVideoTimestamp(videoUrl, time)}
      target="_blank"
      rel="noreferrer"
      aria-label={`動画の${time}から再生する`}
      className="inline-flex shrink-0 items-center gap-0.5 rounded-sm border border-mirai-border bg-card px-1.5 py-0.5 font-lexend text-[9.5px] font-medium text-primary-deep no-underline transition-colors hover:border-primary"
    >
      <Play className="size-2.5 fill-current" />
      {time}
    </a>
  );
}
