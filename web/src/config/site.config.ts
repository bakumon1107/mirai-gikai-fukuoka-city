/**
 * サイト設定ファイル
 *
 * 地域固有の情報はこのファイルに集約されています。
 * Fork して別の地方議会向けに使用する場合は、まずこのファイルを変更してください。
 *
 * ★ が付いた項目は fork 時に必ず変更が必要です（AGPL-3.0 第7条に基づく追加条件）。
 *
 * @see FORK_GUIDELINES.md 本家リポジトリの fork ガイドライン
 * @see docs/20260304_1000_別地域向けfork手順.md 具体的な手順
 */
export const siteConfig = {
  /**
   * ★ サイト名
   * 「みらい議会」の名称を使う場合は「みらい議会＠地域名」形式にすること。
   * （例: "みらい議会＠渋谷区" / "みらい議会＠福岡市"）
   * 独自のサービス名を使う場合はこの形式に限りません。
   * @see FORK_GUIDELINES.md 1. サービス名称
   */
  siteName: "みらい議会＠サンプル市",
  siteDescription:
    "サンプル市議会で今どんな議案が検討されているか、わかりやすく伝えるプラットフォームです",
  /** 自治体名（例: "サンプル市" / "サンプル県" / "サンプル町"） */
  cityName: "サンプル市",
  /** 議会名（例: "サンプル市議会" / "サンプル県議会"） */
  councilName: "サンプル市議会",
  /**
   * 住民の呼称（例: "市民" / "県民" / "区民" / "町民"）
   * UI テキストや AI プロンプトから参照します。
   */
  residentTerm: "市民",
  keywords: [
    "みらい議会＠サンプル市",
    "議案",
    "サンプル市",
    "市議会",
    "地方政治",
    "政策",
    "解説",
  ],
  councilBaseUrl: "https://www.example.lg.jp/",
  /** 議案・議決結果の一覧ページ */
  councilBillsDetailUrl: "https://www.example.lg.jp/gikai/giketsu/",
  twitterHashtag: "みらい議会サンプル市", // # なし
  /**
   * ★ このサイト自身のソースコード公開先リポジトリ URL
   *
   * AGPL-3.0 第13条により、ネットワーク経由でサービスを提供する場合は
   * 利用者が「実際に稼働しているバージョン」のソースコードを入手できる手段を
   * 提供する必要があります。本家（team-mirai/mirai-gikai）の URL では代用できません。
   * 誰でもアクセスできる公開リポジトリを指定してください。
   *
   * フッターにリンクとして表示されます（空文字列にすると表示されず AGPL 違反になります）。
   * @see FORK_GUIDELINES.md 6. ソースコード公開先へのリンクの表示
   */
  sourceCodeUrl: "https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY" as string,
  externalLinks: {
    /** ★ 誤り報告フォーム（本家のフォームを流用せず、自前のものを用意すること） */
    report: "",
    /** サービス説明記事（note 等）。空文字列なら関連リンクを表示しない */
    aboutNote: "",
    /**
     * 以下 4 つは `features.showTeamMiraiSection` が true のときだけ使用されます。
     * 非公式運営（false）の場合は参照されません。
     */
    donation: "https://team-mir.ai/support/donation",
    teamAbout: "https://team-mir.ai/about",
    terms: "https://team-mir.ai/terms",
    privacy: "https://team-mir.ai/privacy",
    /** ★ よくある質問の外部ページ（本家の Notion を流用しないこと。空なら /faq を使用） */
    faq: "",
  },
  /**
   * ページを管理する政党名（空文字列の場合は政党名を省略した汎用表現を使用）
   * 政党が運営主体でない場合は空文字列のままにしてください。
   * 例: "チームみらい"
   */
  managingParty: "" as string,
  /**
   * ★ サービス運営者情報
   * 利用規約・プライバシーポリシー・問い合わせ先・運営者の立場開示に使用します。
   */
  operator: {
    /** 運営者名（個人名・団体名） */
    name: "運営者名" as string,
    /** 問い合わせ先 URL（SNS アカウント・フォーム等） */
    contactUrl: "https://example.com/contact" as string,
    /** 利用規約の準拠法・管轄裁判所（第一審の専属的合意管轄） */
    jurisdiction: "東京地方裁判所" as string,
    /**
     * 運営者の立場・利益相反の開示文。
     * 空文字列なら表示しません。
     *
     * 議員・会派・後援会・候補者など政治的な立場を持つ場合は、
     * 利用者が判断できるようここで明示してください。
     * 例: "運営者はサンプル市議会議員（◯◯会派）です。"
     *     "運営者は特定の政党・会派・候補者と関係のない個人です。"
     */
    disclosure: "" as string,
  },
  /**
   * AI機能の有効/無効設定
   * 本番環境のコスト管理のため、機能ごとにオン/オフを切り替えられます。
   */
  features: {
    /** AIチャット機能（議案への質問・テキスト選択からの質問）*/
    aiChat: true,
    /**
     * AIインタビュー機能（議案当事者へのヒアリング）
     *
     * 住民の意見と連絡先を収集する機能です。個人情報の取り扱い方針と
     * 運営体制を定めてから有効化してください（既定は無効）。
     */
    aiInterview: false,
    /**
     * チームみらいセクションの表示（トップページ・フッター・デスクトップメニュー）
     *
     * 党の公式サービスとして運営する場合のみ true にしてください。
     * false のとき、党のロゴ・寄附リンク・党紹介セクションは表示されず、
     * 代わりに「政党チームみらいが運営しているものではありません」の
     * 免責文言がフッターに表示されます。
     * @see FORK_GUIDELINES.md 5. 免責文言の表示
     */
    showTeamMiraiSection: false as boolean,
  },
} as const;
