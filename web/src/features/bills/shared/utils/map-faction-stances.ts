import type { FactionStance, StanceTypeEnum } from "../types";

type RawFactionStance = {
  id: string;
  type: StanceTypeEnum;
  comment: string | null;
  factions: {
    id: string;
    name: string;
    display_name: string;
    sort_order: number;
  } | null;
};

// 会派情報が紐付かないレコードを除外し、表示用の形に整形してソートする。
// 公開ページ（getBillById）と管理者プレビュー（getBillByIdAdmin）で共用する。
export function mapFactionStances(
  factionStancesRaw: RawFactionStance[]
): FactionStance[] {
  return factionStancesRaw
    .filter(
      (
        fs
      ): fs is typeof fs & {
        factions: NonNullable<(typeof fs)["factions"]>;
      } => fs.factions !== null
    )
    .map((fs) => ({
      id: fs.id,
      stance: fs.type,
      comment: fs.comment,
      faction: {
        id: fs.factions.id,
        name: fs.factions.name,
        display_name: fs.factions.display_name,
        sort_order: fs.factions.sort_order,
      },
    }))
    .sort((a, b) => a.faction.sort_order - b.faction.sort_order);
}
