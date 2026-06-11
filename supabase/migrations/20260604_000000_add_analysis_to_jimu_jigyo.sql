-- jimu_jigyo_fiscal_years に AI分析テキストカラムを追加
ALTER TABLE jimu_jigyo_fiscal_years
  ADD COLUMN IF NOT EXISTS analysis_json JSONB;

COMMENT ON COLUMN jimu_jigyo_fiscal_years.analysis_json IS 'AI生成の分析テキスト（kpi/budget/efficiency）';
