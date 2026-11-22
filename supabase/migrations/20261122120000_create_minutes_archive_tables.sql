-- 議事録ベースのアーカイブ用テーブル（一般質問・委員会議事録・首長の記者会見）
--
-- 議案の本文や議決結果が公開されていない自治体でも、会議録・委員会記録・記者会見を軸に
-- 地域版を作れるようにするための土台。地域版（福岡県版）で育ったスキーマの最終形を、
-- 特定の自治体に依存しない形にまとめたもの。
--
-- 地域版からの主な違い:
--   - committee_meetings.source_document_id（会議録システムの DocumentID, integer, unique）を
--     source_id（text, nullable）に変更。DocumentID が公開のたびに振り直されるシステムや、
--     そもそも ID を持たないシステムがあるため、重複の判定は (委員会, 開催日, 件名) で行う
--   - committee_meeting_topics から予算機能への参照（budget_overview_id）を除外
--   - press_conference_turns.speaker の首長を 'governor' ではなく 'executive' とする
--     （知事・市長・区長・町長・村長のいずれにも使えるように）
--
-- RLS は有効化のみでポリシーは定義しない（デフォルト全拒否。アクセスは createAdminClient 経由）。

-- ============================================================
-- 会期の節目（トップの「会期の流れ」用）
-- ============================================================
-- 形（いずれも欠けうるので null 可。臨時会は質問を行わないことがある）:
--   {
--     "representativeQuestions": { "from": "2026-09-15", "to": "2026-09-17" },
--     "generalQuestions":        { "from": "2026-09-18", "to": "2026-09-25" },
--     "standingCommittees":      { "from": "2026-09-28", "to": "2026-09-30" },
--     "billVote":                "2026-10-01"
--   }
-- billVote（議案採決日）は end_date（閉会日）と別の日になりうる。
alter table council_sessions
  add column if not exists schedule_milestones jsonb;

comment on column council_sessions.schedule_milestones is
  '会期の節目（代表質問・一般質問・常任委員会の期間と議案採決日）。未取得は null';

-- ============================================================
-- 一般質問・代表質問
-- ============================================================
create table general_questions (
  id                  uuid primary key default gen_random_uuid(),
  council_session_id  uuid not null references council_sessions(id) on delete cascade,
  -- 代表質問（会派を代表して行う質問）と一般質問の別
  question_type       text not null default 'general'
                        check (question_type in ('general', 'representative')),
  questioner_name     text not null,
  questioner_party    text,
  -- 議席番号など（無ければ null）
  questioner_number   integer,
  -- 会期の何日目か・その日の何番目か（並び順と重複防止に使う）
  session_day         integer not null default 1,
  question_order      integer not null default 1,
  -- 質問全体の要約（AI生成・確認後に格納）
  summary             text,
  -- 論点ごとの要約 [{title, question_summary, answer_summary, answerer_role, answerer_name, block_summary?}]
  -- 答弁者が複数いる場合は answerer_role に「○○局長（氏名）・市長（氏名）」の形で入れ、answerer_name は空にする
  topics              jsonb not null default '[]'::jsonb,
  -- 会議録原文（質問・答弁）
  raw_text            text,
  answer_raw_text     text,
  source_url          text,
  publish_status      text not null default 'draft'
                        check (publish_status in ('draft', 'published')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  unique (council_session_id, session_day, question_order)
);

alter table general_questions enable row level security;

create index general_questions_session_order_idx
  on general_questions (council_session_id, session_day, question_order);
create index general_questions_publish_status_idx
  on general_questions (publish_status);

create trigger update_general_questions_updated_at
  before update on general_questions
  for each row execute function update_updated_at_column();

-- ============================================================
-- 委員会議事録
-- ============================================================
alter table committees
  add column if not exists committee_type text not null default 'standing'
    check (committee_type in ('standing', 'special', 'budget', 'audit', 'management'));

comment on column committees.committee_type is
  '委員会の区分（常任・特別・予算・決算・議会運営）';

-- 委員会の開催1回分（会議録の1文書に対応）
create table committee_meetings (
  id              uuid primary key default gen_random_uuid(),
  -- 特別委員会など committees 未登録の会議もあるため nullable
  committee_id    uuid references committees(id) on delete set null,
  -- 開催時点の委員会名（改組前の旧名称のことがある）
  committee_name  text not null,
  -- 同一系統の委員会を名称変更をまたいで束ねるスラッグ
  committee_slug  text not null,
  meeting_date    date not null,
  title           text not null,
  -- 会議録システム側の ID（あれば）。振り直されることがあるため一意にはしない
  source_id       text,
  source_url      text,
  -- 会議全体の要約（AI生成・確認後に格納）
  summary         text,
  -- 発言単位の構造化データ [{voiceNo, speakerLabel, speakerType, text, simpleText?}]
  -- speakerType: chairperson | member | executive | unknown
  speeches        jsonb not null default '[]'::jsonb,
  -- 会議録原文の全文
  raw_text        text not null default '',
  publish_status  text not null default 'draft'
                    check (publish_status in ('draft', 'published')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- 同じ委員会・同じ日・同じ件名の会議は1件（取り込み時の重複防止キー）
  unique (committee_slug, meeting_date, title)
);

-- 発言数（一覧で speeches 本体を送らずに件数だけを使うための生成列）
alter table committee_meetings
  add column speech_count integer
  generated always as (
    case
      when jsonb_typeof(speeches) = 'array' then jsonb_array_length(speeches)
      else 0
    end
  ) stored;

comment on column committee_meetings.speech_count is
  '発言数（speeches の要素数）。生成列のため直接更新しない';

alter table committee_meetings enable row level security;

create index committee_meetings_committee_id_idx
  on committee_meetings (committee_id);
create index committee_meetings_slug_date_idx
  on committee_meetings (committee_slug, meeting_date desc);
create index committee_meetings_source_id_idx
  on committee_meetings (source_id);
create index committee_meetings_speech_count_idx
  on committee_meetings (publish_status, speech_count, meeting_date desc);

create trigger update_committee_meetings_updated_at
  before update on committee_meetings
  for each row execute function update_updated_at_column();

-- 会議内の議題1件分
create table committee_meeting_topics (
  id                  uuid primary key default gen_random_uuid(),
  meeting_id          uuid not null references committee_meetings(id) on delete cascade,
  topic_order         integer not null,
  title               text not null,
  -- 議題の住民向け要約（AI生成・確認後に格納）
  summary             text,
  -- 質疑の流れの要約（AI生成・確認後に格納）
  discussion_summary  text,
  -- 発言者一覧 [{label}]
  speakers            jsonb not null default '[]'::jsonb,
  -- この議題に対応する発言範囲（committee_meetings.speeches の voiceNo）
  start_voice_no      integer,
  end_voice_no        integer,
  -- 付託議案の審査であれば、その議案（議案機能と併用する場合）
  bill_id             uuid references bills(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  unique (meeting_id, topic_order)
);

alter table committee_meeting_topics enable row level security;

create index committee_meeting_topics_meeting_id_idx
  on committee_meeting_topics (meeting_id);
create index committee_meeting_topics_bill_id_idx
  on committee_meeting_topics (bill_id);

create trigger update_committee_meeting_topics_updated_at
  before update on committee_meeting_topics
  for each row execute function update_updated_at_column();

-- ============================================================
-- 首長の記者会見（会見を行っていない自治体では使わない）
-- ============================================================
create table press_conferences (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  held_at      date not null,
  youtube_url  text,
  status       text not null default 'draft'
                 check (status in ('draft', 'structuring', 'review', 'published', 'error')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table press_conferences enable row level security;

create index press_conferences_held_at_idx on press_conferences (held_at desc);
create index press_conferences_status_idx on press_conferences (status);

create trigger update_press_conferences_updated_at
  before update on press_conferences
  for each row execute function update_updated_at_column();

-- 会見の発表項目（announcement）と質疑応答（qa）
create table press_conference_items (
  id                   uuid primary key default gen_random_uuid(),
  press_conference_id  uuid not null references press_conferences(id) on delete cascade,
  item_type            text not null check (item_type in ('announcement', 'qa')),
  order_index          integer not null,
  title                text not null,
  -- 概要（常時表示）
  summary              text,
  -- 詳しい全文（「詳しく見る」で展開表示。無ければ null）
  detail               text,
  -- 配付資料（PDF 等）への URL。主に announcement で使用
  material_url         text,
  created_at           timestamptz not null default now()
);

alter table press_conference_items enable row level security;

create index press_conference_items_conference_order_idx
  on press_conference_items (press_conference_id, order_index);

-- 会見中の発言
create table press_conference_turns (
  id                        uuid primary key default gen_random_uuid(),
  press_conference_item_id  uuid not null references press_conference_items(id) on delete cascade,
  -- executive: 首長（知事・市長・区長・町長・村長） / reporter: 記者 / secretariat: 担当課・部局
  speaker                   text not null
                              check (speaker in ('executive', 'reporter', 'secretariat')),
  speaker_name              text,
  content                   text not null,
  order_index               integer not null,
  created_at                timestamptz not null default now()
);

alter table press_conference_turns enable row level security;

create index press_conference_turns_item_order_idx
  on press_conference_turns (press_conference_item_id, order_index);
