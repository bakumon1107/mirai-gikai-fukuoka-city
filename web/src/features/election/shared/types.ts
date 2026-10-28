/**
 * 争点（分野）のID。並び順は全立候補予定者で共通に固定する。
 *
 * `sonota` は他の分野に当てはまらない主張の受け皿で、常に最後に置く。
 * この枠がないと、分類できない主張が「言及なし」として消えるか、
 * 近い分野へ無理に押し込まれる。どちらも中立性を損なうため削らないこと。
 *
 * `fukushuto`（副首都）と `gaikokujin`（外国人住民・外国人政策）は2026年10月に追加した。
 * どちらも多くの候補者が触れている一方、それまでは「その他」や経済・財政などに
 * 人によって入る分野がばらばらで、分野別の比較で横に並ばなかったため。
 */
export type IssueId =
  | "kosodate"
  | "fukushi"
  | "kotsu"
  | "saikaihatsu"
  | "bosai"
  | "keizai"
  | "fukushuto"
  | "kanko"
  | "gaikokujin"
  | "dx"
  | "zaisei"
  | "sonota";

/**
 * 分野ごとの立場。
 * 「推進 / 条件付き / 慎重」は公約が出そろった段階、
 * 「表明済み / 未表明」は表明段階で使う。いずれも優劣を示すものではない。
 */
export type Stance = "推進" | "条件付き" | "慎重" | "表明済み" | "未表明";

export type Issue = {
  id: IssueId;
  /** 表示用の連番（"01" 形式） */
  no: string;
  label: string;
  /** その分野が対象とする議案の範囲 */
  background: string;
};

/**
 * 個々の発言の記録。
 *
 * 同じ争点について、候補者は会見・討論会・SNS・報道と複数の場で繰り返し語る。
 * ひとつの本文に追記していくとカードが際限なく伸びて比較が成立しなくなるため、
 * 発言はここに積み、表示は要約（summary）で固定する。
 */
export type StatementLog = {
  /** "2026-08" または "2026-08-26"。降順に並べ替えるので日付形式を崩さないこと */
  date: string;
  /** 発言の場。"記者会見" "討論会" "SNS" "報道" "選挙公報" など */
  place: string;
  /** 媒体名・イベント名 */
  source: string;
  text: string;
  /** 一次情報のURL。無い場合は undefined（ダミーリンクを置かない） */
  url?: string;
};

/**
 * このページへの反映の記録（更新履歴）。
 *
 * StatementLog が「いつ何を言ったか」なのに対し、こちらは「いつ何をこのページに載せたか」。
 * 新しい発言が載ったのか、整理し直しただけなのかを読み手が区別できるようにするため、
 * 発言の日付ではなく掲載した日を書く。
 */
export type UpdateEntry = {
  /** 掲載した日。"2026-10-28" 形式 */
  date: string;
  text: string;
};

export type CandidatePosition = {
  stance: Stance;
  /**
   * 現在の立場を1〜2文で。新しい発言が出たら**追記ではなく書き換える**。
   * 書き換えたら updated も同時に更新し、根拠の発言を log に残すこと。
   */
  summary: string;
  /** 要約の最終更新（"2026年8月"）。空文字なら最終更新行を描画しない */
  updated: string;
  /** 個々の発言。追記していく。表示時に日付の降順へ並べ替える */
  log: StatementLog[];
};

export type LabeledText = {
  label: string;
  text: string;
};

/**
 * 高島市政について本人が述べている内容。
 *
 * 高島宗一郎市長は不出馬のため、ここでの評価対象は4期16年の実績であって
 * 対立候補ではない。「継承」「転換」といった分類は付けない ——
 * 施策への評価なのか進め方への評価なのかを単一のラベルに畳むと、
 * こちらの解釈が混ざるため。記述をそのまま並べ、判断は読み手に委ねる。
 *
 * 分野別の言及と同じ summary + log 構造にしてある。会見や討論会で
 * 繰り返し語られる論点なので、同じように積み上がるため。
 */
export type TakashimaAssessment = {
  /** 現在の評価を1〜2文で。新しい発言が出たら書き換える */
  summary: string;
  /** 要約の最終更新（"2026年8月"）。空文字なら最終更新行を描画しない */
  updated: string;
  log: StatementLog[];
};

export type CandidateLink = {
  label: string;
  url: string;
};

/** 発信チャンネルの種別。並びは全立候補予定者で共通固定 */
export type SnsKind =
  | "公式サイト"
  | "X"
  | "YouTube"
  | "TikTok"
  | "Instagram"
  | "Facebook"
  | "note";

/**
 * 発信チャンネル。リンクの掲載のみで、タイムラインの埋め込みは行わない。
 *
 * 埋め込みは確認できた人のページにだけプレーヤーが出ることになり、
 * 露出の差が生まれる。また本人の発信が自動更新でそのまま載るため、
 * 「報道と公表資料をAIで要約し人が確認する」という関門を通らなくなる。
 * どちらもこのページの成立条件に反するため、全員リンクのみで揃える。
 */
export type SnsChannel = {
  kind: SnsKind;
  /** 表示用のハンドル。未確認なら空文字 */
  handle: string;
  /** チャンネルのURL。未確認なら空文字（ダミーリンクを置かない） */
  url: string;
};

export type Candidate = {
  id: string;
  /** 表明順（告示後は届出順）。"01" 形式 */
  no: string;
  name: string;
  kana: string;
  /** 投開票日時点の年齢。公表が確認できない場合は null（推測で埋めない） */
  age: number | null;
  title: string;
  party: string;
  /** 一覧カードのリード文 */
  lead: string;
  /** 経歴・表明内容の出典表記 */
  bioSource: string;
  bio: LabeledText[];
  claims: LabeledText[];
  /** 高島市政への評価。言及が確認できない場合は null（推測で埋めない） */
  takashimaAssessment: TakashimaAssessment | null;
  links: CandidateLink[];
  /** 発信チャンネル。6種すべてを共通の並びで持ち、未確認は url を空にする */
  sns: SnsChannel[];
  /** 全 IssueId のキーを必ず持つ。情報がない分野は「未表明」として並べる。 */
  positions: Record<IssueId, CandidatePosition>;
};

/** 立候補予定者ページのタブ。URLの ?tab= に反映する */
export type CandidateTab = "profile" | "policies";

export type EarlyVotingPlace = {
  ward: string;
  place: string;
};

export type ElectionSchedule = {
  /** 告示日（日本時間の 00:00） */
  kokujiAt: string;
  /**
   * カウントダウンの基準となる投票終了日時。
   * 公職選挙法40条の標準時刻であり、投票所ごとの公表値ではない。
   */
  voteClosesAt: string;
  /** カウントダウンが目安である旨の注記。投票所ごとの時刻が公表されたら空にする */
  voteClosesNote: string;
  kokujiLabel: string;
  voteDateLabel: string;
  earlyVotingPeriod: string;
  earlyVotingHours: string;
  earlyVotingPlaces: EarlyVotingPlace[];
  /** 期日前投票所一覧が未公表であることの注記（公表後に空にする） */
  earlyVotingNote: string;
  sourceLabel: string;
  sourceUrl: string;
};

/** 選挙の進行段階。呼称と並び順ラベルの切り替えに使う。 */
export type ElectionPhase = "before-kokuji" | "campaigning" | "after-vote";

/**
 * 討論会での1回分の発言。
 *
 * 要約はこちらの言い換えなので、必ず動画の再生位置（time）を持たせ、
 * 読み手が元の発言をその位置から確かめられるようにする。
 */
export type DebateStatement = {
  /** Candidate.id */
  candidateId: string;
  /** 動画の再生位置。"01:23:45" 形式（withVideoTimestamp で URL に付ける） */
  time: string;
  text: string;
  /**
   * 補足。本人が出典を示さずに挙げた数字など、読み手に断っておくことを書く。
   * こちらの評価は書かない。
   */
  note?: string;
};

/** 高島市政の評価のコーナーでの、1人分のフリップと追加質問への答え */
export type DebateTakashimaAnswer = {
  candidateId: string;
  time: string;
  /** フリップに書いた「継続すること」。書かれたとおりに載せる */
  flipKeep: string;
  /** フリップに書いた「変更すること」。書かれたとおりに載せる */
  flipChange: string;
  /** 継続することについての口頭の説明（要約）。フリップ以上の説明がなければ空文字 */
  keep: string;
  /** 変更することについての口頭の説明（要約）。フリップ以上の説明がなければ空文字 */
  change: string;
  /** 司会の追加質問への答え。確認できない場合は undefined */
  followUp?: { time: string; text: string; note?: string };
};

/**
 * 問い（コーナー）ごとの「ざっくりまとめ」。
 *
 * 回答を読む前に、どんな方向の答えが出たかをつかむためのもの。こちらの整理であり、
 * 発言の要約にもとづいて方向ごとに名前を並べる。優劣・多数派の強調・評価は書かない。
 * 名前を挙げるのは、そのコーナーで発言が確認できた人に限る（テストで検証する）。
 */
export type DebateOverview = {
  /** 全体の傾向を1〜2文で */
  lead: string;
  points: { label: string; candidateIds: string[] }[];
};

/** 問いに続いて司会が全員に投げた追加の問い */
export type DebateFollowUpQuestion = {
  title: string;
  time: string;
  answers: DebateStatement[];
};

/**
 * 参加者が他の参加者に投げた問い（問題提起）と、それへの回答。
 * 回答は任意だったので、answers に載らない参加者がいても「無回答」として扱わない。
 */
export type DebateQuestion = {
  /** 表示用の連番（"01" 形式）。討論会で提起された順 */
  no: string;
  title: string;
  /** 提起した人の Candidate.id（共同提起があるので配列） */
  proposerIds: string[];
  time: string;
  /** 問いの前提の説明（司会による言い換えなど）。無ければ undefined */
  lead?: string;
  overview: DebateOverview;
  /** 提起した人の問題提起の発言。字幕で確認できたものだけ */
  proposals: DebateStatement[];
  answers: DebateStatement[];
  /** 提起した人のまとめ */
  closings: DebateStatement[];
  followUps: DebateFollowUpQuestion[];
};

export type DebateSegment = {
  label: string;
  /** 1人あたりの持ち時間など */
  detail: string;
  time: string;
};

export type Debate = {
  /** URL に使う ID */
  id: string;
  title: string;
  /** 一覧・パンくずで使う短い名前 */
  shortTitle: string;
  /** 配信日。"2026-10-28" */
  date: string;
  dateLabel: string;
  channel: string;
  videoTitle: string;
  videoUrl: string;
  duration: string;
  venue: string;
  moderator: string;
  /** 出演者の Candidate.id（並びは表示時に表明順へそろえる） */
  participantIds: string[];
  /**
   * 開催時点で表明していたが出演しなかった人の Candidate.id。
   * 開催後に表明した人まで「出演なし」と出ないよう、全候補者との差分ではなく明示する。
   * 不参加の理由（司会の説明など）は、本人の確認が取れないので載せない。
   */
  notAppearingIds: string[];
  segments: DebateSegment[];
  /** 司会が示した進行の方針 */
  moderatorPolicy: { time: string; text: string } | null;
  takashima: {
    time: string;
    overview: DebateOverview;
    answers: DebateTakashimaAnswer[];
  };
  questions: DebateQuestion[];
  messages: { time: string; answers: DebateStatement[] };
};
