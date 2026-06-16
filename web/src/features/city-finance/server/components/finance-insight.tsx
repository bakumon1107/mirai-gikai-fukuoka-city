import { formatPct } from "../../shared/utils/finance-format";
import type { CityFinanceView } from "../../shared/utils/finance-view";

/**
 * ビューモデルから事実ベースの読み解きを生成して箇条書き表示する。
 * （数値はすべて view（=公開データ）由来。断定的な評価は避ける）
 */
export function FinanceInsight({ view }: { view: CityFinanceView }) {
  const points: string[] = [];

  if (view.selfPct !== null) {
    points.push(
      `市の収入のうち、地方税など自分で集める「自主財源」は約${formatPct(view.selfPct)}です。残りは国からの交付金や借入などに頼っています。`
    );
  }

  const topExpense = view.expenditureComposition[0];
  if (topExpense) {
    points.push(
      `支出で最も大きいのは「${topExpense.label}」で、歳出全体の約${formatPct(topExpense.pct)}を占めます。`
    );
  }

  if (view.revenueYoyPct !== null) {
    const dir = view.revenueYoyPct >= 0 ? "増えました" : "減りました";
    points.push(
      `歳入は前年度から約${formatPct(Math.abs(view.revenueYoyPct))}${dir}。`
    );
  }

  if (view.perCapitaExpenditureYen !== null) {
    points.push(
      "市民1人あたりに換算すると、行政サービスの規模が実感しやすくなります。"
    );
  }

  if (points.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-mirai-surface-warm px-5 py-4">
      <h2 className="text-lg font-bold text-mirai-text">読み解きのポイント</h2>
      <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm text-mirai-text-secondary">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  );
}
