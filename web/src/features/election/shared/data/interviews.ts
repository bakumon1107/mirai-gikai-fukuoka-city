import type { CandidateInterview, InterviewSeries } from "../types";

/**
 * ReHac9（リハック九州）の立候補予定者インタビュー
 * 「【ReHac9生配信】福岡市長選立候補予定者インタビュー【なんで立候補するんですか？○○】」。
 *
 * ReHac9 の再生リスト「福岡市長選『なんで立候補するんですか？』」に、吉富氏を除く13人分がまとまっている。
 * 個々の動画は、URLが確認できた人だけを CANDIDATE_INTERVIEWS に載せる（推測でURLを置かない）。
 * 載っていない人は、表示側で再生リストへのリンクに置き換える。リンクの有無で露出に差を出さないため。
 * 中身の要約は載せず、リンクのみとする（討論会のような発言の整理はしていないため）。
 *
 * 2026年10月29日に、再生リストの13本すべてについてURL・タイトル・チャンネルを確認した。
 * title は公開されているとおり。date は生配信の開始日（日本時間）。並びは表明順。
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
const CHANNEL = INTERVIEW_SERIES.channel;

export const CANDIDATE_INTERVIEWS: CandidateInterview[] = [
  {
    candidateId: "watanabe-hisaya",
    title: `${SERIES}【なんで立候補するんですか？渡辺久也】`,
    url: "https://www.youtube.com/watch?v=WEMEXQlhgV0",
    date: "2026-10-14",
    channel: CHANNEL,
  },
  {
    candidateId: "nishiwaki-hiroki",
    title: `${SERIES}【なんで立候補するんですか？西脇ひろき】`,
    url: "https://www.youtube.com/watch?v=q4XbPRdvaPI",
    date: "2026-10-23",
    channel: CHANNEL,
  },
  {
    candidateId: "aramaki-akira",
    title: `${SERIES}【なんで立候補するんですか？あらまき明楽】`,
    url: "https://www.youtube.com/watch?v=nzgBy62WnaE",
    date: "2026-10-15",
    channel: CHANNEL,
  },
  {
    candidateId: "niimura-masaru",
    title: `${SERIES}【なんで立候補するんですか？新村まさる】`,
    url: "https://www.youtube.com/watch?v=yjeaHfUNmeE",
    date: "2026-10-19",
    channel: CHANNEL,
  },
  {
    candidateId: "shirabe-takashi",
    title: `${SERIES}【なんで立候補するんですか？調たかし】`,
    url: "https://www.youtube.com/watch?v=ApuUPKHSRQc",
    date: "2026-10-26",
    channel: CHANNEL,
  },
  {
    candidateId: "inoue-kiyoshi",
    title: `${SERIES}【なんで立候補するんですか？井上きよし】`,
    url: "https://www.youtube.com/watch?v=8MQzkIY6oko",
    date: "2026-10-22",
    channel: CHANNEL,
  },
  {
    candidateId: "mori-kentaro",
    title: `${SERIES}【なんで立候補するんですか？森けんたろう】`,
    url: "https://www.youtube.com/watch?v=enHXJINoM_M",
    date: "2026-10-25",
    channel: CHANNEL,
  },
  {
    candidateId: "abe-hideki",
    title: `${SERIES}【なんで立候補するんですか？あべひでき】`,
    url: "https://www.youtube.com/watch?v=d9o6UYqxixA",
    date: "2026-10-13",
    channel: CHANNEL,
  },
  {
    candidateId: "nagasawa-kanta",
    title: `${SERIES}【なんで立候補するんですか？ながさわかんた】`,
    url: "https://www.youtube.com/watch?v=rvrRazOZFuE",
    date: "2026-10-19",
    channel: CHANNEL,
  },
  {
    candidateId: "sasaki-ayano",
    title: `${SERIES}【なんで立候補するんですか？佐々木あやの】`,
    url: "https://www.youtube.com/watch?v=xR1hClw6qjc",
    date: "2026-10-20",
    channel: CHANNEL,
  },
  {
    candidateId: "jinno-genki",
    title: `${SERIES}【なんで立候補するんですか？神野げんき】`,
    url: "https://www.youtube.com/watch?v=fflO8u8oqNA",
    date: "2026-10-21",
    channel: CHANNEL,
  },
  {
    candidateId: "katayama-sumiko",
    title: `${SERIES}【なんで立候補するんですか？片山すみこ】`,
    url: "https://www.youtube.com/watch?v=tLDoi76mjoY",
    date: "2026-10-22",
    channel: CHANNEL,
  },
  {
    candidateId: "inatomi-shuji",
    title: `${SERIES}【なんで立候補するんですか？いなとみ修二】`,
    url: "https://www.youtube.com/watch?v=NAYjYDDFJeE",
    date: "2026-10-22",
    channel: CHANNEL,
  },
];
