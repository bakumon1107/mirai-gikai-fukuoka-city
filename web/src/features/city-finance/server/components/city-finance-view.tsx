import type { ReactNode } from "react";
import { StackedAreaChart } from "../../client/components/stacked-area-chart";
import { TrendLineChart } from "../../client/components/trend-line-chart";
import {
  formatJapaneseYen,
  formatPerCapita,
  formatPct,
  formatReiwaFiscalYear,
} from "../../shared/utils/finance-format";
import type {
  CityFinanceView,
  RevenueCompositionItem,
} from "../../shared/utils/finance-view";
import { CompositionBars } from "./composition-bars";
import { FinanceInsight } from "./finance-insight";
import { FinanceSource } from "./finance-source";

const REVENUE_KIND_COLOR: Record<RevenueCompositionItem["kind"], string> = {
  self: "bg-primary",
  dependent: "bg-stance-neutral",
  other: "bg-mirai-border-light",
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-mirai-text">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-mirai-text-secondary">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs text-mirai-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-mirai-text tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-mirai-text-secondary">{sub}</p>}
    </div>
  );
}

export function CityFinanceSections({ view }: { view: CityFinanceView }) {
  if (!view.hasData || view.latestYear === null) {
    return (
      <div className="rounded-lg border border-border bg-card px-5 py-8 text-center text-mirai-text-secondary">
        財政データを準備中です。
      </div>
    );
  }

  const yoyText =
    view.revenueYoyPct === null
      ? undefined
      : `前年度比 ${view.revenueYoyPct >= 0 ? "+" : ""}${formatPct(view.revenueYoyPct)}`;

  return (
    <div className="flex flex-col gap-12">
      {/* サマリ */}
      <Section
        title={`福岡市のお金の流れ（${formatReiwaFiscalYear(view.latestYear)}・${view.latestYear}年度）`}
        description="市の1年間の収入（歳入）と支出（歳出）の全体像です。"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Stat
            label="歳入総額（入ってくるお金）"
            value={
              view.revenueTotalYen !== null
                ? formatJapaneseYen(view.revenueTotalYen)
                : "—"
            }
            sub={yoyText}
          />
          <Stat
            label="歳出総額（使うお金）"
            value={
              view.expenditureTotalYen !== null
                ? formatJapaneseYen(view.expenditureTotalYen)
                : "—"
            }
            sub={
              view.perCapitaExpenditureYen !== null
                ? `市民1人あたり ${formatPerCapita(view.perCapitaExpenditureYen)}`
                : undefined
            }
          />
        </div>
      </Section>

      {/* 収入構造 */}
      <Section
        title="お金はどこから来る？（収入構造）"
        description="「地方税」など自分で集める自主財源と、国からの交付金・借入などに頼る依存財源の割合です。"
      >
        {(view.selfPct !== null || view.dependentPct !== null) && (
          <div className="grid grid-cols-2 gap-3">
            <Stat
              label="自主財源（自分で集める）"
              value={view.selfPct !== null ? formatPct(view.selfPct) : "—"}
            />
            <Stat
              label="依存財源（国・借入に頼る）"
              value={
                view.dependentPct !== null ? formatPct(view.dependentPct) : "—"
              }
            />
          </div>
        )}
        <CompositionBars
          items={view.revenueComposition.map((c) => ({
            label: c.label,
            amount: c.amount,
            pct: c.pct,
            colorClass: REVENUE_KIND_COLOR[c.kind],
          }))}
        />
        {view.revenueSourceTrend.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 text-sm font-medium text-mirai-text">
              主要財源の推移（億円・積み上げ）
            </p>
            <p className="mb-2 text-xs text-mirai-text-muted">
              何が増え、何が減ったかを面の厚みで表します。
            </p>
            <StackedAreaChart
              series={view.revenueSourceTrend}
              unitLabel="億円"
            />
          </div>
        )}
      </Section>

      {/* 歳出 */}
      <Section
        title="何に使われる？（歳出の重点）"
        description="福祉（民生費）・教育・道路などの目的別の使いみちと、その推移です。"
      >
        <CompositionBars items={view.expenditureComposition} />
        {view.expenditureStackedTrend.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 text-sm font-medium text-mirai-text">
              目的別歳出の推移（億円・積み上げ）
            </p>
            <p className="mb-2 text-xs text-mirai-text-muted">
              上位項目とその他を積み上げて、規模と内訳の変化を示します。
            </p>
            <StackedAreaChart
              series={view.expenditureStackedTrend}
              unitLabel="億円"
            />
          </div>
        )}
      </Section>

      {/* 人口と財政 */}
      {view.populationTrend && view.populationTrend.length > 0 && (
        <Section
          title="人口と財政"
          description="人口の移り変わりと、市民1人あたりの行政サービスの規模です。"
        >
          <TrendLineChart
            series={[
              {
                name: "人口",
                values: view.populationTrend,
              },
            ]}
            unitLabel="万人"
            valueKind="manpeople"
          />
          {view.perCapitaExpenditureYen !== null && (
            <p className="text-sm text-mirai-text-secondary">
              直近の市民1人あたり歳出は約{" "}
              <span className="font-bold text-mirai-text">
                {formatPerCapita(view.perCapitaExpenditureYen)}
              </span>{" "}
              です。
            </p>
          )}
        </Section>
      )}

      {/* 読み解き */}
      <FinanceInsight view={view} />

      {/* 出典 */}
      <FinanceSource source={view.source} latestYear={view.latestYear} />
    </div>
  );
}
