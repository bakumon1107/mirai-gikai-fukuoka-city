/** 歳入・歳出・人口の分析コメントを生成する純粋関数（データドリブン） */
import type { FinanceData, FinanceSeries } from "../types";
import { valueForYear } from "./finance-analysis";
import { thousandYenToYen } from "./finance-format";

function pickSeries(list: FinanceSeries[], name: string): FinanceSeries | null {
  return list.find((s) => s.item === name) ?? null;
}

/** from→to の増減率（%）。from が 0/欠損なら null */
function growthPct(
  series: FinanceSeries | null,
  from: number,
  to: number
): number | null {
  if (!series) return null;
  const a = valueForYear(series, from);
  const b = valueForYear(series, to);
  if (a === null || b === null || a === 0) return null;
  return ((b - a) / a) * 100;
}

function pctOf(part: number | null, whole: number | null): number | null {
  if (part === null || whole === null || whole === 0) return null;
  return (part / whole) * 100;
}

function fmtPct(n: number | null, digits = 1): string {
  return n === null ? "—" : `${n.toFixed(digits)}%`;
}

/** 円 → 万円（小数1桁） */
function toMan(yen: number | null): string {
  return yen === null ? "—" : `${(yen / 10_000).toFixed(1)}万円`;
}

function range(years: number[]): { first: number; last: number } | null {
  if (years.length < 2) return null;
  const sorted = [...years].sort((a, b) => a - b);
  return { first: sorted[0], last: sorted[sorted.length - 1] };
}

/** 歳入（収入構造）の分析コメント */
export function buildRevenueCommentary(
  data: FinanceData,
  selfPct: number | null,
  zaiseiRyoku: number | null
): string[] {
  const r = range(data.years);
  if (!r) return [];
  const out: string[] = [];
  const tax = pickSeries(data.revenue, "地方税");
  const kokko = pickSeries(data.revenue, "国庫支出金");

  if (selfPct !== null) {
    const ryoku =
      zaiseiRyoku !== null
        ? `財政力指数は${zaiseiRyoku.toFixed(2)}で、自前で財源を賄う力は比較的高い水準です。`
        : "";
    out.push(
      `歳入の約${fmtPct(selfPct)}を地方税などの「自主財源」でまかなっています。${ryoku}`
    );
  }
  const taxG = growthPct(tax, r.first, r.last);
  if (taxG !== null) {
    out.push(
      `地方税は${r.first}→${r.last}年度で約${fmtPct(taxG, 0)}変化し、歳入の柱として${taxG >= 0 ? "安定的に伸びて" : "推移して"}います。`
    );
  }
  const kokkoG = growthPct(kokko, r.first, r.last);
  if (kokkoG !== null) {
    out.push(
      `国庫支出金は新型コロナ対策で${r.first}年度に大きく膨らんだ後、${r.last}年度にかけて約${fmtPct(Math.abs(kokkoG), 0)}${kokkoG < 0 ? "減少" : "増加"}しました。`
    );
  }
  return out;
}

/** 歳出（使いみち）の分析コメント */
export function buildExpenditureCommentary(
  data: FinanceData,
  expenditureTotalYen: number | null,
  shoraiFutan: number | null
): string[] {
  const r = range(data.years);
  if (!r) return [];
  const out: string[] = [];
  const minsei = pickSeries(data.expenditure, "民生費");
  const kosai = pickSeries(data.expenditure, "公債費");

  if (minsei) {
    const latestMinseiYen = thousandYenToYen(valueForYear(minsei, r.last) ?? 0);
    const share = pctOf(latestMinseiYen, expenditureTotalYen);
    const g = growthPct(minsei, r.first, r.last);
    out.push(
      `最も大きい歳出は「民生費（福祉）」で、歳出全体の約${fmtPct(share)}を占めます。${r.first}→${r.last}年度で約${fmtPct(g ?? 0, 0)}増え、高齢化や子育て支援の重みが増しています。`
    );
  }
  if (kosai) {
    const kosaiYen = thousandYenToYen(valueForYear(kosai, r.last) ?? 0);
    const share = pctOf(kosaiYen, expenditureTotalYen);
    const futan =
      shoraiFutan !== null
        ? `将来世代の負担を示す「将来負担比率」は改善傾向（直近${fmtPct(shoraiFutan)}）にあります。`
        : "";
    out.push(`借金の返済（公債費）は歳出の約${fmtPct(share)}です。${futan}`);
  }
  return out;
}

/** 人口と財政の分析コメント（1人あたりの動き） */
export function buildPopulationCommentary(
  data: FinanceData,
  perCapitaExpenditure: { first: number | null; last: number | null },
  perCapitaWelfare: { first: number | null; last: number | null }
): string[] {
  const r = range(data.years);
  if (!r || !data.population) return [];
  const out: string[] = [];
  const popFirst = data.population.find((p) => p.year === r.first)?.value;
  const popLast = data.population.find((p) => p.year === r.last)?.value;
  if (popFirst && popLast) {
    const diffMan = (popLast - popFirst) / 10_000;
    out.push(
      `人口は${r.first}→${r.last}年度で約${diffMan.toFixed(1)}万人${diffMan >= 0 ? "増えました" : "減りました"}（${(popLast / 10_000).toFixed(1)}万人）。`
    );
  }
  if (
    perCapitaExpenditure.first !== null &&
    perCapitaExpenditure.last !== null
  ) {
    out.push(
      `市民1人あたりの歳出は ${toMan(perCapitaExpenditure.first)}→${toMan(perCapitaExpenditure.last)} と推移しています（コロナ対策の縮小が影響）。`
    );
  }
  if (perCapitaWelfare.first !== null && perCapitaWelfare.last !== null) {
    out.push(
      `一方で1人あたりの福祉（民生費）は ${toMan(perCapitaWelfare.first)}→${toMan(perCapitaWelfare.last)} へと増加。人口が増える中でも、市民1人にかかる福祉コストは年々重くなっています。`
    );
  }
  return out;
}
