import "server-only";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { CandidatePhoto } from "../../client/components/candidate-photo";
import { DisclaimerBar } from "../../client/components/disclaimer-bar";
import { StancePill } from "../../client/components/stance-pill";
import { CANDIDATES } from "../../shared/data/candidates";
import { ISSUES } from "../../shared/data/issues";
import { ELECTION_SCHEDULE } from "../../shared/data/schedule";
import { buildSiteLinks } from "../../shared/data/site-links";
import type { ElectionPhase, Issue } from "../../shared/types";
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

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
      <div className="border-b border-mirai-border bg-mirai-surface px-6 py-3.5">
        <Breadcrumb
          items={[
            { label: "福岡市長選挙", href: "/election/2026" },
            { label: "争点で比べる", href: "/election/2026" },
            { label: issue.label },
          ]}
        />
      </div>

      <section className="px-6 pb-5 pt-7">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-mirai-text text-pretty">
          {issue.label}
        </h1>
        <p className="mt-2.5 text-[12.5px] leading-[1.9] text-mirai-text-secondary text-pretty">
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
          <p className="mt-1.5 text-xs leading-[1.9] text-mirai-text-secondary text-pretty">
            {issue.background}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-2.5 px-6 pb-7">
        {CANDIDATES.map((candidate, index) => {
          const position = candidate.positions[issue.id];
          return (
            <div
              key={candidate.id}
              className="rounded-[10px] border border-mirai-border p-3.5"
            >
              <div className="flex items-center gap-3">
                <CandidatePhoto
                  candidate={candidate}
                  index={index}
                  size="row"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-mirai-text">
                    {candidate.name}
                  </p>
                  <p className="text-[10.5px] text-mirai-text-muted">
                    {candidate.no} ／ {candidate.party}
                  </p>
                </div>
                <StancePill stance={position.stance} />
              </div>
              <p className="mt-3 text-[12.5px] leading-[1.9] text-mirai-text-secondary text-pretty">
                {position.text}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                {position.source ? (
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-mirai-text-muted">
                      出典
                    </span>
                    {position.sourceUrl ? (
                      <a
                        href={position.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10.5px]"
                      >
                        {position.source}
                      </a>
                    ) : (
                      <span className="text-[10.5px] text-mirai-text-subtle">
                        {position.source}
                      </span>
                    )}
                  </span>
                ) : (
                  <span />
                )}
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

        <div className="rounded-[10px] border-[1.5px] border-dashed border-mirai-border bg-mirai-surface px-4.5 py-5 text-center">
          <p className="text-[11.5px] leading-[1.9] text-mirai-text-muted text-pretty">
            この分野は、出馬表明があった人から順に行が増えていきます。告示は
            {ELECTION_SCHEDULE.kokujiLabel}です。
          </p>
        </div>
      </section>

      <section className="px-6 pb-8">
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
