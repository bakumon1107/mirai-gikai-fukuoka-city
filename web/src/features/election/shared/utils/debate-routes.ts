import type {
  Debate,
  DebateQuestion,
  IssueId,
  RelatedLink,
  StatementLog,
  StatementLogView,
} from "../types";

/**
 * 討論会ページへの導線（サイトTOP・選挙特設トップ・候補者ページ・争点ページ）で使う純粋関数。
 */

/** 新着として案内する日数。配信日を1日目として数える */
export const DEBATE_NEW_DAYS = 14;

/** 討論会ページの URL。candidateId を渡すと、その出演者の発言だけを並べる表示（?candidate=）にする */
export function debatePath(debateId: string, candidateId?: string): string {
  const base = `/election/2026/debates/${debateId}`;
  return candidateId ? `${base}?candidate=${candidateId}` : base;
}

/** 問いの位置。討論会ページ側の id と一致させる */
export function debateQuestionAnchor(question: Pick<DebateQuestion, "no">) {
  return `q-${question.no}`;
}

/** "2026-10-28" → "10/28" */
export function formatDebateMonthDay(date: string): string {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    return date;
  }
  return `${Number(match[1])}/${Number(match[2])}`;
}

/**
 * 新着として案内する討論会を1つ選ぶ。配信日から days 日以内（日本時間の日付で判定）で、
 * いちばん新しいもの。まだ配信前の日付のものは選ばない。
 */
export function findNewDebate(
  debates: readonly Debate[],
  now: Date,
  days: number = DEBATE_NEW_DAYS
): Debate | null {
  const today = toJstDayNumber(now);
  const candidates = debates
    .map((debate) => ({ debate, day: parseDayNumber(debate.date) }))
    .filter(
      (item): item is { debate: Debate; day: number } =>
        item.day !== null && item.day <= today && today - item.day < days
    )
    .sort((a, b) => b.day - a.day);
  return candidates[0]?.debate ?? null;
}

function toJstDayNumber(now: Date): number {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return Math.floor(
    Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate()) /
      86_400_000
  );
}

function parseDayNumber(date: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    return null;
  }
  return Math.floor(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) /
      86_400_000
  );
}

export type IssueDebateQuestion = {
  debate: Debate;
  question: DebateQuestion;
  /** 問題提起・回答・まとめで発言が載っている人数（追加の問いは含めない） */
  speakerCount: number;
};

/** 争点ページに出す「討論会でこの分野が問われました」の一覧。討論会の新しい順、問いの順 */
export function findDebateQuestionsForIssue(
  debates: readonly Debate[],
  issueId: IssueId
): IssueDebateQuestion[] {
  return [...debates]
    .sort((a, b) => b.date.localeCompare(a.date))
    .flatMap((debate) =>
      debate.questions
        .filter((question) => question.issueIds.includes(issueId))
        .map((question) => ({
          debate,
          question,
          speakerCount: new Set(
            [
              ...question.proposals,
              ...question.answers,
              ...question.closings,
            ].map((statement) => statement.candidateId)
          ).size,
        }))
    );
}

export type DebateSectionLink = RelatedLink;

/**
 * 候補者ページの「発言の記録」の討論会の行から、討論会ページの同じ場面へのリンクを作る。
 *
 * 行の url（動画URL＋再生位置）から、どの討論会のどの場面（高島市政の評価・問い・メッセージ）の
 * 発言かを決める。場面の始まりの時刻で区切るので、データ側に問いの番号を持たせなくてよい。
 * 自己紹介など、どの場面にも入らない時刻や、討論会の動画でない URL は null。
 */
export function findDebateSectionLink(
  debates: readonly Debate[],
  statement: Pick<StatementLog, "url">
): DebateSectionLink | null {
  if (!statement.url) {
    return null;
  }
  const parsed = parseVideoPosition(statement.url);
  if (!parsed) {
    return null;
  }
  const debate = debates.find(
    (item) => parseVideoPosition(item.videoUrl)?.videoId === parsed.videoId
  );
  if (!debate || parsed.seconds === null) {
    return null;
  }

  const sections = [
    {
      start: hmsToSeconds(debate.takashima.time),
      anchor: "takashima",
      label: "高島市政の評価で全員のフリップを見る",
    },
    ...debate.questions.map((question) => ({
      start: hmsToSeconds(question.time),
      anchor: debateQuestionAnchor(question),
      label: `この問いでの全員の回答を見る（問い${question.no} ${question.title}）`,
    })),
    {
      start: hmsToSeconds(debate.messages.time),
      anchor: "messages",
      label: "全員の最後のメッセージを見る",
    },
  ]
    .filter(
      (section): section is typeof section & { start: number } =>
        section.start !== null
    )
    .sort((a, b) => a.start - b.start);

  const seconds = parsed.seconds;
  const section = sections.filter((item) => item.start <= seconds).at(-1);
  if (!section) {
    return null;
  }
  return {
    href: `${debatePath(debate.id)}#${section.anchor}`,
    label: section.label,
  };
}

/** 発言の記録に、討論会ページの同じ場面へのリンクを付ける。該当しない行はそのまま */
export function attachDebateLinks(
  debates: readonly Debate[],
  log: readonly StatementLog[]
): StatementLogView[] {
  return log.map((statement) => {
    const related = findDebateSectionLink(debates, statement);
    return related ? { ...statement, related } : statement;
  });
}

function hmsToSeconds(hms: string): number | null {
  const match = /^(\d{1,2}):([0-5]\d):([0-5]\d)$/.exec(hms);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

/** YouTube の URL から動画IDと再生位置（t=秒s）を取り出す */
function parseVideoPosition(
  url: string
): { videoId: string; seconds: number | null } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const videoId =
    parsed.searchParams.get("v") ??
    (parsed.hostname === "youtu.be" ? parsed.pathname.slice(1) : null);
  if (!videoId) {
    return null;
  }
  const t = parsed.searchParams.get("t");
  const match = t ? /^(\d+)s?$/.exec(t) : null;
  return { videoId, seconds: match ? Number(match[1]) : null };
}
