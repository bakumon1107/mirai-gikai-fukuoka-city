---
name: update-press-conferences
description: 市長記者会見データの更新手順。YouTubeの文字起こしを基に発表項目・質疑応答を構造化して press_conferences に取り込む際に必ず参照すること。
---

# 記者会見データ更新（press_conferences / items / turns）

市長定例記者会見を「発表項目（announcement）」と「質疑応答（qa）」に構造化してDBに取り込む。

DB接続は `db-access` スキルの規約に従う。

## データソース

**YouTube の文字起こしを一次ソースとする**（公式文字起こしを公開していない自治体への横展開を想定した方針）。

1. **YouTube**: 福岡市公式チャンネルの市長定例会見動画（例: `https://www.youtube.com/watch?v=_l3GaYx3Ouw`）
   - 字幕取得: `yt-dlp --write-auto-subs --sub-langs ja --skip-download -o '<出力パス>' '<URL>'`（VTT形式。タイムスタンプ・重複行を除去してテキスト化する）
2. **市公式の文字起こし**（あれば）: `https://www.city.fukuoka.lg.jp/shisei/mayor/interviews/` 配下（例: `20260623sichoteireikaiken.html`）
   - 自動字幕は固有名詞・数値の誤認識が多いため、**公式文字起こしがある場合は必ず照合して補正する**（人名・事業名・金額・日付が特に重要）

## DBマッピング

3階層構造。既存投入スクリプト `packages/seed/fukuoka/seed-press-conferences.ts` の型定義がそのまま仕様になっている。

### press_conferences
| フィールド | 内容 |
|---|---|
| `slug` | 開催日 `YYYY-MM-DD` |
| `title` | 「令和8年5月 市長定例記者会見」形式 |
| `held_at` | 開催日 |
| `youtube_url` | 動画URL |
| `status` | `published` |

### press_conference_items（会見内の項目）
- `item_type`: `announcement`（市長発表）または `qa`（記者との質疑応答）
- `order_index`: 会見内の登場順
- `title`: 項目タイトル（市民向けに分かりやすく）
- `summary`: announcement は内容の要約を必ず入れる。qa は null 可（turns で表現）

### press_conference_turns（発言単位）
- announcement は turns 空（summary のみ）
- qa は `speaker: "reporter" | "mayor"`、`speaker_name`（不明なら null）、`content`、`order_index` で往復を表現

## 手順

1. 動画URLを確認し、yt-dlp で字幕取得 → テキスト整形
2. 公式文字起こしページがあれば取得し、照合用に保持
3. 会見を項目単位に分割（冒頭のアート紹介・発表案件 → 発表案件への質疑 → その他質疑）
4. announcement の summary、qa の turns を生成。固有名詞・数値は公式文字起こし（なければ市の関連ページ）と照合
5. **ユーザーレビュー（必須）**: 生成内容を提示し確認を取る（CLAUDE.md「AI生成コンテンツのDB更新ルール」。中国語漢字混入・発言者の取り違えに注意）
6. `seed-press-conferences.ts` の `DATA` 配列に追記して実行するか、REST で直接 INSERT
   - スクリプトは同一 slug をスキップするため再実行安全
   - 実行: `cd packages/seed && tsx --env-file=../../.env fukuoka/seed-press-conferences.ts`（本番反映時は `.env.production` を指定）
7. web の記者会見ページで表示確認

## 注意

- 試作実装は `mirai-gikai-press-conference` リポジトリ（安芸高田市ベースのデモ）にある。**本適用先はこのリポジトリ（mirai-gikai-fukuoka-city）**。試作側の変更を誤って fukuoka-city の PR に出さないこと
- 質疑の要約では市長発言のニュアンス（推測・断定の別）を変えない。発言していないことを summary に書かない
