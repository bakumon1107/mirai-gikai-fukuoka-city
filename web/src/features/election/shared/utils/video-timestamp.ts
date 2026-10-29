/**
 * 動画のURLに再生開始位置を付ける。"01:23:45" → "...&t=5025s"
 *
 * 長い討論会などは発言ごとにその位置から再生できるようにし、
 * 読み手が要約と元の発言を照らし合わせられるようにする。
 * 時刻の書式が崩れていたら、位置を付けずに元のURLを返す（ずれた位置に飛ばさない）。
 */
export function withVideoTimestamp(url: string, hms: string): string {
  const match = /^(\d{1,2}):([0-5]\d):([0-5]\d)$/.exec(hms);
  if (!match) {
    return url;
  }
  const [, hours, minutes, seconds] = match;
  const total = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${total}s`;
}
