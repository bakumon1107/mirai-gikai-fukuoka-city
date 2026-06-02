import "server-only";
import type { JimuJigyoRecord } from "../../shared/types/jimu-jigyo";
import { loadJimuJigyoList } from "./load-jimu-jigyo-list";

export async function loadJimuJigyoDetail(
  id: string
): Promise<JimuJigyoRecord | null> {
  const list = await loadJimuJigyoList();
  return list.find((r) => r.id === id) ?? null;
}

export async function getAllJimuJigyoIds(): Promise<string[]> {
  const list = await loadJimuJigyoList();
  return list.map((r) => r.id);
}
