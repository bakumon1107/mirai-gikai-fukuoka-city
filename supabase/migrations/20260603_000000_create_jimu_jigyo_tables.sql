-- 福岡市事務事業評価 複数年度管理テーブル
-- 設計: 5年ローリングウィンドウ（R2～R6で常に最新5年を保持）

-- ─────────────────────────────────────────────────────────────
-- 1. 部局マスタ
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_bureaus (
  bureau_code TEXT PRIMARY KEY,
  bureau_name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO jimu_jigyo_bureaus (bureau_code, bureau_name, display_order) VALUES
  ('somu', '総務企画局', 0),
  ('fukushi', '福祉局', 1),
  ('hoken', '保健福祉局', 2),
  ('kyouiku', '教育委員会', 3),
  ('kodomo', 'こども青年局', 4),
  ('juto', '建設局', 5),
  ('keizai', '経済局', 6),
  ('kankyo', '環境局', 7),
  ('shimin', '市民局', 8),
  ('nousui', '農業委員会', 9),
  ('kouwan', '港湾空港局', 10)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 2. 事務事業マスタ
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 事業識別
  item_code TEXT UNIQUE NOT NULL,  -- "somu_001" 等、自動採番
  item_name TEXT NOT NULL,         -- 事業名
  
  -- 所管情報
  bureau_code TEXT NOT NULL REFERENCES jimu_jigyo_bureaus(bureau_code) ON DELETE RESTRICT,
  bureau_name TEXT NOT NULL,       -- デノーマ化（参照性向上）
  department_code TEXT NOT NULL,   -- 課コード
  department_name TEXT NOT NULL,   -- 課名
  
  -- 事業属性
  start_fiscal_year TEXT,          -- "平成23年度" 等
  root_law TEXT,                   -- 根拠法令
  administrative_plan TEXT,        -- 行政計画
  establishment_trigger TEXT,      -- 事業きっかけ
  
  -- 事業概要
  target_description TEXT,         -- 対象の説明
  target_goal_state TEXT,          -- 対象の目指す状態
  implementation_content TEXT,     -- 実施内容
  achievement_criteria TEXT,       -- 成果見直し判断基準
  
  -- ロジックモデル
  activity_output TEXT,            -- 活動アウトプット
  result_output TEXT,              -- 結果アウトプット
  intermediate_outcome TEXT,       -- 中間アウトカム
  final_outcome TEXT,              -- 最終アウトカム
  
  -- メタデータ
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_jimu_jigyo_items_item_name ON jimu_jigyo_items(item_name);
CREATE INDEX idx_jimu_jigyo_items_bureau_code ON jimu_jigyo_items(bureau_code);
CREATE INDEX idx_jimu_jigyo_items_item_code ON jimu_jigyo_items(item_code);

-- ─────────────────────────────────────────────────────────────
-- 3. 年度別データ（予算・KPIなし、メタデータのみ）
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_fiscal_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 関連情報
  item_id UUID NOT NULL REFERENCES jimu_jigyo_items(id) ON DELETE CASCADE,
  fiscal_year INTEGER NOT NULL,         -- 令和6年=2024, 令和5年=2023, ...
  
  -- 予算情報（単位：千円）
  expenditure_amount INTEGER,           -- 決算見込・決算額
  expenditure_type TEXT,                -- "決算見込", "決算", "予算"
  specific_revenue INTEGER,             -- 特定財源
  general_revenue INTEGER,              -- 一般財源
  next_year_budget INTEGER,             -- 次年度予算（参考）
  
  -- 基本計画・行政運営プランはJSONで柔軟に対応
  basic_plan_data JSONB,                -- { 事業区分, 施策コード, 分野別目標, ... }
  administrative_plan_data JSONB,       -- { 取組方針, 推進項目 }
  
  -- データ品質・出所
  data_source TEXT,                     -- 福岡市HP, 内部資料 等
  imported_at TIMESTAMP DEFAULT NOW(),  -- データ取込日時
  imported_by TEXT,                     -- 取込者/取込方法 (JSON, スクレイプ等)
  
  -- メタデータ
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- 一意性制約：同一事業の同一年度は1レコードのみ
  UNIQUE(item_id, fiscal_year),
  CONSTRAINT fiscal_year_valid CHECK (fiscal_year >= 2020 AND fiscal_year <= 2030)
);

CREATE INDEX idx_jimu_jigyo_fy_item_id ON jimu_jigyo_fiscal_years(item_id);
CREATE INDEX idx_jimu_jigyo_fy_fiscal_year ON jimu_jigyo_fiscal_years(fiscal_year);
CREATE INDEX idx_jimu_jigyo_fy_item_fiscal ON jimu_jigyo_fiscal_years(item_id, fiscal_year);

-- ─────────────────────────────────────────────────────────────
-- 4. KPI指標タイプマスタ
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_kpi_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  kpi_type_code TEXT UNIQUE NOT NULL,  -- "activity", "achievement"
  kpi_type_name TEXT NOT NULL,         -- 活動指標、成果指標
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO jimu_jigyo_kpi_types (kpi_type_code, kpi_type_name, display_order) VALUES
  ('activity', '活動指標', 0),
  ('achievement', '成果指標', 1)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 5. KPI指標マスタ
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_kpi_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  item_id UUID NOT NULL REFERENCES jimu_jigyo_items(id) ON DELETE CASCADE,
  kpi_type_id UUID NOT NULL REFERENCES jimu_jigyo_kpi_types(id),
  
  kpi_name TEXT NOT NULL,              -- 指標名称
  kpi_order INTEGER DEFAULT 0,         -- 同一事業内の表示順序
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(item_id, kpi_type_id, kpi_name)
);

CREATE INDEX idx_jimu_jigyo_kpi_items_item_id ON jimu_jigyo_kpi_items(item_id);
CREATE INDEX idx_jimu_jigyo_kpi_items_type_id ON jimu_jigyo_kpi_items(kpi_type_id);

-- ─────────────────────────────────────────────────────────────
-- 6. KPI実績（年度別）
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_kpi_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 関連情報
  kpi_item_id UUID NOT NULL REFERENCES jimu_jigyo_kpi_items(id) ON DELETE CASCADE,
  fiscal_year INTEGER NOT NULL,
  
  -- 目標・実績・達成率
  target_value TEXT,                   -- 数値 or 文字列（"120万人", "増加" 等）
  actual_value TEXT,                   -- 実績値
  achievement_rate TEXT,               -- "91.4%" 等、またはnull
  
  -- メタデータ
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(kpi_item_id, fiscal_year),
  CONSTRAINT fiscal_year_valid CHECK (fiscal_year >= 2020 AND fiscal_year <= 2030)
);

CREATE INDEX idx_jimu_jigyo_kpi_results_kpi_item_id ON jimu_jigyo_kpi_results(kpi_item_id);
CREATE INDEX idx_jimu_jigyo_kpi_results_fiscal_year ON jimu_jigyo_kpi_results(fiscal_year);

-- ─────────────────────────────────────────────────────────────
-- 7. KPI目標（中期目標・最終年度目標）
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_kpi_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  kpi_item_id UUID NOT NULL REFERENCES jimu_jigyo_kpi_items(id) ON DELETE CASCADE,
  
  target_fiscal_year INTEGER,          -- 目標年度（R7=2025, 最終=-1等で表現）
  target_value TEXT,                   -- 目標値
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(kpi_item_id, target_fiscal_year)
);

CREATE INDEX idx_jimu_jigyo_kpi_targets_kpi_item_id ON jimu_jigyo_kpi_targets(kpi_item_id);

-- ─────────────────────────────────────────────────────────────
-- 8. データ取込ログ（監査・トレーサビリティ用）
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  fiscal_year INTEGER NOT NULL,
  source_type TEXT NOT NULL,            -- 'json', 'scrape', 'pdf', 'manual'
  source_url TEXT,
  
  total_items_processed INTEGER,
  total_items_inserted INTEGER,
  total_items_updated INTEGER,
  
  status TEXT DEFAULT 'pending',        -- 'pending', 'completed', 'failed'
  error_message TEXT,
  
  imported_by TEXT,
  imported_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT status_valid CHECK (status IN ('pending', 'completed', 'failed'))
);

CREATE INDEX idx_jimu_jigyo_import_logs_fiscal_year ON jimu_jigyo_import_logs(fiscal_year);
CREATE INDEX idx_jimu_jigyo_import_logs_imported_at ON jimu_jigyo_import_logs(imported_at);

-- ─────────────────────────────────────────────────────────────
-- 9. 事業マッチングログ（年度間の紐付け履歴）
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jimu_jigyo_matching_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  fiscal_year INTEGER NOT NULL,
  item_id UUID NOT NULL REFERENCES jimu_jigyo_items(id) ON DELETE CASCADE,
  
  source_item_name TEXT NOT NULL,      -- 取込元の事業名
  source_bureau_code TEXT NOT NULL,
  source_department_name TEXT NOT NULL,
  
  match_score NUMERIC(5, 2),           -- マッチング確信度（0-100）
  match_method TEXT NOT NULL,          -- 'exact', 'partial', 'similarity', 'manual'
  
  matched_at TIMESTAMP DEFAULT NOW(),
  matched_by TEXT                      -- 取込者/システム
);

CREATE INDEX idx_jimu_jigyo_matching_logs_item_id ON jimu_jigyo_matching_logs(item_id);
CREATE INDEX idx_jimu_jigyo_matching_logs_fiscal_year ON jimu_jigyo_matching_logs(fiscal_year);

-- ─────────────────────────────────────────────────────────────
-- 10. RLS ポリシー設定
-- ─────────────────────────────────────────────────────────────

-- 事務事業データは基本的に公開（認証・非認証ユーザー両方が閲覧可）
ALTER TABLE jimu_jigyo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE jimu_jigyo_fiscal_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE jimu_jigyo_kpi_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE jimu_jigyo_kpi_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE jimu_jigyo_kpi_targets ENABLE ROW LEVEL SECURITY;

-- 公開テーブル：全員読取可能
CREATE POLICY "jimu_jigyo_items_read_public" ON jimu_jigyo_items
  FOR SELECT USING (true);

CREATE POLICY "jimu_jigyo_fiscal_years_read_public" ON jimu_jigyo_fiscal_years
  FOR SELECT USING (true);

CREATE POLICY "jimu_jigyo_kpi_items_read_public" ON jimu_jigyo_kpi_items
  FOR SELECT USING (true);

CREATE POLICY "jimu_jigyo_kpi_results_read_public" ON jimu_jigyo_kpi_results
  FOR SELECT USING (true);

CREATE POLICY "jimu_jigyo_kpi_targets_read_public" ON jimu_jigyo_kpi_targets
  FOR SELECT USING (true);

-- 管理用テーブル：RLS 無効化（内部システム用、Server Actions でのみアクセス）
-- TODO: 将来的に admin_users テーブルが存在する際にRLSを有効化

-- ─────────────────────────────────────────────────────────────
-- 11. ビュー: 複数年度の推移データ（分析用）
-- ─────────────────────────────────────────────────────────────

-- 事業の基本情報 + 最新の年度情報
CREATE OR REPLACE VIEW jimu_jigyo_latest AS
SELECT
  jj.id,
  jj.item_code,
  jj.item_name,
  jj.bureau_code,
  jj.bureau_name,
  jj.department_code,
  jj.department_name,
  MAX(fy.fiscal_year) AS latest_fiscal_year,
  COUNT(DISTINCT fy.fiscal_year) AS available_years
FROM jimu_jigyo_items jj
LEFT JOIN jimu_jigyo_fiscal_years fy ON jj.id = fy.item_id
GROUP BY jj.id, jj.item_code, jj.item_name, jj.bureau_code, jj.bureau_name, 
         jj.department_code, jj.department_name;

-- 予算推移の集約ビュー
CREATE OR REPLACE VIEW jimu_jigyo_budget_timeline AS
SELECT
  jj.item_name,
  jj.bureau_name,
  fy.fiscal_year,
  fy.expenditure_amount,
  fy.specific_revenue,
  fy.general_revenue,
  LAG(fy.expenditure_amount) OVER (
    PARTITION BY fy.item_id
    ORDER BY fy.fiscal_year
  ) AS prev_year_amount,
  CASE
    WHEN LAG(fy.expenditure_amount) OVER (
      PARTITION BY fy.item_id
      ORDER BY fy.fiscal_year
    ) IS NOT NULL
    THEN ROUND(
      ((fy.expenditure_amount - LAG(fy.expenditure_amount) OVER (
        PARTITION BY fy.item_id
        ORDER BY fy.fiscal_year
      )) / LAG(fy.expenditure_amount) OVER (
        PARTITION BY fy.item_id
        ORDER BY fy.fiscal_year
      ) * 100)::numeric, 1
    )
    ELSE NULL
  END AS change_rate_percent
FROM jimu_jigyo_items jj
JOIN jimu_jigyo_fiscal_years fy ON jj.id = fy.item_id
ORDER BY jj.item_name, fy.fiscal_year;

-- ─────────────────────────────────────────────────────────────
-- 12. 関数: 年度別統計の集約
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_jimu_jigyo_statistics(
  target_fiscal_year INTEGER
)
RETURNS TABLE (
  fiscal_year INTEGER,
  total_items BIGINT,
  total_budget BIGINT,
  avg_achievement_rate NUMERIC,
  bureau_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    target_fiscal_year AS fiscal_year,
    COUNT(DISTINCT jj.id)::BIGINT AS total_items,
    SUM(fy.expenditure_amount)::BIGINT AS total_budget,
    ROUND(
      AVG(
        CASE
          WHEN kr.achievement_rate ~ '^\d+(\.\d+)?%?$'
          THEN REPLACE(kr.achievement_rate, '%', '')::numeric
          ELSE NULL
        END
      ), 1
    ) AS avg_achievement_rate,
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'bureau_code', jj.bureau_code,
        'bureau_name', jj.bureau_name,
        'item_count', COUNT(DISTINCT jj.id),
        'total_budget', SUM(fy.expenditure_amount)
      )
    ) AS bureau_breakdown
  FROM jimu_jigyo_items jj
  JOIN jimu_jigyo_fiscal_years fy ON jj.id = fy.item_id
    AND fy.fiscal_year = target_fiscal_year
  LEFT JOIN jimu_jigyo_kpi_items ki ON jj.id = ki.item_id
  LEFT JOIN jimu_jigyo_kpi_results kr ON ki.id = kr.kpi_item_id
    AND kr.fiscal_year = target_fiscal_year
  GROUP BY target_fiscal_year;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_jimu_jigyo_statistics IS '指定年度の統計情報を集約（部局別ブレークダウン付き）';

-- ─────────────────────────────────────────────────────────────
-- 13. インデックス（パフォーマンス最適化）
-- ─────────────────────────────────────────────────────────────

CREATE INDEX idx_jimu_jigyo_fy_created ON jimu_jigyo_fiscal_years(created_at DESC);
CREATE INDEX idx_jimu_jigyo_kpi_results_created ON jimu_jigyo_kpi_results(created_at DESC);
