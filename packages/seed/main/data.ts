import type { Database } from "@mirai-gikai/supabase";

type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
type CouncilSessionInsert =
  Database["public"]["Tables"]["council_sessions"]["Insert"];
type FactionInsert = Database["public"]["Tables"]["factions"]["Insert"];
type CommitteeInsert = Database["public"]["Tables"]["committees"]["Insert"];

// 定例会データ（福岡市議会）
export const councilSessions: CouncilSessionInsert[] = [
  {
    name: "令和8年 第1回定例会（2・3月）",
    slug: "r8-1",
    council_url: "https://gikai.city.fukuoka.lg.jp/result/r8_gikai1/",
    start_date: "2026-02-17",
    end_date: "2026-03-27",
    is_active: true,
  },
  {
    name: "令和7年 第4回定例会（12月）",
    slug: "r7-4",
    council_url: "https://gikai.city.fukuoka.lg.jp/result/result/",
    start_date: "2025-12-01",
    end_date: "2025-12-19",
    is_active: false,
  },
];

// 会派データ（福岡市議会 2026年3月時点）
export const factions: FactionInsert[] = [
  {
    name: "mirai",
    display_name: "みらい",
    sort_order: 1,
    is_active: true,
  },
  {
    name: "jimin-fukuoka",
    display_name: "自由民主党福岡市議団",
    sort_order: 2,
    is_active: true,
  },
  {
    name: "komei",
    display_name: "公明党福岡市議団",
    sort_order: 3,
    is_active: true,
  },
  {
    name: "fukuoka-shimin",
    display_name: "福岡市民クラブ",
    sort_order: 4,
    is_active: true,
  },
  {
    name: "kyosan",
    display_name: "日本共産党福岡市議団",
    sort_order: 5,
    is_active: true,
  },
  {
    name: "atarashii-kaze",
    display_name: "新しい風ふくおか",
    sort_order: 6,
    is_active: true,
  },
  {
    name: "ishin",
    display_name: "日本維新の会福岡市議団",
    sort_order: 7,
    is_active: true,
  },
  {
    name: "jimin-shin-fukuoka",
    display_name: "自民党新福岡",
    sort_order: 8,
    is_active: true,
  },
  {
    name: "mushozoku",
    display_name: "無所属",
    sort_order: 9,
    is_active: true,
  },
];

// 委員会データ（福岡市議会 常任委員会）
export const committees: CommitteeInsert[] = [
  {
    name: "総務財政委員会",
    description: "総務、財政、企画、税務などについての審査",
    sort_order: 1,
    is_active: true,
  },
  {
    name: "教育こども委員会",
    description: "教育、こども、保育、学校などについての審査",
    sort_order: 2,
    is_active: true,
  },
  {
    name: "経済振興委員会",
    description: "産業、観光、農業、商工業などについての審査",
    sort_order: 3,
    is_active: true,
  },
  {
    name: "福祉都市委員会",
    description: "福祉、保健、医療、都市整備などについての審査",
    sort_order: 4,
    is_active: true,
  },
  {
    name: "生活環境委員会",
    description: "環境、ごみ、水道、交通などについての審査",
    sort_order: 5,
    is_active: true,
  },
];

// タグデータ
export const tags: TagInsert[] = [
  {
    label: "まちづくり・環境",
    description: "まちづくり、環境保護、都市計画に関する議案",
    featured_priority: 1,
  },
  {
    label: "子育て・教育",
    description: "子育て支援、教育政策、若者支援に関する議案",
    featured_priority: 2,
  },
  {
    label: "福祉・医療",
    description: "福祉、医療、高齢者支援に関する議案",
    featured_priority: 3,
  },
];
