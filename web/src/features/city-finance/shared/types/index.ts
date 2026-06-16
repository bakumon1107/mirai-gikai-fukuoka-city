/** 取得スクリプトが出力する整形済み財政データの型 */

export type YearValue = { year: number; value: number };

export type FinanceSeries = {
  /** 項目名（例: 民生費, 地方税） */
  item: string;
  values: YearValue[];
};

export type FinanceData = {
  source: {
    name: string;
    url: string;
    datasetId: string;
    /** 取得日 YYYY-MM-DD */
    fetchedAt: string;
  };
  /** 金額の単位。CSVは千円 */
  unit: "thousand_yen";
  /** 収録年度（西暦, 昇順） */
  years: number[];
  /** 一般会計の推移（歳入総額・歳出総額 等の系列） */
  generalAccount: FinanceSeries[];
  /** 歳入の推移（財源別） */
  revenue: FinanceSeries[];
  /** 歳出目的別の推移（民生費・教育費 等） */
  expenditure: FinanceSeries[];
  /** 各年度の総人口（人）。未取得なら null */
  population: YearValue[] | null;
  /** 財政指標（%・指数）の推移。経常収支比率・財政力指数・実質公債費比率・将来負担比率 等 */
  indicators?: FinanceSeries[];
};

/** 単年の構成比表示用 */
export type CompositionItem = {
  label: string;
  /** 円 */
  amount: number;
  /** 構成比（%）。合計に対する割合 */
  pct: number;
};

/** 自主財源 / 依存財源の区分 */
export type RevenueKind = "self" | "dependent" | "other";
