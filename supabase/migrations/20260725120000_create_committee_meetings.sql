-- 委員会議事録アーカイブ用テーブル（福岡市版）
--
-- 福岡市の委員会議事録（会議録検索システムの「本文」1文書）は発言者名が無い
-- 匿名・要約Q&A形式（［質疑・意見］／［答弁］、または ◯質疑・意見／△答弁）。
-- 議案付託用の committees マスタとは分類が異なり予算分科会が中心のため紐付けず、
-- committee_meetings を自己完結させる（自前の committee_type カラムを持つ）。

-- committee_meetings: 委員会の開催1回分（会議録検索システムの「本文」1文書に対応）
create table committee_meetings (
  id uuid primary key default gen_random_uuid(),
  -- 開催時点の委員会名（例: 令和８年条例予算特別委員会教育こども分科会）
  committee_name text not null,
  -- 同一系統の委員会を束ねるスラッグ（URL・アーカイブ単位）
  committee_slug text not null,
  -- 区分: standing(常任) / special(特別) / budget(予算) / audit(決算) / management(議会運営)
  committee_type text not null default 'standing'
    check (committee_type in ('standing', 'special', 'budget', 'audit', 'management')),
  meeting_date date not null,
  title text not null,
  -- 会議録検索システムの DocumentID（再取得時の重複防止キー）
  source_document_id integer not null unique,
  source_url text not null,
  -- 会議全体のAI要約（確認後に生成・格納）
  summary text,
  -- 発言セグメント [{seq, voiceNo, speakerType, text, simpleText?}]
  -- speakerType: member(質疑・意見) / executive(答弁) / note(記録・進行)
  speeches jsonb not null default '[]'::jsonb,
  -- 会議録原文の全文
  raw_text text not null,
  publish_status text not null default 'draft'
    check (publish_status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table committee_meetings enable row level security;

create index committee_meetings_slug_date_idx
  on committee_meetings(committee_slug, meeting_date desc);

create trigger update_committee_meetings_updated_at
  before update on committee_meetings
  for each row execute function update_updated_at_column();

-- committee_meeting_topics: 会議内の議題1件分
-- 市の議事録には委員長の議題宣言が無いため通常は空だが、将来の手動議題・
-- 局別区分に備えて用意する。
create table committee_meeting_topics (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references committee_meetings(id) on delete cascade,
  topic_order integer not null,
  title text not null,
  -- 議題の市民向け要約（確認後に生成・格納）
  summary text,
  -- 質疑の流れの要約（確認後に生成・格納）
  discussion_summary text,
  -- この議題に対応する発言範囲（committee_meetings.speeches の seq）
  start_voice_no integer,
  end_voice_no integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (meeting_id, topic_order)
);

alter table committee_meeting_topics enable row level security;

create index committee_meeting_topics_meeting_id_idx
  on committee_meeting_topics(meeting_id);

create trigger update_committee_meeting_topics_updated_at
  before update on committee_meeting_topics
  for each row execute function update_updated_at_column();
