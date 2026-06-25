// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { TopicGroup } from "../../shared/utils/build-topic-groups";
import { SessionQuestionsOverview } from "./session-questions-overview";

// next/link は jsdom でそのまま <a> としてレンダリングできるよう簡易モック
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

const groups: TopicGroup[] = [
  {
    categoryLabel: "子育て・教育",
    iconName: "Baby",
    entries: [
      {
        title: "保育所の待機児童対策",
        questionSummary: "待機児童は？",
        answerSummary: "令和9年度中に解消予定。",
        answererRole: "こども未来局長",
        answererName: "野中晶",
        topicCount: 1,
        questioner: { id: "q1", name: "山田花子", party: "テスト会派" },
      },
    ],
  },
  {
    categoryLabel: "行財政・経済",
    iconName: "Landmark",
    entries: [
      {
        title: "予算編成と財政運営",
        questionSummary: "予算の方針は？",
        answerSummary: "5分野に注力する。",
        answererRole: "市長",
        answererName: "高島宗一郎",
        topicCount: 2,
        questioner: { id: "q2", name: "佐藤太郎", party: null },
      },
    ],
  },
];

describe("SessionQuestionsOverview", () => {
  it("3行サマリーを表示する", () => {
    render(
      <SessionQuestionsOverview
        groups={groups}
        overview={["1行目の話題", "2行目の話題", "3行目の話題"]}
      />
    );
    expect(screen.getByText("1行目の話題")).toBeInTheDocument();
    expect(screen.getByText("2行目の話題")).toBeInTheDocument();
    expect(screen.getByText("3行目の話題")).toBeInTheDocument();
  });

  it("overviewがnullなら3行ブロックを表示しない", () => {
    render(<SessionQuestionsOverview groups={groups} overview={null} />);
    expect(
      screen.queryByText("どんな話があった？（今回の3行まとめ）")
    ).not.toBeInTheDocument();
  });

  it("テーマ行を件数つきで表示し、初期状態ではカードを表示しない", () => {
    render(<SessionQuestionsOverview groups={groups} overview={null} />);
    expect(screen.getByText("子育て・教育")).toBeInTheDocument();
    // 行財政・経済は topicCount=2 → 「2件」
    expect(screen.getByText("2件")).toBeInTheDocument();
    // 初期は折りたたみ → カード本文は出ていない
    expect(
      screen.queryByText("令和9年度中に解消予定。")
    ).not.toBeInTheDocument();
  });

  it("テーマをクリックすると中のカードが展開される", async () => {
    const user = userEvent.setup();
    render(<SessionQuestionsOverview groups={groups} overview={null} />);
    await user.click(screen.getByRole("button", { name: /子育て・教育/ }));
    expect(screen.getByText("令和9年度中に解消予定。")).toBeInTheDocument();
    // もう一方のテーマはまだ閉じている
    expect(screen.queryByText("5分野に注力する。")).not.toBeInTheDocument();
  });

  it("「すべて開く」で全テーマが展開される", async () => {
    const user = userEvent.setup();
    render(<SessionQuestionsOverview groups={groups} overview={null} />);
    await user.click(screen.getByRole("button", { name: "すべて開く" }));
    expect(screen.getByText("令和9年度中に解消予定。")).toBeInTheDocument();
    expect(screen.getByText("5分野に注力する。")).toBeInTheDocument();
  });
});
