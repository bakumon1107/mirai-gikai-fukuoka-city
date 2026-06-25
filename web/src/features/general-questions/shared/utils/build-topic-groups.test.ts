import { describe, expect, it } from "vitest";
import type { GeneralQuestion } from "../types";
import { assignCategory, buildTopicGroups } from "./build-topic-groups";

describe("assignCategory", () => {
  it("保育所 → 子育て・教育", () => {
    expect(assignCategory("保育所の待機児童対策").label).toBe("子育て・教育");
  });
  it("耐震 → 防災・安全", () => {
    expect(assignCategory("木造密集市街地の耐震化促進").label).toBe(
      "防災・安全"
    );
  });
  it("予算編成・財政運営 → 行財政・経済", () => {
    expect(assignCategory("予算編成・財政運営と基金の積極活用").label).toBe(
      "行財政・経済"
    );
  });
  it("中小企業・取適法 → 行財政・経済", () => {
    expect(
      assignCategory("取適法施行を踏まえた価格転嫁・中小企業支援の取組").label
    ).toBe("行財政・経済");
  });
  it("市債マネジメント → 行財政・経済", () => {
    expect(
      assignCategory("将来世代を守るための市債マネジメントのルール化").label
    ).toBe("行財政・経済");
  });
  it("いじめ → 子育て・教育", () => {
    expect(
      assignCategory("いじめ防止対策（プロジェクトチーム新設）").label
    ).toBe("子育て・教育");
  });
  it("がん検査 → 健康・医療", () => {
    expect(assignCategory("膵臓がんの早期発見に向けた検査").label).toBe(
      "健康・医療"
    );
  });
  it("補聴器助成 → 健康・医療", () => {
    expect(assignCategory("18歳以上の軽中等度難聴者への補聴器助成").label).toBe(
      "健康・医療"
    );
  });
  it("危機管理 → 防災・安全", () => {
    expect(
      assignCategory("危機管理基本方針と事件等緊急事態対処計画").label
    ).toBe("防災・安全");
  });
  it("成年後見 → 高齢者・福祉", () => {
    expect(
      assignCategory("成年後見制度における市民後見人の育成と報酬助成").label
    ).toBe("高齢者・福祉");
  });
  it("回遊性 → 交通・まちづくり", () => {
    expect(assignCategory("天神北エリアの回遊性向上").label).toBe(
      "交通・まちづくり"
    );
  });
  it("動植物園 → スポーツ・文化", () => {
    expect(assignCategory("動植物園のリニューアル").label).toBe(
      "スポーツ・文化"
    );
  });
  it("マッチしない → その他", () => {
    expect(assignCategory("特になし").label).toBe("その他");
  });

  it("行財政・経済は末尾にあり、既存カテゴリの判定を奪わない", () => {
    // 「中小企業のDXによる生産性向上」は経済キーワードを含むが、
    // 同時に交通・まちづくり等の語を含まない限り行財政・経済へ。
    // 一方、教育キーワードを含むものは先に子育て・教育へ分類される。
    expect(assignCategory("学校でのDX活用と教育データ連携").label).toBe(
      "子育て・教育"
    );
  });
});

const mockQuestion: GeneralQuestion = {
  id: "q-001",
  council_session_id: "session-1",
  questioner_name: "山田花子",
  questioner_party: "テスト会派",
  questioner_number: 1,
  session_day: 1,
  question_order: 1,
  summary: "保育所の待機児童解消と耐震化促進について質問。",
  topics: [
    {
      title: "保育所の待機児童対策",
      question_summary: "待機児童の解消策は？",
      answer_summary: "令和9年度中に解消予定。",
      answerer_role: "子ども未来局長",
      answerer_name: "田中一郎",
    },
    {
      title: "木造密集市街地の耐震化促進",
      question_summary: "補助を拡充せよ。",
      answer_summary: "令和8年度から150万円に引き上げ。",
      answerer_role: "住宅都市局長",
      answerer_name: "松本雅彦",
    },
  ],
  raw_text: null,
  source_url: null,
  publish_status: "published",
  created_at: "2026-04-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
};

describe("buildTopicGroups", () => {
  it("トピックをカテゴリ別に分類する", () => {
    const groups = buildTopicGroups([mockQuestion]);
    const labels = groups.map((g) => g.categoryLabel);
    expect(labels).toContain("子育て・教育");
    expect(labels).toContain("防災・安全");
  });

  it("各グループにentryが含まれる", () => {
    const groups = buildTopicGroups([mockQuestion]);
    const childCare = groups.find((g) => g.categoryLabel === "子育て・教育");
    expect(childCare?.entries).toHaveLength(1);
    expect(childCare?.entries[0].questioner.id).toBe("q-001");
  });

  it("単一トピックのカードはtopicCount=1でトピック名をtitleに使う", () => {
    const groups = buildTopicGroups([mockQuestion]);
    const childCare = groups.find((g) => g.categoryLabel === "子育て・教育");
    const entry = childCare?.entries[0];
    expect(entry?.topicCount).toBe(1);
    expect(entry?.title).toBe("保育所の待機児童対策");
  });

  it("同一議員・同一カテゴリの複数トピックは1枚にマージされる", () => {
    const q: GeneralQuestion = {
      id: "q-002",
      council_session_id: "session-1",
      questioner_name: "和田あきひこ",
      questioner_party: null,
      questioner_number: 2,
      session_day: 1,
      question_order: 2,
      summary: "火災警報が平成以降一度も発令されていない実態を指摘。",
      topics: [
        {
          title: "火災警報の発令基準について",
          question_summary: "発令基準の見直しを。",
          answer_summary: "制度の検討を進める。",
          answerer_role: "消防局長",
          answerer_name: "鈴木一郎",
        },
        {
          title: "林野火災注意報の導入について",
          question_summary: "林野火災への対応は？",
          answer_summary: "林野火災注意報の導入を検討する。",
          answerer_role: "消防局長",
          answerer_name: "鈴木一郎",
        },
        {
          title: "災害時のプッシュ型情報発信の必要性",
          question_summary: "住民への情報発信を強化せよ。",
          answer_summary: "プッシュ通知の拡充を検討する。",
          answerer_role: "総務企画局長",
          answerer_name: "佐藤次郎",
        },
      ],
      raw_text: null,
      source_url: null,
      publish_status: "published",
      created_at: "2026-04-01T00:00:00Z",
      updated_at: "2026-04-01T00:00:00Z",
    };

    const groups = buildTopicGroups([q]);
    const bousai = groups.find((g) => g.categoryLabel === "防災・安全");
    expect(bousai?.entries).toHaveLength(1);
    const entry = bousai?.entries[0];
    expect(entry?.topicCount).toBe(3);
    // merged block uses first topic's title; N件 badge shows the count
    expect(entry?.title).toBe("火災警報の発令基準について");
    // block_summary が未設定の場合は最初のトピックの answer_summary を使う
    expect(entry?.answerSummary).toBe("制度の検討を進める。");
  });

  it("同一議員でもカテゴリが異なれば別カードになる", () => {
    const q: GeneralQuestion = {
      id: "q-003",
      council_session_id: "session-1",
      questioner_name: "テスト議員",
      questioner_party: null,
      questioner_number: 3,
      session_day: 1,
      question_order: 3,
      summary: "防災と交通について質問。",
      topics: [
        {
          title: "火災警報の改善について",
          question_summary: "警報基準の見直しを。",
          answer_summary: "検討する。",
          answerer_role: "消防局長",
          answerer_name: "A",
        },
        {
          title: "地下鉄延伸計画の現状について",
          question_summary: "地下鉄延伸の見通しは？",
          answer_summary: "条例改正を検討する。",
          answerer_role: "道路下水道局長",
          answerer_name: "B",
        },
      ],
      raw_text: null,
      source_url: null,
      publish_status: "published",
      created_at: "2026-04-01T00:00:00Z",
      updated_at: "2026-04-01T00:00:00Z",
    };

    const groups = buildTopicGroups([q]);
    const labels = groups.map((g) => g.categoryLabel);
    expect(labels).toContain("防災・安全");
    expect(labels).toContain("交通・まちづくり");

    const bousai = groups.find((g) => g.categoryLabel === "防災・安全");
    const kotsu = groups.find((g) => g.categoryLabel === "交通・まちづくり");
    expect(bousai?.entries).toHaveLength(1);
    expect(kotsu?.entries).toHaveLength(1);
    expect(bousai?.entries[0].topicCount).toBe(1);
    expect(kotsu?.entries[0].topicCount).toBe(1);
  });

  it("空配列は空グループを返す", () => {
    expect(buildTopicGroups([])).toHaveLength(0);
  });

  it("各ブロックは先頭トピックのindexをtopicIndexに持つ", () => {
    // topics: [0]保育=子育て, [1]耐震=防災 → 2ブロック（index 0, 1）
    const groups = buildTopicGroups([mockQuestion]);
    const childCare = groups.find((g) => g.categoryLabel === "子育て・教育");
    const bousai = groups.find((g) => g.categoryLabel === "防災・安全");
    expect(childCare?.entries[0].topicIndex).toBe(0);
    expect(bousai?.entries[0].topicIndex).toBe(1);
  });

  it("連続同カテゴリをまとめたブロックのtopicIndexは先頭トピックの位置", () => {
    const q: GeneralQuestion = {
      id: "q-idx",
      council_session_id: "session-1",
      questioner_name: "テスト",
      questioner_party: null,
      questioner_number: 9,
      session_day: 1,
      question_order: 9,
      summary: "",
      topics: [
        // [0] 子育て
        {
          title: "保育の充実",
          question_summary: "q",
          answer_summary: "a",
          answerer_role: "局長",
          answerer_name: "A",
        },
        // [1][2] 防災（連続→1ブロック, 先頭index=1）
        {
          title: "耐震化の推進",
          question_summary: "q",
          answer_summary: "a",
          answerer_role: "局長",
          answerer_name: "A",
        },
        {
          title: "火災警報の見直し",
          question_summary: "q",
          answer_summary: "a",
          answerer_role: "局長",
          answerer_name: "A",
        },
      ],
      raw_text: null,
      source_url: null,
      publish_status: "published",
      created_at: "2026-04-01T00:00:00Z",
      updated_at: "2026-04-01T00:00:00Z",
    };
    const groups = buildTopicGroups([q]);
    const bousai = groups.find((g) => g.categoryLabel === "防災・安全");
    expect(bousai?.entries[0].topicCount).toBe(2);
    expect(bousai?.entries[0].topicIndex).toBe(1);
  });
});
