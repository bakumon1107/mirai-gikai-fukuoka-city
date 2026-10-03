---
name: db-access
description: 本番DB・ローカルDB接続の規約。DBデータを参照・更新する際に必ず確認すること。
---

# DB接続規約

> **このファイルは fork 先で埋めるテンプレートです。**
> 自分の環境の接続先と運用方針に書き換えてから使ってください。
> 本番の Supabase プロジェクト URL やプロジェクト ID をこのファイルに直接書かないこと
> （認証情報ではないが、リポジトリを公開する以上は不要な露出を避ける）。

## このプロジェクトの接続先

| 環境 | 用途 | 接続先 | 認証情報の在り処 |
|---|---|---|---|
| ローカル | 開発・テスト | `http://127.0.0.1:54321` | `.env` |
| 本番 | 公開サイト | （fork 先で記入） | `.env.production`（`.gitignore` 対象） |

## ローカル Admin をどちらに向けるか

Admin アプリの接続先は読み込む env ファイルで決まる。

```bash
pnpm dev                  # .env → ローカル Supabase
pnpm dev:admin:prod-db    # .env.production → 本番 Supabase
```

> [!WARNING]
> `dev:admin:prod-db` は**ローカルの Admin から本番 DB を直接更新する**。
> 運用初期はこの形を取ることがあるが、以下を理解したうえで使うこと。
>
> - 操作ミスがそのまま本番に反映される。取り消しは手作業になる
> - 複数人で作業する場合、同時更新の衝突に気づけない
> - 恒常的に使う運用なら、staging 環境を用意するか Admin を本番にデプロイするほうがよい
>
> 通常の開発は `pnpm dev`（ローカル DB）で行い、本番更新が必要なときだけ切り替える。

## DBを操作する際のルール

- どちらの環境に対する操作かを**実行前に必ず確認する**
- 本番に対する更新は、更新内容をユーザーに提示して承認を得てから実行する
- REST API でアクセスする場合は、対象環境の `SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を使う
- 環境変数は env ファイルから読み込む。コマンドにキーを直接書かない

## 接続例

```bash
# env ファイルを読み込んでから実行する（キーをコマンドに直接書かない）
set -a && . ./.env && set +a

# council_sessions 一覧取得
curl -s "$SUPABASE_URL/rest/v1/council_sessions?select=*" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

## スキーマ変更

`npx supabase db push` の挙動は、本番プロジェクトの移行履歴の状態に依存する。
履歴が空のプロジェクトに対して実行すると意図しない差分が出ることがあるため、
本番へのスキーマ変更の手順は fork 先で確立し、ここに追記すること。
