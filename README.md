# みらい議会 地方議会版 ベーステンプレート

チームみらいが開発・公開している [みらい議会](https://github.com/team-mirai/mirai-gikai)（国会版）を、
**地方議会向けに汎用化したベーステンプレート**です。市議会・県議会・町村議会のいずれにも
fork できるよう、地域固有の情報を設定ファイルに集約しています。

このブランチ自体は稼働サービスではありません。実際のサービスを立ち上げる場合は、
このテンプレートを fork して自地域向けに設定してください。

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

# セットアップ

```bash
# Supabaseの起動
npx supabase start

# 環境変数の設定（必要に応じて.envの内容を変更してください）
cp .env.example .env

# パッケージインストール
pnpm install

# SupabaseのDB初期化, 開発用シードデータのセットアップ
pnpm db:reset

# サーバー起動
pnpm dev
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
