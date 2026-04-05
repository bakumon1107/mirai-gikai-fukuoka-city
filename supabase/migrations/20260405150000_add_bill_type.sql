-- bills テーブルに bill_type カラムを追加
-- 意見書案・決議案・議員提出議案を通常議案と区別するため

ALTER TABLE bills
  ADD COLUMN bill_type text NOT NULL DEFAULT 'bill'
  CHECK (bill_type IN ('bill', 'opinion', 'resolution', 'member_bill'));

-- 既存の bill_number PARTIAL UNIQUE INDEX を削除
-- (bill_number 単体では、同会期に種別違いの「第1号」が複数存在し得るため)
DROP INDEX IF EXISTS bills_bill_number_unique;

-- council_session_id + bill_number + bill_type の複合 PARTIAL UNIQUE INDEX に変更
-- 空文字の bill_number は除外（bill_type 不問）
CREATE UNIQUE INDEX bills_session_number_type_unique
  ON bills (council_session_id, bill_number, bill_type)
  WHERE bill_number != '';
