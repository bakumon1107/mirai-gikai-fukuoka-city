import { describe, expect, it } from "vitest";
import { BILL_STATUS_ORDER } from "@/features/bills/shared/types";
import { resolveStatusFilter, STATUS_FILTER_OPTIONS } from "./status-filter";

describe("resolveStatusFilter", () => {
  it("審議中は衆参両方の審議中ステータスに解決される", () => {
    expect(resolveStatusFilter("deliberating")).toEqual([
      "in_originating_house",
      "in_receiving_house",
    ]);
  });

  it("成立・否決は単一ステータスに解決される", () => {
    expect(resolveStatusFilter("enacted")).toEqual(["enacted"]);
    expect(resolveStatusFilter("rejected")).toEqual(["rejected"]);
  });

  it("未知の値・未指定は null（フィルタなし）を返す", () => {
    expect(resolveStatusFilter("hacked")).toBeNull();
    expect(resolveStatusFilter(undefined)).toBeNull();
    expect(resolveStatusFilter("")).toBeNull();
  });

  it("選択肢のステータスは全て実在する enum 値である", () => {
    const known = Object.keys(BILL_STATUS_ORDER);
    for (const option of Object.values(STATUS_FILTER_OPTIONS)) {
      for (const status of option.statuses) {
        expect(known).toContain(status);
      }
    }
  });

  it("全ステータス enum がいずれかの選択肢でカバーされている", () => {
    const covered = new Set(
      Object.values(STATUS_FILTER_OPTIONS).flatMap((o) => o.statuses)
    );
    for (const status of Object.keys(BILL_STATUS_ORDER)) {
      expect(covered.has(status as keyof typeof BILL_STATUS_ORDER)).toBe(true);
    }
  });
});
