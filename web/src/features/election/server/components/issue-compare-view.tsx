import "server-only";
import { ArrowUpRight, ChevronRight, Mic } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { CandidateNumber } from "../../client/components/candidate-number";
import { DisclaimerBar } from "../../client/components/disclaimer-bar";
import { PositionBody } from "../../client/components/position-body";
import { StancePill } from "../../client/components/stance-pill";
import { ACTIVE_CANDIDATES } from "../../shared/data/candidates";
import { DEBATES } from "../../shared/data/debates";
import { ISSUES } from "../../shared/data/issues";
import { ELECTION_SCHEDULE } from "../../shared/data/schedule";
import { buildSiteLinks } from "../../shared/data/site-links";
import type { ElectionPhase, Issue } from "../../shared/types";
import {
  attachDebateLinks,
  debatePath,
  debateQuestionAnchor,
  findDebateQuestionsForIssue,
  formatDebateMonthDay,
} from "../../shared/utils/debate-routes";
import {
  getCandidateNoun,
  getOrderLabel,
} from "../../shared/utils/election-phase";

type Props = {
  issue: Issue;
  phase: ElectionPhase;
  questionsSlug: string | null;
};

export function IssueCompareView({ issue, phase, questionsSlug }: Props) {
  const noun = getCandidateNoun(phase);
  const orderLabel = getOrderLabel(phase);
  const siteLinks = buildSiteLinks(questionsSlug);
  // 全員を同じ扱いで並べるページなので、問いを出した人の名前はここでは出さない（討論会ページで示す）
  const debateQuestions = findDebateQuestionsForIssue(DEBATES, issue.id);

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
      <div className="border-b border-mirai-border bg-mirai-surface px-4 sm:px-6 py-3.5">
        <Breadcrumb
          items={[
            { label: "福岡市長選挙", href: "/election/2026" },
            { label: "争点で比べる", href: "/election/2026" },
            { label: issue.label },
          ]}
        />
      </div>

      <section className="px-4 sm:px-6 pb-5 pt-7">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-mirai-text">
          {issue.label}
        </h1>
        <p className="mt-2.5 text-[12.5px] leading-[1.9] text-mirai-text-secondary">
          {orderLabel}に並べています。分類は各{noun}
          の記述にもとづく整理であり、優劣を示すものではありません。
        </p>

        <nav className="mt-4 flex flex-wrap gap-1.5">
          {ISSUES.map((candidateIssue) => {
            const isActive = candidateIssue.id === issue.id;
            return (
              <Link
                key={candidateIssue.id}
                href={`/election/2026/issues/${candidateIssue.id}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[11.5px] font-bold transition-colors",
                  isActive
                    ? "border-mirai-text bg-mirai-gradient text-mirai-text"
                    : "border-mirai-border bg-card text-mirai-text-subtle hover:border-primary"
                )}
              >
                {candidateIssue.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 rounded-xl bg-mirai-light-gradient px-4.5 py-4">
          <p className="text-[10px] font-bold tracking-[0.1em] text-primary-deep">
            背景
          </p>
          <p className="mt-1 text-base font-bold text-mirai-text">
            {issue.label}
          </p>
          <p className="mt-1.5 text-xs leading-[1.9] text-mirai-text-secondary">
            {issue.background}
          </p>
        </div>

        {debateQuestions.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {debateQuestions.map(({ debate, question, speakerCount }) => (
              <Link
                key={`${debate.id}-${question.no}`}
                href={`${debatePath(debate.id)}#${debateQuestionAnchor(question)}`}
                className="flex items-center gap-3 rounded-xl border border-mirai-border bg-card px-4 py-3.5 transition-colors hover:border-primary"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-mirai-light-gradient text-primary-deep">
                  <Mic className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold tracking-[0.08em] text-primary-deep">
                    討論会でこの分野が問われました
                  </span>
                  <span className="mt-0.5 block text-[13px] font-bold leading-[1.5] text-mirai-text">
                    問い{question.no}「{question.title}」
                  </span>
                  <span className="block text-[10.5px] text-mirai-text-subtle">
                    {debate.shortTitle}（{formatDebateMonthDay(debate.date)}
                    ）・{speakerCount}人が発言
                  </span>
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-primary" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2.5 px-4 sm:px-6 pb-7">
        {ACTIVE_CANDIDATES.map((candidate) => {
          const position = candidate.positions[issue.id];
          return (
            <div
              key={candidate.id}
              className="rounded-[10px] border border-mirai-border p-3.5"
            >
              <div className="flex items-center gap-3">
                <CandidateNumber no={candidate.no} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-mirai-text">
                    {candidate.name}
                  </p>
                  <p className="text-[10.5px] text-mirai-text-muted">
                    {candidate.party}
                  </p>
                </div>
                <StancePill stance={position.stance} />
              </div>
              <div className="mt-3">
                <PositionBody
                  summary={position.summary}
                  updated={position.updated}
                  log={attachDebateLinks(DEBATES, position.log)}
                />
              </div>
              <div className="mt-2.5 flex justify-end">
                <Link
                  href={`/election/2026/candidates/${candidate.id}`}
                  className="flex items-center gap-1 text-[10.5px] font-bold text-primary-accent"
                >
                  {candidate.name}のページ
                  <ChevronRight className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}

        {phase === "before-kokuji" && (
          <div className="rounded-[10px] border-[1.5px] border-dashed border-mirai-border bg-mirai-surface px-4.5 py-5 text-center">
            <p className="text-[11.5px] leading-[1.9] text-mirai-text-muted">
              この分野は、出馬表明があった人から順に行が増えていきます。告示は
              {ELECTION_SCHEDULE.kokujiLabel}です。
            </p>
          </div>
        )}
      </section>

      <section className="px-4 sm:px-6 pb-8">
        <h2 className="text-[15px] font-bold text-mirai-text">
          市議会の記録から背景を読む
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-[30px] items-center gap-1 rounded-full border border-mirai-border px-3 text-[11px] font-bold text-mirai-text transition-colors hover:border-primary"
            >
              {link.label}
              <ArrowUpRight className="size-3 text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <DisclaimerBar>
        本ページは非公式サイトによる整理です。掲載内容は報道および各陣営の公表資料をもとにAIで要約し、人が確認したものです。分野の分類は記述にもとづく整理であり、優劣やランキングを示すものではありません。特定の
        {noun}への投票を呼びかけるものではありません。
      </DisclaimerBar>
    </div>
  );
}
