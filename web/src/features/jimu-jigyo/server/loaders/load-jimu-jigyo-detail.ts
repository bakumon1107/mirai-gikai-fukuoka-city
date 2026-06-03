import "server-only";
import type { JimuJigyoRecord } from "../../shared/types/jimu-jigyo";
import { type JimuJigyoYear, loadJimuJigyoList } from "./load-jimu-jigyo-list";

export async function loadJimuJigyoDetail(
  year: JimuJigyoYear,
  id: string
): Promise<JimuJigyoRecord | null> {
  const list = await loadJimuJigyoList(year);
  return list.find((r) => r.id === id) ?? null;
}

export async function getAllJimuJigyoIds(
  year: JimuJigyoYear
): Promise<string[]> {
  const list = await loadJimuJigyoList(year);
  return list.map((r) => r.id);
}
