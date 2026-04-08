import { describe, expect, it } from "vitest";
import {
  countExchanges,
  extractBillNumbers,
  extractParty,
  groupIntoDiscussions,
  parseMinutes,
} from "./parse-minutes";

describe("extractBillNumbers", () => {
  it("単一の議案番号を抽出する", () => {
    expect(extractBillNumbers("議案第201号について質問します。")).toEqual([
      "201",
    ]);
  });

  it("複数の議案番号を抽出する", () => {
    expect(
      extractBillNumbers("議案第201号及び議案第259号について質問します。")
    ).toEqual(["201", "259"]);
  });

  it("重複を除去する", () => {
    expect(
      extractBillNumbers(
        "議案第201号について。以上、議案第201号に関する質問を終えます。"
      )
    ).toEqual(["201"]);
  });

  it("議案番号がない場合は空配列を返す", () => {
    expect(extractBillNumbers("一般的な発言です。")).toEqual([]);
  });
});

describe("extractParty", () => {
  it("会派名を抽出する", () => {
    expect(
      extractParty(
        "私は福岡市民クラブを代表して、本議会に上程されております..."
      )
    ).toBe("福岡市民クラブ");
  });

  it("会派名がない場合はnullを返す", () => {
    expect(extractParty("一般的な発言です。")).toBeNull();
  });
});

describe("countExchanges", () => {
  it("1往復をカウントする", () => {
    const speeches = [
      {
        speakerType: "questioner" as const,
        speakerName: "田中",
        text: "質問",
      },
      {
        speakerType: "answerer" as const,
        speakerName: "局長",
        speakerRole: "農林水産局長",
        text: "答弁",
      },
    ];
    expect(countExchanges(speeches)).toBe(1);
  });

  it("2往復をカウントする", () => {
    const speeches = [
      {
        speakerType: "questioner" as const,
        speakerName: "田中",
        text: "1回目の質問",
      },
      {
        speakerType: "answerer" as const,
        speakerName: "局長",
        speakerRole: "農林水産局長",
        text: "1回目の答弁",
      },
      {
        speakerType: "questioner" as const,
        speakerName: "田中",
        text: "2回目の質問",
      },
      {
        speakerType: "answerer" as const,
        speakerName: "局長",
        speakerRole: "農林水産局長",
        text: "2回目の答弁",
      },
    ];
    expect(countExchanges(speeches)).toBe(2);
  });

  it("質問のみの場合は1を返す", () => {
    const speeches = [
      {
        speakerType: "questioner" as const,
        speakerName: "田中",
        text: "質問のみ",
      },
    ];
    expect(countExchanges(speeches)).toBe(1);
  });
});

const SAMPLE_MINUTES = `2025年12月11日：令和７年第５回定例会（第１日）
◯議長（平畑雅博）　これより質疑に入ります。田中たかし議員。

◯57番（田中たかし）登壇　私は福岡市民クラブを代表して、議案第201号及び議案第259号について質問をいたします。
　まず、福岡市漁港管理条例改正案についてです。

◯議長（平畑雅博）　姉川農林水産局長。

◯農林水産局長（姉川雄一）　福岡市漁港管理条例の一部を改正する条例案についての御質問にお答えいたします。
　放置艇への対応について説明します。

◯議長（平畑雅博）　中村財政局長。

◯財政局長（中村剛士）　一般会計補正予算案についてお答えいたします。
　物価高対策として補正予算を計上しました。

◯議長（平畑雅博）　田中たかし議員。

◯57番（田中たかし）　では、２回目に参ります。
　追加の質問です。

◯議長（平畑雅博）　姉川農林水産局長。

◯農林水産局長（姉川雄一）　２回目のお答えです。

◯議長（平畑雅博）　次の質問者、山田花子議員。

◯10番（山田花子）登壇　私は議案第210号について質問します。

◯農業委員会事務局長（鈴木一郎）　お答えします。農業政策について。
`;

describe("parseMinutes", () => {
  it("発言ブロックを正しくパースする", () => {
    const blocks = parseMinutes(SAMPLE_MINUTES);
    const questioners = blocks.filter((b) => b.speakerType === "questioner");
    const answerers = blocks.filter((b) => b.speakerType === "answerer");

    expect(questioners.length).toBeGreaterThanOrEqual(3); // 田中×2, 山田×1
    expect(answerers.length).toBeGreaterThanOrEqual(3);
  });

  it("質問者の議席番号と氏名を抽出する", () => {
    const blocks = parseMinutes(SAMPLE_MINUTES);
    const tanaka = blocks.find(
      (b) => b.speakerType === "questioner" && b.speakerName === "田中たかし"
    );
    expect(tanaka?.speakerNumber).toBe("57");
  });

  it("答弁者の役職を抽出する", () => {
    const blocks = parseMinutes(SAMPLE_MINUTES);
    const kyocho = blocks.find(
      (b) => b.speakerType === "answerer" && b.speakerRole === "農林水産局長"
    );
    expect(kyocho?.speakerName).toBe("姉川雄一");
  });
});

describe("groupIntoDiscussions", () => {
  it("質問者ごとにグループ化する", () => {
    const blocks = parseMinutes(SAMPLE_MINUTES);
    const groups = groupIntoDiscussions(blocks);

    expect(groups.length).toBe(2); // 田中、山田
    expect(groups[0].questionerName).toBe("田中たかし");
    expect(groups[1].questionerName).toBe("山田花子");
  });

  it("議案番号を正しく抽出する", () => {
    const blocks = parseMinutes(SAMPLE_MINUTES);
    const groups = groupIntoDiscussions(blocks);

    expect(groups[0].billNumbers).toEqual(["201", "259"]);
    expect(groups[1].billNumbers).toEqual(["210"]);
  });
});
