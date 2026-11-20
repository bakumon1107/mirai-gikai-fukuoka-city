/** "2026-10-29" → "10月29日"。形式が崩れていればそのまま返す */
export function formatMonthDayJa(date: string): string {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(date);
  return match ? `${Number(match[1])}月${Number(match[2])}日` : date;
}
