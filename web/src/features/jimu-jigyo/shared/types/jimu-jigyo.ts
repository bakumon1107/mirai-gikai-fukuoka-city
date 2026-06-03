// JSONデータの生の型
// 目標値・実績値は数値の他に「120万人」「現状維持」「増加」等の文字列が含まれる
export type KpiTarget = {
  R5?: number | string | null;
  R6?: number | string | null;
  R7?: number | string | null;
  最終年度目標値?: number | string | null;
  最終年度?: string | null;
};

export type KpiActual = {
  R5?: number | string | null;
  R6?: number | string | null;
};

export type KpiAchievement = {
  R5?: string;
  R6?: string;
};

export type KpiItem = {
  内容: string;
  目標: KpiTarget;
  実績: KpiActual;
  達成率: KpiAchievement;
};

export type JimuJigyoData = {
  事業名: string;
  所管局: string;
  所管課: string;
  根拠法令?: string | null;
  開始年度?: string | null;
  行政計画?: string | null;
  事業きっかけ?: string | null;
  事業概要: {
    対象?: string;
    対象の目指す状態?: string;
    実施内容?: string;
    成果見直し判断基準?: string;
  };
  ロジックモデル?: {
    活動アウトプット?: string;
    結果アウトプット?: string;
    中間アウトカム?: string;
    最終アウトカム?: string;
  };
  指標: {
    活動指標?: KpiItem[];
    成果指標?: KpiItem[];
  };
  基本計画?: {
    事業区分?: string;
    施策コード?: { 主?: string; 再?: string | null };
    分野別目標?: string;
    施策?: string;
    事業群?: string;
    施策成果指標?: string;
  };
  行政運営プラン?: {
    取組方針?: string | null;
    推進項目?: string | null;
  };
  事業費_千円?: {
    R6決算見込?: { 歳出?: number; 特定財源?: number; 一般財源?: number };
    R5決算?: { 歳出?: number; 特定財源?: number; 一般財源?: number };
    R7予算?: { 歳出?: number; 特定財源?: number; 一般財源?: number };
  };
};

// ─── 分析結果型 ───────────────────────────────────────────────

export type ChangeDirection = "up" | "down" | "flat" | "unknown";

export type KpiAnalysisResult = {
  direction: ChangeDirection;
  changeRate: number | null; // 主要指標の R5→R6 実績変化率（小数）
  achievementRate: number | null; // R6 達成率（%）
  text: string; // 自動生成テキスト
};

export type BudgetAnalysisResult = {
  direction: ChangeDirection;
  changeRate: number | null; // 当年度の歳出変化率（小数）
  nextYearDirection: ChangeDirection; // 次年度予算の方向
  nextYearChangeRate: number | null; // 次年度予算の変化率（小数）
  text: string;
};

export type EfficiencyAnalysisResult = {
  direction: ChangeDirection;
  changeRate: number | null; // 効率変化率（小数）
  text: string;
};

export type JimuJigyoAnalysis = {
  kpi: KpiAnalysisResult;
  budget: BudgetAnalysisResult;
  efficiency: EfficiencyAnalysisResult;
};

// ─── 完全なレコード型 ─────────────────────────────────────────

export type JimuJigyoRecord = JimuJigyoData & {
  id: string;
  analysis: JimuJigyoAnalysis;
};
