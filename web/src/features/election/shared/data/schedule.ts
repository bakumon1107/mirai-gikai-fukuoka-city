import type { ElectionSchedule } from "../types";

/**
 * 令和8年11月15日執行 福岡市長選挙の日程。
 *
 * 出典: 福岡市選挙管理委員会「福岡市長選挙の選挙期日等を決定しました」
 * https://www.city.fukuoka.lg.jp/senkan/senkyo/shisei/1115sityousen.html
 *
 * 期日前投票所の一覧は本稿時点で市選管が未公表のため、
 * 全区で確実に開設される区役所のみを掲載している。
 * 施設の追加公表があった時点で earlyVotingPlaces に追記し、
 * earlyVotingNote を空文字にすること。
 */
export const ELECTION_SCHEDULE: ElectionSchedule = {
  kokujiAt: "2026-11-01T00:00:00+09:00",
  voteClosesAt: "2026-11-15T20:00:00+09:00",
  kokujiLabel: "11月1日（日）",
  voteDateLabel: "11月15日（日）",
  earlyVotingPeriod: "11月2日（月）〜11月14日（土）",
  earlyVotingHours: "午前8時30分〜午後8時（施設により異なる）",
  earlyVotingPlaces: [
    { ward: "東区", place: "東区役所" },
    { ward: "博多区", place: "博多区役所" },
    { ward: "中央区", place: "中央区役所" },
    { ward: "南区", place: "南区役所" },
    { ward: "城南区", place: "城南区役所" },
    { ward: "早良区", place: "早良区役所" },
    { ward: "西区", place: "西区役所" },
  ],
  earlyVotingNote:
    "区役所以外の期日前投票所は、福岡市選挙管理委員会の公表後に掲載します。開設期間・時間は施設により異なります。",
  sourceLabel: "福岡市選挙管理委員会",
  sourceUrl:
    "https://www.city.fukuoka.lg.jp/senkan/senkyo/shisei/1115sityousen.html",
};
