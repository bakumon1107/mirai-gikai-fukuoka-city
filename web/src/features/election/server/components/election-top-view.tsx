import "server-only";
import { ArrowRight, ArrowUpRight, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { CandidatePhoto } from "../../client/components/candidate-photo";
import { DisclaimerBar } from "../../client/components/disclaimer-bar";
import { SectionHeading } from "../../client/components/section-heading";
import { VoteCountdown } from "../../client/components/vote-countdown";
import { CANDIDATES } from "../../shared/data/candidates";
import { ISSUES } from "../../shared/data/issues";
import { ELECTION_SCHEDULE } from "../../shared/data/schedule";
import { buildSiteLinks } from "../../shared/data/site-links";
import type { ElectionPhase } from "../../shared/types";
import { getCountdown } from "../../shared/utils/countdown";
import {
  getCandidateNoun,
  getOrderLabel,
} from "../../shared/utils/election-phase";
import { countStatedIssues } from "../../shared/utils/stance";

const HERO_SLOT_COUNT = 4;

type Props = {
  phase: ElectionPhase;
  questionsSlug: string | null;
};

export function ElectionTopView({ phase, questionsSlug }: Props) {
  const noun = getCandidateNoun(phase);
  const orderLabel = getOrderLabel(phase);
  const siteLinks = buildSiteLinks(questionsSlug);
  const initialDays = getCountdown(
    new Date(),
    ELECTION_SCHEDULE.voteClosesAt
  ).days;
  // 告示で立候補の届出が締め切られるため、以降は「表明待ち」の枠を出さない
  const isBeforeKokuji = phase === "before-kokuji";
  // 表明待ちスロットは、ヒーローの枠が合計4つになるよう候補者数に応じて増減させる
  const pendingSlotIds = isBeforeKokuji
    ? Array.from(
        { length: Math.max(0, HERO_SLOT_COUNT - CANDIDATES.length) },
        (_, offset) =>
          `slot-${String(CANDIDATES.length + offset + 1).padStart(2, "0")}`
      )
    : [];

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
      <section className="relative overflow-hidden bg-mirai-gradient px-6 pb-7 pt-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1.5 top-[46px] select-none font-lexend text-[92px] font-black leading-none tracking-[-0.055em] text-white/45"
        >
          2026
        </span>

        <div className="relative">
          <p className="inline-flex items-center rounded-full border border-primary-darkest/35 px-3.5 py-1.5 font-lexend text-[9.5px] font-bold tracking-[0.2em] text-primary-darkest">
            FUKUOKA MAYORAL ELECTION
          </p>
          <h1 className="mt-4 text-[30px] font-bold leading-[1.35] tracking-[-0.015em] text-mirai-text text-pretty">
            福岡市長選挙
            <br />
            {noun}と争点
          </h1>
          <p className="mt-3.5 max-w-[430px] text-[13px] leading-[1.95] text-mirai-text-secondary text-pretty">
            現職の高島宗一郎市長は不出馬を表明。出馬の意向を示した人から順に、公表内容を9つの分野で同じ物差しに並べていきます。評価や推薦は行いません。
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {CANDIDATES.map((candidate, index) => (
              <Link
                key={candidate.id}
                href={`/election/2026/candidates/${candidate.id}`}
                className="group block transition-transform duration-200 hover:-translate-y-1"
              >
                <CandidatePhoto
                  candidate={candidate}
                  index={index}
                  size="hero"
                />
                <p className="mt-2 text-[12.5px] font-bold leading-[1.4] tracking-[-0.01em] text-mirai-text">
                  {candidate.name}
                </p>
                <p className="mt-px text-[10px] leading-[1.4] text-primary-deep">
                  {candidate.title}
                </p>
              </Link>
            ))}
            {pendingSlotIds.map((slotId) => (
              <div key={slotId}>
                <div className="grid aspect-[3/4] w-full place-items-center rounded-[10px] border-[1.5px] border-dashed border-primary-darkest/35 bg-white/35">
                  <Plus
                    className="size-5 text-primary-darkest/40"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="mt-2 text-[11.5px] font-bold leading-[1.4] text-primary-darkest/55">
                  表明待ち
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5 rounded-xl bg-white/80 px-4.5 py-4">
            <VoteCountdown
              voteClosesAt={ELECTION_SCHEDULE.voteClosesAt}
              initialDays={initialDays}
            />
            <div className="hidden w-px self-stretch bg-primary-darkest/20 sm:block" />
            <div>
              <p className="text-[10px] font-bold tracking-[0.08em] text-primary-deep">
                告示
              </p>
              <p className="mt-0.5 text-[15px] font-bold leading-tight text-mirai-text">
                {ELECTION_SCHEDULE.kokujiLabel}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.08em] text-primary-deep">
                投開票
              </p>
              <p className="mt-0.5 text-[15px] font-bold leading-tight text-mirai-text">
                {ELECTION_SCHEDULE.voteDateLabel}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.08em] text-primary-deep">
                {isBeforeKokuji ? "出馬表明" : "立候補届出"}
              </p>
              <p className="mt-0.5 text-[15px] font-bold leading-tight text-mirai-text">
                {CANDIDATES.length}人{" "}
                <span className="text-[11px] font-medium text-mirai-text-subtle">
                  {orderLabel}
                </span>
              </p>
            </div>
            {ELECTION_SCHEDULE.voteClosesNote && (
              <p className="w-full text-[10px] leading-[1.7] text-mirai-text-muted">
                {ELECTION_SCHEDULE.voteClosesNote}
              </p>
            )}
          </div>
        </div>
      </section>

      <DisclaimerBar>
        本ページは非公式サイトによる整理です。掲載内容は報道および各陣営の公表資料をもとにAIで要約し、人が確認したものです。告示前は
        <strong>出馬表明順</strong>、告示後は<strong>届出順</strong>
        で並び順を固定します。特定の{noun}
        への投票を呼びかけるものではありません。
      </DisclaimerBar>

      <section className="px-6 pb-2 pt-8">
        <SectionHeading
          eyebrow="01 — CANDIDATES"
          title={isBeforeKokuji ? "出馬を表明した人" : "立候補した人"}
          description={
            isBeforeKokuji
              ? `${orderLabel}・敬称略。新たな表明があり次第、随時追加します。`
              : `${orderLabel}・敬称略。告示で立候補の届出が締め切られています。`
          }
        />
      </section>

      <section className="flex flex-col gap-3 px-6 pb-8 pt-4">
        {CANDIDATES.map((candidate, index) => (
          <Link
            key={candidate.id}
            href={`/election/2026/candidates/${candidate.id}`}
            className="rounded-xl border border-mirai-border bg-card p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-[3px] hover:border-primary hover:shadow-election-card-hover"
          >
            <div className="flex items-start gap-4">
              <CandidatePhoto
                candidate={candidate}
                index={index}
                size="card"
                showPlaceholderLabel
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-mirai-text-muted">
                  {candidate.kana}
                </p>
                <p className="mt-px text-xl font-bold leading-tight tracking-[-0.025em] text-mirai-text">
                  {candidate.name}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {candidate.age !== null && (
                    <span className="rounded-[5px] bg-mirai-surface-grouped px-1.5 py-0.5 text-[11px] font-medium text-mirai-text-secondary">
                      {candidate.age}歳
                    </span>
                  )}
                  <span className="rounded-[5px] bg-mirai-surface-grouped px-1.5 py-0.5 text-[11px] font-medium text-mirai-text-secondary">
                    {candidate.title}
                  </span>
                  <span className="rounded-[5px] bg-mirai-gradient px-1.5 py-0.5 text-[11px] font-medium text-primary-darkest">
                    {candidate.party}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-[1.85] text-mirai-text-secondary text-pretty">
                  {candidate.lead}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-mirai-surface-muted pt-2.5">
              <span className="text-[11px] text-mirai-text-muted">
                9分野のうち {countStatedIssues(candidate)}分野で言及あり
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-primary-accent">
                詳しく見る
                <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}

        {isBeforeKokuji && (
          <div className="rounded-xl border-[1.5px] border-dashed border-mirai-border bg-mirai-surface px-4.5 py-5 text-center">
            <p className="text-[13px] font-bold text-mirai-text-secondary">
              ほかの出馬表明を待っています
            </p>
            <p className="mx-auto mt-2 max-w-[400px] text-[11.5px] leading-[1.9] text-mirai-text-muted text-pretty">
              告示は{ELECTION_SCHEDULE.kokujiLabel}
              。新たに出馬を表明した人が確認できた時点で、同じ様式のカードと分野別の整理を追加します。現職の高島宗一郎市長は不出馬を表明しています。
            </p>
          </div>
        )}
      </section>

      <section className="px-6 pb-8">
        <SectionHeading
          eyebrow="02 — ISSUES"
          title="争点で比べる"
          description={`分野を選ぶと、全${noun}の立場を横並びで確認できます。`}
        />
        <div className="mt-4 overflow-hidden rounded-xl border border-mirai-border bg-card">
          {ISSUES.map((issue) => (
            <Link
              key={issue.id}
              href={`/election/2026/issues/${issue.id}`}
              className="flex items-center gap-3.5 border-b border-mirai-surface-grouped px-4 py-[15px] transition-colors last:border-b-0 hover:bg-mirai-surface"
            >
              <span className="w-[22px] shrink-0 font-lexend text-[10px] font-bold tracking-[0.06em] text-primary">
                {issue.no}
              </span>
              <span className="min-w-0 flex-1 text-[13.5px] font-bold leading-[1.5] text-mirai-text text-pretty">
                {issue.label}
              </span>
              <span className="shrink-0 whitespace-nowrap text-[10.5px] text-mirai-text-subtle">
                立場を見る
              </span>
              <ChevronRight className="size-3.5 shrink-0 text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-6 mb-8 overflow-hidden rounded-xl border border-mirai-border">
        <div className="border-b border-mirai-border bg-mirai-surface px-4.5 py-4">
          <h2 className="text-[15px] font-bold text-mirai-text">期日前投票</h2>
          <p className="mt-1.5 text-[11.5px] leading-[1.8] text-mirai-text-note">
            {ELECTION_SCHEDULE.earlyVotingPeriod}／
            {ELECTION_SCHEDULE.earlyVotingHours}
          </p>
        </div>
        <div className="flex flex-col bg-card">
          {ELECTION_SCHEDULE.earlyVotingPlaces.map((place) => (
            <div
              key={place.ward}
              className="flex items-baseline gap-3.5 border-b border-mirai-surface-grouped px-4.5 py-[11px]"
            >
              <span className="w-16 shrink-0 text-xs font-bold text-mirai-text">
                {place.ward}
              </span>
              <span className="flex-1 text-[11.5px] leading-[1.7] text-mirai-text-subtle">
                {place.place}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-mirai-surface-muted bg-card px-4.5 py-3">
          {ELECTION_SCHEDULE.earlyVotingNote && (
            <p className="text-[10.5px] leading-[1.7] text-mirai-text-note">
              {ELECTION_SCHEDULE.earlyVotingNote}
            </p>
          )}
          <p className="mt-1 text-[10.5px] leading-[1.7] text-mirai-text-muted">
            出典：
            <a
              href={ELECTION_SCHEDULE.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {ELECTION_SCHEDULE.sourceLabel}
            </a>
          </p>
        </div>
      </section>

      <section className="px-6 pb-10">
        <SectionHeading
          eyebrow="03 — CONTEXT"
          title="争点の背景を、市議会の記録から読む"
          description="交通・再開発・財政などの論点は、選挙より前から市議会で審議されています。公約の言葉と、実際に何が決まってきたかを合わせて確認できます。"
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col gap-1.5 rounded-[10px] border border-mirai-border bg-card p-3.5 transition-[border-color,box-shadow] hover:border-primary hover:shadow-election-link-hover"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-[13.5px] font-bold text-mirai-text">
                  {link.label}
                </span>
                <ArrowUpRight className="size-3.5 text-primary" />
              </span>
              <span className="text-[11px] leading-[1.7] text-mirai-text-subtle text-pretty">
                {link.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
