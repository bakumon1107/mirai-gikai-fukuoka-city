-- 一般質問テーブル
create table if not exists public.general_questions (
  id uuid primary key default gen_random_uuid(),
  council_session_id uuid not null references public.council_sessions(id) on delete cascade,
  session_day integer not null,
  question_order integer not null,
  questioner_name text not null,
  questioner_party text,
  questioner_number integer,
  summary text not null,
  topics jsonb not null default '[]'::jsonb,
  raw_text text not null,
  source_url text,
  publish_status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (council_session_id, session_day, question_order)
);

alter table public.general_questions enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'update_general_questions_updated_at'
  ) then
    create trigger update_general_questions_updated_at
      before update on public.general_questions
      for each row execute function update_updated_at_column();
  end if;
end $$;
