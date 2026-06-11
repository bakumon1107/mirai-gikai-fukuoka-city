/**
 * seed-press-conferences.ts
 *
 * 市長定例記者会見データをDBに投入する。
 * 既存データ（同一slug）はスキップする。
 *
 * 使い方:
 *   tsx --env-file=../../.env fukuoka/seed-press-conferences.ts
 */

import { createAdminClient } from "../shared/helper";

type TurnInput = {
  speaker: "mayor" | "reporter";
  speakerName: string | null;
  content: string;
  orderIndex: number;
};

type ItemInput = {
  itemType: "announcement" | "qa";
  orderIndex: number;
  title: string;
  summary: string | null;
  turns: TurnInput[];
};

type PressConferenceInput = {
  slug: string;
  title: string;
  heldAt: string;
  youtubeUrl: string | null;
  status: string;
  items: ItemInput[];
};

const DATA: PressConferenceInput[] = [
  {
    slug: "2026-05-11",
    title: "令和8年5月 市長定例記者会見",
    heldAt: "2026-05-11",
    youtubeUrl: "https://www.youtube.com/watch?v=_l3GaYx3Ouw",
    status: "published",
    items: [
      {
        itemType: "announcement",
        orderIndex: 0,
        title: "今月のアート紹介「混在再構築」",
        summary:
          "会見室と大設等に展示中のアート作品「混在再構築」を紹介。九産大3年生・ごとうたいきさんの作品で、アナログとデジタルで撮影した福岡の空と建物の写真5枚を細長く切って分解し、何層にも重ねて制作。スピード感と躍動感のある写真表現で、デジタル世代による新しい写真表現として注目。",
        turns: [],
      },
      {
        itemType: "announcement",
        orderIndex: 1,
        title: "ドリームナイト・アット・ザ・ズー（動物園・プラネタリウム）7月開催",
        summary:
          "障害のある子どもたちのための貸切動物園イベントを7月後半に開催。昨年の水族館に続く第2弾で、今年は動物園と福岡市科学館プラネタリウムでも実施。対象年齢を未就学児から高校生世代に拡大。カームダウンスペース・イヤマフ貸し出し・坂道マップなど障害への配慮を実施。参加申込は5月15日〜6月5日まで（無料）。",
        turns: [],
      },
      {
        itemType: "announcement",
        orderIndex: 2,
        title: "終活サポート強化・エンディングノート簡易版を新作成",
        summary:
          "人生100年時代を見据えた終活支援を強化。これまでのマイエンディングノートに加え、1枚の簡易版を新たに作成・配布。終活サポートセンター（社会福祉協議会運営）では相続・葬儀・家財処分・週末期医療などをワンストップで相談対応。終活カードゲームの出前講座も実施。この取り組みは2年以内に法制度化予定で、福岡市のノウハウが国のスタンダードになる見込み。",
        turns: [],
      },
      {
        itemType: "qa",
        orderIndex: 3,
        title: "ドリームナイト今後の拡大について",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "アクアリウムに続く第2弾ですが、こういった取り組みについて今後拡大の予定や、回数を増やすお考えはありますでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "できれば体験の場を作ってあげたいと思っています。行政が協力しないとできないこともあるので、障害のあるお子さんと家族にとって安心して楽しめる環境が年に何回かあれば素敵なことだと思います。今後もそういった場所があれば検討していきたいと思っています。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 4,
        title: "年齢拡大（高校生世代まで）の理由",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "高校生世代まで対象を拡大したのは、何かそういうお声や要望があったということでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "申し込み自体が非常に多かったのですが、小学生・中学生になっても同じような障害を抱えているわけですから、同じように安心して楽しみたいというお声があったことから拡大しました。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 5,
        title: "障害児と家族全員で楽しめることへの思い",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "アクアリウムの時に取材させてもらいましたが、障害を持っていない兄弟と一緒に過ごせることに非常に好意的な声をたくさん聞きました。こういった取り組みへの市長の思いを改めてお聞かせください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "私も実際に聞くまでは障害のある子どものことだけを見ていたところがあったんですが、当事者からお話を聞くと、障害のある子に合わせて家族みんなが集中するため、きょうだいたちの思い出作りや体験がなかなかできにくいということが実はあるんです。そういう意味で、家族みんなで揃って思い出が作れるということは非常に意義があると思いました。当日の光景を見て、本当にやって良かったと思いました。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 6,
        title: "終活の課題感・背景について",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "長年福岡市でこういうことに取り組んでこられた背景にある課題感、特に独身世帯のお話もされていましたが、現在感じている課題を教えていただけますでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "福岡のような都市では核家族で住む方も多く、先立たれた場合やシングルの方がエンディングをどうするかというのは切実な問題です。終活というのは暗い話ではなく、最後を考えることは今をどう生きるかを考えることです。また実際に銀行口座のパスワードが多すぎてロックがかかってしまったり、施設の住所と届けの住所が違うといった困り事が元気なうちに整理されていないことで起きています。早い段階で認知して、信頼できる機関にお願いしておくことが大事だと感じています。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 7,
        title: "終活支援の法制度化について",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "2年以内に法制度化されるとのことですが、具体的にどのような内容が規定されるのでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "終活サポートセンター、死後事務委任事業、日常生活支援（入退院・金銭管理・見守り）の3つが社会福祉法に規定される予定です。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 9,
        title: "舞鶴公園の桜の倒木・緊急点検",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "先日舞鶴公園で桜が倒れる事案がありました。市の緊急調査で処置が必要な木が48本あるという話が出ています。改めて市長のお考えと今後の対策をお聞かせください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "桜まつりの最終日に倒木が起きました。まだ人が多い時間帯の前だったのが不幸中の幸いでしたが、木は生き物で寿命があるのでこまめにチェックしていくことが大事です。緊急点検でいくつか精密検査が必要な桜が出てきましたので、夏に入る頃には一次検査を終え、より精密な対応をしていきます。緊急的なものはカラーコーンで近づけないよう対応しています。また市民のご寄付による桜の植え替えプロジェクトも昨年からスタートしており、適切なタイミングで植え替えをしながら安心してお花見ができる環境を守っていきたいと思います。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 10,
        title: "市長選挙・5期目について",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "先週、福岡市長選挙の告示日が決まりました。現在4期目の最後ですが、5期目に向けてはいかがお考えでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "福岡マラソンにぶつけるわけにはいかないので、マラソン翌週というのがなんとなく決まっている雰囲気はありますが、特に驚きはないです。まだ任期の時間がありますのでしっかりと務めながら、適切なタイミングにまた判断をしていきたいと思います。",
            orderIndex: 1,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "4期目、歴代最長の期間となっていますが、やり残していることはありますでしょうか？",
            orderIndex: 2,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "市政というのは市民のニーズが時代とともにどんどん変わっていくもので、常に新しいやるべきことが出てきます。終わりというものはないと思っています。",
            orderIndex: 3,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "前回の投票率が34.31％でしたが、今回の投票率向上についてどのようにお考えですか？",
            orderIndex: 4,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "投票率を上げることは大事です。期日前投票の利便性向上や身近な施設での投票実施など、投票しやすい環境づくりが重要です。選挙管理委員会でも検討しているはずです。",
            orderIndex: 5,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "多選について、首長が強い権限を長期にわたって持ち続けることについてのお考えは？",
            orderIndex: 6,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "一般論として、首長は予算権・人事権など強い権限を持ちます。諸外国では期数制限があることから、強い権限があるゆえ期数制限の議論があります。一人が権限を持ち続けることへの問いがあることは把握しています。",
            orderIndex: 7,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "長期勤続の首長が増えている中、若手後任が出づらい背景についてどうお考えですか？",
            orderIndex: 8,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "私も当初は市政信頼度40％の時代に刷新が求められ、若く経験に染まっていない立場で出てきました。若い首長が全国で増え、様々な分野から出てくることは重要だと思っています。",
            orderIndex: 9,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 11,
        title: "SNS情報漏洩と市職員への対応",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "民間企業でSNSを職場で使って内部情報が流出する事案が起きており、連休前にも福岡の銀行でそういった事案がありました。福岡市職員の中での使用端末の扱いについて、改めて呼びかけたことや普段から周知していることがあればお聞かせください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "元より市民の情報を多く扱う市役所として個人情報の扱いには気をつけています。6〜7年前から職場内への外部の方の入室も制限しています。今回の事案を受けて福岡市の各部署に対して文書を出し、決してこういうことがないよう改めて引き締め直す案内をいたしました。これからも新しい世代が入ってくる中で、言い続けていくことが大事だと思っています。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 12,
        title: "副首都構想・吉村代表との対談・北九州市との連携",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "副首都のメリットとして、BCPと企業誘致のブランド価値の2点が大きいという理解でよいでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "その通りですが、さらにプラスアルファがあります。副首都に選ばれたエリアに税制優遇などの強烈なインセンティブがつけば、企業の移転判断が変わります。それにより東京一極集中から多極分散が実現し、福岡に知識創造型産業が集積することで、若者が東京に行かなくても夢が叶う環境が生まれます。九州全体からの距離感も近く、地方の平均賃金向上・税収増にもつながります。",
            orderIndex: 1,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "日本維新の会の吉村代表と対談されていましたが、副首都について県・北九州市との連携はどのようにお考えですか？",
            orderIndex: 2,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "県と連携し、副首都を狙っています。ポイントは連携協約の内容です。7月に法が制定されれば申し込めるようになります。都構想的なものではなく、県と市の連携協約形式で進めます。都構想のように市町村権限を全て県に移譲すると政令市としての成長戦略が打てなくなるため、その内容が重要です。",
            orderIndex: 3,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content: "北九州市の武内市長との協議状況はいかがですか？",
            orderIndex: 4,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "県が主体となるため、県のイニシアチブが重要です。東京で服部知事を含め3人で副首都を狙いにいきましょうという話をしましたが、国がまだ具体的に固まっていないため詳細な協議はしていません。",
            orderIndex: 5,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content: "北九州市はライバルになるのでしょうか？",
            orderIndex: 6,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "全然ライバルではなく仲間です。都市間競争ではなく、福岡県が地域の核となり、北九州の産業力と福岡の拠点性が掛け合わさってより大きな力になると思います。",
            orderIndex: 7,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content: "官公庁の移転も副首都の効果として考えていますか？",
            orderIndex: 8,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "省庁移転と副首都バックアップは異なります。東日本大震災後の議論は縮小し文化庁が京都に行っただけで、国も積極的でないため省庁移転は想定していません。福岡には国の出先機関が集積しており、普段から機能していることが税金と人材の無駄がない最善の方法です。",
            orderIndex: 9,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 13,
        title: "七隈線の混雑緩和・6両化",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "七隈線の朝の混雑が非常に深刻になっています。市長のお考えと対策の方向性をお聞かせください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "できる限りダイヤを詰めて電車が頻繁に来る環境にしてきましたが、これ以上詰めるには車両本体が必要なため、現在新たに車体を発注しています。新車両が完成すると混雑解消につながります。もう一点は現在の4両編成から6両編成への拡大で、これには各駅のホームを長くする工事が必要です。その検討をスタートしており、短期はダイヤ改正、中長期は車両増加と6両化の2段構えで取り組みます。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 14,
        title: "貝塚線と地下鉄の直通化",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "東区の人口増加に伴い、貝塚線と地下鉄の直通運転も課題になっていますがいかがでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "東区は34万2千人で全国の市の中でもトップクラスの人口です。人口増加も著しくニーズも増えています。西鉄もダイヤ改正で頻回になりましたが、地下鉄との直通運転も大事な課題です。交通マスタープランに明記されており、ボトルネック解消を含めて実現できるよう検討しています。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 15,
        title: "夏の暑さ・熱中症対策",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "小学校体育館の冷房整備や市民プールの屋根設置など対策を進めていますが、ハード整備の重要性についてお考えをお聞かせください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "避難場所にもなる学校体育館についてはついに全施設で冷房整備が進んでいます。有事の際に高齢者など弱者の方も過ごしやすい環境を整えています。ただハード整備には時間とお金がかかるため、ソフト面では「クールシェア福岡」で参加企業も増えてきており、クールスポットの活用、給水ポイントの整備なども進めています。今年も暑くなりそうという予報が出ていますので、緊急搬送にならないよう意識の啓発を進めていきたいと思います。",
            orderIndex: 1,
          },
        ],
      },
    ],
  },
  {
    slug: "2026-04-20",
    title: "令和8年4月 市長定例記者会見",
    heldAt: "2026-04-20",
    youtubeUrl: "https://www.youtube.com/watch?v=IMnnC8-Ww28",
    status: "published",
    items: [
      {
        itemType: "announcement",
        orderIndex: 0,
        title: "博多旧市街エリアに新たな賑わいと憩いの拠点が誕生",
        summary:
          "出来町公園内に、観光案内機能と休憩機能を備えた2階建て施設を整備する優先交渉権者を決定。1階はカフェ・明太子・うどん体験型飲食スペース・観光案内ブース・無料休憩スペース、2階は博多の歴史文化芸能を学べる体験型テナントと多目的スペース（博多松囃子シーズンには稚児舞の練習披露の場として活用）。屋上緑化・和の意匠で周辺寺社と調和。防災倉庫も設置。令和9年秋（2027年秋）頃オープン予定。",
        turns: [],
      },
      {
        itemType: "qa",
        orderIndex: 1,
        title: "博多旧市街のポテンシャルと今後の観光への期待",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "博多旧市街プロジェクトとしてこれまでも観光促進を進めてこられましたが、改めて博多旧市街のポテンシャルと観光客の回遊についてお聞かせください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "博多の強みは海外との交易の歴史にあります。鴻臚館の復元も間もなく第1弾が完成します。神社仏閣は多いのですが、京都と違って道が普通のアスファルトでサインも統一されていなかったため、歴史の雰囲気を感じにくかった。博多旧市街プロジェクトでサイン統一・照明整備・石畳設置などを進めてきました。今回の施設で観光案内の起点ができ、地域の課題だった稚児舞の練習場所も解決します。市民の皆さんにも「福岡にはこれだけの歴史・文化がある」と知っていただける学べるスポットになってほしいです。",
            orderIndex: 1,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "体験型要素の充実や欧米観光客への対応という観点で、この施設にどのような貢献を期待されていますか？",
            orderIndex: 2,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "外国人観光客にはストーリーをつなぐことが重要です。デジタルサイネージで学んでいただき、福岡・博多のファンになってほしい。同時に市民にも知ってほしい。博多どんたくがなぜ「港祭り」なのか、博多祇園山笠が疫病退散から始まったことなど、市民が学べるスポットになることを期待しています。",
            orderIndex: 3,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 2,
        title: "2018年の発表から8年が経過した経緯について",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "2018年4月にも市長が記者会見でこの拠点施設の整備を発表されましたが、その後事業者との基本協定解除となり、8年経って改めての発表となりました。この間の経緯への思いをお聞かせください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "コロナなどさまざまな状況があって公募が流れたこともありました。ただ、博多旧市街に情報発信の拠点と憩いの場所が必要だという声は地域から大変多くいただいていました。ようやく優先交渉権者が決まりましたので、来年の秋、稚児舞の素敵な音がこの景色の中に溶け込むような施設になってほしいと思っています。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 3,
        title: "うどん・明太子の体験型飲食スペースを設ける意図",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "承天寺（うどん・そば発祥の地）近くでのうどん道場など体験型を取り入れた意図を改めて教えてください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "これは事業者からのご提案です。承天寺といううどん・そば発祥の地のすぐ近くでうどん体験ができるのは特別ですし、福岡のイメージ商品である明太子も現地で体験できるのは非常に楽しみです。なかなか普段できないことが地元でできるという点が大きい。私もその話を聞いた時にすぐ食いつきました（笑）。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 4,
        title: "大規模祭りの赤字問題と市のサポートについて",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "博多どんたくを始め、全国的に大規模なお祭りの赤字が問題となっています。市としてサポートをお考えでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "スポンサー集めが厳しくなっているのは福岡でも同様で認識しています。ただ特定のものだけに補助金を出すのは良くないですし、自分たちで資金集めをして運営していくというポリシーも大切です。東区花火大会のように地域が自力でお金を集めているのは素晴らしいと思います。一方で「来た時より美しく」というモラル・マナーが守られないとイベント開催が困難になるという懸念も持っています。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 5,
        title: "中東情勢による中小企業への影響と市の支援",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "中東情勢などの影響で中小企業に不安が広がっていますが、市として影響調査や支援はお考えでしょうか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "資金繰りや不安が広がっており、福岡市は商工会議所と連携して中小企業の相談に柔軟に応じています。商工会議所内に相談窓口を設置し、融資相談や困っている企業への個別対応を実施しています。",
            orderIndex: 1,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 6,
        title: "中学校給食での牛乳以外の飲料試験導入をめぐって",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "中学校給食で牛乳以外の飲料を試験的に導入したことについて、子どもたちの反応はいかがでしたか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "教育委員会のチャレンジと認識しています。子どもたちの反応は非常によかったと聞いています。好き嫌いがあるため「助かった」という子もいれば「毎日飲みたい」という子もいる。教育委員会がより良い給食を検討してくれています。",
            orderIndex: 1,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "カルシウムが基準の半分以下、カロリーも1割以上低下したという報告がありますが、栄養面の偏りについてはいかがお考えですか？",
            orderIndex: 2,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "1日単位ではなく周辺の給食で補っていく方式で、1週間単位など総体的に栄養バランスを考えています。月1回のチャレンジ自体は良い取り組みと考えますが、栄養全体の考え方については教育委員会に聞いていただきたいです。",
            orderIndex: 3,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "当月全体でもカルシウム基準を下回っているという指摘があります。給食の質向上は可能でしょうか？栄養教諭からも懸念の声があります。",
            orderIndex: 4,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "教育委員会が食育と栄養の両面で判断することです。チャレンジ自体は良いと考えますが、私から指示するものではありません。教育委員会は議会で「別の日に牛乳を増量する」「水分補給の観点から300ml出す検討をする」などと答弁しており、月1回始まったばかりですのでいろんな声を聞きながら進めていけばいいと思います。報道も1日だけでなくトータルで見ていただきたいです。",
            orderIndex: 5,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "酪農業界からは決定が急だったという声もあります。農家とのコミュニケーションについてはいかがお考えですか？",
            orderIndex: 6,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "農家との事前コミュニケーションは重要だったと認識しています。年間契約で乳牛の飼育頭数はすぐ調整できないため影響は大きい。農水局も地域農業振興に注力していますので、牛乳や乳製品の別形態活用なども含めてバランスよく検討すべきと思います。",
            orderIndex: 7,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "乳製品加工品の活用や増量など、予算面でのバックアップはお考えでしょうか？",
            orderIndex: 8,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "子どもが大事という立場です。教育委員会からはスチームコンベクションオーブンの導入要望も出ており、子どもたちのためなら市長部局として予算面でしっかりバックアップします。教育委員会からの提案には予算で支援するのが私の役割です。",
            orderIndex: 9,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 7,
        title: "副首都構想における福岡市の位置づけ",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "副首都構想について、代替地域の位置づけをどのようにお考えですか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "「副首都をバックアップする第二副首都」という位置づけが適切と考えます。同時被災リスク回避が目的なら、完全に同じものを各地に作るのは経済効率が悪い。NHKのようにバックアップ機能を分散配置する仕組みが理想的です。福岡は太平洋側・関東に対してプレート的に同時被災リスクが極めて低い点で優位性があります。",
            orderIndex: 1,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content: "福岡の優位性についてご確認させてください。",
            orderIndex: 2,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "同時被災リスク回避という観点では福岡は優位性があります。ただ政府の議論は外野から見守る立場です。福岡が国に貢献できることがあればしっかり対応していきます。",
            orderIndex: 3,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 8,
        title: "天神ビッグバンの経済効果（1兆8,943億円）について",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "天神ビッグバンの経済効果が当初比2.2倍の1兆8,943億円との発表がありました。これをどう評価されますか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "当初は「本当に成功するのか」という懸念も多かったですが、民間企業が次々と乗ってきて目標値を上方修正してきました。福岡市GRP（約8.2兆円）の2割強のインパクトで、経済的インパクトは相当大きかったと評価しています。",
            orderIndex: 1,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content: "これほど広がった要因はどこにあるとお考えですか？",
            orderIndex: 2,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "福岡の成長性への期待感です。企業は経済合理性で判断します。行政の規制緩和などのインセンティブにより、投資がプラスだと判断された結果です。ボランティアではなく、経済合理性が働いた結果が拡大につながりました。",
            orderIndex: 3,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 9,
        title: "IT企業集積の理由と支店経済からの脱却",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "KINTOやGMOなどIT企業が福岡に集積している理由と、支店経済からの脱却についてお考えをお聞かせください。",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "立地特性として陸海空が近く国内外の交通アクセスが優良である点、知識創造層にとって住みやすい点が挙げられます。コロナ後、オフィスは「作業の場から創造の場」へ機能転換しており、新ビルは共用スペース充実で入居企業同士が交わりやすい設計です。クラフティアが入居後、新規職員応募が倍増しており、オフィス環境が人材確保につながっています。",
            orderIndex: 1,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "現状はブランチ（支店）が多い状況ですが、本社機能の移転はどのように進むとお考えですか？",
            orderIndex: 2,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "段階的に進むと考えます。ブランチ→本社機能の一部移転→BCPで2拠点→福岡本社という段階化が現実的です。本社移転には家族・教育・医療・文化など生活全般の転換が伴うため、東京との圧倒的な優位性との天秤が必要です。「福岡に住んでいい、働いていい」という認識醸成が大事で、トータルで福岡を選ぶ企業が増えることを期待しています。",
            orderIndex: 3,
          },
        ],
      },
      {
        itemType: "qa",
        orderIndex: 10,
        title: "救急車利用増加と有料化の是非",
        summary: null,
        turns: [
          {
            speaker: "reporter",
            speakerName: null,
            content:
              "救急車の利用が増加する中、長崎市が有料化を導入しました。福岡市としてはどのようにお考えですか？",
            orderIndex: 0,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "デリケートで難しい課題です。本当に必要な方が費用を心配して通報を控えて最悪の事態になることは絶対に避けなければならない。軽微な「タクシー代わり」利用とのバランスが難しい。消防ヘリも同様で、全国でヘリの有料化議論も起きています。持続可能な形で誰もが助けられる体制を維持するために何が最適か、引き続き考えていきたいです。",
            orderIndex: 1,
          },
          {
            speaker: "reporter",
            speakerName: null,
            content: "福岡市として有料化を判断する可能性はありますか？",
            orderIndex: 2,
          },
          {
            speaker: "mayor",
            speakerName: null,
            content:
              "実行判断は極めて困難です。有料化で通報を控える方が出て最悪の事態となれば政治的批判を受けることになります。「お金がない人が」という論調も出ます。政治的ハードルは相当高いと思っています。",
            orderIndex: 3,
          },
        ],
      },
    ],
  },
];

async function main() {
  const supabase = createAdminClient();

  for (const pc of DATA) {
    console.log(`\n[${pc.slug}] ${pc.title}`);

    const { data: existing } = await supabase
      .from("press_conferences")
      .select("id")
      .eq("slug", pc.slug)
      .maybeSingle();

    if (existing) {
      console.log(`  → スキップ（既存）`);
      continue;
    }

    const { data: pcRow, error: pcErr } = await supabase
      .from("press_conferences")
      .insert({
        slug: pc.slug,
        title: pc.title,
        held_at: pc.heldAt,
        youtube_url: pc.youtubeUrl,
        status: pc.status,
      })
      .select()
      .single();

    if (pcErr || !pcRow) {
      throw new Error(`press_conferences INSERT 失敗: ${pcErr?.message}`);
    }

    for (const item of pc.items) {
      const { data: itemRow, error: itemErr } = await supabase
        .from("press_conference_items")
        .insert({
          press_conference_id: pcRow.id,
          item_type: item.itemType,
          order_index: item.orderIndex,
          title: item.title,
          summary: item.summary,
        })
        .select()
        .single();

      if (itemErr || !itemRow) {
        throw new Error(`press_conference_items INSERT 失敗: ${itemErr?.message}`);
      }

      if (item.turns.length > 0) {
        const { error: turnsErr } = await supabase
          .from("press_conference_turns")
          .insert(
            item.turns.map((t) => ({
              press_conference_item_id: itemRow.id,
              speaker: t.speaker,
              speaker_name: t.speakerName,
              content: t.content,
              order_index: t.orderIndex,
            }))
          );

        if (turnsErr) {
          throw new Error(`press_conference_turns INSERT 失敗: ${turnsErr.message}`);
        }
      }
    }

    console.log(`  → 投入完了（items: ${pc.items.length}）`);
  }

  console.log("\n✅ 完了");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
