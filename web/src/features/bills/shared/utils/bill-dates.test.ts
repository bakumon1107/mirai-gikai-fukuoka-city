import { describe, expect, it } from "vitest";
import { resolveDecidedDate, resolveSubmittedDate } from "./bill-dates";

describe("resolveSubmittedDate", () => {
  it("submitted_date があればそれを返す", () => {
    expect(
      resolveSubmittedDate({
        submitted_date: "2026-09-02",
        published_at: "2026-09-04T00:00:00+00:00",
      })
    ).toBe("2026-09-02");
  });

  it("submitted_date が未設定なら published_at にフォールバックする", () => {
    expect(
      resolveSubmittedDate({
        submitted_date: null,
        published_at: "2026-09-04T00:00:00+00:00",
      })
    ).toBe("2026-09-04T00:00:00+00:00");
  });

  it("どちらも無ければ null を返す", () => {
    expect(
      resolveSubmittedDate({ submitted_date: null, published_at: null })
    ).toBeNull();
  });

  it("プロパティ自体が無い場合も null を返す", () => {
    expect(resolveSubmittedDate({})).toBeNull();
  });
});

describe("resolveDecidedDate", () => {
  it("decided_date があればそれを返す", () => {
    expect(resolveDecidedDate({ decided_date: "2026-09-10" })).toBe(
      "2026-09-10"
    );
  });

  it("未議決（null）なら null を返し、published_at にはフォールバックしない", () => {
    expect(
      resolveDecidedDate({
        decided_date: null,
        published_at: "2026-09-04T00:00:00+00:00",
      })
    ).toBeNull();
  });

  it("プロパティ自体が無い場合も null を返す", () => {
    expect(resolveDecidedDate({})).toBeNull();
  });
});
