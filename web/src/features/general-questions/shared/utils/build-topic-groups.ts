import type { GeneralQuestion } from "../types";

export type TopicEntry = {
  title: string;
  questionSummary: string;
  answerSummary: string;
  answererRole: string;
  answererName: string;
  questioner: {
    id: string;
    name: string;
    party: string | null;
  };
};

export type TopicGroup = {
  categoryLabel: string;
  iconName: string;
  entries: TopicEntry[];
};

const CATEGORY_MAP: Array<{
  label: string;
  iconName: string;
  keywords: string[];
}> = [
  {
    label: "子育て・教育",
    iconName: "Baby",
    keywords: [
      "保育",
      "子ども",
      "給食",
      "学校",
      "育児",
      "児童",
      "教育",
      "不登校",
      "教員",
      "修学",
      "進路",
      "学び",
      "義務教育",
      "外国人児童",
    ],
  },
  {
    label: "健康・医療",
    iconName: "Stethoscope",
    keywords: [
      "ワクチン",
      "医療",
      "コロナ",
      "健康",
      "HPV",
      "衛生",
      "後遺症",
      "肺炎",
      "接種",
      "病院",
    ],
  },
  {
    label: "防災・安全",
    iconName: "Shield",
    keywords: [
      "耐震",
      "避難",
      "防災",
      "減災",
      "災害",
      "安全",
      "火災",
      "発令",
      "警報",
      "注意報",
      "ボランティア",
      "林野",
    ],
  },
  {
    label: "高齢者・福祉",
    iconName: "Heart",
    keywords: [
      "高齢者",
      "移動支援",
      "国民健康保険",
      "デジタルデバイド",
      "福祉",
      "介護",
      "障害",
      "老人",
      "孤立",
      "独居",
    ],
  },
  {
    label: "交通・まちづくり",
    iconName: "Building2",
    keywords: [
      "渋滞",
      "空港",
      "交通",
      "滑走路",
      "道路",
      "鉄道",
      "バス",
      "地下鉄",
      "まちづくり",
      "再開発",
      "無電柱",
      "橋梁",
      "駐輪",
      "渡船",
      "動く歩道",
      "住宅",
      "民泊",
    ],
  },
  {
    label: "環境・脱炭素",
    iconName: "Leaf",
    keywords: [
      "太陽光",
      "省エネ",
      "カーボン",
      "再生可能",
      "環境",
      "脱炭素",
      "ゼロカーボン",
      "温室効果",
      "ごみ",
      "漂着",
      "植栽",
    ],
  },
  {
    label: "スポーツ・文化",
    iconName: "Trophy",
    keywords: [
      "スポーツ",
      "eスポーツ",
      "アスリート",
      "スタジアム",
      "博物館",
      "文化",
      "公民館",
      "城",
      "ドーム",
    ],
  },
  {
    label: "地域・国際交流",
    iconName: "Globe",
    keywords: [
      "漁港",
      "農業",
      "観光",
      "地域",
      "市営",
      "国際",
      "外国人",
      "多文化",
      "共生",
      "海業",
      "漁村",
      "動物",
      "愛護",
      "自治会",
      "町内会",
      "飼育",
      "農林水産",
    ],
  },
];

export function assignCategory(topicTitle: string): {
  label: string;
  iconName: string;
} {
  for (const cat of CATEGORY_MAP) {
    if (cat.keywords.some((kw) => topicTitle.includes(kw))) {
      return { label: cat.label, iconName: cat.iconName };
    }
  }
  return { label: "その他", iconName: "Circle" };
}

export function buildTopicGroups(questions: GeneralQuestion[]): TopicGroup[] {
  const categoryMap = new Map<string, TopicGroup>();

  for (const q of questions) {
    for (const t of q.topics) {
      const { label, iconName } = assignCategory(t.title);
      const entry: TopicEntry = {
        title: t.title,
        questionSummary: t.question_summary,
        answerSummary: t.answer_summary,
        answererRole: t.answerer_role,
        answererName: t.answerer_name,
        questioner: {
          id: q.id,
          name: q.questioner_name,
          party: q.questioner_party,
        },
      };
      const existing = categoryMap.get(label);
      if (existing) {
        existing.entries.push(entry);
      } else {
        categoryMap.set(label, {
          categoryLabel: label,
          iconName,
          entries: [entry],
        });
      }
    }
  }

  const orderedLabels = [...CATEGORY_MAP.map((c) => c.label), "その他"].filter(
    (l) => categoryMap.has(l)
  );

  return orderedLabels.map((l) => categoryMap.get(l) as TopicGroup);
}
