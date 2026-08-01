---
name: committee-minutes-ai
description: 福岡市議会の委員会議事録の「わかりやすい表現」「会議の要約」をAI生成してDBに反映する。委員会アーカイブ（/committees）のコンテンツ作成を依頼されたら使用。
---

# 委員会議事録のわかりやすい表現・要約生成スキル（福岡市版）

委員会議事録アーカイブ（`/committees` ページ群）の市民向けコンテンツを生成し、DBに反映する手順。

## 前提: 福岡市の議事録の特徴

福岡市の委員会議事録は**発言者名が無い匿名・要約Q&A形式**。スクレイパーが各発言を次のセグメントに正規化している：

- `speakerType: "member"` … 委員の質疑・意見（元は ［質疑・意見］ または ◯）
- `speakerType: "executive"` … 執行部の答弁（元は ［答弁］ または △）
- `speakerType: "note"` … 開会時刻・傍聴・調査事項などの記録・進行
- 各セグメントは `seq`（会議内の連番）で一意

## 全体像

```
docs/data/committee-minutes/<年>/<開催日>_<スラッグ>_<DocumentID>.json  ← スクレイパー出力（原文）
        ↓ ①このスキルでAI生成（要約・simpleText・トピック分割）
docs/data/committee-minutes/<年>/ai/<DocumentID>.json                 ← パッチファイル
        ↓ ②ユーザー確認（必須！）
        ↓ ③適用スクリプト（ローカル → 承認後に本番）
committee_meetings.summary / speeches[].simpleText / committee_meeting_topics
```

- 生成済み・未生成の確認: `ls docs/data/committee-minutes/2026/ai/` と元データの差分を見る
- 会議の規模は元JSONの `segmentCount` で分かる。**200セグメント超の分科会は1会議ずつ**処理する

## ① パッチファイルの生成

元JSON（`speeches` 配列）を読み、以下の形式で `ai/<DocumentID>.json` を作る：

```json
{
  "documentId": 3521,
  "meetingSummary": "会議全体の要約（2〜3文）",
  "topics": [
    { "topicOrder": 1, "title": "議題名", "summary": "議題の要約1〜2文", "startSeq": 2, "endSeq": 21 }
  ],
  "speechSimpleTexts": [{ "seq": 1, "simpleText": "わかりやすい表現の本文" }]
}
```

- `speechSimpleTexts` は `speakerType` が `member`／`executive` の**全セグメント**に付ける（`note` は対象外）。`seq` で対応させる。**`topics` だけ生成して simpleText は省略してもよい**（省略時は要約・トピックのみ反映され speeches は変更されない）
- 予算分科会は「◯◯局の予算」を局ごとに質疑するため、`meetingSummary` は「どの局の何が議論され、どんな質問・答弁があったか」を優先

### トピック分割（`topics`）のルール

福岡県版のように、委員会の議論をトピック（議題）に分けて表示する。市の議事録には委員長の議題宣言が無いため、**境界（seq範囲）もAIが判定**する。

1. `startSeq`/`endSeq` は `CommitteeSpeech.seq`（会議内の発言連番）。`committee_meeting_topics.start_voice_no/end_voice_no` にそのまま格納するが、**中身は voiceNo ではなく seq**（列名は歴史的経緯。表示側 `build-transcript-sections.ts` も `seq` で範囲判定する）
2. トピックは**連続（contiguous）**にする: `topicOrder` は1..Nの連番、`cur.startSeq === prev.endSeq + 1`（重複・隙間なし）、全ての非noteセグメントをいずれかのトピックが被覆する
3. 会議途中の `note`（調査事項の区切り等）は、**次のトピックの `startSeq` に含める**ことで連続性を保つ。先頭の開会noteはどのトピックにも属さなくてよい（先頭nullセクション扱い）
4. 手続きのみで質疑が無い会議（noteのみ・審議なし）は `topics: []` とし、`meetingSummary` に手続き内容を1文で書く
5. トピックの粒度: 質問者ブロックや話題の切り替わりで区切る。詳細ページは全トピックを載せるが、一覧「最近の委員会」カードは**やりとりが多い順の上位5件**だけ箇条書き表示される（`pick-major-topics.ts`）ので、主要トピックが埋もれない粒度にする

### 生成後の検証（DB反映の前に必須）

```bash
cd packages/seed && pnpm exec tsx fukuoka/validate-committee-topics.ts
```

`ai/*.json` 全件のトピックを検証（連番・連続性・非note被覆・先頭非note・空title/summary・簡体字混入）。**全件OKになってからDB反映**する。

### 文体ルール（最重要）

1. **政治に詳しくない中学生でも伝わる**表現。専門用語には短い説明を添える
2. です・ます調で統一。質疑・意見（委員）と答弁（市の担当者）の立場を保つ
3. **数値は必ず原文と照合**する。漢数字・全角数字は算用数字に直す（六百四十万円→640万円）
4. 中国語簡体字・繁体字（议・务・该 等）を混入させない
5. 要約は「何が問われ、市がどう答えたか」を優先。結論を先に

## ② ユーザー確認（スキップ禁止）

CLAUDE.md「AI生成コンテンツのDB更新ルール」に従い、**DB反映前に必ず生成内容を提示して承認を得る**。提示時は自己レビュー（日本語の自然さ・数値の整合・文字コード）の結果も添える。全文が長い場合は、会議全体要約＋simpleTextの代表例を示し、パッチファイルのパスを案内する。

## ③ DB反映（ローカル）

```bash
cd packages/seed
pnpm exec tsx --env-file=../../.env fukuoka/apply-committee-ai-content.ts
```

- `ai/` ディレクトリの**全ファイル**を毎回処理する（再実行は冪等・上書き）
- `topics` はメンバーごとに全削除→再挿入で置き換える（冪等）

## ④ 検証（ローカル画面）

```bash
# ルート .env を読ませて起動（web単体なら dotenv 経由が必要）
cd /path/to/worktree && pnpm exec dotenv -e .env -- pnpm --filter web dev  # port 3002
```

- `/committees` … 「最近の委員会」カードに主要トピック（上位5件）が箇条書き表示されるか
- `/committees/<slug>/<DocumentID>` … 全体要約＋全トピック（質疑・意見n件／答弁n件のバッジ）が出るか
- `/committees/<slug>/<DocumentID>/transcript` … 冒頭に「議題の目次」、`#topic-N` アンカー。デフォルト（わかりやすい表現）で「準備中」注記が消え simpleText が出るか、「詳しく（原文）」との切替も確認
- トピック0件（手続きのみ）の会議で表示が崩れず「手続きが中心」注記が出るか

## ⑤ 本番反映（承認後・マージ前でも可）

**本番DBマイグレーションの自動パイプラインは無く手動運用**。本番にテーブルが無い場合は、データ投入の前にスキーマ適用が要る。本番URL・認証は `.env.production`（`.gitignore` 対象、リポジトリルート）。worktreeに無ければルートからコピーする。db-access スキルも参照。

```bash
# 0) worktreeに .env.production を用意（無ければ）
cp <メインリポジトリ>/.env.production ./.env.production

# 1) スキーマ適用（テーブルが未作成のときだけ）: Management API で当該マイグSQLのみ実行
#    ※ jq が無い環境が多いので Node で投げる。SUPABASE_ACCESS_TOKEN は .env.production にある。
#    POST https://api.supabase.com/v1/projects/xklzpkqtyeuqgawnzgrs/database/query  body={"query": <SQL>}
#    （本番ref: xklzpkqtyeuqgawnzgrs。成功時 HTTP 201）

# 2) 原文シード（source_document_id で冪等スキップ・publish_status=published で投入）
cd packages/seed && pnpm exec tsx --env-file=../../.env.production fukuoka/seed-committee-meetings.ts

# 3) AI内容（要約・simpleText・トピック）反映
cd packages/seed && pnpm exec tsx --env-file=../../.env.production fukuoka/apply-committee-ai-content.ts
```

- 本番確認（読み取り）は REST + service role key で件数チェック（DDLはREST不可なので Management API）:
  ```bash
  curl -s "$SUPABASE_URL/rest/v1/committee_meetings?select=id" -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" -H "Prefer: count=exact" -H "Range: 0-0" -D - -o /dev/null | grep -i content-range
  ```
- **注意**: 手動でマイグレーションを本番適用した後に将来 `supabase db push` を実行すると、`create table`（`if not exists` 無し）が二重適用エラーになり得る。手動適用したことを記録しておく

## 既知の学び（トピック分割対応時の経緯）

- 本番反映は「マージ後」がデフォルトだが、ユーザー指示で**マージ前に本番登録**することもある（その場合の手順が⑤）。R8全36文書（会議36件・トピック623件）を本番投入した実績あり
- 本番テーブルは PR マージでは作られない（自動マイグレーション無し）。⑤-1の手動DDLが必要
- `gh` の既定リポジトリが upstream(team-mirai) に向くことがある。PR操作は `--repo bakumon1107/mirai-gikai-fukuoka-city` を明示（本家宛は禁止）
- トピックの `start_voice_no/end_voice_no` は **seq を格納**（voiceNo ではない）。回帰テストは seq と voiceNo を別値にして seq 基準を固定する

## 関連ファイル

- スクレイパー: `packages/seed/fukuoka/scrape-committee-minutes.ts`（再取得・翌年分は `--year`）
- パーサ: `packages/seed/fukuoka/parse-committee-minutes.ts`（委員会マスタ `CURRENT_COMMITTEES`・セグメント化）
- 初回シード: `packages/seed/fukuoka/seed-committee-meetings.ts`
- AI反映: `packages/seed/fukuoka/apply-committee-ai-content.ts`
- 表示ロジック: `web/src/features/committee-minutes/`

## 既知の注意点

- データソースは福岡市会議録検索システム（`https://www.city.fukuoka.fukuoka.dbsr.jp`）。**レート制限が強い**ため再スクレイプ時はウェイトを守る
- R8（2026年）の委員会は36文書。予算分科会（教育こども/経済振興/総務財政/生活環境/福祉都市）28件が中心で、特別委・議会運営委が8件
- 特別委員会の中には発言が数件のみの短い記録もある。その場合 `meetingSummary` に手続き内容を1文で書き、`speechSimpleTexts` は該当セグメントのみ
