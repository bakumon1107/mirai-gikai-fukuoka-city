export type ReiwaYear = `R${number}`;
export type BudgetShubetsu = "決算" | "決算見込" | "予算";

export interface BudgetMeisai {
  年度: ReiwaYear;
  種別: BudgetShubetsu;
  会計区分: "一般会計" | "特別会計" | null;
  歳出: number;
  特定財源: number;
  一般財源: number;
}

export interface BudgetData {
  明細: BudgetMeisai[];
  備考: string | null;
}

export interface KpiItem {
  内容: string;
  目標?: Partial<Record<ReiwaYear, string | number | null>> & {
    最終年度?: string | null;
    最終年度目標値?: number | null;
  };
  実績?: Partial<Record<ReiwaYear, string | number | null>>;
  達成率?: Partial<Record<ReiwaYear, string | number | null>>;
}

export interface JimuJigyoData {
  事業名: string;
  所管局?: string | null;
  所管課: string;
  開始年度?: string | null;
  根拠法令?: string | null;
  行政計画?: string | null;
  事業きっかけ?: string | null;
  事業概要?: {
    対象?: string | null;
    対象の目指す状態?: string | null;
    実施内容?: string | null;
    成果見直し判断基準?: string | null;
  } | null;
  ロジックモデル?: {
    活動アウトプット?: string | null;
    結果アウトプット?: string | null;
    中間アウトカム?: string | null;
    最終アウトカム?: string | null;
  } | null;
  事業費_千円?: BudgetData | null;
  指標?: {
    活動指標?: KpiItem[];
    成果指標?: KpiItem[];
  } | null;
}
