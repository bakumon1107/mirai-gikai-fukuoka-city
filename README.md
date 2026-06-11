# みらい議会ー福岡市版

公開URL: （デプロイ後に更新）

## 注意事項

- このプロジェクトは「チームみらい」が開発・運営している「みらい議会」をForkして開発したものとなります。
- **非公式**ですので、ここでの不具合や気になる点についての問い合わせは
  党公式ではなく開発担当者にご連絡ください。

## 他地方議会向けForkガイド

- 他の市議会・県議会等のバージョンを作成したい場合は、
  以下のドキュメントを参考にすると早いと思います
  [fork手順](docs/kawasaki/20260304_1000_別地域向けfork手順.md)

---

## コントリビューション

### このリポジトリの構造

このリポジトリはチームみらいが開発する「みらい議会」をベースにした **Fork（派生版）** です。

```
【チームみらい（上流）】
  kawasaki/develop
       ↓ 良い更新があれば取り込む
【このリポジトリ】bakumon1107/mirai-gikai-fukuoka-city
  kawasaki/develop     ← 上流のコピー（コントリビューターは触らない）
  fukuoka-city/develop ← 福岡市版の開発ブランチ ★ PRの送り先はここ
       ↑ PR を送る
【コントリビューター】your-name/mirai-gikai-fukuoka-city（Fork）
  feature/your-feature  ← ブランチ名は自由
```

**`kawasaki/develop` はチームみらいの更新を取り込む専用レーンです。コントリビューターは `fukuoka-city/develop` だけ意識してください。**

### ローカル環境のセットアップ

**前提条件**: Node.js 20+ / pnpm 9+ / Docker

```bash
# 1. クローン
git clone https://github.com/bakumon1107/mirai-gikai-fukuoka-city.git
cd mirai-gikai-fukuoka-city

# 2. 環境変数を設定
cp .env.example .env

# 3. パッケージインストール
pnpm install

# 4. Supabase 起動 + DB 初期化
npx supabase start
pnpm db:reset

# 5. 開発サーバー起動
pnpm dev   # web(:3000) + admin(:3001)
```

開発用 Admin アカウント: `admin@example.com` / `admin123456`

> [!NOTE]
> `pnpm db:reset` でスキーマとサンプルデータが投入されますが、**実際の福岡市議会データ（議案・一般質問・予算・記者会見等）は含まれません**。
> UI やロジックの開発は空データのまま行えますが、実データを使った動作確認が必要な場合はメンテナーにご連絡ください。

### 開発フロー

#### Step 1 — このリポジトリを Fork する

GitHub 右上の「Fork」ボタンで自分のアカウントにコピーを作ります（`your-name/mirai-gikai-fukuoka-city`）。Fork 先があなたの作業場所になります。

#### Step 2 — Fork したリポジトリをクローンしてセットアップ

```bash
git clone https://github.com/<your-name>/mirai-gikai-fukuoka-city.git
cd mirai-gikai-fukuoka-city
cp .env.example .env
pnpm install
npx supabase start && pnpm db:reset
```

#### Step 3 — 作業ブランチを作って実装

```bash
git checkout -b feature/your-feature-name   # ブランチ名は自由
# 実装する
```

#### Step 4 — 品質チェックを通してから push

```bash
pnpm lint && pnpm typecheck && pnpm test  # 全て通ること
git push origin feature/your-feature-name
```

#### Step 5 — PR を作成する

push すると GitHub 上に「Compare & pull request」ボタンが表示されます。
それを押して、送り先を以下のように設定して PR を作成してください。

| 項目 | 値 |
|------|-----|
| base repository | `bakumon1107/mirai-gikai-fukuoka-city` |
| base branch | `fukuoka-city/develop` |

> [!TIP]
> 「Compare & pull request」ボタンを使うと base repository が自動で上記に設定されます。自分の Fork 内で PR を確認してから送ることも可能です。

> PR がマージされると、GitHub の Contributors リストに自動で名前が掲載されます 🎉

### よく使うコマンド

| コマンド | 内容 |
|---------|------|
| `pnpm dev` | web + admin 同時起動 |
| `pnpm test` | 全テスト実行 |
| `pnpm lint` | Biome フォーマット + Lint |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm db:migrate` | マイグレーション実行 + 型ファイル更新 |
| `pnpm db:types:gen` | Supabase 型定義を再生成 |

### プロジェクト構成

```
web/src/
├── app/            # Next.js ルーティング
├── components/     # 共通UIコンポーネント
├── features/       # 機能別モジュール（bills / budget / general-questions / press-conferences 等）
└── lib/            # 共通ユーティリティ

admin/src/          # データ管理・AI生成等の管理画面

packages/
├── supabase/       # Supabase クライアント・型定義
└── seed/           # 初期データ投入スクリプト

supabase/migrations/ # DB マイグレーションファイル
docs/fukuoka/        # 設計ドキュメント
```

### 関連ドキュメント

- [CLAUDE.md](CLAUDE.md) — AI（Claude Code）で開発する場合のルール

---

# みらい議会

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/team-mirai-volunteer/mirai-gikai)
[![codecov](https://codecov.io/gh/team-mirai/mirai-gikai/branch/develop/graph/badge.svg)](https://codecov.io/gh/team-mirai/mirai-gikai)

## セットアップ

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



