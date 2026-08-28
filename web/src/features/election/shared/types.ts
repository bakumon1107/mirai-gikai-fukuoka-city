/**
 * 争点（分野）のID。並び順は全立候補予定者で共通に固定する。
 *
 * `sonota` は他の分野に当てはまらない主張の受け皿で、常に最後に置く。
 * この枠がないと、分類できない主張が「言及なし」として消えるか、
 * 近い分野へ無理に押し込まれる。どちらも中立性を損なうため削らないこと。
 */
export type IssueId =
  | "kosodate"
  | "fukushi"
  | "kotsu"
  | "saikaihatsu"
  | "bosai"
  | "keizai"
  | "kanko"
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
