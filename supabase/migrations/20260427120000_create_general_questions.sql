create table general_questions (
  id                  uuid primary key default gen_random_uuid(),
  council_session_id  uuid not null references council_sessions(id) on delete cascade,

  questioner_name     text not null,
  questioner_party    text,
  questioner_number   int,
  session_day         int not null default 1,
  question_order      int not null default 1,

  summary             text,
  topics              jsonb not null default '[]',

  raw_text            text,
  source_url          text,

  publish_status      text not null default 'draft'
                        check (publish_status in ('draft', 'published')),

  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table general_questions enable row level security;

create index on general_questions (council_session_id, session_day, question_order);
create index on general_questions (publish_status);
