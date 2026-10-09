-- general_questions に質疑の区分を追加する。
--
-- 本会議の一般質問に加えて、条例予算特別委員会の総会質疑を同じテーブルで扱う。
-- 総会質疑は「質問者 × テーマ × 答弁者」という構造が一般質問と同じで、
-- 委員会議事録（committee_meetings）の匿名・要約Q&A形式では発言者名・会派・
-- 答弁者の役職を構造として保持できないため、こちらに寄せる。
--
-- 既存行は既定値で 'general'（本会議の一般質問）になる。
-- 表示側は question_type で絞り込むため、'budget_plenary' を登録しても
-- 一般質問のページ・検索結果には現れない。

alter table general_questions
  add column question_type text not null default 'general'
    check (question_type in ('general', 'budget_plenary'));

create index general_questions_question_type_idx
  on general_questions (question_type);

comment on column general_questions.question_type is
  '質疑の区分: general=本会議の一般質問 / budget_plenary=条例予算特別委員会の総会質疑';
