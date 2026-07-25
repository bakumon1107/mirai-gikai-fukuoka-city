/**
 * parse-committee-minutes.ts（福岡市版）
 *
 * 福岡市議会 会議録検索システム（dbsr.jp）の委員会議事録HTMLをパースする純粋関数群。
 * スクレイパー本体（scrape-committee-minutes.ts）から利用する。
 *
 * 福岡市の委員会議事録は発言者名が無い匿名・要約形式で、2つの記法がある:
 *   1) 予算・決算分科会: 1ブロック内に ［質疑・意見］…［答弁］… のラベル節
 *   2) 特別委・議会運営委: 1ブロック=1発言。◯=委員の質疑・意見／△=執行部の答弁
 *      （冒頭ブロックは開会時刻・傍聴・調査事項などの記録）
 * これらを共通のセグメント（発言単位）に正規化する。
 */

/** 委員会の区分 */
export type CommitteeType =
  | "standing" // 常任委員会
  | "special" // 調査特別委員会
  | "budget" // 条例予算特別委員会（分科会含む）
  | "audit" // 決算特別委員会（分科会含む）
  | "management"; // 議会運営委員会

/** 会議録検索システム上の会議名と現行委員会の対応 */
export type CommitteeMeta = {
  /** 会議録検索システム上の会議名（タイトルに含まれる部分文字列で照合） */
  dbsrName: string;
  /** 表示用の委員会名 */
  currentName: string;
  /** URL・ファイル名用スラッグ（アーカイブの単位） */
  slug: string;
  type: CommitteeType;
};

/**
 * 収録対象の委員会一覧。
 * タイトルは長い dbsrName から順に照合するため、包含関係のある名称
 * （例: 「都市交通対策特別委員会」⊃「交通対策特別委員会」）も正しく判定できる。
 */
export const CURRENT_COMMITTEES: CommitteeMeta[] = [
  // 条例予算特別委員会 分科会（局別）
  {
    dbsrName: "条例予算特別委員会総務財政分科会",
    currentName: "条例予算特別委員会 総務財政分科会",
    slug: "yosan-somu-zaisei",
    type: "budget",
  },
  {
    dbsrName: "条例予算特別委員会教育こども分科会",
    currentName: "条例予算特別委員会 教育こども分科会",
    slug: "yosan-kyoiku-kodomo",
    type: "budget",
  },
  {
    dbsrName: "条例予算特別委員会経済振興分科会",
    currentName: "条例予算特別委員会 経済振興分科会",
    slug: "yosan-keizai-shinko",
    type: "budget",
  },
  {
    dbsrName: "条例予算特別委員会福祉都市分科会",
    currentName: "条例予算特別委員会 福祉都市分科会",
    slug: "yosan-fukushi-toshi",
    type: "budget",
  },
  {
    dbsrName: "条例予算特別委員会生活環境分科会",
    currentName: "条例予算特別委員会 生活環境分科会",
    slug: "yosan-seikatsu-kankyo",
    type: "budget",
  },
  // 決算特別委員会 分科会（局別・将来の会期用）
  {
    dbsrName: "決算特別委員会総務財政分科会",
    currentName: "決算特別委員会 総務財政分科会",
    slug: "kessan-somu-zaisei",
    type: "audit",
  },
  {
    dbsrName: "決算特別委員会教育こども分科会",
    currentName: "決算特別委員会 教育こども分科会",
    slug: "kessan-kyoiku-kodomo",
    type: "audit",
  },
  {
    dbsrName: "決算特別委員会経済振興分科会",
    currentName: "決算特別委員会 経済振興分科会",
    slug: "kessan-keizai-shinko",
    type: "audit",
  },
  {
    dbsrName: "決算特別委員会福祉都市分科会",
    currentName: "決算特別委員会 福祉都市分科会",
    slug: "kessan-fukushi-toshi",
    type: "audit",
  },
  {
    dbsrName: "決算特別委員会生活環境分科会",
    currentName: "決算特別委員会 生活環境分科会",
    slug: "kessan-seikatsu-kankyo",
    type: "audit",
  },
  // 条例予算・決算特別委員会（全体会：保留質疑・採決）
  {
    dbsrName: "条例予算特別委員会",
    currentName: "条例予算特別委員会",
    slug: "yosan",
    type: "budget",
  },
  {
    dbsrName: "決算特別委員会",
    currentName: "決算特別委員会",
    slug: "kessan",
    type: "audit",
  },
  // 常任委員会（将来の会期用）
  {
    dbsrName: "総務財政委員会",
    currentName: "総務財政委員会",
    slug: "somu-zaisei",
    type: "standing",
  },
  {
    dbsrName: "教育こども委員会",
    currentName: "教育こども委員会",
    slug: "kyoiku-kodomo",
    type: "standing",
  },
  {
    dbsrName: "経済振興委員会",
    currentName: "経済振興委員会",
    slug: "keizai-shinko",
    type: "standing",
  },
  {
    dbsrName: "福祉都市委員会",
    currentName: "福祉都市委員会",
    slug: "fukushi-toshi",
    type: "standing",
  },
  {
    dbsrName: "生活環境委員会",
    currentName: "生活環境委員会",
    slug: "seikatsu-kankyo",
    type: "standing",
  },
  // 議会運営委員会
  {
    dbsrName: "議会運営委員会",
    currentName: "議会運営委員会",
    slug: "gikai-unei",
    type: "management",
  },
  // 調査特別委員会（長い名称を先に置く）
  {
    dbsrName: "都市交通対策特別委員会",
    currentName: "都市交通対策特別委員会",
    slug: "toshi-kotsu-taisaku",
    type: "special",
  },
  {
    dbsrName: "交通対策特別委員会",
    currentName: "交通対策特別委員会",
    slug: "kotsu-taisaku",
    type: "special",
  },
  {
    dbsrName: "都市問題等調査特別委員会",
    currentName: "都市問題等調査特別委員会",
    slug: "toshi-mondai",
    type: "special",
  },
  {
    dbsrName: "都市基盤等整備特別委員会",
    currentName: "都市基盤等整備特別委員会",
    slug: "toshi-kiban",
    type: "special",
  },
  {
    dbsrName: "少子・高齢化対策特別委員会",
    currentName: "少子・高齢化対策特別委員会",
    slug: "shoshi-koreika",
    type: "special",
  },
  {
    dbsrName: "防災等対策調査特別委員会",
    currentName: "防災等対策調査特別委員会",
    slug: "bosai",
    type: "special",
  },
  {
    dbsrName: "震災対策特別委員会",
    currentName: "震災対策特別委員会",
    slug: "shinsai",
    type: "special",
  },
  {
    dbsrName: "議会改革調査特別委員会",
    currentName: "議会改革調査特別委員会",
    slug: "gikai-kaikaku",
    type: "special",
  },
  {
    dbsrName: "議員定数等調査特別委員会",
    currentName: "議員定数等調査特別委員会",
    slug: "giin-teisu-nado",
    type: "special",
  },
  {
    dbsrName: "議員定数調査特別委員会",
    currentName: "議員定数調査特別委員会",
    slug: "giin-teisu",
    type: "special",
  },
];

/** 検索結果一覧の1文書 */
export type ListedDoc = {
  documentId: number;
  title: string;
  /** 開催日（YYYY-MM-DD） */
  date: string;
};

/** 発言セグメントの種別 */
export type SpeakerType =
  | "member" // 委員の質疑・意見（◯／［質疑・意見］）
  | "executive" // 執行部の答弁（△／［答弁］）
  | "note"; // 開会時刻・傍聴・調査事項などの記録・進行

/** 1発言セグメント */
export type Segment = {
  /** 文書内で一意の連番（会議全体の発言順） */
  seq: number;
  /** 元の発言ブロック番号（VoiceNoN。同一ブロックから複数セグメントが出る） */
  voiceNo: number;
  speakerType: SpeakerType;
  text: string;
  /** わかりやすい表現（AI生成・確認後に apply-committee-ai-content で付与） */
  simpleText?: string;
};

/** HTML実体参照を最低限デコードする */
export function decodeEntities(text: string): string {
  return text
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&");
}

/**
 * ページ内のリンクからセッションIDを抽出する。
 * 会議録検索システムはURLパス（/index.php/1234567）にセッションIDを埋め込む。
 */
export function extractSessionId(html: string): string | null {
  const match = html.match(/index\.php\/(\d+)/);
  return match ? match[1] : null;
}

/** 検索結果ページのヒット件数（「N文書」）を抽出する */
export function extractHitCount(html: string): number | null {
  const match = html.match(/<span class="color--red">([\d,]+)<\/span>/);
  return match ? Number(match[1].replaceAll(",", "")) : null;
}

/**
 * 検索結果一覧ページから文書一覧を抽出する。
 * 福岡市は開催日ラベルが全角コロン（開催日：）のため半角/全角どちらも許容する。
 */
export function parseListPage(html: string): {
  docs: ListedDoc[];
  hasNext: boolean;
} {
  const docs: ListedDoc[] = [];
  const docRe =
    /DocumentID=(\d+)"[^>]*>([^<]+)<\/a>\s*<span class="result-title__date">開催日[：:]\s*([\d-]+)<\/span>/g;
  for (const m of html.matchAll(docRe)) {
    docs.push({
      documentId: Number(m[1]),
      title: decodeEntities(m[2]).trim(),
      date: m[3],
    });
  }
  const hasNext = /<a href="[^"]*Page=\d+">次\s*&gt;<\/a>/.test(html);
  return { docs, hasNext };
}

/** 発言ブロックのHTMLをプレーンテキストに整形する */
function cleanVoiceInner(inner: string): string {
  let text = inner;
  // 発言番号スパンを除去
  text = text.replace(/<span class="page-text__number[\s\S]*?<\/span>/g, "");
  // 生改行を除去 → <br>を改行文字へ → 残りのタグを除去
  text = text
    .replace(/\r?\n/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(text)
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .trim();
}

/** ［質疑・意見］／［答弁］等のラベルから種別を判定する */
function labelKind(label: string): SpeakerType {
  return label.includes("答弁") ? "executive" : "member";
}

/** 先頭記号（◯／△）から種別を判定する。該当しなければnull */
function symbolKind(text: string): SpeakerType | null {
  const head = text.trimStart();
  if (head.startsWith("◯") || head.startsWith("○")) return "member";
  if (head.startsWith("△") || head.startsWith("▲")) return "executive";
  return null;
}

/** 先頭の記号・全角スペースを取り除く */
function stripLeadMark(text: string): string {
  return text.replace(/^[\s　]*[◯○△▲][\s　]*/, "").trim();
}

/**
 * 1つの発言ブロックを1つ以上のセグメントに分解する。
 * seqStart から連番を振り、次に使う seq を返す。
 */
function segmentBlock(
  blockText: string,
  voiceNo: number,
  seqStart: number
): { segments: Segment[]; nextSeq: number } {
  const segments: Segment[] = [];
  let seq = seqStart;
  const push = (speakerType: SpeakerType, text: string) => {
    const t = text.trim();
    if (t.length === 0) return;
    segments.push({ seq, voiceNo, speakerType, text: t });
    seq += 1;
  };

  // 本文中に現れる ［令和８年度］ 等の角括弧を誤って発言区切りと解釈しないよう、
  // 会議録で発言種別に使われる既知のラベルだけを区切りとして扱う。
  const labelRe = /［(質疑・意見|質疑|意見|答弁|要望|質問|討論)］/g;
  const labels = [...blockText.matchAll(labelRe)];

  if (labels.length > 0) {
    // ［質疑・意見］…［答弁］… 形式。各ラベルから次のラベル直前までを1セグメントにする
    const lead = blockText.slice(0, labels[0].index).trim();
    if (lead.length > 0) push("note", lead);
    for (let i = 0; i < labels.length; i++) {
      const m = labels[i];
      const start = (m.index ?? 0) + m[0].length;
      const end = i + 1 < labels.length ? (labels[i + 1].index ?? blockText.length) : blockText.length;
      push(labelKind(m[1]), blockText.slice(start, end));
    }
  } else {
    const kind = symbolKind(blockText);
    if (kind) {
      push(kind, stripLeadMark(blockText));
    } else {
      // 記号もラベルも無いブロック（開会時刻・傍聴・調査事項などの記録）
      push("note", blockText);
    }
  }

  return { segments, nextSeq: seq };
}

/**
 * 発言内容ページ（Template=doc-page）から全発言セグメントを抽出する。
 */
export function parseDocPage(html: string): Segment[] {
  const voiceRe =
    /<div class="page-text__voice" id="VoiceNo(\d+)">([\s\S]*?)<\/div>/g;
  const segments: Segment[] = [];
  let seq = 1;
  for (const m of html.matchAll(voiceRe)) {
    const voiceNo = Number(m[1]);
    const text = cleanVoiceInner(m[2]);
    if (text.length === 0) continue;
    const result = segmentBlock(text, voiceNo, seq);
    segments.push(...result.segments);
    seq = result.nextSeq;
  }
  return segments;
}

/**
 * 文書タイトルから対応する委員会を特定する。
 * 包含関係のある名称に対応するため dbsrName が長い順に照合する。
 */
export function committeeFromTitle(title: string): CommitteeMeta | null {
  const sorted = [...CURRENT_COMMITTEES].sort(
    (a, b) => b.dbsrName.length - a.dbsrName.length
  );
  return sorted.find((c) => title.includes(c.dbsrName)) ?? null;
}

/**
 * 文書の安定した閲覧URLを組み立てる。
 * セッションIDのパス部分は任意の数値でよく、アクセス時に新しいセッションが
 * 発行されて該当文書が表示される。
 */
export function buildSourceUrl(documentId: number): string {
  return `https://www.city.fukuoka.fukuoka.dbsr.jp/index.php/1?Template=doc-one-frame&VoiceType=onehit&DocumentID=${documentId}`;
}

const SEGMENT_LABEL: Record<SpeakerType, string> = {
  member: "［質疑・意見］",
  executive: "［答弁］",
  note: "",
};

/** セグメント一覧から原文全文（プレーンテキスト）を組み立てる */
export function buildRawText(segments: Segment[]): string {
  return segments
    .map((s) => {
      const label = SEGMENT_LABEL[s.speakerType];
      return label ? `${label}\n${s.text}` : s.text;
    })
    .join("\n\n");
}
