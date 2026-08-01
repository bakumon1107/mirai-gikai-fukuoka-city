/**
 * validate-committee-topics.ts
 *
 * docs/data/committee-minutes/<年>/ai/<DocumentID>.json のうち `topics` を持つものを対象に、
 * トピック分割（seq範囲）の妥当性を機械チェックする。DBには接続しない。
 *
 * チェック内容:
 *  - topicOrder が 1..N の連番
 *  - startSeq <= endSeq
 *  - topicOrder 昇順で範囲が重複せず、すき間なく連続（前議題の endSeq + 1 == 次議題の startSeq）
 *  - すべての非noteセグメントがいずれか1議題の範囲に属する（被覆漏れ・範囲外なし）
 *  - title / summary が空でない
 *  - 簡体字・繁体字の混入なし
 *
 * 使い方:
 *   cd packages/seed
 *   pnpm exec tsx fukuoka/validate-committee-topics.ts
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TARGET_YEAR = 2026;
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(
  __dirname,
  "../../../docs/data/committee-minutes",
  String(TARGET_YEAR)
);
const AI_DIR = join(DATA_DIR, "ai");

// 日本語の漢字と字形が異なる中国漢字（AI生成で稀に混入する）
const CN_CHARS = /[议务该们过关问运达邮车轮辆动员单]/;

type Topic = {
  topicOrder: number;
  title: string;
  summary: string;
  startSeq: number;
  endSeq: number;
};
type Patch = { documentId: number; topics?: Topic[] };
type Segment = { seq: number; speakerType: string };

function loadSourceSegments(documentId: number): Segment[] {
  const files = readdirSync(DATA_DIR).filter(
    (f) => f.endsWith(`_${documentId}.json`)
  );
  if (files.length !== 1) {
    throw new Error(
      `ソース文書が一意に定まりません (DocumentID=${documentId}): ${files.length}件`
    );
  }
  const src = JSON.parse(readFileSync(join(DATA_DIR, files[0]), "utf-8"));
  return (src.speeches ?? src.segments) as Segment[];
}

function validate(patch: Patch): string[] {
  const errors: string[] = [];
  const topics = [...(patch.topics ?? [])].sort(
    (a, b) => a.topicOrder - b.topicOrder
  );
  if (topics.length === 0) return errors;

  // topicOrder 連番
  topics.forEach((t, i) => {
    if (t.topicOrder !== i + 1) {
      errors.push(`topicOrderが連番でない: index=${i} order=${t.topicOrder}`);
    }
    if (!t.title || !t.title.trim()) errors.push(`titleが空: order=${t.topicOrder}`);
    if (!t.summary || !t.summary.trim())
      errors.push(`summaryが空: order=${t.topicOrder}`);
    if (t.startSeq > t.endSeq)
      errors.push(
        `startSeq>endSeq: order=${t.topicOrder} (${t.startSeq}>${t.endSeq})`
      );
    if (CN_CHARS.test(t.title) || CN_CHARS.test(t.summary))
      errors.push(`簡体字混入の可能性: order=${t.topicOrder}`);
  });

  // 範囲の重複・連続
  for (let i = 1; i < topics.length; i++) {
    const prev = topics[i - 1];
    const cur = topics[i];
    if (cur.startSeq <= prev.endSeq)
      errors.push(
        `範囲が重複: order=${prev.topicOrder}(〜${prev.endSeq}) と order=${cur.topicOrder}(${cur.startSeq}〜)`
      );
    else if (cur.startSeq !== prev.endSeq + 1)
      errors.push(
        `範囲にすき間: order=${prev.topicOrder}(〜${prev.endSeq}) → order=${cur.topicOrder}(${cur.startSeq}〜)`
      );
  }

  // 非noteセグメントの被覆
  const segs = loadSourceSegments(patch.documentId);
  const nonNote = segs.filter((s) => s.speakerType !== "note").map((s) => s.seq);
  const first = topics[0].startSeq;
  const last = topics[topics.length - 1].endSeq;
  const uncovered = nonNote.filter((seq) => seq < first || seq > last);
  if (uncovered.length > 0)
    errors.push(`被覆されない非noteセグメント: ${uncovered.join(",")}`);

  // 先頭議題より前は note のみであること
  const leadingNonNote = segs
    .filter((s) => s.speakerType !== "note" && s.seq < first)
    .map((s) => s.seq);
  if (leadingNonNote.length > 0)
    errors.push(`先頭議題より前に非noteあり: ${leadingNonNote.join(",")}`);

  return errors;
}

function main(): void {
  const files = readdirSync(AI_DIR).filter((f) => f.endsWith(".json"));
  let withTopics = 0;
  let ng = 0;
  for (const file of files) {
    const patch: Patch = JSON.parse(readFileSync(join(AI_DIR, file), "utf-8"));
    if (!patch.topics) continue;
    withTopics++;
    const errors = validate(patch);
    if (errors.length > 0) {
      ng++;
      console.log(`NG ${patch.documentId} (議題${patch.topics.length}件)`);
      for (const e of errors) console.log(`   - ${e}`);
    } else {
      console.log(`OK ${patch.documentId} (議題${patch.topics.length}件)`);
    }
  }
  console.log(
    ng === 0
      ? `=== 全${withTopics}文書OK ===`
      : `=== ${ng}/${withTopics}文書で問題あり ===`
  );
  if (ng > 0) process.exit(1);
}

main();
