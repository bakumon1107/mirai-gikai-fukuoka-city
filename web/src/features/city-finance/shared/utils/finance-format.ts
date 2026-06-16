/** 金額・割合の表示整形（純粋関数） */

/** 千円 → 円 */
export function thousandYenToYen(thousandYen: number): number {
  return thousandYen * 1000;
}

/** 円 → 億円（数値） */
export function yenToOku(yen: number): number {
  return yen / 100_000_000;
}

/**
 * 円を市民にわかりやすい単位で整形する。
 * 例: 1,131,768,000,000 → "1兆1,318億円"
 */
export function formatJapaneseYen(yen: number): string {
  if (!Number.isFinite(yen)) return "—";
  const sign = yen < 0 ? "−" : "";
  const abs = Math.abs(yen);
  const oku = Math.floor(abs / 100_000_000);
  if (oku >= 10_000) {
    const cho = Math.floor(oku / 10_000);
    const rest = oku % 10_000;
    return rest > 0
      ? `${sign}${cho}兆${rest.toLocaleString("ja-JP")}億円`
      : `${sign}${cho}兆円`;
  }
  if (oku >= 1) return `${sign}${oku.toLocaleString("ja-JP")}億円`;
  const man = Math.round(abs / 10_000);
  if (man >= 1) return `${sign}${man.toLocaleString("ja-JP")}万円`;
  return `${sign}${Math.round(abs).toLocaleString("ja-JP")}円`;
}

/** 円を「◯億円」で簡潔に（兆未満は億、兆以上は兆＋億） */
export function formatOku(yen: number): string {
  return formatJapaneseYen(yen);
}

/** 割合（%）を整形。例 33.913 → "33.9%" */
export function formatPct(pct: number, digits = 1): string {
  if (!Number.isFinite(pct)) return "—";
  return `${pct.toFixed(digits)}%`;
}

/**
 * 西暦年度を和暦年度表記にする。令和元年度（2019）に対応。
 * 2019年度以降は令和、それ以前は西暦のまま返す。
 */
export function formatReiwaFiscalYear(year: number): string {
  if (year < 2019) return `${year}年度`;
  const n = year - 2018;
  return n === 1 ? "令和元年度" : `令和${n}年度`;
}

/** 1人あたり金額（円）を整形。例 690000 → "約69.0万円" */
export function formatPerCapita(yenPerPerson: number): string {
  if (!Number.isFinite(yenPerPerson)) return "—";
  const man = yenPerPerson / 10_000;
  if (man >= 1) return `約${man.toFixed(1)}万円`;
  return `約${Math.round(yenPerPerson).toLocaleString("ja-JP")}円`;
}
