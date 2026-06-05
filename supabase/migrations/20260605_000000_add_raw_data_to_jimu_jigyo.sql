-- jimu_jigyo_items に raw_data カラムを追加（JSONファイルの内容をそのまま格納）
ALTER TABLE jimu_jigyo_items
  ADD COLUMN IF NOT EXISTS raw_data JSONB,
  ADD COLUMN IF NOT EXISTS slug TEXT;

COMMENT ON COLUMN jimu_jigyo_items.raw_data IS 'JimuJigyoData 形式の生データ（KPI・予算・ロジックモデル等）';
COMMENT ON COLUMN jimu_jigyo_items.slug IS 'URLスラッグ（事業名をslugify したもの）';

CREATE INDEX IF NOT EXISTS idx_jimu_jigyo_items_slug ON jimu_jigyo_items(slug);
