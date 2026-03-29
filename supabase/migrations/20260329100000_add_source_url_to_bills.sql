-- bills テーブルに議案の出典URL（PDF等）を保存するカラムを追加
alter table bills add column if not exists source_url text;
