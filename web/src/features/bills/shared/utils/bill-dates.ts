/** 日付表示に使う議案の最小形 */
type BillDateSource = {
  submitted_date?: string | null;
  decided_date?: string | null;
  published_at?: string | null;
};

/**
 * 「提出」として表示する日付を返す
 *
 * 提出年月日は submitted_date に持つ。未設定の議案（カラム追加前に取り込んだもの）は
 * 従来どおり published_at を代わりに表示し、バックフィル完了後に submitted_date へ寄せる。
 */
export function resolveSubmittedDate(bill: BillDateSource): string | null {
  return bill.submitted_date ?? bill.published_at ?? null;
}

/**
 * 「議決」として表示する日付を返す
 *
 * 議決年月日は代替となる列がないため、未設定なら表示しない。
 */
export function resolveDecidedDate(bill: BillDateSource): string | null {
  return bill.decided_date ?? null;
}
