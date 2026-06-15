import { describe, expect, test } from "vitest";
import { timingSafeStringEqual } from "./timing-safe-equal";

describe("timingSafeStringEqual", () => {
  test("同一の文字列はtrueを返す", () => {
    expect(timingSafeStringEqual("secret-token", "secret-token")).toBe(true);
    expect(timingSafeStringEqual("", "")).toBe(true);
  });

  test("異なる文字列はfalseを返す", () => {
    expect(timingSafeStringEqual("secret-token", "wrong-token")).toBe(false);
    expect(timingSafeStringEqual("secret", "secret ")).toBe(false);
  });

  test("長さが異なってもfalseを返す（例外を投げない）", () => {
    expect(timingSafeStringEqual("a", "abcdefghij")).toBe(false);
    expect(timingSafeStringEqual("abcdefghij", "a")).toBe(false);
  });

  test("1文字違いでもfalseを返す", () => {
    expect(timingSafeStringEqual("Bearer abc123", "Bearer abc124")).toBe(false);
  });
});
