-- 議案の提出年月日・議決年月日を保持するカラムを追加する。
-- これまで提出日の表示元として published_at（公開日時）を流用していたが、
-- 公開日時と提出日は別の概念であり、議決年月日にいたっては格納先が無かった。
alter table bills add column if not exists submitted_date date;
alter table bills add column if not exists decided_date date;

comment on column bills.submitted_date is '議案の提出年月日（議会公式サイトの「提出年月日」）';
comment on column bills.decided_date is '議案の議決年月日（議会公式サイトの「議決年月日」）。未議決の間は null';
