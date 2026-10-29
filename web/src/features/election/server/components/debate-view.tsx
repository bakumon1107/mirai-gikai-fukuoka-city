import "server-only";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CandidateNumber } from "../../client/components/candidate-number";
import { DisclaimerBar } from "../../client/components/disclaimer-bar";
import { OpenDetailsOnHash } from "../../client/components/open-details-on-hash";
import { SectionHeading } from "../../client/components/section-heading";
import { VideoTimeLink } from "../../client/components/video-time-link";
import { CANDIDATES } from "../../shared/data/candidates";
import {
  CANDIDATE_INTERVIEWS,
  INTERVIEW_SERIES,
} from "../../shared/data/interviews";
import type {
  Candidate,
  Debate,
  DebateStatement,
  ElectionPhase,
} from "../../shared/types";
import {
  collectCandidateStatements,
  sortByCandidateOrder,
} from "../../shared/utils/debate";
import {
  debatePath,
  debateQuestionAnchor,
} from "../../shared/utils/debate-routes";
import {
  getCandidateNoun,
  getOrderLabel,
} from "../../shared/utils/election-phase";
import {
  buildInterviewLinks,
  findInterviewLink,
  formatInterviewLinkLabel,
} from "../../shared/utils/interviews";
import {
  formatWithdrawalLabel,
  isWithdrawn,
} from "../../shared/utils/withdrawal";

type Props = {
  debate: Debate;
  phase: ElectionPhase;
  /** ?candidate= で選ばれた出演者。null なら全員の整理を出す */
  selectedCandidateId: string | null;
};

const CANDIDATE_ORDER = CANDIDATES.map((candidate) => candidate.id);
const CANDIDATE_BY_ID = new Map(
  CANDIDATES.map((candidate) => [candidate.id, candidate])
);

function candidateName(id: string): string {
  return CANDIDATE_BY_ID.get(id)?.name ?? id;
}

export function DebateView({ debate, phase, selectedCandidateId }: Props) {
  const noun = getCandidateNoun(phase);
  const orderLabel = getOrderLabel(phase);
  const participants = CANDIDATES.filter((candidate) =>
    debate.participantIds.includes(candidate.id)
  );
  const absentees = CANDIDATES.filter((candidate) =>
    debate.notAppearingIds.includes(candidate.id)
  );
  const selected = selectedCandidateId
    ? (CANDIDATE_BY_ID.get(selectedCandidateId) ?? null)
    : null;

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
      <OpenDetailsOnHash />
      <div className="border-b border-mirai-border bg-mirai-surface px-4 sm:px-6 py-3.5">
        <Breadcrumb
          items={[
            { label: "福岡市長選挙", href: "/election/2026" },
            { label: "討論会", href: "/election/2026#debates" },
            { label: debate.shortTitle },
          ]}
        />
      </div>

      <section className="px-4 sm:px-6 pb-6 pt-7">
        <p className="font-lexend text-[9px] font-bold tracking-[0.22em] text-primary">
          DEBATE — {debate.date.replaceAll("-", ".")}
        </p>
        <h1 className="mt-2.5 text-2xl font-bold leading-[1.4] tracking-[-0.02em] text-mirai-text">
          {debate.title}
        </h1>
        <p className="mt-2 text-[12.5px] leading-[1.9] text-mirai-text-secondary">
          {debate.dateLabel}・{debate.duration}。出演{participants.length}
          人の発言を、問いごとに並べて読めるように整理しました。
        </p>
        <div className="mt-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 border-mirai-border text-[11.5px] font-bold"
          >
            <a href={debate.videoUrl} target="_blank" rel="noreferrer">
              動画を見る（YouTube）
              <ArrowUpRight className="size-3.5" />
            </a>
          </Button>
        </div>

        <div className="mt-5 rounded-xl bg-mirai-light-gradient px-4.5 py-4">
          <p className="text-[10px] font-bold tracking-[0.1em] text-primary-deep">
            このページの読み方
          </p>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-xs leading-[1.85] text-mirai-text-secondary">
            <li>
              発言は動画の自動字幕から起こし、こちらで短く言い換えたものです。各発言の
              <span className="font-lexend text-[11px] text-primary-deep">
                {" "}
                ▶ 時刻{" "}
              </span>
              から、その位置の元の発言を確かめられます。
            </li>
            <li>
              並びは討論会での発言順ではなく、このサイトのほかのページと同じ
              {orderLabel}です。
            </li>
            <li>
              問いへの回答は任意でした。回答が載っていない人がいても、答えなかったことを意味するものではありません。
            </li>
            <li>本人が出典を示さずに挙げた数字には、その旨を添えています。</li>
            <li>
              「ざっくりまとめ」は、どんな方向の意見が出たかをこちらでまとめたものです。候補者の名前は挙げず、人数や優劣も示していません。
            </li>
          </ul>
        </div>
      </section>

      <DisclaimerBar>
        本ページは非公式サイトによる整理です。討論会の主催者・出演者とは関係がありません。発言の要約はAIで作成し、人が確認したものです。評価や勝ち負けは付けていません。特定の
        {noun}への投票を呼びかけるものではありません。
      </DisclaimerBar>

      <nav
        aria-label="出演者で絞り込む"
        className="border-b border-mirai-surface-muted bg-card px-4 sm:px-6 py-3.5"
      >
        <p className="text-[10.5px] font-bold text-mirai-text-muted">
          ひとりの発言を通して読む
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterPill
            href={debatePath(debate.id)}
            isActive={selected === null}
            label="全員"
          />
          {participants.map((candidate) => (
            <FilterPill
              key={candidate.id}
              href={debatePath(debate.id, candidate.id)}
              isActive={selected?.id === candidate.id}
              label={candidate.name}
            />
          ))}
        </div>
      </nav>

      {selected ? (
        <CandidateStatements debate={debate} candidate={selected} />
      ) : (
        <>
          <Overview
            debate={debate}
            participants={participants}
            absentees={absentees}
          />
          <TakashimaSection debate={debate} />
          <QuestionsSection debate={debate} />
          <MessagesSection debate={debate} />
          <MethodSection />
          <InterviewsSection debate={debate} />
        </>
      )}

      <section className="flex flex-col gap-2.5 px-4 sm:px-6 pb-10 pt-2 sm:flex-row">
        <Button asChild variant="outline" className="h-11 flex-1">
          <Link href="/election/2026">
            <ArrowLeft className="size-4" />
            福岡市長選挙のトップへ
          </Link>
        </Button>
      </section>
    </div>
  );
}

function FilterPill({
  href,
  isActive,
  label,
}: {
  href: string;
  isActive: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors",
        isActive
          ? "border-mirai-text bg-mirai-gradient text-mirai-text"
          : "border-mirai-border bg-card text-mirai-text-subtle hover:border-primary"
      )}
    >
      {label}
    </Link>
  );
}

function SpeakerLabel({ candidateId }: { candidateId: string }) {
  const candidate = CANDIDATE_BY_ID.get(candidateId);
  const withdrawn = candidate ? isWithdrawn(candidate) : false;
  return (
    <span className="flex min-w-0 items-center gap-2">
      {candidate && (
        <CandidateNumber no={candidate.no} size="sm" muted={withdrawn} />
      )}
      <span
        className={cn(
          "truncate text-[12.5px] font-bold",
          withdrawn ? "text-mirai-text-muted" : "text-mirai-text"
        )}
      >
        {candidateName(candidateId)}
      </span>
      {withdrawn && <WithdrawnBadge />}
    </span>
  );
}

/** 討論会のあとで立候補を取りやめた人の名前に添える */
function WithdrawnBadge() {
  return (
    <span className="shrink-0 rounded-sm border border-mirai-border bg-mirai-surface-grouped px-1.5 py-0.5 text-[9.5px] font-bold text-mirai-text-muted">
      立候補取りやめ
    </span>
  );
}

function StatementNote({ note }: { note?: string }) {
  if (!note) {
    return null;
  }
  return (
    <p className="mt-1 text-[10.5px] leading-[1.7] text-mirai-text-muted">
      ※{note}
    </p>
  );
}

/** 1人分の発言の行。話者・本文・再生位置 */
function StatementRow({
  debate,
  statement,
}: {
  debate: Debate;
  statement: DebateStatement;
}) {
  return (
    <li className="border-b border-mirai-surface-grouped py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <SpeakerLabel candidateId={statement.candidateId} />
        <VideoTimeLink videoUrl={debate.videoUrl} time={statement.time} />
      </div>
      <p className="mt-1.5 pl-10 text-xs leading-[1.85] text-mirai-text-secondary">
        {statement.text}
      </p>
      <div className="pl-10">
        <StatementNote note={statement.note} />
      </div>
    </li>
  );
}

/** 提起した人の問題提起・まとめ。回答と区別するため背景を付ける */
function ProposerBlock({
  debate,
  label,
  statements,
}: {
  debate: Debate;
  label: string;
  statements: readonly DebateStatement[];
}) {
  if (statements.length === 0) {
    return null;
  }
  const sorted = sortByCandidateOrder(statements, CANDIDATE_ORDER);
  return (
    <div className="rounded-lg bg-mirai-surface px-3.5 py-1">
      <p className="pt-2.5 text-[10px] font-bold tracking-[0.08em] text-primary-deep">
        {label}
      </p>
      <ul>
        {sorted.map((statement) => (
          <StatementRow
            key={`${statement.candidateId}-${statement.time}`}
            debate={debate}
            statement={statement}
          />
        ))}
      </ul>
    </div>
  );
}

function AnswerList({
  debate,
  statements,
}: {
  debate: Debate;
  statements: readonly DebateStatement[];
}) {
  const sorted = sortByCandidateOrder(statements, CANDIDATE_ORDER);
  return (
    <ul className="px-0.5">
      {sorted.map((statement) => (
        <StatementRow
          key={`${statement.candidateId}-${statement.time}`}
          debate={debate}
          statement={statement}
        />
      ))}
    </ul>
  );
}

/**
 * 事前インタビュー（ReHac9「なんで立候補するんですか？」）。
 * 出演者のうちシリーズに出ている人を表明順に並べる。個々の動画が分からない人も再生リストで案内し、
 * リンクの有無で差が出ないようにする。中身の要約はせず、リンクのみ。
 */
function interviewLinksFor(debate: Debate) {
  const participantOrder = CANDIDATE_ORDER.filter((id) =>
    debate.participantIds.includes(id)
  );
  return buildInterviewLinks(
    CANDIDATE_INTERVIEWS,
    INTERVIEW_SERIES,
    participantOrder
  );
}

/**
 * ページの一番下に置く。討論会そのものの整理を先に読めるようにし、
 * 前半（概要）には、この欄があることに気づくための1行だけを置く。
 */
function InterviewsSection({ debate }: { debate: Debate }) {
  const links = interviewLinksFor(debate);
  if (links.length === 0) {
    return null;
  }
  return (
    <section id="interviews" className="scroll-mt-24 px-4 sm:px-6 pb-8">
      <SectionHeading
        eyebrow="05 — INTERVIEWS"
        title="事前インタビュー"
        description="討論会の前に、同じチャンネルで一人ずつ「なんで立候補するんですか？」と聞いたインタビューが配信されています。こちらでは要約せず、動画へのリンクのみ載せています。"
      />
      <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.candidateId}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-mirai-border bg-card px-2.5 py-2 text-mirai-text no-underline transition-colors hover:border-primary"
            >
              <SpeakerLabel candidateId={link.candidateId} />
              <span className="ml-auto flex shrink-0 items-center gap-0.5 text-[10px] text-mirai-text-muted">
                {formatInterviewLinkLabel(link)}
                <ArrowUpRight className="size-3" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a
        href={INTERVIEW_SERIES.playlistUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary-accent"
      >
        再生リスト「{INTERVIEW_SERIES.title}」（{INTERVIEW_SERIES.channel}）
        <ArrowUpRight className="size-3" />
      </a>
    </section>
  );
}

/** 概要に置く、ページ下の事前インタビューへの1行の案内 */
function InterviewsPointer({ debate }: { debate: Debate }) {
  const count = interviewLinksFor(debate).length;
  if (count === 0) {
    return null;
  }
  return (
    <a
      href="#interviews"
      className="mt-4 flex items-center gap-2.5 rounded-lg border border-mirai-border bg-mirai-surface px-3.5 py-2.5 text-mirai-text no-underline transition-colors hover:border-primary"
    >
      <Video className="size-4 shrink-0 text-primary-deep" />
      <span className="min-w-0 flex-1 text-[11.5px] leading-[1.7]">
        <span className="font-bold">事前インタビューもあります。</span>
        <span className="text-mirai-text-subtle">
          出演{count}
          人それぞれの「なんで立候補するんですか？」を、ページの最後にまとめています。
        </span>
      </span>
      <ChevronDown className="size-3.5 shrink-0 text-primary" />
    </a>
  );
}

function Overview({
  debate,
  participants,
  absentees,
}: {
  debate: Debate;
  participants: Candidate[];
  absentees: Candidate[];
}) {
  const rows: { label: string; value: string }[] = [
    { label: "配信", value: `${debate.dateLabel}（${debate.duration}）` },
    { label: "チャンネル", value: debate.channel },
    { label: "会場", value: debate.venue },
    { label: "司会", value: debate.moderator },
    {
      label: "出演",
      value: `${participants.length}人（${participants.map((candidate) => candidate.name).join("、")}）`,
    },
  ];
  if (absentees.length > 0) {
    rows.push({
      label: "出演なし",
      value: absentees.map((candidate) => candidate.name).join("、"),
    });
  }
  // 立候補を取りやめた人も、発言は記録として残す
  const withdrawn = participants.flatMap((candidate) =>
    candidate.withdrawal
      ? [`${candidate.name}（${formatWithdrawalLabel(candidate.withdrawal)}）`]
      : []
  );
  if (withdrawn.length > 0) {
    rows.push({
      label: "取りやめ",
      value: `${withdrawn.join("、")}。発言は討論会の記録として残しています。`,
    });
  }

  return (
    <section className="px-4 sm:px-6 pb-8 pt-8">
      <SectionHeading eyebrow="01 — OVERVIEW" title="討論会の概要" />
      <dl className="mt-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[72px_1fr] gap-3.5 border-b border-mirai-surface-grouped py-[11px] last:border-b-0"
          >
            <dt className="text-[11px] font-bold text-mirai-text-muted">
              {row.label}
            </dt>
            <dd className="text-[12.5px] leading-[1.8] text-mirai-text-secondary">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <InterviewsPointer debate={debate} />

      <h3 className="mt-6 text-[13.5px] font-bold text-mirai-text">進行</h3>
      <ol className="mt-2.5 flex flex-col gap-2">
        {debate.segments.map((segment, index) => (
          <li
            key={segment.label}
            className="flex items-start gap-3 rounded-[10px] border border-mirai-border px-3.5 py-3"
          >
            <span className="w-5 shrink-0 font-lexend text-[11px] font-bold text-primary">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] font-bold text-mirai-text">
                {segment.label}
              </span>
              <span className="mt-0.5 block text-[11px] leading-[1.7] text-mirai-text-subtle">
                {segment.detail}
              </span>
            </span>
            <VideoTimeLink videoUrl={debate.videoUrl} time={segment.time} />
          </li>
        ))}
      </ol>
      {debate.moderatorPolicy && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] leading-[1.8] text-mirai-text-subtle">
          司会の方針：{debate.moderatorPolicy.text}
          <VideoTimeLink
            videoUrl={debate.videoUrl}
            time={debate.moderatorPolicy.time}
          />
        </p>
      )}

      <h3 className="mt-6 text-[13.5px] font-bold text-mirai-text">目次</h3>
      <ul className="mt-2.5 overflow-hidden rounded-xl border border-mirai-border">
        <TocItem href="#takashima" no="—" label="高島市政の評価" />
        {debate.questions.map((question) => (
          <TocItem
            key={question.no}
            href={`#${debateQuestionAnchor(question)}`}
            no={question.no}
            label={question.title}
            sub={`提起：${question.proposerIds.map(candidateName).join("・")}`}
          />
        ))}
        <TocItem href="#messages" no="—" label="最後のメッセージ" />
        {interviewLinksFor(debate).length > 0 && (
          <TocItem href="#interviews" no="—" label="事前インタビュー" />
        )}
      </ul>
    </section>
  );
}

function TocItem({
  href,
  no,
  label,
  sub,
}: {
  href: string;
  no: string;
  label: string;
  sub?: string;
}) {
  return (
    <li className="border-b border-mirai-surface-grouped last:border-b-0">
      <a
        href={href}
        className="flex items-center gap-3 px-4 py-[11px] text-mirai-text no-underline transition-colors hover:bg-mirai-surface"
      >
        <span className="w-[22px] shrink-0 font-lexend text-[10px] font-bold text-primary">
          {no}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] font-bold leading-[1.5]">
            {label}
          </span>
          {sub && (
            <span className="block text-[10.5px] text-mirai-text-muted">
              {sub}
            </span>
          )}
        </span>
        <ChevronRight className="size-3.5 shrink-0 text-primary" />
      </a>
    </li>
  );
}

/** ざっくりまとめ。名前は挙げず、どんな方向の意見が出たかだけを書く */
function SummaryBox({ summary }: { summary: string }) {
  return (
    <div className="rounded-lg bg-mirai-light-gradient px-3.5 py-3">
      <p className="text-[10px] font-bold tracking-[0.08em] text-primary-deep">
        ざっくりまとめ
      </p>
      <p className="mt-1 text-[12px] leading-[1.85] text-mirai-text-secondary">
        {summary}
      </p>
    </div>
  );
}

function TakashimaSection({ debate }: { debate: Debate }) {
  const answers = sortByCandidateOrder(
    debate.takashima.answers,
    CANDIDATE_ORDER
  );
  return (
    <section id="takashima" className="scroll-mt-24 px-4 sm:px-6 pb-8">
      <SectionHeading
        eyebrow="02 — ON THE TAKASHIMA ADMINISTRATION"
        title="高島市政の評価"
        description="各自がフリップに「継続すること」と「変更すること」を書いて説明し、続けて司会の質問に答えました。フリップは書かれたとおりに、説明は要約で載せています。"
      />
      <div className="mt-3">
        <SummaryBox summary={debate.takashima.summary} />
      </div>
      <div className="mt-2 flex justify-end">
        <VideoTimeLink
          videoUrl={debate.videoUrl}
          time={debate.takashima.time}
        />
      </div>
      <div className="mt-2 flex flex-col gap-2.5">
        {answers.map((answer) => (
          <div
            key={answer.candidateId}
            className="rounded-[10px] border border-mirai-border p-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <SpeakerLabel candidateId={answer.candidateId} />
              <VideoTimeLink videoUrl={debate.videoUrl} time={answer.time} />
            </div>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-mirai-surface px-3 py-2.5">
                <dt className="text-[10px] font-bold text-primary-deep">
                  継続すること
                </dt>
                <dd className="mt-1 text-[14px] font-bold leading-[1.6] text-mirai-text">
                  {answer.flipKeep}
                </dd>
                {answer.keep && (
                  <dd className="mt-1 text-[11.5px] leading-[1.75] text-mirai-text-subtle">
                    {answer.keep}
                  </dd>
                )}
              </div>
              <div className="rounded-lg bg-mirai-surface px-3 py-2.5">
                <dt className="text-[10px] font-bold text-primary-deep">
                  変更すること
                </dt>
                <dd className="mt-1 text-[14px] font-bold leading-[1.6] text-mirai-text">
                  {answer.flipChange}
                </dd>
                {answer.change && (
                  <dd className="mt-1 text-[11.5px] leading-[1.75] text-mirai-text-subtle">
                    {answer.change}
                  </dd>
                )}
              </div>
            </dl>
            {answer.followUp && (
              <div className="mt-2.5 border-t border-mirai-surface-grouped pt-2.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10.5px] font-bold text-mirai-text-muted">
                    司会の質問への答え
                  </p>
                  <VideoTimeLink
                    videoUrl={debate.videoUrl}
                    time={answer.followUp.time}
                  />
                </div>
                <p className="mt-1 text-xs leading-[1.85] text-mirai-text-secondary">
                  {answer.followUp.text}
                </p>
                <StatementNote note={answer.followUp.note} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function QuestionsSection({ debate }: { debate: Debate }) {
  return (
    <section className="px-4 sm:px-6 pb-8">
      <SectionHeading
        eyebrow="03 — QUESTIONS"
        title="出演者どうしの問い"
        description={`出演者が順に、ほかの出演者へ問いを投げました（${debate.questions.length}問）。回答は任意で、最後に問いを出した人がまとめています。問いを開くと回答が読めます。`}
      />
      <div className="mt-4 flex flex-col gap-2.5">
        {debate.questions.map((question) => (
          <details
            key={question.no}
            id={debateQuestionAnchor(question)}
            className="group scroll-mt-24 overflow-hidden rounded-xl border border-mirai-border"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 bg-card px-4 py-3.5 transition-colors hover:bg-mirai-surface [&::-webkit-details-marker]:hidden">
              <span className="w-[22px] shrink-0 font-lexend text-[10px] font-bold text-primary">
                {question.no}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-bold leading-[1.5] text-mirai-text">
                  {question.title}
                </span>
                <span className="mt-0.5 block text-[10.5px] text-mirai-text-muted">
                  提起：{question.proposerIds.map(candidateName).join("・")}
                </span>
              </span>
              <ChevronDown className="size-4 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="flex flex-col gap-3 border-t border-mirai-surface-muted px-3.5 pb-4 pt-3">
              <SummaryBox summary={question.summary} />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] leading-[1.7] text-mirai-text-subtle">
                  {question.lead ?? "問いの始まり"}
                </p>
                <VideoTimeLink
                  videoUrl={debate.videoUrl}
                  time={question.time}
                />
              </div>
              <ProposerBlock
                debate={debate}
                label="問題提起"
                statements={question.proposals}
              />
              <div>
                <p className="px-0.5 text-[10px] font-bold tracking-[0.08em] text-primary-deep">
                  回答
                </p>
                <AnswerList debate={debate} statements={question.answers} />
              </div>
              <ProposerBlock
                debate={debate}
                label="提起した人のまとめ"
                statements={question.closings}
              />
              {question.followUps.map((followUp) => (
                <div
                  key={followUp.title}
                  className="rounded-lg border border-mirai-border px-3.5 pt-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[12px] font-bold text-mirai-text">
                      <span className="mr-1.5 text-[10px] text-primary-deep">
                        司会の追加の問い
                      </span>
                      {followUp.title}
                    </p>
                    <VideoTimeLink
                      videoUrl={debate.videoUrl}
                      time={followUp.time}
                    />
                  </div>
                  <AnswerList debate={debate} statements={followUp.answers} />
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function MessagesSection({ debate }: { debate: Debate }) {
  return (
    <section id="messages" className="scroll-mt-24 px-4 sm:px-6 pb-8">
      <SectionHeading
        eyebrow="04 — MESSAGES"
        title="最後のメッセージ"
        description="ひとり45秒で、視聴者へのメッセージを述べました。"
      />
      <div className="mt-2 flex justify-end">
        <VideoTimeLink videoUrl={debate.videoUrl} time={debate.messages.time} />
      </div>
      <div className="mt-2 rounded-xl border border-mirai-border px-3.5">
        <AnswerList debate={debate} statements={debate.messages.answers} />
      </div>
    </section>
  );
}

function MethodSection() {
  return (
    <section className="px-4 sm:px-6 pb-8">
      <h2 className="text-[15px] font-bold text-mirai-text">整理の方法</h2>
      <ul className="mt-2.5 flex list-disc flex-col gap-1.5 pl-4 text-[11.5px] leading-[1.85] text-mirai-text-subtle">
        <li>
          動画の字幕は自動生成のみで、話者の区別がありません。司会が名前を呼んだ直後の発言をその人の発言とし、名前が字幕から落ちている箇所は、その問いでまだ話していない人と前後の受け答えから特定しました。
        </li>
        <li>
          誰の発言か確定できない部分、字幕の誤変換で数字や固有名詞が読み取れない部分は載せていません。
        </li>
        <li>
          市政への主張ではない個人的な見解や、冒頭のマイクテストは省いています。
        </li>
      </ul>
    </section>
  );
}

function CandidateStatements({
  debate,
  candidate,
}: {
  debate: Debate;
  candidate: Candidate;
}) {
  const items = collectCandidateStatements(debate, candidate.id);
  const withdrawn = isWithdrawn(candidate);
  const interview = findInterviewLink(
    CANDIDATE_INTERVIEWS,
    INTERVIEW_SERIES,
    candidate.id
  );
  return (
    <section className="px-4 sm:px-6 pb-8 pt-7">
      <div className="flex items-center gap-3">
        <CandidateNumber no={candidate.no} muted={withdrawn} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-mirai-text-muted">
            この討論会での発言（{items.length}件・討論会の順）
          </p>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.02em] text-mirai-text">
            {candidate.name}
          </h2>
        </div>
      </div>
      {candidate.withdrawal && (
        <p className="mt-3 rounded-lg bg-mirai-surface-grouped px-3.5 py-2.5 text-[11.5px] leading-[1.7] text-mirai-text-subtle">
          {formatWithdrawalLabel(candidate.withdrawal)}
          ました（
          <a
            href={candidate.withdrawal.url}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-accent"
          >
            {candidate.withdrawal.source}
          </a>
          ）。個人ページの掲載は終了し、討論会での発言だけ記録として残しています。
        </p>
      )}
      {interview && (
        <a
          href={interview.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-primary-accent"
        >
          事前インタビュー「なんで立候補するんですか？」（
          {formatInterviewLinkLabel(interview)}）
          <ArrowUpRight className="size-3" />
        </a>
      )}
      <ol className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={`${item.section}-${item.role}-${item.statement.time}`}
            className="rounded-lg bg-mirai-surface px-3.5 py-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm border border-mirai-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-mirai-text-note">
                {item.role}
              </span>
              <span className="min-w-0 flex-1 text-[10.5px] text-mirai-text-muted">
                {item.section}
              </span>
              <VideoTimeLink
                videoUrl={debate.videoUrl}
                time={item.statement.time}
              />
            </div>
            <p className="mt-1.5 text-xs leading-[1.85] text-mirai-text-secondary">
              {item.statement.text}
            </p>
            <StatementNote note={item.statement.note} />
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[10.5px] leading-[1.7] text-mirai-text-muted">
        問いへの回答は任意でした。ここに載っていない問いがあっても、答えなかったことを意味するものではありません。
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {!withdrawn && (
          <Link
            href={`/election/2026/candidates/${candidate.id}?tab=policies`}
            className="flex items-center gap-1 text-[11px] font-bold text-primary-accent"
          >
            {candidate.name}のページ（政策・主張）
            <ChevronRight className="size-3" />
          </Link>
        )}
        <Link
          href={debatePath(debate.id)}
          scroll={false}
          className="flex items-center gap-1 text-[11px] font-bold text-primary-accent"
        >
          全員の発言を問いごとに見る
          <ChevronRight className="size-3" />
        </Link>
      </div>
    </section>
  );
}
