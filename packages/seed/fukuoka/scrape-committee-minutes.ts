/**
 * scrape-committee-minutes.ts（福岡市版）
 *
 * 福岡市議会 会議録検索システム（dbsr.jp）から委員会の議事録を取得し、
 * docs/data/committee-minutes/<年>/ にJSONで保存する。
 *
 * 実行例:
 *   cd packages/seed
 *   pnpm exec tsx fukuoka/scrape-committee-minutes.ts            # 2026年分を取得
 *   pnpm exec tsx fukuoka/scrape-committee-minutes.ts --year 2026
 *
 * 特徴:
 * - セッションはトップページ取得時に発行されるcookie＋URLパスのIDで維持する
 * - リクエスト間にウェイトを入れる（福岡市サイトはレート制限が強い）
 * - 一覧は新しい順で返るため、対象年より古い開催日が現れたらページ送りを打ち切る
 * - タイトルから委員会を特定し、対象年・対象委員会のみを保存する
 * - 取得済みのDocumentIDはスキップするため再実行しても差分のみ取得する
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRawText,
  buildSourceUrl,
  committeeFromTitle,
  extractHitCount,
  extractSessionId,
  type ListedDoc,
  parseDocPage,
  parseListPage,
  type Segment,
} from "./parse-committee-minutes";

const BASE_URL = "https://www.city.fukuoka.fukuoka.dbsr.jp";
const WAIT_MS = 5000;
/** 429/503・タイムアウト時のリトライ待ち時間（秒） */
const RETRY_DELAYS_SEC = [30, 60, 120, 180, 240];
const REQUEST_TIMEOUT_MS = 30_000;
/** 委員会カテゴリの Cabinet[] 値（1・2は本会議のため除外） */
const COMMITTEE_CABINET_IDS = Array.from({ length: 32 }, (_, i) => i + 3);

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");

/** 保存するJSONのシェイプ */
type MeetingJson = {
  documentId: number;
  title: string;
  committee: {
    dbsrName: string;
    currentName: string;
    slug: string;
    type: string;
  };
  meetingDate: string;
  sourceUrl: string;
  scrapedAt: string;
  segmentCount: number;
  speeches: Segment[];
  rawText: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** cookieを維持しつつウェイトを挟んでHTMLを取得する簡易クライアント */
class DbsrClient {
  private cookie = "";
  private sessionId = "";

  private async request(url: string, body?: URLSearchParams): Promise<string> {
    for (let attempt = 0; ; attempt++) {
      await sleep(WAIT_MS);
      let res: Response;
      try {
        res = await fetch(url, {
          method: body ? "POST" : "GET",
          headers: {
            ...(this.cookie ? { Cookie: this.cookie } : {}),
            ...(body
              ? { "Content-Type": "application/x-www-form-urlencoded" }
              : {}),
            "User-Agent":
              "mirai-gikai-fukuoka-city scraper (contact: GitHub bakumon1107)",
          },
          body,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
      } catch (e) {
        // タイムアウト・一時的な接続断はリトライする
        if (attempt < RETRY_DELAYS_SEC.length) {
          const waitSec = RETRY_DELAYS_SEC[attempt];
          console.warn(
            `リクエスト失敗（${e instanceof Error ? e.name : e}）。${waitSec}秒待って再試行します（${attempt + 1}/${RETRY_DELAYS_SEC.length}）`
          );
          await sleep(waitSec * 1000);
          continue;
        }
        throw e;
      }

      // 一時的なレート制限はRetry-After（なければ既定値）だけ待って再試行する
      if (
        (res.status === 429 || res.status === 503) &&
        attempt < RETRY_DELAYS_SEC.length
      ) {
        const retryAfter = Number(res.headers.get("retry-after"));
        const waitSec =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter
            : RETRY_DELAYS_SEC[attempt];
        console.warn(
          `HTTP ${res.status} を受信。${waitSec}秒待って再試行します（${attempt + 1}/${RETRY_DELAYS_SEC.length}）`
        );
        await sleep(waitSec * 1000);
        continue;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        this.cookie = setCookie.split(";")[0];
      }
      return res.text();
    }
  }

  /** トップページにアクセスしてセッションを開始する */
  async init(): Promise<void> {
    const html = await this.request(`${BASE_URL}/index.php/`);
    const sid = extractSessionId(html);
    if (!sid) {
      throw new Error("セッションIDを取得できませんでした");
    }
    this.sessionId = sid;
  }

  private sessionUrl(query = ""): string {
    return `${BASE_URL}/index.php/${this.sessionId}${query}`;
  }

  /**
   * 委員会カテゴリ×本文で検索し、一覧の先頭ページを取得する。
   * 福岡市サイトは検索条件が一覧の並びには反映されない（新しい順で全件返る）ため、
   * ページ送りと開催日・タイトルによる絞り込みは呼び出し側で行う。
   */
  async applySearchFilter(): Promise<string> {
    const params = new URLSearchParams();
    for (const id of COMMITTEE_CABINET_IDS) {
      params.append("Cabinet[]", String(id));
    }
    params.append("Class[]", "3"); // 本文
    params.set("QueryType", "Modify");
    params.set("Template", "list");
    return this.request(this.sessionUrl("?Template=list"), params);
  }

  async fetchListPage(page: number): Promise<string> {
    return this.request(this.sessionUrl(`?Template=list&Page=${page}`));
  }

  /** 文書をセッションにセットし、全発言のHTMLを取得する */
  async fetchDocument(documentId: number): Promise<string> {
    const frameHtml = await this.request(
      this.sessionUrl(
        `?Template=doc-all-frame&VoiceType=all&DocumentID=${documentId}`
      )
    );
    const sid = extractSessionId(frameHtml);
    if (sid) {
      this.sessionId = sid;
    }
    return this.request(this.sessionUrl("?Template=doc-page"));
  }
}

/** 取得済みDocumentIDの一覧（ファイル名末尾の _<id>.json から復元） */
function loadScrapedIds(outDir: string): Set<number> {
  if (!existsSync(outDir)) return new Set();
  const ids = new Set<number>();
  for (const name of readdirSync(outDir)) {
    const m = name.match(/_(\d+)\.json$/);
    if (m) ids.add(Number(m[1]));
  }
  return ids;
}

async function main(): Promise<void> {
  const yearArgIndex = process.argv.indexOf("--year");
  const year =
    yearArgIndex >= 0 ? Number(process.argv[yearArgIndex + 1]) : 2026;
  if (!Number.isInteger(year) || year < 1995) {
    throw new Error(`不正な年指定です: ${process.argv[yearArgIndex + 1]}`);
  }

  const outDir = join(REPO_ROOT, "docs/data/committee-minutes", String(year));
  mkdirSync(outDir, { recursive: true });
  const scrapedIds = loadScrapedIds(outDir);

  const client = new DbsrClient();
  await client.init();
  console.log("セッション開始");

  const firstPage = await client.applySearchFilter();
  console.log(`検索ヒット: ${extractHitCount(firstPage) ?? "不明"}文書`);

  // 一覧は新しい順のため、対象年より古い開催日が現れたらページ送りを打ち切る
  const cutoff = `${year}-01-01`;
  const allDocs: ListedDoc[] = [];
  const MAX_PAGES = 30;
  let { docs, hasNext } = parseListPage(firstPage);
  allDocs.push(...docs);
  let page = 2;
  for (
    ;
    hasNext && !docs.some((d) => d.date < cutoff) && page <= MAX_PAGES;
    page++
  ) {
    const html = await client.fetchListPage(page);
    ({ docs, hasNext } = parseListPage(html));
    allDocs.push(...docs);
    console.log(`一覧ページ${page}を取得（累計${allDocs.length}文書）`);
  }
  // 上限ページで打ち切った場合、対象年の取りこぼしがあり得るため警告する
  if (page > MAX_PAGES && hasNext && !docs.some((d) => d.date < cutoff)) {
    console.warn(
      `警告: ページ上限(${MAX_PAGES})に達しましたが、まだ${year}年より新しい結果が続いている可能性があります。取りこぼしの恐れがあるため MAX_PAGES を見直してください。`
    );
  }
  // ページ送りで同じ文書が重複して返ることがあるためDocumentIDで一意化する
  const uniqueDocs = [
    ...new Map(allDocs.map((d) => [d.documentId, d])).values(),
  ];
  console.log(
    `一覧収集: ${uniqueDocs.length}文書（重複除去前${allDocs.length}）`
  );

  let saved = 0;
  let skipped = 0;
  for (const doc of uniqueDocs) {
    if (!doc.date.startsWith(`${year}-`)) continue;
    const committee = committeeFromTitle(doc.title);
    if (!committee) {
      // 本会議（定例会・臨時会）や対象外の会議はスキップ
      continue;
    }
    if (scrapedIds.has(doc.documentId)) {
      skipped++;
      continue;
    }

    const pageHtml = await client.fetchDocument(doc.documentId);
    const speeches = parseDocPage(pageHtml);
    if (speeches.length === 0) {
      console.warn(
        `発言が取得できませんでした: ${doc.title} (DocumentID=${doc.documentId})`
      );
      continue;
    }

    const json: MeetingJson = {
      documentId: doc.documentId,
      title: doc.title,
      committee: {
        dbsrName: committee.dbsrName,
        currentName: committee.currentName,
        slug: committee.slug,
        type: committee.type,
      },
      meetingDate: doc.date,
      sourceUrl: buildSourceUrl(doc.documentId),
      scrapedAt: new Date().toISOString(),
      segmentCount: speeches.length,
      speeches,
      rawText: buildRawText(speeches),
    };

    const fileName = `${doc.date}_${committee.slug}_${doc.documentId}.json`;
    writeFileSync(join(outDir, fileName), `${JSON.stringify(json, null, 2)}\n`);
    saved++;
    console.log(`保存: ${fileName}（${speeches.length}セグメント）`);
  }

  console.log(
    `完了: 新規${saved}件 / スキップ（取得済み）${skipped}件 / 一覧${uniqueDocs.length}文書`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
