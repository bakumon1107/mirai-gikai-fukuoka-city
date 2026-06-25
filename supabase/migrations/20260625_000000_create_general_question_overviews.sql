-- 一般質問のセッション単位「3行サマリー」を保存するテーブル
-- council_sessions と 1:1。RLS有効・ポリシーなし（アクセスはService Role経由）
create table if not exists general_question_overviews (
  council_session_id uuid primary key references council_sessions(id) on delete cascade,
  lines text[] not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table general_question_overviews enable row level security;
