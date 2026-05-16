import type { GeneralQuestion } from "@/features/general-questions/shared/types";

export type TopicEntry = {
  title: string;
  questionSummary: string;
  answerSummary: string;
  answererRole: string;
  answererName: string | null;
  questioner: {
    id: string;
    name: string;
    party: string | null;
  };
};

export type TopicGroup = {
  categoryLabel: string;
  icon: string;
  entries: TopicEntry[];
};

const CATEGORY_MAP: Array<{ label: string; icon: string; keywords: string[] }> =
  [
    {
      label: "子育て・教育",
      icon: "Baby",
      keywords: ["保育", "子ども", "給食", "学校"],
    },
    {
      label: "防災・安全",
      icon: "Shield",
      keywords: ["耐震", "避難", "防災", "減災"],
    },
    {
      label: "高齢者・福祉",
      icon: "Heart",
      keywords: ["高齢者", "移動支援", "国民健康保険", "デジタルデバイド"],
    },
    {
      label: "交通・都市基盤",
      icon: "Bus",
      keywords: ["渋滞", "空港", "交通", "滑走路"],
    },
    {
      label: "環境・脱炭素",
      icon: "Leaf",
      keywords: ["太陽光", "省エネ", "カーボン", "再生可能"],
    },
    {
      label: "地域振興",
      icon: "MapPin",
      keywords: ["漁港", "スポーツ施設", "市営"],
    },
  ];

function assignCategory(topicTitle: string): { label: string; icon: string } {
  for (const cat of CATEGORY_MAP) {
    if (cat.keywords.some((kw) => topicTitle.includes(kw))) {
      return { label: cat.label, icon: cat.icon };
    }
  }
  return { label: "その他", icon: "Circle" };
}

export function buildTopicGroups(questions: GeneralQuestion[]): TopicGroup[] {
  const categoryMap = new Map<string, TopicGroup>();

  for (const q of questions) {
    for (const t of q.topics) {
      const { label, icon } = assignCategory(t.title);
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
          icon,
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
