-- 一般質問オーバービューに「テーマ別3行サマリー」を追加
-- 形式: { "子育て・教育": ["l1","l2","l3"], ... }（カテゴリラベルをキーにした連想配列）
alter table general_question_overviews
  add column if not exists theme_lines jsonb not null default '{}'::jsonb;
