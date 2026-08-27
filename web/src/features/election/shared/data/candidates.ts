import type { Candidate } from "../types";

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
const ARAMAKI_SITE_URL = "https://www.lgbt-connect.com/";
const ARAMAKI_SITE_SOURCE = "本人サイト（OVER THE RAINBOW）・本人Instagram";
// 本人サイトには市長選出馬の記載がないため、出馬表明・公約は陣営の公表資料が出典。
// TODO: 党公式・本人SNSで出馬表明のURLが確認でき次第、log の url に追加する
const ARAMAKI_SOURCE = "陣営の公表プロフィール（2026年8月）";

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
    lead: "「誰一人取り残さない」を掲げ、行政の単位から見直す道州制と、開かれた市政運営を訴える。",
    bioSource: "報道（KBC九州朝日放送・RKB毎日放送 2026年8月）",
    bio: [
      { label: "出身", text: "北九州市出身" },
      { label: "学歴", text: "九州大学卒業" },
      { label: "職歴", text: "経済産業省などに約10年間勤務" },
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
    ],
    takashimaAssessment: {
      summary:
        "現在の市政はトップダウンで政策が進んでいるとし、オープンな形で市政を進めていきたいとしている。個別の施策への評価は述べていない。",
      updated: "2026年8月",
      log: [
        {
          date: "2026-08",
          place: "報道",
          source: "KBC九州朝日放送",
          text: "今の市政はトップダウンで政策が進んでいるとし、オープンな形で市政を進めていきたいとしている。",
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
        stance: "未表明",
        summary:
          "この分野についての具体的な言及はまだ確認できていません。記者会見以降に追記します。",
        updated: "",
        log: [],
      },
      fukushi: {
        stance: "未表明",
        summary:
          "個別の施策は未表明です。「誰一人取り残さない」という基本姿勢のみが示されています。",
        updated: "",
        log: [],
      },
      kotsu: {
        stance: "未表明",
        summary:
          "この分野についての具体的な言及はまだ確認できていません。記者会見以降に追記します。",
        updated: "",
        log: [],
      },
      saikaihatsu: {
        stance: "未表明",
        summary:
          "個別の施策は未表明です。市政の進め方について「トップダウン」との指摘が示されています。",
        updated: "",
        log: [],
      },
      bosai: {
        stance: "未表明",
        summary:
          "この分野についての具体的な言及はまだ確認できていません。記者会見以降に追記します。",
        updated: "",
        log: [],
      },
      keizai: {
        stance: "未表明",
        summary:
          "この分野についての具体的な言及はまだ確認できていません。記者会見以降に追記します。",
        updated: "",
        log: [],
      },
      kanko: {
        stance: "未表明",
        summary:
          "この分野についての具体的な言及はまだ確認できていません。記者会見以降に追記します。",
        updated: "",
        log: [],
      },
      dx: {
        stance: "表明済み",
        summary:
          "現在の市政はトップダウンで政策が進んでいるとし、オープンな形で市政を進めていきたいとしている。あわせて、行政の単位そのものを見直す道州制を打ち出したいとしている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08",
            place: "報道",
            source: "KBC九州朝日放送",
            text: "今の市政はトップダウンで政策が進んでいるとし、オープンな形で市政を進めていきたいとしている。",
          },
          {
            date: "2026-08",
            place: "報道",
            source: "RKB毎日放送",
            text: "行政の単位から見直す道州制を打ち出したいとしている。",
          },
        ],
      },
      zaisei: {
        stance: "未表明",
        summary:
          "市の予算や税制についての具体的な言及はまだ確認できていません。記者会見以降に追記します。",
        updated: "",
        log: [],
      },
      sonota: {
        stance: "未表明",
        summary:
          "上の分野に当てはまらない主張は、いまのところ確認できていません。",
        updated: "",
        log: [],
      },
    },
  },
  {
    id: "nishiwaki-hiroki",
    no: "02",
    name: "西脇 ひろき",
    kana: "にしわき ひろき",
    age: 35,
    title: "「福岡の未来を、誰よりも考える市民」（本人表記）",
    party: "無所属（表明時点）",
    lead: "「国がやらないなら、福岡から。暮らしを変える政治を。」を掲げ、交通・子育て・防災から生活環境まで25項目を検討中の政策として列挙している。",
    bioSource: "選挙ドットコム 政治家データベース（2026年8月時点）",
    bio: [
      { label: "1991", text: "9月30日生まれ（投開票日時点で35歳）" },
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
        text: "NEXCO九州支社で、サービスエリア・パーキングエリアなど高速道路関連施設の設計・施工などに携わる",
      },
      {
        label: "職歴",
        text: "その後転職し、ドローンによる3D測量、スタートアップ企業での事業、OYOホテルズジャパンでのホテル改修・営業、太陽光発電所の施工管理・営業などを経験",
      },
      { label: "2026", text: "福岡市長選への出馬の意向を表明" },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「国がやらないなら、福岡から。暮らしを変える政治を。」を掲げている。",
      },
      {
        label: "これまでの活動",
        text: "福岡市の財政・交通・子育て・税制・都市政策などについて、調査・発信を続けてきたとしている。",
      },
      {
        label: "検討中の政策",
        text: "交通・子育て・防災・生活環境など25項目を挙げ、「これから詳細をアップしようと考えているリスト」としている。個々の内容は今後の公表待ち。",
      },
    ],
    takashimaAssessment: null,
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
          "第1子の保育料無償化、出生順位によらない子育て現金給付、保育士の給与引き上げを挙げている。いずれも詳細は今後公表するとしている。",
        updated: "2026年8月",
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
        ],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "老人ホームの増設と介護士の給与引き上げ、市内全域のバリアフリー総点検、市民向けの生活支援パス「福岡パスポート」を挙げている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "介護の受け皿整備（老人ホームの増設と介護士の給与引き上げ）、バリアフリー総点検（車椅子で不便な箇所を市内全域で洗い出し優先順位をつけて整備）、神戸のNobinobiパスポートを模した市民向け生活支援パス「福岡パスポート」を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
        ],
      },
      kotsu: {
        stance: "表明済み",
        summary:
          "都市高速の定期券制度、頓挫したロープウェイ構想の掘り起こし、大規模で格安の市営立体駐車場の整備を挙げている。",
        updated: "2026年8月",
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
        ],
      },
      saikaihatsu: {
        stance: "表明済み",
        summary:
          "博多〜天神を雨に濡れずに歩ける全天候型の動線整備と、博多区の無電柱化を挙げている。",
        updated: "2026年8月",
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
        ],
      },
      bosai: {
        stance: "表明済み",
        summary:
          "各戸・各棟の電源確保による在宅避難と、マンション・賃貸にも届く蓄電池補助を挙げている。避難所への依存と防災コストを下げる狙いとしている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "各戸・各棟に電源を確保して避難所依存と防災コストを下げる「在宅避難できる街」と、太陽光同時設置・戸建て持ち家限定である現行の蓄電池補助をマンション・賃貸にも届く制度にすることを挙げている。",
            url: NISHIWAKI_X_LIST,
          },
        ],
      },
      keizai: {
        stance: "表明済み",
        summary: "週休3日制を導入した企業への助成を挙げている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "週休3日制を導入した企業に市から助成金を出すことを挙げている。",
            url: NISHIWAKI_X_LIST,
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
      dx: {
        stance: "表明済み",
        summary:
          "議員ごとの発言回数・在席率の公開と議会中継の全編アーカイブ、予算の一部の使途を市民が決める参加型予算を挙げている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "議員ごとの発言回数・在席率を公開し議会中継の全編アーカイブを残す「議会の見える化」と、予算の一部の使途を市民が決め子ども・外国人住民も意思決定側に入れる「参加型予算」を挙げている。",
            url: NISHIWAKI_X_LIST,
          },
        ],
      },
      zaisei: {
        stance: "表明済み",
        summary:
          "財政を精査し、住民税・社会保険料の負担軽減によって市民の手取りを増やす方向を挙げている。",
        updated: "2026年8月",
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
        ],
      },
      sonota: {
        stance: "表明済み",
        summary:
          "路上喫煙対策と喫煙可否の店頭表示義務化、ポイ捨ての厳罰化、害虫根絶計画、投票を楽しい体験として設計する「VOTEFES」を挙げている。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08-27",
            place: "SNS",
            source: NISHIWAKI_X_SOURCE,
            text: "喫煙所整備と厳罰化による路上喫煙対策、入店前に分かる喫煙可否の店頭表示義務化と分煙店舗への助成、シンガポール型の罰則によるポイ捨ての厳罰化、市全体の害虫根絶計画、投票を楽しい体験として設計し投票率と政治参加を底上げする「VOTEFES」を挙げている。",
            url: NISHIWAKI_X_LIST,
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
    // 本人サイトに「1985年生まれ」とあるのみで月日が不明なため、
    // 投開票日時点で40歳か41歳か確定できない。推測で埋めず生年を経歴に載せる
    age: null,
    title: "社会起業家・nTech講師",
    party: "0=∞=1党（こころ党）福岡支部",
    lead: "「心のインフラ尊厳City福岡」を掲げ、孤独や不安を解消する「心のインフラ」を福岡から示すとしている。",
    bioSource: `${ARAMAKI_SITE_SOURCE}／${ARAMAKI_SOURCE}`,
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
      { label: "2026", text: "福岡市長選への出馬を表明" },
    ],
    claims: [
      {
        label: "基本姿勢",
        text: "「心のインフラ尊厳City福岡」を掲げている。",
      },
      {
        label: "背景",
        text: "トランスジェンダー当事者として差別や分断の根本原因と向き合い、認識技術nTechに出会ったとしている。",
      },
      {
        label: "目指すもの",
        text: "誰もが自らの存在理由を確信し、孤独や不安を解消できる「心のインフラ」を福岡から世界へ示すとしている。",
      },
      {
        label: "モットー",
        text: "本人サイトでは「真のダイバーシティ＆インクルージョンを実現したい！」を掲げ、「明るく楽しく自分らしく」をモットーとしている。",
      },
    ],
    takashimaAssessment: null,
    links: [
      {
        label: "本人サイト（OVER THE RAINBOW）",
        url: ARAMAKI_SITE_URL,
      },
    ],
    sns: [
      {
        kind: "公式サイト",
        handle: "lgbt-connect.com",
        url: ARAMAKI_SITE_URL,
      },
      { kind: "X", handle: "", url: "" },
      { kind: "YouTube", handle: "", url: "" },
      {
        kind: "TikTok",
        handle: "@aramaki.fukuoka",
        url: "https://www.tiktok.com/@aramaki.fukuoka",
      },
      {
        kind: "Instagram",
        handle: "@akira_555",
        url: "https://www.instagram.com/akira_555/",
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
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      fukushi: {
        stance: "表明済み",
        summary:
          "誰もが自らの存在理由を確信し、孤独や不安を解消できる「心のインフラ」を福岡から示すとしている。個別の施策や予算の裏づけはまだ確認できていません。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08",
            place: "公表資料",
            source: ARAMAKI_SOURCE,
            text: "トランスジェンダー当事者として差別や分断の根本原因と向き合い、認識技術nTechに出会う。誰もが自らの存在理由を確信し、孤独や不安を解消できる「心のインフラ」を福岡から世界へ示す、としている。",
          },
        ],
      },
      kotsu: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
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
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      kanko: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      dx: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      zaisei: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      sonota: {
        stance: "未表明",
        summary:
          "上の分野に当てはまらない主張は、いまのところ確認できていません。",
        updated: "",
        log: [],
      },
    },
  },
];
