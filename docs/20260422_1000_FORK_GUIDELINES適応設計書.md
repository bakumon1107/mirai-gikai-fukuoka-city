# FORK_GUIDELINES 適応設計書 — 福岡市版

作成日: 2026-04-22

## 背景

本家リポジトリに `FORK_GUIDELINES.md` が追加された。
AGPL-3.0 ライセンスのフォーク要件として、ブランディングの差別化・免責表示・ソースコード公開が義務付けられた。
本書は福岡市版への適応内容を定義する。

## 対応要件一覧

| # | 要件 | 必須/推奨 | 対応方針 |
|---|------|----------|---------|
| 1 | サービス名を独自形式にする | 必須 | `site.config.ts` + `manifest.json` 更新 |
| 2 | カラースキームを独自パレットに変更 | 必須 | `globals.css` の primary 色をソフトラベンダーに変更 |
| 3 | ロゴ・ヒーロー画像・PWAアイコンを独自のものに | 必須 | ロゴSVG・ヒーローPNG・PWAアイコンSVGを新規作成 |
| 4 | 免責文言の表示（公式サービスではない旨） | 必須 | フッターに常時表示コンポーネントを追加 |
| 5 | AGPL-3.0：改変後のソースコードへのアクセス手段を提供 | 必須 | フッターにGitHubリポジトリリンクを追加 |

---

## 1. サービス名変更

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| `siteConfig.siteName` | `みらい議会ー福岡市版` | `みらい議会＠福岡市` |
| `manifest.json` name / short_name | 同上 | 同上 |

### 変更ファイル

- `web/src/config/site.config.ts`
- `web/public/manifest.json`

---

## 2. カラースキーム変更（既存ティール系 → ソフトラベンダー）

### 設計コンセプト

現行のティール系から、目に優しい柔らかなラベンダー系パレットに変更する。
安芸高田市版と同一のトークン値を使用し、統一感のある運営を実現する。

### カラーパレット定義

| トークン名 | 現在値 | 変更後 | 用途 |
|-----------|--------|--------|------|
| `--primary` | `#2aa693` | `#a495d6` | ボタン背景、主要インタラクション要素 |
| `--primary-accent` | `#0f8472` | `#7a6cc0` | テキストアクセント、ラベル |
| `--color-mirai-gradient-start` | `#64d8c6` | `#dbd3f9` | グラデーション開始色 |
| `--color-mirai-gradient-end` | `#bcecd3` | `#ede9fd` | グラデーション終了色 |
| `.bg-mirai-light-gradient` インライン色 | `#e2f6f3` / `#eef6e2` | `#f2f0fe` / `#f9f7ff` | 軽グラデーション背景 |
| `manifest.json` theme_color | `#2aa693` | `#a495d6` | PWAテーマカラー |

### 変更ファイル

- `web/src/app/globals.css`（4箇所）
- `web/public/manifest.json`（theme_color）

---

## 3. ロゴ・アイコン・ヒーロー画像変更

### 3-1. ロゴ SVG（`web/public/img/logo.svg`）

現在のロゴはフォーク元のデザインをそのまま使用。
テキストベースの「みらい議会／＠福岡市」SVGに差し替える。

```svg
<!-- 紫アクセントバー + みらい議会 大文字 + ＠福岡市 サブテキスト -->
```

### 3-2. PWAアイコン（`web/public/icons/pwa/icon_fukuoka.svg`）

新規SVGアイコンを作成し `manifest.json` の icons リストを更新。

**デザイン：**
- ラベンダー（`#a495d6`）→ やや青みがかった紫（`#8990c8`）の対角グラデーション
- 「み」の文字（白）を中央に配置

### 3-3. ヒーロー画像（`web/public/img/hero_background.png`）

提供画像（`/home/tajuu/bakumon1107/22828840_l.jpg`）を使用。

**特徴：** 福岡市夜景（ドーム・福岡タワー・水面反射）、横長、全体的に暗めの青系

**加工方針：**
- 横長写真を縦長（402×670）にクロップ：建物群・水面反射が下部に来るよう、ソース画像の下寄り（y軸後半）を中心に使用
- 写真を白と40〜50%ブレンドして淡くする
- グラデーションオーバーレイ：
  - 上部：ラベンダーホワイト（`#f5f2ff`）、高不透明（alpha≈230）でほぼ白に
  - 下部：透明度を下げ（alpha≈60）て夜景が見えるよう
  - 写真の青系夜景色とラベンダーの相性が良く、自然なグラデーションになる
- 縦方向のグラデーション（上→下）でシンプルに接続

---

## 4. 免責文言の追加

`footer.tsx` に `FooterDisclaimer` コンポーネントを追加。`showTeamMiraiSection` に依存せず常時表示。

```tsx
function FooterDisclaimer() {
  return (
    <p className="text-[11px] text-slate-500 text-center mt-1 mb-3">
      このサービスは政党チームみらいが運営しているものではありません
    </p>
  );
}
```

---

## 5. AGPL-3.0 ソースコード公開リンク

`footer.config.ts` の `policyLinks` に GitHub リポジトリリンクを追加。

```ts
{
  label: "ソースコード（GitHub）",
  href: "https://github.com/bakumon1107/mirai-gikai-fukuoka-city",
  external: true,
}
```

---

## 実装ファイル一覧

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `web/src/app/globals.css` | 修正 | primary/gradient 色を紫系に変更（4箇所） |
| `web/public/manifest.json` | 修正 | name/short_name・theme_color 更新 |
| `web/src/config/site.config.ts` | 修正 | siteName 更新 |
| `web/src/app/layout.tsx` | 修正 | アイコン参照を SVG に更新・isDev 変数削除 |
| `web/public/img/logo.svg` | 差し替え | テキストベース福岡市ロゴに変更 |
| `web/public/img/hero_background.png` | 差し替え | 福岡市夜景＋ラベンダーグラデーションに変更 |
| `web/public/icons/pwa/icon_fukuoka.svg` | 新規 | SVGアイコン作成 |
| `web/src/components/layouts/footer/footer.tsx` | 修正 | 免責文言コンポーネント追加 |
| `web/src/components/layouts/footer/footer.config.ts` | 修正 | ソースコードリンク追加 |
