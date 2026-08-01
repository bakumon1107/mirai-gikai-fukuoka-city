import type { CommitteeType } from "../types";

export type CommitteeTypeLabel =
  | "常任委員会"
  | "特別委員会"
  | "予算・決算"
  | "議会運営委員会";

const LABEL_BY_TYPE: Record<CommitteeType, CommitteeTypeLabel> = {
  standing: "常任委員会",
  special: "特別委員会",
  budget: "予算・決算",
  audit: "予算・決算",
  management: "議会運営委員会",
};

/** 一覧ページでのグループ表示順 */
export const COMMITTEE_TYPE_ORDER: CommitteeTypeLabel[] = [
  "常任委員会",
  "特別委員会",
  "予算・決算",
  "議会運営委員会",
];

export function getCommitteeTypeLabel(type: CommitteeType): CommitteeTypeLabel {
  return LABEL_BY_TYPE[type] ?? "常任委員会";
}
