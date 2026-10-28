import { describe, expect, it } from "vitest";
import { withVideoTimestamp } from "./video-timestamp";

const URL = "https://www.youtube.com/watch?v=So0lx5D8Q8k";

describe("withVideoTimestamp", () => {
  it("時:分:秒を秒数にして t= を付ける", () => {
    expect(withVideoTimestamp(URL, "01:23:45")).toBe(`${URL}&t=5025s`);
  });

  it("1時間未満も同じ書式で扱う", () => {
    expect(withVideoTimestamp(URL, "00:29:31")).toBe(`${URL}&t=1771s`);
  });

  it("クエリのないURLには ? で付ける", () => {
    expect(
      withVideoTimestamp("https://www.youtube.com/live/abc", "00:00:10")
    ).toBe("https://www.youtube.com/live/abc?t=10s");
  });

  it("書式が崩れていたら元のURLを返す", () => {
    expect(withVideoTimestamp(URL, "1:2:3")).toBe(URL);
    expect(withVideoTimestamp(URL, "00:61:00")).toBe(URL);
    expect(withVideoTimestamp(URL, "")).toBe(URL);
  });
});
