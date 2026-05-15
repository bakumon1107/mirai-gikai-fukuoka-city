import type { PressConference } from "../types";

export const samplePressConference: PressConference = {
  id: "sample-2026-05-15",
  slug: "2026-05-15",
  title: "令和8年5月 市長定例記者会見",
  heldAt: "2026-05-15",
  youtubeUrl: "https://www.youtube.com/watch?v=_l3GaYx3Ouw",
  status: "published",
  items: [
    {
      id: "ann-1",
      itemType: "announcement",
      orderIndex: 0,
      title: "今月のアート紹介「混在再構築」",
      summary:
        "会見室と大設等に展示中のアート作品「混在再構築」を紹介。九産大3年生・ごとうたいきさんの作品で、アナログとデジタルで撮影した福岡の空と建物の写真5枚を細長く切って分解し、何層にも重ねて制作。スピード感と躍動感のある写真表現で、デジタル世代による新しい写真表現として注目。",
      turns: [],
    },
    {
      id: "ann-2",
      itemType: "announcement",
      orderIndex: 1,
      title:
        "ドリームナイト・アット・ザ・ズー（動物園・プラネタリウム）7月開催",
      summary:
        "障害のある子どもたちのための貸切動物園イベントを7月後半に開催。昨年の水族館に続く第2弾で、今年は動物園と福岡市科学館プラネタリウムでも実施。対象年齢を未就学児から高校生世代に拡大。カームダウンスペース・イヤマフ貸し出し・坂道マップなど障害への配慮を実施。参加申込は5月15日〜6月5日まで（無料）。",
      turns: [],
    },
    {
      id: "ann-3",
      itemType: "announcement",
      orderIndex: 2,
      title: "終活サポート強化・エンディングノート簡易版を新作成",
      summary:
        "人生100年時代を見据えた終活支援を強化。これまでのマイエンディングノートに加え、1枚の簡易版を新たに作成・配布。終活サポートセンター（社会福祉協議会運営）では相続・葬儀・家財処分・週末期医療などをワンストップで相談対応。終活カードゲームの出前講座も実施。この取り組みは2年以内に法制度化予定で、福岡市のノウハウが国のスタンダードになる見込み。",
      turns: [],
    },
    {
      id: "qa-1",
      itemType: "qa",
      orderIndex: 3,
      title: "ドリームナイト今後の拡大について",
      summary: null,
      turns: [
        {
          id: "qa-1-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "アクアリウムに続く第2弾ですが、こういった取り組みについて今後拡大の予定や、回数を増やすお考えはありますでしょうか？",
          orderIndex: 0,
        },
        {
          id: "qa-1-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "できれば体験の場を作ってあげたいと思っています。行政が協力しないとできないこともあるので、障害のあるお子さんと家族にとって安心して楽しめる環境が年に何回かあれば素敵なことだと思います。今後もそういった場所があれば検討していきたいと思っています。",
          orderIndex: 1,
        },
      ],
    },
    {
      id: "qa-2",
      itemType: "qa",
      orderIndex: 4,
      title: "年齢拡大（高校生世代まで）の理由",
      summary: null,
      turns: [
        {
          id: "qa-2-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "高校生世代まで対象を拡大したのは、何かそういうお声や要望があったということでしょうか？",
          orderIndex: 0,
        },
        {
          id: "qa-2-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "申し込み自体が非常に多かったのですが、小学生・中学生になっても同じような障害を抱えているわけですから、同じように安心して楽しみたいというお声があったことから拡大しました。",
          orderIndex: 1,
        },
      ],
    },
    {
      id: "qa-3",
      itemType: "qa",
      orderIndex: 5,
      title: "障害児と家族全員で楽しめることへの思い",
      summary: null,
      turns: [
        {
          id: "qa-3-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "アクアリウムの時に取材させてもらいましたが、障害を持っていない兄弟と一緒に過ごせることに非常に好意的な声をたくさん聞きました。こういった取り組みへの市長の思いを改めてお聞かせください。",
          orderIndex: 0,
        },
        {
          id: "qa-3-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "私も実際に聞くまでは障害のある子どものことだけを見ていたところがあったんですが、当事者からお話を聞くと、障害のある子に合わせて家族みんなが集中するため、きょうだいたちの思い出作りや体験がなかなかできにくいということが実はあるんです。そういう意味で、家族みんなで揃って思い出が作れるということは非常に意義があると思いました。当日の光景を見て、本当にやって良かったと思いました。",
          orderIndex: 1,
        },
      ],
    },
    {
      id: "qa-4",
      itemType: "qa",
      orderIndex: 6,
      title: "終活の課題感・背景について",
      summary: null,
      turns: [
        {
          id: "qa-4-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "長年福岡市でこういうことに取り組んでこられた背景にある課題感、特に独身世帯のお話もされていましたが、現在感じている課題を教えていただけますでしょうか？",
          orderIndex: 0,
        },
        {
          id: "qa-4-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "福岡のような都市では核家族で住む方も多く、先立たれた場合やシングルの方がエンディングをどうするかというのは切実な問題です。終活というのは暗い話ではなく、最後を考えることは今をどう生きるかを考えることです。また実際に銀行口座のパスワードが多すぎてロックがかかってしまったり、施設の住所と届けの住所が違うといった困り事が元気なうちに整理されていないことで起きています。早い段階で認知して、信頼できる機関にお願いしておくことが大事だと感じています。",
          orderIndex: 1,
        },
      ],
    },
    {
      id: "qa-5",
      itemType: "qa",
      orderIndex: 7,
      title: "舞鶴公園の桜の倒木・緊急点検",
      summary: null,
      turns: [
        {
          id: "qa-5-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "先日舞鶴公園で桜が倒れる事案がありました。市の緊急調査で処置が必要な木が48本あるという話が出ています。改めて市長のお考えと今後の対策をお聞かせください。",
          orderIndex: 0,
        },
        {
          id: "qa-5-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "桜まつりの最終日に倒木が起きました。まだ人が多い時間帯の前だったのが不幸中の幸いでしたが、木は生き物で寿命があるのでこまめにチェックしていくことが大事です。緊急点検でいくつか精密検査が必要な桜が出てきましたので、夏に入る頃には一次検査を終え、より精密な対応をしていきます。緊急的なものはカラーコーンで近づけないよう対応しています。また市民のご寄付による桜の植え替えプロジェクトも昨年からスタートしており、適切なタイミングで植え替えをしながら安心してお花見ができる環境を守っていきたいと思います。",
          orderIndex: 1,
        },
      ],
    },
    {
      id: "qa-6",
      itemType: "qa",
      orderIndex: 8,
      title: "市長選挙・5期目について",
      summary: null,
      turns: [
        {
          id: "qa-6-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "先週、福岡市長選挙の告示日が決まりました。現在4期目の最後ですが、5期目に向けてはいかがお考えでしょうか？",
          orderIndex: 0,
        },
        {
          id: "qa-6-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "福岡マラソンにぶつけるわけにはいかないので、マラソン翌週というのがなんとなく決まっている雰囲気はありますが、特に驚きはないです。まだ任期の時間がありますのでしっかりと務めながら、適切なタイミングにまた判断をしていきたいと思います。",
          orderIndex: 1,
        },
        {
          id: "qa-6-t3",
          speaker: "reporter",
          speakerName: null,
          content:
            "4期目、歴代最長の期間となっていますが、やり残していることはありますでしょうか？",
          orderIndex: 2,
        },
        {
          id: "qa-6-t4",
          speaker: "mayor",
          speakerName: null,
          content:
            "市政というのは市民のニーズが時代とともにどんどん変わっていくもので、常に新しいやるべきことが出てきます。終わりというものはないと思っています。",
          orderIndex: 3,
        },
      ],
    },
    {
      id: "qa-7",
      itemType: "qa",
      orderIndex: 9,
      title: "SNS情報漏洩と市職員への対応",
      summary: null,
      turns: [
        {
          id: "qa-7-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "民間企業でSNSを職場で使って内部情報が流出する事案が起きており、連休前にも福岡の銀行でそういった事案がありました。福岡市職員の中での使用端末の扱いについて、改めて呼びかけたことや普段から周知していることがあればお聞かせください。",
          orderIndex: 0,
        },
        {
          id: "qa-7-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "元より市民の情報を多く扱う市役所として個人情報の扱いには気をつけています。6〜7年前から職場内への外部の方の入室も制限しています。今回の事案を受けて福岡市の各部署に対して文書を出し、決してこういうことがないよう改めて引き締め直す案内をいたしました。これからも新しい世代が入ってくる中で、言い続けていくことが大事だと思っています。",
          orderIndex: 1,
        },
      ],
    },
    {
      id: "qa-8",
      itemType: "qa",
      orderIndex: 10,
      title: "副首都のメリット・企業誘致との関係",
      summary: null,
      turns: [
        {
          id: "qa-8-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "副首都のメリットとして、BCPと企業誘致のブランド価値の2点が大きいという理解でよいでしょうか？",
          orderIndex: 0,
        },
        {
          id: "qa-8-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "その通りですが、さらにプラスアルファがあります。副首都に選ばれたエリアに税制優遇などの強烈なインセンティブがつけば、企業の移転判断が変わります。それにより東京一極集中から多極分散が実現し、福岡に知識創造型産業が集積することで、若者が東京に行かなくても夢が叶う環境が生まれます。九州全体からの距離感も近く、地方の平均賃金向上・税収増にもつながります。",
          orderIndex: 1,
        },
      ],
    },
    {
      id: "qa-9",
      itemType: "qa",
      orderIndex: 11,
      title: "七隈線の混雑緩和・6両化",
      summary: null,
      turns: [
        {
          id: "qa-9-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "七隈線の朝の混雑が非常に深刻になっています。市長のお考えと対策の方向性をお聞かせください。",
          orderIndex: 0,
        },
        {
          id: "qa-9-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "できる限りダイヤを詰めて電車が頻繁に来る環境にしてきましたが、これ以上詰めるには車両本体が必要なため、現在新たに車体を発注しています。新車両が完成すると混雑解消につながります。もう一点は現在の4両編成から6両編成への拡大で、これには各駅のホームを長くする工事が必要です。その検討をスタートしており、短期はダイヤ改正、中長期は車両増加と6両化の2段構えで取り組みます。",
          orderIndex: 1,
        },
      ],
    },
    {
      id: "qa-10",
      itemType: "qa",
      orderIndex: 12,
      title: "夏の暑さ・熱中症対策",
      summary: null,
      turns: [
        {
          id: "qa-10-t1",
          speaker: "reporter",
          speakerName: null,
          content:
            "小学校体育館の冷房整備や市民プールの屋根設置など対策を進めていますが、ハード整備の重要性についてお考えをお聞かせください。",
          orderIndex: 0,
        },
        {
          id: "qa-10-t2",
          speaker: "mayor",
          speakerName: null,
          content:
            "避難場所にもなる学校体育館についてはついに全施設で冷房整備が進んでいます。有事の際に高齢者など弱者の方も過ごしやすい環境を整えています。ただハード整備には時間とお金がかかるため、ソフト面では「クールシェア福岡」で参加企業も増えてきており、クールスポットの活用、給水ポイントの整備なども進めています。今年も暑くなりそうという予報が出ていますので、緊急搬送にならないよう意識の啓発を進めていきたいと思います。",
          orderIndex: 1,
        },
      ],
    },
  ],
};
