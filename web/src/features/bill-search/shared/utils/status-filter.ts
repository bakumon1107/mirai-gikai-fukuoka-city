import type { BillStatusEnum } from "@/features/bills/shared/types";

/**
 * ステータスフィルタの選択肢。
 * URL パラメータ値 → 表示ラベルと対象ステータス集合のマッピング。
 * 「審議中」は衆参どちらの審議中も含む（表示ラベルが議院に依存するため集約する）。
 */
export const STATUS_FILTER_OPTIONS: Record<
  string,
  { label: string; statuses: BillStatusEnum[] }
> = {
  deliberating: {
    label: "審議中",
    statuses: ["in_originating_house", "in_receiving_house"],
  },
  enacted: { label: "成立", statuses: ["enacted"] },
  rejected: { label: "否決", statuses: ["rejected"] },
  introduced: { label: "提出済み", statuses: ["introduced"] },
  preparing: { label: "準備中", statuses: ["preparing"] },
};

/**
 * URL パラメータのステータスフィルタ値を、DB の status 集合に解決する。
 * 未知の値（改ざんされた URL 等）は null を返し、フィルタなしとして扱う。
 */
export function resolveStatusFilter(
  value: string | undefined
): BillStatusEnum[] | null {
  if (!value) {
    return null;
  }
  return STATUS_FILTER_OPTIONS[value]?.statuses ?? null;
}
