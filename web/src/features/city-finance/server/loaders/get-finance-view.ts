import "server-only";
import financeJson from "../../data/fukuoka-finance.json";
import type { FinanceData } from "../../shared/types";
import {
  type CityFinanceView,
  buildFinanceView,
} from "../../shared/utils/finance-view";

/**
 * 同梱済みの福岡市財政データ（福岡市オープンデータCKAN由来）を読み込み、
 * 画面表示用ビューモデルに変換して返す。
 * データ更新は scripts/fetch-fukuoka-finance.ts を実行して JSON を再生成する。
 */
export function getFinanceView(): CityFinanceView {
  return buildFinanceView(financeJson as FinanceData);
}
