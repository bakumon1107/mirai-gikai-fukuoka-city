-- #13: jimu_jigyo_bureaus / jimu_jigyo_kpi_types / jimu_jigyo_import_logs /
--      jimu_jigyo_matching_logs の RLS が有効化されていなかった問題を修正
ALTER TABLE jimu_jigyo_bureaus ENABLE ROW LEVEL SECURITY;
ALTER TABLE jimu_jigyo_kpi_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE jimu_jigyo_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jimu_jigyo_matching_logs ENABLE ROW LEVEL SECURITY;

-- #2: import-r6-data.ts が "completed_with_errors" ステータスを書き込むが
--     CHECK 制約に含まれていなかった問題を修正
ALTER TABLE jimu_jigyo_import_logs
  DROP CONSTRAINT IF EXISTS status_valid,
  ADD CONSTRAINT status_valid
    CHECK (status IN ('pending', 'completed', 'failed', 'completed_with_errors'));
