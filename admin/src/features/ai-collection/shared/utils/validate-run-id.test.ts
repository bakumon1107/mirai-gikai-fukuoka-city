import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import { isValidRunId } from "./validate-run-id";

describe("isValidRunId", () => {
  describe("有効なrunId", () => {
    test("crypto.randomUUID() の出力を受け入れる", () => {
      for (let i = 0; i < 20; i++) {
        expect(isValidRunId(randomUUID())).toBe(true);
      }
    });

    test("大文字のUUIDも受け入れる", () => {
      expect(isValidRunId("A1B2C3D4-E5F6-7890-ABCD-EF1234567890")).toBe(true);
    });
  });

  describe("無効なrunId（拒否される）", () => {
    test("パストラバーサル文字列を拒否する", () => {
      expect(isValidRunId("../../etc/passwd")).toBe(false);
      expect(isValidRunId("..%2f..%2fsecret")).toBe(false);
    });

    test("空文字・任意の文字列を拒否する", () => {
      expect(isValidRunId("")).toBe(false);
      expect(isValidRunId("not-a-uuid")).toBe(false);
      expect(isValidRunId("12345")).toBe(false);
    });

    test("UUID形式だが余分な文字を含む場合は拒否する", () => {
      expect(isValidRunId(`${randomUUID()}.json`)).toBe(false);
      expect(isValidRunId(`${randomUUID()}/../x`)).toBe(false);
    });
  });
});
