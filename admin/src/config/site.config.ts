/**
 * サイト設定ファイル（Admin）
 *
 * Fork して別の地方議会向けに使用する場合はこのファイルを変更してください。
 * web 側の `web/src/config/site.config.ts` と値を揃える必要があります。
 *
 * @see FORK_GUIDELINES.md
 * @see docs/20260304_1000_別地域向けfork手順.md
 */
export const siteConfig = {
  /** 「みらい議会」の名称を使う場合は「みらい議会＠地域名」形式にすること */
  siteName: "みらい議会＠神戸市",
  /** 自治体名（例: "サンプル市" / "サンプル県" / "サンプル町"） */
  cityName: "神戸市",
  /**
   * 議会名（例: "サンプル市議会" / "サンプル県議会"）
   * NOTE: 神戸市の議会は「市議会」ではなく「神戸市会」が正式名称。
   */
  councilName: "神戸市会",
  /** 住民の呼称（例: "市民" / "県民" / "区民" / "町民"）。AIプロンプトから参照する */
  residentTerm: "市民",
  councilBaseUrl: "https://www.city.kobe.lg.jp/shise/municipal/index.html",
  councilBillsDetailUrl:
    "https://www.city.kobe.lg.jp/z/shikaijimukyoku/giann_etc/kekka.html",
  /**
   * 会派名の例。AI情報収集のプロンプトで、会派名の表記ゆれを吸収するために使う。
   * fork 先の議会で実際に使われている会派名を列挙すること。
   */
  councilFactionExamples:
    "自由民主党、公明党、日本維新の会、日本共産党、こうべ未来、躍動の会、つなぐ、新しい自民党等",
} as const;
