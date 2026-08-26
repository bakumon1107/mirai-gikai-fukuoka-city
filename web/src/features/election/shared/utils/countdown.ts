const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export type Countdown = {
  /** 残り日数（切り捨て）。締切を過ぎた場合は 0 */
  days: number;
  /** 残り時間の HH:MM:SS 表記。締切を過ぎた場合は "00:00:00" */
  clock: string;
};

/**
 * 投票締切までの残り時間を算出する。
 * 締切を過ぎた場合は負値にせず 0 にクランプする。
 */
export function getCountdown(now: Date, targetIso: string): Countdown {
  const remaining = Math.max(0, new Date(targetIso).getTime() - now.getTime());

  const days = Math.floor(remaining / MS_PER_DAY);
  const hours = Math.floor((remaining % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((remaining % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((remaining % MS_PER_MINUTE) / MS_PER_SECOND);

  return { days, clock: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
