import type { StatementLog } from "../../shared/types";
import { StatementLogList } from "./statement-log-list";

type Props = {
  summary: string;
  updated: string;
  log: StatementLog[];
};

/**
 * 要約 + 最終更新 + 発言ログ。
 * 分野別の言及・争点別比較・高島市政への評価で同じ構造を使う。
 */
export function PositionBody({ summary, updated, log }: Props) {
  return (
    <div>
      <p className="text-[12.5px] leading-[1.9] text-mirai-text-secondary text-pretty">
        {summary}
      </p>
      {updated && (
        <p className="mt-1.5 text-[10px] text-mirai-text-muted">
          この要約の最終更新：{updated}
        </p>
      )}
      <StatementLogList log={log} />
    </div>
  );
}
