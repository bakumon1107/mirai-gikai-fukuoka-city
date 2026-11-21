/**
 * 発言本文を空行（連続する改行）ごとに区切り、吹き出しの単位に分ける。
 * 長い「わかりやすい表現」を読みやすく複数の吹き出しで表示するために使う。
 * 空行が無い本文は1要素のまま返す。
 */
export function splitBubbleParagraphs(text: string): string[] {
  const paragraphs = text
    .split(/\n[ \t　]*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
  return paragraphs.length > 0 ? paragraphs : [text.trim()];
}
