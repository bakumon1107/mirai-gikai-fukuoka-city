import type { Candidate } from "../types";

const GO2SENKYO_NISHIWAKI = "https://go2senkyo.com/seijika/200151";
const NISHIWAKI_PROFILE_SOURCE = "選挙ドットコム 政治家データベース";

/**
 * 立候補予定者データ。
 *
 * 並び順は出馬表明順で固定し、告示後は届出順に差し替える。
 * ランダム化やソート機能は設けない（中立性の担保）。
 *
 * 全員が9分野すべてのキーを持つこと。情報がない分野は「未表明」とし、
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
    lead: "「国がやらないなら、福岡から。暮らしを変える政治を。」を掲げ、財政・交通・子育て・税制・都市政策の調査と発信を続けてきたとしている。",
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
    ],
    takashimaAssessment: null,
    links: [
      {
        label: "プロフィール（選挙ドットコム）",
        url: GO2SENKYO_NISHIWAKI,
      },
    ],
    positions: {
      kosodate: {
        stance: "未表明",
        summary:
          "子育てを調査・発信のテーマの一つに挙げていますが、個別の施策はまだ確認できていません。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08",
            place: "プロフィール",
            source: NISHIWAKI_PROFILE_SOURCE,
            text: "福岡市の財政・交通・子育て・税制・都市政策などについて調査・発信していると記載されている。",
            url: GO2SENKYO_NISHIWAKI,
          },
        ],
      },
      fukushi: {
        stance: "未表明",
        summary: "この分野についての具体的な言及はまだ確認できていません。",
        updated: "",
        log: [],
      },
      kotsu: {
        stance: "未表明",
        summary:
          "交通を調査・発信のテーマの一つに挙げていますが、個別の施策はまだ確認できていません。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08",
            place: "プロフィール",
            source: NISHIWAKI_PROFILE_SOURCE,
            text: "福岡市の財政・交通・子育て・税制・都市政策などについて調査・発信していると記載されている。",
            url: GO2SENKYO_NISHIWAKI,
          },
        ],
      },
      saikaihatsu: {
        stance: "未表明",
        summary:
          "都市政策を調査・発信のテーマの一つに挙げていますが、再開発についての個別の施策はまだ確認できていません。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08",
            place: "プロフィール",
            source: NISHIWAKI_PROFILE_SOURCE,
            text: "福岡市の財政・交通・子育て・税制・都市政策などについて調査・発信していると記載されている。",
            url: GO2SENKYO_NISHIWAKI,
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
        summary:
          "財政・税制を調査・発信のテーマの一つに挙げていますが、個別の施策はまだ確認できていません。",
        updated: "2026年8月",
        log: [
          {
            date: "2026-08",
            place: "プロフィール",
            source: NISHIWAKI_PROFILE_SOURCE,
            text: "福岡市の財政・交通・子育て・税制・都市政策などについて調査・発信していると記載されている。",
            url: GO2SENKYO_NISHIWAKI,
          },
        ],
      },
    },
  },
];
