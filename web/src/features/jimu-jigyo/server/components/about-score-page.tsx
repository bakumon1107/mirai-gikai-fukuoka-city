import "server-only";
import Link from "next/link";

export function AboutScorePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <Link
        href="/jimu-jigyo"
        className="text-sm text-grade-b flex items-center gap-1"
      >
        ← 事務事業評価一覧に戻る
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-mirai-text">
          このスコアの計算方法について
        </h1>
        <p className="text-sm text-mirai-text-secondary mt-2">
          福岡市が公開する「事務事業マネジメントシート」（令和6年度実施分）をもとに、
          行政の自己評価ではなく市民の視点から4つの軸で客観的な評価スコア（0〜100点）を算出しています。
        </p>
        <div className="mt-3 p-3 bg-mirai-surface-warm border border-mirai-border rounded-lg text-sm text-mirai-text-secondary">
          ⚠️
          このスコアはあくまで公開データをもとにした参考値です。事業の優劣を断定するものではありません。
        </div>
      </div>

      {/* 4軸概要 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "成果KPI達成", max: 40, anchor: "kpi" },
          { label: "改善トレンド", max: 30, anchor: "trend" },
          { label: "透明性", max: 10, anchor: "transparency" },
          { label: "予算効率", max: 20, anchor: "budget" },
        ].map((item) => (
          <a
            key={item.anchor}
            href={`#${item.anchor}`}
            className="border border-mirai-border rounded-lg p-3 text-center hover:border-grade-b transition-colors"
          >
            <p className="text-lg font-bold text-grade-b">{item.max}点</p>
            <p className="text-xs text-mirai-text-secondary">{item.label}</p>
          </a>
        ))}
      </div>

      <hr className="border-mirai-border" />

      {/* 軸① */}
      <section id="kpi" className="space-y-4">
        <h2 className="text-lg font-bold text-mirai-text">
          軸①: 成果KPI達成（最大40点）
        </h2>
        <p className="text-sm text-mirai-text-secondary">
          行政が設定した成果指標の達成率（実績÷目標）を評価します。
          ただし、達成率が極端に高い場合は「目標の設定が甘い」サインとみなし、点数を抑えます。
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-mirai-surface">
              <th className="border border-mirai-border px-3 py-2 text-left">
                達成率
              </th>
              <th className="border border-mirai-border px-3 py-2 text-left">
                点数換算
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["150%超", "0.8点（目標が低すぎる可能性）"],
              ["100〜150%", "1.0点（満点）"],
              ["80〜100%", "0.7点"],
              ["60〜80%", "0.4点"],
              ["60%未満", "0.1点"],
              ["目標値なし", "0.5点（暫定）"],
              ["実績値「集計中」等", "0.1点"],
            ].map(([rate, score]) => (
              <tr key={rate}>
                <td className="border border-mirai-border px-3 py-2">{rate}</td>
                <td className="border border-mirai-border px-3 py-2">
                  {score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-mirai-surface-warm border border-mirai-border rounded-lg p-3 text-sm text-mirai-text-secondary">
          <p className="font-medium text-mirai-text mb-1">
            なぜ150%超を満点にしないのか
          </p>
          達成率が150%を超えている場合、目標値が実態に対して低すぎる可能性があります。
          達成が容易な目標を設定して「達成できた」と報告することは、税金の適切な執行を判断する材料として不適切です。
        </div>
      </section>

      <hr className="border-mirai-border" />

      {/* 軸② */}
      <section id="trend" className="space-y-4">
        <h2 className="text-lg font-bold text-mirai-text">
          軸②: 改善トレンド（最大30点）
        </h2>
        <p className="text-sm text-mirai-text-secondary">
          令和5年度の実績 → 令和6年度の実績が改善しているかを評価します。
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-mirai-surface">
              <th className="border border-mirai-border px-3 py-2 text-left">
                R5→R6変化率
              </th>
              <th className="border border-mirai-border px-3 py-2 text-left">
                得点
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["+10%以上改善", "30点（満点）"],
              ["0〜+10%改善", "20点"],
              ["-10〜0%（微減）", "10点"],
              ["-10%超悪化", "0点"],
            ].map(([rate, score]) => (
              <tr key={rate}>
                <td className="border border-mirai-border px-3 py-2">{rate}</td>
                <td className="border border-mirai-border px-3 py-2">
                  {score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr className="border-mirai-border" />

      {/* 軸③ */}
      <section id="transparency" className="space-y-4">
        <h2 className="text-lg font-bold text-mirai-text">
          軸③: 透明性（最大10点）
        </h2>
        <p className="text-sm text-mirai-text-secondary">
          成果指標の目標値が設定されているか、データが公開されているか、
          いつ事業を終了するかが明確かを評価します。減点方式です。
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-mirai-surface">
              <th className="border border-mirai-border px-3 py-2 text-left">
                減点条件
              </th>
              <th className="border border-mirai-border px-3 py-2 text-left">
                減点
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["成果指標に目標値未設定が1件以上", "-5点"],
              ["主要KPIが「集計中」（データ取集中）", "-5点"],
              ["最終年度が「R年度」（未定）", "-3点"],
              ["達成率欄が「─」等が2件以上", "-5点"],
            ].map(([cond, penalty]) => (
              <tr key={cond}>
                <td className="border border-mirai-border px-3 py-2">{cond}</td>
                <td className="border border-mirai-border px-3 py-2 text-grade-d">
                  {penalty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr className="border-mirai-border" />

      {/* 軸④ */}
      <section id="budget" className="space-y-4">
        <h2 className="text-lg font-bold text-mirai-text">
          軸④: 予算効率（最大20点）
        </h2>
        <p className="text-sm text-mirai-text-secondary">
          予算の増減だけでなく、その予算でKPIがどれだけ改善したかを評価します。
          「コスト効率」（成果指標の達成率平均 ÷
          歳出）が前年度と比べてどう変化したかを見ます。
          予算が増えても、それ以上に成果が伸びていれば高評価になります。
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-mirai-surface">
              <th className="border border-mirai-border px-3 py-2 text-left">
                コスト効率の変化率（R5→R6）
              </th>
              <th className="border border-mirai-border px-3 py-2 text-left">
                得点
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["+10%以上向上", "20点（満点）"],
              ["0〜+10%向上", "15点"],
              ["-10〜0%（微低下）", "10点"],
              ["-10%超低下", "0点"],
            ].map(([rate, score]) => (
              <tr key={rate}>
                <td className="border border-mirai-border px-3 py-2">{rate}</td>
                <td className="border border-mirai-border px-3 py-2">
                  {score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-mirai-surface-warm border border-mirai-border rounded-lg p-3 text-sm text-mirai-text-secondary">
          <p className="font-medium text-mirai-text mb-1">
            達成率データがない場合のフォールバック
          </p>
          KPIの達成率が取得できない場合は、予算変化量のみで評価します（予算安定→15点、5〜30%増加→10点、30%超増加→5点）。
        </div>
      </section>

      <hr className="border-mirai-border" />

      {/* グレード定義 */}
      <section id="grade" className="space-y-4">
        <h2 className="text-lg font-bold text-mirai-text">グレード定義</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-mirai-surface">
              <th className="border border-mirai-border px-3 py-2">グレード</th>
              <th className="border border-mirai-border px-3 py-2">スコア</th>
              <th className="border border-mirai-border px-3 py-2 text-left">
                意味
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["A", "80〜100", "成果・透明性ともに高い", "text-grade-a"],
              ["B", "60〜79", "概ね良好、一部課題あり", "text-grade-b"],
              ["C", "40〜59", "複数の懸念点あり、要注目", "text-grade-c"],
              ["D", "0〜39", "成果不明確・悪化傾向、要改善", "text-grade-d"],
            ].map(([grade, range, desc, color]) => (
              <tr key={grade}>
                <td
                  className={`border border-mirai-border px-3 py-2 font-bold text-center ${color}`}
                >
                  {grade}
                </td>
                <td className="border border-mirai-border px-3 py-2 text-center">
                  {range}
                </td>
                <td className="border border-mirai-border px-3 py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr className="border-mirai-border" />

      {/* 監視者フラグ */}
      <section id="flags" className="space-y-6">
        <h2 className="text-lg font-bold text-mirai-text">監視者フラグ一覧</h2>

        {[
          {
            id: "low-target",
            icon: "🎯",
            label: "達成率が過大",
            desc: "達成率が150%超の指標が1つでもある場合に表示。行政が容易に達成できる目標を設定している可能性があります。",
          },
          {
            id: "missing-kpi",
            icon: "📊",
            label: "KPI未設定",
            desc: "成果指標の目標値が「設定なし」となっている場合。目標がなければ達成できたかどうかの判断が難しく、事業効果の検証が困難です。",
          },
          {
            id: "budget-surge",
            icon: "💰",
            label: "予算急増",
            desc: "前年度比で歳出が30%超増加している場合。増加の理由と、それに見合う成果改善があるかを確認することを推奨します。",
          },
          {
            id: "declining",
            icon: "📉",
            label: "実績悪化",
            desc: "主要な成果指標がR5→R6で10%超減少している場合。",
          },
          {
            id: "vague-goal",
            icon: "❓",
            label: "終了基準不明",
            desc: "最終年度が「R年度（未定）」となっている場合。いつまで続けるのか、どうなれば終わるのかが不明確な事業です。",
          },
          {
            id: "no-data",
            icon: "🔒",
            label: "データ未集計",
            desc: "実績値が「集計中」となっている場合。現時点では評価に必要なデータが揃っていません。なお「調査未実施」は定期調査年でないためフラグ対象外です。",
          },
        ].map((flag) => (
          <div key={flag.id} id={flag.id} className="flex gap-3">
            <span className="text-2xl shrink-0">{flag.icon}</span>
            <div>
              <p className="font-bold text-mirai-text">{flag.label}</p>
              <p className="text-sm text-mirai-text-secondary mt-0.5">
                {flag.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      <hr className="border-mirai-border" />

      <div className="text-sm text-mirai-text-secondary">
        <p>
          このページへの意見・フィードバックは GitHub Issues へお寄せください。
        </p>
      </div>
    </div>
  );
}
