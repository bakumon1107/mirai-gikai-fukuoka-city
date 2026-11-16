# みらい議会 地方議会版 ベーステンプレート

チームみらいが開発・公開している [みらい議会](https://github.com/team-mirai/mirai-gikai)（国会版）を、
**地方議会向けに汎用化したベーステンプレート**です。市議会・県議会・町村議会のいずれにも
fork できるよう、地域固有の情報を設定ファイルに集約しています。

このブランチ自体は稼働サービスではありません。実際のサービスを立ち上げる場合は、
このテンプレートを fork して自地域向けに設定してください。

## はじめての方へ

Git や GitHub に慣れていなくても始められるように、2つの進め方を用意しています。

### A. AI エージェントに任せる（おすすめ）

Claude Code・Codex CLI・Gemini CLI などの AI コーディングエージェントを使える場合は、
**空のフォルダでエージェントを起動し、`○○市` を自分の地域に書き換えて貼り付けてください。**

```
○○市のみらい議会を作りたいです。
次の指示書に従って、開発環境の用意から始めてください。
https://github.com/bakumon1107/mirai-gikai-fukuoka-city/blob/base-local/develop/docs/20261116_1900_ai-setup-guide.md
```

依頼はこの1回だけです。エージェントが、必要なツールの確認 → GitHub へのログイン → fork →
手元へのコピー → 初期設定 → （希望すれば）アプリの起動 → **その地域の議会サイトの調査**まで、
確認を取りながら続けて進めます。
パスワード入力など本人にしかできない操作だけ、案内に従って自分で行ってください。

ツールが入っている、fork 済み、といった**途中まで用意できている人も同じ文面で使えます。**
エージェントが最初に現状を調べ、済んでいる手順は飛ばして足りない分だけ補います。

2回目以降は、手元にコピーしたフォルダ（`mirai-gikai-<地域>`）でエージェントを起動すれば、
作業ルールが自動で読み込まれます。

指示書（[docs/20261116_1900_ai-setup-guide.md](docs/20261116_1900_ai-setup-guide.md)）は
人間が読んで手作業で進めることもできます。

### B. 自分で進める

必要なものは次のとおりです。

| 必要なもの | 入手先・確認方法 |
|---|---|
| GitHub アカウント | https://github.com/signup |
| Git | `git --version` |
| Node.js 24 | `node --version`（[nvm](https://github.com/nvm-sh/nvm) 等で入れると切り替えが楽） |
| pnpm | `npm install -g pnpm` |
| GitHub CLI | https://cli.github.com/ 。入れたら `gh auth login` でログイン |
| Docker | Docker Desktop 等（手元でアプリを動かす場合のみ） |

Windows の場合は WSL2（Ubuntu）の中で作業してください（PowerShell で `wsl --install`）。

そろったら、下の「[リポジトリを用意する](#リポジトリを用意する)」から順に進めます。

## fork するときに必ず読むもの

0. **その自治体で何が作れるか調べる** — 議会サイトの公開範囲は自治体ごとにまったく違います。
   `/council-survey <自治体名>` スキルで調査してから着手してください
   （[判定軸とテンプレート](.claude/skills/council-survey/SKILL.md)）。
1. **[FORK_GUIDELINES.md](FORK_GUIDELINES.md)** — 本家リポジトリが定める fork ガイドライン。
   AGPL-3.0 第7条に基づく追加条件であり、**遵守は任意ではありません**。
   原本は [team-mirai/mirai-gikai](https://github.com/team-mirai/mirai-gikai/blob/develop/FORK_GUIDELINES.md) にあります。
2. **[別地域向け fork 手順](docs/20260304_1000_別地域向けfork手順.md)** — 実際の変更手順。

### 最低限やること

| 項目 | 変更場所 | 根拠 |
|---|---|---|
| **自地域のブランチへ切り替える** | `<地域>/develop` を作成し、GitHub のデフォルトブランチと `.github/`・`AGENTS.md`・`.claude/` の参照を変更 | fork手順 セクション4 |
| サービス名を「みらい議会＠地域名」形式にする | `web/src/config/site.config.ts` の `siteName` | FORK_GUIDELINES 1 |
| ロゴ・アイコンを独自のものに差し替える | `web/public/img/logo.svg`、`web/public/icons/pwa/` | FORK_GUIDELINES 2 |
| OGP画像・ヒーロー画像を差し替える | `web/public/ogp.jpg`、`web/public/img/hero_background.png` | FORK_GUIDELINES 3 |
| カラーテーマを独自の配色に変える | `web/src/app/globals.css`、`web/src/config/brand.ts` | FORK_GUIDELINES 4 |
| 免責文言を表示する | `features.showTeamMiraiSection` を `false` に（既定） | FORK_GUIDELINES 5 |
| **自分のリポジトリURLを設定する** | `web/src/config/site.config.ts` の `sourceCodeUrl` | FORK_GUIDELINES 6 / AGPL §13 |
| 運営者情報・立場の開示を書く | `web/src/config/site.config.ts` の `operator` | — |

> [!IMPORTANT]
> `sourceCodeUrl` は **稼働中のバージョンのソースコードが置かれた公開リポジトリ** を指す必要があります。
> 本家リポジトリの URL では代用できません（AGPL-3.0 第13条）。空のままだとフッターにリンクが出ず、
> ライセンス違反の状態になります。

本テンプレートに同梱されているロゴ・配色はニュートラルなプレースホルダーです。
そのまま公開せず、必ず独自のものに差し替えてください。

---

# リポジトリを用意する

> [!IMPORTANT]
> **`git clone` ではなく、GitHub 上で fork してください。**
> このテンプレートは本家 [team-mirai/mirai-gikai](https://github.com/team-mirai/mirai-gikai) の
> fork ネットワークに属しています。fork すればその繋がりが保たれ、本家の更新の取り込みや
> 本家への改善の還元ができます。clone して別リポジトリに push すると繋がりが切れ、
> **後から張り直すことはできません**（GitHub の仕様）。

先に「[はじめての方へ](#はじめての方へ)」の必要なものをそろえ、`gh auth login` で GitHub にログインしておいてください。

1. このリポジトリのページで **Fork** を押す。
2. **`Copy the default branch only` のチェックを外す。**
   配布元リポジトリの既定ブランチは `base-local/develop` ではないため、チェックを外さないと
   **テンプレートのブランチが fork に含まれません**。
   なおこの操作で配布元の全ブランチ（福岡市版の作業ブランチ等）もコピーされます。
   不要なものは調査で着手が決まってから削除します（手順6）。
3. リポジトリ名を `mirai-gikai-<地域>` に変更して fork を作成する。
4. 自分の fork を clone し、テンプレートのブランチへ移る。

   ```bash
   git clone https://github.com/<あなたのアカウント>/mirai-gikai-<地域>.git
   cd mirai-gikai-<地域>
   git switch base-local/develop
   ```

   `gh` CLI を使う場合は、1〜3 を次の1行で済ませられます
   （`gh repo fork` は既定で全ブランチをコピーします。`--default-branch-only` は付けないこと）。

   ```bash
   gh repo fork bakumon1107/mirai-gikai-fukuoka-city --fork-name mirai-gikai-<地域> --clone=false
   ```

5. **fork 直後の GitHub 設定をする。** fork は配布元の設定を引き継がず、
   一部の機能が無効の状態で作られます。

   ```bash
   # gh の既定リポジトリを自分の fork にする。
   # これをしないと gh pr create / gh pr view / gh issue が本家 team-mirai を向く
   gh repo set-default <あなたのアカウント>/mirai-gikai-<地域>
   gh repo set-default --view    # 自分の fork が表示されれば OK

   # fork では Issues が既定で無効になっている
   gh repo edit <あなたのアカウント>/mirai-gikai-<地域> --enable-issues

   # テンプレート配布元を remote として登録する（あとから更新を取り込むため。fork手順 4-6）
   git remote add template https://github.com/bakumon1107/mirai-gikai-fukuoka-city.git
   git fetch template base-local/develop
   ```

   **GitHub Actions も fork では止まっています。** fork のページの **Actions** タブを開き、
   `I understand my workflows, go ahead and enable them` を押して有効にしてください
   （押さないと CI が一切動かず、PR のチェックが付きません）。

6. **AI コーディングエージェントを起動し、「○○市のみらい議会を作りたい」と伝える。**
   Claude Code・Codex CLI・Gemini CLI など、`AGENTS.md`（`CLAUDE.md`・`GEMINI.md` は同じ内容への
   シンボリックリンク）を読むエージェントなら同じ流れで動きます。
   まず `council-survey` の手順（[.claude/skills/council-survey/SKILL.md](.claude/skills/council-survey/SKILL.md)）で
   その自治体の議会サイトが調査され、何が作れるかが判定されます。
   着手が決まると、続けて次の GitHub 準備を進めます
   （[fork手順 セクション4](docs/20260304_1000_別地域向けfork手順.md#4-自地域のブランチへ切り替える)）。

   - `<地域>/develop` を `base-local/develop` から作り、GitHub の既定ブランチにする
   - **配布元から引き継いだ不要なブランチを削除する**
     （手順2で `fukuoka-city/*`・`kawasaki/develop` 等もコピーされているため。
     残すのは `<地域>/develop` と `base-local/develop` の2本）
   - ワークフロー・`AGENTS.md`・`.claude/`・`CODEOWNERS` の参照を自地域向けに置き換える

   ブランチの削除は元に戻せないため、削除するブランチの一覧を確認してから実行します。

> [!WARNING]
> fork ネットワークの中にいるため、GitHub 上で Pull Request を作ると
> **base が本家 `team-mirai/mirai-gikai` に初期設定されます。**
> 自分の fork 内で PR を出すときは、base リポジトリが自分のものになっているか毎回確認してください。

> [!NOTE]
> **既に `mirai-gikai` 系のリポジトリを fork 済みの場合**、GitHub は1アカウントにつき
> 同じネットワークの fork を1つしか作らせないため、この fork は作れません。
> その場合は fork せず、既存の fork にこのリポジトリを remote として足してください
> （繋がりは既存の fork が持っているので維持されます）。
>
> ```bash
> git remote add template https://github.com/bakumon1107/mirai-gikai-fukuoka-city.git
> git fetch template base-local/develop
> git switch -c base-local/develop template/base-local/develop
> ```

---

# セットアップ

リポジトリの用意は上の「[リポジトリを用意する](#リポジトリを用意する)」を済ませてください。
以降は clone した自分の fork のディレクトリで実行します。

前提: Docker（Windows は WSL2 + Docker Desktop）、Node.js 24、pnpm、GitHub CLI（`gh`）

```bash
cd mirai-gikai-<地域>

# パッケージインストール
pnpm install --frozen-lockfile

# 環境変数の設定（ローカル開発ならほぼそのままで動きます）
cp .env.example .env

# Supabaseの起動（初回は Docker イメージの取得で数分かかります）
npx supabase start

# SupabaseのDB初期化, 型生成, 開発用シードデータのセットアップ
pnpm db:reset

# サーバー起動
pnpm dev
```

| サービス | URL |
|---|---|
| Web（公開サイト） | http://localhost:3002 |
| Admin（管理画面） | http://localhost:3001 |
| Supabase Studio | http://127.0.0.1:54423 |

ポートは `.env` の `WEB_PORT` / `ADMIN_PORT` で変えられます。

PR を出す前に、CI と同じ検証を手元で通してください。

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## マイグレーション

```bash
# マイグレーションファイル生成
npx supabase migration new マイグレーション名

# マイグレーション実行 & 型ファイル更新
pnpm db:migrate
```

## Adminユーザーの作成

1. Supabase Studio上で Authentication > Add User からユーザーを作成
2. Supabase Studio上で以下のSQLを実行

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"roles": ["admin"]}'::jsonb
WHERE email = '<1で作成したユーザーのemail>';
```

> [!NOTE]
> 開発環境では、seedデータによって、`email: admin@example.com, password: admin123456` のAdminユーザーが作成されます。

## ライセンス

[AGPL-3.0](LICENSE)。fork 版をネットワーク経由で提供する場合は、改変後のソースコードを
利用者が入手できる状態にする義務があります（第13条）。詳細は [FORK_GUIDELINES.md](FORK_GUIDELINES.md) を参照してください。
