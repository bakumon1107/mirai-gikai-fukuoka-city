/**
 * parse-minutes.ts
 *
 * 福岡市議会の会議録テキストをパースして発言ブロックに分割する純粋関数群。
 * 議案質疑（定例会第１日）を対象とする。
 */

/** 発言者の種別 */
export type SpeakerType = "questioner" | "answerer" | "chairperson";

/** 1つの発言ブロック */
export type SpeechBlock = {
  speakerType: SpeakerType;
  speakerName: string;
  speakerNumber?: string; // 議席番号（質問者のみ）
  speakerRole?: string; // 役職（答弁者のみ。例: "農林水産局長"）
  text: string;
};

/** 質疑セット（1質問者分の全発言）*/
export type DiscussionGroup = {
  questionerName: string;
  questionerNumber: string;
  billNumbers: string[]; // 質問対象の議案番号（例: ["201", "259"]）
  speeches: SpeechBlock[];
};

// ◯57番（田中たかし）登壇
const QUESTIONER_LINE_RE = /^◯(\d+)番（(.+?)）/;
// ◯農林水産局長（姉川雄一）  ◯市長（高島宗一郎）  ◯副市長（...）
const ANSWERER_LINE_RE = /^◯(?!議長)(.+?局長|市長|副市長|教育長|消防局長|水道局長|交通局長|港湾局長)（(.+?)）/;
// ◯議長（...）
const CHAIRPERSON_LINE_RE = /^◯議長（/;

/** テキストから議案番号を抽出する */
export function extractBillNumbers(text: string): string[] {
  const matches = [...text.matchAll(/議案第(\d+)号/g)];
  const numbers = matches.map((m) => m[1]);
  return [...new Set(numbers)]; // 重複除去
}

/** テキストから会派名を抽出する */
export function extractParty(text: string): string | null {
  // 「は」や読点・句点の直後から始まる会派名を抽出する
  // 会派名は「は」を含まないため [^は\s、。] でマッチ
  const match = text.match(
    /[^は\s、。「」（）]+(?:クラブ|の会|議団|民主党|自民党|共産党|公明党|維新|ネットワーク|連合|フォーラム|改革)(?=[を]代表)/
  );
  return match ? match[0] : null;
}

/** 往復回数をカウントする（質問→答弁で1往復） */
export function countExchanges(speeches: SpeechBlock[]): number {
  let count = 0;
  let lastWasQuestion = false;
  for (const s of speeches) {
    if (s.speakerType === "questioner") {
      lastWasQuestion = true;
    } else if (s.speakerType === "answerer" && lastWasQuestion) {
      count++;
      lastWasQuestion = false;
    }
  }
  return Math.max(count, 1);
}

/**
 * 会議録テキストを発言ブロック一覧にパースする
 */
export function parseMinutes(text: string): SpeechBlock[] {
  const lines = text.split("\n");
  const blocks: SpeechBlock[] = [];

  let currentBlock: SpeechBlock | null = null;
  let currentLines: string[] = [];

  function flushBlock() {
    if (currentBlock) {
      currentBlock.text = currentLines.join("\n").trim();
      if (currentBlock.text.length > 0) {
        blocks.push(currentBlock);
      }
    }
    currentBlock = null;
    currentLines = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (CHAIRPERSON_LINE_RE.test(trimmed)) {
      flushBlock();
      currentBlock = {
        speakerType: "chairperson",
        speakerName: "議長",
        text: "",
      };
      currentLines = [trimmed.replace(/^◯議長（.+?）\s*/, "")];
      continue;
    }

    const questionerMatch = trimmed.match(QUESTIONER_LINE_RE);
    if (questionerMatch) {
      flushBlock();
      const number = questionerMatch[1];
      const name = questionerMatch[2];
      const rest = trimmed.replace(/^◯\d+番（.+?）(?:登壇)?\s*/, "");
      currentBlock = {
        speakerType: "questioner",
        speakerName: name,
        speakerNumber: number,
        text: "",
      };
      currentLines = [rest];
      continue;
    }

    const answererMatch = trimmed.match(ANSWERER_LINE_RE);
    if (answererMatch) {
      flushBlock();
      const role = answererMatch[1];
      const name = answererMatch[2];
      const rest = trimmed.replace(/^◯.+?（.+?）\s*/, "");
      currentBlock = {
        speakerType: "answerer",
        speakerName: name,
        speakerRole: role,
        text: "",
      };
      currentLines = [rest];
      continue;
    }

    // 発言の続き
    if (currentBlock) {
      currentLines.push(trimmed);
    }
  }

  flushBlock();
  return blocks;
}

/**
 * 発言ブロック一覧を質疑セットにグループ化する
 * 質問者が切り替わったタイミングで新しいグループを開始する
 */
export function groupIntoDiscussions(
  speeches: SpeechBlock[]
): DiscussionGroup[] {
  const groups: DiscussionGroup[] = [];
  let currentGroup: DiscussionGroup | null = null;
  let currentSpeeches: SpeechBlock[] = [];
  let currentQuestioner: { name: string; number: string } | null = null;

  function flushGroup() {
    if (currentGroup && currentSpeeches.length > 0) {
      const questionSpeeches = currentSpeeches.filter(
        (s) => s.speakerType === "questioner"
      );
      const questionText = questionSpeeches.map((s) => s.text).join("\n");
      const billNumbers = extractBillNumbers(questionText);

      currentGroup.billNumbers = billNumbers;
      currentGroup.speeches = currentSpeeches;
      groups.push(currentGroup);
    }
    currentGroup = null;
    currentSpeeches = [];
  }

  for (const speech of speeches) {
    if (speech.speakerType === "chairperson") {
      continue; // 議長発言はスキップ
    }

    if (speech.speakerType === "questioner") {
      const key = `${speech.speakerNumber}-${speech.speakerName}`;
      const currentKey = currentQuestioner
        ? `${currentQuestioner.number}-${currentQuestioner.name}`
        : null;

      if (key !== currentKey) {
        // 新しい質問者 → グループを切り替える
        flushGroup();
        currentQuestioner = {
          name: speech.speakerName,
          number: speech.speakerNumber ?? "",
        };
        currentGroup = {
          questionerName: speech.speakerName,
          questionerNumber: speech.speakerNumber ?? "",
          billNumbers: [],
          speeches: [],
        };
      }
    }

    if (currentGroup) {
      currentSpeeches.push(speech);
    }
  }

  flushGroup();
  return groups;
}
