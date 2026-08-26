/** 争点（分野）のID。並び順は全立候補予定者で共通に固定する。 */
export type IssueId =
  | "kosodate"
  | "fukushi"
  | "kotsu"
  | "saikaihatsu"
  | "bosai"
  | "keizai"
  | "kanko"
  | "dx"
  | "zaisei";

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

export type CandidatePosition = {
  stance: Stance;
  text: string;
  /** 出典の表記。出典が確認できない場合は空文字にし、出典行を描画しない。 */
  source: string;
  /** 一次情報のURL。無い場合は undefined（ダミーリンクを置かない） */
  sourceUrl?: string;
};

export type LabeledText = {
  label: string;
  text: string;
};

export type CandidateLink = {
  label: string;
  url: string;
};

export type Candidate = {
  id: string;
  /** 表明順（告示後は届出順）。"01" 形式 */
  no: string;
  name: string;
  kana: string;
  /** 投開票日時点の年齢 */
  age: number;
  title: string;
  party: string;
  /** 一覧カードのリード文 */
  lead: string;
  /** 経歴・表明内容の出典表記 */
  bioSource: string;
  bio: LabeledText[];
  claims: LabeledText[];
  links: CandidateLink[];
  /** 全 IssueId のキーを必ず持つ。情報がない分野は「未表明」として並べる。 */
  positions: Record<IssueId, CandidatePosition>;
};

export type EarlyVotingPlace = {
  ward: string;
  place: string;
};

export type ElectionSchedule = {
  /** 告示日（日本時間の 00:00） */
  kokujiAt: string;
  /** 投票締切日時。カウントダウンの基準 */
  voteClosesAt: string;
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
