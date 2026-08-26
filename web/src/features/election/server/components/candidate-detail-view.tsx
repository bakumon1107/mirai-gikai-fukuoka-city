import "server-only";
import { ArrowLeft, ArrowUpRight, Scale } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CandidatePhoto } from "../../client/components/candidate-photo";
import { DisclaimerBar } from "../../client/components/disclaimer-bar";
import { StancePill } from "../../client/components/stance-pill";
import { ISSUES } from "../../shared/data/issues";
import type { Candidate, ElectionPhase } from "../../shared/types";
import {
  getCandidateNoun,
  getOrderLabel,
} from "../../shared/utils/election-phase";

type Props = {
  candidate: Candidate;
  /** 表明順（0始まり）。プレースホルダーの配色に使う */
  index: number;
  phase: ElectionPhase;
};

export function CandidateDetailView({ candidate, index, phase }: Props) {
  const noun = getCandidateNoun(phase);
  const orderLabel = getOrderLabel(phase);

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
      <div className="border-b border-mirai-border bg-mirai-surface px-6 py-3.5">
        <Breadcrumb
          items={[
            { label: "福岡市長選挙", href: "/election/2026" },
            { label: candidate.name },
          ]}
        />
      </div>

      <section className="flex flex-col gap-5 px-6 py-7 sm:flex-row">
        <CandidatePhoto
          candidate={candidate}
          index={index}
          size="detail"
          showPlaceholderLabel
        />
        <div className="min-w-0 flex-1">
          <p className="font-lexend text-[10px] tracking-[0.14em] text-primary">
            {candidate.no} {orderLabel}
          </p>
          <p className="mt-1.5 text-xs text-mirai-text-muted">
            {candidate.kana}
          </p>
          <h1 className="mt-px text-[28px] font-bold leading-tight tracking-[-0.02em] text-mirai-text">
            {candidate.name}
          </h1>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-[5px] bg-mirai-surface-grouped px-2 py-1 text-[11.5px] font-medium text-mirai-text-secondary">
              {candidate.age}歳
            </span>
            <span className="rounded-[5px] bg-mirai-surface-grouped px-2 py-1 text-[11.5px] font-medium text-mirai-text-secondary">
              {candidate.title}
            </span>
            <span className="rounded-[5px] bg-mirai-gradient px-2 py-1 text-[11.5px] font-medium text-primary-darkest">
              {candidate.party}
            </span>
          </div>
          {candidate.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {candidate.links.map((link) => (
                <Button
                  key={link.url}
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 border-mirai-border text-[11.5px] font-bold"
                >
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      <DisclaimerBar>
        本ページは非公式サイトによる整理です。以下は報道および公表資料をもとにAIで要約し、人が確認したものです。分野の分類は記述にもとづく整理であり、優劣を示すものではありません。特定の
        {noun}への投票を呼びかけるものではありません。
      </DisclaimerBar>

      <section className="px-6 py-7">
        <h2 className="text-base font-bold text-mirai-text">経歴</h2>
        <dl className="mt-3">
          {candidate.bio.map((row, rowIndex) => (
            <div
              key={`${row.label}-${rowIndex}`}
              className="grid grid-cols-[64px_1fr] gap-3.5 border-b border-mirai-surface-grouped py-[11px] last:border-b-0"
            >
              <dt className="font-lexend text-[11px] font-medium text-mirai-text-muted">
                {row.label}
              </dt>
              <dd className="text-[12.5px] leading-[1.8] text-mirai-text-secondary text-pretty">
                {row.text}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[10.5px] leading-[1.7] text-mirai-text-muted">
          出典：{candidate.bioSource}
        </p>
      </section>

      <section className="px-6 pb-7">
        <div className="overflow-hidden rounded-xl border border-mirai-border">
          <div className="bg-mirai-light-gradient px-4 py-3.5">
            <p className="font-lexend text-[8.5px] font-bold tracking-[0.2em] text-primary">
              STATED SO FAR
            </p>
            <h2 className="mt-1 text-base font-bold text-mirai-text">
              これまでに表明していること
            </h2>
          </div>
          {candidate.claims.map((claim, claimIndex) => (
            <div
              key={`${claim.label}-${claimIndex}`}
              className="grid grid-cols-[88px_1fr] gap-3.5 border-t border-mirai-surface-grouped px-4 py-3.5"
            >
              <p className="text-[11.5px] font-bold text-primary-deep">
                {claim.label}
              </p>
              <p className="text-[12.5px] leading-[1.85] text-mirai-text-secondary text-pretty">
                {claim.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-7">
        <h2 className="text-base font-bold text-mirai-text">分野別の言及</h2>
        <p className="mt-1.5 text-[11.5px] leading-[1.8] text-mirai-text-muted text-pretty">
          9分野すべてを同じ並び順で掲載しています。言及が確認できていない分野も「未表明」として省略せずに並べています。
        </p>
        <div className="mt-4 flex flex-col gap-2.5">
          {ISSUES.map((issue) => {
            const position = candidate.positions[issue.id];
            return (
              <div
                key={issue.id}
                className="overflow-hidden rounded-[10px] border border-mirai-border"
              >
                <div className="flex items-center justify-between gap-3 border-b border-mirai-surface-muted bg-mirai-surface px-3.5 py-3">
                  <p className="flex items-center gap-2 text-[13px] font-bold text-mirai-text">
                    <span className="font-lexend text-[10px] font-bold text-primary">
                      {issue.no}
                    </span>
                    {issue.label}
                  </p>
                  <StancePill stance={position.stance} />
                </div>
                <div className="px-3.5 py-3.5">
                  <p className="text-[12.5px] leading-[1.9] text-mirai-text-secondary text-pretty">
                    {position.text}
                  </p>
                  {position.source && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
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
                      <Link
                        href={`/election/2026/issues/${issue.id}`}
                        className="text-[10.5px] text-mirai-text-subtle"
                      >
                        この分野で比べる
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2.5 px-6 pb-10 sm:flex-row">
        <Button asChild variant="outline" className="h-11 flex-1">
          <Link href="/election/2026">
            <ArrowLeft className="size-4" />
            {noun}一覧
          </Link>
        </Button>
        <Button asChild className="h-11 flex-1">
          <Link href={`/election/2026/issues/${ISSUES[0].id}`}>
            <Scale className="size-4" />
            争点別に比べる
          </Link>
        </Button>
      </section>
    </div>
  );
}
