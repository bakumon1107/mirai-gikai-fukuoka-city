import type { ElectionSchedule } from "../types";

/**
 * 福岡市長選挙（再選挙）の日程。
 *
 * 令和8年11月15日執行の福岡市長選挙では、13人のいずれも法定得票数
 * （有効投票総数の4分の1）に届かず、再選挙になった。再選挙の期日は本稿時点で未定。
 * 異議の申出の期間（11月30日まで）が過ぎたあと50日以内に行われ、
 * 「1月3日告示・1月17日投開票」が有力視されていると報じられている（確定ではない）。
 *
 * 出典: 報道（TNCテレビ西日本、2026年11月18日）
 * https://news.tnc.co.jp/news/articles/NID2026111832908
 *
 * 市選管が期日を告示したら、次を埋めること。
 * - kokujiAt / voteClosesAt / kokujiLabel / voteDateLabel
 * - 期日前投票（earlyVotingPeriod / earlyVotingHours / earlyVotingPlaces / earlyVotingNote）
 * - sourceLabel / sourceUrl を市選管のページに差し替える
 * - voteClosesNote を、カウントダウンが目安である旨の注記に戻す
 *   （「カウントダウンは投票終了の標準時刻（午後8時）を目安にしています。投票所ごとの時刻は入場整理券でご確認ください。」）
 * - hiddenAt を投票日前日の 23:59 にする（公職選挙法上のリスクを避けるため、投票日当日は掲載しない）
 * - kokujiAt と voteClosesAt は必ず両方そろえて入れる（片方だけだと段階の判定と非公開が効かない。テストで検出する）
 *
 * 告示日を過ぎたら、候補者の一覧も届出に合わせて直すこと（日程を埋めるだけでは直らない）。
 * - 届け出た人に rerun を付け、届け出なかった人から外す（新たに届け出た人は候補者データを追加する）
 * - 番号 no を届出順に付け替える（11月15日の選挙の表明順の番号のまま「届出順」と表示しない）
 *
 * 期日前投票の欄は earlyVotingPlaces が空のあいだは出さない。
 * カウントダウンは voteClosesAt が null のあいだは出さない。
 *
 * 1回目（11月15日執行）の日程と出典:
 * 告示 11月1日（日）／投開票 11月15日（日）／期日前投票 11月2日（月）〜11月14日（土）
 * https://www.city.fukuoka.lg.jp/senkan/senkyo/shisei/1115sityousen.html
 */
export const ELECTION_SCHEDULE: ElectionSchedule = {
  kokujiAt: null,
  voteClosesAt: null,
  voteClosesNote:
    "再選挙の期日は、福岡市選挙管理委員会がまだ決めていません。異議の申出の期間（11月30日まで）が過ぎたあと50日以内に行われ、1月中旬までの見通しと報じられています。",
  kokujiLabel: "未定",
  voteDateLabel: "未定",
  earlyVotingPeriod: "",
  earlyVotingHours: "",
  earlyVotingPlaces: [],
  earlyVotingNote: "",
  sourceLabel: "報道（TNCテレビ西日本）",
  sourceUrl: "https://news.tnc.co.jp/news/articles/NID2026111832908",
  hiddenAt: null,
};
