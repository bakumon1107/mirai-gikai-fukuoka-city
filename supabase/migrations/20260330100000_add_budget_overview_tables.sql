-- budget_overviews: one row per department per session
create table budget_overviews (
  id uuid primary key default gen_random_uuid(),
  council_session_id uuid not null references council_sessions(id),
  department_name text not null,
  department_slug text not null,
  direction text,
  total_budget bigint,
  prev_budget bigint,
  source_url text,
  publish_status text not null default 'draft' check (publish_status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (council_session_id, department_slug)
);
alter table budget_overviews enable row level security;

-- budget_themes: major themes per department (e.g. "福岡100の推進")
create table budget_themes (
  id uuid primary key default gen_random_uuid(),
  overview_id uuid not null references budget_overviews(id) on delete cascade,
  title text not null,
  budget_amount bigint,
  ai_summary text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table budget_themes enable row level security;

-- budget_initiatives: individual projects per theme
create table budget_initiatives (
  id uuid primary key default gen_random_uuid(),
  theme_id uuid not null references budget_themes(id) on delete cascade,
  title text not null,
  budget_amount bigint,
  badge text check (badge in ('new', 'expanded', 'continued', null)),
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table budget_initiatives enable row level security;
