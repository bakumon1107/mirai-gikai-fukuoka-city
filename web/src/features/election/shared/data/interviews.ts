import type { CandidateInterview, InterviewSeries } from "../types";

/**
 * ReHac9（リハック九州）の立候補予定者インタビュー
 * 「【ReHac9生配信】福岡市長選立候補予定者インタビュー【なんで立候補するんですか？○○】」。
 *
 * ReHac9 の再生リスト「福岡市長選『なんで立候補するんですか？』」に、吉富氏を除く13人分がまとまっている。
 * 個々の動画は、URLが確認できた人だけを CANDIDATE_INTERVIEWS に載せる（推測でURLを置かない）。
 * まだ載っていない人は、表示側で再生リストへのリンクに置き換える。リンクの有無で露出に差を出さないため。
 * 中身の要約は載せず、リンクのみとする（討論会のような発言の整理はしていないため）。
 *
 * 確認できたら追記する。date は配信日。
 */
export const INTERVIEW_SERIES: InterviewSeries = {
  title: "福岡市長選『なんで立候補するんですか？』",
  channel: "ReHac9−リハック九州−",
  playlistUrl: "https://www.youtube.com/playlist?list=PLAZys04iLUR8",
  candidateIds: [
    "watanabe-hisaya",
    "nishiwaki-hiroki",
    "aramaki-akira",
    "niimura-masaru",
    "shirabe-takashi",
    "inoue-kiyoshi",
    "mori-kentaro",
    "abe-hideki",
    "nagasawa-kanta",
    "sasaki-ayano",
    "jinno-genki",
    "katayama-sumiko",
    "inatomi-shuji",
  ],
};

const SERIES = "【ReHac9生配信】福岡市長選立候補予定者インタビュー";

export const CANDIDATE_INTERVIEWS: CandidateInterview[] = [
  {
    candidateId: "watanabe-hisaya",
    title: `${SERIES}【なんで立候補するんですか？渡辺久也】`,
    url: "https://www.youtube.com/watch?v=WEMEXQlhgV0",
    date: "2026-10-13",
    channel: "ReHac9−リハック九州−",
  },
  {
    candidateId: "aramaki-akira",
    title: `${SERIES}【なんで立候補するんですか？あらまき明楽】`,
    url: "https://www.youtube.com/watch?v=nzgBy62WnaE",
    date: "2026-10-14",
    channel: "ReHac9−リハック九州−",
  },
  {
    candidateId: "niimura-masaru",
    title: `${SERIES}【なんで立候補するんですか？新村まさる】`,
    url: "https://www.youtube.com/watch?v=yjeaHfUNmeE",
    date: "2026-10-19",
    channel: "ReHac9−リハック九州−",
  },
  {
    candidateId: "sasaki-ayano",
    title: `${SERIES}【なんで立候補するんですか？佐々木あやの】`,
    url: "https://www.youtube.com/watch?v=xR1hClw6qjc",
    date: "2026-10-19",
    channel: "ReHac9−リハック九州−",
  },
];
