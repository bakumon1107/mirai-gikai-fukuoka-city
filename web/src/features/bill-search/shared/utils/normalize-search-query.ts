// 検索クエリの表記ゆれを吸収するユーティリティ。
// NFKC 正規化で全角英数・半角カナを標準形に揃え、
// ひらがな/カタカナの相互変換で「すとーかー」→「ストーカー」のような
// かな違いのミスマッチを検索側で吸収する。

/** NFKC 正規化 + trim（全角英数→半角、半角カナ→全角カナ等） */
export function normalizeSearchQuery(query: string): string {
  return query.normalize("NFKC").trim();
}

const HIRAGANA_START = 0x3041; // ぁ
const HIRAGANA_END = 0x3096; // ゖ
const KANA_OFFSET = 0x60; // ひらがな→カタカナのコードポイント差

/** ひらがなをカタカナに変換する（それ以外の文字はそのまま） */
export function toKatakana(text: string): string {
  let result = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    result +=
      code >= HIRAGANA_START && code <= HIRAGANA_END
        ? String.fromCodePoint(code + KANA_OFFSET)
        : ch;
  }
  return result;
}

/** カタカナをひらがなに変換する（それ以外の文字はそのまま） */
export function toHiragana(text: string): string {
  let result = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    result +=
      code >= HIRAGANA_START + KANA_OFFSET && code <= HIRAGANA_END + KANA_OFFSET
        ? String.fromCodePoint(code - KANA_OFFSET)
        : ch;
  }
  return result;
}

/**
 * 検索に使うクエリの表記バリエーションを生成する。
 * 正規化した原文・ひらがな化・カタカナ化の重複排除済みリストを返す。
 */
export function buildSearchQueryVariants(query: string): string[] {
  const base = normalizeSearchQuery(query);
  if (base === "") {
    return [];
  }
  return [...new Set([base, toHiragana(base), toKatakana(base)])];
}
