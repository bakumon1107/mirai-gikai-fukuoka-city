-- press_conference_items に配付資料（PDF）のURLを追加
-- 発表項目（announcement）に紐づく市の配付資料へのリンクを表示するために使用する
ALTER TABLE press_conference_items
  ADD COLUMN IF NOT EXISTS material_url TEXT;

COMMENT ON COLUMN press_conference_items.material_url IS '配付資料（PDF等）へのURL。主に announcement で使用。無い場合は null';
