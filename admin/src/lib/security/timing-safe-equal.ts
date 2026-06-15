import { createHash, timingSafeEqual } from "node:crypto";

/**
 * 2つの文字列を定数時間で比較する。
 * Bearer トークン等のシークレット比較でタイミング攻撃を防ぐために使用する。
 * 入力を SHA-256 でハッシュ化してから比較するため、長さの差異も漏洩しない。
 */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}
