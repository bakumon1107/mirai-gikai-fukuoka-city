import type { Candidate } from "../types";

const WATANABE_KAIKEN_SOURCE = "本人YouTube（出馬表明記者会見）";
/**
 * 2026年8月26日の出馬表明記者会見（本人チャンネルのほぼノーカット動画・42分）。
 *
 * 音声は YouTube の自動字幕から起こしており固有名詞の誤認識が多かったため、
 * 「公民館148館」「ネクスペイ（福岡市プレミアム付電子商品券）」のように
 * 福岡市の公式情報で裏取りできたものだけを記載している。
 * 裏取りできなかった固有名詞（公園名・地名）と金額は意図的に落としている。
 */
const WATANABE_KAIKEN_URL = "https://www.youtube.com/watch?v=9hp1iUmZJic";
/**
 * 本人Instagramの投稿。ログインなしでは本文が読めないため、
 * 取得は外部の読み取りサービス（r.jina.ai）を経由した。本文はそのまま引用している。
 */
const WATANABE_IG_SOURCE = "本人Instagram（@watanabehisaya.fukuoka）";
const WATANABE_IG_HAYAKAKEN = "https://www.instagram.com/p/DdBVToPyugw/";
const WATANABE_IG_AI = "https://www.instagram.com/p/DdHAGrtBygD/";
const WATANABE_IG_GAIKOKUJIN = "https://www.instagram.com/p/DdHCPiqp7yQ/";
const WATANABE_IG_RENKEI = "https://www.instagram.com/p/DdJp37gBvy3/";
const WATANABE_YT_SOURCE = "本人YouTube（渡辺久也チャンネル）";
/**
 * 2026年9月25日公開の「外国人問題について」（約16分）。聞き手との対談形式。
 *
 * 自動字幕では副首都が「福構想」「福祉と」、不法残留者が「付法残者」と認識されていた。
 * 聞き手の質問と本人の答えを混ぜないこと。
 */
const WATANABE_YT_GAIKOKUJIN_URL =
  "https://www.youtube.com/watch?v=CxHsVOmUV8s";
const GO2SENKYO_NISHIWAKI = "https://go2senkyo.com/seijika/200151";
const NISHIWAKI_PROFILE_SOURCE = "選挙ドットコム 政治家データベース";
const NISHIWAKI_X_SOURCE = "本人X（@nishiwaki_hk）";
/**
 * 「これから詳細をアップしようと考えているリストです」として25項目を列挙した投稿。
 * 確定した公約ではなく検討中の項目リストなので、要約は「挙げている」で統一し、
 * 立場も「推進」ではなく「表明済み」に留めている。
 */
const NISHIWAKI_X_LIST =
  "https://x.com/nishiwaki_hk/status/2092747468555571648";
const NISHIWAKI_BLOG_SOURCE = "選挙ドットコム 本人ブログ";
/**
 * 2026年8月27〜28日に公開された政策ブログ5本。
 * X の検討中リストと違い、財源や試算まで示された記事なので、
 * 要約では数字の前提（税率・モデルケース・未確定である旨）を落とさないこと。
 */
const NISHIWAKI_BLOG = {
  bosai: "https://go2senkyo.com/seijika/200151/posts/1481975",
  gaikokujin: "https://go2senkyo.com/seijika/200151/posts/1482022",
  genzei: "https://go2senkyo.com/seijika/200151/posts/1482620",
  hoikuryo: "https://go2senkyo.com/seijika/200151/posts/1482739",
  // 以下は2026年10月の巡回で見つけた記事。選挙ドットコムの記事ページに出る日付は
  // 更新日のため、ログでは「○月○日時点の記事」として扱う。
  matcho: "https://go2senkyo.com/seijika/200151/posts/1483266",
  qa: "https://go2senkyo.com/seijika/200151/posts/1493444",
  jutai: "https://go2senkyo.com/seijika/200151/posts/1496273",
  saisenkyo: "https://go2senkyo.com/seijika/200151/posts/1519668",
} as const;
/**
 * 市長報酬1,000万円削減の取り下げを表明したX投稿（2026年9月）。
 *
 * 当初は8月28日のブログで公約として掲げていたが、本人がXで取り下げを表明。
 * 当該ブログ（posts/1482320）は現在「市長を目指す理由」に差し替わっており、
 * 元の記事は残っていない。公約としては要約から外し、経緯だけをログに残している。
 */
const NISHIWAKI_X_HOSHU_WITHDRAW =
  "https://x.com/nishiwaki_hk/status/2093965881516998833";
/**
 * 2026年9月1日公開の「政策概要」。7つの約束と3つの重点政策をまとめた本命の資料で、
 * 各分野の要約はこれを主に据える（8月のX投稿や個別ブログより優先）。
 *
 * 8月時点の重点政策（住民税5％減税・保育料ゼロ・市長報酬1,000万円削減）のうち
 * 市長報酬は本人がXで取り下げを表明したため要約から削除した（経緯はログに残す）。
 * 住民税5％減税はこの概要の重点3つから外れているが、個別ブログが残っており
 * 撤回も明示されていないため「取り下げた」とは書かない。要約は新しい枠組みを
 * 主にしつつ従来の記述も残し、変遷は発言ログで追えるようにしている。
 */
const NISHIWAKI_POLICY_URL =
  "https://go2senkyo.com/seijika/200151/posts/1487061";
const ARAMAKI_SITE_URL = "https://www.lgbt-connect.com/";
const ARAMAKI_SITE_SOURCE = "本人サイト（OVER THE RAINBOW）・本人Instagram";
// 本人サイトには市長選出馬の記載がないため、出馬表明・公約は陣営の公表資料が出典。
// TODO: 党公式・本人SNSで出馬表明のURLが確認でき次第、log の url に追加する
const ARAMAKI_SOURCE = "陣営の公表プロフィール（2026年8月）";
const ARAMAKI_KAIKEN_SOURCE = "報道（KBC九州朝日放送・TNCテレビ西日本・NHK）";
/**
 * 2026年9月3日に福岡市役所で開いた出馬表明の記者会見。
 * 年齢（41歳）はKBC・TNCの両方が報じており、本人サイトの「1985年生まれ」と整合する。
 */
const ARAMAKI_KBC_URL =
  "https://kbc.co.jp/news/article.php?id=18090277&ymd=2026-09-03";
const ARAMAKI_TNC_URL =
  "https://news.yahoo.co.jp/articles/89321e480341ad0122af11a2f0484feae443bc83";
const ARAMAKI_KAIKEN_MOVIE_SOURCE =
  "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月11日公開の出馬表明会見ノーカット動画（37分）。
 *
 * 自動字幕の誤認識が多く、本人名も「荒巻明」「荒木明」と認識されていた。
 * 「法航空法」→「航空法」は、天神ビッグバンが国家戦略特区で取得した
 * 航空法の高さ制限の特例から始まった経緯を指しており、福岡市公式で確認した。
 * https://www.city.fukuoka.lg.jp/jutaku-toshi/kaihatsu/shisei/tbb_p3.html
 */
const ARAMAKI_KAIKEN_MOVIE_URL = "https://www.youtube.com/watch?v=fp7o-aE_eAM";
/** こころ党のサイト内にある選挙用の公式サイト（7つの重点政策・マニフェストへのリンク） */
const ARAMAKI_CAMPAIGN_SOURCE = "本人サイト（あらまき明楽 公式サイト）";
const ARAMAKI_CAMPAIGN_URL = "https://kokoro-party.com/aramakiakira/";
/**
 * 「福岡市を、世界の教育首都に」と題したマニフェスト（ver1.0・全49ページ）。
 *
 * 「2026年9月3日時点の内容」と明記されている。Google Driveで公開されているが
 * ダウンロードが無効になっているため、ビューアで表示して読み取った。
 * 改訂版が出たら、版と日付を確かめて差し替えること。
 */
const ARAMAKI_MANIFESTO_SOURCE = "本人サイト（福岡市マニフェスト ver1.0）";
const ARAMAKI_MANIFESTO_URL =
  "https://drive.google.com/file/d/1qAFYJUo8zxXpj8Xw7UwwYTlFzI0jMKK9/view";
const NIIMURA_SITE_URL = "https://niimuramasaru.com/";
const NIIMURA_SITE_SOURCE = "本人サイト（新村まさるオフィシャルHP）";
const NIIMURA_KBC_SOURCE = "報道（KBC九州朝日放送）";
const NIIMURA_KBC_URL =
  "https://news.yahoo.co.jp/articles/a2fce24f5842e38498ca3aa70072e52930d70ddf";
const NIIMURA_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月11日公開の出馬表明会見ノーカット動画（51分）。
 *
 * 本人が「政策云々ではありません」と述べており決意表明が中心の会見で、
 * 政策の詳細は改めて記者会見を開くとしている。要約もその前提で書くこと。
 * 自動字幕の誤認識が多く、本人名も「新村正」と認識されていた。
 */
const NIIMURA_KAIKEN_URL = "https://www.youtube.com/watch?v=UsNnsCO8E7I";
/**
 * 2026年10月に公開された政策集「ANSWER100」の専用サイト。
 *
 * 「8つの約束」ごとにページが分かれ、その下に番号つきの個別政策が並ぶ。
 * サイトは100項目としているが番号は104まで振られており、重複もあるため、
 * 項目数は数えずに「8つの約束」と個別政策の内容だけを引くこと。
 */
const NIIMURA_ANSWER_SOURCE = "本人サイト（政策集 ANSWER100）";
const NIIMURA_ANSWER_URL = "https://www.fukuoka-answer100.com/";
const NIIMURA_ANSWER_KODOMO_URL =
  "https://www.fukuoka-answer100.com/promise/kodomo";
const NIIMURA_ANSWER_YASASHISA_URL =
  "https://www.fukuoka-answer100.com/promise/yasashisa";
const NIIMURA_ANSWER_GENKI_URL =
  "https://www.fukuoka-answer100.com/promise/genki";
const NIIMURA_ANSWER_MACHI_URL =
  "https://www.fukuoka-answer100.com/promise/machidukuri";
const NIIMURA_ANSWER_HATTEN_URL =
  "https://www.fukuoka-answer100.com/promise/hatten";
const NIIMURA_ANSWER_BOUSAI_URL =
  "https://www.fukuoka-answer100.com/promise/bousai";
const NIIMURA_ANSWER_GYOSEI_URL =
  "https://www.fukuoka-answer100.com/promise/gyosei";
const NIIMURA_ANSWER_KENIN_URL =
  "https://www.fukuoka-answer100.com/promise/kenin";
const SHIRABE_SITE_URL = "https://www.t-shirabe.net/";
const SHIRABE_SITE_SOURCE = "本人サイト（調崇史 公式サイト）";
const SHIRABE_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月11日の出馬表明記者会見（ノーカット動画・1時間38分）。
 *
 * 音声は YouTube の自動字幕から起こしており、固有名詞の誤認識が特に多かった
 * （本人名すら「白部孝志」と認識されていた）。福岡市の文脈で確認できたもの
 * だけを記載し、「FUKUOKA GROWTH NEXT」「博多コネクティッド」「地下鉄七隈線」
 * 「西鉄貝塚線」「玄界島・小呂島」などは公式の表記に合わせている。
 * 特定できなかった固有名詞と、本人が「明確な推計がない」と断った金額、
 * 聞き取れなかった年数・人口は意図的に落としている。
 */
const SHIRABE_KAIKEN_URL = "https://www.youtube.com/watch?v=JpvgScoHQEY";
const SHIRABE_FBS_SOURCE = "報道（FBS福岡放送）";
const SHIRABE_FBS_URL =
  "https://news.yahoo.co.jp/articles/eb3a1d426575a201a8697cb42ab93b64426a39df";
/** 県政への決議を起案した経緯を本人が説明したブログ */
const SHIRABE_BLOG_KENSEI = "https://www.t-shirabe.net/blog/4766/";
/**
 * 市議としての「活動目標」ページ。市長選の公約ではないため、
 * 要約には使わず発言ログにのみ載せ、市議時代のものであることを明記する。
 */
const SHIRABE_SHIGI_POLICY = "https://www.t-shirabe.net/policy/";
/**
 * 2026年10月に公開された政策集（全8ページ・PDF）。発行は「豊かな福岡をつくる会」。
 * ビジョン4項目と、8分野の個別政策（各10項目前後）で構成されている。
 */
const SHIRABE_POLICY_SOURCE = "本人サイト（政策集）";
const SHIRABE_POLICY_BOOK_URL = "https://t-shirabe.net/vision";
/**
 * 本人YouTube（調たかしチャンネル）の政策解説シリーズ。日付は本人サイトの動画一覧の表記。
 * 字幕は自動生成で誤変換が多いため、聞き取りが確かな箇所だけを引く。
 */
const SHIRABE_YT_SOURCE = "本人YouTube（調たかしチャンネル）";
const SHIRABE_YT_FUKUSHUTO_URL = "https://www.youtube.com/watch?v=gS_ZbYENeCQ";
const SHIRABE_YT_TOSHIN_URL = "https://www.youtube.com/watch?v=VxuhTTDhHCc";
/**
 * 新村氏・調氏・阿部氏の市議辞職（9月16日）を伝えた報道（読売新聞オンライン、2026年9月17日）。
 * 経歴の出典（bioSource）は媒体名だけを載せる欄なので、URLはここに記録として残す:
 * https://news.yahoo.co.jp/articles/240c6e9e4de585a8b24998be1bbe3914c5d24452
 */
const SHIGI_JISHOKU_SOURCE = "報道（読売新聞オンライン）";
const INOUE_SITE_URL = "https://genzeinippon.com/member/inouekiyoshi/";
const INOUE_SITE_SOURCE = "減税日本 公式サイト（候補予定者紹介）";
const INOUE_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月14日の出馬表明記者会見（ノーカット動画・1時間5分）。
 *
 * 減税日本の河村たかし代表が同席して長く発言しており（名古屋弁の部分）、
 * 名古屋市の広沢一郎市長もオンラインで参加している。本人が自分の口で
 * 述べていない内容は、同席者の発言を本人が受けたものでも載せないこと。
 * 自動字幕では本人名が「井上清」、党名が「現日本」と認識されていた。
 */
const INOUE_KAIKEN_URL = "https://www.youtube.com/watch?v=NsLSWGWYD9o";
const INOUE_YOMIURI_SOURCE = "報道（読売新聞オンライン）";
const INOUE_YOMIURI_URL =
  "https://www.yomiuri.co.jp/local/kyushu/news/20260915-GYS1T00071/";
const ABE_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月17日の出馬表明記者会見（ノーカット動画・30分）。
 *
 * 本人が政策の詳細は改めて会見を開くとしており、決意表明が中心。
 * 自動字幕では本人名が「安倍秀」、修猷館高校が「集有高校」、
 * 新生児マススクリーニングが「新政治マススクリーニング」と認識されていた。
 */
const ABE_KAIKEN_URL = "https://www.youtube.com/watch?v=ASSBk2hogzo";
const ABE_SEISAKU_KAIKEN_SOURCE = "本人YouTube（政策記者会見）";
/**
 * 2026年10月15日の政策記者会見（1時間9分）。フリップ1枚で4つの柱の具体策を説明した。
 *
 * 自動字幕では天神ビッグバンが「天人ビッグバン」、半導体が「反動体」、
 * 第1子が「大子」「第の」、特定健診が「献診」と認識されていた。
 * 後半は経歴や人柄についての質疑で、政策の発言ではない部分が多い。
 */
const ABE_SEISAKU_KAIKEN_URL = "https://www.youtube.com/watch?v=bnuz_egEQjo";
const ABE_YOMIURI_SOURCE = "報道（読売新聞オンライン）";
/**
 * 2026年9月22日に本人Xで公開した政策ビジョン（4つの柱）。
 * 投稿時点では具体策と財源を今後紹介するとしていた。柱ごとの具体策は
 * 10月15日の政策記者会見（ABE_SEISAKU_KAIKEN_URL）で示されている。
 * Xはログインなしで読めないため、取得は公開APIのミラー（fxtwitter）を経由した。
 */
const ABE_X_SOURCE = "本人X（@FbD3ATtLBOcH2rx）";
const JINNO_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月24日の出馬表明記者会見（ノーカット動画・47分）。
 *
 * 自動字幕では本人名が「人の元気」、勤務先が「透明官」、校則が「高速」と
 * 認識されていた。東明館中学校・高等学校（佐賀県基山町）、株式会社COMPASS、
 * AI型教材「Qubena」、GIGAスクール構想などは本人や学校の公表情報に表記を合わせている。
 * 実証事業の中学校名は字幕から特定できなかったため落とした。
 */
const JINNO_KAIKEN_URL = "https://www.youtube.com/watch?v=FvN4mflNqEE";
/** 2026年10月に開設された選挙用の公式サイト */
const JINNO_SITE_SOURCE = "本人サイト（神野げんき 公式サイト）";
const JINNO_SITE_URL = "https://genkijinno.com/";
/**
 * 公式サイトの政策ページと政策ダイジェスト（PDF全8ページ）。
 *
 * 「4つの力」（学ぶ・支え合う・挑む・決める）と、#1〜#15の「政策の中身」で
 * 構成されている。政策発表の記者会見は10月16日だが、PDFの作成日は10月18日で
 * 公開日を特定できないため、発言ログの日付は「2026-10」にとどめている。
 */
const JINNO_POLICY_SOURCE = "本人サイト（政策ダイジェスト）";
const JINNO_POLICY_URL = "https://genkijinno.com/policy/";
const JINNO_POLICY_PDF_URL =
  "https://genkijinno.com/policy/genkijinno-policy-digest.pdf";
const JINNO_SEISAKU_KAIKEN_SOURCE = "本人YouTube（政策発表記者会見）";
/**
 * 2026年10月16日の政策発表記者会見のアーカイブ（57分）。
 *
 * 冒頭で後援会事務局長が長く挨拶しているため、本人の発言と混ぜないこと。
 * 自動字幕では本人名が「人の元気」「ジ野」、東明館が「透明官」、
 * 校則が「高速」「梗速」、Qubenaが「キュビナ」「キ備な」と認識されていた。
 * 実証事業に参加した中学校名は字幕から特定できなかったため落とした。
 */
const JINNO_SEISAKU_KAIKEN_URL = "https://www.youtube.com/live/XXGoNNHLzVg";
const JINNO_SCHOOL_SOURCE =
  "東明館中学校・高等学校 公式サイト（理事長・校長挨拶）";
const JINNO_SCHOOL_URL = "https://inner.tomeikan.ed.jp/about-school/about/";
const JINNO_RKB_SOURCE = "報道（RKB毎日放送）";
const JINNO_RKB_URL =
  "https://news.yahoo.co.jp/articles/778db54ac9f2ed730b60629b83d2b18f053b8c09";
const JINNO_NIKKEI_SOURCE = "報道（日本経済新聞）";
const JINNO_NIKKEI_URL =
  "https://www.nikkei.com/article/DGXZQOJC249380U6A920C2000000/";
const ABE_X_POLICY_URL =
  "https://x.com/FbD3ATtLBOcH2rx/status/2102216431354130887";
/** 4つの柱を1本ずつ掘り下げる連載。動画つきで投稿されている */
const ABE_X_KASEGU_URL =
  "https://x.com/FbD3ATtLBOcH2rx/status/2105255497771422082";
const ABE_X_MAMORU_URL =
  "https://x.com/FbD3ATtLBOcH2rx/status/2106361003781087258";
/**
 * 本人サイトの政策ページ。「2つの政治姿勢」「高島市政4期16年の振りかえり」と
 * 9つの政策が分野ごとのページに分かれており、数字には出典が添えられている。
 * 数字はいずれも本人サイトの記載として引用しており、こちらでは検証していない。
 */
const KATAYAMA_SITE_SOURCE = "本人サイト（片山すみこ 公式サイト）";
const KATAYAMA_SITE_URL = "https://katayamasumiko.com/";
const KATAYAMA_POLICY_URL = "https://katayamasumiko.com/policy/";
const KATAYAMA_PROFILE_URL = "https://katayamasumiko.com/profile/";
/**
 * 2026年10月に公式サイトで公開された政策集（全20ページ・PDF）。
 * 「2つの政治姿勢」「高島市政4期16年の振りかえり」「9つの政策」で構成され、
 * サイトの各政策ページと同じ内容を冊子にまとめたもの。図表が添えられている。
 * 数字はいずれも政策集の記載として引用しており、こちらでは検証していない。
 */
const KATAYAMA_POLICY_BOOK_SOURCE = "本人サイト（政策集）";
const KATAYAMA_POLICY_BOOK_URL =
  "https://katayamasumiko.com/wp-content/uploads/2026/10/%E3%80%90%E3%83%88%E3%83%B3%E3%83%9C%E7%84%A1%E3%80%91%E7%89%87%E5%B1%B1%E3%81%99%E3%81%BF%E3%81%93%E5%B8%82%E9%95%B7%E9%81%B8%E6%94%BF%E7%AD%96%E9%9B%86-1.pdf";
const KATAYAMA_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月26日の出馬表明記者会見（ノーカット動画・51分）。
 * 自動字幕では本人名が「片山住子」、河合塾が「川塾」と認識されていた。
 * 固有名詞と数字は本人サイトの政策ページの表記に合わせている。
 */
const KATAYAMA_KAIKEN_URL = "https://www.youtube.com/watch?v=DdSuAzQpPew";
const YOSHITOMI_SITE_SOURCE = "本人サイト（よしとみ景子 公式サイト）";
const YOSHITOMI_SITE_URL = "https://yoshitomikeiko.jp/";
const YOSHITOMI_POLICY_URL = "https://yoshitomikeiko.jp/policy";
const YOSHITOMI_PROFILE_URL = "https://yoshitomikeiko.jp/profile";
const YOSHITOMI_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月29日の出馬表明記者会見（ノーカット動画・1時間）。
 *
 * 参政党の神谷宗幣代表と木下議員が同席し、政策協定の締結と推薦状の授与を行って
 * それぞれ長く発言している。本人が自分の口で述べていない内容は載せないこと。
 * 自動字幕では本人名が「吉稽古子」、参政党が「賛成党」と認識されていた。
 */
const YOSHITOMI_KAIKEN_URL = "https://www.youtube.com/watch?v=AyOqZkYNQZw";
const YOSHITOMI_KBC_SOURCE = "報道（KBC九州朝日放送）";
const YOSHITOMI_KBC_URL = "https://kbc.co.jp/news/article.php?id=18232497";
const KATAYAMA_YOMIURI_SOURCE = "報道（読売新聞オンライン）";
const KATAYAMA_YOMIURI_URL =
  "https://www.yomiuri.co.jp/local/kyushu/news/20260927-GYS1T00036/";
const ABE_YOMIURI_URL =
  "https://www.yomiuri.co.jp/local/kyushu/news/20260918-GYS1T00075/";
const NAGASAWA_SITE_URL = "https://kantanagasawa.com/";
const NAGASAWA_SITE_SOURCE = "本人サイト（ながさわかんた後援会）";
const NAGASAWA_REVIEW_URL = "https://kantanagasawa.com/review.html";
/** 2026年10月までに追加された政策ごとの詳細ページ */
const NAGASAWA_KAZENOTANI_URL = "https://kantanagasawa.com/kazenotani.html";
const NAGASAWA_AI_URL = "https://kantanagasawa.com/ai.html";
const NAGASAWA_KANSHO_URL = "https://kantanagasawa.com/kansho.html";
const NAGASAWA_ISSUES_URL = "https://kantanagasawa.com/issues.html";
/**
 * 市政運営方針一覧（15分野の立場）。2026年10月7日時点で公開され、
 * 10月10日に「賛成？反対？ よく聞かれる15の問い」が追加された（10月14日更新）。
 * 15の問いは5段階で答え、理由を1問97字以内で書く形式。
 */
const NAGASAWA_HOUSHIN_URL = "https://kantanagasawa.com/houshin.html";
const NAGASAWA_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月17日の出馬表明記者会見（ノーカット動画・1時間5分）。
 *
 * 本人サイトに会見での回答の要約が載っているため、字幕の判読が難しい箇所は
 * そちらと突き合わせた。活動拠点の里山は字幕では地名が崩れていたが、
 * 本人サイトの記載（久山町）に合わせている。
 */
const NAGASAWA_KAIKEN_URL = "https://www.youtube.com/watch?v=prv5Z4JZ6c8";
const SASAKI_PROFILE_URL = "https://catalystkyushu.org/about";
const SASAKI_PROFILE_SOURCE = "一般社団法人カタリスト九州 公式サイト";
/** 2026年9月に公開された選挙用の公式サイト。SNSもこちらの掲載に合わせている */
const SASAKI_SITE_URL = "https://sasaki-ayano.jp/";
const SASAKI_SITE_SOURCE = "本人サイト（佐々木あやの公式ウェブサイト）";
const SASAKI_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月18日の出馬表明記者会見（ノーカット動画・49分）。
 *
 * 決意表明が中心の会見で、基本政策は10月20日の政策発表会見と政策集で示された。
 * 自動字幕では本人名が「佐々木綾野」、警固断層が「警語断層」と認識されていた。
 */
const SASAKI_KAIKEN_URL = "https://www.youtube.com/watch?v=NlW9KIjNwD8";
const SASAKI_MOVIE_SOURCE = "本人YouTube（出馬表明の動画）";
const SASAKI_MOVIE_URL = "https://www.youtube.com/watch?v=mReL3z176RI";
/**
 * 2026年10月20日の政策発表記者会見に合わせて公開された政策集（サイトマップの更新日も10月20日）。
 *
 * 「8つの分野」ごとにページが分かれ、各分野に番号つきの施策と、
 * 「現状：何が課題か？」として出典つきの数字が添えられている。
 * 数字はいずれも政策集の記載として引用しており、こちらでは検証していない。
 * 会見のアーカイブには字幕が付いていないため、内容は政策集から引く。
 */
const SASAKI_POLICY_SOURCE = "本人サイト（政策集・8つの分野）";
const SASAKI_POLICY_URL = "https://sasaki-ayano.jp/policy/";
/** 10月下旬に追加された政策集のPDF版（76ページ・8つの分野を1冊にまとめたもの） */
const SASAKI_POLICY_PDF_URL =
  "https://sasaki-ayano.jp/assets/pdf/sasaki-ayano-policy.pdf";
const SASAKI_POLICY_ECONOMY_URL = "https://sasaki-ayano.jp/policy/economy/";
const SASAKI_POLICY_CARE_URL = "https://sasaki-ayano.jp/policy/health-care/";
const SASAKI_POLICY_BOSAI_URL =
  "https://sasaki-ayano.jp/policy/disaster-resilience/";
const SASAKI_POLICY_LIVING_URL = "https://sasaki-ayano.jp/policy/living/";
const SASAKI_POLICY_COMMUNITY_URL = "https://sasaki-ayano.jp/policy/community/";
const SASAKI_POLICY_CHILDREN_URL = "https://sasaki-ayano.jp/policy/children/";
const SASAKI_POLICY_YOUTH_URL = "https://sasaki-ayano.jp/policy/youth/";
const SASAKI_POLICY_EQUALITY_URL = "https://sasaki-ayano.jp/policy/equality/";
/**
 * 2026年10月20日の政策発表記者会見のアーカイブ（2時間7分）。
 * 10月28日時点で自動生成の字幕が付いた。誤変換が多いため、聞き取りが確かな箇所だけを引く。
 */
const SASAKI_SEISAKU_KAIKEN_SOURCE = "本人YouTube（政策発表記者会見）";
const SASAKI_SEISAKU_KAIKEN_URL = "https://www.youtube.com/live/8wWqCxmvfZQ";
const SASAKI_FBS_SOURCE = "報道（FBS福岡放送）";
const SASAKI_FBS_URL =
  "https://news.yahoo.co.jp/articles/8a769c7220ffa79a24a54b717f7fb303f25d2341";
const MORI_SITE_URL = "https://moriken3.com/";
const MORI_SITE_SOURCE = "本人サイト（森けんたろう公式サイト）";
const MORI_KOYAKU_URL = "https://moriken3.com/koyaku/";
const MORI_KAIKEN_SOURCE = "報道（福岡テレQ・出馬表明記者会見ノーカット）";
/**
 * 2026年9月18日の出馬表明記者会見（ノーカット動画・1時間7分）。
 *
 * 日本保守党の百田尚樹代表、北村晴男参議院議員、有本香代表代行が同席し、
 * それぞれ長く発言している。本人が自分の口で述べていない内容は載せないこと
 * （有本氏が紹介した本人の構想も、本人が質疑で自ら述べた範囲に限る）。
 *
 * 表明順は会見日ではなく、日本保守党が擁立を発表した9月14日で数える。
 * 同日に会見した井上氏の次とし、共同通信の数え方（井上氏5人目・森氏6人目）に合わせている。
 * 外国人に関する数字は本人サイトの公約ページの記載で、こちらでは検証していない。
 * 要約では本人サイトが出典であることを必ず明示すること。
 */
const MORI_KAIKEN_URL = "https://www.youtube.com/watch?v=Ctn2PwLRcKw";
/** 本人サイトの活動報告。日付は各記事に記載の日付 */
const MORI_EVENT_SENKYO_TIMES_URL =
  "https://moriken3.com/events/senkyo-times-1022/";
const MORI_EVENT_RAKUGAKI_URL = "https://moriken3.com/events/hakata-rakugaki/";
const INATOMI_SITE_SOURCE = "本人サイト（いなとみ修二 公式WEBサイト）";
const INATOMI_SITE_URL = "https://inatomi.jp/";
const INATOMI_PROFILE_URL = "https://inatomi.jp/about/";
const INATOMI_HYOMEI_URL = "https://inatomi.jp/news/3239/";
/**
 * 本人サイトに掲載された出馬表明記者会見（2026年10月13日）の全文。
 *
 * 「会見での発言を、読みやすさのために一部整えて掲載」とされた冒頭発言で、
 * 小見出しは事務所が付けたもの。冒頭発言はこちらを出典に引く。
 */
const INATOMI_KAIKEN_TEXT_SOURCE = "本人サイト（出馬表明記者会見の全文）";
const INATOMI_KAIKEN_TEXT_URL = "https://inatomi.jp/news/3286/";
const INATOMI_KAIKEN_SOURCE = "本人YouTube（出馬表明記者会見のアーカイブ）";
/**
 * 2026年10月13日の出馬表明記者会見のライブ配信アーカイブ（1時間）。
 *
 * 冒頭発言は本人サイトに全文が載っているため、こちらは質疑のみを引く。
 * 自動字幕の誤認識が多く、本人名が「俊浩」「港美」、福岡県知事選が
 * 「放課知事線」、副首都が「福祉都」などと認識されていた。
 * 記者が前提として述べた内容（過去の市長選での応援など）は、
 * 本人が答えていない以上そのまま載せないこと。
 */
const INATOMI_KAIKEN_URL = "https://www.youtube.com/watch?v=vXSJqpxuGcQ";
/**
 * 政策集「ともにつくる、福岡」（4つの重点戦略・14の政策分野）。
 *
 * 本人サイトの政策ページと、完全版PDF（全18ページ・「2026年10月23日改訂版」と明記、
 * ファイルの作成日は10月28日）。10月27日に政策発表の記者会見を開いたが、
 * ライブ配信が音声と回線のトラブルで正常に届かず、後日YouTubeで公開するとしている。
 * 会見の動画が出たら質疑を追補すること。ページの公開日は特定できないため、
 * ログの日付は政策を発表した会見の日（10月27日）にそろえている。
 */
const INATOMI_POLICY_SOURCE = "本人サイト（政策集「ともにつくる、福岡」）";
const INATOMI_POLICY_URL = "https://inatomi.jp/seisaku/";
const INATOMI_POLICY_PDF_URL =
  "https://inatomi.jp/wp-content/uploads/2026/10/inatomi-shuji-policy.pdf";

/**
 * 立候補予定者データ。
 *
 * 並び順は出馬表明順で固定し、告示後は届出順に差し替える。
 * ランダム化やソート機能は設けない（中立性の担保）。
 *
 * 全員が ISSUES のすべてのキーを持つこと。情報がない分野は「未表明」とし、
 * 分野そのものを省略しない。
 *
 * ## 更新のしかた
 * 新しい発言が出たら、その分野の `log` に**追記**し、`summary` は
 * 追記ではなく**書き換える**（`updated` も同時に更新）。こうすると
 * カードの高さが伸びず比較が保たれ、要約の根拠がログに残るので
 * 後から検証できる。立場が変わった場合も変更前の発言がログに残る。
 */
export const CANDIDATES: Candidate[] = [
  {
    id: "watanabe-hisaya",
    no: "01",
    name: "渡辺 久也",
    kana: "わたなべ ひさや",
    age: 58,
    title: "貿易会社代表・元経済産業省",
    party: "無所属（表明時点）",
    lead: "「誰一人取り残さない」を掲げ、学童の規模や道路陥没など手がつけられてこなかった課題への対応と、議論を尽くす開かれた市政運営を訴える。任期は2期8年までと明言している。",
    bioSource: `${WATANABE_KAIKEN_SOURCE}／報道（KBC九州朝日放送・RKB毎日放送 2026年8月）`,
    bio: [
      { label: "出身", text: "北九州市出身" },
      { label: "学歴", text: "九州大学卒業" },
      {
        label: "職歴",
        text: "通商産業省（現・経済産業省）にキャリア職として入省し、約10年間勤務。2002年に退職",
      },
      {
        label: "職歴",
        text: "退職後は自ら中小企業を起業。北九州の会社を10年経営し、2025年9月に譲渡して退職",
      },
      {
        label: "経歴",
        text: "元・福岡市食の安全安心推進協議会 委員。2010年頃に作られたまま見直されていなかった食品安全の基本方針を指摘し、見直しにつながったとしている",
      },
      { label: "現職", text: "福岡市早良区で貿易会社を経営" },
      {
        label: "2026",
        text: "福岡市長選への出馬の意向を表明。8月26日に記者会見",
      },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「一番訴えたいのは、誰一人取り残さない」と述べている。",
      },
      {
        label: "行政のかたち",
        text: "行政の単位から見直す道州制を打ち出したいとしている。",
      },
      {
        label: "市政運営",
        text: "現在の市政はトップダウンで政策が進んでいるとし、オープンな形で市政を進めていきたいとしている。",
      },
      {
        label: "任期",
        text: "市長になった場合の任期は2期8年までとし、「どんな事情があってもこれで私やめます」と述べている。",
      },
      {
        label: "選挙運動",
        text: "選挙カーを使わず、14日間で市内148の公民館すべてを徒歩で回るとしている。市長になった後も毎週1か所ずつ公民館を回り、市民と直接話す機会を設けるとしている。",
      },
      {
        label: "立場",
        text: "完全な無所属で、政党や団体からの推薦・支援は受けていないとしている。市議会の全会派の代表に連絡し、話を聞いてほしいと伝えたとしている。",
      },
    ],
    takashimaAssessment: {
      summary:
        "4期16年について「16年でも十分長い」とし、自身は2期8年で退くと明言している。掲げる「誰一人取り残さない」は16年間への評価であり、最も取り残されたのは子どもたちだとしている。一方で道路陥没を減らしてきた点と、道州制に取り組む姿勢は評価すると述べている。天神ビッグバンについては「政策目的が全く不明」としている。",
      updated: "2026年8月",
      log: [
        {
          date: "2026-08",
          place: "報道",
          source: "KBC九州朝日放送",
          text: "今の市政はトップダウンで政策が進んでいるとし、オープンな形で市政を進めていきたいとしている。",
        },
        {
          date: "2026-08-26",
          place: "記者会見",
          source: WATANABE_KAIKEN_SOURCE,
          text: "4期16年について「4期でも長すぎです」「16年でも十分長い」と述べ、自身は「2期やらせてください。どんな事情があってもこれで私やめます」としている。掲げる「誰一人取り残さない」については「この16年間の高島さんのやってきたことに対するアンチと言いますか、評価です」と説明し、「この16年間で1番取り残されてるのは子供たちじゃないかな」と述べた。一方、道路陥没については「高島さん頑張って減らしてこられてるんで、それはそれで素晴らしいこと」、道州制については「高島さんも道州制やりたいんだなと思って、そこは同じ思い」「全然評価してる」と述べている。天神ビッグバンには「政策目的が全く不明」と疑問を示した。なお高島市長とは16年間で一度も会ったことがないとしている。",
          url: WATANABE_KAIKEN_URL,
        },
      ],
    },
    links: [
      {
        label: "関連報道を検索",
        url: "https://search.yahoo.co.jp/search?p=%E6%B8%A1%E8%BE%BA%E4%B9%85%E4%B9%9F",
      },
    ],
    sns: [
      { kind: "公式サイト", handle: "", url: "" },
      { kind: "X", handle: "", url: "" },
      {
        kind: "YouTube",
        handle: "渡辺久也(わたなべひさや)のYouTubeチャンネル",
        url: "https://www.youtube.com/channel/UCNo58Kr2Rwt1tsSTsWzgnJA",
      },
      { kind: "TikTok", handle: "", url: "" },
      {
        kind: "Instagram",
        handle: "@watanabehisaya.fukuoka",
        url: "https://www.instagram.com/watanabehisaya.fukuoka/",
      },
      {
        kind: "Facebook",
        handle: "hisaya.watanabe.35",
        url: "https://www.facebook.com/hisaya.watanabe.35/?locale=ja_JP",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "学童の規模の問題を最優先の課題に挙げている。市内の小学生の3人に1人が学童に通うとし、高島市長の1期目に決まっていた規模の適正化が進まないまま拡大したと指摘。福岡都市圏に共通する問題として周辺自治体との連携を掲げている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-26",
            place: "記者会見",
            source: WATANABE_KAIKEN_SOURCE,
            text: "「福岡市内の小学生の3人に1人は学童に通ってるんです、ご存知ですか」と述べ、高島市長の1期目に前年の方針で決まっていた学童の規模への対応ができておらず、当時より規模が拡大していると指摘した。周辺自治体すべてに電話で確認したところほぼ全てで同じ問題があったとし、福岡都市圏として連携して取り組む必要があるとしている。「子育て支援っていうのは子育てしてる親に対する支援であって、子供たちの支援じゃない」「子供たちが学校に行ってる時間をいかにより良いものにしてあげられるか」とも述べた。",
            url: WATANABE_KAIKEN_URL,
          },
        ],
      },
      fukushi: {
        stance: "未表明",
        summary:
          "個別の施策は未表明です。「誰一人取り残さない」という基本姿勢のみが示されています。",
        updated: "",
        log: [],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "公共交通の空白地帯への対応を挙げている。鉄道やバスを含む都市の開発は福岡市単独ではなく、福岡都市圏で協力して進めるべきだとしている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-26",
            place: "記者会見",
            source: WATANABE_KAIKEN_SOURCE,
            text: "「公共交通の空白地帯とかもですね、これだけ発達してますけど福岡市にもありますんで、そういうところをやっていきたい」と述べた。再開発について問われた際も、鉄道やバスの問題を含めて福岡都市圏でみんなで協力して進めるスタンスが必要だとしている。",
            url: WATANABE_KAIKEN_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "天神ビッグバンについて「政策目的が全く不明」と強い疑問を示している。耐震性が理由なら他のビルも同じ条件のはずだとし、都市の高密度化がヒートアイランドを悪化させたと指摘。一方で再開発そのものは否定せず、福岡都市圏全体で必要な開発は進めるとしている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-26",
            place: "記者会見",
            source: WATANABE_KAIKEN_SOURCE,
            text: "天神ビッグバンについて「正直、何だったのかというか何なのかが全く分からない。政策目的が全く不明で、本当に必要だったのかなと非常に疑問に思います」と述べた。耐震性が理由なら天神の他のビルも同じ状況のはずだと指摘。ヒートアイランドの要因として人工排熱の増加、地面が緑でなくなること、都市の高密度化の3つを挙げ、再開発は「悪循環を産んだだけ」としている。一方で「再開発というのは天神だけじゃなくて福岡市全域で必要な開発はやっていく必要がある」とも述べた。",
            url: WATANABE_KAIKEN_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "道路陥没の主な原因は下水道管の老朽化だとし、「陥没して慌てて塞ぐ都市ではなく、陥没しない街」が重要だとしている。公園の桜が手入れされていない例も挙げ、これまで手がつけられてこなかったインフラの維持更新を進めるとしている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-26",
            place: "記者会見",
            source: WATANABE_KAIKEN_SOURCE,
            text: "博多駅前の陥没事故に加え、今年も市内で陥没が起きていると指摘し、陥没の一番の原因は下水道管が整備されていないことだと述べた。知人の子どもが乗ったバスの通過直後に陥没した例を挙げ、「今まで死者が出てないからいいですけど、出てからでは遅いんじゃないですか」「陥没して慌てて塞ぐ都市ではなく、陥没しない街が重要」としている。公園の桜が手入れされていない例も挙げ、これまでやられてこなかったインフラの整備をきちんと行う必要があるとした。",
            url: WATANABE_KAIKEN_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "環東シナ海経済圏を重視し、九州が台湾や韓国と経済的な連携を強めることは九州の発展にも我が国の安全保障にも重要だとしている。中国を敵視しても緊張関係が高まるだけだとする。市内の個別の施策は未表明で、自ら中小企業を経営した経験から、市の起業支援について「そんな簡単じゃない」との指摘が示されている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-11",
            place: "SNS",
            source: WATANABE_IG_SOURCE,
            text: "「環東シナ海経済圏というのも重要だと思っています。中国を敵視しても緊張関係が高まるだけです。九州が台湾や韓国と一緒に経済的な連携を強めることは九州の発展のみならず、我が国の安全保障上も重要だと考えています」としている。",
            url: WATANABE_IG_RENKEI,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都構想について「実は全然必要だと思ってません」としている。そのうえで、国が進めるのであれば福岡県に持ってくればよいとし、県・福岡市・北九州市が協力して進めるという考えには賛同する。国の機関を置くなら北九州市に置くべきで、福岡市内にある既存の国の機関も北九州市に移せばよいとし、理由として福岡市は交通渋滞や鉄道の混雑でキャパシティを超えていることを挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-25",
            place: "本人YouTube",
            source: WATANABE_YT_SOURCE,
            text: "「外国人問題について」の動画で、副首都構想やグローバル自治体ネットワークを掲げると外国人が増えるのではという懸念に答える形で、「正直言ってですね、私、副首都構想は実は全然必要だと思ってません」と述べた。そのうえで、国が副首都構想をやるのであれば福岡県に持ってきたらいいとし、福岡県・福岡市・北九州市が協力して実施しようという考えは「全くその通り」だとしている。ただし、副首都で国の機関を作るのであれば北九州市に作るべきで、なんなら福岡市内に今ある既存の機関もあわせて北九州市に持っていったらいいとし、理由として福岡市はもうキャパシティを超えており、交通渋滞も鉄道の混雑もそうだと述べた。北九州市は100万人以上いた人口が90万人いるかいないかになっていてキャパシティがあるとし、福岡市はもう少しゆとりのある生活にというのが自分の提案だとしている。",
            url: WATANABE_YT_GAIKOKUJIN_URL,
          },
        ],
      },
      kanko: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "外国人をめぐる問題は、日本語やルールを知らないことが背景だとして日本語教育を強力に進めるとし、国には労働力としてではなく隣人として受け入れる移民制度をつくるよう働きかけるとしている。不法残留者は徹底的に見つけて国外退去にすべきで、在留資格の制度を悪用する人も摘発する必要があるとする。市営住宅に特定の国の人が集まって地域の一体性が失われるのであれば対策が必要だとし、何人をどういう人を受け入れるのが妥当かを真剣に議論して制度をつくるべきだとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-25",
            place: "本人YouTube",
            source: WATANABE_YT_SOURCE,
            text: "「外国人問題について」の動画で、日本にいる外国人は合法的にいる人と非合法でいる人の2種類だとし、一番の問題は不法残留者が今年の初めの時点で約6万8000人いることだとした。論点を整理するとして、①不法残留者は徹底的に探して国外退去にする、②留学生として来たのに実は留学生ではないなど制度を悪用している人がいれば摘発する、③合法的に来た人でも市営住宅に特定の国の人が集まり地域の一体性が失われるようなことがあれば対策が必要、④短期間の労働力ではなく地域に溶け込む人を受け入れる移民制度を整備する、⑤人口が減っていく中で何人を、どういう人を受け入れるのが妥当かを真面目に議論して制度をつくる、を挙げた。製造業の社長だった経験から、技能実習や特定技能のように一定期間で帰る前提の制度では、技術や日本語を教えても帰られて困るとし、日本人の隣人としてきちんと受け入れる制度が必要だとしている。外国人を雇うとコンビニに補助金が出るという噂については「根拠がない噂」だとし、日本で罪を犯した外国人は法律に沿って厳正に処分すべきだとした。不法残留者については「議論の余地は全くない」とし、積極的に捕まえて国外退去処分にするのが法治国家のあり方だと述べている。",
            url: WATANABE_YT_GAIKOKUJIN_URL,
          },
          {
            date: "2026-09-10",
            place: "SNS",
            source: WATANABE_IG_SOURCE,
            text: "いわゆる外国人問題について、外国人が公園でバーベキューをしていたから出ていけという意見を例に挙げ、「これは日本人なら公園でバーベキューして良いのかという問題です。つまり、外国人問題ではなく公園でバーベキュー問題です」とした。日本語ができない外国人も多く、日本のルールを知らないだけで、知っていればそのようなことは起きないとし、「移民の受け入れを拒み、特定技能研修という人間を労働力としてしか捉えないような制度を作ったことが大きな問題」だとしている。家族でイギリスに留学した際、英語ができない子どもに現地の小学校で補助教員がマンツーマンで英語を教えてくれた経験を挙げ、日本語ができない外国人に日本語を教えることを強力に進める必要があるとした。国に対しては「外国人を労働力と捉えるのではなく、隣人として日本に受け入れるための移民制度をきちんと作るように働きかけたい」としている。",
            url: WATANABE_IG_GAIKOKUJIN,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "現在の市政はトップダウンで政策が進んでいるとし、オープンな形で市政を進めていきたいとしている。「多数決は決して民主主義じゃない、納得のプロセスが民主主義」として議論を尽くす姿勢を掲げ、市長になったら毎週1か所ずつ市内148の公民館を回り市民と直接話す「会いに行ける市長」を約束している。行政でのAIの利用は積極的に進めるとし、市民相談窓口のAIは必須だとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08",
            place: "報道",
            source: "KBC九州朝日放送",
            text: "今の市政はトップダウンで政策が進んでいるとし、オープンな形で市政を進めていきたいとしている。",
          },
          {
            date: "2026-08-26",
            place: "記者会見",
            source: WATANABE_KAIKEN_SOURCE,
            text: "「オープンな議論と納得のプロセス」がないことが一番の問題だとし、賛成・反対や複数案のメリットとデメリットが誰にでも見える形でテーブルに出され、比較検討されるべきだと述べた。「多数決は決して民主主義じゃない。納得のプロセスが民主主義なんであって、だからこそ少数の意見も排除しない」としている。また市長就任後は毎週1か所ずつ市内の公民館を回り市民と直接話す機会を設けるとし、「会いに行ける市長」を目指すと述べた。高島市長とは16年間で一度も会ったことがないとしている。",
            url: WATANABE_KAIKEN_URL,
          },
          {
            date: "2026-09-10",
            place: "SNS",
            source: WATANABE_IG_SOURCE,
            text: "「AIの行政での利用は積極的に行いたいと思います。市民相談窓口AIは必須と思います」とし、立候補の準備で市役所に問い合わせた際にたらい回しになることがあったと述べた。「AIが対応せずともAIを使って窓口がワンストップで対応することはできます。そういう市民対応は極めて重要だと思っています」とし、ほかにもAIを使う方が効果的かつ経済的であれば積極的に使いたいとしている。",
            url: WATANABE_IG_AI,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "物価高対策として、抽選で当たった人だけが支援される電子商品券「ネクスペイ」や、使用量の多い人ほど得をするとする下水道料金の無償化を「不公平な給付」だと批判し、市が運営する交通系ICカード「はやかけん」で市民全員に一律に給付する方式に切り替えるとしている。振込手数料ゼロ円で早く届けられる点を利点に挙げ、60年以上続く補助金などの必要性を見直して「毎年10万円くらい」の支給を目標にするとする。金額については「根拠はありません、目標の数字です」と自ら述べている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08-26",
            place: "記者会見",
            source: WATANABE_KAIKEN_SOURCE,
            text: "福岡市は自治体として交通系ICカード「はやかけん」を持つ唯一の市であり、交通局がポイントを付与すれば即座に全市民に届くと説明。物価高対策の電子商品券「ネクスペイ」が抽選で当たった人だけを対象とし手続きも複雑だと批判し、同じ財源をはやかけんへの給付に充てるべきだとした。今年春に交通局に確認し実現できると聞いているという。記者から所要額を問われ「具体的な根拠があるかというと根拠はありませんですけども、目標の数字です」と述べ、財源については長年出し続けている補助金を見直し、見直したものから順にこの仕組みに充てる考えを示した。",
            url: WATANABE_KAIKEN_URL,
          },
          {
            date: "2026-09-08",
            place: "SNS",
            source: WATANABE_IG_SOURCE,
            text: "「はやかけん」は福岡市が運営しているため市民全員への一律給付が可能だとし、「抽選で当たれば支援されるネクスペイや使用料の多い人ほど得する下水道料金の無償化など、物価高対策で行われている施策など不公平な給付が多いです」と批判した。はやかけんを市民全員に配布しておけば振込手数料0円で早く現金を給付できるとし、「現在行われている不公平な給付金施策をはやかけんを使うことで公平な給付金施策に変えようという提案です」としている。「６０年以上継続している補助金施策などの必要性を見直すことにより、毎年10万円くらいは支給したいという目標です」とも述べている。",
            url: WATANABE_IG_HAYAKAKEN,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "大学時代からの主張として道州制を掲げている。全国一律である必要はなく「まず九州だけ」でよい、九州がモデルケースになるとし、国の制度を変えるところまで目指すとしている。グローバルな自治体連携を市長を志す一番の理由に挙げ、北九州市が加盟する「イクレイ」に福岡市は加盟していないと指摘する。世界の自治体が協力する枠組みに参加してリーダーになり、その事務局を福岡に置くこともありうるし、やるべきだとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-25",
            place: "本人YouTube",
            source: WATANABE_YT_SOURCE,
            text: "「外国人問題について」の動画で、掲げているグローバル自治体ネットワークについて、世界の自治体が協力する枠組みに参加してそのリーダーになっていく必要があるとし、その事務局が福岡にあるということは「あり得るしやるべきだと思ってます」と述べた。ニューヨークに国連の本部があるようなものだとして、無制限にいろんな外国人が増えるというより、そこで働く人が増えることは十分ありうるとし、そのためにも福岡市にある国の機関はもう少し空けたらどうかと考えているとしている。",
            url: WATANABE_YT_GAIKOKUJIN_URL,
          },
          {
            date: "2026-08",
            place: "報道",
            source: "RKB毎日放送",
            text: "行政の単位から見直す道州制を打ち出したいとしている。",
          },
          {
            date: "2026-08-26",
            place: "記者会見",
            source: WATANABE_KAIKEN_SOURCE,
            text: "道州制は大学の頃から変わらない主張だとし、「日本全国一律に道州制にする必要も全然ない。とりあえず九州だけ道州制にするというのでも何の問題もない」「九州がモデルケースになって、いち早く道州制に移行していく」と述べた。国の制度を変えるところまで考えているとし、高島市長が進めてきた市長会などの広域連携も「常に素晴らしい」と評価したうえで「国の制度を変えるのが難しいからそっちをやりますじゃなくて、これは両方やる必要がある」としている。また世界には自治体のネットワークが数多くあるが福岡市はいずれにも加わっていないと指摘し、「アジアのリーダー都市」と掲げながら実際にはリーダーではないとして、グローバルな自治体連携に参画し福岡市が主体的に枠組みを作る必要があると述べた。",
            url: WATANABE_KAIKEN_URL,
          },
          {
            date: "2026-09-11",
            place: "SNS",
            source: WATANABE_IG_SOURCE,
            text: "「福岡市の市長になりたい1番の理由はこれです。グローバルな自治体連携です」とし、「北九州市はイクレイに加盟していますが、福岡市は全く加盟していません」と指摘した。カナダのカーニー首相が中堅国の結束を訴えていることに触れ、「さらにそれを一歩進めて自治体のグローバルな連帯が今こそ重要と考えています」としている。",
            url: WATANABE_IG_RENKEI,
          },
        ],
      },
    },
  },
  {
    id: "nishiwaki-hiroki",
    no: "02",
    name: "西脇 ひろき",
    kana: "にしわき ひろき",
    // 出典（選挙ドットコムのプロフィール欄）の表記に合わせた年齢。
    // 9月30日の誕生日を過ぎ、出典の表記も35歳に更新された。
    age: 35,
    // 本人が選挙ドットコムのメッセージで「普段は会社員として働いています」としている。
    // 同ページの肩書欄は「無所属・市民代表の挑戦者」だが、他の候補者と同じく
    // 職業を載せる欄なので、自己表現ではなく職業を記載する。
    title: "会社員",
    party: "無所属（表明時点）",
    lead: "「もっと、福岡を好きになる。」を掲げ、高島市政を「継承 × 進化 × 挑戦」で引き継ぐとしている。7つの約束を示し、重点は第1子からの保育料ゼロ・ふくおかパスポート・FUKUOKA FIRSTの3つ。",
    bioSource: "選挙ドットコム 政治家データベース・本人ブログ（2026年9月時点）",
    bio: [
      { label: "1991", text: "9月30日生まれ" },
      {
        label: "出身",
        text: "兵庫県神戸市出身。社会人になってから転勤で福岡市へ移り、移住11年目としている",
      },
      {
        label: "学歴",
        text: "神戸市立有野小学校・有野中学校を経て、国立舞鶴工業高等専門学校 建設システム工学科建築コースを2012年に卒業",
      },
      {
        label: "2012",
        text: "西日本高速道路ファシリティーズ株式会社に入社。香川県で4年間勤務",
      },
      {
        label: "職歴",
        text: "福岡へ異動しNEXCO九州支社で、サービスエリア・パーキングエリアなど高速道路関連施設の設計・施工などに携わる（古賀サービスエリア下り線の建て替え工事など）",
      },
      {
        label: "職歴",
        text: "その後転職し、ドローンによる3D測量、スタートアップ企業での事業、OYOホテルズジャパンでのホテル改修・営業、太陽光発電所の施工管理・営業などを経験",
      },
      {
        label: "現在",
        text: "海外の新しい技術や製品を日本に導入する事業開発に携わっているとしている",
      },
      { label: "2026", text: "福岡市長選への出馬の意向を表明" },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「もっと、福岡を好きになる。」を掲げ、「良いものは受け継ぐ」「必要なものは進化させる」「そして、もっと新しいことに挑戦する」を市政に対する基本姿勢として「継承 × 進化 × 挑戦」と表現している。",
      },
      {
        label: "立場",
        text: "自らを「福岡の未来を、誰よりも考える市民」と表現している。普段は会社員として働いており、政治に文句を言うだけでなく自分で行動したい、普通の会社員でも政治に挑戦できることを示したいとしている。",
      },
      {
        label: "7つの約束",
        text: "子ども・子育て、市民生活、経済・産業、防災・安全、行政改革とAI、都市・環境・共生、市民参加の7分野に政策を整理している。",
      },
      {
        label: "3つの重点政策",
        text: "第1子から0〜2歳児の保育料ゼロ、市民向けの「ふくおかパスポート」、企業の挑戦を呼び込む「FUKUOKA FIRST」の3つを重点に掲げている。",
      },
      {
        label: "説明の姿勢",
        text: "「何をやるのか。なぜやるのか。いくらかかるのか。どうやってやるのか。いつまでにやるのか」まで説明できる政策にするとし、実行した結果を数字で示すとしている。減税額のモデル計算では「都合のいい数字を確定額のように見せることはしません」とも述べている。",
      },
    ],
    takashimaAssessment: {
      summary:
        "高島市長の主導でこの十数年に福岡が大きく成長したとし、積み上げてきたものを受け継ぎながら進化させる「継承 × 進化 × 挑戦」を基本姿勢に掲げている。「福岡を否定するために市長を目指すのではありません」と述べている。",
      updated: "2026年9月",
      log: [
        {
          date: "2026-09-01",
          place: "ブログ",
          source: NISHIWAKI_BLOG_SOURCE,
          text: "「福岡は、高島市長の主導のもと、この十数年で大きく成長してきました。だからこそ、これまで積み上げてきたものを大切にしながら、その先にある福岡をつくっていきたい」とし、「良いものは受け継ぐ」「必要なものは進化させる」「そして、もっと新しいことに挑戦する」を基本姿勢としている。保育料無償化についても「これまでが間違っていたから変えるのではありません。これまで進めてきたからこそ、その先へ進む」と述べ、「私は、福岡を否定するために市長を目指すのではありません」としている。",
          url: NISHIWAKI_POLICY_URL,
        },
      ],
    },
    links: [
      {
        label: "プロフィール（選挙ドットコム）",
        url: GO2SENKYO_NISHIWAKI,
      },
    ],
    sns: [
      { kind: "公式サイト", handle: "", url: "" },
      {
        kind: "X",
        handle: "@nishiwaki_hk",
        url: "https://x.com/nishiwaki_hk",
      },
      { kind: "YouTube", handle: "", url: "" },
      { kind: "TikTok", handle: "", url: "" },
      { kind: "Instagram", handle: "", url: "" },
      { kind: "Facebook", handle: "", url: "" },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "3つの重点政策の一つとして、0〜2歳児の保育料を第1子からゼロにするとしている。「無料にする」と言うだけでなく、対象人数・財政負担・国や県の制度との関係を精査して財源と制度設計を明らかにするとしている。あわせて教育、子どもの居場所、若者支援、体験格差にも取り組むとし、出生順位によらない子育て現金給付や保育士の給与引き上げも挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08",
            place: "プロフィール",
            source: NISHIWAKI_PROFILE_SOURCE,
            text: "福岡市の財政・交通・子育て・税制・都市政策などについて調査・発信していると記載されている。",
            url: GO2SENKYO_NISHIWAKI,
          },
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "第1子保育料の無償化（市が実施済みの第2子無償化を第1子まで拡張）、子育て現金給付の設計見直し（出産祝い金と子ども手当を出生順位に関わらず支給）、保育士の処遇改善（給与引き上げ）を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-08-28",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "0〜2歳児の保育料を第一子から無償化すると表明。福岡市では3〜5歳児と、2023年4月からは第2子以降の0〜2歳児が無償化済みで、その対象を第一子まで広げるとしている。「働きたい。でも、保育料を考えると働きにくい」という状況をなくすためで、「子育て中の人はもっと働け」という政策ではないと断っている。第2子以降の無償化には年間23億3,516万円（2023年度）が計上されたが、第一子まで広げた場合の必要額は市が公表しておらず、「年間数十億円規模の政策になることを想定し、精密な財政シミュレーションを行う」としている。",
            url: NISHIWAKI_BLOG.hoikuryo,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要の「7つの約束」の1番目に子ども・子育てを置き、「子どもに、もっと投資する」として第1子から0〜2歳児の保育料をゼロにすると表明。「これまでが間違っていたから変えるのではありません。これまで進めてきたからこそ、その先へ進む」とし、対象人数・財政負担・国や県の制度との関係を精査して財源と制度設計を明らかにするとしている。教育、子どもの居場所、若者支援、体験格差にも取り組むとした。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "「福岡で暮らすことを、もっと楽しく」として、市民生活の体験をつなぐ「ふくおかパスポート」を重点政策の一つに掲げている。街歩きを促す「ふくおかクエスト」、市民の得意を地域に生かす「マッチョ隊」も示している。ほかに老人ホームの増設と介護士の給与引き上げ、市内全域のバリアフリー総点検を挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "介護の受け皿整備（老人ホームの増設と介護士の給与引き上げ）、バリアフリー総点検（車椅子で不便な箇所を市内全域で洗い出し優先順位をつけて整備）、神戸のNobinobiパスポートを模した市民向け生活支援パス「福岡パスポート」を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要で市民生活を「7つの約束」の2番目に置き、「福岡に住むほど、ちょっと得。」をコンセプトとする「ふくおかパスポート」を重点政策の一つに掲げた。行政サービスだけでなく地域活動・商店街・文化・イベント・観光・ボランティアといった体験を一つにつなげるとしている。ほかにゲームのような仕組みで街歩きを促す「ふくおかクエスト」、市民が車の提供や語学などの得意を地域に生かし、ふくおかパスポートのポイントで還元される「マッチョ隊」を示している。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "「100年後も住みたい福岡へ」として、公共交通と歩行空間を含む都市の細部まで価値を高めるとしている。個別には都市高速の定期券制度、頓挫したロープウェイ構想の掘り起こし、大規模で格安の市営立体駐車場の整備を挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08",
            place: "プロフィール",
            source: NISHIWAKI_PROFILE_SOURCE,
            text: "福岡市の財政・交通・子育て・税制・都市政策などについて調査・発信していると記載されている。",
            url: GO2SENKYO_NISHIWAKI,
          },
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "通勤者・市内業者向けの都市高速定期券「ワーク都市高パス」、頓挫した市のロープウェイ構想を掘り起こし渋滞に左右されない移動手段かつ観光資源にすること、九州各県から来やすくするための大規模・格安の市営立体駐車場を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要の「都市・環境・共生」で「100年後も住みたい福岡へ」を掲げ、公共交通、歩行空間、道路といった毎日の生活の中にある細かな部分まで福岡の価値を高めるとしている。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "「100年後も住みたい福岡へ」として、博多湾・公園・景観・街路樹・照明・ベンチなど都市の細部まで価値を高めるとしている。「神は細部に宿る」を都市づくりでも大切にし、美しく歩きたくなる都市を目指すとする。個別には博多〜天神の全天候型動線と博多区の無電柱化を挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08",
            place: "プロフィール",
            source: NISHIWAKI_PROFILE_SOURCE,
            text: "福岡市の財政・交通・子育て・税制・都市政策などについて調査・発信していると記載されている。",
            url: GO2SENKYO_NISHIWAKI,
          },
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "博多〜天神を雨に濡れず日焼けもせず歩けるアーケード（全天候型動線）の設置と、博多区の電柱・電線の地中化による景観と歩道・車椅子・自転車の通行環境の改善を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要の「都市・環境・共生」で「100年後も住みたい福岡へ」を掲げ、博多湾、公園、景観、歩行空間、環境、多文化共生、道路、街路樹、照明、ベンチまで挙げて福岡の価値を高めるとしている。建築を学んだ経験から「神は細部に宿る」を都市づくりでも大切にしたいとし、「ただ大きな都市にするのではなく、美しく、歩きたくなり、暮らしたくなる都市へ」と述べている。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "市民・企業・地域・行政の力をつなぐ「福岡レスキューネット」を掲げ、災害が起きてから人を探すのではなく平時から協力できる企業や市民を登録しておくとしている。阪神・淡路大震災の被災経験をもとに、避難所の環境やプライバシー、子ども・高齢者・障がいのある人・ペットへの対応、在宅避難や車中泊、生活再建までを含めた防災を掲げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "各戸・各棟に電源を確保して避難所依存と防災コストを下げる「在宅避難できる街」と、太陽光同時設置・戸建て持ち家限定である現行の蓄電池補助をマンション・賃貸にも届く制度にすることを挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-08-27",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "3歳のときに明石市で阪神・淡路大震災を経験したとし、「防災は私にとって他人事ではありません」と述べている。避難所の環境とプライバシーへの配慮、子ども・高齢者・障がいのある方への支援、ペットと暮らす方への対応、在宅避難や車中泊への備え、避難生活が長期化した後の生活再建までを挙げ、「命を守る防災」から「命と、その後の暮らしまで守る防災」へ、としている。",
            url: NISHIWAKI_BLOG.bosai,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要の「防災・安全」で「福岡レスキューネット」を掲げた。「助けたいけれど何をすればいいのか分からない」市民と、人手や車、物資の輸送が足りない現場をつなぐ仕組みで、市民・企業・地域・行政が持つ力を結びつけるとしている。「災害が起きてから人を探すのではなく、災害が起きる前から助け合える仕組みをつくっておく」として、協力できる企業や市民を平時から登録するとした。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "重点政策の一つとして「FUKUOKA FIRST」を掲げている。市民の困りごとを市の行政課題として捉え、全国の企業・スタートアップ・大学から解決策を集めて福岡で実証し、効果が確認できれば市が導入して全国やアジアへ広げるという構想で、採択・実証・導入の件数を数字で公表するとしている。ほかに週休3日制を導入した企業への助成を挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "週休3日制を導入した企業に市から助成金を出すことを挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要で「福岡を、もっと強くする」として重点政策「FUKUOKA FIRST」を掲げた。「福岡市を、最初の顧客に」とし、市民の困りごとを行政課題として捉え、全国の企業・スタートアップ・大学から解決策を集めて福岡で実証、効果を検証し、役に立つものは市が導入して全国・アジアへ広げるとしている。「企業を支援する街ではなく、企業が福岡で挑戦し福岡から世界へ出ていく街にする」とし、採択件数・実証件数・導入件数を数字で公表するとした。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都を目指すのは福岡市民の生活を豊かにすることにつなげたいからだとし、副首都になれば自動的に暮らしが良くなるとは考えていないとしている。企業や投資、人材を呼び込んで雇用を生み、都市機能を強化して災害時のバックアップ機能を高め、その結果を所得・税収・都市サービスで市民に還元するとする。副首都を目指すなら災害時にも機能し続ける都市でなければならず、交通インフラも世界水準を目指すとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "10月27日時点の記事「交通渋滞をどう解消する？福岡をもっと走りやすい街へ」で、「福岡市を日本の副首都にするなら、交通インフラも世界水準を目指したい」とし、交通量に合わせて信号を細かく変える深圳や、混雑に応じて車の流れを管理するシンガポール、中心部へ入る車を管理するロンドンやミラノの例を挙げて、今ある道路をもっと賢く使うとしている。「福岡市を、日本の副首都へ。そのためには、街の大きさだけではなく、交通インフラまで世界水準でなければいけません」と結んでいる。",
            url: NISHIWAKI_BLOG.jutai,
          },
          {
            date: "2026-10-24",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "10月24日時点の記事「福岡市長を目指す私への『想定Q&A』」で、副首都を目指すのはなぜかという問いに「福岡市民の生活を豊かにすることにつなげたいからです」と答え、「副首都になれば、自動的に暮らしが良くなるとは考えていません」としている。企業や投資、人材を呼び込み雇用を生む、都市機能を強化し災害時のバックアップ機能を高める、その結果を所得・税収・都市サービスなどを通じて市民に還元することが大切だとし、「副首都という名称だけでなく、福岡がどのような機能を担い、市民の生活に何をもたらすのかを考えます」としている。防災の問いでは、「副首都を目指すのであれば、災害時にも機能し続けられる都市であることが必要だと考えています」と答えている。",
            url: NISHIWAKI_BLOG.qa,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "アジアのナイトマーケット型の夜市の常設化、企業協賛による年代別ミス・ミスター福岡の開催、多言語対応の従業員を雇う事業者への補助を挙げている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "観光客も住民も気軽に行ける形で常設化する「福岡夜市」、企業協賛による年代別のミス・ミスター福岡の開催、英語・韓国語・中国語等を話せる従業員を雇う事業者（特に飲食店）への人数に応じた補助を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "「外国人を増やすこと自体を目的とする政策」にも「一括りに排除すること」にも反対だとし、不法滞在・不法就労などのルール違反には厳正に対応するとしている。日本で暮らす人が日本の法律・文化・生活習慣・地域のルールを学ぶ場として「FUKUOKA JAPAN 道場」の設置を掲げる。大切なのは国籍ではなく実際の行動だとして「日本人にも外国人にも、同じルールを、同じ基準で」とし、市民が参加して地域の見守りやマナー啓発、多言語でのルール説明を行う仕組み（キャッチコピーは「福岡マッチョ警備隊」）を行政が整えるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-25",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "10月25日時点の記事「外国人・移民・治安問題への政策（マッチョ警備隊）」で、「夜、公園に外国人が集まっていて少し不安を感じる」といった市民の不安を「偏見だから」と一言で片付けてはいけないとする一方、「外国人だから問題だ」と決めつけるのも違うとし、「大切なのは、国籍ではなく、実際の行動を見ること」だとしている。犯罪は警察に対応してもらい、騒音やポイ捨てなどの迷惑行為は市民ができる範囲で声を掛けて必要に応じて警察などにつなぐとして、市民が参加する地域の見守り・マナー啓発の仕組みを掲げ、「福岡マッチョ警備隊」はキャッチコピーで正式名称は公募するとしている。市が警備隊そのものを作るのではなく、登録制度、行動規範、人権・多文化理解などの研修、保険、警察や自治協議会との連携、多言語での声掛けの体制などの土台を行政が整えるとし、腕章に特別な権限はなく「自分たちで裁かない。自分たちで罰しない。自分たちで晒さない。」を徹底するとする。活動場所は外国人の多さだけを基準にせず、市民の相談や迷惑行為の状況から決めるとし、「日本人にも外国人にも、同じルールを、同じ基準で。外国人だから厳しくするのではありません。日本人だから甘くするのでもありません」としている。",
            url: NISHIWAKI_BLOG.matcho,
          },
          {
            date: "2026-10-24",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "10月24日時点の記事「福岡市長を目指す私への『想定Q&A』」で、外国人との共生についての問いに「国籍に関係なく、ルールを守って快適に暮らせる街にしたいと思っています」と答え、「外国人だからという理由で排除するつもりはありません。一方で、共生を理由に何でも許されるという考え方でもありません」としている。日本人にも外国人にも福岡で生活するために必要なルールを分かりやすく伝え、知らないのであれば理解できるように説明したうえで、守るべきルールは守ってもらうのが基本的な考えだとしている。",
            url: NISHIWAKI_BLOG.qa,
          },
          {
            date: "2026-08-27",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "外国人政策について「私は、『外国人を増やすこと自体を目的とする政策』には反対です」とし、不法滞在・不法就労などのルール違反には厳正に対応する一方、日本で暮らすことを選んだ外国人に対しては行政も責任を持つべきだとしている。日本の法律・文化・生活習慣・地域のルールに加え、茶道や書道などを実際に体験して学ぶ場として「FUKUOKA JAPAN 道場」の設置を掲げる。「外国人を無条件に増やすことにも、一括りに排除することにも反対です」と述べている。",
            url: NISHIWAKI_BLOG.gaikokujin,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "「市役所のために市民が合わせるのではなく、市役所が市民に合わせる」として、AIで「制度を探す市役所」から「必要な制度を教えてくれる市役所」への転換を掲げている。市民の声を集める「福岡アイデアBOX」も示す。ほかに議員ごとの発言回数・在席率の公開と議会中継の全編アーカイブ、予算の一部の使途を市民が決める参加型予算を挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "議員ごとの発言回数・在席率を公開し議会中継の全編アーカイブを残す「議会の見える化」と、予算の一部の使途を市民が決め子ども・外国人住民も意思決定側に入れる「参加型予算」を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要の「行政改革・AI」で「市役所を、もっと便利に」を掲げ、「市役所のために市民が合わせるのではなく、市役所が市民に合わせる」としている。「制度を探す市役所」から「必要な制度を教えてくれる市役所」への転換を目指し、たとえば「子どもが生まれました」と伝えるだけで児童手当・保育・医療・予防接種・利用できる支援制度・必要な手続きをまとめて案内し、次に何をすればよいかまで分かる行政サービスにするとした。「AIを導入すること自体を目的にしません。市民の時間と手間を減らすためにAIを使います」としている。市民の声を市政を動かす入口にする「福岡アイデアBOX」も示した。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "「何をやるのか。なぜやるのか。いくらかかるのか。どうやってやるのか。いつまでにやるのか」まで説明できる政策にするとし、実行した結果を数字で示すとしている。個別には「住民税5％減税」として市民税の所得割を8％から7.6％へ引き下げるとし、県民税2％は市長の権限外、年収500万円のモデルでは負担軽減が月約800円になると自ら説明している。財源は財政調整基金の取り崩しではなく行政の効率化などで生み出す恒常的な財源によるとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-08",
            place: "プロフィール",
            source: NISHIWAKI_PROFILE_SOURCE,
            text: "福岡市の財政・交通・子育て・税制・都市政策などについて調査・発信していると記載されている。",
            url: GO2SENKYO_NISHIWAKI,
          },
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "財政を精査し、住民税・社会保険料の負担軽減によって市民の手取りを増やす方向を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-08-28",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "市長報酬を年間1,000万円削減すると表明。「市民に負担をお願いする前に、まずは自分から」としていた。",
          },
          {
            date: "2026-09",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "市長報酬を年間1,000万円削減する公約を取り下げると表明した。これに伴い、当初この公約を説明していたブログ記事も別の内容に差し替えられている。",
            url: NISHIWAKI_X_HOSHU_WITHDRAW,
          },
          {
            date: "2026-08-28",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "「住民税5％減税」の中身を説明。市民税の所得割8％を7.6％へ引き下げるもので、県民税2％は福岡県の税のため市長が単独で変更できないとしている。年収500万円・単身・給与収入のみのモデルでは負担軽減は年間約9,520円（月約793円）で、「今回の減税だけで生活が劇的に変わるわけではありません」と自ら断っている。財源は財政調整基金の取り崩しに頼らず行政の効率化などで生み出すとし、個人市民税約1,582億円の5％にあたる約79億円という数字についても「単純計算した場合の規模感」であって確定額ではないと明記している。",
            url: NISHIWAKI_BLOG.genzei,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要では「面白いで終わらせない」として、「何をやるのか。なぜやるのか。いくらかかるのか。どうやってやるのか。いつまでにやるのか」まで説明できる政策にするとした。保育料ゼロなら財源と制度設計を、FUKUOKA FIRSTなら実証・導入の件数を、AI市役所ならどの行政手続きから変えるのかを示すとし、「やりますで終わらせない。実行した結果を、市民に分かる数字で示します」と述べている。なおこの概要の3つの重点政策は保育料ゼロ・ふくおかパスポート・FUKUOKA FIRSTで、8月に掲げていた住民税5％減税は重点3つには含まれていない（個別のブログ記事は公開されたまま）。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "「投票を、福岡のイベントに」として「FUKUOKA VOTE FES」を掲げ、子ども向けの「キッズVOTE」で自分たちの街について考えてもらうとしている。路上喫煙対策と喫煙可否の店頭表示義務化、ポイ捨ての厳罰化、害虫根絶計画も挙げる。市長選の再選挙については、制度そのものは否定しないとしたうえで、選挙費用だけでなく市職員の負担や新年度予算の編成への影響、長期化の可能性まで考える必要があるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-28",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "10月28日時点の記事「再選挙について考えていること」で、有効投票総数の4分の1に達する候補者がいなければ再選挙になる仕組みを自身は知らなかったと率直に認め、「知らない市民が悪い」で終わらせず、難しい制度をできるだけ分かりやすく伝えられる人間でありたいとしている。「再選挙制度そのものを否定しているわけではありません」とし、票の分散でごく一部の支持だけで市長が決まることを防ぐ意味はあるとする。一方で、今回の市長選には約6億7,500万円の選挙費用が計上されていると報じられているとして、お金だけでなく、市職員の時間や人的負担、通常業務との並行、新年度予算の編成時期との重なり、新しい市長が決まる時期のずれ、2027年春の県議選・市議選を挙げ、2017年の千葉県市川市長選では再選挙まで約5か月かかり市長不在になった例にも触れて、「再選挙は民主主義だから必要なコストです」の一言で終わらせたくないとしている。",
            url: NISHIWAKI_BLOG.saisenkyo,
          },
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "喫煙所整備と厳罰化による路上喫煙対策、入店前に分かる喫煙可否の店頭表示義務化と分煙店舗への助成、シンガポール型の罰則によるポイ捨ての厳罰化、市全体の害虫根絶計画、投票を楽しい体験として設計し投票率と政治参加を底上げする「VOTEFES」を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
          {
            date: "2026-09-01",
            place: "ブログ",
            source: NISHIWAKI_BLOG_SOURCE,
            text: "政策概要の「市民参加」で「投票を、福岡のイベントに。」として「FUKUOKA VOTE FES」を掲げた。政治を身近にし、自分たちの街について考えて意思を表明する場にするとしている。あわせて「キッズVOTE」で子どもたちにも街について考えてもらい、「自分たちの街は、自分たちでつくる」という感覚を持ってもらいたいとした。",
            url: NISHIWAKI_POLICY_URL,
          },
        ],
      },
    },
  },
  {
    id: "aramaki-akira",
    no: "03",
    name: "荒牧 明楽",
    kana: "あらまき あきら",
    // 出馬表明会見の報道（KBC・TNC）が41歳としており、本人サイトの
    // 「1985年生まれ」とも整合するため確定させた
    age: 41,
    title: "民間教育機関の講師",
    party: "0=∞=1党（こころ党）福岡支部",
    lead: "「福岡を世界の教育首都に」を掲げ、AI時代に向けた新しい学問と教育、孤独や不安を解消する「心のインフラ」を福岡から示すとしている。",
    bioSource: `${ARAMAKI_KAIKEN_SOURCE}／${ARAMAKI_CAMPAIGN_SOURCE}／${ARAMAKI_SITE_SOURCE}／${ARAMAKI_SOURCE}`,
    bio: [
      { label: "1985", text: "生まれ。柳川市出身、福岡市在住" },
      { label: "学歴", text: "佐賀大学経済学部卒業" },
      {
        label: "職歴",
        text: "株式会社リクルートに入社。広告業界・医療業界を経る",
      },
      { label: "2018", text: "社会起業家として独立" },
      {
        label: "現在",
        text: "「OVER THE RAINBOW」代表、NPO法人カラフルチェンジラボ研修研究グループリーダー、九州レインボープライド実行委員、nOU（nTech Online University）学長などを務めるとしている",
      },
      {
        label: "活動",
        text: "nTech講師のほか、福岡県講師団、NPO法人理事、久留米大学医学部非常勤講師などに携わる。講演は1000本以上、相談件数は1万人以上としている",
      },
      { label: "著書", text: "『トランスジェンダーの私が悟るまで』" },
      {
        label: "2026",
        text: "9月3日に福岡市役所で記者会見を開き、福岡市長選への出馬を表明",
      },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「福岡を世界の教育首都に」を掲げ、教育を中心とした新しい政治と産業を生み出すとしている。陣営の資料では「心のインフラ尊厳City福岡」を掲げている。",
      },
      {
        label: "背景",
        text: "トランスジェンダー当事者として差別や分断の根本原因と向き合い、認識技術nTechに出会ったとしている。",
      },
      {
        label: "目指すもの",
        text: "誰もが自らの存在理由を確信し、孤独や不安を解消できる「心のインフラ」を福岡から世界へ示すとしている。会見では「心と心がしっかりと繋がりあう。そんな心のインフラモデルとして福岡をさらに再開発していきたい」と述べた。",
      },
      {
        label: "会見での発言",
        text: "トランスジェンダーであることを明かしたうえで「誰もが挑戦できる社会を作りたい」と述べている。生まれた時は女性の体で、物心がついた頃に心は男性だと自覚したが、当時はLGBTQという言葉もなく存在を隠して生きて諦める癖がついたとし、教育によって思い込みや分断に閉ざされた世界を解放でき、アイデンティティも生き方も変えられたと語っている。",
      },
      {
        label: "福岡を選んだ理由",
        text: "自身が拠り所とする教育は民間企業が福岡市で31年間かけて研究・開発・体系化してきたものだとし、その誕生の地であり自身が生まれ育った町でもある福岡市への恩返しとして市長選を選んだとしている。",
      },
      {
        label: "モットー",
        text: "本人サイトでは「真のダイバーシティ＆インクルージョンを実現したい！」を掲げ、「明るく楽しく自分らしく」をモットーとしている。",
      },
      {
        label: "マニフェスト",
        text: "選挙用の公式サイトで、「福岡市を、世界の教育首都に ～『住みたい街1位』から、『人が輝く街1位』へ～」と題したマニフェスト（全49ページ・2026年9月3日時点）を公開している。高島市政の路線を「生活基盤」として継承し、その上に一人ひとりが自分の存在に安心を持てる「尊厳基盤」を教育を中心に開拓するとしている。7つの重点政策と「5つの理念で福岡をアップデート」を示している。",
      },
    ],
    takashimaAssessment: {
      summary:
        "「非常に評価している」とし、航空法の高さ制限の規制緩和から再開発につなげ、財源を確保して市民に還元する形まで取られたことを挙げている。その結果として生活基盤が整えられたからこそ、次は教育に力を入れられるとする。うまくいっているものはしっかり継承するとしている。",
      updated: "2026年9月",
      log: [
        {
          date: "2026-09-03",
          place: "本人サイト",
          source: ARAMAKI_MANIFESTO_SOURCE,
          text: "マニフェストの「はじめに」で、高島市政16年を経て福岡市は日本でもっとも勢いのある都市になったとし、天神ビッグバンは当初目標の30棟を大きく超えて70棟以上のビルが竣工したこと（2025年時点）、人口増加率3.2%が東京23区を含む21大都市で第1位であること（2025年国勢調査速報）、住みたい街ランキング〈全国版〉で6年連続1位であることを挙げ、「歴代のどの市政も届かなかった水準です。私は、この成果を率直に評価します」としている。一方で、合計特殊出生率1.20（2020年）は政令指定都市20市中16位、市民の平均所得約400万円は政令市中8位で、人口は2040年ごろに約170万人でピークを迎えるとして「残された課題」があるとする。マニフェストは「継承」と「開拓」の二つで組み立てるとし、水道・電気・道路・交通・医療などの「生活基盤」は高島市政の路線を継承してさらに強くするとしている。",
          url: ARAMAKI_MANIFESTO_URL,
        },
        {
          date: "2026-09",
          place: "記者会見",
          source: ARAMAKI_KAIKEN_MOVIE_SOURCE,
          text: "高島市政16年の評価を問われ「非常に評価させていただいております」と述べた。「高島市長がこの16年間で築かれた、航空法から始まったと思うんですけど、その法律からしっかり規制緩和をして、そこから新しい再開発に及び、財源を確保され、さらにそれをしっかり市民に還元できる形まで取られていたこと」を挙げ、「この形が今あるからこそ、私は次に教育に力を入れられる。その基盤を作っていただいた」としている。教育以外の課題については「今までの高島市長がここまでされてきたもので、今うまくいっているものに関してはしっかりと継承していく」と述べた。",
          url: ARAMAKI_KAIKEN_MOVIE_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト（選挙用の公式サイト）", url: ARAMAKI_CAMPAIGN_URL },
      {
        label: "本人サイト（福岡市マニフェスト・全49ページ）",
        url: ARAMAKI_MANIFESTO_URL,
      },
      {
        label: "本人サイト（OVER THE RAINBOW）",
        url: ARAMAKI_SITE_URL,
      },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "kokoro-party.com/aramakiakira",
        url: ARAMAKI_CAMPAIGN_URL,
      },
      {
        kind: "X",
        handle: "@aramaki_fukuoka",
        url: "https://x.com/aramaki_fukuoka",
      },
      { kind: "YouTube", handle: "", url: "" },
      {
        kind: "TikTok",
        handle: "@aramaki.fukuoka",
        url: "https://www.tiktok.com/@aramaki.fukuoka",
      },
      {
        // 選挙用の公式サイトが案内している選挙用アカウント。
        // 個人アカウント（@akira_555）も別にある
        kind: "Instagram",
        handle: "@aramaki_fukuoka",
        url: "https://www.instagram.com/aramaki_fukuoka/",
      },
      {
        kind: "Facebook",
        handle: "akira.aramaki.5",
        url: "https://www.facebook.com/akira.aramaki.5/",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "「福岡を世界の教育首都に」を掲げ、住みたい街ランキング1位だけでなく「人が育つ街」としても1位を目指すとしている。マニフェストでは、第2子以降の保育料無償化や子ども医療費助成は継承したうえで、0〜2歳の課税世帯に残る第1子の保育料を無料にするとし、妊娠から就学までを一本につないで第1子から経済・産後ケア・保育・家事育児・教育を支援するとしている。学校は子どもが主体となるAI時代の学びの拠点にするとし、校則や行事について子ども自身が考え意思決定に参加する機会を増やすとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェストの重点政策「第1子から安心できる子育て都市へ」で、第2子以降の保育料無償化や子ども医療費助成などは継承する一方、0〜2歳の課税世帯では第1子の保育料負担が残るとして「第1子の保育料を無料にします」としている。「それだけでは足りません」として妊娠・出産・産後・0〜2歳・就学までを一本につなぎ、第1子からの経済支援、産後ケア、保育支援、家事・育児支援、教育支援を挙げる。学校教育では「学校を、子どもが主体となるAI時代の学びの拠点へ」として、国の学習指導要領等を踏まえて市と学校の権限でできるところから、校則や行事・学校生活のルールについて子ども自身が考え話し合い意思決定に参加する機会を増やすこと、AIも活用しながら自ら学びを選び計画し振り返る機会を増やすこと、地域や企業・大学など多様な人と学ぶ機会を増やすことを挙げている。少子化については、市内の婚姻件数が9,532件（2018年）から8,723件（2022年）へ約8%減ったとし、手当や補助など「お金の力だけ」ではなく「お金＋教育の力」で未来に希望を持ち所得が増えた若者が育つことで出生率が上がる福岡をつくるとしている。",
            url: ARAMAKI_MANIFESTO_URL,
          },
          {
            date: "2026-09-03",
            place: "記者会見",
            source: ARAMAKI_KAIKEN_SOURCE,
            text: "「福岡を世界の教育首都に」を掲げ、教育を中心とした新しい政治・産業の創出を訴えた。「AIの時代に、未来への希望や新しい仕事をさらに生み出していくための新しい教育を生みたい」と述べている。",
            url: ARAMAKI_TNC_URL,
          },
          {
            date: "2026-09",
            place: "記者会見",
            source: ARAMAKI_KAIKEN_MOVIE_SOURCE,
            text: "「福岡を世界の教育首都に」を掲げ、住みたい街ランキング1位だけでなく「人が育つ街」としても1位を取りたいと述べた。2018年から教育を中心に活動し学校現場に関わるなかで、子どもの孤立や孤独、不登校の問題を目の当たりにしたとしている。AIが知識や情報処理を担う時代に、既存の正解を覚える暗記型の教育では自分の知っている世界に閉じ込められて可能性を発揮できないとし、自分がどのような認識の仕組みを通して世界を見ているのかを一人ひとりが理解し、固定された観点に縛られずに新しい価値を見出せる人を育てる教育が必要だと述べた。教育コンテンツは全国・世界から公募し、行政が恣意的に選ぶのではなく審査基準と審査プロセスを公開して透明性を保って審査するとし、教育としての価値と事業としての価値を分けて評価するとしている。対象はまず民間を通じて大人から子どもまでとし、公教育での必要性も感じているとした。",
            url: ARAMAKI_KAIKEN_MOVIE_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "誰もが自らの存在理由を確信し、孤独や不安を解消できる「心のインフラ」を福岡から示すとしている。マニフェストでは、家賃の上昇で住み続けられなくなる状況を避けて住宅確保が難しい人を支援し、高齢になっても住み慣れた地域で暮らせるよう、介護人材の確保、認知症支援、見守り、在宅医療と介護の連携を進めるとしている。福岡市の単独世帯は52.0%で全国平均38.1%を大きく上回るとして、孤立しない安心とつながりを両立する地域づくりを掲げる。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェストの重点政策「住み続けられ、高齢になっても自分らしく暮らせる福岡へ」で、家賃の上昇で住み続けられなくなる状況を避け、住宅確保が難しい人を支援するとしている。高齢になっても住み慣れた地域で暮らせるよう、介護人材の確保、認知症支援、見守り、在宅医療と介護の連携を進めるとする。理念③「プライバシーとつながりの両立で、自主防災・孤独無縁の福岡」では、福岡市は2軒に1軒が一人暮らしの街で単独世帯は52.0%（2020年国勢調査）と全国平均の38.1%を大きく上回るとしつつ、都会の気楽さはこの街の魅力で否定する必要はないとし、プライバシーかつながりかの二択ではなく両立を目指すとしている。子ども・若者の教育と大人の学び直しを含む生涯学習を校区の公民館で提供し、学ぶほどに人とつながる仕組みにするとしている。",
            url: ARAMAKI_MANIFESTO_URL,
          },
          {
            date: "2026-08",
            place: "公表資料",
            source: ARAMAKI_SOURCE,
            text: "トランスジェンダー当事者として差別や分断の根本原因と向き合い、認識技術nTechに出会う。誰もが自らの存在理由を確信し、孤独や不安を解消できる「心のインフラ」を福岡から世界へ示す、としている。",
          },
          {
            date: "2026-09-03",
            place: "記者会見",
            source: ARAMAKI_KAIKEN_SOURCE,
            text: "「心と心がしっかりと繋がりあう。そんな心のインフラモデルとして福岡をさらに再開発していきたい」と述べた。またトランスジェンダーであることを明かしたうえで「誰もが挑戦できる社会を作りたい」としている。",
            url: ARAMAKI_KBC_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "AIで活用できるものを活用したうえで、さらなる交通インフラの整備を進めるとしている。マニフェストでは、交通データを活用してAIによる信号制御を最適化し、自動運転バスやオンデマンド交通は安全性を最優先に実証するとしている。ライドシェアは国の制度に沿って安全と料金の透明性を確保し、交通空白地から進めるとする。地域の人間関係を、公共ライドシェアなどの共助型交通につなげるとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェストの重点政策「AIで交通を最適化し、移動しやすく安全な福岡へ」で、交通データを活用しAIによる信号制御を最適化するとし、自動運転バスやオンデマンド交通も安全性を最優先に実証するとしている。ライドシェアは国の制度に沿って安全と料金の透明性を確保し、交通空白地から進めるとする。理念③では、「買い物に行きたい」「病院まで行きたい」という人と地域で移動を支えられる人が安心してつながれる関係があれば、公共ライドシェアなどの共助型交通も機能しやすくなるとして、教育によって人間関係を良くすることを防災・見守り・子育て、そして移動の仕組みにまでつなげるとしている。",
            url: ARAMAKI_MANIFESTO_URL,
          },
          {
            date: "2026-09",
            place: "記者会見",
            source: ARAMAKI_KAIKEN_MOVIE_SOURCE,
            text: "教育以外の課題について問われ、交通問題については「AIで活用できるものをしっかり活用していく上で、さらなる交通インフラは整備していきたい」と述べた。",
            url: ARAMAKI_KAIKEN_MOVIE_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "マニフェストで「都心開発をやめるのではなく、第二の成長エンジンを加えます」とし、都心再生・企業誘致・スタートアップ政策は継承して、生まれた税収と雇用を市民生活へ還元するとしている。大型事業は整備量ではなく市民生活への効果を検証し、結果を公開するとする。これまでの建物・交通・企業環境への投資に、教育と人間の尊厳への投資を重ねる「都市開発＋教育経済」の二つの成長エンジンを掲げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェストの重点政策「成長の果実を、暮らしの実感へ」で、「都心再生、企業誘致、スタートアップ政策は継承し、生まれた税収と雇用を市民生活へ還元します。大型事業は、整備量ではなく市民生活への効果を検証し、結果を公開します」としている。第6章「都市投資に、尊厳と人間への投資を重ねる」では「都心開発をやめるのではなく、第二の成長エンジンを加えます」とし、これまでの投資の中心は建物・交通・企業環境で企業・人流・雇用・税収を生み出してきたのに対し、これからは教育・人間の尊厳と可能性に投資して新しい教育・事業・雇用・所得を生み出し、統合後は「都市開発＋教育経済」で暮らしと成長を相互に強化するとしている。「天神ビッグバン、博多コネクティッド、スタートアップ都市福岡。その次に、教育経済エンジンを重ねます」と結んでいる。",
            url: ARAMAKI_MANIFESTO_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "自治協議会の自主防災組織における自主防災活動への参加率を、第9次福岡市基本計画が目標とする25%まで引き上げるとしている（2024年度の実績は7.8%）。2005年の福岡県西方沖地震で助け合えたのは隣に誰が住んでいるかを知っていた人たちだったとして、災害時に最初に動くのは自治協議会を中心とした自主防災組織だとする。災害対策基本法と国民保護法の観点から、大規模災害や有事の際の避難所開設、情報伝達、高齢者や障がいのある人の支援、物資の配布、医療対応の体制を整えるとし、猛暑や豪雨への対策も挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェストの理念③「プライバシーとつながりの両立で、自主防災・孤独無縁の福岡」へのアップデートで、20年余り前の2005年の福岡県西方沖地震（福岡市で最大震度6弱）で助け合えたのは隣に誰が住んでいるかを知っていた人たちだったとし、災害時に最初に動くのは行政ではなく自治協議会を中心とした自主防災組織だとしている。そのうえで備えそのものも整えるとして、災害対策基本法と国民保護法の観点から、大規模災害はもちろん弾道ミサイルなど有事の際も想定し、避難所の開設、住民への情報伝達、高齢者や障がいのある人の支援、物資の配布、医療対応を、いざというときに滞りなく実施できる体制を整備するとする。自治協議会の自主防災組織における自主防災活動への参加率を、第9次福岡市基本計画が掲げる目標の25%まで引き上げるとし、2024年度の実績は7.8%で共助の取り組みはまだ十分にできていないとしている。重点政策「市民にも、訪れる人にも、快適な福岡へ」では、猛暑や豪雨への対策も進めるとしている。",
            url: ARAMAKI_MANIFESTO_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "「教育経済エンジン」を掲げている。評価された教育を学んだ人が自己資金に関わらず挑戦できる資金調達の仕組みをつくり、審査の設定と融資判断を分離したうえで金融機関・信用保証制度・創業支援・民間資金と接続するとする。学んだ人が新しい仕事や起業に挑むことで所得と雇用が生まれ、返済が次の人の教育資金へ循環する構想としている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "記者会見",
            source: ARAMAKI_KAIKEN_MOVIE_SOURCE,
            text: "評価された教育コンテンツを学んで新しい仕事や事業を生み出したい人が、自己資金に関わらず挑戦できる資金調達の仕組みをつくるとした。審査の設定と融資判断を分離したうえで、金融機関、信用保証制度、創業支援、民間資金と接続するとしている。学んだ人が変わってやる気が生まれ、新しい仕事や起業に挑むことで所得が上がり雇用が生まれ、返済されて次の人の教育資金へ循環する仕組みを「教育経済エンジン」と呼び、コンテンツ主導の新しい景気活性化エンジンとして進めるとした。立候補の理由として、福岡市は15〜29歳が全世代に占める割合が政令指定都市で最も高い水準にあるとし、「世界で一番、福岡にいる若者たちが元気な街を作りたい」と述べている。",
            url: ARAMAKI_KAIKEN_MOVIE_URL,
          },
        ],
      },
      fukushuto: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "マニフェストで「市民にも、訪れる人にも、快適な福岡へ」として、観光エリアのごみ箱増設、観光客の分散、混雑対策、多言語でのマナー周知、重点清掃を進めるとしている。宿泊税は、法人市民税の超過課税・事業所税とあわせて廃止を目指すとし、企業活動と観光産業を軽くするとする。効果が検証された教育プログラムを国内外に展開し、教育・宿泊・飲食・交通・文化体験・国際交流をつなぐ「教育観光」を福岡で具体化するとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェストの重点政策「市民にも、訪れる人にも、快適な福岡へ」で、観光エリアのごみ箱増設、観光客の分散、混雑対策、多言語でのマナー周知、重点清掃を進めるとしている。制度は「つくったか」ではなく必要な人が「実際に使えたか」で評価するとする。「教育経済エンジン」の項目H「教育を目的に、世界から人が来る福岡へ」では、教育観光を福岡で具体化するとして、効果が検証された教育プログラムの国内外展開を支援し、教育・宿泊・飲食・交通・文化体験・国際交流をつなぐとし、AIが真似できない教育を学んだ人々が教育コンテンツを提供しながら観光することで、お金が落ちるだけでなく福岡と日本の人へのリスペクトが増えていくことを目指すとしている。理念⑤では、宿泊税の廃止を目指すとし「企業活動と観光産業を軽くし、さらに稼げる街にする」としている。",
            url: ARAMAKI_MANIFESTO_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "「移民問題の土台にある出生率問題を解決する福岡」を掲げ、移民を受け入れるか排除するかの論争の土台にあるのは出生率だとして、福岡市の出生率1.20が変わらない限りどちらの立場を取っても働き手は足りないとしている。日本はこれまで外国人を人としてではなく人手として迎えてきたとし、摩擦の原因は迎える側の姿勢にあるとする。教育から手をつけて若者が未来に希望を持てるようにするとともに、この街で生まれ育った人も海を渡って来た人も同じように日本の文化を学べる場所を用意するとし、「排除でもなく、なし崩しでもなく、教育で解く」としている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェストの理念④「移民問題の土台にある出生率問題を解決する福岡」へのアップデートで、日本財団の調査では日本の若者が挙げた自国の重要課題の4位に「移民の増加」が入り、前回調査で12位だった回答率が約3倍の19.2%に増え、上位5項目に入ったのは6か国中で日本だけだとしている。日本はこれまで外国人を労働力不足の穴埋めとして、人としてではなく人手として迎えてきたとし、摩擦の原因は文化の違いそのものではなく迎える側の姿勢にあるとする。その不安の正体は外から来る人ではなく、日本人が減り続け日本人と日本文化が消えてしまうのではないかという不安だとして、「議論の順番が逆になっています。土台にあるのは出生率です。福岡市の出生率は1.20。ここが変わらないかぎり、どちらの立場を取っても働き手は足りず、論争だけが続きます」としている。だから教育から手をつけ、若者が未来に希望を持てるようになれば出生率は自然に上がるとし、同時に日本文化を誰もが理解できる仕組みをつくり、この街で生まれ育った人も海を渡って来た人も同じように日本の文化を学べる場所を用意するとする。「福岡はもともとアジアの玄関口です。排除でもなく、なし崩しでもなく、教育で解く。それが福岡の答えです」としている。",
            url: ARAMAKI_MANIFESTO_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "行政経験者ではないからこそ大きな発想で見直しができるとし、透明性を保って見える形にし、政治と民間・市民がつながる形を取りたいとしている。教育コンテンツの審査でも、行政が恣意的に選ぶのではなく審査基準と審査プロセスを公開するとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "記者会見",
            source: ARAMAKI_KAIKEN_MOVIE_SOURCE,
            text: "福岡県政の問題について問われ、行政の経験者ではないからこそ大きな発想で見直しができると述べた。「さらに透明性をしっかり保った上で、皆さんに見える形で、さらに分かりやすく、政治と民間・市民がしっかり繋がれる形を取っていきたい」としている。教育コンテンツの公募についても、行政が恣意的に選ぶのではなく審査基準と審査プロセスを公開したうえで審査するとした。",
            url: ARAMAKI_KAIKEN_MOVIE_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "「稼げる市民を増やして、市の税収を増やす福岡」を掲げ、増税か借金か他を削るかの三択ではなく、稼げる市民を増やして税収そのものを大きくする「四つ目の道」を取るとしている。徹底した行政評価による補助金のゼロベース見直し、公共施設マネジメント、委託費と外郭団体の改革で財源を確保したうえで、法人市民税の超過課税・事業所税・宿泊税の廃止を目指すとし、規模は約100億円で市の自主財源の約2%にあたるとする。「減税は目的ではなく、生み出す力が増えた結果です」としている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェストの理念⑤「稼げる市民を増やして、市の税収を増やす福岡」へのアップデートで、市政の議論はほとんどが「限られた予算をどう分けるか」で、増税か借金か他を削るかの三択でしか話さないから奪い合いになるとし、「私は四つ目の道を取ります。稼げる市民を増やして、税収そのものを大きくすることです」としている。福岡市民の平均所得は約400万円で政令指定都市20市の中では8位（令和7年度）だとして、AIが真似できない商品・サービス・職業・産業の創出と成長を市が全面的にバックアップし、学び直しの場を公民館に、立ち上げる力を創業支援に置くとする。生み出す側に回った人は納める側になり人を雇う側になるとし、増えた税収は医療にも介護にも子育てにも回せるとしている。そのうえで、徹底した行政評価による補助金のゼロベース見直し、公共施設マネジメント、委託費と外郭団体の改革によって財源を確保したうえで、法人市民税の超過課税、事業所税、宿泊税の廃止を目指すとし、規模は約100億円で市の自主財源の約2%にあたるとしている。「減税は目的ではなく、生み出す力が増えた結果です」としている。重点政策では、大型事業は整備量ではなく市民生活への効果を検証し、結果を公開するとしている。",
            url: ARAMAKI_MANIFESTO_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "マニフェストの出発点として「いま、福岡の若者に起きていること」を挙げ、福岡市の自殺死亡率は人口10万人あたり14.9で、2024年度の市立小中学校の不登校は5,770人だとしている。日本の17〜19歳は将来の夢や「自分の行動で国や社会を変えられる」と答える割合が6か国中最下位だとして、相談窓口や見守り、支援制度があっても数字が改善しないのは「根本に手が届いていないから」だとする。建物が世界水準になった次は「人が輝く都市1位」を目指し、何ができるかにかかわらず自分の存在に安心を持てる「尊厳基盤」を教育を中心につくるとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-03",
            place: "本人サイト",
            source: ARAMAKI_MANIFESTO_SOURCE,
            text: "マニフェスト第2章「いま、福岡の若者に起きていること」で、福岡市は若者の比率が政令指定都市20市と東京23区で日本一の街であり、日本の若者に起きていることが日本でいちばん濃く現れる街だとしている。福岡市の自殺者数は2020〜2024年の5年間で年平均約280人（2024年は238人）、自殺死亡率は人口10万人あたり14.9で、2024年は30歳未満が62人と全体の約26.1%を占めるとする。2024年度の市立小・中学校の不登校児童生徒は小学校2,492人・中学校3,278人の計5,770人で前年度から593人増え、本人や家庭だけの問題にせず学校・家庭・地域・福祉・医療をつないで支える必要があるとしている。日本財団の18歳意識調査（2026年4月発表）では、なりたい職業や学校で勉強する意味が「特にない」と答えた日本の若者の割合が他の5か国の6倍から20倍以上だとし、「相談窓口も、見守りも、支援制度もあります。それでも数字が改善しないのは、対策が足りないからではなく、根本に手が届いていないからです」としている。「はじめに」では、水道・電気・道路・交通・医療などの「生活基盤」は継承し、何ができるかにかかわらず自分の存在に安心を持ち自分の人生を自分で選べる「尊厳基盤」を教育を中心に開拓するとし、「住みたい街No.1」から「人が輝く街No.1」へと掲げている。",
            url: ARAMAKI_MANIFESTO_URL,
          },
        ],
      },
    },
  },
  {
    id: "niimura-masaru",
    no: "04",
    name: "新村 優",
    kana: "にいむら まさる",
    age: 46,
    title: "前福岡市議会議員（3期・南区）",
    party: "無所属（前・地域会派「新しい風ふくおか」）",
    lead: "「人への優しさ」と「都市経済の発展」の両輪を掲げる前福岡市議。政策集「ANSWER100」で8つの約束を示し、高島市政を継承しつつ「守りではなく新しい挑戦」として、都市の稼ぐ力で財源を確保し子どもたちに力強い土台を渡すとしている。",
    bioSource: `${NIIMURA_SITE_SOURCE}／${NIIMURA_KBC_SOURCE}／${SHIGI_JISHOKU_SOURCE}`,
    bio: [
      { label: "出身", text: "福岡市出身" },
      {
        label: "学歴",
        text: "福岡市立花畑小学校・柏原小学校、福岡市立柏原中学校、福岡大学附属大濠高校を経て、早稲田大学・早稲田大学院を卒業",
      },
      {
        label: "職歴",
        text: "アサヒビール株式会社に総合職として入社。横浜統括支社で飲食店や酒販店を担当する営業を務める",
      },
      {
        label: "職歴",
        text: "参議院議員大久保勉事務所の公設秘書、NPO法人次世代のチカラFUKUOKAの設立、スペクトラムアンドパートナーズ株式会社の取締役を経験",
      },
      { label: "2011", text: "福岡市議会議員選挙に立候補し落選（1,797票）" },
      {
        label: "2015",
        text: "福岡市議会議員選挙で初当選（6,287票）。当時34歳",
      },
      { label: "2019", text: "福岡市議会議員選挙で再選（7,591票）" },
      {
        label: "2023",
        text: "福岡市議会議員選挙で3選（6,555票）。地域会派「新しい風ふくおか」を設立",
      },
      {
        label: "2026",
        text: "福岡市長選への出馬の意向を表明。9月16日に市議を辞職",
      },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「人への優しさ」と「都市経済の発展」、この両輪のバランスのとれた福岡市政を目指すとしている。",
      },
      {
        label: "政治の役割",
        text: "「政治は一部の人たちのものではなく、社会全体1人ひとりの幸せを追求するために機能しなければなりません」とし、1人ひとりのチャレンジを応援すること、苦しみや絶望に支援を届けることが政治の本質的な役割だとしている。",
      },
      {
        label: "力を入れる分野",
        text: "交流人口の増加に伴う都市課題、地域防災、子どもの教育の3点に力を入れたいとしている。",
      },
      {
        label: "目指す市長像",
        text: "高島市長を「自らの力で周りを照らす、太陽のような市長」とし、自分にはカリスマ性も華やかさもないとして「大地のような市長」を目指すとしている。草木が根を張る大地が絶えず養分を送り続けるように、市民一人ひとりを絶えず応援できる市政を願うとする。",
      },
      {
        label: "行政への視点",
        text: "行政による市民への「共感力」が大切だとし、市民の生活実態や悩みに自ら寄って知ろうとする姿勢が必要だとしている。市長として最初に取り組みたいのは市職員との対話で、特に中堅・若手から聞きたいとする。「顧客満足のためには従業員満足が必要」という民間の考え方を引き、市職員が失敗を恐れずチャレンジできる環境づくりを挙げている。",
      },
      {
        label: "立場",
        text: "無所属で出馬し、政党からの推薦や支持は受けないとしている。一部の権限を持つ人や力のある政党が擁立するとパイプは増えるがその意向が強くなりがちだとし、「市民による市民の市長」が選ばれる時代を願うとする。",
      },
      {
        label: "ANSWER100",
        text: "政策集「ANSWER100」を専用サイトで公開している。「こどもたちの夢」「人への優しさ」「元気な地域」「まちづくり」「発展する都市」「都市防災力」「信頼の行政」「日本を牽引」の8つの約束に分け、それぞれに番号つきの個別政策を並べている。",
      },
      {
        label: "15年の土台づくり",
        text: "2040年に福岡市は170万人を超える一方、働く世代は今より4万人ほど減り75歳以上が急増するとして、「一人ひとりが稼ぐ力」「都市の稼ぐ力」を上げることから目を背けられないとしている。土台を築くのは今からの15年で、その経済基盤の上に「こどもの夢」「働く世代の挑戦」「高齢世代の安心」を乗せるとする。",
      },
    ],
    takashimaAssessment: {
      summary:
        "高島市長にもう一期やってほしいと思っていた一人だとし、不出馬表明の際の「次の世代にバトンをつなぐ」という言葉が出馬の決断を大きく動かしたとしている。16年のうち12年近くを議会から見てきたとして「アグレッシブなチャレンジの連続」「難しいと思われた決断の連続」と評価し、都市の成長を止めるわけにはいかないとする。政策集では「髙島市政を継承します。しかし、私の継承は『守り』ではなく『新しい挑戦』です」として、受け継いだ土台をもっと力強いものにするとしている。",
      updated: "2026年10月",
      log: [
        {
          date: "2026-10",
          place: "本人サイト",
          source: NIIMURA_ANSWER_SOURCE,
          text: "政策集の冒頭で「重荷を渡すのか。力強い土台を渡すのか。」と問いかけ、「髙島市政を継承します。しかし、私の継承は『守り』ではなく『新しい挑戦』です。受け継いだ土台を、もっと力強いものにする。都市の成長で、持続的に稼ぐ力を生み出す」としている。髙島市長を「先頭を走り、壁を破るリーダー」と評し、その突破力に「結集力」を加える全員野球が自分の政治だとして、「全員で走り、やり切るリーダー」を目指すとする。15年後に今の小学生が社会に出て170万人を支える側に回るとして、「こどもたちに誇れる未来」とは重荷を渡すことではなく、力強いまちの土台をつくって渡すことだとしている。",
          url: NIIMURA_ANSWER_URL,
        },
        {
          date: "2026-09-03",
          place: "報道",
          source: NIIMURA_KBC_SOURCE,
          text: "「高島市政の間に発展をしてきた福岡の町です。非常に元気な街と言われているこの福岡の都市なのでこの流れを止めるわけにはいきません」と述べている。",
          url: NIIMURA_KBC_URL,
        },
        {
          date: "2026-09",
          place: "記者会見",
          source: NIIMURA_KAIKEN_SOURCE,
          text: "「高島市長がもう一期されるものだと思っていたし、なんならもう一期やってほしいと実は思っていた一人です」と述べ、不出馬の表明を受けた時は頭が真っ白になり翻意を求めようかと思ったほどだとした。その際に高島市長が残した「次の世代にバトンをつなぐ」という言葉が「間違いなく私の心を大きく動かした」としている。16年のうち12年近くを議会という近い場から見てきたとし、「アグレッシブなチャレンジの連続」「なかなか難しいと思われた決断の連続」で、その一つ一つがあって今の福岡市があると評価した。市民が「もっと魅力的な街にするんだ」と思っているこの気運と都市の成長・発展を「止めるわけにはいかない」としている。市長像については、高島市長を「自らの力で周りを照らす、太陽のような市長のイメージ」とし、「私にはそんなカリスマ性も華やかさもないのでできません。私は大地のような市長になりたい」と述べた。草木が根を張る大地が絶えず養分を送り続けるように、市民一人ひとりの人生と幸せを絶えず応援できる市政を目指すと説明している。自らが伸ばすべき点としては、現場から声を集めて対話し問題を解決する道筋である「圧倒的な現場力」を挙げた。",
          url: NIIMURA_KAIKEN_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト", url: NIIMURA_SITE_URL },
      { label: "政策集（ANSWER100）", url: NIIMURA_ANSWER_URL },
      { label: "新しい風ふくおか", url: "https://atarashi-kaze.jp/" },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "niimuramasaru.com",
        url: NIIMURA_SITE_URL,
      },
      {
        kind: "X",
        handle: "@masaru_niimura",
        url: "https://x.com/masaru_niimura",
      },
      { kind: "YouTube", handle: "", url: "" },
      { kind: "TikTok", handle: "", url: "" },
      {
        kind: "Instagram",
        handle: "@niimuramasaru",
        url: "https://www.instagram.com/niimuramasaru/",
      },
      {
        kind: "Facebook",
        handle: "新村まさる",
        url: "https://www.facebook.com/profile.php?id=100005777466109",
      },
      {
        // 本人単独ではなく、共同で運営するポッドキャスト「ふくおかのたね」の
        // アカウント。本人サイトから発信媒体として掲載されている
        kind: "note",
        handle: "ふくおかのたね（共同運営）",
        url: "https://note.com/fukuokanotane",
      },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "8つの約束の1番目に「こどもたちの夢」を置き、不登校への支援は「あらゆる手法を駆使してでも」丁寧なケアとリチャレンジのサポートを徹底するとしている。妊娠時から成人までの切れ目のない支援、博多工業高校に併設される全国初の高校併設型「福岡市立高専」での15歳からの実践的な学び、部活動の位置づけ、学校給食への地場産食材と有機食材の導入検討を挙げる。結婚や出産を望む若者への応援にも取り組むとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束1「こどもたちの夢」で、「大きい夢、小さい夢、夢はいくつ持ったっていい」といつも子どもたちに伝えているとして、子どもが広い世界を知って多くの夢を描き、それを実現しようとする挑戦を応援し続ける市政を目指すとしている。個別政策として、学校に行けず悩みを抱える児童生徒とその家族が近年急増しているとして、教育行政の大きな課題の一つである不登校への支援に「あらゆる手法を駆使してでも、丁寧なケアとリチャレンジへのサポートを徹底して行います」とすること、この50年ほどで結婚や出産に関する価値観が大きく変わったとして多様な子育て支援施策を推進し「結婚して家庭を持ちたい」「こどもが欲しい」と思っている若者への応援にも取り組むこと、ネグレクト・虐待から子どもを守る取り組み、妊娠時から成人までの切れ目のない支援、子どもの「スマホ病」への対応、障がいのある子どもの夢の応援、探究的に学べる新たな郷土学習、博多工業高校に誕生する全国初の高校併設型「福岡市立高専」で中学卒業から5年間ITやものづくりを実践的に学べる場をつくり在学中から市内企業と関わらせること、思春期の大切な教育活動としての部活動、日本語が苦手な子どもへの支援、わんぱくに遊べる場所の確保、学校給食への地元の名物料理と地場産・有機食材の導入検討、学校教員を志す学生を増やす取り組みを挙げている。",
            url: NIIMURA_ANSWER_KODOMO_URL,
          },
          {
            date: "2026-09-03",
            place: "報道",
            source: NIIMURA_KBC_SOURCE,
            text: "交流人口の増加に伴う都市課題、地域防災、子どもの教育に力を入れたいとしている。",
            url: NIIMURA_KBC_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "8つの約束の2番目に「人への優しさ」を置き、行政による市民への「共感力」を掲げている。75歳以上人口と一人暮らし高齢者の急増に備え、市営住宅への入居支援、孤立死を防ぐ見守り、体調急変時の通報・救急体制の構築、救急車両の確保と救急指定病院との連携強化を挙げる。福祉を支えるエッセンシャルワーカーの処遇改善、家族を介護する家庭のケア、免許返納後の高齢者の足の確保、障がいのある人の挑戦の応援、ニセ電話詐欺の被害阻止も掲げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束2「人への優しさ」で、辛い状況でも前へ踏み出そうとする些細な一歩を見逃さず、豊かな共感力で強くない立場の市民をそっと支えられる市政を目指すとしている。個別政策として、75歳以上の高齢者人口がこの15年で急増し一人暮らし高齢者も同様に増えるとして、希望の多い市営住宅へ入居するための支援策、孤立死を防ぐ見守り、体調急変時の通報・救急体制の構築、救急車両の台数確保と救急指定病院との連携強化を挙げる。ほかに、働く世代の世帯収入の向上、女性ウェルネスへの社会の理解と配慮、重い障がいや病気を抱える家族への支援、インターネット上の言葉で苦しむ市民への対応、ペットと安心して暮らせる環境、福祉行政を支えるエッセンシャルワーカーの処遇改善、家族を介護する家庭へのケア、退職後の「働きたい」と生きがいへの支援、障がい者施設の手づくり商品の販売促進、ニセ電話詐欺の被害阻止、公共交通の便が良くない地域での免許返納後の足としてオンデマンド交通をはじめとする外出・活動支援の充実を挙げている。",
            url: NIIMURA_ANSWER_YASASHISA_URL,
          },
          {
            date: "2026-09",
            place: "記者会見",
            source: NIIMURA_KAIKEN_SOURCE,
            text: "「人への優しさ」について、行政による市民への「共感力」が大切だと述べた。市民が何を考え、何に悩み、何に苦しんでいるのか、その生活実態や働く実態に行政が自ら寄って知ろうとし、どういう気持ちになっているのかを受け止めることが今後ますます大切になるとしている。市議として10数年、数えきれない相談を受けてきたが解決が奏功しないこともあったとし、自分の力だけで挑戦できる人ばかりではない、周りに知られないところで苦しい思いをしている人がいるとして、その一つ一つに光を届ける姿勢が行政として大切だと述べた。「政治や行政は一部の人たちのためだけのものではなく、一人ひとりの人生と幸せを応援するためのもの」としている。",
            url: NIIMURA_KAIKEN_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "交通渋滞の解消を「積年の悲願」とし、就任から1年を目安に生活道路を含む市内全域の渋滞課題箇所を選定して緩和策をまとめるとしている。七隈線の6両化を最優先に進め、西鉄貝塚線と地下鉄箱崎線の直通運転を好機として東区・九大箱崎キャンパス跡地・都心を一本で結ぶとする。橋本駅〜姪浜駅と博多駅〜空港国際線の地下鉄延伸は、沿線のまちづくりと一体の構想を市民・議会と描いて任期中に決断するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束4「まちづくり」で、交通渋滞の解消は福岡市民の積年の悲願だとし、昼間人口・交流人口の増加に伴って交通に関する都市課題は益々大きくなっているとしている。都市計画道路整備の推進、右折車線等の整備、バスカット整備、新たなバイパスの検討、新たな公共交通の検討など、あらゆる側面から抜本的な緩和対策を検討するとし、就任から1年を目安に生活道路を含む市内全域の渋滞課題箇所を選定して具体策をまとめるとする。公共交通については、七隈線の6両化を最優先に進め、約30年動かなかった西鉄貝塚線と地下鉄箱崎線の直通運転の構想が動き始めたことを好機として、人口が増え続ける東区、九大箱崎キャンパス跡地、都心を一本で繋げるとしている。地下鉄の「橋本駅〜姪浜駅」「博多駅〜空港国際線」の両区間は今年度の調査を踏まえて検討するとし、新しいまちをつくる決断になるとして沿線のまちづくりと一体の構想を市民・議会と描き任期中に決断するとする。博多駅とウォーターフロントを結ぶ公共交通の議論、生活道路の安全確保と自転車事故対策、都心部の駐車場不足への対応（運送車両やエッセンシャルワーカーへの駐車サポート）、ジョギング・ウォーキングしやすい道路整備も挙げている。",
            url: NIIMURA_ANSWER_MACHI_URL,
          },
          {
            date: "2026-09",
            place: "記者会見",
            source: NIIMURA_KAIKEN_SOURCE,
            text: "発展する都市ならではの都市問題の一つとして街なかの交通渋滞を挙げ、その対策は「本当にこれ福岡市民にとっての悲願」だと述べた。",
            url: NIIMURA_KAIKEN_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "博多港ウォーターフロントを「力強い未来に欠かせないピース」とし、局ごとに個別に進んでいるように映る事業について早期に全体のグランドデザインを市民・議会に示すとしている。民間の投資意欲と知恵を引き出して市の将来負担を抑えながら、クルーズ・MICE・エンタメ・防災港湾機能が一体となったベイエリアを目指すとする。天神ビッグバン・博多コネクティッドに続くセカンドフェーズとして、大橋・西新・香椎などの副都心では緑地や広場、子育て世帯や高齢者の居場所といった地域が必要とするものへの貢献に応じて規制緩和を図るとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束5「発展する都市」で、MICE施策の観点から福岡サンパレスと福岡国際センターの建替え方針が示され、国内渡船・国外フェリー拠点の建替えや中央ふ頭の防災強化による埋立ての検討などが局所管ごとに個別に進んでいるように映るとして、早期に市民へ全体的なグランドデザインを示す必要があるとしている。アジアの都市間競争は待ってくれないとして、民間の投資意欲と知恵を最大に引き出し、市の将来負担を抑えながらクルーズ・MICE・エンタメ・防災港湾機能が一体となったベイエリアを目指すとする。あわせて、大博通りの歩道を活かした回遊のまちづくり、福岡城址・鴻臚館エリアでの歴史の演出、荒津大橋を「博多ベイブリッジ」と位置づける構想、都市公園の魅力的な再整備を挙げている。",
            url: NIIMURA_ANSWER_HATTEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束4「まちづくり」で、天神ビッグバンや博多コネクティッド、副都心の活性化を経て福岡市のまちづくりは「これからセカンドフェーズに入ります」とし、必要なのはまちづくりの視点に「人への優しさ」を加えることだとして、老若男女と障がいの有無を問わないインクルーシブな都心を目指すとしている。次は大橋・西新・香椎などの副都心だとし、「ビルを大きくするだけの開発ではありません」として、緑地や広場、子育て世帯や高齢者の居場所、災害時に身を寄せられる場所など地域が必要とするものを民間と一緒につくり、その貢献に応じて規制緩和を図るとする。ウォーターフロントについては、港の眺望を活用した海辺のにぎわいづくりと回遊交通施策を組み合わせた「ハーバーシティ構想」を掲げ、防災機能を備えた緑地とプロムナードを市民や子どもが海を楽しめる場所にするとしている。ビルの木質化・緑化で都心部にうるおいを持たせることも挙げる。",
            url: NIIMURA_ANSWER_MACHI_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "8つの約束の6番目に「都市防災力」を置き、警固断層が都心の真下を走ることや豪雨の脅威を挙げて「『想定できなかった』は、福岡市では許されません」としている。雨水管や貯水池の増強、冠水しやすい地域への対策、地下街・地下鉄の浸水対策の総点検で内水氾濫に備え、博多港は耐震強化岸壁を拡充して「防災港湾」にするとする。都心部の避難計画は民間ビルとも共有し、浸水センサーや人流データによるリアルタイム避難誘導を検討するとし、福岡市を九州広域の災害対応拠点に位置づけるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束6「都市防災力」で、能登半島地震や熊本地震、全国で頻発する豪雨災害を挙げ、常に防災を念頭においた行政運営を行う新時代の防災都市を目指すとしている。地域防災計画のリニューアルによる防災体制づくりや公的備蓄、災害関連死を起こさないための避難所運営に触れつつ、昨今の激甚災害の様相と交流人口の集中を考えるとさらに都市防災力を増す行政努力が必要だとする。個別政策として、未曽有の豪雨災害に対応できる計画、災害級の酷暑から命を守るため公園・通学路・バス停の日よけを増やし身近な場所に「クーリングシェルター」を広げること、水道管と水道設備の更新、自治会・町内会単位の防災力強化、ペットの安全を守る防災計画、キッチンカーとの防災協定、女性・高齢者目線の避難所運営、国より10年早い2040年の実質的カーボンニュートラルという野心的な計画の実現、博多湾・玄界灘の漁場の異変への対応、コンポストによる生ごみ堆肥化の推進、消防団の活性化を挙げている。",
            url: NIIMURA_ANSWER_BOUSAI_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集のトップページで、福岡市は「災害が少ない街」と言われてきたが警固断層は都心の真下を走り豪雨は年々脅威を増しているとして、「『想定できなかった』は、福岡市では許されません」としている。雨水管や貯水池の増強、冠水しやすい地域への対策、地下街・地下鉄の浸水対策を総点検して内水氾濫に備えるとし、博多港には耐震強化岸壁を拡充して海から物資と人を受け入れる「防災港湾」へと強化するとする。多くの人が集う都心部の避難計画は地震・豪雨などあらゆる災害に対応できるものに強化し、民間ビルとも避難計画を共有して、浸水センサー・人流データを活用したリアルタイム避難誘導策を検討するとしている。また福岡市を九州広域の災害対応拠点に位置付けるとし、「福岡市は、自らを守り、九州を守る司令塔に。それが、170万市民の安心と、福岡の次の成長の土台となります」としている。",
            url: NIIMURA_ANSWER_URL,
          },
          {
            date: "2026-09-03",
            place: "報道",
            source: NIIMURA_KBC_SOURCE,
            text: "交流人口の増加に伴う都市課題、地域防災、子どもの教育に力を入れたいとしている。",
            url: NIIMURA_KBC_URL,
          },
          {
            date: "2026-09",
            place: "記者会見",
            source: NIIMURA_KAIKEN_SOURCE,
            text: "人が集まることで生じる都市問題の一つとして都市災害を挙げ、昼間だけでなく夜も含め昼夜を問わない都市防災力の強化が必要だと述べた。",
            url: NIIMURA_KAIKEN_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "サービス業が9割を超える市の産業構造を前提に、サイエンステクノロジーなど専門性・高付加価値性の高い産業を市内に育てて所得を上げるとしている。スタートアップ支援は起業から上場まで達成できるフェーズに力を注ぎ、ソーシャルビジネスの資金調達はふるさと納税の支援制度を活用するとする。国際金融機能の強化、地場中小企業のICT・DX支援と海外進出支援、産学官連携による市内大学からの学生流出の抑制、エッセンシャルワーカーの処遇改善、一次産業の魅力向上と収入確保を挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束5「発展する都市」で、福岡市が元気な都市と言われるのはハード・ソフト両面でチャレンジ施策を重ねてきたからだとし、その成長を止めず加速させるのは市民の生活支援に必要な財源を確保していくためだとしている。「福岡市は昔から、産業が育たない」という声があるとして、サービス業が9割を超える現在の市場を前提に高付加価値な産業誘致を図って所得を向上させることが大切だとし、TSMCの熊本進出を契機に国内外からサイエンステクノロジー企業が集積しやすい環境整備を進めるとする。個別政策として、地場中小企業へのICT・DXサポート、技術者・IT人材・専門職・エッセンシャルワーカーの人手不足に対し市内の大学などと連携した人材育成と市内企業への輩出、ふるさと納税の支援制度を活用したソーシャルスタートアップの資金調達支援と上場までの支援強化、福岡の「食」産業の振興と新名物を生み出す取り組み、農業・漁業の魅力向上と収入確保、地場企業の海外ビジネス進出をMOUで応援する施策、福岡空港の直行便都市を増やすためのFIACとの連携、特区制度を活用した「国際金融都市」の推進を挙げている。",
            url: NIIMURA_ANSWER_HATTEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集のトップページで、都市の成長に伴う地価・家賃の上昇と全国的な物価高騰が多くの市民の生活に影響を与えているとして、市民所得の向上とそのための企業・都市の活力推進が「市民の幸せの応援」には欠かせないとしている。9割を超えるサービス業の成長支援に加え、サイエンステクノロジーなど専門性・高付加価値性の高い産業を市内に育て、スタートアップ支援は起業してから上場まで達成できるフェーズに力を注ぎ、国際金融機能を強化して国内外の企業が新たなビジネスを興しやすい環境を推進するとする。人材不足については専門人材の育成・集積に加え、産学官が連携して市内大学からの学生流出の抑制策を打ち出すとし、福祉を支えるエッセンシャルワーカーの処遇改善、一次産業の魅力向上と収入確保にも取り組むとしている。約束2では、都市の発展に伴う地価・家賃の上昇と物価高騰で若者を中心に周辺都市への流出が既に起きているとして、「働く世代の収入を上げる」ことを喫緊の課題に挙げている。",
            url: NIIMURA_ANSWER_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都について「大事なのは都市の『見え方』ではありません。福岡市の未来にとって、何が良いかです」とし、首都の替わりを担える防災力と交通網や、人・企業がチャレンジしやすい規制緩和などを国の予算で整える好機にするとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束8「日本を牽引」の「福岡が『副首都』になるとどうなる？」で、「副首都、まだよく分からないですよね。10月中には、国から具体的なアウトラインが示されることになっていますが、大事なのは都市の『見え方』ではありません。福岡市の未来にとって、何が良いかです」としたうえで、首都の替わりを担える防災力と交通網や、人・企業がチャレンジしやすい規制緩和などを国の予算で整える好機にするとしている。",
            url: NIIMURA_ANSWER_KENIN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "オーバーツーリズムと、民泊施設に宿泊する外国人の行き過ぎた行為への苦情を都市課題に挙げ、宿泊税を活用して対策を講じるとしている。ホテルの宿泊キャパシティ向上の現状を踏まえ、民泊の在り方も議論するとする。「陸の博多駅」「海の博多港」「空の福岡空港」で九州の「ハブシティ」機能を高めるとし、伝統文化・芸能の発信拠点化、海外から注目されるアート・芸術都市、夜もにぎわうまちづくり、グルメイベントの充実も掲げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-03",
            place: "報道",
            source: NIIMURA_KBC_SOURCE,
            text: "交流人口の増加に伴う都市課題、地域防災、子どもの教育に力を入れたいとしている。",
            url: NIIMURA_KBC_URL,
          },
          {
            date: "2026-09",
            place: "記者会見",
            source: NIIMURA_KAIKEN_SOURCE,
            text: "発展する都市ならではの課題としてオーバーツーリズムの問題を挙げた。",
            url: NIIMURA_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束4「まちづくり」で、福岡市が直面している都市課題の一つがオーバーツーリズムの問題だとし、民泊施設に宿泊する外国人の行き過ぎた行為に迷惑しているという声もよく聞かれるとして、宿泊税を活用して様々な対策を講じるとしている。ホテルの宿泊キャパシティ向上の現状を踏まえ、民泊の在り方についても議論するとする。「陸の博多駅」「海の博多港」「空の福岡空港」で九州の玄関口としての役割を持つとして、道州制など九州全体で発展していく発想による将来的な行政統治機構の転換も見据え、「ハブシティ」としての機能を高めるとしている。ほかに、伝統文化・芸能の発信拠点化、海外から注目されるアート・芸術都市、都心部の元気を市内広くに届けることを挙げる。約束5では、歴史の大通りを旅する街にすること、福岡城址・鴻臚館エリアでの歴史の演出、日本一グルメイベントが開催される街、夜も人でにぎわうまちづくり、福岡空港国際線の直行便都市を増やすことを挙げている。",
            url: NIIMURA_ANSWER_MACHI_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "在住外国人と地元住民のトラブルを発展する都市ならではの課題に挙げ、ささいな生活トラブルから対立や排他感情の増幅へ発展することも十分に考えられるとしている。在住外国人とかかわりの深い専門学校や勤め先の企業などと連携してマナーの啓発や指導の徹底を図り、トラブルの未然防止に取り組むとする。複数の局に分かれている国際施策・外国人施策を総合的に進めるため、「国際局」の編成を検討するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束2「やさしさ」の「地域と外国人居住者の生活トラブル」で、「全国の自治体の在住外国人トラブルがよく報道されていますが、福岡市においても対岸の火事ではありません」とし、ささいな生活トラブルから対立や排他感情の増幅へと発展することも十分に考えられるとしている。在住外国人とのかかわりの深い専門学校や勤める企業などと、マナーの啓発や指導徹底の連携強化を図り、トラブルの未然防止に取り組むとする。約束8「日本を牽引」では、海外都市との関係を束ねる総務企画局、海外企業の誘致などを手掛ける経済観光文化局、外国人による地域トラブルの相談窓口となる市民局など、国際関連施策を複数の局が分担して所管しているとして、国際施策・外国人施策を総合的・効果的に進めるため「国際局」の編成を検討するとしている。",
            url: NIIMURA_ANSWER_YASASHISA_URL,
          },
          {
            date: "2026-09",
            place: "記者会見",
            source: NIIMURA_KAIKEN_SOURCE,
            text: "発展する都市ならではの課題として、在住外国人と元々住んでいる地元住民とのトラブルが散見されることを挙げた。",
            url: NIIMURA_KAIKEN_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "「日本一、声を集める市長」「日本一、声が集まる行政」を掲げ、市内150ほどの全小学校区で毎年「Voiceミーティング」を行って市政への声を集めるとしている。市民への共感力を高めて市民と行政の信頼関係をつくるとし、市職員が失敗を恐れずチャレンジできる環境づくりと、職員の活躍をPRする人材採用戦略を挙げる。県議会・県政の問題を受けた市の管理職アンケートで質問の代理作成や議員からの高圧的行為が報告されたとして、「過度におもねる市政は必要ありません」と述べ、二元代表制として適切な関係を求めるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束7「信頼の行政」で、議員としての11年半で多くの市民と市職員の双方と密に接してきたとし、市政運営に最も大切なのは両者の信頼関係だとしている。個別政策として、「日本一、声を集める市長」「日本一、声が集まる行政」の実現に取り組むとして、福岡市の150ほどの小学校区すべてで毎年、市政に関する声を集める「Voiceミーティング」を実施するとする。市民への共感力を少しでも高めれば市民と行政の信頼関係はもっと良くなるとし、福岡市行政の課題を市民と共有すること、市職員のチャレンジ意欲を引き出し失敗を恐れず挑戦できる環境を醸成すること、職員の活躍をPRする人材採用戦略を挙げる。市議会との関係については、県議会・県政の不適切問題を受けて市役所管理職へのアンケートが実施され、質問の代理作成や議員からの高圧的行為が報告されたとして、市民の代表である議員は尊重すべき存在だが「過度におもねる市政は必要ありません」とし、二元代表制として適切な関係が求められるとしている。市職員の不祥事については、福岡市役所の信頼を失墜させる極めて重い責任を自覚するガバナンス強化に取り組むとする。約束3では、町内会の公式LINEなどデジタルツールの活用サポートの強化も挙げている。",
            url: NIIMURA_ANSWER_GYOSEI_URL,
          },
          {
            date: "2026-09",
            place: "記者会見",
            source: NIIMURA_KAIKEN_SOURCE,
            text: "市長になったらまず何に取り組みたいかを問われ、市の職員との対話を第一に考えたいと述べた。特に中堅・若手と言われる職員から聞きたいとし、各局で今何が課題で何を優先して進めるのかを自ら把握したいとしている。民間企業での経験から「顧客満足のためには従業員満足がまず必要」という考え方を引き、市民の満足のためには市職員の満足も大事になるとした。市職員がチャレンジを生み出す機会が柔軟に生まれる行政であればもっとチャレンジングな市政ができるとし、失敗を恐れずに思い切ってやれる環境をどう作るか声を聞いてみたいと述べている。",
            url: NIIMURA_KAIKEN_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "都市の成長を加速させる理由を「福岡市民の生活支援に必要な財源を確保していくため」だとし、2040年に働く世代が4万人ほど減り75歳以上が急増するなかで、給料・雇用と暮らしを支える財源に正面から向き合うことが次の市長に求められる覚悟だとしている。国際金融都市の推進を持続的な歳入増に重要な施策の一つに挙げる。人口270万人ほどの「福岡都市圏」での広域連携で無駄を減らし、行政シナジーを生み出すとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束8「日本を牽引」で、「福岡都市圏」は福岡市を含む10市7町で構成され規模は人口270万人ほどだとして、人口減少が進むなかで自治体が広域に連携して無駄を減らし行政シナジーを生み出すことが益々大切だとし、連携体制や事業構築を積極的に働きかけるとする。約束5では、特区制度を活用した「国際金融都市」の取り組みを福岡市の持続的な歳入増に重要な施策の一つに挙げている。",
            url: NIIMURA_ANSWER_KENIN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集のトップページで、2040年に福岡市は170万人を超える都市になる一方、働く世代は今より4万人ほど減り75歳以上人口は急増すると言われているとして、「170万人の人生と幸せを支え続けるには、『一人ひとりが稼ぐ力』『都市の稼ぐ力』を上げることから目を背けることはできません。給料、雇用、そして暮らしを支える財源。ここに正面から向き合うことが、次の市長に求められる覚悟です」としている。約束5では、成長を止めず加速させるのは「この先も、福岡市民の生活支援に必要な財源を確保していくため」だと説明している。",
            url: NIIMURA_ANSWER_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "8つの約束の3番目に「元気な地域」を置き、過渡期にある自治協議会制度のもとで地域の世話役を次の世代にどうバトンタッチするかが重大な課題だとして、行政としてできる限りの支援策を講じるとしている。地域ボランティア人材とのマッチング、地場メディアとの「地域活性化協定」、会議の時短事例の共有、地域行事の開催支援、父親の地域デビューの応援を挙げる。少子化は「未婚率」「晩婚化」「世帯所得」を挙げて出生数の増に向けた本格的な議論を進めるとし、民間企業の実証事業を受け入れる「mirai@」を加速させて全国の社会課題の解決をリードするとしている。福岡県議会の問題については、吊し上げで終わらせず、全国の地方行政・地方議会が自らを見つめ直す機会ではないかとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09",
            place: "記者会見",
            source: NIIMURA_KAIKEN_SOURCE,
            text: "発展する都市ならではの課題として、物価上昇と地価の高騰によって日頃の生活が苦しくなっていることを挙げた。福岡県議会の問題については、自身は金銭の授受を要求されたことはないとしたうえで、あってはならないことで政治への信頼の失墜にまで至る大事だとしつつ、「そこを吊し上げさえすれば、感情的に満足さえすればいいのか。ここで終わってはいけない」と述べた。全国の地方行政・地方議会が自らを振り返り、市民や県民に胸を張って管理運営ができているのかを見つめ直すための機会ではないかとしている。",
            url: NIIMURA_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束3「元気な地域」で、校区単位で自治活動を展開する「自治協議会」制度が大きな過渡期を迎えているとし、多世代が集まって楽しく活動でき、地域に笑顔があふれる福岡市を目指すとしている。多くの校区・町内が地域の世話役を次の世代にどうバトンタッチするかという重大な課題に直面し、一部の人たちだけで負担を分かち合っていることも多いとして、行政としてできる限りの支援策を講じるとする。個別政策として、町内・校区と地域ボランティア人材とのマッチングサポート、地場メディアと「地域活性化協定」を結んで校区・町内の取り組みが広く報道される体制づくり、地域の功労者に行政がもっと光を当てること、コロナ禍以降減っている地域行事の開催支援の拡充、「会議が多い・長い」という不満への時短事例の共有、町内会の公式LINEなどデジタルツールの活用サポート、父親が「地域デビュー」しにくい構造的課題への対応を挙げる。自治活動は「支え合い」「助け合い」であり地域活動は「民主主義の根幹」だとしている。",
            url: NIIMURA_ANSWER_GENKI_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NIIMURA_ANSWER_SOURCE,
            text: "政策集の約束8「日本を牽引」で、少子化については「助け合う社会」を前提とする社会保障の構造を考えると国家の持続的運営を困難にするほど大きな社会課題だと認識しているとし、「未婚率」「晩婚化」「世帯所得」を挙げて出生数の増に向けた本格的な議論を進めるとする。ほかに、民間企業から社会課題解決の実証事業の提案を受ける市の仕組み「mirai@（ミライアット）」を加速させて全国の社会課題の解決をリードすること、九大箱崎キャンパス跡地のまちづくりで水素パイプラインを敷設し日本で初めて住宅への供給を始める実証を進めて国へ提言する準備を重ねることを挙げている。",
            url: NIIMURA_ANSWER_KENIN_URL,
          },
        ],
      },
    },
  },
  {
    id: "shirabe-takashi",
    no: "05",
    name: "調 崇史",
    kana: "しらべ たかし",
    age: 48,
    title: "前福岡市議会議員（4期・城南区）",
    party: "無所属（前・自由民主党福岡市議団）",
    lead: "「令和の自治体経営のモデル」を掲げ、政策の決定理由から成果検証までを可視化するとしている。高島市政の都心機能更新は継承しつつ、支店経済からの産業転換を訴える。",
    bioSource: `${SHIRABE_KAIKEN_SOURCE}／${SHIRABE_SITE_SOURCE}／${SHIRABE_FBS_SOURCE}／${SHIGI_JISHOKU_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1978年、福岡市生まれ。城南区在住。福岡市立七隈小学校、福岡市立梅林中学校（生徒会長・サッカー部）、福岡県立修猷館高校（生徒会長・応援団長）を経て、2002年に九州大学法学部を卒業",
      },
      {
        label: "2002",
        text: "TNCテレビ西日本に入社し、報道記者などとして8年間勤務。記者時代に4年ほど市外へ転勤したほかは、これまでのほとんどを城南区で過ごしたとしている",
      },
      {
        label: "2011",
        text: "32歳で福岡市議会議員選挙に初当選。2026年9月まで4期15年務めた",
      },
      {
        label: "所属",
        text: "自由民主党福岡市議団。市議として15年間、教育・子ども関連の常任委員会に所属してきたとしている",
      },
      {
        label: "地域活動",
        text: "金山小学校前PTA会長。消防団員、保護司、花みずき通り商店会の相談役も務めている",
      },
      {
        label: "2026",
        text: "9月4日に自由民主党福岡市議団の会合で候補者として指名を受け、9月11日に出馬表明の記者会見。9月16日に市議を辞職",
      },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「信頼は政治の礎」として、信頼がないところに政治は成り立たないと述べている。市民との信頼関係を築き、それを持続可能なものにするとしている。",
      },
      {
        label: "最大の柱",
        text: "「令和の自治体経営のモデル」をつくるとしている。福岡市が模範となって県政にあるべき姿を示し、信頼回復を後押しすることを最初の仕事にするという。",
      },
      {
        label: "目指すもの",
        text: "「成長を豊かさに」を掲げ、成長戦略を立てたうえで、その豊かさを街の隅々で暮らす人にまで行き渡らせたいとしている。",
      },
      {
        label: "広がり",
        text: "福岡市で生まれた成功事例を政令市、中核市、一般市町村へと広げ、「福岡から日本を変える」としている。",
      },
      {
        label: "立場",
        text: "出馬は無所属の見込みで、自由民主党の推薦はしかるべき時期に申請するとしている。",
      },
      {
        label: "10の提案",
        text: "公式サイトで「福岡の未来 10の提案」として、子育て・企業・若者・所得・住まい・交通・九州・アジア・街の質・市役所の10分野の方向性を示している。「まちづくりの正解は一つじゃない」として、この提案を出発点に市民の声を聞きながら具体化するとしている。",
      },
      {
        label: "政策集",
        text: "「成長を、豊かさに。」と題した政策集（全8ページ）を公式サイトで公開している。「もっと大きな夢を、成長と豊かさを、みんなで描こう。」を掲げ、子育て支援・物価高対策・力強い経済・渋滞の緩和・高齢者の暮らしを前面に出している。",
      },
      {
        label: "4つのビジョン",
        text: "政策集の冒頭で、①「集める福岡」から「支える福岡」に（九州の人口減少を見据える）、②成長を、豊かさに（成長の実感をみんなの暮らしに）、③政治への信頼を、取り戻す（令和の自治体経営モデル）、④福岡から、日本を変える（小さな成功事例から）の4点を示している。",
      },
    ],
    takashimaAssessment: {
      summary:
        "都心部の機能更新を一気に進めた手腕、厳しい情勢の中で街が明るかったこと、福岡の知名度を高め市民が誇りに思える街になったことの3点を評価するとしている。天神ビッグバンは看板政策として継承するとしつつ、市議としては市政運営に厳しい意見も述べてきたとし、それは議会と首長の緊張関係が働いた結果だと説明している。",
      updated: "2026年9月",
      log: [
        {
          date: "2026-09-11",
          place: "記者会見",
          source: SHIRABE_KAIKEN_SOURCE,
          text: "高島市政の評価を問われ、「都心部の機能更新を一気に進めたというこの手腕、これは評価をしなければいけない」「とにかく街が明るかった。世界では戦争も起きて、コロナもありました。大変な情勢だったけど、なんとなくずっと明るかったということは一つの功績」「福岡の知名度をとても高めた。福岡で生活しておられる皆さんが、なんかちょっと誇りに思えるな、自分の暮らせる街を自慢に思えるなという感じになったのはとてもいいこと」と述べた。また「16年の高島市政の最大のレガシーは福岡市の知名度が格段に上がったこと」「福岡市から日本を変えていくんだという素地はもう作っていただいた」としている。一方、市議として市政運営に厳しい意見を述べてきたことについては「議会と首長の適切な関係、緊張関係がしっかり働いていたからこそ起きた反応」とし、高島市長は著名で人気があるため「ややもすると議会が引っ張られる、存在感をなくす」ことから「それは違うんだ」と自分に言い聞かせてきた、市長を支える会派に属しながらも厳しく意見を述べるのは「自分の役割だと思って自分に課してきた」と説明した。",
          url: SHIRABE_KAIKEN_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト", url: SHIRABE_SITE_URL },
      { label: "政策集（全8ページ）", url: SHIRABE_POLICY_BOOK_URL },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "t-shirabe.net",
        url: SHIRABE_SITE_URL,
      },
      { kind: "X", handle: "", url: "" },
      {
        kind: "YouTube",
        handle: "調たかしの生きる道",
        url: "https://www.youtube.com/@%E8%AA%BF%E3%81%9F%E3%81%8B%E3%81%97%E3%81%AE%E7%94%9F%E3%81%8D%E3%82%8B%E9%81%93",
      },
      { kind: "TikTok", handle: "", url: "" },
      {
        kind: "Instagram",
        handle: "@takashi_shirabe",
        url: "https://www.instagram.com/takashi_shirabe/",
      },
      {
        kind: "Facebook",
        handle: "takashi.shirabe",
        url: "https://www.facebook.com/takashi.shirabe",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "政策集の05「子育て・教育」で「子どもの成長を、切れ目なく支える。」を掲げる。保育と幼児教育を重視した環境づくり、学校給食での地産地消と地場農水産業の育成、高校進学時の進学ニーズ調査と公教育の役割の整理、特別支援教育の高等部の役割の広報啓発、先生が子どもと向き合う時間を増やす人員増強、放課後の学び・体験の充実（親の所得に関係しない制度設計）、過大規模校・過小規模校対策、いじめ・不登校・虐待への対応力強化、「子どもの脱貧困」に向けたひとり親支援、多胎児のいる世帯への支援拡充などを挙げる。市が独自に高専を設ける構想も引き継ぐとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "市議として15年間ずっと教育・子ども関連の常任委員会で仕事をしてきたとし、子育てと教育の予算拡充に取り組むと表明。とりわけ子どもの貧困を強調し、「子どもの貧困の脱却というのは、おそらく福岡市民共通の願いだ」と述べた。また市が独自に高専を設ける構想について、高度経済成長期に高専が工業系人材を送り出した役割に触れ、福岡市には工業高校はあるが高専はないとしたうえで、市が打ち出す産業を支える人材供給として引き継ぎたいとしている。",
            url: SHIRABE_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_SITE_SOURCE,
            text: "「福岡の未来 10の提案」の01「子育て」で「子どもたちの安心を広げる。」を掲げ、保育・教育だけでなく家庭環境や放課後までを含めるとして「保育・教育環境の充実」「放課後支援の強化・子どもの脱貧困」を挙げている。03「若者」では、若者が集まるだけでなく福岡に残って夢をかなえられる環境をつくるとし、「魅力ある仕事・産業の創出」「学び・挑戦の機会の拡充」を挙げる。",
            url: SHIRABE_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の05「子育て・教育」で「子どもの成長を、切れ目なく支える。たくましく人生を経営できるよう。」を掲げ、子どもの初期の人格形成において保育や幼児教育は極めて重要な役割を果たすとしている。義務教育では障がいを持つ子どもへの手厚い支援がある一方、高校の年次になると急に途切れることも大きな課題だとし、まずは進学のニーズを的確に把握するとする。個別政策として、保育と幼児教育の果たす役割を重視した環境づくりの支援、学校給食における地産地消の推進と食を通じた地場農水産業の育成、高校進学時における進学ニーズ調査の実施と公教育の役割の整理、特別支援教育の高等部が果たす役割の広報啓発、学校で先生が子どもと向き合う時間を増やすための人員増強、放課後の学び・体験の機会の充実（親の所得に関係のない制度設計）、過大規模校・過小規模校対策のスピードアップ、いじめ・不登校・虐待への対応力強化、青少年の薬物乱用を防止する啓発活動の強化、「子どもの脱貧困」に向けたひとり親支援などの強化、双子など多胎児がいる世帯への支援拡充を挙げている。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "政策集の06で「『防災・減災』を新しい基軸に福祉のまちづくりを総点検。」を掲げ、災害関連死ゼロを合言葉にした避難計画づくり、災害時を考慮した医療的ケア児と家族への支援、高齢者の孤立・見守り対策、認知症になっても暮らせる地域づくり、障がいのある人の活躍推進と所得の向上、看護・介護・障がい者福祉の人材確保と定着、市民病院の移転に伴う夜間救急などの機能強化を挙げる。過疎地や農山漁村、玄界島・小呂島などの離島、高齢化が進んだ団地のような「都市型限界集落」へ優先して届けるとし、単身高齢女性世帯の増加を社会保障の観点から注視するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "豊かさを優先して届ける先として、過疎地、農山漁村、離島振興法上の離島である玄界島や小呂島、そして地元・城南区の団地のように高齢化率が高くなった「都市型限界集落」を挙げた。女性の寿命が長いことから単身高齢女性世帯が増える傾向があるとし、社会保障の観点から注視しなければならないとしている。「おひとりさま」という生き方を選んだ人に今の子育て支援中心の施策がどう映っているかにも関心があり、調べたうえで必要があれば何かしたいとも述べた。一方で「打ち出の小槌を福岡市が持っているわけではない」として財源の限界を認め、市民が「市政がこっちを見てくれているな」と感じられる瞬間を増やすところから始めたいとしている。",
            url: SHIRABE_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_SITE_SOURCE,
            text: "「福岡の未来 10の提案」の05「住まい」で「年齢を重ねても住み慣れた地域で。」を掲げ、住宅価格や家賃と市民の所得のバランスを重視するとして「宅地の価格高騰の抑制」「運転免許がなくても暮らせるまちに」を挙げ、人生100年時代の医療・福祉も大切にするとしている。04「所得」では「社会保障の維持拡充・中小企業の成長支援」を挙げる。",
            url: SHIRABE_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の06「暮らしの安心」で、災害の危険が迫ったときにどこへどう逃げるか、そのときの暮らしはどうなるかという不安を解消するのは日常からの備えだけだとし、「防災・減災」を新しい基軸に福祉のまちづくりを総点検するとしている。個別政策として、災害時を考慮した医療的ケア児と家族への支援強化、障がいのある人の活躍推進と所得の向上、高齢者の孤立・見守り対策の強化、認知症になっても暮らせる地域づくりと社会環境整備、災害関連死ゼロを合言葉にした避難計画づくりの促進、市民病院の移転に伴う夜間救急などの機能強化と地域医療の堅持、看護・介護・障がい者福祉の人材確保と定着につながる施策、オーラルケア28プロジェクトをはじめ歯科衛生の向上、学校や地域における動物愛護教育の推進を挙げる。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "地下鉄七隈線の6両化の早期実現と、南区方面も含めた延伸の検討を掲げる。西鉄貝塚線と地下鉄箱崎線の直通運転化、井尻地区の高架化の早期実現も挙げる。渋滞は軽微な交差点改良で効果が見込まれるポイントから優先的に改善するとし、大胆なインフラ投資と公共交通ネットワークの強化で着実に解消するとしている。オンデマンド交通による生活交通の確保も進めるとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "地下鉄七隈線の6両化を早期に実現したいとし、延伸の検討についても市長が考えを示しているとしてしっかり引き継いで検討するとした。地下鉄箱崎線から西鉄貝塚線への直通運転もできるだけ早期に行いたいとしている。渋滞については、1日15分の通勤ロスが年間120時間（労働8時間換算で15日分）にあたると試算したうえで、右折帯・左折帯の設置といった交差点の軽微な改良だけで解消するケースがあるとし、東浜ランプのような大規模な工事も必要としつつ「まず小さなところで効果が出そうなものを探してみたい」と述べた。",
            url: SHIRABE_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_SITE_SOURCE,
            text: "「福岡の未来 10の提案」の06「交通」で、地下鉄・バスなど交通手段の接続を改善して渋滞と混雑を減らすとし、「積極的な投資による交通インフラの利便性向上」「道路・交差点の改修」を挙げている。",
            url: SHIRABE_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の08「都市基盤・防災・街の質」で、日々の暮らしから時間を奪っていく渋滞や、心がすり減るバスや電車の車内混雑などは、大胆なインフラ投資と公共交通ネットワークの強化で着実に解消するとしている。個別政策として、地下鉄七隈線の6両化の早期実現と南区方面も含めた延伸検討、西鉄貝塚線と地下鉄箱崎線の直通運転化、井尻地区高架化の早期実現、鉄道・路線バス・シェアサイクルなどを含めた交通結節の強化、軽微な交差点改良で効果が見込まれる道路渋滞ポイントの優先的改善、整備が遅れている都市計画道路の早期検討と着手、橋梁・立体道路の影響評価と災害対策の強化、オンデマンド交通による生活交通確保の推進を挙げる。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "天神ビッグバンと博多コネクティッドによる都心の機能更新を高島市政の看板政策として継承するとしている。一方で、新たに生じる大量のオフィス床や商業床を埋められなければ都心部から市経済全体の地盤沈下もありうるとし、次の市政の課題だとする。容積率を上乗せする「天神ビッグバンボーナス」については、文化芸術の活動や発表の場を設けた建物にも与える考え方を提案している。政策集では、副首都誘致を都心創生の起爆剤とし、天神ビッグバンの規制緩和を参考に大橋・西新・香椎など副都心の機能更新を進め、高さ制限や容積率規制の緩和を検討するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "天神ビッグバンを高島市政の看板政策とし、博多コネクティッドとともにすでに動き出した都心の機能更新の流れを継承するとした。ただし今後さらに大きな量のオフィス床や商業床が生じるとし、「万が一次の市政で取り組みを間違ってしまうと、都心部からの福岡市経済全体の地盤沈下も考えられなくはない」と警戒を示し、次の市政の課題だとしている。「民間が作ったから行政は知りませんよということでは済まされない」とも述べた。容積率を上乗せする「天神ビッグバンボーナス」のルールについては、文化芸術の活動や発表の場を設けた建物にも与える考え方を提案したことがあるとし、市の要綱で整理できるので柔軟に考えてよいとしている。すでに計画が決まっているものはしっかり進めるが、まだ計画が出ていないものを促進するかは慎重に考えてよいとした。",
            url: SHIRABE_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の01「産業・新産業」で、副首都誘致を都心創生の起爆剤とし、天神ビッグバンの規制緩和を参考に、次は大橋・西新・香椎など副都心の機能更新を進めるとしている。ウォーターフロント地区の魅力にも磨きをかけるとし、個別政策として、天神ビッグバンや博多コネクティッドで生まれる都市機能の価値の最大化、副都心エリアにおける高さ制限や容積率規制の緩和などの検討、ウォーターフロント地区の整備促進とMICE振興、市街化調整区域を活用した賑わいや生活利便性向上の促進を挙げる。07「生活・住まい」では宅地価格・住宅価格の高騰抑制対策、空き家の多様な活用の推進と住宅ストックの有効活用を挙げている。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "政策集の08で、橋梁インフラは大災害を想定した影響評価を進めるとし、土砂災害特別警戒区域の砂防対応の加速、河川の改修工事の推進、避難所の確保といったハード面に加え、防災備蓄の分散化、日頃からの「近所関係の積み重ね」や避難所運営訓練などのソフト面の対策も強化するとしている。災害関連死ゼロのまちを目指すことを新しい基軸に掲げる。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_SITE_SOURCE,
            text: "「福岡の未来 10の提案」の06「交通」で「災害に強い快適なまち。」を掲げ、「防災・減災の取り組みを強化」するとしている。10の提案は出発点で、市民の声を聞きながら具体的な政策へ磨き上げるとしている。",
            url: SHIRABE_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の06「暮らしの安心」で、土砂災害特別警戒区域の砂防対応の加速、河川を溢れさせないための工事や避難所の確保などのハード面はもちろん、防災備蓄の分散化、日頃からの「近所関係の積み重ね」や避難所運営訓練などのソフト面の対策も強化するとしている。個別政策として、県が担う砂防事業の早期着手と早期完了に向けた協議促進、集中豪雨に備えた河川改修工事の推進と避難先の確保、防災備蓄の地域拠点化と避難所運営訓練の推奨、災害関連死ゼロを合言葉にした避難計画づくりの促進を挙げる。08「都市基盤」でも、老朽化対策・防災対策は着実に進めるとし、特に橋梁インフラは大災害を想定した影響評価を進めるとしている。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "産業政策の大転換を掲げている。第三次産業が9割近くを占める支店経済都市からの脱却として「理系の仕事」＝製造業を産業の一角に据えるとする。大学の研究を事業化する「スタートアップ＋」として都心にインキュベーション施設を設け、売上1000億円規模の企業を生み出すことを目標に挙げる。AI・半導体・バイオ・金融・GX・コンテンツを重点産業とし、半導体ファブレスなど先端企業の誘致、新設予定の高専での先端分野教育、就職氷河期世代も対象にしたリスキリング支援制度の創設、九州全体の成長戦略を福岡から描くことも示している。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "福岡市は大企業の九州支店や中央省庁の出先機関が集まる支店経済都市で、第三次産業が9割近く（全国平均は7割ほど）を占める一方、特徴的な産業がないと指摘。「知識創造型産業の振興」という表現が30年ほど変わっていないとし、川が短く平地も少ないため工場に恵まれず第二次産業に舵を切れなかった経緯を説明したうえで「そろそろ変えていくことが必要」と述べた。分かりやすく「理系の仕事」をつくるとして製造業を産業の一角に据えるとしている。FUKUOKA GROWTH NEXTの取り組みは継続しつつ、「スタートアップ＋」として都心にインキュベーション施設を設け、大学の研究室が1〜2年の期限で入れ替わりながら入居し、大企業の関係者や目利き、投資家と日常的に触れ合える機会をつくることで事業化のサイクルを早めるとした。目標として売上1000億円の企業を生み出すことを挙げている。また本社機能は天神や博多の都心に置き、製造は都市圏の周辺市町で担う形を描く必要があるとし、半導体設計などのファブレス企業の誘致、副首都構想への継続した取り組みにも言及した。",
            url: SHIRABE_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_SITE_SOURCE,
            text: "「福岡の未来 10の提案」の02「企業」で、農林水産業からサービス業まであらゆる産業の付加価値を高め、支店経済型の産業構造の転換に挑戦するとして「スタートアップ・副首都構想の推進」「製造業の創業と本社機能の立地促進」を挙げている。04「所得」では、企業が稼ぎ働く人の所得が増える好循環をつくるとして「所得・賃金の向上」「社会保障の維持拡充・中小企業の成長支援」を挙げる。07「九州」では、九州各市町村との連携強化と、産業・人材・物流の広域連携を挙げている。",
            url: SHIRABE_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集で「力強い成長戦略を描く。」として4分野を挙げている。01「産業・新産業」では、都心に設けたインキュベーション施設で大学の研究が事業化・製品化のチャンスと触れ合う機会を創設し、大学発ベンチャーを都心に数多く生み出すとして「売り上げ1000億円企業の創造」を目標に掲げ、製造拠点は福岡都市圏にとする。半導体ファブレスなど国内外の先端企業誘致、AI・半導体・バイオ・金融・GX・コンテンツを重点産業に、中小企業の新規事業や海外展開への挑戦支援、町工場のモノづくりを育てること、クリエイティブ・エンタメ・アート産業の振興、農林水産業とアカデミアの連携強化を挙げる。02「人材・若者」では、新設予定の高専における先端分野特化の教育と大学・大学院などの高度な研究への接続、企業版ふるさと納税の活用提案、FGNと大学との連携推進による学生起業の活性化、スタートアップ支援の継続、高卒未満の働く若者や就職氷河期世代の学び直しを柱とするリスキリング支援制度の創設、意欲ある若者による事業承継を「第二創業」のチャンスにすること、就職氷河期世代のチャレンジ応援を挙げる。03「産業と役所の生産性」では、農林水産業や製造業でのフィジカルAI活用の実証実験、耕作放棄地を活用した陸上養殖など農山漁村の「稼ぐ力」を伸ばす資源活用、中小企業・小規模事業者のAI・DX・省力化の伴走支援、「共通キャッシュレス決済機能」の構築による支援の継続的・効率的な実施、分離分割発注の活用などによる働き手の所得向上と地場事業者の受注機会の増加を挙げる。04「九州・アジア」では、九州の成長戦略を福岡から描くとして、九州産の農林水産品のブランド力向上と販路拡大、半導体・造船・観光など国の重点指定を受けた産業における広域連携推進、九州企業の「福岡・アジア」への展開拠点づくり、九州各地の産業の成長に資する資金調達や技術革新の支援（「スタートアップ＋」への特例的な参加など）を挙げている。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都機能の誘致に「前のめりの姿勢で取り組んでいきたい」としている。天神ビッグバンや博多コネクティッドで増えるオフィス床に副首都機能を呼び込むことが都心の新たな成長エンジンになるとし、働く世代が減るなかでオフィス需要を生み出す策の一つに位置づける。政策集では副首都誘致を都心創生の起爆剤とし、「スタートアップ・副首都構想の推進」を産業構造の転換策に挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-26",
            place: "YouTube",
            source: SHIRABE_YT_SOURCE,
            text: "動画「第13話 副首都機能の誘致について」で、東京一極集中は首都直下地震や南海トラフ地震を想定すると日本全体のリスクだとし、7月に成立した副首都に関する法律の目的を、国の機能の継続性の確保と多極分散型経済の形成だと説明している。候補として北海道・愛知・大阪・福岡の4つが残っていると言われているとし、副首都に指定されれば首都圏のバックアップや多極分散化に必要な交通・都市基盤、大学・人材育成、創業・雇用、民間投資・税制の措置を国が支援する考え方だとする。天神ビッグバンや博多コネクティッドで生じたオフィス床に副首都機能を呼び込むことが都心の新たな成長エンジンになるとして、「副首都機能の誘致については前のめりの姿勢で取り組んでいきたい」と述べている。",
            url: SHIRABE_YT_FUKUSHUTO_URL,
          },
          {
            date: "2026-10-24",
            place: "YouTube",
            source: SHIRABE_YT_SOURCE,
            text: "動画「第12話 福岡市中心部で起きることへの対策」で、天神ビッグバンの主要11プロジェクトで床面積が建て替え前の46万平方メートルから95万平方メートルへ倍増する一方、福岡市の働く世代は2030年の107.7万人をピークに減り始めるとして、オフィス需要の維持を課題に挙げている。対策として半導体ファブレス企業の誘致などとともに副首都機能の積極的な誘致を挙げ、市内での引き抜きではなく新しいものでオフィス需要を生み出すことが大事だとしている。",
            url: SHIRABE_YT_TOSHIN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の01「産業・新産業」で、副首都誘致を都心創生の起爆剤とし、天神ビッグバンの規制緩和を参考に、次は大橋・西新・香椎など副都心の機能更新を進めるとしている。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_SITE_SOURCE,
            text: "「福岡の未来 10の提案」の02「企業」で、支店経済型の産業構造の転換に挑戦するとして「スタートアップ・副首都構想の推進」を挙げている。",
            url: SHIRABE_SITE_URL,
          },
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "産業政策の説明のなかで、副首都構想への継続した取り組みに言及した。",
            url: SHIRABE_KAIKEN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "九州とアジアをつなぐ経済・交流拠点として、国際ビジネス・観光・MICEの推進と魅力的な観光資源の開拓・創造を挙げている。政策集では、宿泊税を活用した観光資源の充実と宿泊施設の魅力向上、インバウンド客などのマナー啓発強化と「規律ある共存」への転換、福岡発・九州の観光ゴールデンルートの形成、福岡空港・博多港の国際ゲートウェイ機能の強化、福岡城・鴻臚館・元寇防塁などの歴史遺産の活用推進を示している。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_SITE_SOURCE,
            text: "「福岡の未来 10の提案」の08「アジア」で、九州とアジアをつなぐ経済・交流拠点として世界から選ばれる福岡を目指すとし、「国際ビジネス・観光・MICEの推進」「魅力的な観光資源の開拓・創造」を挙げている。09「街の質」では、古い街並みも大切にし、緑・水辺・歩道・公園・地域の居場所に投資して暮らしの質で選ばれる都市を目指すとしている。",
            url: SHIRABE_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の08「都市基盤・防災・街の質」で「品格を大切に。」を掲げ、福岡は古くから大陸の玄関口として栄え長い交流の歴史が独特の風土を育んできたとして、寺社仏閣や歴史遺産を大切にし、盛んなアジアとの交流や若者が生み出す文化・芸術の新たな息吹を育ててまちの品格に磨きをかけるとしている。個別政策として、福岡城・鴻臚館・元寇防塁などの歴史遺産の活用推進、音楽や演劇等の練習や発表スペースの充実とアーティストの支援、宿泊税を活用した観光資源の充実と税源である宿泊施設の魅力向上、インバウンド客などのマナー啓発強化と「規律ある共存」への転換、公園の良好な管理と街路樹をはじめ緑を大切にするまちづくりを挙げる。04「九州・アジア」では、福岡発・九州の観光ゴールデンルートの形成、福岡空港・博多港の国際ゲートウェイ機能の強化、姉妹都市交流をはじめ福岡市と海外のネットワーク強化、九州の食とコンテンツを福岡から世界の市場へ、を挙げている。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      dx: {
        stance: "表明済み",
        summary:
          "「令和の自治体経営のモデル」を最大の柱に掲げている。政策をなぜ実施するのかという理由、誰が決定し提案したのか、どういう議論があったのかを記録として残し、成果の検証までできる状態にすることを目指すとする。「ガバナンスの話を抜きに政策は語れない」として、県政の混乱を踏まえた危機感から打ち出している。政策集では「政策の中身が見える」「検討の過程が見える」「成果が見える」の3点を示し、AI導入で窓口などの待ち時間を大幅に短縮し、まちと市役所を民間の新技術・新サービスの実証フィールドにするとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "「令和の自治体経営のモデルをつくってまいろうということです。福岡市が模範となって、県政に自治体経営のあるべき姿を示して、信頼回復を後押しして、最初の仕事として私がやっていきたい」と述べた。具体的には、課題の内容を分析して政策を決定していく過程で、なぜそれをやろうとしたのかという理由、誰が決定し提案したのか、どういう議論があったのかを明らかに残し、成果も検証できる状態にしておくことが大事だとしている。ワンヘルス関連事業を例に、市民が「なぜこの政策にお金が使われているのか、誰が決めたのか、成果はどうなのか」を調べても出てこないことが不信につながっていると指摘し、「今回に限ってはガバナンスの話を抜きにして自分自身が政策を語ることはできない」と述べた。",
            url: SHIRABE_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_SITE_SOURCE,
            text: "「福岡の未来 10の提案」の10「市役所」で「信頼が見える福岡市政。」を掲げ、政策の検討から決定、成果まで信頼を可視化して「なぜ決めたのか」「効果はどうなのか」がいつでも分かるようにするとして、「政策プロセスの見える化」「市議会・市民の意見反映」を挙げている。",
            url: SHIRABE_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の03「政治・信頼」で、「令和の自治体経営モデル」の基本的な考え方として「政策の中身が見える」「検討の過程が見える」「成果が見える」の3点を示し、一連の政策プロセスを聖域なく透明化することで信頼のかたちが見えるモデルを速やかに構築するとしている。福岡市は県政において最も多くの人口を抱える自治体であり最大の税源だとして、信頼回復を求める市民の声は確実に届けるとする。03「産業と役所の生産性」では、市民にとって大きなストレスになる行政サービスの待ち時間を短縮し、コスト削減にもAI・DXを活用するとし、事業者と伴走支援をする市役所も民間に先駆けて「試してみる」側に回るとしている。個別政策として、窓口対応をはじめとする市役所業務の「市民体験」の向上と「待ち時間」の大幅短縮（AI導入による）、まちと市役所を民間の新技術・新サービスの実証フィールドに、民間の優れた提案にタイムリーに共鳴する市役所へ、を挙げる。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
          {
            date: "2026-09-11",
            place: "報道",
            source: SHIRABE_FBS_SOURCE,
            text: "出馬会見について報じ、「令和の自治体経営のモデルをつくってまいろうということです。福岡市が模範となって、県政に自治体経営のあるべき姿を示して、信頼回復を後押しして、最初の仕事として私がやっていきたい」との発言を伝えている。",
            url: SHIRABE_FBS_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "人口減少を見越した「身の丈に合った投資」を掲げ、「打ち出の小槌を持っているわけではない」として財源の限界を認めたうえで、インフラ投資には積極的に取り組むとしている。市県民税のうち相当の割合が県に納められている点を挙げ、税の使われ方に疑念があれば市として意見を述べる立場だとする。政策集では、市税収入4,263億円（過去最高見込み）と法人市民税の前年度比8.2%増を挙げ、成長の実感を過疎地や困難を抱える人たちに届けるためにも成長戦略に磨きをかけるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "市県民税のうち市に入る分より少なくない割合が県に納められているとし、福岡市が県政最大のステークホルダーである以上、税の使われ方に市民が疑念を持つ場合にはきちんと言わなければならない立場だと述べた。財源については「打ち出の小槌を福岡市が持っているわけではない」として限界を認めつつ、インフラ投資には積極的に取り組むとしている。",
            url: SHIRABE_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の02「福岡市・成長」で「数字で見る福岡のいま（令和8年度見込み）」として、人口167万人＋（2026年度推計）、市税収入4,263億円（過去最高見込み）、法人市民税＋8.2%（前年度比）を挙げている。成長の輪郭は誰の目にも見えているのに自分の暮らしには届いてこないという声があるとして、過疎地や農山漁村、離島、中心部から離れた地域、困難を抱える子どもたちやその家族、障がいを持つ人たち、年老いた人たちに成長の実感を着実に届けるとし、そのためにも成長戦略にはさらに磨きをかけるとしている。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: `${SHIRABE_SITE_SOURCE}（市議としての活動目標）`,
            text: "市長選の公約ではなく市議としての活動目標として、人口減少を見越して「身の丈に合った投資」を行うべきだとし、博多駅からウォーターフロント地区を結ぶロープウェイ構想のように投資によって得られる効果が不明確な事業については厳しく吟味するのが市議会の役割だとしている。",
            url: SHIRABE_SHIGI_POLICY,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "福岡県政の混乱について、市長になっても傍観しないとしている。福岡市は県政最大のステークホルダーだとし、疑惑の徹底した真相解明と再発防止を求める立場を示す。市議会では「福岡県政に対する信頼の回復を求める決議」を自ら起案し、9月2日に全会一致で可決された。政策集では生活コストを抑えて住み続けられる福岡を掲げ、宅地・住宅価格の高騰抑制、若者の「最初の住まい」と子育て世帯の市内住み替え支援、単身高齢者の民間賃貸入居の支援と孤立死の防止に向けた見守り、食料品の価格抑制策の調査検討、エネルギー価格高騰の影響を受ける事業者への支援継続を挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-11",
            place: "記者会見",
            source: SHIRABE_KAIKEN_SOURCE,
            text: "県政の混乱について、福岡市長の職を拝命することになったら決して傍観しないと述べた。福岡市が福岡県政における最大のステークホルダーであるとし、疑惑の徹底した真相解明と再発防止をしっかり求めていくとしている。県民が怒っているのは信頼の崩壊だとし、「信頼がないところには政治は成り立たない」と述べた。",
            url: SHIRABE_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: SHIRABE_POLICY_SOURCE,
            text: "政策集の07「生活・住まい」で「生活コストを抑え、住み続けられる福岡に。価格の上昇を『仕方ない』で終わらせない。」を掲げている。福岡の魅力は首都圏と比べて家賃をはじめ生活コストが低いことだが、地価や建設コストの上昇で共働きの世帯が市外の都市圏市町に住まいを求める傾向もあるとし、人生の段階に応じて住まいを選べる都市の姿を目指すとする。個別政策として、宅地価格・住宅価格の高騰抑制対策、若者の「最初の住まい」と子育て世帯の市内住み替えの支援、単身高齢者の民間賃貸入居の支援と孤立死等の防止に向けた見守り、「おひとりさま」を選択した人たちの行政サービスのニーズ把握、空き家の多様な活用の推進と住宅ストックの有効活用、オンデマンド交通による生活交通確保の推進、シルバー・ハロウィンなど高齢者が主役のイベント推奨、生産や流通段階における食料品の価格抑制策の調査検討、エネルギー価格の高騰の影響を受ける事業者等への支援継続、電気や水素を動力とするモビリティーの普及促進にかかる設備の充実、地球温暖化防止に向けた再生可能エネルギーの活用やリサイクルの促進を挙げる。なお政策集の最終ページでは、平和台陸上競技場の歴史に触れ、スポーツ・歴史・文化・自然・芸術が融合する「スタジアムパーク」を誕生させたいという考えも示している。",
            url: SHIRABE_POLICY_BOOK_URL,
          },
          {
            date: "2026-09-05",
            place: "ブログ",
            source: SHIRABE_SITE_SOURCE,
            text: "自ら起案した「福岡県政に対する信頼の回復を求める決議」が9月2日の福岡市議会本会議で全会一致で可決されたとし、賛成討論の全文を掲載している。県政の問題として高額な海外出張、正副議長の就任パーティーへの支出、ワンヘルス関連事業への不透明な公費支出、正副議長の選任にあたる多額の現金授受疑惑を挙げ、いずれにも自由民主党所属の県議会議員の関与が指摘されていることを「痛恨の極みであり、慚愧に堪えません」としている。",
            url: SHIRABE_BLOG_KENSEI,
          },
        ],
      },
    },
  },
  {
    id: "inoue-kiyoshi",
    no: "06",
    name: "井上 潔",
    kana: "いのうえ きよし",
    age: 56,
    title: "行政書士・元国土交通省職員",
    party: "減税日本 公認",
    lead: "地域政党「減税日本」の公認で、市民税5%減税と市長の年収800万円・退職金ゼロを掲げる。高島市政で伸びた財政を、行政が配るのではなく減税で市民の手取りに戻すとしている。",
    bioSource: `${INOUE_SITE_SOURCE}／${INOUE_KAIKEN_SOURCE}／${INOUE_YOMIURI_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1970年、福岡市生まれ。東区在住。福岡県立香椎高等学校、福岡大学法学部法律学科を卒業",
      },
      {
        label: "1993",
        text: "運輸省（現・国土交通省）九州運輸局に入省。国土交通省海事局への出向をはさみ、約27年勤務",
      },
      {
        label: "2020",
        text: "早期退職。日本福祉大学福祉経営学部（通信）などで学び直し、産業カウンセラー・行政書士・精神保健福祉士の資格を取得",
      },
      {
        label: "2023",
        text: "いのうえきよし行政書士オフィスを設立。立候補にあたり新規の受任は止めているとしている",
      },
      {
        label: "2025",
        text: "第五期 河村たかし政治塾（基礎課程・特別コース）を修了",
      },
      {
        label: "2026",
        text: "9月14日、減税日本の公認で出馬表明の記者会見。選挙に出るのは初めて",
      },
    ],
    claims: [
      {
        label: "市民税5%減税",
        text: "市民税を5%減税するとしている。行政が集めて配るのではなく、はじめから取りすぎずに市民の手元に残すという考え方で、「福岡伸びた。さあ、今度は市民の手取りを伸ばす」と述べている。",
      },
      {
        label: "市長の年収",
        text: "市長の年収を800万円とし、退職金は受け取らないとしている。市長になればすぐに条例で出せるとし、市議会議員の報酬も市民並みにするよう求めていくという。",
      },
      {
        label: "政治の非家業化",
        text: "政治家の家業化・長期化が行政とのなれ合いを生むとして、その打破を掲げる。年収800万円・退職金なしとすることが、自らも長く務めない歯止めになるとしている。",
      },
      {
        label: "強み",
        text: "福岡市生まれ・福岡市育ちであること、国土交通省での行政経験、お金もコネもない代わりにしがらみがないことの3点を挙げている。",
      },
    ],
    takashimaAssessment: {
      summary:
        "福岡がこれだけ発展したのは大きな功績だとし、評価は「今の福岡市民の方と一緒」と述べている。一方で、発展の恩恵は交通や保育の無償化などを通じて間接的には戻っているものの、直接戻るのはお金だとして、市政を引き継ぐというより減税で市民に戻すことを新たにやりたいとしている。",
      updated: "2026年9月",
      log: [
        {
          date: "2026-09-14",
          place: "記者会見",
          source: INOUE_KAIKEN_SOURCE,
          text: "高島市政の評価を問われ、ほぼ16年福岡にいて「最初の頃に比べるとすごい」「福岡がこれだけ発展したっていうのはかなり大きい功績」と述べ、「評価はもう今の福岡市民の方と一緒です」とした。一方で、発展した分が市民に返ってきているかという体感では、交通体系や保育の無償化などを通じて間接的には返ってきているが、直接返ってくるのはお金だとし、「高島市政を引き継ぐというわけではない」「新たにやっていきたい」と述べた。4期16年については、謙虚にできる人ならよいが自分はそういうタイプではないとして「僕の性格からちょっと長い」と述べている。",
          url: INOUE_KAIKEN_URL,
        },
        {
          date: "2026-09-14",
          place: "報道",
          source: INOUE_YOMIURI_SOURCE,
          text: "出馬会見について報じ、「高島市政で福岡は伸びた。伸びてできたお金を市民に戻すことを減税でしっかりやっていきたい」との発言を伝えている。",
          url: INOUE_YOMIURI_URL,
        },
      ],
    },
    links: [
      { label: "減税日本 候補予定者紹介", url: INOUE_SITE_URL },
      {
        label: "報道（NHK）",
        url: "https://news.web.nhk/newsweb/na/nb-5010035334",
      },
    ],
    sns: [
      { kind: "公式サイト", handle: "", url: "" },
      { kind: "X", handle: "", url: "" },
      { kind: "YouTube", handle: "", url: "" },
      { kind: "TikTok", handle: "", url: "" },
      { kind: "Instagram", handle: "", url: "" },
      {
        kind: "Facebook",
        handle: "井上潔",
        url: "https://www.facebook.com/people/%E4%BA%95%E4%B8%8A%E6%BD%94/pfbid0EeQofgVSdpZsnVTCiWNL8X9Wgh1AdqonV6RXHEVCQwfCo1fdYBYDzqf5NE1G4Zgol/",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "「1人の子も死なせない福岡」として、高校入試の廃止への挑戦と、スクールカウンセラーの常勤化を掲げる。子どもの悩みは学業によるものが大きいとし、市立中学校に名古屋市のように常勤のスクールカウンセラーを置きたいとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "減税日本が名古屋で掲げる「1人の子も死なせない名古屋」を福岡に置き換え、「1人の子も死なせない福岡」として高校入試廃止への挑戦を掲げた。子どもの悩みはいじめだけでなく学業によるものが大きいと統計に出ているとし、スクールカウンセラーやスクールソーシャルワーカーできちんとフォローしたいとした。スクールカウンセラーについては、名古屋市が行っているように市立中学校に常勤で配置したいと述べている。自身も中学生の頃は机に30分も向かえない子どもだったとし、「辛い子どもにとっては机の前にいるっていうだけでも辛い」と述べた。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "高齢者の外出は元気の源だとし、高齢者乗車券や乗り合いタクシーなど今ある制度をどうすれば使いやすくなるかを考えるとしている。買い物は楽しみなので、買い物バスをもっと網の目のように走らせる交通も考えたいとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "高齢者の外出は元気の源になるとし、福岡市は高齢者乗車券の増額や乗り合いタクシーを充実させているものの、自分の母親も使っていなかったりするとして、どうすれば使いやすくなるかを考えたいと述べた。買い物は楽しみなので、買い物バスをもう少し網の目のように走らせるような交通も考えたいとしている。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "九州運輸局での経験から交通を重視し、朝夕の渋滞などストレスのない通勤を掲げる。地下鉄箱崎線と西鉄貝塚線の乗り入れは東区の悲願だとして進めるとし、課題は乗り入れる車両とホームにあるとする。開かずの踏切は、市長でなければ国や事業者と直接話し合えないとして取り組むとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "東区から会見場まで車で1時間ほどかかったとし、交通渋滞の対策は高島市政もかなり積極的に取り組んでいると評価したうえで、東区に住む立場から地下鉄箱崎線と西鉄貝塚線の乗り入れは「本当に悲願」だとして進めたいと述べた。乗り入れの一番の課題は車両の問題で、西鉄側のホームをどう延ばすか、車両を増やせるかを挙げている。JR鹿児島本線の混雑にも触れた。道路については、朝夕のラッシュ対策として右折レーンをきちんとつくるなど、できるところからやりたいとしている。市の中心から離れると「開かずの踏切」もあるとし、市長でなければ国や事業者と直接話し合えないとして取り組みたいとした。南区の渋滞対策は引き継ぐとしつつ、自分は東区のことしか実感としては分からないため、他の区は選挙期間中に回って声を聞きたいと述べている。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "天神ビッグバンは防災の面では必要で、強固な街になったとする一方、幼いころから天神に親しんだ立場から、昔はあたたかみがあったとも述べ、「天神が面白くなくなった」という声もかなり聞くとしている。なじめるようにしていきたいとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "天神ビッグバンの評価を問われ、以前の地震でビルのガラスが落ちたことに触れて防災の面では必要だったとし、その面ではかなり強固になったと述べた。一方で、幼いころから天神にいる立場から、天神がどうかと言われると「微妙」だとし、昔はあたたかみがあったと述べた。できたばかりでなじむまで時間がかかるのかもしれないとしつつ、「天神面白くなくなったなっていう声もかなり聞きます」とし、なじめるようにしていきたいとしている。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      bosai: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      keizai: {
        stance: "表明済み",
        summary: "「アジアの首都・福岡」を目指すとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "福岡はもっとアジアの首都になれるとして「アジアの首都・福岡」を目指すと述べた。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都構想については、その先に上海を超えるような街づくりにつながるなら利用するが、副首都そのものが目的ではなく、副首都も含めた「アジアの首都」になることを目的にしたいとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "副首都構想について問われ、その先に上海を超えるような街づくりができるなら利用しながら進めるが、副首都が目的ではなく、それも含めたアジアの首都になることを目的にしたいとしている。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "「福岡城を蘇らせる」として、天守閣があったかどうかも含めてまだ調査の段階だとしたうえで、まず調査の予算を立てるとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "「福岡城を蘇らせる」として、福岡城の天守閣があったかどうかは調査の段階だとしたうえで、まず調査から、しっかり予算を立てて進めたいと述べた。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      dx: {
        stance: "表明済み",
        summary:
          "政治家の家業化・長期化がなれ合いを生むとして、市長の年収800万円・退職金なしを掲げる。市議会議員の報酬も市民並みにするよう提案するとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "減税日本が進める「政治家の非家業化」への挑戦として、議員などを長く務めると政治と行政のなれ合いが出てくると述べた。市長の年収を800万円とし4年ごとの退職金をなくすとし、自分も年収800万円で退職金なしであれば長くやらないとした。議員とは違い市長ならすぐに条例として出せるとしている。市議の報酬についても、減税日本と同様に市民並みにするよう求めていくと述べた。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "市民税5%減税を掲げる。高島市政で税収が伸びた今こそ、行政が配るのではなく市民に戻すべきだとする。市債については、税収が伸びている間は伸びでカバーしつつ、将来的には地方財政法の抜本的な改正を国に求めたいとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "市民税の5%減税を掲げた。国土交通省で長く「集めて配る」側にいたとして、配るとそれをもらうのが得意な人のところにしかいかないと述べ、元々取らずに手元に残すことを伸びたからこそやりたいとした。高島市政で市債を減らしてきた方針を転換するのかと問われ、税収が伸びている間は伸びでカバーすればよいとしつつ、将来的には民間の銀行のお金を使えるよう地方財政法第5条の3の抜本的な改正を国に求めていきたいと述べた。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "「福岡のことは福岡で」として、国の補助金ではなく福岡に任せてもらう地方分権を掲げる。福岡市の人口増加は周辺から吸い上げている面もあるとし、都市圏でともに発展していくべきだとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-14",
            place: "記者会見",
            source: INOUE_KAIKEN_SOURCE,
            text: "「福岡のお金は福岡で回す」として、国の補助金ではなく福岡に任せてもらい、福岡のことは福岡でやる「福岡減税革命」を掲げた。福岡都市圏との関係を問われ、福岡市の人口増加は周囲から吸い上げている面もあり、他の地域が弱くなることもあるとして、「福岡市だけ増えるというよりは、都市圏で考えて共に発展していく」方が相乗効果は大きいと述べ、「福岡市が1人だけ増えればいいとは思ってません」としている。",
            url: INOUE_KAIKEN_URL,
          },
        ],
      },
    },
  },
  {
    id: "mori-kentaro",
    no: "07",
    name: "森 健太郎",
    kana: "もり けんたろう",
    age: 48,
    title: "IT会社経営・AIエンジニア",
    party: "日本保守党 公認",
    lead: "「福岡を、ゼロから」を掲げ、腐敗ゼロ・交通課題ゼロ・移民拡大ゼロ・学校給食の中国産食材ゼロ・市長報酬の半額化・市役所のDX化の「6つのお約束」を示す。ITを使って市政をガラス張りにし、ワンヘルス関連を含めて公金の流れを検証するとしている。",
    bioSource: `${MORI_SITE_SOURCE}／${MORI_KAIKEN_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1978年、福岡市中央区生まれ。福岡大学附属大濠高校（硬式野球部）を経て、福岡大学理学部応用数学科を卒業",
      },
      {
        label: "職歴",
        text: "IT業界で25年、大手SIer、DeNA、タクシーアプリで知られる会社などで開発責任者を務め、自身の会社も経営している",
      },
      {
        label: "2024",
        text: "10月の衆議院選挙（南関東ブロック比例）に日本保守党から立候補",
      },
      {
        label: "2025",
        text: "4月に日本保守党の福岡支部長・情報システム部長に就任。7月の参議院選挙（福岡選挙区）に同党公認で立候補",
      },
      {
        label: "2026",
        text: "2月8日投開票の衆議院選挙（九州比例）に同党公認で立候補。9月14日に同党が福岡市長選への擁立を発表し、9月18日に出馬表明の記者会見",
      },
    ],
    claims: [
      {
        label: "腐敗ゼロ",
        text: "県議会をめぐる現金授受疑惑や海外視察、ワンヘルス関連事業に、県だけでなく市政からどの程度公金が流れていたかを徹底的に検証するとしている。福岡市のワンヘルス推進宣言は撤回するとし、無駄遣いをなくして減税に結びつけるという。",
      },
      {
        label: "交通課題ゼロ",
        text: "地下鉄の七隈線と空港線の環状線化、箱崎線と貝塚線の直通運転化とアイランドシティの中央公園駅の新設、自動運転タクシーの早期導入、信号の運用の見直しを掲げている。",
      },
      {
        label: "移民拡大ゼロ",
        text: "会見と本人サイトの公約で、国が進める外国人の受け入れ拡大・多文化共生に歯止めをかけるとしている。排外主義ではなく、ルールを守り日本に貢献する外国人を追い出す考えはないとする。",
      },
      {
        label: "6つのお約束",
        text: "公約ページを「6つのお約束」に改め、上の3つに加えて「学校給食の中国産食材完全ゼロ化」「市長の報酬を市民並みに（半額化）」「福岡発リアルDX化——無駄な業務をゼロに」を掲げている。高島市政16年で人口・経済規模ともに大きくなったとして「この果実を引き継ぎつつ、次は、福岡市民がもっと豊かになる番」とし、税収が過去最高を記録しているのに年収300万円未満の世帯が約4割（38%）ある現状を直視するとしている。",
      },
      {
        label: "立場",
        text: "日本保守党の公認で立候補する予定。ほかの党派から支援の申し出があれば話をするとしている。高島市長が出るかどうかにかかわらず市長選に出たいと考えていたという。",
      },
    ],
    takashimaAssessment: {
      summary:
        "16年で人口が20万人増え、税収も過去最高となり、素晴らしい街になったと評価する。屋台基本条例をつくって屋台を残したことなどは引き継ぐとしている。一方で、国の方針に沿って外国人の増加を進めてきたことや、ワンヘルスの推進は見直すとしている。",
      updated: "2026年9月",
      log: [
        {
          date: "2026-09-18",
          place: "記者会見",
          source: MORI_KAIKEN_SOURCE,
          text: "高島市政全体への評価を問われ、「高島さん本当に素晴らしいと思います」とし、16年間で人口が20万人増え、税収も過去最高となり、非常に活気があって素晴らしいまちになったと述べた。一方で、国が移民政策や多文化共生を進め、その結果福岡市でも外国人が増えていることについて、高島市長の著書などでは国が進めているから止められないという書き方だったとして、そこは国家観を持って当たりたいとした。良いところは引き継ぎ、改善しないといけないところは改善するとし、屋台基本条例をつくって屋台を残したことは一福岡市民として嬉しいと述べた。外国人問題やワンヘルスについては、推進ではなく止める判断をしたいとしている。",
          url: MORI_KAIKEN_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト（公約）", url: MORI_KOYAKU_URL },
      {
        label: "報道（NHK）",
        url: "https://news.web.nhk/newsweb/na/nb-5010035412",
      },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "moriken3.com",
        url: MORI_SITE_URL,
      },
      {
        kind: "X",
        handle: "@moriken0119",
        url: "https://x.com/moriken0119",
      },
      {
        kind: "YouTube",
        handle: "@moriken3",
        url: "https://www.youtube.com/@moriken3",
      },
      {
        kind: "TikTok",
        handle: "@moriken3com",
        url: "https://www.tiktok.com/@moriken3com",
      },
      {
        kind: "Instagram",
        handle: "@moriken0119",
        url: "https://www.instagram.com/moriken0119/",
      },
      {
        kind: "Facebook",
        handle: "moriken0119",
        url: "https://www.facebook.com/moriken0119/?locale=ja_JP",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "会見と本人サイトの公約で、充実しているとされる市の子育て支援の一部を日本国籍の人に限ってさらに手厚くし、日本人の子どもが増える環境をつくるとしている。「6つのお約束」では学校給食の中国産食材の完全ゼロ化を掲げ、調味料や加工品の細かい原材料まで中国産が使われないようルール化し、米は福岡市産100%を目指して市内の野菜や博多湾・玄界灘の魚を優先するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページの「6つのお約束」の4番目「学校給食の中国産食材完全ゼロ化」で、「いま公表されている学校給食に使われる食材の産地一覧に、中国産という記述はありません。しかし『中国産ゼロ』が規則となっているわけではありません」としたうえで、今後、調味料や加工品の細かい原材料まで中国産が使われないようルール化し、米は福岡市産100%を目指し、市内の野菜、博多湾・玄界灘の魚の使用を優先するとしている。3番目「移民拡大ゼロ」では、子育て支援策の一部を日本国籍者に限ってさらに充実させるとしている。",
            url: MORI_KOYAKU_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "福岡市の子育て支援は非常に充実していると言われているとし、例えばその一部を日本国籍の人に限ってさらに充実させ、日本人の子どもが増える環境をつくっていくと述べた。補助金や子育て支援、スタートアップ支援には国籍要件を付けるべきだとしている。",
            url: MORI_KAIKEN_URL,
          },
          {
            date: "2026-09-18",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページで「福岡市の子育て支援策は充実していると言われますが、この一部を日本国籍者に限ってもっと充実させ、日本人の子どもが増える環境をつくります」としている。",
            url: MORI_KOYAKU_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "会見と本人サイトの公約で、外国人への生活保護を停止し、国民健康保険の「タダ乗り」もなくすとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "外国人の生活保護を停止し、国民健康保険のただ乗りもなくしていくと述べた。市でできる範囲の例として、生活保護を日本人に限ることを挙げている。",
            url: MORI_KAIKEN_URL,
          },
          {
            date: "2026-09-18",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページで「外国人への生活保護は停止、国民健康保険へのタダ乗りもなくしていきます」としている。",
            url: MORI_KOYAKU_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "自動運転タクシーの早期導入に挑戦するとしている。両親も後期高齢者で、免許を返納すると生活の足が不便になるとし、高齢者の多い地域や交通不便な地域の課題を民間と協力して解決するとする。まずは福岡ドームへの循環運行や姪浜〜マリナタウンなど道が広い区間から安全を検証しながら広げる案を示す。「6つのお約束」では、地下鉄の七隈線と空港線を環状線化して乗り換えをなくし、箱崎線と貝塚線の直通運転化を進めてアイランドシティに中央公園駅を新設するとし、国際線への延伸は需要と費用対効果を精査するとしている。渋滞は信号の運用の見直しで対応するとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページの「6つのお約束」の2番目「交通課題ゼロ」で、「市民の利便性向上のため、地下鉄の七隈線と空港線を環状線化し乗り換えゼロに、箱崎線と貝塚線は直通運転化を進めアイランドシティの中央公園駅を新設します」としている。国際線延伸は需要と費用対効果を精査するとし、自動運転タクシーの早期導入に挑戦して高齢者の「足」の1日も早い確保を目指すとする。市内の交通渋滞は、ITエンジニアとして最先端企業で交通課題に取り組んできたキャリアを活かし、信号の運用の見直しを図るとしている。",
            url: MORI_KOYAKU_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "市内交通をゼロから発想するとして、自動運転タクシーの早期導入に挑戦すると述べた。東京では来年、完全無人の自動運転タクシーが走り始めるとし、自身の両親も後期高齢者の福岡市民で、免許を返納すると生活の足がかなり不便になるとして、天神・博多などの都市部だけでなく高齢者の多い地域や交通不便な地域の課題を行政と民間が協力して解決したいとした。福岡のどこから始めるかを問われ、横浜で横浜スタジアムと横浜駅の往復から始まった例を挙げ、福岡ドームへの循環運行や、姪浜からマリナタウンのように道が広く走りやすい区間でまず安全を検証しながら、交通不便な地域や高齢者の多い地域へ順々に進めればよいとしている。渋滞や地下鉄の不便さ、糸島方面への渋滞などへの対策は、アイデアがあるので後日発表するとした。",
            url: MORI_KAIKEN_URL,
          },
          {
            date: "2026-09-18",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページで「市内交通を、ゼロから発想します。自動運転タクシーの早期導入に挑戦します」とし、「天神・博多といった都市部だけではなく、高齢者の多い住宅地、不便な地域の交通課題を、民間と協力して解決します」としている。交通についてはほかにもアイデアがあり、次回話すとしている。重点政策「6本の柱」は順次公開するとして、この時点では内容が示されていない。",
            url: MORI_KOYAKU_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      bosai: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "スタートアップ補助金などには国籍要件を付けるべきだとし、日本の若者の起業を支援するとしている。人手不足については、働きたい日本人が潜在的に約400万人いるとして、賃金の引き上げや労働時間規制の見直しで日本人が働ける環境を取り戻すことを優先するとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "高島市政が進めてきたスタートアップビザなどについて、外国人が増える一因になっているとし、スタートアップの補助金にも国籍要件を付けるべきだと述べた。福岡には九州大学もあり優秀な日本の若者が多いとして、外国人に補助をつけるのではなく日本人が豊かになる政策に取り組むとしている。現場は外国人の労働力がないと成り立たないという声については、今いる外国人を返すということではないとしつつ、失業者と、もっと働きたい人を合わせて約400万人いるとして、給料を上げ、労働時間の規制を見直して日本人が働ける環境を取り戻したいと述べた。",
            url: MORI_KAIKEN_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都構想は中身がまだ分からないとし、首都のバックアップとして地理的には福岡がよいと思うが、多額の予算をかけてまで本当に必要かを確認し、必要であれば福岡がよいとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "副首都構想については中身がまだ分からないとし、首都のバックアップとして地理的には福岡がよいと思うが、多額の予算をかけてまで本当に必要かを確認し、必要であれば福岡がよいとしている。",
            url: MORI_KAIKEN_URL,
          },
        ],
      },
      kanko: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "「移民拡大ゼロ」を掲げ、国が進める大量移民政策・多文化共生に「適切な歯止め」をかけるとしている。「けっして排外主義ではありません」とし、日本のルールを守り文化を尊重し日本に貢献する外国人は迎えるとする。本人サイトの公約で、福岡市では20代の8人に1人が外国人だとし、外国人の国民健康保険料の収納率は全体より15%低いと議会で報告されたとしている（数字の出典はページ上に示されていない）。市でできることとして外国人への生活保護の停止と、子育て支援の一部を日本国籍者に限って充実させることを挙げ、スタートアップの補助金にも国籍要件を付けるべきだとしている。条例化も含めて取り組むとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-22",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "活動報告「『センキョタイムズ』LIVE 出演」で、番組で話したこととして「外国人の生活保護は、市長の判断で停止。子育て支援は、日本人に限ってさらに充実。誰も言わない移民問題も、はっきり言う」を挙げている。",
            url: MORI_EVENT_SENKYO_TIMES_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページの「6つのお約束」の3番目「移民拡大ゼロ」で、福岡市の全人口のうち20代では13%・8人に1人が外国人住民で、20代前半に限れば15%超・6.6人に1人が外国人だとし、「もちろん善良な外国人はウェルカムですが、そう楽観できない実情があります」としている。全国での外国人世帯の国民健康保険料の収納率は約6割しかなく、福岡市でも外国人の収納率は全体のそれより15%低いと議会で報告されているとする。日本人の少子化が進む中で「このままでは、移民との軋轢が深刻な今のヨーロッパのような状況」を招きかねないとし、移民の抑制は国がとるべき政策だが福岡市でもできることがあるとして、まず福岡市の外国人への生活保護を停止し、子育て支援策の一部を日本国籍者に限ってさらに充実させるとしている。数字の出典はページ上に示されていない。",
            url: MORI_KOYAKU_URL,
          },
          {
            date: "2026-09-18",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページで「実は福岡市では、すでに20代の8人に1人が外国人。20代前半にかぎれば、6.6人に1人が外国人です」とし、「国が進める大量移民政策・多文化共生を福岡も推進していますが、私はこれに適切な歯止めをかけます。ただし、私の考えはけっして排外主義ではありません」としている。数字の出典はページ上に示されていない。",
            url: MORI_KOYAKU_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "本人サイトの公約と同じ数字を挙げ、20代の8人に1人、20代前半に限れば6.6人に1人が外国人だとして、このままでは10年前とまったく違う福岡市になるとし、国が進める大量移民政策・多文化共生に適切な歯止めをかけたいと述べた。「決して排外主義ではない」とし、日本のルールを守り文化を尊重し日本に貢献する外国人は迎えるとしている。入口を止めることは国と連携しながら、市でできる範囲に取り組むとし、条例化も含めて総力で取り組みたいとした。市民レベルの取り組みとして、不法滞在の疑いに気づいた市民やタクシー運転手が警察と連携し、アプリなどで情報を寄せる仕組みにも触れている。生活保護については市でできる範囲の例として日本人に限ることを挙げ、スタートアップビザなどは外国人が増える一因になっているとして、スタートアップの補助金にも国籍要件を付けるべきだと述べた。",
            url: MORI_KAIKEN_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "ITを活用して市政をガラス張りにし、すべての事業の内訳を市民がいつでも見られるよう開示するとしている。数百あるプロジェクトの評価の基準を標準化し、職員に成果評価を導入するとする。「6つのお約束」では「福岡発リアルDX化——無駄な業務をゼロに」として、人手不足を嘆く前に市の業務でITをフル活用して効率化を徹底し、福岡市を国のDXの1番手にするとし、市内の中小企業がDX化を進めやすくなるよう指導も進めるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページの「6つのお約束」の6番目「福岡発リアルDX化——無駄な業務をゼロに」で、「市の業務において、人手不足を嘆く前にITをフル活用し、業務の効率化を徹底的に進めます。国も『DX化』を進めようとしていますが、福岡市がその1番手になるのです」としている。福岡市内の中小企業がDX化を進めやすくなるよう指導も進めるとし、「IT専門家の私なら可能です」としている。1番目「腐敗ゼロ」では、ITスキルを活かして税金の使い途を完全に見える化し、市の全事業を洗い出して無駄遣いゼロを目指すとしている。",
            url: MORI_KOYAKU_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページの「腐敗ゼロ」に、「私自身、理不尽なパワハラ体制が大嫌いです。高校野球時代、下級生への『かわいがり』を、3年生のときに『自分たちの代で終わらせよう』と一切やめました」という一節が加わった。",
            url: MORI_KOYAKU_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "ITの活用について問われ、一番大事なのは透明化だとし、海外視察やワンヘルスのモニュメントなど税金の使い道の内訳が分からないことに不満があると述べた。外から質問してもなかなか出てこないため、中に入ってリーダーシップを持ってすべての事業の内訳を開示し、市民が見たいときにいつでも見られるようにするとしている。職員の意識改革について、行政にはITがあまり入っていないとし、市のプロジェクトは何百とあるがフォーマットも指標も違い総合比較できないとして、評価基準を標準化し成果評価を導入すると述べた。市長も同様だとし、民間のように基本報酬は半分にして残りは市民に評価してもらう形を例に挙げ、議員の報酬も変えていきたいとした。",
            url: MORI_KAIKEN_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "市の全事業を洗い出して無駄遣いゼロを目指し、浮いたお金は減税として市民に還元するとしている。福岡県で700億円以上が計上されているとするワンヘルスについて、市の推進宣言を撤回し県にも是正を求めるとする。市長の報酬（年約2,000万円）を半額にし、残りは公約の達成度を市民に評価してもらう成果報酬にするとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページの「6つのお約束」の1番目「腐敗ゼロ」で、連日全国に報道されている「福岡県政の腐敗」が市政にも影響していないか徹底的に見直すとし、ITスキルを活かして税金の使い途を完全に見える化し、市の全事業を洗い出して無駄遣いゼロを目指すとしている。「浮いたお金は市民の皆様に『減税』として還元します」とし、福岡県で700億円以上が計上されている「ワンヘルス」について、福岡市も「推進宣言」を出しているが撤回し、県にも是正を求めるとする。5番目「市長の報酬を市民並みに（半額化）」では、公約を命がけで達成するために市長の報酬を半額に下げて成果主義を導入するとし、「現在、市長が何ら達成しなくても、給与は満額支払われるしくみですが、これはおかしいです」として、市長の報酬（年約2,000万円）を半額にし、残りは公約の達成度を市民に評価してもらう成果報酬にするとしている。",
            url: MORI_KOYAKU_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページに、ワンヘルス関連の支出を給食費に換算した比較が加わった。「ワンヘルスセンター1棟200億円は、福岡市の全小中学校の給食2年2か月分です。ワンヘルスの名目で動く12事業約748億円なら、給食8年3か月分。税金の使い道を透明化し、正します。（福岡市の全小中学校の給食費は約90億円）」としている。金額の出典はページ上に示されていない。あわせて「重点政策 7本の柱」の枠が設けられ、詳しい内容は順次公開するとしている。",
            url: MORI_KOYAKU_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "市政をガラス張りにして無駄遣いをゼロにし、減税に結びつけると述べた。「もちろん市長である報酬も見直します」としている。",
            url: MORI_KAIKEN_URL,
          },
          {
            date: "2026-09-18",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "公約ページで「利権もしがらみもない私、さらにITのプロである私が中に入って、市政をガラス張りにし、膿を出し切る。無駄遣いをゼロにし、減税へと結びつけます。もちろん、市長の報酬も見直します」としている。",
            url: MORI_KOYAKU_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "県議会の問題について、福岡県の中心である福岡市が腐敗とまったく無縁だとは到底思えないとして、自ら中に飛び込んで膿を出し切りたいとしている。市長になればまず福岡市のワンヘルス推進宣言を撤回し、他の首長や知事にも見直しを呼びかけるとする。博多駅の高架下などの落書きを一掃し、治安を守るとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-21",
            place: "本人サイト",
            source: MORI_SITE_SOURCE,
            text: "活動報告「博多駅の高架下に『落書き』― 落書きも、腐敗議員も一掃する」で、「『落書き』が多すぎませんか？しかも、福岡の玄関口・博多駅の高架下です」とし、「私が福岡市のリーダーになれば、『落書き』を一掃する。『腐敗議員』も一掃する。そして、治安を守り——福岡市民をもっと豊かにします」としている。",
            url: MORI_EVENT_RAKUGAKI_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: MORI_KAIKEN_SOURCE,
            text: "県政の問題については、福岡県の中心である福岡市が腐敗とまったく無縁だとは到底思えないとして、自ら中に飛び込んで膿を出し切りたいと述べた。市長になればまずワンヘルス推進宣言を撤回し、他の首長や知事にも一緒に見直そうと呼びかけたいとしている。",
            url: MORI_KAIKEN_URL,
          },
        ],
      },
    },
  },
  {
    id: "abe-hideki",
    no: "08",
    name: "阿部 秀樹",
    kana: "あべ ひでき",
    age: 31,
    title: "医師・前福岡市議会議員（1期・中央区）",
    party: "無所属",
    lead: "麻酔科医から市議に転じ、31歳で挑む。「未来に責任を、福岡にもっと夢を。」を政策ビジョンに掲げ、成長の流れを継承しつつ「稼ぐ・育てる・守る・つなぐ」の4つの柱を示している。",
    bioSource: `${ABE_KAIKEN_SOURCE}／${ABE_YOMIURI_SOURCE}／${ABE_X_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "福岡市中央区生まれ。赤坂小学校、福岡教育大学附属福岡中学校、修猷館高校を経て、長崎大学医学部を卒業",
      },
      {
        label: "医師",
        text: "麻酔科医として福岡大学病院などで勤務。新型コロナの感染拡大で、政治の決断が医療現場や社会を大きく変えるのを実感したことが政治を志したきっかけだとしている",
      },
      {
        label: "2023",
        text: "福岡市議会議員選挙で初当選。常任委員会は福祉都市委員会に所属",
      },
      {
        label: "2026",
        text: "9月16日に市議を辞職し、9月17日に出馬表明の記者会見。10月15日に政策記者会見",
      },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「未来に責任を、福岡にもっと夢を」として、将来世代に負担を先送りせず、未来への投資と持続可能な市政を実現するとしている。",
      },
      {
        label: "4つの柱",
        text: "政策ビジョンとして「稼ぐ（成長を暮らしの豊かさへ）」「育てる（子どもたちの未来に投資）」「守る（誰もが安心して暮らせる）」「つなぐ（人と地域、そして未来をつなぐ）」の4つの柱を掲げている。10月15日の政策記者会見では柱ごとの具体策を示し、最も力を入れたいものとして半導体産業と公共交通を挙げた。",
      },
      {
        label: "2040年",
        text: "福岡市の人口は2040年ごろに約170万人でピークを迎え、高齢者が増えていくとの推計を挙げ、元気な今だからこそ未来に備える政策が必要だとしている。",
      },
      {
        label: "若さ",
        text: "高島市長が36歳で初当選したことに触れ、31歳での挑戦は若すぎるという意見も承知のうえで、人口構造の変化の影響をこれから受ける世代こそが責任を持って取り組むべきだとしている。",
      },
      {
        label: "立場",
        text: "無所属で出馬し、推薦については事務局と話し合ったうえで検討するとしている。",
      },
    ],
    takashimaAssessment: {
      summary:
        "天神ビッグバンや博多コネクティッドによる企業誘致・企業支援で都市が成長し、過去最高の税収を記録してきたのは紛れもない事実だとする。都市の成長で税収を稼ぎ、市民サービスに還元するという基本的な考え方に同意し、継承するとしている。市議として間近で見て、高島市長のような政治家になりたいと思うようになったと述べる。",
      updated: "2026年10月",
      log: [
        {
          date: "2026-10-15",
          place: "記者会見",
          source: ABE_SEISAKU_KAIKEN_SOURCE,
          text: "政策記者会見で高島市政の評価と、継承したい点・修正したい点を問われ、経済の面でのスタートアップや、天神ビッグバン・博多コネクティッドによって老朽化した建物を高さ制限も解消して建て直したことは災害面でも極めて大事だったとして、しっかり継承したいと述べた。一方で、それに伴って新しく起きてきた交通渋滞などの問題には、新たな交通インフラの整備も含めて検討したいとし、「守る」の予防医療など今の福岡市で足りない部分にも取り組みたいとしている。冒頭の説明では、天神ビッグバンやスタートアップなどの経済政策で福岡市は確実に成長し、過去最高の税収を市民サービスに還元してきたのは「紛れもない事実」だとし、その基本姿勢は引き継ぐとした。",
          url: ABE_SEISAKU_KAIKEN_URL,
        },
        {
          date: "2026-09-17",
          place: "記者会見",
          source: ABE_KAIKEN_SOURCE,
          text: "市議に当選してから高島市長の市政運営を議会という身近な場所で見てきて、「高島市長のような政治家になりたいと強く思うようになっていきました」と述べた。高島市政は天神ビッグバンや博多コネクティッドなどの再開発、スタートアップ支援、企業誘致を進め、第2子以降の保育料無償化や学校給食の無償化など子育て支援にも取り組んできたとし、特に継承したいのは個々の政策だけでなく「都市の成長によって新たな財源を生み出し、その成果を市民生活の向上につなげるという運営の基本的な考え方」だとした。評価を問われ、企業誘致や企業支援で都市が成長し、雇用を生み、住民税や固定資産税で過去最高の税収を記録してきたのは「紛れもない事実」だと述べている。",
          url: ABE_KAIKEN_URL,
        },
      ],
    },
    links: [
      {
        label: "本人YouTube（政策記者会見）",
        url: ABE_SEISAKU_KAIKEN_URL,
      },
      { label: "報道（読売新聞オンライン）", url: ABE_YOMIURI_URL },
    ],
    sns: [
      { kind: "公式サイト", handle: "", url: "" },
      {
        kind: "X",
        handle: "@FbD3ATtLBOcH2rx",
        url: "https://x.com/FbD3ATtLBOcH2rx",
      },
      {
        kind: "YouTube",
        handle: "あべひでき",
        url: "https://www.youtube.com/channel/UCCn2NfczdmeggcTKtoO0T4Q",
      },
      {
        kind: "TikTok",
        handle: "@user1366065184436",
        url: "https://www.tiktok.com/@user1366065184436",
      },
      {
        kind: "Instagram",
        handle: "@abe.shigikai",
        url: "https://www.instagram.com/abe.shigikai/",
      },
      {
        kind: "Facebook",
        handle: "hideki.abe.3990",
        url: "https://www.facebook.com/hideki.abe.3990",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "4つの柱の「育てる」として、妊娠時と出産時の各5万円の支援給付に上乗せする出産祝い金の拡充と、第1子の保育料無償化を挙げている。福岡市で働くことを条件にした給付型奨学金を設けて若者の学びを応援するとする。5歳児健診で発達障害などの支援につながる機会が増えるとして、その受け皿となる切れ目のない支援の体制づくりを課題に挙げ、不登校の子どもに向けたフリースクールや子ども食堂の支援も続けるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見で「育てる」について、これから子どもを育てようと考えている人が福岡市で産み育てようと思えるかが極めて重要だとして、ソフト・ハード両面で支援するとした。具体策として、妊娠時と出産時にそれぞれ5万円の支援給付があるところに上乗せする形で出産祝い金を拡充するとし、第2子以降で行っている保育料の無償化を第1子にも広げることを目指すとした。東京や大阪では第1子から始まっているとし、共働き世帯が多い福岡市では保育料が結婚して子どもを産むことの経済的なハードルになっているとしている。また、福岡市でしっかり働く人などに限る形で給付型の奨学金を設け、経済的な理由で夢や学びを諦めなくてよいようにするとした。今年から全面拡大した5歳児健診で発達障害などの支援につながる機会が増えるとして、その受け皿として切れ目のない支援を受けられる体制づくりを市の課題に挙げ、不登校の児童生徒に向けたフリースクールや子ども食堂などの支援も引き続き行うとしている。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-17",
            place: "記者会見",
            source: ABE_KAIKEN_SOURCE,
            text: "子育て世帯の当事者として、安心して産み育てられる社会を、周りの母親の友人などの意見も汲み取りながら進めたいとした。福岡市は地価が高騰しており、部屋の広さから2人目は厳しいと考える人もいるとして、住居を含め市の成長に合わせて浮かび上がる諸問題に取り組むとしている。具体策としては、病児保育などの受け皿の確保、保育料無償化の拡大、住居費の支援の拡大を挙げ、詳しくは次の会見で説明するとした。市議時代の取り組みとしては、国が定める疾患以外にも調べた方がよい疾患がある新生児マススクリーニング検査について、国のモデル事業にあわせて一部疾患の補助を始められたことを挙げた。まだ実現していないが、不登校の子どもが近くのクリニックで健康診断を受けられるようにする取り組みも進めてきたとし、市長になっても続けたいとしている。",
            url: ABE_KAIKEN_URL,
          },
          {
            date: "2026-09-22",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "政策ビジョンの柱の一つ「育てる｜子どもたちの未来に投資する。」として、「第一子からの保育料無償化や出産・子育て支援の充実、5歳児健診の推進など、妊娠・出産から教育まで切れ目のない支援を目指します」としている。「子どもたちが生まれ育った環境に左右されず、可能性を広げられる福岡市へ」とも述べている。",
            url: ABE_X_POLICY_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "4つの柱の「守る」として、医療・介護体制の充実と救急医療の強化を掲げる。障がいのある人が安心して暮らし働き社会参加できる環境づくりとして、移動・外出への支援、就労機会の拡充、相談支援体制の充実、バリアフリー化を挙げる。医師としての専門性を生かし、2040年に向けて医療・介護従事者や保育士への「人への投資」を行うとし、介護の担い手不足を特に重要な課題に挙げる。予防医療として、特定健診の受診率の向上や検査項目の充実、医学的なエビデンスに基づくワクチン施策に取り組むとする。政策記者会見では、特定健診に市独自の検査項目を設けて受診のメリットを伝えること、小児の急患センターの混雑に市民病院の一部機能を移すことなどを挙げた。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見で「守る」の大きなテーマとして予防医療と介護予防を挙げ、寝たきりにならないようにし病気になる前に未然に防ぐことに取り組むとした。特定健診などの受診率は政令市の中でも特に低い順位で推移しているとして、受診率の向上に取り組むとし、具体策を問われて、国の項目は少ない部分があるとして市独自の検査項目を設け、受けるとこんなことが分かるというメリットを市民に伝えて受診率の向上につなげたいと述べた。かかった経費は、生活習慣病などのリスクに早く気づいて改善してもらえればトータルの医療費の削減につながるとし、エビデンスや費用対効果を検討したうえで行うとしている。医療・救急体制については、市民病院の移転に触れ、小児の急患センターが満杯で順番待ちになる状況もあるとして、市民病院に一部機能を移すなどして救急医療体制を整えたいとした。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-17",
            place: "記者会見",
            source: ABE_KAIKEN_SOURCE,
            text: "2040年に向けた人への投資として、医療従事者や介護従事者、保育士、高齢者をはじめ全世代が生き生きと暮らせる投資を行いたいと述べた。特に重要な分野としてマンパワー不足を挙げ、介護の担い手が減る一方で高齢者は増え、支える生産年齢人口も減るとして、担い手への支援に取り組むとしている。医師としての経験を生かす例として予防医療を挙げ、福岡市の特定健診の受診率は政令市の中でも低い順位で推移しているとして受診率の向上に取り組み、検査項目を増やせば市民にわかる情報が増え健康寿命を延ばすことにもつながるとした。医学的なエビデンスに基づくワクチンなどで病気を予防し、医療費を削減できるなら「絶対やった方がいい」とも述べている。市議としては福祉都市委員会に所属し、医療機関や介護事業所の声を聞いてきたとしている。",
            url: ABE_KAIKEN_URL,
          },
          {
            date: "2026-09-22",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "政策ビジョンの柱の一つ「守る｜誰もが安心して暮らせる福岡へ。」として、「医療・介護体制の充実、救急医療の強化、災害時の避難所環境の改善など、市民の命と暮らしを守る取り組みを進めます」としている。「高齢者も、障がいのある方も、子育て世代も、安心して暮らし続けられるまち」を目指すとする。",
            url: ABE_X_POLICY_URL,
          },
          {
            date: "2026-10-03",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "「守る」を掘り下げた投稿で、「災害への備えを強化し、医療・救急体制を充実。子育て世帯や高齢者への支援に加え、障がいのある方が安心して暮らし、働き、社会参加できる環境づくりを進めます」としている。具体策として「移動・外出への支援、就労機会の拡充、相談支援体制の充実、バリアフリー化など、一人ひとりの生活に寄り添った支援を」挙げ、「災害時に支援を必要とする方を確実に守れる地域の体制づくりも進めます」としている。",
            url: ABE_X_MAMORU_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "4つの柱の「つなぐ」で公共交通の充実を第一に掲げ、今の交通対策だけでは渋滞の改善は厳しいとして、地下鉄が通っていない南区など南部地域への新しい都市交通インフラを検討するとしている。地下鉄かモノレールなどの地上の仕組みかは、費用対効果や道路幅、渋滞の緩和効果を予算をかけて調査したうえで、地域住民の声も聞きながら慎重に決めるとする。地下鉄七隈線の6両化や延伸、貝塚線の直通化については、実現可能性や費用対効果を検証したうえで前向きに検討するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見で「つなぐ」の1番目に公共交通の充実を挙げ、交通渋滞に悩む市民が多い中で、今の様々な交通対策だけで改善するのは厳しいとして、新しい都市交通インフラ、特に地下鉄が走っていない南区などの南部地域への新しい交通インフラを検討すべきだと述べた。何を想定しているかを問われ、どこに何を通すかは様々な検討が必要だとし、地下鉄ならどこでも通せるが、モノレールのような地上のシステムは道路幅などで通せる場所が制限されるとして、経済効果や渋滞の緩和効果をある程度予算をかけて調査したうえで決めるとした。最も力を入れたい政策の一つにも挙げたうえで、莫大な費用がかかるため、未来に責任を持つという立場から費用面と地域住民の声のヒアリングを慎重に重ねたいとしている。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-17",
            place: "記者会見",
            source: ABE_KAIKEN_SOURCE,
            text: "交通インフラはとても課題だとし、七隈線の6両化や延伸、貝塚線の直通化などが現時点で市で進められているとしたうえで、まずしっかり調査し、実現可能性や費用対効果などを検証したうえで前向きに検討したいと述べた。",
            url: ABE_KAIKEN_URL,
          },
          {
            date: "2026-09-22",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "政策ビジョンの柱の一つ「つなぐ｜人と地域、そして未来をつなぐ。」として、「交通インフラの充実や老朽化対策を進めるとともに、福岡都市圏や九州全体との連携を強化します」としている。",
            url: ABE_X_POLICY_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "ウォーターフロント地区の開発を今後の福岡市の大きなテーマの一つとし、魅力的な場所になるよう、アクセスも含めて取り組むとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-17",
            place: "記者会見",
            source: ABE_KAIKEN_SOURCE,
            text: "ウォーターフロント地区の再生について、今後の福岡市の大きなテーマの一つだとし、福岡市にずっと住んできて少し寂しい、行きづらく不便だと感じるところもあるとして、魅力的な場所になるよう、そこへのアクセスも含めて取り組みたいと述べた。詳しくは今後の政策で示すとしている。",
            url: ABE_KAIKEN_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "4つの柱の「守る」の一つとして、災害への備えの強化と災害時の避難所環境の改善を挙げている。食料・水・電気の備えと、障がいのある人や高齢者のための福祉避難所の整備を挙げ、災害時に支援を必要とする人を確実に守れる地域の体制づくりを進めるとする。自治会など地域コミュニティの結びつきの強化を、災害時の自助・共助の面でも大事だとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見で防災について、高島市政のもとで様々な施策が行われているとしたうえで、引き続き食料・水・電気の備えや、障がいのある人や高齢者のための福祉避難所を含む避難所の整備を進め、災害時でも皆が安心して避難でき安全を守れる体制を整えなければならないと述べた。「つなぐ」では、自治会に参加する人が減っているとして、自治会や地域コミュニティの結びつきの強化は災害時の自助・共助の面でも大事になるとし、支援していきたいとしている。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-22",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "政策ビジョンの柱の一つ「守る」の中で、「医療・介護体制の充実、救急医療の強化、災害時の避難所環境の改善など、市民の命と暮らしを守る取り組みを進めます」としている。具体的な取り組みと財源は今後ひとつずつ紹介するとしている。",
            url: ABE_X_POLICY_URL,
          },
          {
            date: "2026-10-03",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "「守る」を掘り下げた投稿で「災害への備えを強化し、医療・救急体制を充実」とし、「災害時に支援を必要とする方を確実に守れる地域の体制づくりも進めます」としている。",
            url: ABE_X_MAMORU_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "4つの柱の「稼ぐ」として新産業の育成を掲げ、熊本のTSMCなど九州全体に半導体の大きな波が来ているとして、福岡市は設計を担うファブレス企業の誘致と、半導体のリーダー的な人材の育成を担うべきだとしている。地場企業の生産性の向上を支え、DXやAI化などに条件をつけたうえで支援し、市民の実質的な所得を伸ばすとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見で「稼ぐ」について、天神ビッグバンやスタートアップなどの経済政策で福岡市は確実に成長してきたとし、その基本姿勢を引き継いだうえで新産業の育成を掲げた。九州全体の産業のテーマとして半導体を挙げ、熊本にTSMCが来て九州に大きな波が来ているとして、福岡市としては設計部門、ファブレス企業にしっかり力を入れるべきだとし、九州の中心都市として半導体のリーダー的なポジションを担う人材の育成も同時に進めるべきだと述べた。国の骨太の方針の成長17分野にも半導体が入っているとしている。地場企業については、物価高で経費が増え経営が厳しいという声があるとして、生産性を高めて売上を伸ばし、市民一人ひとりの実質的な所得を伸ばすことを目指すとした。具体策を問われ、基本的には規制緩和で民間の活力を刺激するとし、業界ごとの法令の規制は国に要望を上げ、市として試せるものは挑戦したいと述べたほか、DXやAI化など生産性を高める取り組みには一定の条件をつけたうえで支援したいとしている。最も力を入れたい政策の一つに半導体を挙げた。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-22",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "政策ビジョンの柱の一つ「稼ぐ｜福岡の成長を、暮らしの豊かさへ。」として、「企業誘致や地場企業の成長支援、半導体関連産業の集積などを通じて、福岡の経済力を高めます」としている。",
            url: ABE_X_POLICY_URL,
          },
          {
            date: "2026-09-30",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "「稼ぐ」を掘り下げた投稿で、「地場企業のさらなる成長を後押しするとともに、企業誘致やスタートアップ支援、半導体をはじめとする成長産業の集積を進め、福岡の『稼ぐ力』をさらに高めます」としている。「また税外収入をいかに増やしていくかも大事です」としたうえで、「そこで生まれた財源を、子育て・教育・医療・福祉など、次世代への投資につなげていく」と述べている。",
            url: ABE_X_KASEGU_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都構想を推進し、福岡が九州、そして日本の発展を支える都市となることを目指すとしている。それぞれの地方が経済軸を持って成長する多極分散型経済の考え方は「その通りだ」とし、県が主体となるのを前提に知事と連携して進めるとする。中身を見極めたうえで、福岡市民にどう還元できるのか、生活がどう良くなるのかを考えて前向きに検討するとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-22",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "政策ビジョンの柱の一つ「つなぐ」の中で、「副首都構想も推進し、福岡が九州、そして日本の発展を支える都市となることを目指します」としている。",
            url: ABE_X_POLICY_URL,
          },
          {
            date: "2026-09-17",
            place: "記者会見",
            source: ABE_KAIKEN_SOURCE,
            text: "副首都構想について問われ、多極分散型経済という、それぞれの地方で経済軸を持って成長していく考え方は「その通りだ」と述べた。県単位で主体的に進めるのが前提としつつ、福岡市としても知事と連携して進めたいとした。中身はこれから議論されて明らかになるとして、それを見極めたうえで福岡市民にどう還元できるのか、生活がどう良くなるのかを考え、前向きに検討したいとしている。",
            url: ABE_KAIKEN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "4つの柱の「つなぐ」の一つとして、福岡の歴史・文化・伝統工芸・神社仏閣・歴史ある街並みを守り、次につないでいくとしている。博多どんたくや山笠、地域の祭りなどの文化を後世につなぐことを市として支えるとし、市民が地域の歴史を知って自分の街を誇りに思えるよう、古くなった案内板をデジタルサイネージなどに置き換えることも挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見の「つなぐ」で、博多どんたくや山笠、それぞれの地域の祭りなど福岡の文化・歴史を後世につないでいくことを市としてしっかり支えたいと述べた。具体的な考えを問われ、地域の祭りや神社仏閣などの歴史的な遺産を大事にするとともに、その施設の経緯などを市民に伝え、市民が自分の街を少しでも好きになり誇りに思えるよう、市として伴走したいとした。遺跡などの案内板が古くなって見えなくなっているとの指摘には、アナログの案内板を例えばデジタルサイネージにして案内できるようにし、有事の際には避難情報を出すなどの使い道もあるとして、DXや技術の進歩も活用しながら進めたいとしている。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-22",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "政策ビジョンの柱の一つ「つなぐ」の中で、「福岡の歴史、文化、伝統工芸、神社仏閣、歴史ある街並みなど、先人たちが大切に守り育ててきた豊かな歴史と文化をしっかり守り、つないでいきます」としている。",
            url: ABE_X_POLICY_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "外国人を福岡市に入れない、生活できないようにすると経済の好循環が切れてしまうので「あってはならない」とし、排除ではなくルールを守ってもらうよう促すことがテーマだとしている。ごみ出しや夜間の騒音など地域のルールとマナーの啓発を企業・学校・自治体が連携して進め、ある程度の強制力を持たせる条例化も視野に入れるとする。税の不公平をなくすとして外国人の投資用物件の固定資産税の事前納付を例に挙げたが、裏づけとなるデータは持ち合わせていないとしている。来日して間もない外国人の生活保護の申請は、経緯を調べたうえで判断するとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見で、フリップに載せていないとしたうえで外国人について考えを述べた。外国人を福岡市に入れない、生活できないようにすると経済活動や経済の好循環が切れてしまうので「あってはならない」とし、働きながら福岡市のモラルやマナーをどう教育・啓発するかが重要だとして、ごみのマナーや夜中に騒がないなど地域のルールを守ってもらえるよう学校・企業・自治体が手を組むとした。ある程度の強制力を持たせることも視野に入れ、条例化も合わせて考えるとし、お願いベースで企業が何もしないのでは意味がないとして、自治体が監視・チェックする体制や学校の教育プログラムへの組み込みを例に挙げた。分断は避けるべきで、排除ではなくルールを守ってもらうよう促すことがテーマだとしている。税やサービスの不平等はあってはならないとして、外国人が投資用物件を買った際に固定資産税の支払いが滞る事案もあると聞くとして事前納付を例に挙げたが、記者に根拠を問われ「データっていうのはあのすいません。あの、ない状況」と述べ、具体的な人数などは持ち合わせていないとした。対象を外国人に限るかは今後精査するとしている。来日してまもなく働いている実態がないまま生活保護を申請する事案については、経緯を調査したうえで受けるべきかを判断したいとし、現在の市の受給決定の体制はきちんと行われていると認識しているとした。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "地域の歴史や遺跡を伝える案内板について、劣化したアナログの案内板をデジタルサイネージなどに置き換え、有事の際には避難情報も出せるようにするとし、DXや技術の進歩を活用するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見で、地域の遺跡などの案内板が古くなって見えなくなっているとの指摘に対し、アナログの案内板は劣化して見えなくなることもあるとして、例えばデジタルサイネージで案内できるようにし、有事の際には避難情報を出すなど様々な使い道もあるとした。「そこも、DXだったりとか、その技術の進歩っていうのも活用しながら」歴史の発信を進めたいと述べ、街なかにデジタルサイネージの案内板を何か所か設置して緊急時にも情報を出すことを手段の一つとして考えているとしている。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "都市の成長で財源を生み、市民サービスに還元する運営の考え方を継承するとしている。企業版ふるさと納税の活用や市保有財産を使った広告収入など、税外収入の確保に積極的に取り組み、持続可能な財政運営を目指すとする。将来世代に負担を先送りしないことを掲げ、社会保障費の増大や老朽化するインフラへの対応を課題に挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-17",
            place: "記者会見",
            source: ABE_KAIKEN_SOURCE,
            text: "「税収を確保できなければ当然市民サービスに還元することはできません」とし、都市の成長で新たな財源を生み出し市民生活の向上につなげる方向性を継承すると述べた。「将来世代に負担を先送りせず、未来への投資と持続可能な市政を実現させます」としている。",
            url: ABE_KAIKEN_URL,
          },
          {
            date: "2026-09-22",
            place: "SNS",
            source: ABE_X_SOURCE,
            text: "政策ビジョンの柱「稼ぐ」の中で、「企業版ふるさと納税の活用や市保有財産を活用した広告収入など、議会でも質問してきましたが様々な手法を使い、積極的な税外収入の確保にも取り組み、持続可能な財政運営を目指します」としている。前提として、2040年に向けて進む人口構造の変化、社会保障費の増大、老朽化するインフラへの対応を挙げ、将来を見据えた市政運営が求められるとする。「成長だけを追い求めるのではなく、その恩恵を市民の暮らしに届け、将来世代に過度な負担を残さない市政へ」とも述べている。",
            url: ABE_X_POLICY_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "4つの柱の「つなぐ」の一つとして地域コミュニティの支援を掲げ、自治会に参加する人が減っているとして、一部の人に偏らない役割分担を進め、市がアドバイザーのように入りながら地域のあり方を検討するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-15",
            place: "記者会見",
            source: ABE_SEISAKU_KAIKEN_SOURCE,
            text: "政策記者会見の「つなぐ」で、自治会に参加する人が減っているとして、一部の人に偏らない役割分担を進め、市がアドバイザーのように入りながら地域のあり方を検討したいとしている。",
            url: ABE_SEISAKU_KAIKEN_URL,
          },
        ],
      },
    },
  },
  {
    id: "nagasawa-kanta",
    no: "09",
    name: "永澤 幹太",
    kana: "ながさわ かんた",
    age: 33,
    title: "NPO法人代表理事",
    party: "無所属",
    lead: "「元気なうちに、備える。」を掲げ、市内7区の小学校を、災害時にもエネルギーと水を自給できる「風の谷」にするとしている。供託金240万円を寄附と自己資金で集め、10月31日までに用意できなければ立候補を見送ると表明している。",
    bioSource: `${NAGASAWA_SITE_SOURCE}／${NAGASAWA_KAIKEN_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1993年、福岡市生まれ。東区在住。福岡市立青葉中学校、福岡大学附属大濠高校、西九州大学（リハビリテーション学部）を卒業",
      },
      {
        label: "2015",
        text: "福岡医療団に入職し、作業療法士として勤務",
      },
      {
        label: "2019",
        text: "株式会社ウェルモ（現・株式会社unico）に入社。介護・児童福祉のソフトウェアを手がける会社で、現在も在籍しているとしている",
      },
      {
        label: "2023",
        text: "NPO法人mieを設立し代表理事に就任。久山町の里山で「ノンビリムラ」を運営し、里山の整備や体験教育に取り組む",
      },
      {
        label: "2026",
        text: "9月3日に政治団体「ながさわかんた後援会」を設立し、9月17日に出馬表明の記者会見。選挙に出るのは初めて",
      },
    ],
    claims: [
      {
        label: "8つの課題",
        text: "公式サイトで課題を8つに整理している（10月18日に7つから組み替え）。現在の課題として①街は大きくなったのに、給料が増えない、②子どもも先生も、学校に行けない、③歩いて行ける距離に、顔見知りがいない、④日本語を自由に話せる外国人は、半分もいない、未来の課題として⑤停電したら、逃げ込める涼しい場所がない、⑥親が倒れても、介護する人がいない、⑦ごみの埋め立てで、里山と生き物、水源を潰し続けている、⑧人口減と金利のある世界での過剰投資、を挙げる。いずれも数字と出典を添えている。",
      },
      {
        label: "3つの政策",
        text: "①福岡に7つの「風の谷」を、②ポケットに、市役所を（旧「人は人にしかできない仕事を」）、③つくる前に、数える・常に学ぶ議会、の3つを掲げる。それぞれ詳細ページがあり、子ども・高齢者・現役世代それぞれにとって何が変わるかと、実現の工程を示している。",
      },
      {
        label: "供託金",
        text: "無所属で組織の後ろ盾がないとし、供託金240万円を寄附と自己資金で集めるとしている。10月31日までに用意できなければ立候補を見送るとし、「1か月で240万円を集められない人が票を集められるはずがない」として、この条件を自分への客観的な評価だとする。",
      },
      {
        label: "討論会",
        text: "政策の議論は告示を待たずにできるとして、出馬を表明した人に公開の政策討論会を呼びかけている。議論の中で考えがかなり近い人がいれば、一本化も選択肢だとしている。",
      },
    ],
    takashimaAssessment: {
      summary:
        "都心の再開発は、市の手出しを抑えて民間投資で建て替え、老朽化に対応し固定資産税の増収も見込めるとして、経済合理性はあったと評価する。一方で、需要の見立てが甘かった事業もあるとし、途中で止めた議会や職員は優秀だとも述べている。本人サイトでは16年を「堅実だった」とし、主要13事業を約束と結果で採点している。",
      updated: "2026年9月",
      log: [
        {
          date: "2026-09-17",
          place: "記者会見",
          source: NAGASAWA_KAIKEN_SOURCE,
          text: "天神ビッグバンなど都心の再開発の評価を問われ、市からの手出しが少ない状態で民間の投資により容積率の高いものを建て、老朽化への対応や固定資産税の面から経済合理性があり、良かったのではないかと述べた。一方で、ロープウェイ構想やベイサイドプレイスの再整備を例に、コロナをはさんだとはいえ需要の予測が甘かったのではないかとし、「経済合理性良かったところもあれば微妙だったところもある」として、それをきちんと止めた議会や市の職員は優秀なのではないかと述べた。",
          url: NAGASAWA_KAIKEN_URL,
        },
        {
          date: "2026-09-05",
          place: "本人サイト",
          source: NAGASAWA_SITE_SOURCE,
          text: "「福岡市の16年を、数字で振り返る」を公開。「堅実だった。だから、失敗から学んで、次のもっと厳しい10年に立ち向かう」とし、主要13事業を「約束と結果」で採点している（◎4・○2・△5・×3）。",
          url: NAGASAWA_REVIEW_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト", url: NAGASAWA_SITE_URL },
      {
        label: "報道（NHK）",
        url: "https://news.web.nhk/newsweb/na/nb-5010035386",
      },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "kantanagasawa.com",
        url: NAGASAWA_SITE_URL,
      },
      {
        kind: "X",
        handle: "@dr_kanta",
        url: "https://x.com/dr_kanta",
      },
      {
        kind: "YouTube",
        handle: "@ナガサワカンタ_ノンビリムラ",
        url: "https://www.youtube.com/@%E3%83%8A%E3%82%AC%E3%82%B5%E3%83%AF%E3%82%AB%E3%83%B3%E3%82%BF_%E3%83%8E%E3%83%B3%E3%83%93%E3%83%AA%E3%83%A0%E3%83%A9",
      },
      {
        kind: "TikTok",
        handle: "@user7109683284616",
        url: "https://www.tiktok.com/@user7109683284616",
      },
      {
        kind: "Instagram",
        handle: "@kanta_93",
        url: "https://www.instagram.com/kanta_93/",
      },
      {
        kind: "Facebook",
        handle: "kanta.nagasawa.9",
        url: "https://www.facebook.com/kanta.nagasawa.9/?locale=ja_JP",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "小学校を「風の谷」とし、校庭に果樹や生き物を取り入れて、都会でも子どもが生き物に出会える環境をつくるとしている。今ある子育ての給付は続けるが新しい給付は作らないとし、0〜2歳の保育料無償化を第1子に広げることには所得の高い世帯ほど恩恵を受けるとして「反対」とする。不登校は子どもや家庭の問題と割り切らず、風の谷で学校の外に居場所をつくり、部活は先生を当てにしない仕組みを計画として示すとしている。過大規模校の分離新設には「やや反対」とし、推計を公開して通学区域の見直しや近くの施設の活用と費用を比べてから決めるとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-14",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "市政運営方針一覧の「教育・子育て」で、「子育ての給付は続ける。不登校は子どもや家庭の問題と割り切らない。風の谷で学校の外に居場所。部活は先生を当てにしない仕組みを計画として示す。生徒手帳のQRで中高生が1人でも体育館を予約できる」としている。根拠の数字として、小学生の不登校は政令市1位で、子ども関連予算は2.5倍（2010→2026年度、先生の給与負担の移譲を含み、こども育成費だけなら2.05倍）になったのに不登校は3.2倍（2018年度から）、小学校の先生の採用倍率は8.5倍から2.2倍に下がったとしている。「よく聞かれる15の問い」では、過大規模校の対策として小中学校の分離新設を積極的に進めるべきかに「やや反対」と答え、新しい学校の建設は多額で子どもが減れば負債になるとして、推計を公開し、通学区域の見直しや近くの学校・市有施設の活用と費用を比べてから決めるとしている。0〜2歳の保育料の無償化を第1子にも広げるべきかには「反対」と答え、今ある給付は続けるが第1子への拡大はしないとし、保育料はもともと所得に応じた料金で一律に無償にすると所得の高い共働き世帯の方が恩恵を受ける、非課税世帯は既に無償で、無償化の効果を市は計っていないとしている。子育て支援と高齢者福祉ならどちらを優先すべきかには「どちらともいえない」とし、子ども・高齢者ともに新たな給付制度は設けず、どの世代にも関係する施策を優先するとしている。",
            url: NAGASAWA_HOUSHIN_URL,
          },
          {
            date: "2026-09-17",
            place: "記者会見",
            source: NAGASAWA_KAIKEN_SOURCE,
            text: "都会の中での自然との共生について、広い公園を新しくつくるのは現実的でないとして、コンクリートの中に簡易的な池をつくればトンボが増え、花があればミツバチも呼べると述べた。一番推したいのは鶏だとし、生ゴミや虫を食べ世話の手間もほとんどかからないとして、飼っていない学校は飼った方がいいとした。子どもの遊び場が少ないことについては、利用が少ない公民館の機能を人が集まりやすい小学校に移し、公民館を子どもの遊び場として設計することは現実的ではないかと述べた。市長の権限でできるかはまだ分かっていないとしている。夏の暑さで7月に入ると外で遊べなくなる状況を挙げ、「生きてて気持ちがいい街にしたい」とも述べた。",
            url: NAGASAWA_KAIKEN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策①のページで、公民館の機能を小学校の空き教室へ移す案を数字とともに示している。市立小学校146校で児童数は2022年をピークに減っており、コロナ禍に市が議会で「300教室」を確保したと答弁したとして、教室はすでに空いているとする。公民館は150館で年35億円、1年に1回以上使う市民は24%（市の目標は50%）だとし、建て替え（1館あたり約2億円）をやめて中身を小学校へ移し、改修は1校1千万円以下で済むとしている。入口を分けて登録者だけがカードで入り、入退館を記録する方式にすれば今より安全だとする。公民館の跡地は都市公園ではなく「校区の広場」にして、マルシェ・焚き火・鶏・小さな水辺・果樹を条例で最初から可能にし、トイレ・東屋・防災倉庫は残すとしている。一気には進めず、建て替えの順番が来た館から10年で30〜40館とし、条例改正が必要なため稼働率と費用を先に公開して政策③の手順を通してから議会に出すという。校庭では、植え替える木を果樹に切り替え、水辺や鶏の飼育で生き物と触れ合える場にするとしている。",
            url: NAGASAWA_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策①の詳細ページで、子どもにとっての「風の谷」を、火と水と生き物がいる校庭、木陰と果樹、鶏と水辺、焚き火で火と道具の扱いを覚えられる場、土日も朝から開いていて親でも先生でもない大人がいる場だと説明している（今の校庭開放は13〜17時）。課題のページでは、福岡市の小学生の不登校の割合が1,000人あたり30.1人で政令市1位、不登校の児童生徒は5,770人で5年で2.3倍、精神疾患で休職・1か月以上休んだ市の先生は157人（2024年度、2017年度の92人から1.7倍）といった数字を、出典とともに挙げている。",
            url: NAGASAWA_KAZENOTANI_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "人口減少で医療や介護が受けられなくなる事態を避けるため、機械に任せられる仕事は任せ、教育や介護など人が最も足りない分野に働く人が集まる仕組みをつくるとしている。需要が逼迫しているのは教育・医療・介護の現場だとし、そのうち市が直接関われるのは義務教育の領域だとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-17",
            place: "記者会見",
            source: NAGASAWA_KAIKEN_SOURCE,
            text: "福岡市ですらこれから人口が減少していく局面になるとし、病院や学校などの人手不足がより深刻になれば医療や介護が受けられなくなるおそれがあると述べた。人がやらなければいけないことと機械に任せても大丈夫そうなことを仕分け、機械に任せられるところは任せて、人にしかできない仕事に働く人の力が集まりやすい仕組みをつくる必要があるとしている。",
            url: NAGASAWA_KAIKEN_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "地下鉄七隈線は需要を受け止められていないとして、車両の増便・増結を急ぐとしている。地上ではロボタクシー（自動運転タクシー）を1年以内に実証、2年以内の実現を目指し、交通の不便な周辺部はシンプルな路線を回る自動運転バスで回遊できるようにするとする。地下鉄の空港国際線ターミナルへの延伸や箱崎線と西鉄貝塚線の直通運転には「やや反対」とし、七隈線の投資回収が2070年代という推計もあるとして、計画を公開し第三者評価を仰ぐとしている。都心部より周辺部の交通を優先するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-14",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "市政運営方針一覧の「公共交通」で、「地下鉄七隈線は需要を受け止められていない。車両の増便・増結を急ぐ。地上はロボタクシー（自動運転タクシー）を1年以内に実証実験、2年以内の実現を目指す。交通の不便な周辺部は、シンプルな路線を回る自動運転バスで回遊できるようにする」としている。根拠として、七隈線は2026年度に1時間18本から20本に増便予定で、6両化は事業費約360億円・2027年度着手・2030年度から順次とする市交通局の2026年9月の委員会報告を挙げる。「よく聞かれる15の問い」では、地下鉄の空港国際線ターミナルへの延伸や箱崎線と西鉄貝塚線の直通運転を進めるべきかに「やや反対」と答え、七隈線の投資回収は2070年代という推計で人口ピークアウトが早まる兆しもあり、さらなる延長は過剰投資の懸念があるとして、計画を公開し第三者評価を仰ぐとし、混雑する七隈線の増便には前向きだとしている。周辺部より都心部の交通インフラ整備を優先すべきかには「反対」と答え、人口減で交通需要は細り、都心はロボタクシーなど民間の交通が充実する可能性がある一方で課題は辺縁部だとして、複雑でない路線の自動運転バスで回遊できる交通網を民間と築くとしている。",
            url: NAGASAWA_HOUSHIN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "よくある質問の「交通はどうしますか？ロボタクシーは？」で、ロボタクシーはまず実証を福岡に呼ぶとし、チューリング・Waymo・テスラが試せる場所と道路を市が用意し、エリアは採算の合う都心から広げて、ゆくゆくは住宅地、里山、志賀島まで配車できる街にするとしている。日本で無人のロボタクシーが商業運行している場所は2026年10月時点でまだないとし、走らせる許可は公安委員会と国にあって、市長が決められるのは実証の場所、道路側の整備、県警との調整の窓口、国家戦略特区としての規制の特例の提案だとして、これを全部そろえて自動運転の実証が最初に来る政令市にするとする。市が運行している乗合タクシー（チョイソコ）は1回の乗車あたり約900円を市が負担しているとして、将来の置き換えの候補だとしている。",
            url: NAGASAWA_SITE_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "再開発は第三者の評価を経てから進めるべきだとし、ウォーターフロント地区の再生は、見立ての甘さを解決できれば進めてよいとして検討は続けた方がよいとしている。解体で出るがれきの処分で谷を埋め立てていることを問題視し、次の再開発は処分の方法まで含めて設計すべきだとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-17",
            place: "記者会見",
            source: NAGASAWA_KAIKEN_SOURCE,
            text: "都市開発で一番気になるのは壊した後のがれきの行き場だとし、埋め立てで谷を満杯にしてきており、谷を埋めれば生き物が激減し水も汚れると述べた。新しく環境に良い建物が建つとしても、ごみの処理の方法は誰かが変える必要があるとしている。ウォーターフロント地区の再生について問われ、見立てが甘かったところはいったん止まっているとし、甘くない状態にして再出発した方がよいとして、見立ての甘さを解決できれば進めてもよいのではないかと述べた。判断基準はどちらかといえば経済合理性で、環境アセスメントで生物多様性などの観点が整理されていればそれも判断基準に入れるべきだとし、検討は進めた方がよいとしている。",
            url: NAGASAWA_KAIKEN_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "市内の小学校を、災害時も水とエネルギーが3日止まらない生活拠点「風の谷」に進化させるとし、4年で7区に7校を整えるとしている。真夏の熱帯夜に避難しても停電を心配せず眠れるようにするとする。何が起きるかの予測はあてにせず、何が来ても止まらない側を整えるとし、遠くの発電所に頼る電気と水を小学校単位で自給できるようにして依存先を分散するとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-14",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "市政運営方針一覧の「防災・暑さ」で、「小学校を、災害時も水とエネルギーが3日止まらない拠点に（7区に7校、4年）。真夏の熱帯夜に避難しても停電を心配せず眠れる。猛暑日は今世紀末の予測を超えた」としている。根拠の数字として、猛暑日は2024年に39日・2026年に38日あったこと、築50年を超える橋は26%から10年後に72%になること、災害関連死は高齢者が9割であることを挙げる。",
            url: NAGASAWA_HOUSHIN_URL,
          },
          {
            date: "2026-09-17",
            place: "記者会見",
            source: NAGASAWA_KAIKEN_SOURCE,
            text: "「風の谷」を、人と生き物が調和していて、災害が起きても機能が止まらない生活拠点だと説明し、今ある小学校を自然が豊かで、災害時にエネルギーや水を長期間自給できる生活拠点に進化させたいと述べた。想定する災害について、東日本大震災もコロナも予測できなかったとして予測は難しいという前提に立ち、福岡市は市内でほとんど発電しておらず遠くで大量に発電した電気を引いているため、送電網や発電所が被災すれば福岡市全体が停電しうるとした。そのため電気や水のインフラをもう少し小さい単位で自立させ、自家発電が長く続く避難所のようなエネルギー拠点を増やしたいとしている。水素や蓄電池の技術にも触れた。中学校より児童が多く集まり、給食室もある小学校を前提に考えており、建物の強さなどで候補地の優先度はあるとしている。",
            url: NAGASAWA_KAIKEN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策①のページで、学校1校が1年に使う電気を約37万kWh（電気代およそ820万円、市立228校の合計からの換算）とし、校舎の屋上200kW・体育館の屋根120kW・プールの上40kW・駐輪場やフェンス沿い40kWの合計400kW＝46万kWhで、使う電気の1.2倍を屋根の上でつくれると試算している。まず100kWで3割をまかない（30年で約2,000万円の黒字）、その後に屋根を使い切って自給する進め方を示す。福岡市は市内でほとんど発電しておらず県外の大規模発電所に頼る構造だとして、国も分散型エネルギーの方針を打ち出しているとする。防災倉庫については、存在や中身の使い方を知っている市民がどれほどいるかと問い、市などが共催する防災訓練の参加者は4万人以下だとして、倉庫の道具を小学校での日常的なキャンプ利用で使い慣れることを提案している。",
            url: NAGASAWA_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策①の詳細ページで、電気の設計図として5つ（＋その0）を挙げている。その0は使う量を減らすこと（水処理センターの電気の3〜6割を占める曝気を、センサーとAIによる最適化と高効率機への更新で約2割削減）。その1はごみ発電と下水ガスの売電を契約の組み替えで市の建物へ回すこと（投資ほぼゼロで年7億円）。その2は学校・水処理場・市場の屋根と敷地に太陽光（330億円・補助で170億円、年38億円・回収9年）。その3は下水の汚泥ガスで夜の電気をつくること。その4は大型蓄電池を市が買わず民間のものを水処理場の敷地に誘致し、避難所になる学校の蓄電池は国の交付金で市が持つこと。「新しい発明はゼロ。市自身と他都市で動いているものの組み合わせ」としている。避難所になる体育館の冷房は2025年5月時点でゼロ（277棟）、猛暑日は年39日とする数字も挙げる。",
            url: NAGASAWA_KAZENOTANI_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "スタートアップ支援は、市の財布からではなく民間投資を呼び込む構造だとして基本的に肯定的だとする。ただし経済の主役は民間で、行政の第一優先は電気・水・建物などのインフラを安定して持続的に運営することだとしている。市の起業支援の拠点は旧大名小学校の1か所だけで天神まで通えない人は使えないとし、校区の空き教室を相場より安く貸して起業の拠点にし、その収入を学校の維持費に回す案を示す。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-17",
            place: "記者会見",
            source: NAGASAWA_KAIKEN_SOURCE,
            text: "高島市政のスタートアップ支援について、基本的に民間の投資を呼び込んでおり、市のお財布からどんどん出すわけではないとして「基本ポジティブ」だと述べた。ただ経済や盛り上がりをつくる主役は民間だとし、自治体はインフラを安定して運営することが第一優先だとした。財務やベンチャーキャピタルの専門ではないため、自分が前に立って進めるというよりインフラの方に関心があるとしている。人口減少で空き教室が出てくるとして、旧大名小学校のような機能を他の小学校にも一部持たせ、例えば漁業系のスタートアップが海に近い小学校にオフィスを持つような形もあってよいとし、子どもが情熱を持った大人を間近で見られる教育的な効果もあると述べた。",
            url: NAGASAWA_KAIKEN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策①のページで、福岡市の起業支援の拠点は旧大名小学校に1か所だけで、天神まで通えない人は使えないと指摘している。校区の空き教室を使えば実家に戻って会社を始められ、家賃はゼロ、教室の賃料も相場より安くでき、その収入は学校の維持費に回すとする。同じ建物で働く大人を子どもが毎日見ることが「いちばん大きい」としている。",
            url: NAGASAWA_SITE_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "福岡市に副首都を誘致すべきかには「どちらともいえない」としている。指定は国が決めることで検討も国のスケジュールで進むとして、誘致に市の予算を使う前に、小学校を災害時も水と電気が3日止まらない拠点「風の谷」にするなど市内の備えを固めたいとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-14",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "市政運営方針一覧の「よく聞かれる15の問い」で、福岡市に副首都を誘致すべきかに「どちらともいえない」と答え、「指定は国が決めること。検討も国のスケジュールで進む。誘致に市の予算を使う前に、市内の備えを固めたい」としている。小学校を災害時も水と電気が3日止まらない拠点「風の谷」にし、防災倉庫の認知度・習熟度を上げるとしている。",
            url: NAGASAWA_HOUSHIN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "商業で地域を盛り上げる主役は民間だとし、行政が経済圏を作り出すビジョンは少し行き過ぎているとして、行政はインフラ整備やサポート、挑戦する民間の支援や既にある観光資源の発信にとどめるべきだとしている。福岡城の天守の復元的整備には「やや反対」とし、形を示す図面がないとして、市のお金で建てるなら着工前に史実の根拠と収支を公開し第三者が数え、民間の寄付で進めるなら妨げないとする。外国人旅行者にはガイドラインを確実に配るとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-14",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "市政運営方針一覧の「よく聞かれる15の問い」で、福岡城の天守を復元的に整備すべきかに「やや反対」と答え、天守を建てたと記す書状は見つかったが形を示す図面はないとして、市のお金で建てるなら着工前に史実の根拠と収支を公開し第三者が数えるとし、民間の寄付で進めるなら妨げないとしている。外国人労働者の受け入れについての問いでは、旅行者にはガイドラインを確実に配るとしている。",
            url: NAGASAWA_HOUSHIN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策③「つくる前に、数える。」のページで、ウォーターフロントネクストや博多ロープウェイ構想は途中でストップし、行政起点の需要があるという見立てからの新規開発が空振りしているとしたうえで、「商業で地域を盛り上げる主役は民間のはずが、行政が経済圏を作り出すといったビジョンは、少し行き過ぎているように思えます。行政はインフラ整備やサポートがメイン、挑戦する民間のサポートや既にある観光資源の発信くらいならいいのですが、本来の役割から外れ過ぎないように気をつけるべきかと」としている。トップページでは、福岡市はこの16年でスタートアップ、観光、MICE、国際金融などで経済成長を遂げてきたが、その一方で副作用が出ているとしている。",
            url: NAGASAWA_SITE_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "「追い出すことも、無制限に受け入れることもしない」とし、言葉と生活のルールを学ぶ仕組みを市が整えるとしている。受け入れの人数は国が決めるが、受け入れた後の暮らし（言葉・ごみ・学校・相談）を整えるのは市の仕事で、そこが後回しになっているとする。ドイツが国の制度にした「統合コース」と同じ型の講座を、国の制度を待たずに福岡市で始めたいとし、学ぶ場は風の谷になる小学校・老人いこいの家・公民館などいまある場所でつくるとする。人手不足対策として外国人労働者の受け入れを推進することには「やや反対」としている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-18",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "課題のページを8つに整理し直し、現在の課題④を「日本語を自由に話せる外国人は、半分もいない」としている。日本語を自由に話せる外国人は44.3%（市の目標60%）で、母語の支援員は0人だとし、福岡の外国人住民は61,365人（人口の3.77%）で1年で約6千人増えたとする。「受け入れの人数は国が決める。受け入れた後の暮らし（言葉・ごみ・学校・相談）を整えるのは市の仕事で、そこが後回しになっている」としている。",
            url: NAGASAWA_ISSUES_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "見える化ページの「外国人住民と、どう暮らすか」で、「追い出さない。無制限にも受け入れない。言葉と生活のルールを学ぶ仕組みを、市が整えます」としている。福岡県は留学・技能実習・特定技能という期限付きの在留資格が約46%（全国は約30%）を占めるとして、言葉と暮らしのルールを伝える仕組みは1回きりの説明会ではなく毎年くり返し回るものである必要があるとする。「よく聞く話と、公的な数字」として、生活保護・外国人犯罪・国民健康保険・土地取得についての公的な数字を並べ、国民健康保険では外国人は加入者の4.0%で使った医療費は全体の1.39%とする一方、保険料の収納率は63%で全体の93%より低く「未納は実際にある課題」だとしている。市の受け入れ体制では、日本語の指導が必要なのに受けていない子が96人いること、外国人住民が26%増えた2年間で外国人の相談者は9%減ったこと、外国人住民が参加する会議がないこと、ごみや騒音の苦情の件数を市が区ごとに整理していないことを挙げる。ドイツが2005年に国の制度にした「統合コース」（ドイツ語600コマと社会の仕組み100コマ）を紹介し、「国の制度を待たずに、福岡市で同じ型の講座を始めたいと考えています」としている。",
            url: "https://kantanagasawa.com/mieruka.html#sec-foreign",
          },
          {
            date: "2026-10-14",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "市政運営方針一覧の「外国人」で、「追い出すことも、無制限に受け入れることもしない。言葉と暮らしのルールを学ぶ場を、風の谷になる小学校・老人いこいの家・公民館など、いまある場所で」としている。根拠の数字として、外国人住民は約2倍（2015年9月の2.9万人から2026年8月の6.1万人）になったが国の制度はなく（2028年度に試行）、日本語教師等の53.1%がボランティアで、ドイツは600時間、フランスは義務であることを挙げる。「よく聞かれる15の問い」では、人手不足対策として外国人労働者の受け入れを推進すべきかに「やや反対」と答え、人手不足を移民で補いながら言葉と暮らしのルールを学ぶ仕組みを後回しにしてきたとして、定住者には学ぶ環境を、旅行者にはガイドラインを確実に配るとしている。",
            url: NAGASAWA_HOUSHIN_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "「ポケットに、市役所を。」として、市が配信する10個のアプリを一つのスーパーアプリにまとめ、定型事務を10分の1にして人手を人にしかできない仕事へ回すとしている。申請・相談・進み具合の確認を一か所にまとめ、7区に「書かない窓口」を置き、電話の一次応対はAIが受けるとする。市民限定の匿名SNSから小中高生も条例づくりに参加できる仕組みをつくるとし、職員は解雇せず自然減と配置転換で移すとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-17",
            place: "記者会見",
            source: NAGASAWA_KAIKEN_SOURCE,
            text: "AIでソフトウェアのパワーが安く手に入る時代になったとし、市役所の業務システムを統合して一つのアプリにまとめる際に、SNSのようなタイムライン機能を実装して小学生・中学生・高校生にも参加してもらい、意見を吸い上げて条例の議論の要素として活用できる仕組みをつくりたいと述べた。子どもでも条例づくりに参加できる仕組みだとしている。そのタイムラインで市の事業の進捗を定期的に共有し、市民がどう見ているかを議会も情報として扱えるようにすれば、事業の実行や開始の判断の精度を上げられ、より「筋肉質な」財政になるとした。",
            url: NAGASAWA_KAIKEN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策②のページで、市役所業務の徹底した省人化による人的リソースの確保と再配分を掲げている。DXを進めてきたはずの福岡市の職員数は5年で2,010人（12.2%）増えており、省人化に向かっているとは言い難いとする。市役所アプリは完全な外部委託ではなく職員や市民と一緒に開発・運営するとし、手続きは年1,020万件で1件10分と置くと年約170万時間＝職員900人分にあたるとして、この手間を10分の1にするとしている。根拠としてつくば市の実測でRPAだけで定型業務の作業時間が79〜83%減った例、さいたま市の保育所選考で延べ約1,500時間の計算が数秒になった例を挙げ、基幹システムの入れ替え（2030〜32年）をまたいで10年で達成するとする。アプリには福岡市民限定の匿名SNS機能も実装し、そのやり取りを条例の素案づくりに生かせないか検討するとしている。",
            url: NAGASAWA_SITE_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策②の詳細ページで、4年間でやることを8つの工程として示している。①職員用アプリで記録や転記を機械が先に行い職員は確認して確定する（最初の100日で1〜2区、入力データはAIに学習させない）、②全手続きを「完全自動／機械が処理して人が確定／人が主役でAIが支える／人にしかできない」の4つに分けた線引きの表を公開し、裁量のある処分は人が最終確定、③7区すべてに「書かない窓口」（窓口は減らさず浮いた人手で対面を手厚く）、④申請・相談・進み具合・給付の「受け取る」ボタンを一つのアプリに、⑤電話の一次応対をAIが受け正答率の基準を先に決める、⑥2028年度に市民限定の匿名SNSを1テーマで試し2029年度に条例素案を議会に出せるか判断する（決めるのは人と議会）、⑦職員は解雇せず定年などの自然減と配置転換で定型事務から学校の事務・支援や区の福祉相談へ移し人数を毎年公表、⑧2030〜32年完了の基幹システム入れ替えに自動化と線引きを組み込む。なりすましや荒らしを抑えきれない場合や参加者が偏った場合は広げずに止めて直すとしている。",
            url: NAGASAWA_AI_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "「つくる前に、数える」として、10億円以上の事業は収支計画・損益分岐点・需要予測の前提・30年の維持費・撤退基準を、議会に出す60日以上前に公開し、条例で置く第三者委員会を通してから議会へ出すとしている。供用3年後と10年後に「約束と結果」を並べて公開する答え合わせを制度にするとし、自らの政策である風の谷も最初に同じ手続きに通すとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-17",
            place: "記者会見",
            source: NAGASAWA_KAIKEN_SOURCE,
            text: "政策の3つ目に「つくる前に数える、常に学ぶ議会」を置いた。さまざまな自治体の仕事に関わる中で、経営計画が明確でないまま建設してしまうことがあると学んだとし、大きなお金を投資する際に本当にうまくいきそうかの評価を第三者の審議会に依頼する方法を北九州市などがとっていると述べた。福岡市の財政がすごく切迫しているわけではないが、これから積み立ても必要になるとして、大きめの投資をする事業は第三者の客観的な意見を参考に進めたらよいとしている。",
            url: NAGASAWA_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "政策③の詳細ページで「関所条例」の骨子案を示している。対象は10億円以上の事業（分けても合算）で、予算に載せる前に収支計画・損益分岐点・需要予測の前提・30年の維持費・撤退基準を誰でも見られる形で公開し、条例で置く7人の第三者委員会（利害関係者は外し会議は公開）と市民の意見・予測を経て議会に出すとする。根拠として、市議会は2024年2月から2026年9月までの14会期で市長提出議案700件を否決0・修正0だったこと、着工前の市のルールで止まった事業は0件で、市独自の事前評価がない（北九州市にはある）ことを挙げる。人工島では市が自ら買った土地が確認できた分で約218億円あり、「完売・152億円の黒字」の中に入っているとして「数字が、決めた結論を飾る道具になっていた」とする。議会の権限は縛らず市長が自分に課す手続きだとし、市の建物と水道の修理・建て替えが今後30年で約5兆円（年平均約1,700億円、市の試算）になることも挙げている。",
            url: NAGASAWA_KANSHO_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "課題の一つに「歩いて行ける距離に、顔見知りがいない」を挙げ、校庭が狭く公園でボール遊びが禁じられるなど、家庭の外で体を動かしいろいろな人と出会う機会が減っているとしている。自治会に積極的に関われるのは恵まれた一部だとして、「参加する」場所ではなく「来るだけでいい」場所をつくり（週1回、同じ机でごはん）、公民館・老人いこいの家の機能を小学校に統合するとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-18",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "課題のページを8つに整理し直し、現在の課題③を「歩いて行ける距離に、顔見知りがいない」としている。校庭は子ども1人あたり約30㎡で全国平均の約半分（試算）だとし、市街地が広がり公園には「ボール遊び禁止」の看板があって、家庭の外で体を動かし、自然に触れ、いろいろな人と出会う機会が減っているとする。大人も同じだとして、市が高齢者のために置いた老人いこいの家を使ったことがある高齢者は6.1%だとしている。",
            url: NAGASAWA_ISSUES_URL,
          },
          {
            date: "2026-10-14",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "市政運営方針一覧の「地域コミュニティ」で、「自治会に積極的に関われるのは恵まれた一部。だから『参加する』場所ではなく『来るだけでいい』場所をつくる（週1回、同じ机でごはん）。公民館・老人いこいの家の機能を小学校に統合」とし、自治会長の58%が70歳以上で、加入率は5年で85.7%から81.1%に下がり、世帯の54.5%が一人暮らし（2025年）だとしている。",
            url: NAGASAWA_HOUSHIN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: NAGASAWA_SITE_SOURCE,
            text: "課題のページで、現在の課題として①子どもと大人の心の不調、②遊び・育ち・集まる場の減少、③外国人住民を迎える仕組みの遅れ、未来の課題として④災害と暑さに強い暮らしとインフラ、⑤人にしかできない仕事に人が集まる仕組み、⑥自然と資源がもたない、そして優先順位として⑦決め方が見えない・声が届かない、の7つを挙げ、それぞれ統計と出典を添えている。",
            url: NAGASAWA_ISSUES_URL,
          },
        ],
      },
    },
  },
  {
    id: "sasaki-ayano",
    no: "10",
    name: "佐々木 彩乃",
    kana: "ささき あやの",
    age: 29,
    title: "一般社団法人代表理事",
    party: "無所属",
    lead: "「タスキをつなぐ。動かそう、福岡を新しいステージへ。」を掲げる。高島市政16年で築かれた成長の基盤という「タスキ」を受け継ぎつつ、単なる継承ではなく、成長を一人ひとりの豊かさと安心に変えるとして、8つの分野の政策集を公開している。",
    bioSource: `${SASAKI_SITE_SOURCE}／${SASAKI_PROFILE_SOURCE}／${SASAKI_KAIKEN_SOURCE}／${SASAKI_FBS_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1997年、長崎県生まれ。父の転勤で各地に住み、東日本大震災は北関東で経験した。父方の祖父母が福岡市に住み、これまでで最も長く過ごしたのは福岡だとしている",
      },
      {
        label: "学歴",
        text: "2020年に九州大学法学部を卒業。次世代リーダー育成プログラム「シュワルツマン・スカラーズ」（清華大学）に全額奨学生として選出され、国際関係の修士号を取得。コロナ禍のため福岡からオンラインで受講したとしている",
      },
      {
        label: "職歴",
        text: "2020年9月にボストン・コンサルティング・グループに入社し、公共部門で経済産業省・内閣府・デジタル庁などの政策立案や実行支援に従事。内閣府への常駐も経験し、福岡オフィスの立ち上げに参画して福岡に戻ったとしている",
      },
      {
        label: "2025",
        text: "一般社団法人カタリスト九州を設立し代表理事。「Davos50（世界を変える若者50人）」に選出され、世界経済フォーラム年次総会（ダボス会議）にその年の日本人最年少として出席。1月からは九州朝日放送『アサデス。』にコメンテーターとして出演。世界経済フォーラムの「Global Shapers Community Fukuoka」の代表も2025年まで務めた",
      },
      {
        label: "2026",
        text: "9月18日に出馬表明の記者会見。9月に選挙用の公式サイトを開設し、10月20日に政策発表の記者会見を行って8つの分野の政策集を公開",
      },
    ],
    claims: [
      {
        label: "大切にしたいこと",
        text: "出馬表明の会見で、①一人ひとりの豊かさ、②暮らす人の安心安全、③福岡らしさが生き続けるまちづくり、の3つを挙げた。",
      },
      {
        label: "継承と変化",
        text: "「守るべきものは守る、変えるべきものは変える」とし、ハードの建物ができた後に中身を埋めるのは質の違う挑戦だとして、単なる継承ではだめだとしている。",
      },
      {
        label: "立場",
        text: "無所属で、特定の団体の支援を受けずに立候補するとし、政党に応援を依頼する予定もないとしている。そのため10年先・20年先を見据えて何が本当に大切かを考えて決断できるとする。",
      },
      {
        label: "若さ",
        text: "16年前に高島市長が就任したときの姿を思い出すとし、29歳の挑戦を無謀だと思う人もいるだろうとしたうえで、若さは強みになると述べている。",
      },
      {
        label: "政策集",
        text: "2026年10月20日に政策発表の記者会見を行い、政策集を公式サイトで公開した。経済・医療／介護／福祉・防災・暮らし・まちづくり・子育て／教育・若者・ジェンダー／人権の8つの分野に分かれ、分野ごとに番号つきの施策と、「現状：何が課題か？」として出典つきの数字が添えられている。",
      },
      {
        label: "政策集のはじめに",
        text: "福岡は海の向こうへ踏み出す人を送り出し、新しい文化や知恵を迎えてきたまちだとして、挑戦する人が応援され、うまくいかなくても何度でもやり直せ、立ち止まったときには安心して休みだれかを頼れる福岡であり続けたいとしている。「暮らしに安心があるからこそ、人は次の一歩を踏み出せます」とし、政策集は「みなさんとつくる福岡の未来への約束」だとする。",
      },
    ],
    takashimaAssessment: {
      summary:
        "高島市政16年で成長の強固な基盤が築かれたとし、その「タスキ」を受け継ぐとしている。高島市長が立ち上げた、若者の力で地域課題を解決する団体で活動し、その姿を見て市長という職業に夢を抱いたと述べる。一方で、ここからが勝負で単なる継承ではだめだとし、成長を一人ひとりが実感できる豊かさにつなげる必要があるとしている。",
      updated: "2026年9月",
      log: [
        {
          date: "2026-09-18",
          place: "記者会見",
          source: SASAKI_KAIKEN_SOURCE,
          text: "「高島市政16年によって成長の強固な基盤が築かれた」と述べた。大学生の時に、高島市長が立ち上げた若い人の力で福岡の地域課題を解決しようという団体に所属し、3年かけて立て直してリーダーも経験したとし、高島市長が街を元気にしていく様子を身近で見て「福岡市長という職業はこの地域に、人に夢を与えられる職業なんだ」と感じたと述べた。一方で「ここからが勝負」とし、高島市政16年がつくった成長の基盤を本当に生かせるかはこれからで、「単なる継承ではダメなのだ」としている。高島市長には出馬を決めた際に報告し、次世代にタスキをつなぐと宣言しているから頑張りなさいと応援の言葉をもらったが、それ以上の支援の話はないとしている。",
          url: SASAKI_KAIKEN_URL,
        },
        {
          date: "2026-09-18",
          place: "本人YouTube",
          source: SASAKI_MOVIE_SOURCE,
          text: "出馬表明の動画を公開し、「この16年間で築かれた力強い成長の『タスキ』をしっかり受け継ぎます。そして、まちの成長を、市民一人ひとりの豊かさや安心に変えていく」としている。",
          url: SASAKI_MOVIE_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト", url: SASAKI_SITE_URL },
      { label: "本人サイト（政策集・8つの分野）", url: SASAKI_POLICY_URL },
      {
        label: "本人サイト（政策集 PDF版・76ページ）",
        url: SASAKI_POLICY_PDF_URL,
      },
      {
        label: "本人YouTube（政策発表記者会見）",
        url: SASAKI_SEISAKU_KAIKEN_URL,
      },
      { label: "カタリスト九州（プロフィール）", url: SASAKI_PROFILE_URL },
      {
        label: "報道（NHK）",
        url: "https://news.web.nhk/newsweb/na/nb-5010035413",
      },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "sasaki-ayano.jp",
        url: SASAKI_SITE_URL,
      },
      {
        kind: "X",
        handle: "@sasaki_ayano_",
        url: "https://x.com/sasaki_ayano_",
      },
      {
        kind: "YouTube",
        handle: "@sasaki.ayano.fukuoka",
        url: "https://www.youtube.com/@sasaki.ayano.fukuoka",
      },
      {
        kind: "TikTok",
        handle: "@sasaki.ayano.fukuoka",
        url: "https://www.tiktok.com/@sasaki.ayano.fukuoka",
      },
      {
        kind: "Instagram",
        handle: "@sasaki.ayano.fukuoka",
        url: "https://www.instagram.com/sasaki.ayano.fukuoka/",
      },
      {
        kind: "Facebook",
        handle: "sasaki.ayano.fukuoka",
        url: "https://www.facebook.com/sasaki.ayano.fukuoka",
      },
      {
        kind: "note",
        handle: "note.com/sasaki_ayano",
        url: "https://note.com/sasaki_ayano",
      },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "政策集の「子育て・教育」で、支援の仕組みはあっても探し方が分からず、窓口が変わるたびに同じ説明をくり返さなければならないのが今の福岡だとしている。節目ごとに使える制度を市から届け、申請も予約もスマホで24時間、一つの入口からできるようにするとする。妊娠から就学まで一つの支援チームが家庭に寄り添い、急な病気や仕事でも預け先を見つけられるようにし、夏休みなども子どもの食事と居場所を確保するとしている。学校以外も含めて学ぶ場所を選べるようにし、学習・発達・家庭の課題を一つの支援計画で支えるとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「06 CHILDREN 子育て・教育」で「こどもの成長と未来を、地域で支える福岡へ」を掲げ、仕事と子育ての両立に悩むとき、子どもが急に熱を出したとき、学校に行きづらくなったときに「だれに頼ればいいか分からない」という声をたくさん聞いてきたとしている。支援の仕組みはあっても探し方が分からなかったり、窓口が変わるたびに同じ説明をくり返したりしなければならないのが今の福岡だとする。5つの施策として、①必要な支援が届きスマホで24時間いつでも申請できる福岡へ（節目ごとに使える制度を市から届ける、申請も予約も一つの入口から）、②困ったときに頼れる人がいて孤立せず子育てできる福岡へ（妊娠から就学まで一つの支援チームが家庭に寄り添う、急な病気や仕事でも預け先を見つけられるようにする、夏休みなども子どもの食事と居場所を確保する）、③一人ひとりに合う学び方を選び学びとつながりを切らさない福岡へ（学校以外も含めて学ぶ場所を選べるようにする、学習・発達・家庭の課題を一つの支援計画で支える、好きなことを所得や学校に関係なく深く学べる機会をつくる、学校に相談した後の対応をどの学校でも同じ水準にする）、④先生が授業と子どもに全力で向き合える福岡へ、⑤ふるさとを知り自分で考えて動ける子どもを育てる福岡へを挙げている。教員の時間外勤務は改善傾向にあるが中学校では約29%、小学校では約23%が月45時間を超えているとして、市が掲げる2029年度までの「月平均30時間以下」「月45時間以下100%」という目標について、未達成の学校には業務改善の専門家と追加スタッフを配置するとしている。",
            url: SASAKI_POLICY_CHILDREN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: SASAKI_SITE_SOURCE,
            text: "政策の6分野の一つに「子育て・教育」を挙げ、「子どもの成長と未来を、地域で支える福岡へ」としている。サイトの掲載は政策の一部の抜粋で、近日中に正式な政策発表を行う予定だとしている。",
            url: SASAKI_SITE_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "政策集の「医療・介護・福祉」で、介護が始まった日から本人と家族を一つの窓口で支えるとし、夜間や緊急時の不安をなくすサービス、身近な場所に泊まれるサービスなどを挙げている。介護「福岡モデル」で人手不足と処遇を同時に改善するとする。救急出動が10年で36.1%増えた一方で救急隊の増加は21.4%にとどまるとして、救急車を必要な人へ早く届ける仕組みをつくり、自宅で療養しても夜や急変時まで医療が切れない体制を整えるとしている。健診・運動・こころの支援を身近にし、特定健診受診率を2030年度までに40%へ引き上げるとする。住まいでは、年齢や家族の事情を理由に住まいをあきらめない福岡へとして、貸す人の不安も減らす仕組みをつくるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「02 HEALTH & CARE 医療・介護・福祉」で「だれもが安心して歳を重ねられる福岡へ」を掲げ、介護する家族のおよそ半分が「夜間や緊急時の安心」を求めているとしている。4つの施策として、①必要な医療が届きこころもからだも健やかに暮らせる福岡へ、②介護する人も介護を受ける人も安心して暮らせる福岡へ、③子どもも障がいのある人も家族も切れ目なく支えられる福岡へ、④デジタルで市民の手続きも医療・福祉の現場の負担も減らす、を挙げる。数字として、救急車の出動件数が10年で36.1%増えたのに対し救急隊の数は21.4%増にとどまり、搬送された人の45.2%は診察後に「入院を必要としない軽症」と判断されたこと（福岡市消防局「令和7年消防年報・救急統計」）、介護する人の52.3%が在宅介護を望む一方で仕事をしている介護者の56.3%が勤務時間を変えたり休暇を取ったりしながら介護していること、市内事業所の54.3%が訪問介護員に、47.7%が介護職員に不足を感じていること（福岡市「第9期福岡市介護保険事業計画」ほか）を挙げている。個別の施策として、介護が始まった日から本人と家族を一つの窓口で支えること、介護「福岡モデル」で人手不足と処遇を同時に改善すること、年を重ねても役割・つながり・行き先がある地域をつくること、健診を受けていない人へ受診方法まで個別に案内して特定健診受診率を2030年度までに40%へ引き上げること、妊娠前から子育てまで同じ担当者がつないで支えること、障がいがあっても親の年齢に左右されず地域で暮らし働けるようにすることを挙げる。",
            url: SASAKI_POLICY_CARE_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「04 LIVING 暮らし」で、年齢や家族の事情などを理由に住まいをあきらめない福岡へとして、貸す人の不安も減らして「断られにくい」仕組みをつくること、生活のルールと相談先を新しく福岡で暮らす人へ確実に届けること、外国人住民と地域が共通のルールで安心して暮らせるようにすることを挙げている。",
            url: SASAKI_POLICY_LIVING_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: SASAKI_SITE_SOURCE,
            text: "政策の6分野の一つに「介護」を挙げ、「誰もが安心して年齢を重ねられる福岡へ」としている。サイトの掲載は政策の一部の抜粋で、近日中に正式な政策発表を行う予定だとしている。",
            url: SASAKI_SITE_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "政策集の「暮らし」で、渋滞を減らし車がなくても移動できる福岡へを掲げ、バスの減便を防いで交通が不便な地域をなくすとしている。鉄道・バスへの投資と混雑をずらす工夫を同時に進めるとし、最も混む西鉄貝塚線の混雑率169%は東京圏の平均143%を上回り、七隈線と空港・箱崎線も130%前後だとする。若者向けには25歳以下が使える「FUKUOKA U25パス」をつくるとし、まちづくりでは都心からウォーターフロントへの新しい交通網を検討するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「04 LIVING 暮らし」で、「朝の電車やバスが混んで、通勤がつらい」という声をたくさん聞いてきたとして、渋滞を減らし車がなくても移動できる福岡へを掲げている。国土交通省「都市鉄道の混雑率調査」（2026年7月）として、最も混む西鉄貝塚線の混雑率は169%で、2025年度の東京圏平均143%を上回り、七隈線と空港・箱崎線も130%前後だとし、一方で移動手段が少ない地域もあり運転士の人手不足も課題だとする。施策として、バスの減便を防いで交通が不便な地域をなくすこと、鉄道・バスへの投資と混雑をずらす工夫を同時に進めることを挙げている。",
            url: SASAKI_POLICY_LIVING_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「07 YOUTH 若者」で、交通費や最初のお金を理由に「やってみたい」をあきらめない福岡へとして、25歳以下が使える「FUKUOKA U25パス」をつくるとしている。",
            url: SASAKI_POLICY_YOUTH_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「05 COMMUNITY まちづくり」で、海辺と都心を休日も仕事終わりも出かけたくなる場所にするとして、都心からウォーターフロントへの新しい交通網を検討するとしている。",
            url: SASAKI_POLICY_COMMUNITY_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: SASAKI_KAIKEN_SOURCE,
            text: "日本全体が東京に集中するように福岡全体が天神に一極集中しているため、交通の面で問題を感じている人が多いと述べた。市も地下鉄の本数や車両を増やす、企業と連携して通勤ラッシュをずらし混雑を緩和するといった取り組みをしているが、ハードでできることには限りがあるとして、企業と連携して人が天神に集まり出ていく流れをつくることにはやり残しがあるのではないかとした。また福岡は7区でできており、例えば西区には九州大学があるなど各区の特色を生かしたまちづくりには踏み切れていないとして、天神を経由せず横に移動していく人の流れを含めた全体のプランを描くのは福岡市だからこそできるとし、人の動きをデザインするソフトの部分も民間と協力して考えたいと述べた。",
            url: SASAKI_KAIKEN_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "天神ビッグバンで建て替わったビルを埋めきれるかが課題だとし、「ビルの魂になるビジネス」を入れていく必要があるとしている。政策集では、海辺を福岡の文化とエンターテインメントの中心にするとし、市民が都心の公園や広場を使いやすくすること、都心からウォーターフロントへの新しい交通網を検討することを挙げる。住まいでは、新築分譲マンション価格が2年で33%上昇したとして、家族で暮らせる住まいを増やして住み替えを支え、住むための住宅を増やして地域の暮らしを守るとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「05 COMMUNITY まちづくり」で、海辺と都心を休日も仕事終わりも出かけたくなる場所にするとして、海辺を福岡の文化とエンターテインメントの中心にすること、市民が都心の公園や広場を使いやすくすること、都心からウォーターフロントへの新しい交通網を検討することを挙げている（出典として福岡市「ウォーターフロント地区再整備の方向性」などを示している）。",
            url: SASAKI_POLICY_COMMUNITY_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「04 LIVING 暮らし」で、「家賃やマンションの値段が上がって、住み続けられるか不安」という声をたくさん聞いてきたとして、家族が増えても手が届く住まいを選べる福岡へを掲げている。新築分譲マンション価格が2年で33%上昇したとし、市が高額物件などを中心に抽出した38棟では住民登録のない住戸の割合が平均18.0%だったとしつつ、「これは市内の全マンションを表す数字ではありません」と断り、市全体では購入後1年以内の売却や国外に住所がある人による取得はいずれも1〜2%程度で一部の高額・高層物件に偏る傾向が見られたとしている。施策として、家族で暮らせる住まいを増やして住み替えを支えること、住むための住宅を増やして地域の暮らしを守ることを挙げる。",
            url: SASAKI_POLICY_LIVING_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: SASAKI_KAIKEN_SOURCE,
            text: "「かっこいいビルが立ちました。では私たちは次はその中身をしっかりと考えていかなければなりません。ビルの魂になるビジネスをしっかりと入れていかなければなりません」と述べ、10年後、20年後に空きテナントが目立つ状況は見たくないとした。天神ビッグバンで新しいオフィスができる中、福岡や九州を対象にしたビジネスだけでは賃料が上がる中で借りられるのかという問題が出てくるとし、できたビルをしっかり埋めきれるかが課題だとしている。また、まちにはA面とB面が必要だとし、機能を持ったしっかりとしたビルも必要だが、一歩路地に入れば若い人たちがいろんな挑戦をしていて福岡らしい店が並んでいる、そうしたコントラストこそがまちを面白くし続けると述べた。",
            url: SASAKI_KAIKEN_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "政策集で「167万人の命と暮らしを守りきる」を掲げ、警固断層をはじめとする大地震に備えて最新の地震想定に合わせた耐震化と火災対策を急ぎ、被災後の住まいとまちの再建を災害前から準備するとしている。猛暑と豪雨への対策として、まちの中の浸水を予測して地下空間と住宅の被害を減らし、歩いて休める涼しい場所を増やすとする。避難した後も命・健康・尊厳を守れる福岡へとして、参加したくなる防災訓練をつくり、乳幼児・女性・障がいのある人・外国人・ペット連れにも安心を届け、災害でも医療・薬・介護を止めないとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-28",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "10月28日の時点で、政策集のWebページの防災の見出しが「168万人の命と暮らしを守りきる」から「167万人の命と暮らしを守りきる」に改められ、1つ目の施策の見出しも「警固断層をはじめとする大地震に備える」になっていた（10月21日の時点では168万人）。あわせて、8つの分野の政策を1冊にまとめた政策集のPDF版（76ページ）が公開されているが、PDF版の見出しは168万人のままになっている。",
            url: SASAKI_POLICY_BOSAI_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「03 DISASTER RESILIENCE 防災」で、東日本大震災を経験して日常がいかに簡単に崩れ去るのかを実感したとし、「私は学校で、弟は家で、母は車で、父は会社で被災しました」と記している。台風や豪雨・水害によって福岡市内でも死者を出したことがあり、酷暑による熱中症被害も年々深刻化しているとして、災害は場所もタイミングも選んでくれないとする。3つの施策として、①警固断層をはじめとする大地震に備え命と暮らしを守る（最新の地震想定に合わせた耐震化と火災対策、被災後の住まいとまちの再建を災害前から準備する）、②猛暑と豪雨から命と暮らしを守る（まちの中の浸水を予測して地下空間と住宅の被害を減らす、歩いて休める涼しい場所を増やして熱中症を防ぐ、光熱費を下げ停電にも強い脱炭素を進める）、③避難した後も命・健康・尊厳を守れる福岡へ（参加したくなる防災訓練をつくり全市民に備えを届ける、乳幼児・女性・障がいのある人・外国人・ペット連れにも安心を、災害でも医療・薬・介護を止めない）を挙げている。出典として福岡県「地震に関する防災アセスメント調査」、福岡市「災害避難所の充実について・請願審査資料」（2026年5月）を示している。",
            url: SASAKI_POLICY_BOSAI_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「05 COMMUNITY まちづくり」で、周りのまちと力を合わせ水不足と浸水に強い福岡へとして、水源のまちと常設で話し合いともに投資すること、家庭・会社・公共施設に雨をためる仕組みを広げることを挙げている。",
            url: SASAKI_POLICY_COMMUNITY_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: SASAKI_KAIKEN_SOURCE,
            text: "東日本大震災の時に北関東に住んでいて、家族がばらばらの場所で被災したとし、自然災害は起こった瞬間に当たり前を根こそぎ奪っていくと述べた。福岡は警固断層や、気候変動による豪雨のリスクが高まっているとして、「福岡市長としては必ず167万人の命を守りきること」とし、起こった後すぐに安心安全な暮らしを取り戻せる準備ができているかがとても大きな問題だとしている。優先して実現したいことを問われて災害対策を挙げ、地震が起きた瞬間にどこに逃げ、その後どう生活を続けるかという市民一人ひとりのプランに不安があるとした。建物の耐震化などのハードは進んでいるが、ソフトの面がまだまだ追いついていないとして、両方を備えていきたいと述べた。",
            url: SASAKI_KAIKEN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: SASAKI_SITE_SOURCE,
            text: "政策の6分野の一つに「防災」を挙げ、「災害から命を守り、災害後も安心して暮らせる福岡へ」としている。",
            url: SASAKI_SITE_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "政策集の1番目に「経済」を置き、企業の成長を働く人の給料アップにつなげるとしている。1人当たりの報酬の伸び3.6%が物価の伸び8.1%に届いていないとして、市の企業支援を企業数や雇用人数だけでなく賃金・正社員雇用・定着まで見る仕組みに変え、賃上げを約束しただけでは補助を増やさず実績を確認してから上乗せ分を支払うとする。市の工事の入札で賃上げを計画する企業を加点し、人件費が上がったら決めたルールで契約額を見直すとしている。中小企業の稼ぐ力、女性の就労支援、世界に挑む起業家の育成、若者と地元企業の出会いも柱に挙げる。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「01 ECONOMY 経済」で「企業の成長を、一人ひとりの暮らしの豊かさにつなぐ福岡へ」を掲げ、「会社が成長しても、そこで働く一人ひとりの暮らしが豊かにならなければ、まちが本当に元気になったとは言えません。だから私は、市のお金の使い方を変えます」としている。数字として、雇われて働く市民が15.1%増、働く市民への報酬総額が19.2%増の一方、1人当たりの報酬の伸びは3.6%で物価の伸び8.1%に届いていないこと（福岡市「令和4年度福岡市民経済計算」ほか）、福岡市では事業所の99.7%が中小企業で市内事業所で働く人の84.4%を中小企業が雇用していること、中小企業の51.3%が人手不足を今後の課題に挙げ上がった人件費を取引価格に反映できた割合は平均48.3%であること（福岡市「令和8年度中小企業振興に関するアンケート調査結果」2026年7月・回答941社）、市内事業所の女性管理職比率が13.3%で女性管理職が一人もいない事業所が31.5%であること、市内大学を卒業して市内企業に就職した人が27.3%であることを挙げている。施策として、①企業の成長を働く人の給料アップにつなげる（地元企業・大学・金融機関をつなぐ「ふくおか経営人材塾」、地元の大企業で学び自分の会社に戻る「研修出向」の市による仲介、企業数・雇用人数に加え賃金・正社員雇用・定着で評価すること、賃上げを約束しただけでは補助を増やさず実績を確認してから上乗せ分を支払うこと、市の工事の入札で賃上げを計画する企業を加点し大企業3%・中小企業1.5%以上を目安とすること、最低賃金や公的な賃金指数が一定以上上がったときは決めたルールで翌年度の委託料や指定管理料を見直すこと）、②人手不足と物価高を乗り越え中小企業の稼ぐ力を高める、③働き続けたい・挑戦したい女性を職場と子育ての両面から支える、④福岡から世界に挑む起業家・企業を育てる、⑤若者と地元企業が出会いともに成長できる福岡をつくる（長期・有給のインターン、一度外に出ても福岡に戻れる道、開校予定の市立高専を核に学校と地元企業がともに人材を育てる）を挙げる。",
            url: SASAKI_POLICY_ECONOMY_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: SASAKI_KAIKEN_SOURCE,
            text: "九州から本社機能を備え、海外の成長市場でも戦っていける新しいビジネスがこの福岡から生まれ育っていくことに、行政としていかに力を入れていけるかを考えていると述べた。スタートアップ支援の継続について問われ「もちろんです」とし、本社機能を福岡に持つ企業を増やさなければいけないとして、ここから生まれ育つスタートアップをしっかり支援したいとした。一方で福岡は多くが中小企業で、話を聞くと人手不足と物価高の2つが必ず課題に挙がるとし、20代の割合が高い都市として、時間があって挑戦したい大学生など若い世代と、人手が足りない中小企業がまちの中で結びつき、一緒に事業を成長させる連携が始まると面白いと述べている。",
            url: SASAKI_KAIKEN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: SASAKI_SITE_SOURCE,
            text: "政策の6分野の一つに「経済」を挙げ、「企業の成長と働く人の豊かさがつながる福岡へ」としている。",
            url: SASAKI_SITE_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都は福岡が必ず取りに行くべきだとし、副首都になれば多くの機能が福岡に移り、企業が本社を置く判断につながって、長年言われてきた支店経済からの脱却につながるとしている。政策集では、指定されるのは市ではなく県だとして「副首都・福岡県」の実現を掲げ、福岡が代わりに担う国の仕事と使う施設を具体的に決めること、交通・通信・電力・水道を強くすること、県・北九州市と連携協約を結び共同の推進組織と予算をつくることを挙げる。副首都の名前を得ることを目的にせず、市の負担と国の支援、防災上の効果を公表しながら進めるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "記者会見",
            source: SASAKI_SEISAKU_KAIKEN_SOURCE,
            text: "政策発表記者会見で副首都について問われ、福岡が必ず取りに行くべきだと述べた。福岡は何十年も支店経済だと言われ続け、まだ抜けきれていないとし、副首都になることで様々な機能が福岡に移管され、企業にとって福岡に本社・本店を置くことが必要な判断になってくるとして、福岡の経済体質が変わることに大きな意味があるとした。国のお金も入り、副首都にふさわしいインフラや設備を持つ地域になる必要が出てくるため、これまでできなかった投資の意味が出てくるとしている。北九州市や福岡県、県内の自治体と役割分担を議論しながら進めるとし、内容はまだ固まっていないので福岡として提案できるよう地域の連携を深めるとしている。",
            url: SASAKI_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「05 COMMUNITY まちづくり」で、東京一極集中に備え「副首都・福岡県」を実現するとしている。法律では副首都に指定されるのは市ではなく道府県で、10月18日時点では政令は案の段階で指定先も決まっていないとし、福岡県・福岡市・北九州市は10月5日に国へ「副首都・福岡県」の実現を共同で要望したとして、「次に必要なのは、看板を掲げることではなく、どの機能を、どの施設で、だれが担うのかを決めること」だとする。施策として、①福岡が代わりに担う仕事と使う施設を具体的に決める（災害対応・行政の指揮・通信・金融・物流・医療などで東京が動けないとき福岡で何を続けるかを決める、数時間以内に使える拠点を平時から用意する、国の出先機関の権限・人員・設備の強化を国に求める、本社機能や事業継続の拠点を呼び込む、毎年実際に仕事を移す訓練をする）、②副首都を支える交通・通信・電力・水道を強くする（成果は施設の数ではなく復旧時間で測る）、③福岡県・北九州市と責任を持って決められる体制をつくる（正式な連携協約、共同の推進組織と予算、九州全体へのネットワーク）を挙げ、「副首都の名前を得ることを目的にせず、市が負担する費用、国からの支援、福岡の担う仕事、防災上の効果を公表し、市民の意見を聞きながら進めます」としている。出典として福岡県「副首都指定の実現に向けた取組み」、政府「副首都の指定要件に関する政令案」（2026年10月）を示している。",
            url: SASAKI_POLICY_COMMUNITY_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "政策集の「暮らし」で、観光のにぎわいと市民の暮らしが両立する福岡へを掲げ、観光客を受け入れたいと思う市民が51.3%と3年で12.6ポイント減り、混雑やマナーなどの迷惑を感じた市民が55.9%にのぼるとして、観光の負担を数字で確かめ、宿泊税を市民の暮らしに戻すとしている。観光客の時間と行き先を分散し、だれもが歩いて楽しめるまちをつくるとする。まちづくりでは、歴史ある建物を守りながら使い続け、福岡の2000年の歴史をストーリーとして伝えるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「04 LIVING 暮らし」で、「観光客が増えて、近所が落ち着かない」という声をたくさん聞いてきたとして、観光のにぎわいと市民の暮らしが両立する福岡へを掲げている。福岡市「2025年度観光市民意識調査」などとして、観光客を受け入れたいと思う市民は51.3%で3年で12.6ポイント減少し、観光客の来訪で混雑やマナーなどの迷惑を感じた市民は55.9%だとする。施策として、観光の負担を数字で確かめ宿泊税を市民の暮らしに戻すこと、観光客の時間と行き先を分散しだれもが歩いて楽しめるまちをつくることを挙げている。",
            url: SASAKI_POLICY_LIVING_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「05 COMMUNITY まちづくり」で、歴史と文化が毎日の暮らしに息づく福岡へとして、歴史ある建物を守りながら使い続けること、市民の声から身近な文化活動を生み出すこと、福岡の2000年の歴史をストーリーとして伝えることを挙げている。福岡市「福岡市文化芸術振興計画の中間評価」（2025年3月）として、過去1年間に文化芸術を鑑賞した市民は61.7%（目標75%）、文化芸術活動をした市民は16%（目標25%）だとしている。",
            url: SASAKI_POLICY_COMMUNITY_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: SASAKI_KAIKEN_SOURCE,
            text: "福岡が東京化している、「リトル東京」になっているという声を毎日のように聞くのがとても悲しいとし、「福岡は東京でもなく、ニューヨークでもなく、世界中どこを探してもここ福岡にしかない町」だと述べた。これまで受け継いできた歴史や文化を大切にし、芸どころと言われてきた伝統的な文化を守りまちづくりに生かすとしている。オリジナルの色を出す点として、大陸との歴史や福岡と博多に分かれていた時代などの歴史を市民が学び楽しめるまちづくりを挙げ、福岡にはこんなに歴史があるのに観光客に観光するところがないから太宰府に行くと言われることがあるとして、福岡をしっかり味わえるようにしたいと述べた。天神が大きく姿を変える中、若い人に天神を単なるビル群だと思ってほしくないとして、仲間と毎月、天神の街歩きを行っているとしている。",
            url: SASAKI_KAIKEN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: SASAKI_SITE_SOURCE,
            text: "政策の6分野の一つに「まちづくり」を挙げ、「歴史と文化を力に、誇り続けられる福岡へ」としている。",
            url: SASAKI_SITE_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "外国人住民の数を増やす・減らす権限は市長にはなく国が決める部分だとしたうえで、現場の実情を国に伝え続け、県や国と連携するとしている。政策集では、外国人住民と地域が共通のルールで安心して暮らせるようにするとして、交通ルールを多言語の動画と実地講習で伝えること、外国人住民の生活相談と地域住民からのごみ・騒音・交通の相談を一つの窓口で受け、違反には国籍を問わず同じ基準で対応することを挙げる。外国人を受け入れる学校・企業・住宅事業者にも生活説明や日本語学習への協力を求め、日本語教育や悪質な仲介事業者への規制などは国に制度改善と財源を求めるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "記者会見",
            source: SASAKI_SEISAKU_KAIKEN_SOURCE,
            text: "政策発表記者会見で、まちづくりの分野から外国人との共生の問題を取り上げた。住んでいる外国人との共生の問題は特に東区・博多区の市民から声を受けているとし、福岡市の外国人住民で最も多い年齢層は20〜24歳で、日本語学校や大学が多いことが背景にあるとした。市民から「移民を減らしてください」と言われることがあるが、外国人住民の数を増やす・減らす権限は福岡市長にはなく国が決める部分だとし、国が受け入れるだけ受け入れて共生政策を基礎自治体に任せるのではバランスが取れないとして、現場の状況を政府に伝え続け、県・政府と連携するとしている。ごみ出し、自転車の止め方、交通ルール、騒音などの声が区役所や市に寄せられているとして、受け入れ先の学校や大学と連携して学生にルールを徹底してもらうとし、それでも難しい部分は国籍の問題というより人口構造の問題でもあるとして市としての対策を考えるとしている。",
            url: SASAKI_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「04 LIVING 暮らし」で、外国人住民と地域が共通のルールで安心して暮らせるようにするとして、①日本の交通ルール（自転車の走る場所、信号、一時停止、夜間のライト、飲酒運転など）を多言語の動画と実地講習で伝え、事故の多い地域では警察による講習も行う、②外国人住民からの生活相談と地域住民からのごみ・騒音・交通などの相談を一つの窓口で受け、違反には国籍を問わず同じ基準で対応して、繰り返される場合は関係機関と連携して指導する、③外国人を受け入れる学校・企業・住宅事業者にも生活説明・日本語学習・相談対応への協力を求め、市の補助や認定を受ける場合は説明を実施したか確認する、④日本語教育、悪質な仲介事業者への規制、雇用主や監理団体の責任、自治体の相談・教育費用について、県や他都市と連携して国へ制度改善と財源措置を求める、を挙げている。「国籍にかかわらず、みんながまちのルールを守り、真の意味での多文化共生が実現します」としている。新しく福岡で暮らす人には、生活のルールと相談先を分かる言葉で届けるとしている。",
            url: SASAKI_POLICY_LIVING_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "政策集で、申請も予約もスマホで24時間、一つの入口からできるようにし、節目ごとに使える制度を市から届けるとしている。医療・介護では、予約・申請を一つの入口にしてデータと技術で支援を早く届けるとし、DXに取り組んでいる介護事業所が38.7%、必要だと思うが取り組めていない事業所が28.1%だとして、人材と費用が大きな壁になっているとする。まちづくりでは、7つの区すべてに市民の声を聞く場をつくり、区の声をまちづくりの決定につなげるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「06 CHILDREN 子育て・教育」で、必要な支援が届きスマホで24時間いつでも申請できる福岡へとして、節目ごとに使える制度を市から届けること、申請も予約もスマホで24時間、一つの入口からできるようにすることを挙げている。",
            url: SASAKI_POLICY_CHILDREN_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「02 HEALTH & CARE 医療・介護・福祉」で、デジタルで市民の手続きも医療・福祉の現場の負担も減らすとして、予約・申請を一つの入口にしデータと技術で支援を早く届けるとしている。福岡市「令和6年度介護労働に関するアンケート調査」として、DXに取り組んでいる介護事業所は38.7%、必要性を感じながら取り組めていない事業所も28.1%あり、人材と費用が大きな壁になっているとしている。",
            url: SASAKI_POLICY_CARE_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「05 COMMUNITY まちづくり」で、7つの区の声をまちづくりの決定につなげるとして、7つの区すべてに市民の声を聞く場をつくることを挙げている。",
            url: SASAKI_POLICY_COMMUNITY_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "高島市政の16年で、まちの成長を税収につなげ、その税収が暮らしを豊かにする循環が回り始めたとし、ここを強化していくとしている。政策集では「市のお金の使い方を変えます」として、市の企業支援を賃金・正社員雇用・定着まで見る仕組みに変え、支援した企業数だけでなく新たに生まれた正社員の数や定着率、賃金の変化を毎年公表するとする。観光では、観光の負担を数字で確かめて宿泊税を市民の暮らしに戻すとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「01 ECONOMY 経済」で「市のお金の使い方を変えます」とし、市の企業支援も企業数や雇用人数だけでなく、賃金、正社員雇用、長く働き続けられたかまで見る仕組みに変えるとしている。賃上げを約束しただけでは補助を増やさず実際に賃上げしたことを確認してから上乗せ分を支払うとし、支援した企業数だけでなく新たに生まれた正社員の数、1年後・3年後の定着率、賃金の変化を毎年公表するとする。市の発注については、人件費が上がったときにあらかじめ決めたルールに基づいて翌年度の委託料や指定管理料を見直し、増額分が賃金や社会保険料などの人件費に使われたことを確認して、業種別・雇用形態別の賃金変化と賃上げを達成した企業の割合を公表するとしている。",
            url: SASAKI_POLICY_ECONOMY_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: SASAKI_KAIKEN_SOURCE,
            text: "高島市政の16年で、まちの成長を税収につなげ、その税収が暮らしを豊かにするという循環の兆しが見え、回り始めてきたとし、ここをしっかり強化していくと述べた。税収を上げて市民サービスの質と量を上げていくことも一人ひとりの暮らしの豊かさにつながるとしている。",
            url: SASAKI_KAIKEN_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "家賃や物価の高騰で市内に住み続けられるか悩む現役世代の痛みを挙げ、一人ひとりの手取りが増え、実感できる成長につなげるとしている。政策集では「若者」と「ジェンダー・人権」を独立した柱に置き、若者会議と若者予算、全区へのユースセンター設置、市役所の女性管理職を2030年度までに30%へ引き上げること、DV・性暴力への夜も休日も相談できる体制、どんな家族も必要な支援を受けられる福岡を挙げる。まちづくりでは民生委員の仕組みの見直しや令和型の自治会運営、空き店舗と開業したい人をつなぐこと、暮らしでは自転車盗や万引きなど身近な犯罪を減らすことも掲げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「05 COMMUNITY まちづくり」で、「近所にどんな人が住んでいるのか分からない」という声を挙げ、民生委員の仕組みを見直して人と人のつながりを結び直すこと、令和型の自治会運営を実現することを挙げている。福岡市「市政アンケート調査」（2024年度）として、自治会・町内会に加入していると答えた人は71.3%で、加入していない人の50.0%が「加入を勧められたことがない」、28.8%が「役員になることを負担に感じる」と答えたとし、入り方が分からないことと活動の負担が参加の壁になっているとする。",
            url: SASAKI_POLICY_COMMUNITY_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「07 YOUTH 若者」で「若者の声と挑戦を、まちの力に変える福岡へ」を掲げ、自分の声が市政に届いたと感じたことのある若者はどれだけいるかと問いかけている。施策として、「若者会議」と「若者予算」で若者が市政に参加すること、政治や選挙を身近なものにすること、学校でも家でも職場でもない「ユースセンター」を全区につくること、若者が運営する団体を活動費と人の両面から支えること、25歳以下が使える「FUKUOKA U25パス」をつくること、「待つ相談」から若者のいる場所へ出向く相談へ変えること、児童養護施設や里親家庭などを巣立った若者を一つの窓口で支えること、若い女性が暴力や体の悩みを一人で抱えず自分の将来を選べるようにすることを挙げる。数字として、市内大学を2024年3月に卒業した人の53.3%（理系では57.1%）が九州外の国内で就職したこと、市の2025年度調査で若者の最も多い困りごとが家計・お金（40.8%）で、相談できる相手がいない人が20.0%いること、福岡県警察の統計で性犯罪被害者の75.5%が10代・20代であることを挙げている。",
            url: SASAKI_POLICY_YOUTH_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「08 EQUALITY ジェンダー・人権」で「すべての人が尊重され、挑戦できる福岡へ」を掲げている。市の審議会などの女性委員は41%だが51組織のうち14組織は40%に届かず、市役所の女性管理職は21.1%（目標28%）、市議会の女性議員は57人中14人で24.6%、市内事業所の女性管理職比率は13.3%（目標18%）だとする。施策として、女性が一人もいない審議会をなくし審議会ごとに男女それぞれ40%以上60%以下を目指すこと、市役所の女性管理職を2030年度までに30%へ引き上げ局や役職ごとの状況を毎年公表すること、子育てや介護をしながらでも地域や政治に参加できるようにすること、男女の賃金差と正規・非正規の差を小さくすること、DV・性暴力を見逃さず夜も休日も相談できるようにすること、生理用品を申し出ずに使える場所を増やすこと、年齢や性別を問わずからだと性の健康を支えること、対象と手続きを広げて「家族であること」を示しやすくすることを挙げている。",
            url: SASAKI_POLICY_EQUALITY_URL,
          },
          {
            date: "2026-10-20",
            place: "本人サイト",
            source: SASAKI_POLICY_SOURCE,
            text: "政策集の「05 COMMUNITY まちづくり」で、若者が住み商店街で挑戦できる地域をつくるとして、空き店舗率が2017年度の2.6%から2025年度の3.5%へ0.9ポイント上昇したとし、空き店舗と開業したい人をつなぐとする。「04 LIVING 暮らし」では、自転車盗と万引きだけで刑法犯全体の約47%を占めるとして、犯罪の多い場所と手口を絞って地域ごとに対策すること、痴漢・盗撮・性犯罪を減らし被害後も支えることを挙げている。",
            url: SASAKI_POLICY_COMMUNITY_URL,
          },
          {
            date: "2026-09-18",
            place: "記者会見",
            source: SASAKI_KAIKEN_SOURCE,
            text: "一人ひとりの豊かさを考えると現役世代としての痛みも感じているとし、家賃の高騰に物価高が重なって、このまま福岡市内に住み続けられるのか悩む日もあると述べた。契約更新のタイミングで家賃が1.5倍になったという話も聞くとしている。成長の循環を強化し、ビジネスの質を上げることで一人ひとりの手取りが増えていく、一人ひとりが実感できる成長につなげなければならないとした。",
            url: SASAKI_KAIKEN_URL,
          },
          {
            date: "2026-09-18",
            place: "報道",
            source: SASAKI_FBS_SOURCE,
            text: "出馬会見について報じ、「私は今回、無所属で、特定の団体の支援を受けることなく立候補している。何が本当にこの街にとって大切なのか、しなければいけないことなのか。それを考えて決断できる」との発言を伝えている。",
            url: SASAKI_FBS_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: SASAKI_SITE_SOURCE,
            text: "政策の6分野の一つに「暮らし」を挙げ、「住む人を第一に、暮らし続けたい福岡へ」としている。",
            url: SASAKI_SITE_URL,
          },
        ],
      },
    },
  },
  {
    id: "jinno-genki",
    no: "11",
    name: "神野 元基",
    kana: "じんの げんき",
    age: 41,
    title: "学校法人東明館学園 理事長・東明館中学校・高等学校 校長",
    party: "無所属",
    lead: "「人間力で、福岡をもっと前へ。」を掲げる。AI型教材を開発した教育ベンチャーの創業者で、国の教育行政の委員も務める。高島市政の発展を高く評価したうえで、その発展をまだ市民のものにできていないとし、対話と合意形成で「みんなのもの」にするとしている。",
    bioSource: `${JINNO_SITE_SOURCE}／${JINNO_KAIKEN_SOURCE}／${JINNO_SCHOOL_SOURCE}／${JINNO_RKB_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1985年、北海道網走市生まれ。福岡市中央区在住。慶應義塾大学総合政策学部を中退して教育ベンチャーを創業した。福岡を「第二の故郷」だとしている",
      },
      {
        label: "2010",
        text: "米国シリコンバレーで事業に挑戦",
      },
      {
        label: "2012",
        text: "株式会社COMPASSを創業し、八王子市で学習塾を開校。2016年にAI型教材「Qubena」を公開し、いまは全国で約100万人の子どもが学校で使っているとしている",
      },
      {
        label: "2019",
        text: "文部科学省・中央教育審議会の臨時委員に就任（現職）。1人1台の端末と校内の高速通信を整備するGIGAスクール構想の審議に関わったとしている。2020年には経済産業省・産業構造審議会の委員も務める",
      },
      {
        label: "2021",
        text: "宮崎市教育委員会の教育CIO（最高情報責任者）に就任し、市内の小中学校の改革に携わる。2025年には佐賀市教育委員会の教育ビジョン策定委員にも就任",
      },
      {
        label: "2022",
        text: "東明館中学校・高等学校（佐賀県基山町）の校長に就任。2023年4月からは学校法人東明館学園の理事長を兼任",
      },
      {
        label: "著書・メディア",
        text: "著書に『人工知能時代を生き抜く子どもの育て方』（ディスカヴァー・トゥエンティワン、2017年）。RKB毎日放送「タダイマ！」のコメンテーターを務める",
      },
      {
        label: "2026",
        text: "9月24日に出馬表明の記者会見。出馬にあたって学校の肩書きは現時点では変えないとしている。10月に公式サイトを開設し、10月16日に政策発表の記者会見",
      },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「人間力で、福岡をもっと前へ。」を掲げ、「人間を心から信じている、人間を最後まで絶対に諦めない」としている。市民と向き合う力では他の候補者に負けないと述べる。",
      },
      {
        label: "市民のものに",
        text: "福岡は自然・都市・人間・文化がまれに見るバランスで調和した街だとし、これまでの発展を市民の手で「自分たちのもの」にしていくことが必要だとしている。",
      },
      {
        label: "対話と合意形成",
        text: "校長として、27ページあった校則を生徒との対話で6行にした経験を挙げる。「一人ひとりの自由は他人の自由を侵害しない範囲で」という考え方を生徒と共有し、意見が異なっても対話で合意できるとする。まず自分が動き、みんなで考え、みんなで決める「I do. We do.」が「人間力」の原点だとし、市政でもタウンミーティングなどで市民と直接話す機会をつくるとしている。",
      },
      {
        label: "4つの力",
        text: "2026年10月16日に政策発表の記者会見を行い、「次へ。前へ。その先の福岡へ。」として4つの力を育てるとしている。学ぶ力（教育）＝子どもの「やりたい」から始まる学校へ、支え合う力（福祉・介護）＝誰も取り残さない、挑む力（産業）＝挑む人が報われる福岡へ、決める力（政治への信頼）＝民主主義への信頼をもう一度。会見では、4つのうち最も重視するのは「民主主義への信頼」で、全員に関わる話だからだと述べている。",
      },
      {
        label: "街が得た力を一人ひとりの力に",
        text: "この16年で福岡は「伸びる都市」になったとして、天神ビッグバン、博多コネクティッド、七隈線の延伸、スタートアップの集積、国際金融都市を挙げ、この都市の力は次の福岡の土台だとして引き継ぐとしている。そのうえで次の4年を貫く目標は一つで、「街が手に入れた力を、ここに暮らす一人ひとりの力に変えること」だとする。「人が集まる街になった。次は、住み続けられる街に」「企業が来る街になった。次は、ここで働く人の給料に」「路線が延びた。次は、誰もが安心して出かけられる街に」と示している。",
      },
      {
        label: "みんなのもの大学（仮）",
        text: "政策を実現する場として「この街まるごとみんなのもの大学（仮）」の構想を挙げている。高齢者、スタートアップで挑戦する人、大企業で働く人、子ども、障がいのある人、アーティストやクリエイターが集い、挑戦が応援され、対話による合意形成をみんなで理解できる場をつくるとする。名称は市民から募集したいとし、施設を一からつくるのが難しい場合は大名小学校のような既存の公の施設を改修して活用する選択肢も含めて考えるとしている。",
      },
      {
        label: "立場",
        text: "無所属で立候補し、政党や団体の推薦・支持は考えていないとしている。",
      },
      {
        label: "報道への要望",
        text: "候補者は市民にとっての選択肢であるべきだとし、事実確認のないデマや家族への攻撃はやめてほしいと報道陣に求めている。",
      },
    ],
    takashimaAssessment: {
      summary:
        "天神ビッグバンや博多コネクティッドなど高島市政が進めてきたことを「とてもとてもすごいこと」として高く評価し、2000年以降の都市の発展としては際立っていたとしている。一方で、その発展がまだ市民のもの・街のものになっていないとし、そこに自ら力を注ぎたいと述べる。素晴らしいところは継承するとしたうえで、高島市長から「学校教育は最後の最後まで思うように変えられなかった」と聞いたことがあるとして、高島市長ができなかったこともやるのが自分なりの継承のあり方だとしている。",
      updated: "2026年10月",
      log: [
        {
          date: "2026-10-16",
          place: "記者会見",
          source: JINNO_SEISAKU_KAIKEN_SOURCE,
          text: "高島市政を継承するかを問われ、「高島さんがやられた素晴らしいところに関してはもちろん継承していきます」としたうえで、以前に高島市長と話した際に「学校教育は最後の最後まで思うように変えられなかった」と聞いたことがあるとして、「高島さんができなかったこともやる。それが私なりの継承のあり方だ」と述べた。具体例として、福岡市の不登校の数は16年間で増え続けたとしつつ、全国でも20年間で不登校は2倍になっており福岡市だけが悪かったわけではないと断ったうえで、「福岡市はこれだけ高島市政の中で変わってきたにもかかわらず、学校は何も変わらなかった」とも言えるとし、教員の多忙化や、発達障害など障害のある子どもが安心して学べる環境の整備についても同じことが言えるとした。今回の市長選の争点については、「高島路線の継承かそうじゃないのか」が本来大きな争点になるはずだったとし、再選挙になるかどうかが争点のようになっていることは「情けないことかもしれない」と述べている。自身の強みとしては、教育行政の理解、AIの理解、経営者・リーダーとしての経験の3つを挙げた。",
          url: JINNO_SEISAKU_KAIKEN_URL,
        },
        {
          date: "2026-10",
          place: "本人サイト",
          source: JINNO_POLICY_SOURCE,
          text: "「この16年で、福岡は『伸びる都市』になりました」として、天神ビッグバン、博多コネクティッド、七隈線の延伸、スタートアップの集積、国際金融都市を挙げ、「ビルが建ち、企業が来て、人口が増えた。この都市の力は、次の福岡の土台です。私はこれを引き継ぎます」としている。そのうえで次の4年を貫く目標は「街が手に入れた力を、ここに暮らす一人ひとりの力に変えること」だとし、「街の成長から、誰一人取り残さない」とする。その歩みを測る物差しとして「それは、ほんとうに子どもたちに渡せる次の未来か」という問いを自分に向けているとしている。",
          url: JINNO_POLICY_URL,
        },
        {
          date: "2026-09-24",
          place: "記者会見",
          source: JINNO_KAIKEN_SOURCE,
          text: "「天神ビッグバン、博多コネクティッド。これまでの高島市政がやってくれたことはとてもとてもすごいことで高く高く評価しています」と述べ、16年間の発展は2000年代以降の都市の発展として際立っていたのではないかとした。そのうえで「この発展が果たして今福岡市民のものになってるのか」と問い、「高島さんが発展させてきたものがまだ町のものになっていない、市民のものになっていない。そこに関してすごく自分自身が力を注いでいきたい」と述べている。市民の声の例として、自分が中学生の頃は子どもだけで天神の本屋に行けたが今は子どもだけで行かせられない、交通渋滞があり年を取ったら車で行けるか不安、といった声を挙げ、まず誰もが安心して安全に街を感じられるところから始めたいとしている。",
          url: JINNO_KAIKEN_URL,
        },
        {
          date: "2026-09-24",
          place: "報道",
          source: JINNO_RKB_SOURCE,
          text: "出馬会見について報じ、高島市政の天神ビッグバンや博多コネクティッドを高く評価したうえで「この街やこの発展を市民の手で自分たちのものにしていきたい」と話したと伝えている。",
          url: JINNO_RKB_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト", url: JINNO_SITE_URL },
      { label: "本人サイト（政策）", url: JINNO_POLICY_URL },
      {
        label: "本人サイト（政策ダイジェスト・全8ページ）",
        url: JINNO_POLICY_PDF_URL,
      },
      {
        label: "本人YouTube（政策発表記者会見）",
        url: JINNO_SEISAKU_KAIKEN_URL,
      },
      { label: "報道（日本経済新聞）", url: JINNO_NIKKEI_URL },
      { label: "東明館中学校・高等学校", url: JINNO_SCHOOL_URL },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "genkijinno.com",
        url: JINNO_SITE_URL,
      },
      {
        kind: "X",
        handle: "@Genki_jinno",
        url: "https://x.com/Genki_jinno",
      },
      {
        kind: "YouTube",
        handle: "神野 げんき 人間力で福岡をもっと前へ",
        url: "https://www.youtube.com/@%E4%BD%90%E8%B3%80%E6%9D%B1%E6%98%8E%E9%A4%A8%E5%AD%A6%E5%9C%92%E7%8F%BE%E6%A0%A1%E9%95%B7",
      },
      {
        // 本人のTikTokは2つあり、こちらが選挙用（プロフィールに「人間力で福岡をもっと前へ」）。
        // もう一方の @jinno_genki は校長としての切り抜きアカウント
        kind: "TikTok",
        handle: "@genki_jinno",
        url: "https://www.tiktok.com/@genki_jinno",
      },
      {
        kind: "Instagram",
        handle: "@jinno_genki",
        url: "https://www.instagram.com/jinno_genki/",
      },
      {
        kind: "Facebook",
        handle: "jinnogenki",
        url: "https://www.facebook.com/jinnogenki/?locale=ja_JP",
      },
      {
        kind: "note",
        handle: "note.com/jinnogenki",
        url: "https://note.com/jinnogenki",
      },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "4つの力の1番目に「学ぶ力（教育）」を置き、子どもの「やりたい」から始まる学校へとして、国の新しい学習指導要領（2030年度〜）に先駆けて福岡はもう始めるとしている。子どもの声を学校運営に反映し、働き方改革とAI活用で先生の時間を子どもに戻し、大学・専門学校の学費を支援し、どんな特性や障がいがあっても学べるインクルーシブな教育を実現するとする。子育てでは、第2子以降に続き第1子も0歳から保育料を無償にすること、病児保育・放課後クラブの拡充と送迎支援、AMH検査助成に続く卵子凍結・不妊治療費用の県制度への上乗せを挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "4つの力の一つ「学ぶ力（教育）」で、「子どもの『やりたい』から始まる学校へ」として、国の新しい学習指導要領（2030年度〜）に先駆けて福岡はもう始めるとし、4つの約束を挙げている。①子どもの声で学校をつくる（子どもの声を学校運営に反映し、子ども・保護者・地域と一緒に学校のあり方を見直す）、②先生が子どもと向き合える学校に（働き方改革とAI活用で先生の時間を子どもたちに）、③お金や環境で学びをあきらめない（大学・専門学校の学費を支援、学習支援・職業体験の機会を拡大）、④どんな特性や障がいがあっても学べる（一人ひとりに合った学び方と支援を選べるインクルーシブな教育を実現）。政策の中身では、#1「みんなで支える、安心の子育て」として、第2子以降に続き第1子も0歳から保育料を無償にすること、病児保育・放課後クラブを拡充し送迎支援で働く親の負担を軽減すること、AMH検査助成に続いて卵子凍結・不妊治療の費用を県制度に上乗せして選択肢を広げることを挙げ、#2「子どもを真ん中に、挑戦できる学び」として、次期学習指導要領の先進特例校の設置、インクルーシブ教育の推進、子どもの声の学校運営への反映、大学・専門学校の学費支援、職業体験の機会の拡大を挙げている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "次期学習指導要領の先進特例校について問われ、2030年度から始まる学習指導要領で中心になるのは標準授業時数を弾力的に運用できることだとし、学校独自にカリキュラムを調整して国語・数学・社会などの時間数を変えたり、その時間を使って教員が研修の時間を取ったりすることが可能になると説明した。本来2030年から全国の学校が一斉に始めるものを数年前倒しでできる制度であり、他の学校に比べてお手本のような学校をつくっていけるとしている。手を挙げた学校について市から国へ申請する形になるとし、学校現場は校長自身がやると決めてくれるかどうかが大切だとして、市内にある200以上の学校の校長と話をしたいと述べた。制度の導入は負担という意味ではあるとしつつ、教員の多忙化はそれとは別の文脈でしっかり取り組まなければいけないとしている。自身の教育観については、次期学習指導要領が掲げる「自らの人生を舵取りする力」＝自分でやる・やらないを意思決定する力と、「民主的で持続可能な社会の作り手」＝みんなで対話して決められる力の2つを育てることだと説明し、そのためには他人が決めたことで必ず守らなければならない範囲（法律や人権・命に関わること）を子どもにきっちり伝えたうえで、それ以外は自分で決めさせることが必要だとしている。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-24",
            place: "記者会見",
            source: JINNO_KAIKEN_SOURCE,
            text: "学校教育の「1丁目1番地」は不登校と、さまざまな特性を持つ子へのサポートであり、「誰一人取り残さない」という言葉に込められているものだと述べた。福岡市だけができていないわけではないとしつつ、福岡市が先端的に解決できれば北九州市や熊本市など周辺都市、さらに九州全体や全国に広がるモデルになるとしている。自身の学校では不登校だった子どもの9割以上が楽しそうに通うようになったとする。具体策を問われ、人的配置はできる限りすべてやるとしたうえで、EdTechの活用、教職員の多忙の解消、部活動のあり方の議論もすべて進めると述べた。ただし、予算や人がつくことは大切だがどの行政区でも最後に足りないのは信頼とコミュニケーションだとし、学校が変わるときに保護者が抱く「子どもの声を聞いて学力は大丈夫なのか」といった不安に教育行政が一緒に向き合うこと、現場が「はしごを外されない」信頼関係を築くことに1丁目1番地を置きたいとしている。",
            url: JINNO_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_SITE_SOURCE,
            text: "ビジョンの01「教育・子育て」で「学びと挑戦の機会を、すべての子どもに」を掲げている。校長として不登校を経験した子も楽しそうに通える学校づくりに取り組んできたとし、その経験を生かして地元の学校でも一人ひとりの意見が尊重され主体的に学べる環境をつくるとする。大人の学び直しも支えるとしている。",
            url: JINNO_SITE_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "4つの力の一つ「支え合う力（福祉・介護）」で、支える人を大切にするとして、介護・福祉で働く人の負担を減らして離職を防ぎ、住まいや奨学金返還の支援も検討するとしている。住み慣れた地域で暮らし続けられるよう、アフォーダブル住宅の推進、介護施設の改修、通院・買い物の足の確保、障がいのある人と家族の支援を挙げる。いくつになっても自分らしくとして、できることを生かす介護で尊厳と本人の意思を大切にするとする。ひとり暮らしでもつながれるよう、公民館「みんなの台所」の整備、薬局・郵便・商店によるさりげない見守り、外国人相談窓口の拡充も掲げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "4つの力の一つ「支え合う力（福祉・介護）」で、「誰も取り残さない福岡へ。困っている人に手を差し伸べられる街。それが、子どもたちに渡せる『次の福岡』」として3つの約束を挙げている。①支える人を大切に（介護・福祉で働く人の負担を減らし離職を防ぐ。住まいや奨学金返還の支援も検討する）、②住み慣れた地域で暮らし続けられる（アフォーダブル住宅の推進、介護施設の改修、通院・買い物の足の確保、障がいのある人とご家族の支援）、③いくつになっても自分らしく（できることを生かす介護で、尊厳と本人の意思を大切に暮らしを支える。敬老と健康長寿の街へ）。政策の中身では、#4「ひとりでも、つながっている」として公民館「みんなの台所」の整備、薬局・郵便・商店が日常でさりげなく見守ること、自治会活動のデジタル化・負担軽減、外国人相談窓口の拡充を挙げ、#6「住まいの安心」としてアフォーダブル住宅で家賃高騰から守ること、高齢者・障がいのある人・ひとり親など住まい探しに困る人の入居支援、介護・保育など暮らしを支える人への手ごろな住まいの支援、市営住宅の更新・管理の支援を挙げている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "「誰も取り残さない福岡へ。支える人を大切に」というテーマについて、介護や就労支援などの福祉に携わる人が利用者に向き合えるよう業務を改善できるあり方をつくることと、支えている人自身がしっかり報われる制度や仕事の仕方を整えることだと説明した。誰もが住みたい地域で暮らし続けられるあり方は、若者や子どもたち、現役世代にとっても「自分がどうあったとしてもこの福岡市で住み続けられる」と届けられるものになるとし、どのような障害があっても、どの年齢になっても自らの意思が尊重される形でこの街で生きていけること自体がみんなにとっての希望になると述べている。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_SITE_SOURCE,
            text: "ビジョンの02「介護・福祉」で「誰もが自由に動ける福岡へ」を掲げ、「高齢者や障がいのある方々の、移動や日々の暮らしの不便を減らしたい。AIや自動運転などの技術を、本当に必要としている方に届ける。その視点で、誰もが自由に、安心して暮らせる福岡を目指します」としている。",
            url: JINNO_SITE_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "政策の「動きやすい福岡」で、シニアや障がいのある人の通院・買い物の足を確保し、七隈線の混雑解消と延伸検討を加速するとしている。周辺自治体との連携を強化して住まい・人口・交通を福岡都市圏で一体に進めるとし、貝塚線と地下鉄の接続など市域を超えた交通を推進するとする。自転車で安全に走れる道を広げ、目標は数字で示すとしている。2027年から始まるとされる完全自動運転の実証には積極的に参加し、自動運転に対応した道路整備を進めるとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "政策の中身の#7「動きやすい福岡」で、シニア・障がいのある人の通院・買い物の足を確保すること、七隈線の混雑解消と延伸検討を加速すること、周辺自治体との連携を強化して住まい・人口・交通を福岡都市圏で一体に推進すること、貝塚線と地下鉄の接続など市域を超えた交通を推進すること、自転車で安全に走れる道を広げ目標は数字で示すことを挙げている。#13「次の時代の土台を、先に」では、自動運転に対応した道路整備を挙げている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "移動が難しい人の足をどう確保するのかを問われ、すでに市から一定の補助があると思うのでその方針を踏まえたうえで、もう一つは2027年以降の動きになるとして、完全自動運転のあり方を実証する中で、障がいのある人も安心して使える仕組みをつくることを考えていると述べた。七隈線の延伸については前向きに捉えているとし、自分自身が移動をより便利にしなければいけないという思いを強く持っているとして、どの部分で加速できるかは実際に入ってみないと分からないとしつつ、加速という方向に持っていきたいとしている。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-24",
            place: "記者会見",
            source: JINNO_KAIKEN_SOURCE,
            text: "交通渋滞は大問題だとしたうえで、自身が重く見ているのは高齢者や障害のある人がもっと気軽にどこへでも行ける交通だと述べた。2027年から完全自動運転が始まりつつあるとし、これまで移動しづらかった人が安心・安全に使える設計が最も大事で、それによって天神などにも足を運べるようになるとしている。実証には積極的に参加したいとしつつ、「安心安全こそが全て」とし、運転手のいないタクシーやバスは最初は不安だとして、怖いと思っている人も乗れるようになる段階の踏み方を最重要にするとした。完全自動運転は導入の仕方によって渋滞を緩和もできれば悪化もさせるとし、これは行政のルールの作り方だと述べ、かすれた標識や白線の整備、いまの車線や一方通行のままでよいかの見直しなど、道路設計の全般が必要だとしている。",
            url: JINNO_KAIKEN_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "天神ビッグバンなどの実績を受け継ぐとしたうえで、新しくできた施設をみんながどう使っていくかまで考えたいとしている。政策では、空き家・古い建物を再生して活用まで伴走すること、博多旧市街を歩いて楽しいまちにすること、インクルーシブな広場・スポーツ施設の拡充、緑の目標を数字で掲げて木陰を増やすことを挙げる。住まいではアフォーダブル住宅で家賃高騰から守るとし、政策を実現する場として「この街まるごとみんなのもの大学（仮）」の構想を示している。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "政策を実現するための構想として「この街まるごとみんなのもの大学（仮）」を挙げ、高齢者、スタートアップで挑戦する人、大企業で働く人、子どもたち、障がいのある人、アーティストやクリエイターが集い、挑戦が応援され、一人ひとりがその輪の中に入りながら、対話による合意形成をみんなで理解できる場をつくるとしている。名称は市民に募集したいとする。施設については「もちろん施設を作りたいということがまず一つにあります」としたうえで、ゼロからつくることが難しい場合は大名小学校のようなすでにある公の施設を改修して活用する選択肢も含めて考えたいと述べた。この場は対話会を開く施設であると同時に、スタートアップを応援しAIに触れられる施設でもあり、就労支援などの福祉を体験・利用できる場でもあるとしている。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "政策の中身の#8「魅力の再発見」で、空き家・古い建物を再生し活用まで伴走すること、博多旧市街（祇園・御供所）を歩いて楽しいまちにすることを挙げ、#9「誰もが集える福岡」でインクルーシブな広場・スポーツ施設の拡充と、緑の目標を数字で掲げて木陰を増やすことを挙げている。#6「住まいの安心」では、アフォーダブル住宅で家賃高騰から守ること、市営住宅の更新・管理を支援することを挙げている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-09-24",
            place: "記者会見",
            source: JINNO_KAIKEN_SOURCE,
            text: "天神ビッグバンについて、市民からは子どもだけで天神に行かせられない、渋滞で年を取ったら車で行けるか不安といった声を聞くとし、まず誰もが安心安全に街を感じられるところからだと述べた。そのうえで、新しくできた一つひとつの施設をみんながどう使っていくのかまで考えたいとしている。ウォーターフロント地区については「今私自身に具体的なビジョンがまだあるわけではない」としつつ、福岡市の次の発展を考えるとこうした土地をみんなで検討する必要があるとした。",
            url: JINNO_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_SITE_SOURCE,
            text: "ビジョンの03「まちづくり」で「福岡の良さを大切に、暮らしの安心と次の発展へ」を掲げ、「天神ビッグバンなどの実績を受け継ぎ、物価高・地価上昇への対策を検討します。博多湾のウォーターフロント開発など次の発展を描き、若者の挑戦も後押し。市民と職員が一緒に考え、行動する市政を目指します」としている。",
            url: JINNO_SITE_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "政策の「人も動物も、命を守る」で、警固断層を想定した地震対策を強化し、逃げにくい人の個別避難計画づくりを加速し、備蓄の拡充など大災害への備えを進めるとしている。再生可能エネルギー・EV・蓄電を強化して災害に強いエネルギー環境をつくるとする。犬猫の殺処分ゼロの継続も掲げる。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "政策の中身の#5「人も動物も、命を守る」で、警固断層を想定した地震対策の強化、逃げにくい人の個別避難計画づくりの加速、備蓄の拡充など大災害への備え、犬猫の殺処分ゼロの継続を挙げている。#13「次の時代の土台を、先に」では、再生可能エネルギー・EV・蓄電を強化して災害に強いエネルギー環境をつくるとしている。",
            url: JINNO_POLICY_PDF_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "4つの力の一つ「挑む力（産業）」で、福岡の開業率は21大都市圏で最高だとして、この力をここで働く人の暮らしにつなげるとしている。創業から小さなお店、地場の中小企業までを応援し、AIや新技術にも安心して挑める環境を整えるとする。東京に出なくても福岡でキャリアが築けるよう「アドバンスト・エッセンシャルワーカー」の育成を掲げ、賃上げできる企業を増やすために生産性向上（DX・AI）、価格転嫁の相談、販路拡大を後押しするとしている。消費税の税率変更に備えて個店のレジ・値札・会計の対応を支援し、農業・漁業の担い手の確保と学校給食への市内産農水産物の活用も挙げる。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "4つの力の一つ「挑む力（産業創出）」で、「挑む人が、報われる福岡へ。福岡の開業率は21大都市圏で最高。この力を、ここで働く人の暮らしにつなげる」として3つの約束を挙げている。①挑む人を、応援する（創業から小さなお店、地場の中小企業まで。AIや新技術にも安心して挑める環境を整える）、②福岡で、働き、暮らせる（東京に出なくても福岡でキャリアが築ける。アドバンスト・エッセンシャルワーカーの育成）、③成長を働く人の暮らしに（賃上げできる企業を増やすため、生産性向上（DX・AI）、価格転嫁の相談、販路拡大を後押し。農業・漁業・食の、つくる人を守る）。政策の中身では、#10「誰一人取り残さない成長」として商店街の活性化支援、消費税の税率変更に備えた個店のレジ・値札・会計の対応支援、奨学金返還支援などによる人材確保の後押し、#11「福岡の食を、つくる人を守る」として農業・漁業の新しい担い手を増やし定着を支援すること、学校給食に市内産の農水産物をもっと使うこと、市場とブランド化で離島・農村部の暮らしを守ること、#12「東京に出なくてもキャリアが築ける」として創業支援の拡充とUターンの後押し、#13として中小企業・スタートアップのAI活用への補助・相談支援を挙げている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "「挑む人が報われる福岡」について、この街がスタートアップのような挑戦者を応援してきたとして、スタートアップをさらに応援することに加え、中小企業や大企業で働く人のチャレンジも応援していくと述べた。そうすることで、この福岡という街で働く人がチャレンジすることに怖くなくなるあり方をつくりたいとしている。物価が一気に高くなり家賃も高騰している中でも、この街で安心して働き暮らしていけるよう「家賃補助の形も考えていきたい」とし、企業と街が発展した後にその働き方の賃金が上がっていく形で挑む人が報われる街にしたいと述べた。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-09-24",
            place: "記者会見",
            source: JINNO_KAIKEN_SOURCE,
            text: "生活者がいま最も気にしているのは物価高だとし、消費税の引き下げの対象がスーパーやテイクアウトにとどまり、レストランで食べる外食には適用されないと指摘した。テイクアウトに乗り出せるのは一定の規模がある店で、福岡の屋台や昔から続く個人経営の居酒屋は簡単にはいけないとし、「消費税を下げることは絶対大切」としつつ、その結果として競争上の不利益を被る人や大手が有利になる状況が生まれているとして、自治体側でバランスを取り、全員が底上げされる政策を考えたいと述べた。",
            url: JINNO_KAIKEN_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都には「なるべきだ」とし、福岡県・福岡市・北九州市が連携協約を結んで指定をめざすとしている。首都直下地震などの大災害でも国の機能と日本の経済を止めない備えを進め、本社機能やデータのバックアップ拠点の受け入れを推進するとする。市民への還元は「交通と防災がとてつもなく大きい」として、九州の備蓄拠点になれる施設と運搬の道路を県や国と整備し、市民の渋滞や物流のためのインフラにもなるとしている。その先に、福岡からアジアのマーケットに向かえる企業群が育つことを目指すとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "副首都をどう市民に還元するのかを問われ、「交通と防災がとてつもなく大きい」と述べた。副首都となるからには、南海トラフ地震や警固断層による地震が来たとしても福岡を中心に九州の備蓄の拠点になれるだけの施設が必要になるとし、その際の運搬を含めた道路の整備も確実に必要になるとしている。巨大な防災拠点と、それを物流として届けられる道路の整備は福岡市だけでできるものではなく県や国との連携の中でできていくとしたうえで、これは同時に市民の交通渋滞や物流が途切れないためのインフラにもなると述べた。交通と防災の整備を進めたその先にできることとして、福岡から東京に負けないような企業群ができ、その企業群がアジアというマーケットまで向かっていける、そういう副首都になっていくことに自分の思いを込めたと述べた。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "政策の中身の#14「福岡県モデルで、副首都をめざす」で、福岡県・福岡市・北九州市が連携協約を結び副首都の指定をめざすとし、首都直下地震などの大災害でも国の機能と日本の経済を止めない備えを進めること、本社機能やデータのバックアップ拠点の受け入れを推進することを挙げている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-09-24",
            place: "記者会見",
            source: JINNO_KAIKEN_SOURCE,
            text: "副首都構想については「なるべきだ」とし、福岡は自然・都市・人・文化の調和という点で世界的にも例がないとして、他の都市をモデルにするのではなく福岡のやり方で発展し、その「福岡モデル」を世界に広げるべきだとしている。",
            url: JINNO_KAIKEN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "政策の「魅力の再発見」で、福岡の歴史・自然・祭りを次世代につなぐとし、空き家や古い建物を再生して活用まで伴走すること、博多旧市街（祇園・御供所）を歩いて楽しいまちにすること、博多祇園山笠・どんたく・放生会の担い手を支えること、7区それぞれの魅力を磨いて発信することを挙げている。「誰もが集える福岡」として、安全第一で大濠公園の花火大会の復活に挑戦するとし、山・海の自然景観と歩いて楽しい街並みで映える福岡にするとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "政策の中身の#8「魅力の再発見」で、福岡の歴史・自然・祭りを次世代につなぐとして、空き家・古い建物を再生し活用まで伴走すること、博多旧市街（祇園・御供所）を歩いて楽しいまちにすること、博多祇園山笠・どんたく・放生会の担い手を支えること、7区それぞれの魅力を磨き発信することを挙げている。#9「誰もが集える福岡」では、大濠公園の花火大会の復活に挑戦する（安全第一）、山・海の自然景観と歩いて楽しい街並みで映える福岡にする、インクルーシブな広場・スポーツ施設を拡充する、緑の目標を数字で掲げ木陰を増やすとしている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "福岡の好きな場所を問われ、「好きなところだらけ」としたうえで、市民があまり行かない場所として能古島のビーチを挙げ、車のまま10分ほどで離島リゾートのような場所が広がっているのに市民も海をあまり意識していないとして、もったいないと述べた。三瀬峠の方に並ぶ豆腐の店も挙げ、とてもおいしいのに福岡市の名物になっていないとしている。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "政策の「ひとりでも、つながっている」の一つとして、外国人相談窓口の拡充を挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "政策の中身の#4「ひとりでも、つながっている」で、公民館「みんなの台所」の整備、薬局・郵便・商店が日常でさりげなく見守ること、自治会活動のデジタル化・負担軽減とあわせて、「外国人相談窓口を拡充」を挙げている。",
            url: JINNO_POLICY_PDF_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "人口減少で行政サービスが滞りうるとして、行政のDX・AX（AI化）を本気で検討するとしている。AIに任せる仕事と人が担う仕事の線引きを明確にし、「市民に向き合うのが行政の仕事」で事務作業はテクノロジーに任せるとする。政策では「決める力」として、市長の決断と理由をSNS・動画で発信する「見える化」、対話会や寄せられた声をAIで整理・公開して意見が分かれる論点の合意点を探す仕組み、決めた理由と進み具合を毎回報告する「決めて、返す」を掲げる。学校の電話対応をAIで報告書化した自校の取り組みを、市役所の行政サービスにも広げたいとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-09-24",
            place: "記者会見",
            source: JINNO_KAIKEN_SOURCE,
            text: "福岡市でも15年ほど先を見れば人口減少が始まるとして、行政サービスの中でDXやAX（AI化）をどう取り入れるかを今から本気で検討しないと、当たり前に受けられている行政サービスが滞る可能性があると述べた。AI型教材をつくってきた経験から、何をテクノロジーに任せ何を人がやるのかの線引きを明確にすることが大事だとし、学校では「子どもたちに向き合うのは教員の仕事」でアンケートや出張届はテクノロジーに任せると言ってきたとして、行政でも「市民に向き合うのは行政の仕事」で簡単な事務作業や書類作業は任せてよいとした。市民の声の集め方については、タウンミーティングなどで直接話す機会をつくると同時に、テクノロジーで声を集約して見えるようにしたいとし、チームみらいがAIで市民の意見を吸い上げている仕組みや、台湾でオードリー・タン氏が大臣だった時代の「プルラリティ」の実践を例に挙げ、福岡にふさわしい形を検討するとしている。",
            url: JINNO_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "4つの力の一つ「決める力（政治への信頼）」で、「『参加しても変わらない』と感じるのは市民のせいではない。政治を、自分たちのものに」として3つの約束を挙げている。①見える化＝市長の決断とその理由をSNS・動画でやさしく発信し、対話集会を市内各地で開いて結果を公開する、②集めて、整理する＝対話会や寄せられた声をAIで整理・公開し、意見が分かれる論点は賛成・反対の理由を並べて合意できる点を探す、③決めて、返す＝決めた理由を説明し、進んだこと・進まなかったことを毎回報告し、新しい政策は事前に点検して公開する。「やり方」として「I do. We do.」を掲げ、市長がやるべきことは誰に・何を・いつまでに、事業費と財源も含めて示し成果を公表するとし、聴く→決める→説明するの3段階を回すとしている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "教員の多忙化対策として、学校の電話対応をAI化した自校の取り組みを紹介した。朝の時間に遅刻や欠席の連絡が集中し、その最中にクレームの電話が入り、メモを取って報告書を作る作業が重なるとして、自校ではこの業務をすべてAI化し、電話が自動で録音されて文字起こしされ報告書の形式になり、授業中に担当の先生へ回って対応できる形にしているとしている。「人間がやるべきところを全く削ることなく、自動化できる部分をAIに任せる」ことで多忙化はかなり解決できるとし、このやり方を学校だけでなく市役所やあらゆる行政サービスに広げて、多忙化の解決の道を見つけたいと述べた。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "政策の「やり方」で、市長がやるべきことは誰に・何を・いつまでにを明示し、事業費と財源も含めて示して成果を公表するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "政策の「やり方 I do. We do.」で、「市長がやるべきことは、責任を持ってやります。誰に・何を・いつまでに。事業費と財源も含めて示し、成果を公表します」としている。",
            url: JINNO_POLICY_PDF_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "市民一人ひとりの声を聞き、生活に密着した政策を出すとしている。政策では「みんなで決める福岡」として、校区ごとの対話集会を毎年開き、自治会に加入していない人や子どもも参加できる場にするとする。自治会活動のデジタル化・負担軽減も挙げている。4つの力のうち最も重視するのは「民主主義への信頼」で、全員に関わる話だからだとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-16",
            place: "記者会見",
            source: JINNO_SEISAKU_KAIKEN_SOURCE,
            text: "4つの柱のうち最も重視するものを問われ、「民主主義への信頼」だとし、「これは本当に全員に関わる話です」と述べた。これが今回挑戦を始めるきっかけになった最も大きなものだとして、校長を務める学校で生徒全員に校則を渡し、日本の法律を守ることと全会一致で持ってくることの2つを条件に、法律の範囲内であればどれだけでも変えると伝えてきたとし、就任当時27ページあった校則が今は6行になったと説明した。最初に生徒が手がけたのは通学時のローファーの自由化で、95%の生徒が賛成した一方、5%は3年間みんなで統一したいと言ったとし、「自由の相互承認」＝一人ひとりは自由だが相手の権利を侵害する自由はないという考え方を学校で教えてきた結果、「スニーカーを履きたいなら履けばいい、ローファーを履き続けたいなら履く」という合意形成ができたと述べている。卒業生から「対話による合意形成でルールが変わる、街が変わると思っている大人に社会で出会えない」と言われたことが、自身が挑戦を始めたきっかけだとし、大人が民主主義と政治を信じている背中を子どもたちに見せなければいけないとしている。市政でできることとして、市政の中で行われている意思決定を見えるようにすること、AIなどを使って市民の声を集めて整理し意思決定に生かすこと、何かが決まったときに分かりやすい形で発信することを挙げた。",
            url: JINNO_SEISAKU_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: JINNO_POLICY_SOURCE,
            text: "政策の中身の#15「みんなで決める福岡」で、市長の決断と理由をSNS・動画でやさしく発信し進み具合も報告すること、校区ごとの対話集会を毎年開催し自治会未加入の人や子どもも参加できる場にすること、対話会や市民の声をAIで整理・公開し意見が分かれる論点は合意点を探すことを挙げている。#4では自治会活動のデジタル化・負担軽減を挙げている。",
            url: JINNO_POLICY_PDF_URL,
          },
          {
            date: "2026-09-24",
            place: "記者会見",
            source: JINNO_KAIKEN_SOURCE,
            text: "市長になってまず取り組みたいこととして、市民とともに福岡の街を考え「みんなのもの」にしていくことを挙げた。福岡は東西南北それぞれに自然や都市、文化が豊かで市民の生き方も多様だとし、一人ひとりの声を聞きながら生活に密着した政策を出したいとしている。市役所の職員や市議会との関係を問われ、市民と同じように真摯に話を聞くとし、それぞれの立場や政治信条をすべて聞いたうえで「ではどうする」と一人ひとりと話していくつもりだと述べた。",
            url: JINNO_KAIKEN_URL,
          },
          {
            date: "2026-09-24",
            place: "報道",
            source: JINNO_NIKKEI_SOURCE,
            text: "出馬表明を報じ、教育ベンチャーの起業後に文部科学省の委員などを務めたとしたうえで、市内で記者会見し「不登校などの教育課題に本気で取り組む」と話したと伝えている。あわせて、表明が9人目で戦後最多だった2010年の8人を更新したこと、市選挙管理委員会は選挙ポスターの掲示板を8人分で用意していたことにも触れている。",
            url: JINNO_NIKKEI_URL,
          },
        ],
      },
    },
  },
  {
    id: "katayama-sumiko",
    no: "12",
    name: "片山 純子",
    kana: "かたやま すみこ",
    age: 69,
    title: "市民連合ふくおか 事務局長",
    party: "無所属",
    lead: "「住民とともに“あんしん福岡”へ」を掲げ、9つの政策を公表している。高島市政を「儲かる市政」だとして、開発中心から住民福祉の増進へ転換し、対話で市政をつくるとしている。",
    bioSource: `${KATAYAMA_SITE_SOURCE}／${KATAYAMA_KAIKEN_SOURCE}／${KATAYAMA_YOMIURI_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1956年生まれ。岡山県岡山市で育つ。東京大学文学部国史学科を卒業。1987年に福岡市へ移り、生まれ育った岡山より長く福岡に住んでいるとしている",
      },
      {
        label: "1987",
        text: "河合塾の福岡校・北九州校で日本史を教える。教材づくりや模試の作成も担当し、塾内の「女性論男性論研究会」で活動",
      },
      {
        label: "1999",
        text: "河合塾の人事部からの依頼で、セクハラ・パワハラ・いじめ全般のハラスメント防止対策に丸16年取り組む（2016年まで）",
      },
      {
        label: "2019",
        text: "市民団体「市民連合ふくおか」の事務局長に就任（現職）",
      },
      {
        label: "2022",
        text: "「福岡市から政治をかえる会」を立ち上げ事務局代表。前回の市長選では立候補を表明していたが、候補者の一本化に伴い出馬を取りやめた",
      },
      {
        label: "2026",
        text: "9月26日にキックオフ集会を開き、同日に出馬表明の記者会見",
      },
    ],
    claims: [
      {
        label: "とりもどす",
        text: "地方自治法が定める「住民福祉の増進」を自治体本来の使命だとし、新自由主義的な自己責任の押し付けからの転換を掲げる。公共施設の指定管理や公園のPFI事業、専門職の非正規化で「公（おおやけ）」が縮小したとして、公共の力が発揮される市政を取り戻すとしている。",
      },
      {
        label: "つくりだす",
        text: "住民団体との直接対話を拒んできたとする「トップダウン」の市政から、対話して課題を共有し、ともに考え実行する市政へ転換するとしている。市役所内の「ハラスメント構造」をなくし、職員が声をあげやすい職場にするとする。",
      },
      {
        label: "9つの政策",
        text: "「暮らしやすい」「住みやすい」「動きやすい」「災害に強い」「子どもが生きやすい」「ジェンダー平等」「人権を守る」「平和を守る」「自治体のあり方と対話の市政」の9分野を公表している。なかでも経済にあたる「暮らす・住める・動ける」の3つを重点に挙げる。2026年10月には、これらをまとめた全20ページの政策集をPDFで公開した。",
      },
      {
        label: "立場",
        text: "無所属で立候補し、確認団体として「住民とともに安心の福岡市をつくる会」を届け出るとしている。政党には推薦や支持を投げかけて検討中だとし、選挙資金は主に個人からの寄付で賄うとする。",
      },
    ],
    takashimaAssessment: {
      summary:
        "「0点なんて言い方はしない」として、一定の方向性を示しリーダーシップを発揮した市長だと評価する。一方で、天神ビッグバンなどは「アベノミクスの福岡版」で、大企業の内部留保は増えたが一人あたりの市民所得は横ばいで「トリクルダウン」は起きなかったとし、地価と家賃の高騰、公共の縮小といったひずみが表面化したとする。全面的に否定はせず、検証したうえで方向性を変えるとしている。",
      updated: "2026年10月",
      log: [
        {
          date: "2026-10",
          place: "本人サイト",
          source: KATAYAMA_POLICY_BOOK_SOURCE,
          text: "政策集で、「公（おおやけ）」「公共物（コモン）」が縮小した3つの事例を数字で示している。1つ目は職員削減と非正規・低賃金化で、会計年度任用職員は2020年度の3122人（正規職員8756人・26.3%）から2024年度の3575人（正規職員8947人・28.5%）へ増え、会計年度任用職員の29.3%が年収300万円未満だとする。2つ目は市所有の公園・公共施設を民間企業が管理・運営する事業の増加で、すべての都市公園（約1700公園）を対象にPark-PFI事業化が進み、市民センター・アミカスなどで指定管理制度が進展したとして、公園内に建物が建って公園らしさが失われ、市職員が管理運営を担う能力を失っていると指摘する。3つ目は市が担うべき職務の町内会への依頼で、市からの依頼事項が2023年度の221件から2024年度の237件に増え、防災・避難でも町内会に依存するものが多いとし、町内会加入率は2014年89.1%、2018年85.7%、2022年88.6%と推移しているとする。市立幼稚園の廃止や、司書・スクールカウンセラーなど女性が多い専門職の非正規化も例に挙げている。",
          url: KATAYAMA_POLICY_BOOK_URL,
        },
        {
          date: "2026-09-26",
          place: "記者会見",
          source: KATAYAMA_KAIKEN_SOURCE,
          text: "高島市政の評価を問われ、「皆さん評価されてる方も多いわけですから、0点なんて言い方はしません。一定程度、方向性を見せられた、そういうリーダーシップを発揮された市長さんだと思います」と述べた。そのうえで、トリクルダウンが起きなかったこと、関心が開発や都心部の状況に向かっていたことを挙げ、地方自治の本来の目的である住民福祉の増進に照らして税金の使い道を見直す必要があるとした。「全面的に否定なんてそんなことはしません。検証を含めてやった上で方向性を変えていく」としている。",
          url: KATAYAMA_KAIKEN_URL,
        },
        {
          date: "2026-09",
          place: "本人サイト",
          source: KATAYAMA_SITE_SOURCE,
          text: "政策ページで高島市政4期16年を振り返り、天神ビッグバンや博多コネクティッドは「アベノミクスの福岡版」で、国家戦略特区による規制緩和と超低金利で溢れた資金による都心再開発だとしている。ひずみとして、天神の平均公示地価が2010年の坪約711万円から2026年に約2484万円へ約3.5倍になり、マンション価格や家賃の上昇に波及したこと、天神エリアのオフィス空室率が2026年8月時点で8.94%と目安の5%前後を超えていること、市内に本社を置く大企業の内部留保は2倍から3倍に増えた一方で一人あたりの市民所得は全国と比べほぼ横ばいであることを挙げる。また「公」の縮小の例として、職員削減と非正規化、公園・公共施設の民間管理化（Park-PFI事業）、防災・避難業務の町内会への依存を挙げている。",
          url: KATAYAMA_POLICY_URL,
        },
        {
          date: "2026-09-26",
          place: "報道",
          source: KATAYAMA_YOMIURI_SOURCE,
          text: "出馬表明を報じ、「高島市政の『儲かる市政』のもとでゆがみ」が生じたとする主張を伝えている。岡山市出身で予備校講師を経て2019年に市民連合ふくおかの事務局長に就任したこと、前回の市長選でも立候補予定だったが野党系候補の一本化に伴い出馬を取りやめたことにも触れている。",
          url: KATAYAMA_YOMIURI_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト（政策）", url: KATAYAMA_POLICY_URL },
      {
        label: "本人サイト（政策集・全20ページ）",
        url: KATAYAMA_POLICY_BOOK_URL,
      },
      { label: "本人サイト（プロフィール）", url: KATAYAMA_PROFILE_URL },
      { label: "報道（読売新聞オンライン）", url: KATAYAMA_YOMIURI_URL },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "katayamasumiko.com",
        url: KATAYAMA_SITE_URL,
      },
      {
        kind: "X",
        handle: "@sumiko_katayama",
        url: "https://x.com/sumiko_katayama",
      },
      { kind: "YouTube", handle: "", url: "" },
      { kind: "TikTok", handle: "", url: "" },
      {
        kind: "Instagram",
        handle: "@sumiko.katayama",
        url: "https://www.instagram.com/sumiko.katayama/",
      },
      {
        kind: "Facebook",
        handle: "sumiko.katayama.7",
        url: "https://www.facebook.com/sumiko.katayama.7",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "子どもの権利条例の制定を必須とし、相談・救済窓口の設置、児童館を7行政区ごとに設置するとしている。3歳未満の保育費と18歳までの子ども医療費の完全無料化、修学旅行代や制服代を含む義務教育の完全無償化、市独自の給付型奨学金の創設を掲げる。教育予算を抜本的に増やし、過大規模校の解消、20人以下の学級、インクルーシブ教育、学校給食の自校方式化と、学校司書やスクールカウンセラーなど専門職の正規化・常駐化を進めるとする。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: KATAYAMA_POLICY_BOOK_SOURCE,
            text: "政策集の政策5で、日本国憲法26条は義務教育を無償と定めているのに、教材費・修学旅行費・中学の制服代などの「隠れ教育費」が保護者に重い負担を押しつけているとして「教育の無償」を目指すとしている。学校現場の状況として、施設の老朽化とアスベスト建材の残存、学校エレベーターの設置率が全国平均より低いこと、学校司書・スクールカウンセラー・スクールソーシャルワーカー・学校用務員が常駐ではなく非正規雇用が多いこと、正規・非正規の教員不足、特別支援学校の在籍者数の増加に学校・クラス数が対応できていないこと、小学校の給食調理と中学校のセンター方式がいずれも民間委託であることを挙げる。個別政策として、小中学校で20人以下の学級を目指すこと、多様性・共生を尊重するインクルーシブ教育の推進、小中学校ともに自校方式で給食室で調理できる仕組みとすること（避難所機能を充実させる対策としても有効だとする）、フリースクールに通う家庭への支援、学校図書館の充実と学校公演・芸術鑑賞教室の予算確保を挙げる。市内に14の大学があり「学生のまち」として知られる一方、卒業・就職時に福岡を離れる若者も多いとして、市独自の給付型奨学金の創設と貸与型奨学金の返済支援の拡充を掲げている。",
            url: KATAYAMA_POLICY_BOOK_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策5「子どもが生きやすい＝子どもの権利を尊重した社会・教育に」で、子どもの権利条約の4原則を福岡市の条例として制定することは必須だとしている。郊外のマンション開発に規制がなく、東区・西区などで過大規模校（31クラス以上）が高島市政が始まった2010年の小学校7校・中学校0校から2026年に小学校29校・中学校6校へ増えたとし、いじめの認知件数は2017年の722件から2024年の4381件へ、不登校の児童生徒数は801人から5770人へ増えたとする。子どもの貧困率は福岡県で19%（約5人に1人）と全国平均の11%より高いとしている。具体策として、子どもの権利相談・救済窓口の設置、児童館を7行政区ごとに設置（現状は中央区に1か所）、3歳未満の保育費と保育園副食費の完全無料化、18歳までの子ども医療費の完全無料化、就学援助の拡大、修学旅行代や制服代を含む義務教育の完全無料化、市独自の給付型奨学金の創設、教育予算の抜本増、大規模校問題の解消を挙げる。",
            url: "https://katayamasumiko.com/kodomo/",
          },
          {
            date: "2026-09-26",
            place: "記者会見",
            source: KATAYAMA_KAIKEN_SOURCE,
            text: "教育について、高島市政の最後に予算をかけたと言われるが学校施設は貧弱で、過大規模校が16年間で小学校7校から小中学校合わせて35校に増えたと述べた。学校司書やスクールカウンセラーが各校に1人ずついるわけではなく非正規が多いとして「おかしいと思います」としている。",
            url: KATAYAMA_KAIKEN_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "国民健康保険料と介護保険料の引き下げ、上下水道料金の減免、家庭用ごみ袋代の値下げなど市民生活への直接支援を掲げる。若い世代・高齢者世代・シングル子育て世帯を対象にした家賃補助制度の創設と、市営住宅の管理戸数の大幅増、住宅リフォーム助成の拡充も挙げる。高齢者乗車券・福祉乗車券の拡充、加齢性難聴者の補聴器購入補助、バリアフリー化、保育士・介護士の待遇改善も掲げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: KATAYAMA_POLICY_BOOK_SOURCE,
            text: "政策集の政策2「住みやすい＝家賃補助や市営住宅の充実を」で、給料・年金がほとんど上がっていないなかで高すぎる家賃の支払いに苦労し「住み続けられない」という悲鳴が若者・高齢者をはじめ多くの住民から上がっているとして、「住民の福祉」を充実させるために若い世代や高齢者世代、シングル子育て世帯などを対象にした家賃補助制度を創設するとしている。市営住宅は2010年度の3万1766戸から2025年度の3万1111戸へ減っており少なすぎるとして、民間住宅の借り上げも含めて管理戸数を大幅に増やすとする。個別政策として、生活困窮者自立支援のための「住居確保給付金」や若者困窮者・ひとり親世帯向けの家賃減額事業といった家賃補助制度の拡充、市営住宅の戸数を増やすこと、住宅リフォーム助成制度の拡充を挙げている。",
            url: KATAYAMA_POLICY_BOOK_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策1「暮らしやすい＝大企業中心ではない、地域循環型経済へ」の中で、市民生活への直接支援として、高すぎる国民健康保険料の引き下げ、介護保険料の引き下げ、生活保護基準の切り下げストップと下水道使用料減免や各種見舞金の復活、ひとり親家庭の支援強化、上下水道料金の減免、家庭用ごみ袋代の値下げを挙げている。高齢者・障がい者への支援としては、高齢者乗車券・福祉乗車券の拡充、介護保険の自己負担と後期高齢者医療の引き下げ、市営住宅への優先的な入居、加齢性難聴者の補聴器購入補助、公共の場・施設・歩道のバリアフリー化を挙げる。保育士・介護士の待遇改善も掲げている。",
            url: "https://katayamasumiko.com/kurashiyasui-2/",
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "市の交通局にコミュニティバス部門を設け、バスが減便された地域に公共コミュニティバスを走らせるとしている。郊外の歩道整備、自転車レーンの拡充、JR筑肥線と市営地下鉄の乗り継ぎ割引の拡大、九大伊都キャンパスへの交通改善も挙げる。地下鉄七隈線の延伸には費用対効果の面から疑問を示しつつ、検証したうえで判断するとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策3「動きやすい＝移動に困らない地域の生活交通の充実を」で、西鉄バスの営業延走行キロ数が2010年の4886万7322キロから2024年に3404万9308キロへ3割減り、減便や路線廃止で市内周縁部を中心に移動に困る市民が増えていると指摘している。市は西鉄に増便を強く求めず、オンデマンド交通も採算性という「住民の努力」を求めるものになっている一方、観光客向けの拠点間を結ぶ大規模交通の計画には熱心で住民が軽視されているとする。市の交通局にコミュニティバス部門を設置して公共コミュニティバスを走らせること、郊外の歩道整備、自転車レーンの拡充、JR筑肥線と市営地下鉄の乗継割引の拡大、高齢者乗車券・福祉乗車券の拡充、九州大学伊都キャンパスへの交通の改善と安価な移動を挙げている。",
            url: "https://katayamasumiko.com/ugokiyasui/",
          },
          {
            date: "2026-09-26",
            place: "記者会見",
            source: KATAYAMA_KAIKEN_SOURCE,
            text: "地下鉄箱崎線から西鉄貝塚線への直通運転について、話はほぼまとまっているのではないかとしたうえで、「何しろ検証です。一旦止まって検証した上で、いいものに関しては進めていく」のが基本姿勢だと述べた。地下鉄七隈線の延伸については、利用者が少ないとされる区間に多額の事業費をかけることに疑問を示し、それだけのお金があれば別の路線の延伸をした方がよいのではないかとしたうえで、「ちゃんと検証します」と述べている。",
            url: KATAYAMA_KAIKEN_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "天神ビッグバンと博多コネクティッドの検証・転換を掲げる。箱崎九大跡地は防災公園など住民の願いが実現する方向へ、マンション建設などの開発規制と成長管理政策への転換、IR・カジノ誘致への反対を挙げる。公園のPark-PFI事業や公共施設の指定管理者制度は見直すとする。都心の空きオフィスには図書館・博物館・劇場など公共の文化芸術施設を置く案を示している。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: KATAYAMA_POLICY_BOOK_SOURCE,
            text: "政策集の政策2で、高島市政では経済特区の指定で建設規制を緩和し、これまで130億円を超える巨額の税金が投入された「天神ビッグバン」をはじめとした開発行政が進められたとしている。その結果2026年まで14年連続して地価が上昇し、戸建て・マンションの販売価格が上がり、とくに賃貸住宅の家賃の急上昇が起こっているとする。都心の公園などのPark-PFI事業は、民間企業にとっては都心の「一等地」を容易に獲得できるものだが、住民にとっては公共であった公園、住民が集まって憩う場・空間が失われることを意味するとして、民間企業の管理・運営で住民の使用が制限されたり利用料が課されたりすることには反対し、「公共物（コモン）」を取り戻すとしている。",
            url: KATAYAMA_POLICY_BOOK_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策2「住みやすい＝家賃補助や市営住宅の充実を」で、大型開発行政からの脱却として、都心部再開発（天神ビッグバン、博多コネクティッド）の検証・転換、箱崎九大跡地の利用は防災公園など住民の願いが実現する方向へ、マンション建設などの開発規制と成長管理政策への転換、IR（統合型リゾート）・カジノ誘致への反対を挙げている。公園や公共施設の民営化をなくすとして、Park-PFI事業の見直し、市民センター・アミカスなど公共施設の指定管理者制度の見直しも掲げる。",
            url: "https://katayamasumiko.com/sumiyasui/",
          },
          {
            date: "2026-09-26",
            place: "記者会見",
            source: KATAYAMA_KAIKEN_SOURCE,
            text: "すでにできた施設をどう活用するかを問われ、天神のオフィス空室率が9%ほどで安全とされる5%を超えているとし、新たなビルができても一番の需要であるオフィスが本当に埋まるのかと述べた。都心の空いたところを図書館にするなど、文化芸術の発想があまりないのが印象だとして、工夫すれば面白いものはいくらでもつくれるとしている。長期金利が上昇しており、超低金利で資金が回る状況は変わってきているとして、計画どおりに開発を進められるかにも触れた。",
            url: KATAYAMA_KAIKEN_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "「災害に強い＝都市構造を見直しグリーンシティー福岡へ」を掲げる。2030年度までに温室効果ガスを2013年度比50%削減する目標に具体策がないとして見直しを徹底し、「気候市民会議」を設けるとする。避難者数の想定見直しと公的備蓄の抜本拡充、移動式トイレ・キッチンカー・簡易ベッドの備蓄、学校体育館などへのエアコン設置、公共施設の断熱化と太陽光発電の設置を挙げる。「自助」「共助」には限界があるとして「公助」を第一にするとし、原発の再稼働には反対する。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: KATAYAMA_POLICY_BOOK_SOURCE,
            text: "政策集の政策4で、都市の再開発で延べ床面積が拡大し人流・物流も拡大してエネルギー消費や温室効果ガスの排出量が増加しているとして、都市構造の見直しを掲げている。個別政策として、歩道への木陰インフラの整備、都心部のオープンスペースの拡大と歩行者中心への転換、郊外の拠点となる商店街の再生を住民とともに進めること、地産地消を目指して農家の有機栽培を奨励し学校給食などの食材に活用すること、地域で電気・食料が一定自給できる「地域循環型経済」を挙げる。住宅などでは、市営住宅の断熱化・耐震化の推進、戸建て・マンションの断熱化や耐震補強の助成充実、太陽光発電パネル設置やベランダ発電の支援、ゼロアスベストの街づくりの推進、低所得世帯への夏の電気代補助など熱中症対策の強化を挙げている。",
            url: KATAYAMA_POLICY_BOOK_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策4で、福岡市は2030年度までに温室効果ガス排出量を2013年度比50%削減する目標を掲げながら、多くを民間事業所の自主的な努力にあてにしており具体的な取り組みがないとして、温暖化対策の見直しを徹底するとしている。新自由主義的な施策のもとで避難でも「自助」「共助」が強調されるが限界は明らかだとして「公助」を第一にした災害対策が必要だとし、最大震度7が予想される警固断層帯の地震対策にも取り組むとする。県の新たな地震被害想定で避難者数が最大23.2万人に増えた結果、食料・水の備蓄は1日分、携帯・簡易トイレは最大避難者に対して0.42日相当にとどまるとし、公的備蓄の抜本拡充、移動式トイレ・キッチンカー・簡易ベッド（TKB）の備蓄と早期提供の体制づくりを挙げる。市立学校体育館の空調設置は2027年度末の完了を目指して工事中だが今年度末は約6割にとどまるとしている。ほかに、気候市民会議の設置、街路樹を増やし都市公園を森に、都心部への車両乗り入れ規制と公共交通の整備、公共施設の断熱化と太陽光発電パネル・蓄電池の設置、水道配水管や下水道管の耐震化、原発の再稼働への反対を挙げる。",
            url: "https://katayamasumiko.com/saigai/",
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "「大企業中心ではない、地域循環型経済へ」を重点に掲げる。公共事業に市内の中小業者が参入しやすい仕組みづくり、公契約条例の制定、賃上げの直接支援で働く人の賃金を底上げするとし、大企業には法人市民税の超過税率のさらなる適用を挙げる。再生可能エネルギーや農作物を市内で調達する地産地消で、地域にお金が回る仕組みをつくるとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策1「暮らしやすい＝大企業中心ではない、地域循環型経済へ」で、市は大企業応援やスタートアップには力を入れているが地域の中小業者への支援は不十分だとしている。公共事業を首都圏に本社がある大企業に任せると事業費の大部分が持ち出されるとして、市内に本社がある中小業者が引き受ければ地域で使われるお金が増えると説明し、再生可能エネルギーや農作物も市内から調達する地産地消を挙げる。具体策として、大企業への法人市民税のさらなる超過税率適用、公共事業に市内中小業者が参入しやすい仕組みづくり、公契約条例の制定、最低賃金の引き上げに向けた社会保険料の使用者負担軽減などを国・県に求めること、司書・教職員・スクールカウンセラーなど専門職の待遇改善と正規雇用化、会計年度任用職員の待遇改善を掲げている。",
            url: "https://katayamasumiko.com/kurashiyasui-2/",
          },
          {
            date: "2026-09-26",
            place: "記者会見",
            source: KATAYAMA_KAIKEN_SOURCE,
            text: "「高島さんは経済の人だと言われるが、私も経済の人です。高島さんとは違う経済を目指している」として、暮らしやすい・住みやすい・動きやすいの3つを重点に挙げた。福岡には中小企業が多く、そこが儲かってお金が市内に落ちれば地域で回るお金が増えるとし、賃金が上がることも同じだと述べている。",
            url: KATAYAMA_KAIKEN_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都構想については、法案そのものがまだ見えない段階で、首都機能が何で福岡に何を期待しているのかが分からないとし、検証を含めて判断したいとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-26",
            place: "記者会見",
            source: KATAYAMA_KAIKEN_SOURCE,
            text: "副首都構想については、法案そのものがまだ見えない段階で、首都機能が何で福岡に何を期待しているのかが分からないとし、検証を含めて判断したいとした。",
            url: KATAYAMA_KAIKEN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "観光客向けの拠点間を結ぶ大規模交通の計画には市が熱心な一方、住民の生活交通は軽視されているとして、住民の足の確保を優先するとしている。都心の空きオフィスに図書館・博物館・劇場など公共の文化芸術施設を置く案も示す。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策3で、市は観光客向けの拠点間を結ぶ大規模交通の計画には熱心である一方、住民は軽視されているとし、「住民の福祉」を充実させるために地下鉄だけでなく直営の公共バスも増やすべきだとしている。政策4では、都心部の空きオフィスに図書館・博物館・劇場など公共の文化芸術施設を設置し、図書館では書籍などの寄贈・遺贈を受けることを挙げている。",
            url: "https://katayamasumiko.com/ugokiyasui/",
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "日本に3か月を超えて滞在する外国籍の人も住民基本台帳に登録され、税や社会保険料を負担する同じ「住民」だとして、市の人口の4%弱を占めるようになった外国人への差別や排外主義を許さない施策を立案・実施するとしている。多言語対応の外国人総合相談センターの設置、日本語学習の環境づくり、地域での多文化共生推進プランの策定、災害時の対応を挙げ、罰則付きのヘイトスピーチ禁止条例の制定を掲げる。「特別永住者」への地方参政権付与について検討を始めるとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: KATAYAMA_POLICY_BOOK_SOURCE,
            text: "政策集の政策7「人権を守る＝差別をなくし、多様性を尊重する共生社会をつくる」で、「日本に3ヶ月を超えて滞在する外国籍の方々も、自治体が管理する住民基本台帳住民に登録され、税や社会保険料の負担などを課された同じ『住民』です」とし、あらゆるヘイト発言・行為によって差別を煽ったり憎悪を生み出したりすることは許されないとしている。個別政策として、罰則付きのヘイトスピーチ禁止条例の制定、福岡市人口の4%弱を占めるようになった外国人への差別や排外主義を許さない施策の立案・実施（多言語対応ができる外国人総合相談センターの設置、日本語学習の環境づくり、地域での多文化共生推進プランの策定、災害時の対応など）を挙げる。「特別永住者」の資格をもつ在日コリアンの人々は子ども時代から日本社会で暮らす「住民」で、戦後に国籍を失った歴史を持つとし、北欧諸国・韓国などでは外国籍住民に地方参政権が認められているとして、「特別永住者」に対する地方参政権について検討を始めるとしている。",
            url: KATAYAMA_POLICY_BOOK_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策7「人権を守る」で、罰則付きのヘイトスピーチ禁止条例の制定、多言語対応ができる外国人総合相談センターの設置、日本語学習の環境づくり、地域での多文化共生推進プランの策定を挙げている。市の人口の4%弱を占めるようになった外国人への差別や排外主義を許さない施策を進めるとし、「特別永住者」への地方参政権についても検討を始めるとしている。",
            url: KATAYAMA_POLICY_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "対話の市政への転換を掲げ、2週に1回ほどの割合で住民との対話集会を開き、4年間で100回程度を目指すとしている。情報公開の徹底と政治の透明性の確保を挙げ、市議会・議員とも粘り強く意見交換して毎年政策の5%でも変えていくとする。市役所内の「ハラスメント構造」をなくし、職員削減と4割に及ぶ非正規化を見直して、職員が力を発揮できる職場にするとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策9「自治体のあり方と対話の市政へ」で、二元代表制のもとで市長の指示で可能なもの（非核平和都市宣言の発出、自衛隊への名簿提供撤回の検討、ジェンダー平等施策の見直し）がある一方、多くは予算案として市議会のチェックを受けるとし、議員と粘り強く意見交換しながら毎年政策の5%でも変えていければ4年で変化は見えてくるとしている。改革には情報公開の徹底、政治の透明性の確保、住民参加・対話集会の仕組みが必須だとし、東京都杉並区の区長が1期目の4年間に住民との直接対話を400回つくった例を挙げ、2週に1回の割合なら4年間で100回ほどになるとして、テーマや年齢・性別・地域に配慮しながら対面で行いたいとしている。",
            url: "https://katayamasumiko.com/jichitai/",
          },
          {
            date: "2026-09-26",
            place: "記者会見",
            source: KATAYAMA_KAIKEN_SOURCE,
            text: "市議会で議員の質問項目を職員が作っていたとされることについて「あれってハラスメントの構図だと思う」と述べ、力のある者に物が言えず風通しが悪い職場では優秀な職員が力を発揮できないとして、市役所内の空気とハラスメントの構図を変えることに取り組みたいとした。福岡市の職員数は政令市の中で少なく、非正規雇用が4割弱で、その8割を女性が占めるとして、女性の低賃金と不安定雇用が市の職員構成の中でつくられている面があるとも述べている。",
            url: KATAYAMA_KAIKEN_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "歳出は「住民福祉の増進」を第一に使うとし、財源として大企業への法人市民税の超過税率適用の検討、大型開発事業（天神ビッグバン、人工島事業、中央ふ頭・須崎ふ頭の埋め立て事業など）に投入予定の資金の見直し、財政調整基金約300億円の一部活用を挙げている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策9で、福岡市の2026年度一般会計の予算規模は1兆1318億円だとし、歳入の中心は住民の税金だとしている。高島市長は大型開発で地価が上がり固定資産税・都市計画税が増えたことを誇っているが功罪両面があるとしたうえで、歳出は「住民福祉の増進」を第一に使うとする。財源を生み出す方法として、大企業への法人市民税のさらなる超過税率適用の検討、大型開発事業（天神ビッグバン、人工島事業、中央埠頭や須崎埠頭の埋め立て事業など）に投入される予定の資金の見直し、財政調整基金約300億円の一部活用を挙げている。",
            url: "https://katayamasumiko.com/jichitai/",
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "ジェンダー平等に本気で取り組むとして、男女共同参画部を司令塔に据え、あらゆる意思決定での男女同数、包括的性教育の推進、生理用品の公的施設への設置、ハラスメント根絶と性的マイノリティーへの差別禁止のための条例制定を挙げる。市の管理職の女性比率は部長17.2%・課長21.0%にとどまり、非正規の会計年度任用職員は77.8%が女性だとする。人権では市民局の人権部を司令塔に、住民が参加する「市民会議」を設け、教育現場での差別・いじめの解消やバリアフリーを進めるとする。平和では憲法9条を守り、市長名での「非核平和都市宣言」、福岡空港に残る米軍基地の早期返還、博多港の特定利用港湾指定の撤回、自衛隊への若者の個人情報提供の中止を挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: KATAYAMA_POLICY_BOOK_SOURCE,
            text: "政策集の政策6で、2026年のジェンダーギャップ指数の日本の総合順位は145カ国中117位だとしたうえで、福岡市の状況を数字で示している。ふくおか県「翼の会」が実施した2025年「男女共同参画に関するアンケート調査」によると、正規職員1万125人のうち女性は3615人（35.7%）、会計年度任用職員6470人のうち女性は5034人（77.8%）で、「部長」157人のうち女性は27人（17.2%）、「課長」842人のうち177人（21.0%）、「係長」2459人のうち712人（29.0%）だとする。市内公立学校の女性校長の割合も4分の1に達せず、町内会長の女性は10%未満だとして、福岡市自身が男女の賃金格差・不安定雇用を助長していると指摘する。1990年代から言われるようになった「性と生殖に関する健康と権利（SRHR）」の観点から、性犯罪を防止し望まない妊娠を防ぐためにも学校での包括的性教育の推進は必須だとし、現状の「プレコンセプションケア」事業はSRHRの意識が広まり包括的性教育が進んだうえでの取り組みとすべきだとして検証・見直しを挙げる。ハラスメント根絶と、性的マイノリティー（LGBTQ＋）への差別禁止のための条例制定も掲げている。",
            url: KATAYAMA_POLICY_BOOK_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: KATAYAMA_POLICY_BOOK_SOURCE,
            text: "政策集の政策7「人権を守る＝差別をなくし、多様性を尊重する共生社会をつくる」で、憲法13条・14条の理念を実現していく責務が福岡市にはあるとし、子ども・若者、高齢者、女性、性的マイノリティー（LGBTQ＋）、障がい者、外国人など様々な属性をもつ人々が住んでいるとして、あらゆる差別をなくすとしている。個別政策として、市民局内の「人権部」が司令塔となって市役所内のあらゆる部局を見渡して施策を立案・実施すること、「市民会議」を設置して議論と実践の場に住民の参加を促すこと、教育現場で様々な属性・文化への理解を深め差別・いじめなどをなくすこと、学校・公共施設などでのバリアフリーの推進を挙げている。",
            url: KATAYAMA_POLICY_BOOK_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: KATAYAMA_POLICY_BOOK_SOURCE,
            text: "政策集の政策8で、福岡市でも福岡空港での日米共同演習などの軍事訓練やオスプレイの飛来、博多港の特定利用港湾指定、基地周辺の重要土地利用規制法による注視区域指定といった動きが起こっているとして、これらは市民を戦争に巻き込む危険性を増大させるものだとしている。「台湾有事」を想定して沖縄県石垣市から避難住民2万7千人を市内の指定ホテルを全室空室にして受け入れる計画が立てられたことにも触れ、国の戦争準備に協力するものであり許されないとする。個別政策として、重要土地利用規制法の「注視区域」「特別注視区域」への指定の撤回、博多港の特定利用港湾指定の撤回を挙げている。",
            url: KATAYAMA_POLICY_BOOK_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策6「ジェンダー平等に本気で取り組む」で、市の女性管理職（課長級以上）比率は20%前後、福岡市防災会議は49人中女性が7人（14.3%）、町内会長の女性は10%未満だとして、市民局「男女共同参画部」を司令塔として組織を改変し、行政・企業・議会・学校・地域のあらゆる意思決定での男女同数を目指すとしている。男女共同参画推進センター「アミカス」の指定管理を見直して本格的に機能させること、学校での包括的性教育の推進、生理用品の公的施設への設置、市役所全体のハラスメント根絶も挙げる。",
            url: "https://katayamasumiko.com/gender/",
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: KATAYAMA_SITE_SOURCE,
            text: "政策8「平和を守る」で、憲法9条を守り安保法制の廃止を求めること、福岡空港内に残る米軍基地（板付基地）の早期返還、自衛隊への18歳・22歳の個人情報提供の中止、市長名での「非核平和都市宣言」、戦争遺構の保存や戦争体験の伝承、常設の平和資料館の設置、近隣諸国との文化交流を挙げる。",
            url: "https://katayamasumiko.com/heiwa/",
          },
        ],
      },
    },
  },
  {
    id: "yoshitomi-keiko",
    no: "13",
    name: "吉富 景子",
    kana: "よしとみ けいこ",
    age: 37,
    title: "眼科医",
    party: "無所属（参政党推薦）",
    lead: "「今こそ、福岡市民ファースト！」を掲げ、8つの約束を公表している。天神ビッグバンの発展は評価しつつ、成長が市民の所得に結びついていないとして、地場企業への還元と外国人住民の増加への対応を訴える。参政党と政策協定を結び推薦を受けている。",
    bioSource: `${YOSHITOMI_SITE_SOURCE}／${YOSHITOMI_KAIKEN_SOURCE}／${YOSHITOMI_KBC_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1989年1月19日生まれ。神奈川県川崎市で生まれ、3歳のときに福岡へ移り、以後ずっと福岡市で育ったとしている",
      },
      {
        label: "学歴",
        text: "筑紫女学園高等学校を経て、1年の浪人の後に九州大学医学部医学科へ進学し、2015年に卒業",
      },
      {
        label: "医師",
        text: "2015年から2年間の臨床研修を経て、2017年に九州大学眼科学教室へ入局。眼科医として約10年診療にあたっており、現在の勤務先は福岡市外だが居住は福岡市内としている",
      },
      {
        label: "2026",
        text: "2月の衆議院議員総選挙に参政党公認で福岡1区から立候補し、32,095票（5人中3位）を獲得。9月29日に出馬表明の記者会見を開き、参政党と政策協定を結んで推薦状を受け取った",
      },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「今こそ、福岡市民ファースト！」を掲げる。多くの候補者が高島市政の継承を打ち出しているとしたうえで、成長の果実を配分するだけでは課題は解決せず、成長のあり方自体を見直す必要があるとしている。",
      },
      {
        label: "8つの約束",
        text: "①福岡の仕事を福岡の所得へ、②食料品消費税1%から地域の飲食店を守る、③外国人住民10万人時代の「責任ある地域社会」、④介護を必要としない体と環境をつくる福祉、⑤小学校低学年のデジタル教材の使用制限、⑥学校給食に50%以上の地元産、⑦フリースクールの授業料補助、⑧水害や警固断層地震への備え、を公表している。",
      },
      {
        label: "重点",
        text: "最も優先したいのは公約1だとし、まちの成長が市民の給料に結びついていないとして、成長が市民生活に直結する制度づくりを進めるとしている。若者世代・子育て世代・飲食店の3つを対象に挙げる。",
      },
      {
        label: "立場",
        text: "無所属で立候補し、参政党の推薦を受ける。党の考えと市長としての判断が食い違う場面は想定しているとし、その場合は党や市議会と話し合って決めるとしている。参政党を支持していない市民の声も聞いて市政に生かすとする。",
      },
    ],
    takashimaAssessment: {
      summary:
        "この15年で福岡市が大きく発展し全国的に有名になったことは「非常に評価している」としている。一方で、市民の給料が上がらず家賃が上がって生活が苦しいという声を挙げ、そのまま継承するのではなく一度立ち止まって評価し、生活のために何ができるかという別の方向へ舵を切る必要があるとしている。天神ビッグバンの建設費のうち地元企業に落ちたのは1割に満たないとして、地場企業を大事にしてこなかった点を課題に挙げる。",
      updated: "2026年9月",
      log: [
        {
          date: "2026-09-29",
          place: "記者会見",
          source: YOSHITOMI_KAIKEN_SOURCE,
          text: "高島市政16年の評価を問われ、「この15年間でかなり福岡市も発展して全国的に有名になったことに対しては非常に評価しています」と述べた。ただし給料が上がらないことや家賃が高くなっていることを挙げ、「そのまま継承するのではなくて、1回立ち止まって、じゃあこれからは生活のためにどんな市政ができるのか1回評価して、また違う方向で舵取りをしていかなければいけない」としている。子育て世帯への手当ては高島市政で評価できる部分だとしつつ、それでも出生数は減っており不十分だと述べた。",
          url: YOSHITOMI_KAIKEN_URL,
        },
        {
          date: "2026-09",
          place: "本人サイト",
          source: YOSHITOMI_SITE_SOURCE,
          text: "決意のページで、子どもの頃の福岡市は「ごはんが美味しい地方都市」というイメージだったが、この15年間で天神ビッグバンをはじめ大きく発展し「成長する都市」として全国に知られるようになったとして「本当に誇らしく思います」としている。一方で、医療や福祉の現場では職員が責任に見合う処遇を得られていないこと、家賃が高く市内に住むのは大変だという声を挙げ、市民一人あたりの市民所得はこの10年横ばいだとする。その原因の一つとして地場企業を大事にしないことがあるのではないかとし、天神ビッグバンの高いビルの建設費のうち地元企業に落ちたのは10%にも届いていないとしている。",
          url: YOSHITOMI_SITE_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト（八つの約束）", url: YOSHITOMI_POLICY_URL },
      { label: "本人サイト（プロフィール）", url: YOSHITOMI_PROFILE_URL },
      { label: "報道（KBC九州朝日放送）", url: YOSHITOMI_KBC_URL },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "yoshitomikeiko.jp",
        url: YOSHITOMI_SITE_URL,
      },
      {
        kind: "X",
        handle: "@yoshitomi3keiko",
        url: "https://x.com/yoshitomi3keiko",
      },
      { kind: "YouTube", handle: "", url: "" },
      { kind: "TikTok", handle: "", url: "" },
      {
        kind: "Instagram",
        handle: "@yoshitomi_keiko",
        url: "https://www.instagram.com/yoshitomi_keiko",
      },
      {
        kind: "Facebook",
        handle: "よしとみ景子",
        url: "https://www.facebook.com/profile.php?id=61588545635967",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "小学校低学年ではデジタル教材の使用頻度や時間を制限し、「紙の教科書と手書きによる学習」を基本に据えるとしている。眼科医の立場から、視力の発達への影響について実態調査を行い連続使用を防ぐルールをつくるとする。不登校支援では、一定の基準を満たすフリースクールの利用料を所得に応じて助成し、学校復帰だけを目標にしないとしている。学校給食は地元産の農水産物の使用割合を2030年までに50%にするとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: YOSHITOMI_SITE_SOURCE,
            text: "公約5で、小学校低学年は子どもの目の発達にデリケートな時期で「遠視」の児童も多いとして、デジタル端末の長時間の注視が視力の発達を妨げるリスクや眼精疲労の懸念があるとし、使用頻度や時間を制限して「紙の教科書と手書きによる学習」を基本に据えるとしている。眼科医など専門家の知見を入れて視力や睡眠への影響の実態調査を行い、長時間の連続使用を防ぐルールを策定するとする。特別支援を必要とする児童生徒へのICT活用は積極的に続けつつ、一律の「完全デジタル教科書」への移行には慎重な見直しを国に働きかけるとしている。公約6では、地元産の農水産物の給食利用割合が2024年で30%に達していないとし、地元の農協・漁協と協議して2030年までに50%にすること、可能な限り有機農産物を使う目標を定めること、西区・早良区など生産地に近い学校からのモデル実施を挙げる。公約7では、不登校児童が2017年から急増しているとして、学校復帰だけを唯一の目標とせず、各区の相談体制を強化し、一定の安全・教育・会計基準を満たすフリースクールの利用料を所得に応じて助成するとしている。",
            url: YOSHITOMI_POLICY_URL,
          },
          {
            date: "2026-09-29",
            place: "記者会見",
            source: YOSHITOMI_KAIKEN_SOURCE,
            text: "子育て世帯への支援について、福岡市はすでに手当てを行っており高島市政で評価できる部分だとしつつ、それでも子どもが生まれにくくなっているとして不十分だと述べた。土地の値段を安くすること自体はできないとしたうえで、市営住宅の活用などで経済的な負担を減らし、子どもを育てやすい福岡市にしたいとしている。",
            url: YOSHITOMI_KAIKEN_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "「介護を必要としない体と環境をつくる福祉へ転換する」として、高齢者健診に転倒リスクの確認を導入し、視力・視野や聴力、筋力、服薬、住環境を総合的に確認するとしている。白内障などの早期発見で骨折から寝たきりに至る流れを断ち、社会保険料の抑制につなげるとする。介護現場が外国人に頼らずに済むよう、市内で介護職を目指す人への資格取得費や家賃、職場定着の支援を行うとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: YOSHITOMI_SITE_SOURCE,
            text: "公約4で、複数の病院から出る薬の飲みすぎを防ぐ重複服薬の相談体制を整えるとし、市が処方内容を変更することはしないとしている。介護のきっかけは転倒による骨折が多く目の見えにくさも一因だとして、高齢者健診に転倒リスク確認を導入し、視覚リスクが高い人には眼科受診を勧めて治療可能な白内障などの早期発見につなげるとする。介護現場が外国人に頼らないで済むよう、外国人を雇うと支給される補助制度と同等の制度として、市内で介護職を目指す人に資格取得費・家賃・復職研修・奨学金返済・職場定着支援を行い、市内の若者や子育て離職者、潜在介護福祉士の就業を重点的に支えるとしている。",
            url: YOSHITOMI_POLICY_URL,
          },
          {
            date: "2026-09-29",
            place: "記者会見",
            source: YOSHITOMI_KAIKEN_SOURCE,
            text: "医師として、増え続ける社会保険料は深刻な問題だと述べた。高齢化だけで片付けてはいけないとして、目が見えにくいと転んで骨折し寝たきりになるという「負のループ」を、リスクの高い高齢者に眼科健診を行い白内障を早期に治療することで断ち切り、社会保険料の削減につなげたいとしている。介護職については、介護が必要な高齢者は体調の訴えを言葉で伝えるのが難しく、日本人でも難しい対応を外国の方にできるのかとして、外国人を増やすことは否定しないとしつつ日本人の介護士を増やす体制を整える必要があるとし、介護施設で働きながら資格を取る際の就職時の支援（上限20万円）や研修支援を挙げた。",
            url: YOSHITOMI_KAIKEN_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "交通インフラに市が予算を投じてこなかったことを大きな問題だとし、整備には多額の予算がかかるとして国に積極財政による予算の支援を求めるとしている。当面できることとして、混雑する地下鉄で観光客の大型トランクのサイズを制限することに検討の余地があるとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-29",
            place: "記者会見",
            source: YOSHITOMI_KAIKEN_SOURCE,
            text: "都心の混雑と周辺部の路線減便という二重の課題について問われ、交通渋滞やインフラに福岡市があまり予算を投じてこなかったことは非常に大きな問題だと述べた。ただ今から取り組むと多額の予算がかかるとして、政府には積極財政に転じてインフラ整備の予算を援助してほしいとしている。現状でできることとして、地下鉄が混む原因の一つに観光客の大きなトランクがあるとして、トランクのサイズを制限するなどは検討の余地があるとした。",
            url: YOSHITOMI_KAIKEN_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "天神ビッグバンで進んでいるプロジェクトは責任を持って進めるとしつつ、元請けだけでなく下請けや資材まで市内企業・市内製品が使われるよう調整し、結果が地元企業と市民の利益になるようにするとしている。国際金融都市構想や金融特区は、外資優遇や不動産価格の高騰を招くリスクがあるとして、いったん立ち止まって再評価し見直すとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: YOSHITOMI_SITE_SOURCE,
            text: "公約1で、天神ビッグバンでは建築制限を緩和する際の条件として建設工事を一定割合で地場企業に発注することをしなかったとし、今後は市の調達で地場企業を優先し、市民や市内企業にも地場企業・地元産品の利用を要請するとしている。国際金融都市構想や金融特区の推進は、海外投資ファンドへの過度な優遇や不動産価格の高騰を招き市民生活や地元商店・中小企業を置き去りにするリスクがあるとして、特区による規制緩和と外資優遇を見直すとする。",
            url: YOSHITOMI_POLICY_URL,
          },
          {
            date: "2026-09-29",
            place: "記者会見",
            source: YOSHITOMI_KAIKEN_SOURCE,
            text: "国との関係を問われ、天神ビッグバンで進めているプロジェクトには責任を持って進めたいとしたうえで、「ただ進めるだけじゃなくて、それが結果的に福岡市の地元の企業であったり、福岡市民の利益になるよう調整して進めていかなければいけない」と述べた。例として、元請けの建設費を市内の企業に発注するだけでなく、その下請けや下流の部分で福岡市の製品を使うなどして、「プロジェクトは進めるんだけれども、それが結果的に地元の企業の利益になるように調整しながらやっていく」とし、それが「見直す」の意味だとしている。金融特区については、外国企業が来ること自体に反対しているわけではないとし、家賃・地代がバブル期より高くなっている現状を挙げて、対策を講じずに受け入れ続けた場合の弊害を再評価して見直すとした。",
            url: YOSHITOMI_KAIKEN_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "室見川・樋井川などで県との連携を強め、内水氾濫対策を加速するとしている。警固断層地震の被害想定が見直されたことを受け、揺れやすさマップの周知、家屋の耐震化や家具固定の推進、避難所の整備を進めるとする。全ての指定避難所の冷暖房・非常用電源・トイレ・通信・プライバシー確保設備を総点検して公表し、体育館の雑魚寝ではなくテント型の導入など長期避難に対応できる環境を整えるとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: YOSHITOMI_SITE_SOURCE,
            text: "公約8で、室見川・樋井川などについて県との連携を強化し内水氾濫対策を加速するとし、線状降水帯による豪雨にも耐えられる整備を進めるとしている。警固断層が動いた場合の被害想定が修正され大幅に被害が拡大する予想になったとして、最大震度を想定した揺れやすさマップの周知、家屋の耐震化と家具の固定、避難所の整備を挙げる。市は学校体育館の空調整備を2027年度までに完了する予定だとしたうえで、「真夏・真冬でも生活できる避難所」の整備を促進するとし、全ての指定避難所について冷暖房・非常用電源・トイレ・飲料水・通信環境・プライバシー確保設備を総点検して整備状況を公表するとしている。体育館での雑魚寝ではなくイタリア式のテント型を導入するなど、公民館・市民センターも含めて長期避難に対応できる環境整備を進めるとする。",
            url: YOSHITOMI_POLICY_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "「福岡の仕事を、福岡の所得へ」を最優先に掲げ、市の調達で地場企業を優先し、下請けや資材まで市内に利益が残るようにするとしている。跡継ぎのいない企業が市外・県外に買収されないよう事業承継を支援するとする。食料品の消費税引き下げに備え、飲食店向けに無利子・無担保・保証料ゼロの「予防融資」（最大1,500万円、200億円の融資枠）を創設するとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: YOSHITOMI_SITE_SOURCE,
            text: "公約1で、市の調達では地場企業を優先し、域外資本を呼ぶだけでなく福岡に利益を残す政策を進めるとしている。事業承継の支援として、従業員承継、経営者保証の解除、後継者育成、地域金融機関との承継ファンドを支援し、承継後も本社・雇用・技能が福岡市に残る案件を重点支援するとする。公約2では、食料品の消費税を1%に引き下げる法律案に「大反対」としたうえで、成立した場合に地場の小規模な飲食店が経営の存続にかかわる事態に直面するとして、売上減少前から使える無利子・無担保・保証料ゼロの「予防融資」を創設するとし、最大1,500万円、3年間元金据置、10年返済、200億円の融資枠を挙げている。",
            url: YOSHITOMI_POLICY_URL,
          },
          {
            date: "2026-09-29",
            place: "記者会見",
            source: YOSHITOMI_KAIKEN_SOURCE,
            text: "最も優先したいのは公約1だとし、まちの成長が市民の給料に結びついていないとして、成長が市民生活に直結する制度づくりを進めると述べた。企業を誘致しても「なるべく本当に地元の企業に発注するような、そういう制度作りをします」とし、市役所はすでに公共工事の約85%を市内企業に発注しているが、元請けが市内企業でもその下流の下請けや資材はそこまで行きついていないと説明。元請けとして発注したかだけでなく、その工事が「最終的に福岡市の経済の中でどれだけ残ったか」を見て進めたいとしている。予防融資については、市が信用保証協会に7億円を投じて200億円の融資枠を設けるとし、食料品の消費税が来年4月に導入されるなら1月に受付を始め3月から借りられる体制を整えたいとしている。地元の飲食店は「博多の下町文化」で大事な文化だとして、守りたい思いは他の候補者の誰よりも強いとも述べた。",
            url: YOSHITOMI_KAIKEN_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "副首都構想は現在進めているので撤回せずきちんと進めたいとしつつ、首都機能の何を福岡に移すかなど内容が明らかになったうえで着手したいとしている。天神ビッグバンで生じる空き床を利用できる点で福岡市は有利ではないかとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-29",
            place: "記者会見",
            source: YOSHITOMI_KAIKEN_SOURCE,
            text: "副首都構想については、現在進めているので撤回せずきちんと進めたいとしつつ、首都機能の何を福岡に移すかなど内容が明らかになったうえで着手したいとし、天神ビッグバンで生じる空き床を利用できないかとして福岡市は有利ではないかと述べている。",
            url: YOSHITOMI_KAIKEN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "インバウンドは人数を追い求めないとし、観光客数だけを成果指標とせず、一人あたり消費額、宿泊日数、市内調達額、地域への分散、市民生活への負担を指標にするとしている。民泊は住宅宿泊事業法にもとづく事務を市が担い、区域や期間の制限を市の条例で定めるとする。観光地の混雑やごみ、違法民泊への対応にかかる費用は宿泊税の増税で確保するとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09",
            place: "本人サイト",
            source: YOSHITOMI_SITE_SOURCE,
            text: "公約3で、インバウンドは人数を追い求めないとして、観光客数だけを成果指標とせず一人当たり消費額・宿泊日数・市内調達額・地域への分散・市民生活への負担を指標にするとしている。民泊については、住宅宿泊事業法第68条にもとづき県と協議して届出・監督などの事務を市が担い、苦情や住宅地への影響を調査したうえで必要性と合理性を示した区域・期間の制限を市の条例で定めるとし、違法営業や騒音への対応も県任せにせず市が迅速化するとする。観光地の混雑、ごみ、違法民泊、観光客向けのルール周知に必要な費用は宿泊税を増税して確保するとしている。",
            url: YOSHITOMI_POLICY_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "「外国人住民10万人時代の『責任ある地域社会』を創る」として、転入した外国人に納税・ごみ・交通・騒音・防災などの生活ルールを説明して順守を求めるとしている。税などの未納や違法民泊、不法投棄、騒音には国籍を問わず是正を求めるとする。国が受け入れるだけ受け入れて自治体に丸投げになっている状況を変えるとして、外国人住民の増加に伴う行政需要と税・保険料収入を分野別・在留資格別に把握して公表し、国に財政措置と受け入れ企業の責任の制度化、受け入れ人数の調整を求めるとする。外国人への生活保護に準じた行政措置は、在留資格や居住年数などとの整合性を厳格に確認するとしている。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-29",
            place: "記者会見",
            source: YOSHITOMI_KAIKEN_SOURCE,
            text: "外国人政策について、国が受け入れるだけ受け入れて地方自治体に丸投げになっている状況を変えなければいけないと述べた。大学病院で日本語も英語も話せない患者に通訳が必要となり診療に時間がかかっている例を挙げ、このまま増えると医療機関がパンクするとしている。住民とのトラブルや行政コストをデータ化して国に提言し、受け入れ人数の調整や財政措置を求めるとした。国家戦略特区について問われ、特区で来た人が市にどれだけ利益をもたらし、地価の上昇などどれだけ不利益があるかもデータにまとめて国に提言し、協議を重ねたいとしている。",
            url: YOSHITOMI_KAIKEN_URL,
          },
          {
            date: "2026-09",
            place: "本人サイト",
            source: YOSHITOMI_SITE_SOURCE,
            text: "公約3「外国人住民10万人時代の『責任ある地域社会』を創る」で、転入外国人に納税・ごみ・交通・騒音・防災などの生活ルールを説明して順守を求めるとしている。外国人住民の増加に伴う行政需要（学校、住宅、医療、国保、通訳、生活相談等）と税・保険料収入を分野別・在留資格別に把握して公表し、国には受入れ政策で追加的な行政需要が生じる場合の財政措置と受入れ企業の責任の制度化を求めるとする。税などの未納、違法民泊、不法投棄、騒音には国籍を問わず是正を求め、県警・入管・県との連絡体制を強化するとし、外国人への生活保護に準じた行政措置については在留資格や居住年数、入国時の生計維持要件との整合性を厳格に確認し、国に制度の法的位置付けや費用負担、入管情報との連携の明確化を求めるとしている。",
            url: YOSHITOMI_POLICY_URL,
          },
        ],
      },
      dx: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "八つの約束で財源の考え方を示している。転入外国人への生活オリエンテーションは一般財源で実施し、観光地の混雑・ごみ・違法民泊・観光客向けルール周知に必要な費用は宿泊税を増税して確保するとしている。外国人住民の増加に伴う行政需要と税・保険料収入を分野別・在留資格別に把握して公表し、国には追加的な行政需要が生じる場合の財政措置と、国と自治体の費用負担の明確化を求めるとする。食料品消費税の引き下げに備えて飲食店向けの「予防融資」を創設し、200億円の融資枠を確保するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10",
            place: "本人サイト",
            source: YOSHITOMI_SITE_SOURCE,
            text: "八つの約束の公約3で、「外国人住民への生活オリエンテーションは一般財源で実施し、観光地の混雑、ごみ、違法民泊、観光客向けルール周知に必要な費用は、宿泊税を増税して確保します」としている。3-2では、外国人住民の増加に伴う行政需要（学校、住宅、医療、国保、通訳、生活相談等）と税・保険料収入等を分野別・在留資格別に把握して公表し、国には受入れ政策によって追加的な行政需要が生じる場合の財政措置と、受入れ企業の責任の制度化を求めるとしている。3-5では、外国人に対する生活保護に準じた行政措置について、国に制度の法的位置付けや国と自治体の費用負担の明確化を求めるとする。公約2では、食料品消費税1%への変更に備え、飲食店が売上減少前から利用できる無利子・無担保・保証料ゼロの「予防融資」を創設し、最大1,500万円・3年間元金据置・10年間で返済とし、200億円の融資枠を確保するとしている。",
            url: YOSHITOMI_POLICY_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "会見で参政党と政策協定を結び推薦を受けた。党の考えと市長としての考えが食い違うことは想定しているとし、その場合は党側とまず話し合い、市議会ともコミュニケーションを取って決めるとしている。国会議員では法案を通すのに限界があると痛感し、身近な地元から変えたいとして市長選への挑戦を決めたとする。",
        updated: "2026年9月",
        log: [
          {
            date: "2026-09-29",
            place: "記者会見",
            source: YOSHITOMI_KAIKEN_SOURCE,
            text: "立候補の理由を問われ、2月の衆院選では健康な人を増やして医療費を削減したいと訴えてきたが、一国会議員では法案を通すことなどに限界があると選挙後に痛感し、身近な地元から変えたいという思いが強くなったと述べた。高島市長の不出馬表明を受けて相談を受ける中で、市長選という大きな舞台であれば自分の思いがより多くの市民に伝わると考えたとしている。参政党と政策協定を結んだことについて、党の考えと市長としての考えが食い違うことは想定しているとし、国レベルの話と地方の話は変わってくるとしたうえで、その場合は党側とまず話し合い、市議会ともしっかりコミュニケーションを取って決めたいと述べた。",
            url: YOSHITOMI_KAIKEN_URL,
          },
          {
            date: "2026-09-29",
            place: "報道",
            source: YOSHITOMI_KBC_SOURCE,
            text: "出馬表明を報じ、「私が関わる医療や介護の現場では責任の重さに給料が見合ってない。また、家賃が高くて福岡市で住むのは大変そんな話もよく耳にします」との発言を伝えている。建設工事などでの地元企業の優先や、増える外国人住民に生活ルールの順守を求めることを掲げていること、会見で参政党と政策協定を結び推薦状を受け取ったことにも触れている。",
            url: YOSHITOMI_KBC_URL,
          },
        ],
      },
    },
  },
  {
    id: "inatomi-shuji",
    no: "14",
    name: "稲富 修二",
    kana: "いなとみ しゅうじ",
    age: 56,
    title: "前衆議院議員（4期・福岡2区）",
    party: "無所属",
    lead: "政策集「ともにつくる、福岡」で、都市が成長すれば市民も豊かになるという発想を変え、市民一人ひとりの豊かさが次の成長を生む福岡を掲げる。「副首都・福岡」の実現を軸に4つの重点戦略と14の政策分野を示し、県とのしがらみと戦うとして完全無所属で臨むとしている。",
    bioSource: `${INATOMI_SITE_SOURCE}／${INATOMI_KAIKEN_TEXT_SOURCE}`,
    bio: [
      {
        label: "出身",
        text: "1970年8月26日、福岡生まれ。東京大学法学部を卒業し、米国コロンビア大学公共政策大学院（SIPA）を修了。丸紅の人事部で所得税の実務に携わり、不公平な税制への疑問から政治への思いを強めたとしている",
      },
      {
        label: "1996",
        text: "松下政経塾に17期生として入塾（2000年卒塾）。租税や社会保障制度をテーマに活動し、松下幸之助の「無税国家論」を一生のテーマに挙げる",
      },
      {
        label: "2009",
        text: "衆院選（福岡2区）で初当選。民主党税制調査会の事務局次長として、社会保障制度の安定財源確保に関する答弁や立法に携わる",
      },
      {
        label: "2024",
        text: "衆院選（福岡2区）で4期目の当選。衆院選の前までは立憲民主党福岡県連の代表を務めたとしている",
      },
      {
        label: "2026",
        text: "2月8日投開票の衆院選で落選。9月に中道改革連合へ離党届を提出して無所属となり、10月13日に福岡市役所で出馬表明の記者会見。10月27日に政策発表の記者会見を開き、政策集「ともにつくる、福岡」を発表",
      },
    ],
    claims: [
      {
        label: "黄金の十年",
        text: "福岡市は2040年まで人口の増加数・増加率が他の政令市に比べてトップの恵まれた環境で過ごすとして、この10年を「黄金の十年」と呼びたいとしている。都市にも成長期があるようにどこかで成熟期を迎えるとし、この期間に福岡市の眠っている可能性を引き出し、課題を解決するとする。",
      },
      {
        label: "4つのビジョン",
        text: "政策集で、①「副首都・福岡」を実現する、②人への投資で一人ひとりの可能性を開く、③誰もが安心して住み続けられる福岡をつくる、④市民とともに信頼できる市政をつくる、の4つを掲げている。具体的な政策は、「もっと豊かな福岡」「住み続けられる福岡」「次世代の福岡」「信頼ある市政」の4つの重点戦略と14の政策分野で構成している。「すぐやること」として、下水道使用料の減免や事業者支援などの緊急生活支援プランを挙げる。",
      },
      {
        label: "成長のあり方",
        text: "「都市が成長すれば、やがて市民も豊かになる」という発想を変え、市民一人ひとりの暮らしが豊かになり、その積み重ねが都市の新たな成長を生み出す福岡にするとしている。これからの約15年でこの好循環を築き、人口減少社会にも対応できる都市へ進化させるとし、「継承か刷新か」の二者択一ではなく、築かれた強みを活かしてまだ発揮されていない可能性を引き出すとする。",
      },
      {
        label: "政治への信頼",
        text: "県庁と議会の歪んだ関係による政治不信が福岡市民をも覆っているとし、それを払拭しなければ政策の実現も前に進まないとしている。福岡市役所は福岡市民を向いて仕事をするという原点を確認したいとし、議会と市役所と市民の三者が協力して前に進めることで初めて福岡が良くなると述べる。",
      },
      {
        label: "立場",
        text: "完全無所属で挑戦するとし、どの政党にも団体にも推薦のお願いはしないとしている。組織としての支援は受けないが、個人として応援してもらうことはありがたいとする。市と県は協力するのが当然だとしつつ、時には利害が対立するかもしれないとして、しがらみとも戦うとしている。",
      },
    ],
    takashimaAssessment: {
      summary:
        "最大の功績は福岡市を「九州の福岡」から「日本の福岡」へとブランド化したことだとしている。16年間続けたことも一政治家として考えればとてつもないことだと述べ、継承できない点は「特に今すぐ思い当たることはありません」としつつ、成長の果実を生活に振り向けて循環させる発想は継承したいとする。開発には「少し一服感がある」として、これからはソフトの部分＝人づくりや教育に力を入れるとしている。",
      updated: "2026年10月",
      log: [
        {
          date: "2026-10-27",
          place: "本人サイト",
          source: INATOMI_POLICY_SOURCE,
          text: "政策集の冒頭「福岡は、もっとできる。」で、福岡はこの十数年で大きく成長し、人口が増え、まちの姿が変わり、国内外での知名度や都市としての存在感も高まったとして、「これまでの市政が、福岡の知名度や都市ブランドを高めてきたことは評価しています」としている。そのうえで、福岡という都市は元気になったが、福岡で暮らす市民と頑張る企業は本当に元気になったかと問い、物価や住宅費の上昇、経済的な不安から子育てをためらう家庭、人手不足やコストの上昇に苦しむ企業を挙げて、都市の成長を市民と企業の豊かさにつなげる取り組みは「まだ道半ば」だとする。目指すのはこれまでの市政の「継承か刷新か」という二者択一ではなく、築かれた強みを活かし、まだ十分に発揮されていない可能性を引き出すことだとしている。",
          url: INATOMI_POLICY_URL,
        },
        {
          date: "2026-10-13",
          place: "記者会見",
          source: INATOMI_KAIKEN_SOURCE,
          text: "高島市政への評価を問われ、市長の最大の功績は福岡市を「九州の福岡市」から「日本の福岡市」にした、つまりブランド化したことだと述べた。国の側から見ていて福岡市はとても良いイメージで、多くの人から「ぜひ行きたい」と言われるようになったとしている。16年間続けることは一政治家として考えればとてつもないことで、人口の出入りの激しい福岡市で得票を増やし続けるのはこれまでの市の歴史を考えてもなかなかできないことだとし、突発的な事故や災害、コロナのような異常事態を乗り越えてのことだと評価した。継承できないと思う方針や政策があるかを問われ「特に今すぐ思い当たることはありません」としたうえで、成長とその分配、いわば成長の果実を生活に振り向けて循環させるという発想は継承したいと述べ、その果実を人づくりに振り向けることが必要だとしている。開発については、天神・博多はまだ残っている部分もあるが「少し一服感がある」とし、副首都と港の開発が大きく残っていると感じるとした。ハードの開発を進めてきたのであれば、今度はソフトの部分でどう深化して取り組むかがこれからの10年に必要で、それが人づくりであり教育であり、誰一人取り残さない教育だとしている。",
          url: INATOMI_KAIKEN_URL,
        },
      ],
    },
    links: [
      { label: "本人サイト（政策集）", url: INATOMI_POLICY_URL },
      {
        label: "本人サイト（政策集 完全版・全18ページ）",
        url: INATOMI_POLICY_PDF_URL,
      },
      { label: "本人サイト（記者会見の全文）", url: INATOMI_KAIKEN_TEXT_URL },
      { label: "本人サイト（出馬表明）", url: INATOMI_HYOMEI_URL },
      { label: "本人サイト（プロフィール）", url: INATOMI_PROFILE_URL },
    ],
    sns: [
      { kind: "公式サイト", handle: "inatomi.jp", url: INATOMI_SITE_URL },
      {
        kind: "X",
        handle: "@inatomishuji",
        url: "https://x.com/inatomishuji",
      },
      {
        kind: "YouTube",
        handle: "いなとみ修二",
        url: "https://www.youtube.com/channel/UCBib4uZvP0hVsXil87cVQpA",
      },
      {
        kind: "TikTok",
        handle: "@inatomishuji",
        url: "https://www.tiktok.com/@inatomishuji",
      },
      {
        kind: "Instagram",
        handle: "@inatomi_office",
        url: "https://www.instagram.com/inatomi_office/",
      },
      {
        kind: "Facebook",
        handle: "いなとみ修二 広報室",
        url: "https://www.facebook.com/inatomi.news/",
      },
      { kind: "note", handle: "", url: "" },
    ],
    positions: {
      kosodate: {
        stance: "表明済み",
        summary:
          "政策集で「子育てするなら、福岡。」を掲げ、第1子からの保育料無償化を検討し、保育所の副食費の無償化に取り組むとしている。保育士を確保して入所保留児童ゼロを目指すとする。多子世帯には保育・教育・給食・住宅の費用負担を総合的に見直して支援を充実させ、修学旅行費・教材費・制服代の負担軽減策や夏休み期間中の給食提供も検討するとする。学校では教員が子どもと向き合えるよう人員配置を充実させ、不登校でも校内の学習支援教室やオンライン学習、民間の学びの場と連携して学び続けられるようにするとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策5「子育ての負担を徹底的に軽減する」で、「子育てするなら、福岡。」として、子どもを産み育てたいという希望が経済的な理由で妨げられない福岡へ、第1子からの支援と多子世帯への重点支援を進めるとしている。個別政策として、①第1子からの保育料無償化を検討し、保育所の給食にかかる副食費の無償化に取り組み、保育ニーズを踏まえた受け入れ体制の充実と入所保留児童対策を進める、②多子世帯に対し保育・教育・給食・住宅などの費用負担を総合的に見直して支援を充実させる、③子どもの成長や家族構成の変化に応じた住宅取得・住み替え・家賃負担などへの支援を強化する、④保育士を確保して入所保留児童ゼロを目指し、休日保育・病児・病後児保育・一時保育を拡充する、⑤修学旅行費・教材費・制服代などの負担軽減策を検討する、⑥長期休業中も子どもが安心して食事を取れるよう学校給食の提供方法や課題を検討する、⑦放課後児童クラブや学校施設を活用した体験活動などを整理して安全な居場所と多様な学びを確保する、⑧妊娠期から出産後までの相談支援や産後ケアを充実させ家庭への訪問支援も強化する、⑨仕事・所得・住宅・保育・教育を一体的に捉え、希望する人が安心して結婚・出産・子育てできる環境を整える、を挙げている。政策3「人への投資で、一人ひとりの可能性を開く」では、教員が子どもと向き合う時間を確保できるよう学校現場の人員配置を充実させ、少人数でのきめ細かな指導や、心のケア・家庭の問題の相談を担う専門職員の配置を進めること、校内の学習支援教室・オンライン学習・民間の学びの場などとの連携を強化して不登校でも一人ひとりに合った学び方を選べるようにすることを挙げる。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_TEXT_SOURCE,
            text: "3つ目の政策として「人への投資を大胆に拡充する」とし、毎年九州各地から若い人材が福岡市に流入しているとして、希望する若者が結婚をし、経済的理由で子どもを持つことを諦めなくてよい環境づくりをしたいとしている。教育の機会均等の実現を目指し、不登校の子どもを誰一人学びから取り残さない取り組みをしたいとする。教育や人づくりはすぐに形や結果が出ないかもしれず、いろいろな意見があるかもしれないとしつつ、それを重点的に市として実行することが一人ひとりの幸せとともに福岡市の成長を支える力の源になると確信しているとしている。",
            url: INATOMI_KAIKEN_TEXT_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "「人への投資」は人材育成を指すのかを問われ、それもその通りだとしつつ、それだけにとまらないと述べた。人のライフステージには生まれる時から学生時代、社会人、引退後とそれぞれの段階があり、それぞれに政策があるとして、「それを全体として捉えて、そして有効な対策を打っていきたい」としている。学生時代だけに特化するのではなく、社会人や、これから子どもを持とうとする若いカップルの世代に対しても対策をしたいというのが趣旨だと説明した。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "政策集で、2035年までの介護需要を推計して特別養護老人ホームなどを計画的に整備し、介護職員の住宅支援・資格取得支援・介護ロボットの導入で人材の定着を進めるとしている。地域包括支援センターの増設と職員の増員、認知症の人と家族の相談、障がいのある人の親亡き後の体制強化、民生委員・児童委員の負担軽減と欠員解消を挙げる。一人暮らしの人の住まい探しや保証人の確保、孤独・孤立対策、急病や入院時の安心の仕組みも掲げ、住宅では子育て世帯・若者・高齢者への住宅取得や家賃の支援制度、空き家の活用、窓の断熱リフォームの支援を検討するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策7「福祉・介護・医療の安心を支える」で、高齢になっても、障がいや病気があっても、必要な支援を受けながら安心して暮らせる福岡を目指すとして、①2035年までの介護需要を推計し特別養護老人ホームなどの施設整備を進める、②介護職員の住宅支援・資格取得支援・デジタル技術や介護ロボットの導入を組み合わせて人材の定着を進める、③訪問介護や短期間の施設利用を充実させ、企業への出張相談や家族が休息できる支援を広げる、④地域包括支援センターを地域の需要に応じて増設し職員を増員する、⑤認知症の人や家族への相談を充実させ若年性認知症の人も含めた社会参加や就労を支援する、⑥障がいのある人の相談支援・日常生活の支援・就労や社会参加の機会を充実させ親が亡くなった後も安心して暮らせる体制を強化する、⑦健康診断や運動・食生活の改善を支援し医療機関と介護事業者の連携を強化する、⑧失業や病気、収入減少で生活が困難になった人に早期相談・就労支援・一時的な生活支援を組み合わせる、⑨民生委員・児童委員の活動負担を軽減し欠員の解消に向けて推薦方法や支援のあり方を見直す、を挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策6「一人でも安心して暮らせる福岡へ」で、住宅・健康・生活相談・孤独・孤立対策など各部署に分かれた制度を分かりやすく整理すること、高齢者や収入が不安定な人の住まい探しや住み替えを支援し保証人や緊急連絡先の確保が難しい人も住み続けられるようにすること、地域・民間企業・NPOと連携して相談や交流の場を広げること、急な病気やけが・災害時の連絡・安否確認・入院時の生活上の不安に対応できるよう関係機関の連携を強化すること、一人暮らしの高齢者が介護サービスや成年後見制度について早い段階から相談できるようにすること、移動販売や送迎に取り組む事業者への車両購入支援などで買い物や通院を支えることを挙げている。政策4「住み続けられる住宅政策を実現する」では、「福岡で働く人が、福岡に住み続けられるまちへ」として、子育て世帯・若者・高齢者などへの住宅取得や家賃の支援制度の検討、空き家の改修や流通の支援、市営住宅・公有地・民間住宅の活用、窓の断熱改修などへの支援の検討、手すりの設置や段差の解消など将来の介護も見据えた住宅改修の支援を挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_TEXT_SOURCE,
            text: "都市の成長と一人ひとりの生活の豊かさの両立を選挙の二つ目のテーマに挙げ、天神・博多には高いビルが建ち観光客も来て税収も上がった一方で、福岡市民の収入は横ばいが続き生活コストは上がる傾向で、特に住宅関係の生活コストは重い負担になっているとしている。物価高が重なって生活が大変厳しいという声、子育ての不安や老後の生活の不安を訴える声があるのも事実だとし、住みやすいと言われている福岡でどのように一人ひとりが豊かさを実感できるようにするのかが問われているテーマだとした。",
            url: INATOMI_KAIKEN_TEXT_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "政策はそれぞれ縦割りのような形になっているが、人が生きていく中で生まれる時から社会人になっていく過程があり、それぞれに政策があるとして、全体として捉えて有効な対策を打ちたいと述べた。引退後も含めたそれぞれのライフステージに対策があるとし、「ある人生がための支援」を総合的に考えていきたいとしている。福岡市の課題については、税収が伸びて開発が一定程度進んだ一方で市民所得が横ばいであり、物価高で生活コストが上がって一部では生活が苦しく、子育てや高齢者の方が将来に不安を感じているところがあるとした。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "政策集の「成熟都市にふさわしい交通政策へ」で、市内全域の渋滞箇所を徹底的に洗い出し、交差点の改良や信号制御の見直しなど原因に応じた緩和策を進め、都心部の駐車場政策の見直しで公共交通への利用転換を促すとしている。公共交通の利用が難しい地域では行政が主体となって生活交通を確保し、オンデマンド交通の運行エリアを広げるとする。地下鉄延伸や都市高速・幹線道路の整備を総合的に検討し、博多駅・ウォーターフロント・天神を新しい移動手段でつなぐこと、国の特区制度も活用した自動運転バスの実証と実用化、福岡空港の機能強化を挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策8「成熟都市にふさわしい交通政策へ」で、地下鉄・鉄道・バス・オンデマンド交通などを組み合わせ、都心部から住宅地・郊外まで誰もが移動しやすい福岡をつくるとしている。個別政策として、①公共交通の利用が難しい地域では行政が主体となって地域住民や交通事業者と協力して生活交通を確保し、オンデマンド交通の運行エリアを拡大する、②駅やバス停での乗り継ぎを改善し運行情報の連携を進める、③市内全域の渋滞箇所を徹底的に洗い出し交差点の改良や信号制御の見直しなど原因に応じた緩和策を検討・実施し、都心部の駐車場政策の見直しや公共交通への利用転換で自動車への過度な依存を減らす、④空港機能の強化や近隣空港との連携を進める、⑤地下鉄延伸や都市高速・幹線道路の整備を総合的に検討し、都心部では新しい技術を活用した移動手段で博多駅・ウォーターフロント・天神などの主要拠点をつなぐ、⑥運転手不足に対応するため国の特区制度なども活用して自動運転バスなどの実証と実用化を進める、を挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_TEXT_SOURCE,
            text: "生活に関わるさまざまな政策でも県との協力は避けて通れないとして、子ども医療費の問題、交通、福岡空港との交通アクセスをどう拡充するのかといった課題に及ぶとしている。福岡県とどう向き合うのかはこれから福岡市長に問われる問題だとし、市と県が協力するのは当然だと考えるとしたうえで、時には利害が対立することもあるかもしれないとした。",
            url: INATOMI_KAIKEN_TEXT_URL,
          },
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "天神・博多の開発にはまだ残っている部分もあるとしつつ「少し一服感がある」とし、副首都と港の開発が大きく残っているとしている。政策集では、アイランドシティから博多港、須崎ふ頭、シーサイドももちまでを一体的に捉え、物流・観光・商業・住宅・市民の集う場所を総合的に考える「博多湾グランドデザイン」を策定するとし、須崎ふ頭は港湾・物流機能を尊重しながら将来の土地利用の可能性を検討するとする。7区それぞれでは、建物の用途や高さ、駐車場のルールを地域の実情に応じて検証し、市街化調整区域は自然環境や農地の保全と調和させながら土地利用規制を見直すとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策11「博多湾と海・緑の魅力を活かす」で、「博多湾を、福岡の次のフロンティアへ」として、博多湾は物流や産業を支える基盤であり市民に潤いをもたらす都市空間だとし、アイランドシティから博多港、須崎ふ頭、シーサイドももちまでを一体的に捉えるとしている。個別政策として、物流・観光・商業・住宅・市民が集う場所などを総合的に捉えた博多湾全体の長期的なまちづくり構想「博多湾グランドデザイン」の策定、須崎ふ頭の現在の港湾・物流機能を尊重しながらの将来的な機能の見直しと新たな土地利用の可能性の検討、公園・遊歩道・飲食・イベント・スポーツなど市民が日常的に海を楽しめる場所を増やすこと、お金をかけずに楽しめる公園や夏でも涼しく過ごせる公園の充実、街路樹や公園の樹木の適切な管理と日陰・ベンチなどの休憩環境の整備を挙げている。政策9「7区それぞれの個性を活かした地域づくり」では、建物の用途や高さ、駐車場の設置などに関するルールを地域の実情に応じて検証すること、市街化調整区域について自然環境や農地の保全との調和を図りながら地域の実情に応じた土地利用規制の見直しを進めること、7区それぞれの商店街や地域の道路などで歩行者天国や道路を活用したイベントを推進することを挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: INATOMI_SITE_SOURCE,
            text: "トップページの「3つの政策」で、3番目に「博多湾グランドデザインを進める。」を挙げ、「海に広く面した福岡市の特性を活かし、海を市民の日常に開きます。」としている。1番目は「副首都・福岡をエンジンに、成長を加速する。」で行政機能や成長産業を呼び込み市民の所得と税収を伸ばすこと、2番目は「『人づくり』を政策のど真ん中に。」で様々な境遇も取り残さない教育と学び直し・高度人材の育成に投資することを挙げている。",
            url: INATOMI_SITE_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "福岡市の開発事業について、天神や博多駅、港は少し残っていると思うとしつつ、「少し一服感があると思ってまして」と述べ、一方で副首都と港の開発がすごく残っていると感じるとしてそれを進めたいとした。これまでハードの開発をしたのであれば、今度はソフトの部分でどう深化して取り組むのかがこれからの10年に必要だとし、それが人づくりであり教育であり、誰一人取り残さない教育だとしている。天神のオフィス需要や長期金利の上昇については本人からの言及はなかった。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "政策集の「災害に強く、環境と共生する福岡へ」で、備蓄品や設備を充実させ、女性・子ども・高齢者・障がい者・ペットにも配慮した避難所を整え、在宅避難や福祉避難所の確保にも配慮するとしている。地域の防災士の育成と、一人で避難することが難しい人の個別避難計画づくりを進め、道路・下水道・橋梁などの点検や被害調査にドローン・AIを使う「防災DX」、センサーによる大雨や線状降水帯の早期把握を挙げる。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策13「災害に強く、環境と共生する福岡へ」で、避難所の環境改善、地域防災力の強化、水害への対応を進め、環境への負担を減らす取り組みと暮らしや経済の両立を目指すとしている。個別政策として、①備蓄品や設備を充実させ、女性・子ども・高齢者・障がい者・ペットなどにも配慮した避難所を整えるとともに在宅避難にも配慮し、福祉避難所の確保や必要な人が円滑に避難できる仕組みづくりを進める、②地域の防災士の育成や災害の種類に応じた防災訓練を支援し、一人で避難することが難しい人の個別避難計画づくりを進めて自治会・町内会などと連携する、③道路・下水道・橋梁・地下施設等の点検や災害時の被害調査にドローン・AI等の新技術を活用する「防災DX」を進める、④大雨や線状降水帯に備えセンサーなどで危険を早期に把握し避難情報を迅速かつ分かりやすく伝える、⑤電気自動車や家庭・事業所への蓄電池の導入を支援して災害時の電力確保を進める、⑥食品ロスやプラスチックごみの削減、食品廃棄物の再資源化を進める、を挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "高島市政のトップダウンの進め方をどう考えるかを問われ、どういうことがトップダウンなのか正直まだよく分からないとしたうえで、政策実現のためには平時とそうでない時があるとし、「コロナがありました。我々も経験したけれどもああいう時、あるいは災害時、そういった時にはまさにトップダウンで決めなければいけない場面がやはり必ずあります」と述べた。平時はなるべくいろいろな意見を聞き、知恵を集めて政策実現に努めたいとしている。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary:
          "外から企業を呼び込むだけでなく、福岡で事業を営む中小企業や新しい企業が成長できる環境を整えるとし、大企業を呼んでそれで良しとは考えず、地場産業の育成の中でより良い企業が育つことを目指すとしている。地場企業についてはデジタル技術やAIによる業務効率化、販路拡大、海外展開を支援して売上と利益の向上を賃上げや雇用につなげ、市の発注でも地場企業の受注機会の拡大を図るとする。AI・半導体・金融・医療などの成長産業の育成、創業後のスケールアップ支援、ドローン・ロボット・フィジカルAIの実証機会の拡充、農業・漁業の担い手育成と経営力の強化も挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策2「地場企業を強くし、高付加価値産業を育てる」で、外から企業を呼び込むだけでなく、福岡で事業を営む中小企業や新しい企業が成長できる環境を整え、企業の利益と働く人の所得向上を目指すとしている。個別政策として、デジタル技術やAIによる業務効率化・販路拡大・海外展開・コスト削減の支援、中小企業の採用活動や奨学金返還支援・後継者育成・事業承継の支援、国内外への販売先開拓と市の発注での地場企業の受注機会拡大（競争性に配慮）、AI・半導体・金融・医療などへの投資や企業間連携の促進、創業から事業拡大（スケールアップ）までの切れ目ない支援、金融・資産運用特区などを活かした企業・大学・研究機関の産業拠点の形成の検討、買い物や移動の不便・高齢者の見守り・子育て支援などの社会課題を解決するビジネスの応援、ドローン・ロボット・フィジカルAI等の実証機会の拡充を挙げている。政策3では大学・企業・行政の連携によるAI・半導体・金融・医療などの人材育成と社会人の学び直し、大学生のインターンシップや海外交流を、政策12では農業・漁業の担い手育成、デジタル技術による生産の効率化と販路拡大、学校給食での地元食材の活用、福岡の食の加工品開発と国内外への販路拡大を挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_TEXT_SOURCE,
            text: "人への投資では、大学・企業との連携を強化して高度人材の育成に努め、社会人や中小企業で働く人の学び直しの支援もしていきたいとしている。",
            url: INATOMI_KAIKEN_TEXT_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "地場産業について、福岡市として大企業を呼んでそれで良しということは考えておらず、「むしろ地場産業の育成の中でより良い企業がこう育っていくことを目指しております」と述べた。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
      fukushuto: {
        stance: "表明済み",
        summary:
          "政策集の重点戦略の1番目に「副首都・福岡」の実現を置き、「副首都は単なる都市の肩書きではありません」として、新しい産業と良質な雇用を生み、その成果を教育・住宅・子育て・交通・福祉など市民の暮らしへ届けるとしている。市役所内に専門の推進体制を整えて国・県・北九州市・経済界・大学と連携し、国の機関や企業の本社・第二本社、研究開発拠点を誘致するとする。東日本大震災の経験から、国家のバックアップ機能と経済成長の中核となる副首都が必要だとし、国の法整備や財政・税制を活用した拠点整備は「またとないチャンス」だとする。必要なものとして港の開発と国際線が近い都心の生かし方を挙げ、生かし方をより人づくりに当てたいとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策1「『副首都・福岡』を実現する」で、東京に政治・経済の機能が集中する日本では大規模災害への備えと地方の成長力の強化が重要だとして、福岡の地理的な強みや都市機能を活かし国の機関や企業の本社機能を呼び込むとしている。個別政策として、①市役所内に専門の推進体制を整え、国・福岡県・北九州市・経済界・大学などとの連携を強化して都市基盤の整備や企業誘致を一体的に進める、②国の行政機関や政府関係機関、企業の本社・第二本社、研究開発拠点などを誘致する、③福岡空港・博多港・博多駅などを活かし九州各都市やアジアとの交流を拡大する、④福岡都市圏や九州各地の自治体と連携して産業・観光・交通などの課題に取り組む、を挙げている。冒頭では「副首都は単なる都市の肩書きではありません」とし、新しい産業と良質な雇用を生み出して地場企業の成長と市民所得の向上につなげ、その成果を教育・住宅・子育て・交通・福祉など市民の暮らしへ届けるとしている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_TEXT_SOURCE,
            text: "二つ目の政策として副首都・福岡の実現を挙げ、東日本大震災の際に首都機能が危ぶまれる場面があり、当時議員1年目で東京におり国家の中枢機能が麻痺するのではないかと大変背筋が凍る思いをしたとしている。東京一極集中が加速する今こそ、国家のバックアップ機能と経済成長の中核となる副首都が必要だとし、国による法整備、あるいは財政・税制を活用した拠点整備は福岡にとってまたとないチャンスで、次なる10年の中で大きなプロジェクトとなり得るとしている。福岡市は先頭に立って、県と北九州市と協力して進めてまいりたいとした。",
            url: INATOMI_KAIKEN_TEXT_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "副首都によって市民の生活がどう変わるのかを問われ、拠点整備がされればそこに人が来て、東京の第2本社のようなものを誘致できれば人も人材も集まり、そこで消費が喚起されて福岡の税収にも跳ね返ってくると述べた。それ自体を都市の成長の一環として進めるべきだとし、そのうえで「どう使うか、どう生かすか」が大事であって、その生かし方をより人づくりに当てたいのが趣旨だとしている。副首都の拠点地域をつくる際のメニューがまだ分からない段階だとしつつ、税制による何らかの措置があるとすれば地場産業にとっても大きな弾みになると述べた。副首都に向けて必要なものを問われ、まず港の開発を挙げたうえで、「空」という意味でも国際線がこれほど近いところにある都心は日本にないとして、これをどう生かすのかを考え、着手していくことかなと述べた。副首都で期待する効果を問われ、福岡市の強みの一つはアジアに近いことだとし、「黄金の十年」の中でその強みをいかに引き出せるかを考えているとして、九州の福岡から、アジアの中での福岡、国際都市としての福岡を打ち出していく必要があるとしている。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
      kanko: {
        stance: "表明済み",
        summary:
          "福岡市の強みの一つはアジアに近いことだとし、国際都市としての福岡を打ち出していく必要があるとしている。政策集では「文化芸術の力で、心豊かな福岡をつくる」を独立した政策分野に置き、博多祇園山笠や博多どんたくなどの祭り・伝統芸能・工芸の保存と継承、公園や広場など身近な場所での音楽・美術・演劇の機会の拡大、九州・アジアの都市との文化芸術交流、音楽・映像・デザイン・ゲームと地場企業の連携を挙げる。九州各地の自治体と連携した観光の課題への取り組みも掲げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策10「文化芸術の力で、心豊かな福岡をつくる」で、誰もが文化芸術に親しみ創造する喜びを感じられる環境を整え、文化を担う人材や活動を支えるとしている。個別政策として、①公民館・学校・公園・商店街など身近な場所で音楽・美術・演劇などを楽しめる機会を広げる、②学校や地域でプロの芸術家に触れる機会を増やし創作や表現に挑戦できる活動を支える、③若手芸術家や地域の文化団体の活動を支え発表の場や活動場所を確保する、④博多祇園山笠や博多どんたくをはじめ地域に受け継がれてきた祭り・伝統芸能・工芸・歴史文化の保存と継承を支える、⑤公園・広場・歩行者空間・公共施設などで音楽やアート、パフォーマンスを楽しめる機会を広げる、⑥九州各地やアジアの都市との文化芸術交流を進める、⑦音楽・映像・デザイン・ゲームなどの分野で文化芸術と地場企業の連携を促し新たな仕事や雇用につなげる、を挙げている。政策1では福岡都市圏や九州各地の自治体と連携して産業・観光・交通などの課題に取り組むとし、政策11では市民が日常的に海を楽しめる場所を増やすとしている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "副首都で期待する効果を問われ、福岡市はこれまで九州の経済圏の中心にいたとして、福岡市の強みはいくつかあり一つはアジアに近いことがすごく強みだと述べた。「黄金の十年」の中でその強みをいかに引き出せるかを考えているとし、九州の福岡であり、これからはアジアの中での福岡、国際都市としての福岡を打ち出していく必要があるとしている。これまでも打ち出してきたとしつつ、そのことが必要だとした。",
            url: INATOMI_KAIKEN_URL,
          },
          {
            date: "2026-10",
            place: "本人サイト",
            source: INATOMI_SITE_SOURCE,
            text: "トップページの「3つの政策」で「博多湾グランドデザインを進める。」を挙げ、「海に広く面した福岡市の特性を活かし、海を市民の日常に開きます。」としている。",
            url: INATOMI_SITE_URL,
          },
        ],
      },
      gaikokujin: {
        stance: "表明済み",
        summary:
          "政策集の地域づくりで、外国人住民・観光客向けの生活案内や地域のルールの周知を充実させ、言葉や文化の違いによる行き違いを減らすとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策9「7区それぞれの個性を活かした地域づくり」で、外国人住民・観光客向けの生活案内や地域のルールの周知を充実させ、言葉や文化の違いによる行き違いを減らすとしている。",
            url: INATOMI_POLICY_PDF_URL,
          },
        ],
      },
      dx: {
        stance: "表明済み",
        summary:
          "福岡市役所は福岡市民を向いて仕事をするという原点を確認したいとしている。政策集では、市民の声を政策に生かすプロセスとして、無作為抽出などで幅広い市民が参加する「市民とつくる政策会議（仮称）」を設け、市長や市役所が市内各地に出向く「出前市役所」、校区住民から政策提案を受ける仕組みを整えるとする。政策の成果は事業の件数だけでなく生活満足度・所得・住宅負担などで測り、「手続きはスマホで完結」する市役所にするとし、AIを悪用したサイバー攻撃から市の情報システムや水道・交通などの重要な都市機能を守る対策も挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の政策14「市民と市政をともにつくり、税金を正しく賢く使う」で、「市役所を、もっと身近に。市政を、もっと分かりやすく。」として、行政が一方的に政策を決めるのではなく多様な市民の意見を取り入れ、政策の立案から評価まで参加できる仕組みをつくるとしている。個別政策として、①無作為抽出などによって幅広い市民が参加する「市民とつくる政策会議（仮称）」を設け、政策の立案や見直しに反映する、②事業の件数だけでなく生活満足度・企業の経営状況・所得・住宅負担などを測り政策の改善につなげる、③市長や市役所が市内各地に出向いて政策を説明し市民の声を直接聞く「出前市役所」、④7区それぞれの地域課題について各校区住民から政策提案を受ける仕組みを整え、対応方針を分かりやすく示す、⑤予算や決算、事業ごとの費用や成果を市民が簡単に確認できる形で公開する、⑥行政手続きのオンライン化を進めて「手続きはスマホで完結」する市役所にし、スマートフォンの操作が苦手な人への支援も充実させる、⑦AIを悪用したサイバー攻撃などに備え、市の情報システムや水道・交通などの重要な都市機能を守る対策と被害発生時の復旧体制を強化し、地場企業のセキュリティ対策や市民の詐欺被害防止も支援する、を挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_TEXT_SOURCE,
            text: "福岡市役所においても政治不信は他人事ではないとし、一番の問題は「どこを向いて仕事をしているのか」ということだとして、福岡市役所は福岡市民を向いて仕事をするという原点をぜひとも確認したいとしている。議会と市役所と市民の三者が協力し、時には意見が異なることもあるかもしれないが、三者が協力して前に進めることによって初めて福岡が良くなると確信しているとし、市役所は市民の声を集めてそれを政策に反映し、その政策力を高めていきたいとした。",
            url: INATOMI_KAIKEN_TEXT_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "政治への信頼をどう取り戻すのかを問われ、市民の信頼がなければ政策実現も進まないとして、福岡市が市民を向いて仕事をすることを市役所が改めて確認し、市民の意見を集約してそれを政策に生かし、市役所が政策力を高めて政策の実現につなげていくことだと述べた。「市民の声をあるいは住民の声を政策に生かすプロセスを是非これまでと違う形で作っていきたい」としたうえで、その中身は現時点では申し上げられないとして政策発表で述べるとした。時代も変わり、どうやって市民の意見を集約して政策実現にしていくかはいろいろな方法があっていいと思うとしている。全国のモデルケースをイメージしているのかという問いには、全国のモデルということまではイメージしていないとし、政治不信の原因は「どこを向いて仕事をしているのか」という市民の率直な感情だとして、市役所は市民のために、市民とともに仕事をするのだと示していかなければいけないと述べた。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "就任後ただちに緊急物価高対策の補正予算案の編成に着手するとしている。市がこれまで実施してきた下水道使用料の減免や事業者支援を検証しつつ、既存の仕組みを活用して市民と事業者に早く支援が届くようにするとし、具体的な対象・規模は実施時期を示したうえで議会に提案するとする。2027年4月に予定される消費税の引き下げについて、国の対策に加えて事業者に過度な負担がいかないきめ細かな対策に取り組むとしている。どのような政策も財源の裏打ちがなければ実行できないとして、国で財政・税制に携わった経験を生かすとする。政策集では「すぐやること」として緊急生活支援プランを掲げ、下水道使用料の一定期間の減免について対象範囲と財源を速やかに整理するとし、予算や決算、事業ごとの費用と成果を市民が簡単に確認できる形で公開するとしている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の「まず、今の暮らしを支える｜緊急生活支援プラン」で、食料品や光熱費などの値上がりが家計と経営を圧迫しているとして、中長期の成長戦略と同時に今困っている人を支える迅速な対策を進めるとしている。①下水道使用料の一定期間の減免を検討し対象範囲と必要な財源を速やかに整理する、②電気代や原材料費の上昇などに苦しむ中小企業・小規模事業者に対し経営状況に応じた負担軽減や経営改善支援を検討する、③国の交付金や市の財政状況を精査し必要な予算措置を速やかに検討する、を挙げ、これを「すぐやること」としている。重点戦略Ⅳ「ともにつくる、信頼ある市政」では「市民とともに考え、税金を正しく賢く使う」とし、政策14で予算や決算、事業ごとの費用や成果を市民が簡単に確認できる形で公開すること、限られた財源を有効に活用することを挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_TEXT_SOURCE,
            text: "一つ目の政策として物価高対策を挙げ、市長に選ばれるのであれば就任後ただちに緊急物価高対策の補正予算案の編成に着手したいとしている。福岡市がこれまで実施してきた下水道使用料の減免や事業者支援などを検証しつつ、既存の仕組みを活用して市民と事業者にいち早く支援が行き届くように取り組むとし、2027年4月に消費税の引き下げが予定されているとして、国の対策に加えて事業者に過度な負担がいかないきめ細かな対策にも取り組むとした。具体的な対象・規模などは実施時期を示したうえで議会に提案したいとしている。",
            url: INATOMI_KAIKEN_TEXT_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "国会議員としての経験を市長としてどう生かすかを問われ、国では財政・税制に主に関わり、特に税制に力を入れてやってきたと述べた。どうやったら実行できるか、要するに財源的な裏付けを見つけられるかが非常に大事で、「どのような政策であってもその裏打ちがなければ実行できません」として、これまでやってきたことを生かし、実行するための財源をどう生み出せるかも含めて福岡に生かしていきたいとしている。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "福岡の政治への信頼を取り戻すことを選挙の二つのテーマの一つに挙げ、県政の問題は第三者委員会の報告を待つとしつつ、各政治家が説明責任を果たすことに尽きるとしている。衆院選の前まで立憲民主党福岡県連の代表を務めていたとして、その間に疑惑にあたることがあったとすれば監督責任として批判は甘んじて受けなければいけないとする。完全無所属で臨み、政党・団体への推薦依頼はしないとしている。政策集では「市長は市民を代表した外交官でもあるべき」として、副首都の実現や交通政策で国や県、周辺自治体と堂々と交渉するとする。地域づくりでは、自治会・町内会の補助制度と情報共有の改善、交通マナーの向上、防犯灯や防犯カメラの設置支援、特殊詐欺への対策を挙げている。",
        updated: "2026年10月",
        log: [
          {
            date: "2026-10-27",
            place: "本人サイト",
            source: INATOMI_POLICY_SOURCE,
            text: "政策集の「福岡から、政治を変える。」で、福岡県議会をめぐる一連の問題は多くの県民に失望と不信を広げたとし、その根本にあるのは「政治と行政が本当に県民を向いて仕事をしているのか？」という問いだとしている。この不信感は政治・行政すべてに向けられているとして、「福岡市と福岡市議会も、同じような関係になっているのではないか」という市民の声を重く受け止めるとする。市長には市民の暮らしと利益を守るため市の外に向かって交渉する役割もあるとし、「市長は市民を代表した外交官でもあるべき」だとして、副首都の実現に欠かせない国や県との協議、交通政策や道路整備での周辺自治体や企業との連携に、市民の信頼を土台に臨むとしている。政策9「7区それぞれの個性を活かした地域づくり」では、自治会・町内会や自治協議会への補助制度や情報共有の改善と担い手の負担軽減、自転車や自動車の交通ルールの周知、通学路や生活道路の安全対策と防犯灯・防犯カメラの設置支援・特殊詐欺への対策、地域住民による公園管理や清掃活動の支援を挙げている。",
            url: INATOMI_POLICY_PDF_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_TEXT_SOURCE,
            text: "出馬に至った理由は三つあるとし、支援者から住みやすい福岡であるにもかかわらず生活や子育てへの大きな心配の声をもらうことが多かったこと、高島市長が任期をもって退任し今後10年間この福岡市を誰が引っ張っていくのかを率直に思ったこと、福岡県議会と県庁の歪んだ関係を見るにつけそれが広がって福岡市にも影響するのではないかという危機感を持ったことを挙げている。完全無所属で挑戦するとして、どの政党にもどの団体にも推薦のお願いはしないとし、「今回は、福岡の政治を正す戦いでもあります。福岡市のために、市民のために、必要な判断をしがらみにとらわれず行いたいからであります」としている。若い頃に県知事選挙にも挑戦し、生活者の声をもっと行政に届けたいと訴えたが壁は厚く敗退したこと、その後も何度も選挙を経験し落選も重ねてきたことにも触れている。",
            url: INATOMI_KAIKEN_TEXT_URL,
          },
          {
            date: "2026-10-13",
            place: "記者会見",
            source: INATOMI_KAIKEN_SOURCE,
            text: "県議会の問題と自身の以前の所属政党との関係を問われ、「私はもうこの衆議院選挙の前までは、立憲民主党福岡県の代表を務めておりましたので、知らなかったとはいえ、その間にも仮に何かそういった疑惑にあるようなことがあったとするならば、それは自身の監督責任と、言葉がちょっと適切かどうか分かりませんけど、そういった意味では批判は甘んじて受けなければいけないなとは思います」と述べた。そのうえで、各政治家が第三者委員会の報告を待つと同時に、各政治家が一番自分のことをよく分かっているわけで説明責任を果たすことに尽きるとし、説明責任を果たせないのであれば自分とは立場・考え方が大きく異なるとしている。推薦については、政党の支援を受けることは当然しがらみもあり、その政党としてやらなければいけないことが発生するのは当然だとし、市長は誰かに応援してもらったから何かをやる、応援してもらわなかったから何かをしないという立場ではなく、市民に向かって何が一番いいのかを中心に考えなければいけないとして、今回は完全に無所属でやろうと決めたと述べた。政党や組織への推薦依頼と組織としての支援は受けないが、個人として応援してもらうことは大変ありがたいとしている。知事選に挑戦した方がよいのではという問いには、福岡市を前に進めるには福岡市だけでは政策実現が難しく、政治不信を払拭しなければ市の政策実現にも進まないとして、福岡市から政治を正していきたいと答えた。国政に戻る考えはないかとの問いには「もう入りません」とし、今回当選しなかった場合に再挑戦することもないとしている。市長の任期を何期務めるかは「全くイメージありません」とし、次の4年の舵取りを任せてもらえるかに尽きるとした。政治の人材育成にも取り組みたいとし、志のある若い人たちにチャンスや挑戦の機会を提供できればいいと述べている。",
            url: INATOMI_KAIKEN_URL,
          },
        ],
      },
    },
  },
];
