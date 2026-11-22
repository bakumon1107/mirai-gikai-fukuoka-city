/**
 * 議事録ベースのアーカイブ（一般質問・委員会議事録・首長の記者会見）の開発用シードデータ
 *
 * data.ts と同じく、架空の自治体「サンプル市」を題材にしたダミーデータです。
 * 議員名・職員名・数値・事業名はすべて架空のもので、実在の人物・自治体とは関係ありません。
 *
 * fork 時は、自地域の会議録から取り込んだデータに差し替えてください。
 */

import type { Database } from "@mirai-gikai/supabase";

type GeneralQuestionInsert =
  Database["public"]["Tables"]["general_questions"]["Insert"];
type CommitteeMeetingInsert =
  Database["public"]["Tables"]["committee_meetings"]["Insert"];
type CommitteeMeetingTopicInsert =
  Database["public"]["Tables"]["committee_meeting_topics"]["Insert"];
type PressConferenceInsert =
  Database["public"]["Tables"]["press_conferences"]["Insert"];
type PressConferenceItemInsert =
  Database["public"]["Tables"]["press_conference_items"]["Insert"];
type PressConferenceTurnInsert =
  Database["public"]["Tables"]["press_conference_turns"]["Insert"];

type SpeakerType = "chairperson" | "member" | "executive" | "unknown";

type Speech = {
  voiceNo: number;
  speakerLabel: string | null;
  speakerType: SpeakerType;
  text: string;
};

// ============================================================
// 一般質問・代表質問
// ============================================================

/**
 * @param sessionIds data.ts の councilSessions の順（[0]=令和7年第4回, [1]=令和7年第3回）で挿入した ID
 */
export function createGeneralQuestions(
  sessionIds: string[]
): GeneralQuestionInsert[] {
  const [current, previous] = sessionIds;
  if (!current || !previous) {
    throw new Error("council sessions が2件必要です");
  }

  return [
    {
      council_session_id: current,
      question_type: "representative",
      questioner_name: "見本 太郎",
      questioner_party: "みらい",
      questioner_number: 12,
      session_day: 1,
      question_order: 1,
      summary:
        "会派を代表し、来年度の予算編成の考え方と、子育て世帯への支援の拡充について質した。",
      topics: [
        {
          title: "来年度の予算、何に力を入れる？",
          question_summary:
            "物価高が続く中で、来年度の予算編成で何を優先するのかを質した。",
          answer_summary:
            "市長は、子育て支援と防災を重点とし、既存事業の見直しで財源を確保すると答弁した。",
          answerer_role: "市長",
          answerer_name: "仮野 一郎",
        },
        {
          title: "保育園の待機児童、ゼロは続く？",
          question_summary:
            "待機児童ゼロを今後も維持できるのか、保育士の確保策とあわせて質した。",
          answer_summary:
            "こども未来局長は、保育士の家賃補助を続け、来年度は定員を120人増やす計画だと答弁した。",
          answerer_role: "こども未来局長",
          answerer_name: "試験 花子",
        },
      ],
      raw_text:
        "○見本太郎議員　会派を代表して質問いたします。まず、来年度の予算編成についてお伺いします。……",
      answer_raw_text:
        "○仮野一郎市長　見本議員のご質問にお答えいたします。来年度の予算編成にあたりましては……",
      source_url: "https://www.example.lg.jp/gikai/kaigiroku/",
      publish_status: "published",
    },
    {
      council_session_id: current,
      question_type: "general",
      questioner_name: "例示 次郎",
      questioner_party: "自民党",
      questioner_number: 5,
      session_day: 2,
      question_order: 1,
      summary:
        "通学路の安全対策と、駅前の放置自転車の対策について質した。",
      topics: [
        {
          title: "通学路の危ない交差点、いつ直る？",
          question_summary:
            "保護者から要望の多い交差点に、信号機や歩道をいつ整備するのかを質した。",
          answer_summary:
            "道路局長は、今年度中に3か所でガードレールを設置し、信号機は警察と協議中だと答弁した。",
          answerer_role: "道路局長",
          answerer_name: "模擬 三郎",
        },
        {
          title: "駅前の放置自転車、減らせる？",
          question_summary:
            "駅前の放置自転車が増えている理由と、駐輪場の整備計画を質した。",
          answer_summary:
            "道路局長は、撤去を月2回に増やし、来年度に駐輪場を300台分増設すると答弁した。",
          answerer_role: "道路局長",
          answerer_name: "模擬 三郎",
        },
      ],
      raw_text: "○例示次郎議員　通学路の安全対策についてお伺いします。……",
      answer_raw_text: "○模擬三郎道路局長　お答えいたします。……",
      source_url: "https://www.example.lg.jp/gikai/kaigiroku/",
      publish_status: "published",
    },
    {
      council_session_id: current,
      question_type: "general",
      questioner_name: "仮定 さくら",
      questioner_party: "公明党",
      questioner_number: 21,
      session_day: 2,
      question_order: 2,
      summary: "高齢者の移動支援と、地域の見守り体制について質した。",
      topics: [
        {
          title: "免許を返したあとの移動手段は？",
          question_summary:
            "運転免許を返納した高齢者が、通院や買い物にどう移動できるのかを質した。",
          answer_summary:
            "健康福祉局長（試行 四郎）・市長（仮野 一郎）は、乗合タクシーの対象地区を来年度に2地区から5地区へ広げると答弁した。",
          answerer_role: "健康福祉局長（試行 四郎）・市長（仮野 一郎）",
          answerer_name: "",
        },
      ],
      raw_text: "○仮定さくら議員　高齢者の移動支援についてお伺いします。……",
      answer_raw_text: "○試行四郎健康福祉局長　お答えいたします。……",
      source_url: "https://www.example.lg.jp/gikai/kaigiroku/",
      publish_status: "published",
    },
    {
      council_session_id: previous,
      question_type: "general",
      questioner_name: "見本 太郎",
      questioner_party: "みらい",
      questioner_number: 12,
      session_day: 1,
      question_order: 1,
      summary: "公共施設の老朽化と、使われていない施設の活用について質した。",
      topics: [
        {
          title: "古くなった市民センター、建て替える？",
          question_summary:
            "築40年を超える市民センターの建て替えか改修かの方針を質した。",
          answer_summary:
            "総務局長は、利用状況を調べたうえで来年度中に方針を決めると答弁した。",
          answerer_role: "総務局長",
          answerer_name: "例題 五郎",
        },
      ],
      raw_text: "○見本太郎議員　公共施設の老朽化についてお伺いします。……",
      answer_raw_text: "○例題五郎総務局長　お答えいたします。……",
      source_url: "https://www.example.lg.jp/gikai/kaigiroku/",
      publish_status: "published",
    },
    {
      // 下書き（公開されないことの確認用）
      council_session_id: current,
      question_type: "general",
      questioner_name: "例示 次郎",
      questioner_party: "自民党",
      questioner_number: 5,
      session_day: 3,
      question_order: 1,
      summary: null,
      topics: [],
      raw_text: "○例示次郎議員　（要約前の下書き）……",
      source_url: "https://www.example.lg.jp/gikai/kaigiroku/",
      publish_status: "draft",
    },
  ];
}

// ============================================================
// 委員会議事録
// ============================================================

function buildSpeeches(
  chair: string,
  pairs: { member: string; question: string; executive: string; answer: string }[]
): Speech[] {
  const speeches: Speech[] = [
    {
      voiceNo: 1,
      speakerLabel: `${chair}委員長`,
      speakerType: "chairperson",
      text: "ただいまから委員会を開会いたします。本日は所管事務の報告を受けた後、質疑を行います。",
    },
  ];
  for (const pair of pairs) {
    speeches.push({
      voiceNo: speeches.length + 1,
      speakerLabel: `${pair.member}委員`,
      speakerType: "member",
      text: pair.question,
    });
    speeches.push({
      voiceNo: speeches.length + 1,
      speakerLabel: pair.executive,
      speakerType: "executive",
      text: pair.answer,
    });
  }
  speeches.push({
    voiceNo: speeches.length + 1,
    speakerLabel: `${chair}委員長`,
    speakerType: "chairperson",
    text: "以上で本日の委員会を閉会いたします。",
  });
  return speeches;
}

const bunkyoSpeeches = buildSpeeches("見本", [
  {
    member: "例示",
    question: "放課後児童クラブの利用希望が増えていると聞きますが、受け入れの状況はいかがですか。",
    executive: "こども未来局長",
    answer: "今年度は申込みが前年より約200人増えましたが、教室の活用で全員を受け入れています。",
  },
  {
    member: "仮定",
    question: "指導員の確保は追いついているのでしょうか。",
    executive: "こども未来局長",
    answer: "時給を50円引き上げ、募集を年2回から4回に増やして確保に努めています。",
  },
  {
    member: "見本",
    question: "夏休み中の昼食の提供について、保護者からの要望はどう受け止めていますか。",
    executive: "こども未来局長",
    answer: "来年の夏休みに3か所で試行し、効果を確かめたうえで広げるか判断します。",
  },
  {
    member: "例示",
    question: "学校の体育館への空調の設置は、いつまでに終わりますか。",
    executive: "教育次長",
    answer: "避難所としての役割もあるため、令和9年度までに全校で設置を終える計画です。",
  },
  {
    member: "仮定",
    question: "設置の順番はどう決めているのですか。",
    executive: "教育次長",
    answer: "避難所の指定と、夏の室温が高い学校を優先して順番を決めています。",
  },
]);

const machiSpeeches = buildSpeeches("例示", [
  {
    member: "見本",
    question: "駅前の再開発について、商店街の意見はどのように聞いていますか。",
    executive: "まちづくり局長",
    answer: "これまでに説明会を4回開き、出された意見は計画の見直しに反映しています。",
  },
  {
    member: "仮定",
    question: "工事中の通行の安全はどう確保しますか。",
    executive: "まちづくり局長",
    answer: "歩行者の通路を確保し、通学の時間帯には誘導員を配置します。",
  },
  {
    member: "例示",
    question: "公園のトイレの洋式化は進んでいますか。",
    executive: "まちづくり局長",
    answer: "今年度は12か所を改修し、洋式化率は68%になる見込みです。",
  },
  {
    member: "見本",
    question: "残りの公園の改修の見通しを教えてください。",
    executive: "まちづくり局長",
    answer: "利用者の多い公園から順に、毎年10か所程度ずつ改修する予定です。",
  },
]);

// 発言が少ない回（トップの委員会カードの選定から外れることの確認用）
const kankyoSpeeches = buildSpeeches("仮定", [
  {
    member: "見本",
    question: "報告について質疑はございませんか。",
    executive: "環境局長",
    answer: "（質疑なし）",
  },
]);

export const committeeMeetings: CommitteeMeetingInsert[] = [
  {
    committee_name: "文教委員会",
    committee_slug: "bunkyo",
    meeting_date: "2025-12-05",
    title: "令和7年12月5日 文教委員会",
    source_id: "sample-bunkyo-20251205",
    source_url: "https://www.example.lg.jp/gikai/iinkai/",
    summary:
      "放課後児童クラブの受け入れ状況と指導員の確保、学校の体育館への空調の設置計画について報告があり、質疑が行われた。",
    speeches: bunkyoSpeeches,
    raw_text: bunkyoSpeeches.map((s) => `○${s.speakerLabel}　${s.text}`).join("\n"),
    publish_status: "published",
  },
  {
    committee_name: "まちづくり委員会",
    committee_slug: "machizukuri",
    meeting_date: "2025-12-08",
    title: "令和7年12月8日 まちづくり委員会",
    source_id: "sample-machizukuri-20251208",
    source_url: "https://www.example.lg.jp/gikai/iinkai/",
    summary:
      "駅前の再開発の進め方と工事中の安全対策、公園のトイレの改修について報告があり、質疑が行われた。",
    speeches: machiSpeeches,
    raw_text: machiSpeeches.map((s) => `○${s.speakerLabel}　${s.text}`).join("\n"),
    publish_status: "published",
  },
  {
    committee_name: "環境委員会",
    committee_slug: "kankyo",
    meeting_date: "2026-01-20",
    title: "令和8年1月20日 環境委員会（閉会中）",
    source_id: "sample-kankyo-20260120",
    source_url: "https://www.example.lg.jp/gikai/iinkai/",
    summary: "ごみの収集日程の変更について報告があった。質疑はなかった。",
    speeches: kankyoSpeeches,
    raw_text: kankyoSpeeches.map((s) => `○${s.speakerLabel}　${s.text}`).join("\n"),
    publish_status: "published",
  },
];

/**
 * 委員会の committee_id を名前で埋める（data.ts の committees を挿入した結果を渡す）
 */
export function withCommitteeIds(
  meetings: CommitteeMeetingInsert[],
  insertedCommittees: { id: string; name: string }[]
): CommitteeMeetingInsert[] {
  const idByName = new Map(insertedCommittees.map((c) => [c.name, c.id]));
  return meetings.map((m) => ({
    ...m,
    committee_id: idByName.get(m.committee_name) ?? null,
  }));
}

/**
 * @param meetingIds committeeMeetings の順で挿入した ID
 */
export function createCommitteeMeetingTopics(
  meetingIds: string[]
): CommitteeMeetingTopicInsert[] {
  const [bunkyo, machi, kankyo] = meetingIds;
  if (!bunkyo || !machi || !kankyo) {
    throw new Error("committee meetings が3件必要です");
  }

  return [
    {
      meeting_id: bunkyo,
      topic_order: 1,
      title: "放課後児童クラブ、希望者は全員入れる？",
      summary:
        "申込みが前年より約200人増えたが、学校の教室を使って全員を受け入れている。",
      discussion_summary:
        "委員は指導員の確保や夏休みの昼食を質し、局は時給の引き上げと来夏の試行を説明した。",
      speakers: [{ label: "例示委員" }, { label: "仮定委員" }, { label: "見本委員" }],
      start_voice_no: 2,
      end_voice_no: 7,
    },
    {
      meeting_id: bunkyo,
      topic_order: 2,
      title: "体育館のエアコン、いつ全部の学校に？",
      summary: "避難所の役割もあるため、令和9年度までに全校で設置を終える計画。",
      discussion_summary:
        "委員は設置の順番を質し、局は避難所の指定と室温の高さで決めていると説明した。",
      speakers: [{ label: "例示委員" }, { label: "仮定委員" }],
      start_voice_no: 8,
      end_voice_no: 11,
    },
    {
      meeting_id: machi,
      topic_order: 1,
      title: "駅前の再開発、商店街の声は届いてる？",
      summary: "説明会を4回開き、出された意見を計画の見直しに反映している。",
      discussion_summary:
        "委員は工事中の安全を質し、局は歩行者通路の確保と誘導員の配置を説明した。",
      speakers: [{ label: "見本委員" }, { label: "仮定委員" }],
      start_voice_no: 2,
      end_voice_no: 5,
    },
    {
      meeting_id: machi,
      topic_order: 2,
      title: "公園のトイレ、洋式になる？",
      summary: "今年度は12か所を改修し、洋式化率は68%になる見込み。",
      discussion_summary:
        "委員は残りの見通しを質し、局は毎年10か所程度ずつ改修すると説明した。",
      speakers: [{ label: "例示委員" }, { label: "見本委員" }],
      start_voice_no: 6,
      end_voice_no: 9,
    },
    {
      meeting_id: kankyo,
      topic_order: 1,
      title: "ごみの収集日が変わる？",
      summary: "一部の地区で、来年4月から資源ごみの収集日が変わる。",
      discussion_summary: null,
      speakers: [],
      start_voice_no: 1,
      end_voice_no: 4,
    },
  ];
}

// ============================================================
// 首長の記者会見
// ============================================================

export const pressConferences: PressConferenceInsert[] = [
  {
    slug: "2025-12-10",
    title: "市長定例記者会見（令和7年12月10日）",
    held_at: "2025-12-10",
    youtube_url: null,
    status: "published",
  },
  {
    slug: "2025-11-26",
    title: "市長定例記者会見（令和7年11月26日）",
    held_at: "2025-11-26",
    youtube_url: null,
    status: "published",
  },
];

type ItemSeed = Omit<PressConferenceItemInsert, "press_conference_id"> & {
  turns: Omit<PressConferenceTurnInsert, "press_conference_item_id">[];
};

/**
 * pressConferences の順で挿入した ID ごとの発表・質疑（発言つき）
 */
export function createPressConferenceItems(
  conferenceIds: string[]
): { pressConferenceId: string; items: ItemSeed[] }[] {
  const [latest, earlier] = conferenceIds;
  if (!latest || !earlier) {
    throw new Error("press conferences が2件必要です");
  }

  return [
    {
      pressConferenceId: latest,
      items: [
        {
          item_type: "announcement",
          order_index: 1,
          title: "冬休みの子どもの居場所、図書館を夜まで開ける",
          summary:
            "冬休み中、市立図書館3館の開館時間を午後8時まで延ばし、学習スペースを設ける。",
          detail: null,
          material_url: null,
          turns: [
            {
              speaker: "executive",
              speaker_name: "市長",
              content:
                "冬休みの間、子どもたちが安心して過ごせる場所を増やすため、図書館3館の開館を午後8時まで延長します。",
              order_index: 1,
            },
          ],
        },
        {
          item_type: "qa",
          order_index: 2,
          title: "延長にかかる費用は？",
          summary: "人件費などで約300万円。既存の予算の中でまかなう。",
          detail: null,
          material_url: null,
          turns: [
            {
              speaker: "reporter",
              speaker_name: null,
              content: "延長にかかる費用はどのくらいですか。",
              order_index: 1,
            },
            {
              speaker: "executive",
              speaker_name: "市長",
              content:
                "人件費などで約300万円を見込んでいます。今年度の予算の中でまかないます。",
              order_index: 2,
            },
          ],
        },
        {
          item_type: "qa",
          order_index: 3,
          title: "ほかの施設にも広げる？",
          summary: "利用状況を見て、来年の夏休みに公民館へ広げるか判断する。",
          detail: null,
          material_url: null,
          turns: [
            {
              speaker: "reporter",
              speaker_name: null,
              content: "公民館など、ほかの施設にも広げる考えはありますか。",
              order_index: 1,
            },
            {
              speaker: "secretariat",
              speaker_name: "生涯学習課長",
              content:
                "今回の利用状況を確かめたうえで、来年の夏休みに公民館へ広げるかを判断します。",
              order_index: 2,
            },
          ],
        },
      ],
    },
    {
      pressConferenceId: earlier,
      items: [
        {
          item_type: "announcement",
          order_index: 1,
          title: "防災アプリで避難所の混み具合がわかるように",
          summary:
            "12月から、市の防災アプリで指定避難所の混雑状況を確認できるようにする。",
          detail: null,
          material_url: null,
          turns: [
            {
              speaker: "executive",
              speaker_name: "市長",
              content:
                "災害の時に、空いている避難所を選べるよう、防災アプリで混み具合を表示します。",
              order_index: 1,
            },
          ],
        },
      ],
    },
  ];
}
