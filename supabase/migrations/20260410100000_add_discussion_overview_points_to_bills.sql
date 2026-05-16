alter table bills add column if not exists discussion_overview_points text[] not null default '{}';
