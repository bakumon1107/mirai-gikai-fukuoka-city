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

### ブランチ構成

```
kawasaki/develop      ← 上流（チームみらい川崎版）取り込み用
fukuoka-city/develop  ← 福岡市版メインブランチ ★ PRのターゲットはここ
```

**PR は必ず `fukuoka-city/develop` へ。** `kawasaki/develop` への PR は出さないでください。

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

```bash
# 1. このリポジトリを Fork する（GitHub の「Fork」ボタン）

# 2. Fork したリポジトリをクローン
git clone https://github.com/<your-name>/mirai-gikai-fukuoka-city.git
cd mirai-gikai-fukuoka-city

# 3. 上流リポジトリを upstream として登録
git remote add upstream https://github.com/bakumon1107/mirai-gikai-fukuoka-city.git

# 4. フィーチャーブランチを作成
git checkout -b fukuoka-city/feature/your-feature-name

# 5. 実装後、PR前に品質チェック（必須）
pnpm lint && pnpm typecheck && pnpm test

# 6. Fork 先に push して PR を作成
git push origin fukuoka-city/feature/your-feature-name
# GitHub 上で PR を作成 → base: bakumon1107/mirai-gikai-fukuoka-city, base branch: fukuoka-city/develop
```

PR がマージされると、GitHub の Contributors リストに自動で名前が掲載されます。

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

