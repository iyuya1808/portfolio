# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Yuya Itonaga（テクノフィア代表）の個人ポートフォリオサイト。ビルドツール・パッケージマネージャー不要の純粋な静的HTMLサイト。

## 開発・確認方法

**ローカルで開く:**
```
open index.html
```

**ローカルサーバーで開く（推奨）:**
```
python3 -m http.server 8080
# → http://localhost:8080
```

依存パッケージなし。ビルドステップなし。lint・テストコマンドなし。

## ファイル構成

```
portfolio/
├── index.html       # 全セクションのHTML（1ファイル完結）
├── css/style.css    # CSS variables によるテーマ管理 + 全スタイル
├── js/main.js       # テーマ切り替え・アニメーション・Intersection Observer
├── js/i18n.js       # 言語切り替えロジック（EN翻訳辞書 + DOMキャッシュ方式）
├── DESIGN_RULE.md   # Apple HIG 準拠のデザインシステム仕様書
└── CLAUDE.md        # このファイル
```

外部依存は Google Fonts（Inter）のみ。

## アーキテクチャ

### 言語切り替え（i18n）
- ヘッダーの `[EN]` / `[JA]` ボタンで切り替え（`#langToggle`）
- `localStorage` キー `"lang"` でユーザー設定を保持。デフォルトは `"ja"`
- **設計方針: HTMLがJAのソース・オブ・トゥルース**
  - `DOMContentLoaded` 時に `[data-i18n]` / `[data-i18n-html]` / `[data-i18n-aria]` 要素の初期値を `jaCache` に保存
  - JA復元時は `jaCache` から読み出し → HTMLを変更するだけでJA側は自動追従
  - EN翻訳のみ `js/i18n.js` の `enTranslations` オブジェクトで管理
- **属性の使い分け**:
  - `data-i18n="キー"` → `textContent` を置換（通常テキスト）
  - `data-i18n-html="キー"` → `innerHTML` を置換（リンク・`<br>` を含む要素）
  - `data-i18n-aria="キー"` → `aria-label` 属性を置換
- タイプライターフレーズはDOMに存在しないため `js/i18n.js` の `jaPhrases` / `enTranslations.typewriter.phrases` で個別管理
- count-up アニメーションは言語切り替え時に再実行。EN用の数値は `data-en-target` / `data-en-suffix` / `data-en-decimals` で指定（例: JA「55万」→ EN「550K」）

### テーマシステム
- `<html data-theme="light|dark">` 属性で切り替え
- CSS variables（`--bg`, `--text`, `--accent` 等）が `:root, [data-theme="light"]` と `[data-theme="dark"]` の2セットで定義
- `localStorage` キー `"theme"` でユーザー設定を保持
- OS設定（`prefers-color-scheme`）をデフォルトとして使用
- テーマ初期化は `DOMContentLoaded` より前に即時実行（FOUC防止のため `index.html` 内の `<script>` インラインIIFEで処理）
- `meta[name="theme-color"]` も同時に更新（Safari / PWA 対応）
- `main.js` の `updateThemeIcon()` 関数がトグルボタンの `aria-checked` と `theme-color` メタを同期

### アニメーション
- `.reveal` クラスの要素は `IntersectionObserver`（threshold: 0.12）でビューポート進入時に `.visible` を付与してフェードイン
- `.count-up[data-target]` 要素はカウントアップアニメーション（easeOut cubic, 1800ms）
  - `data-suffix="万"` → `rawTarget / 10000` を整数表示（例: `data-target="550000"` → "55万"）
  - `data-decimals="1"` → `rawTarget / 10` を小数1桁表示（例: `data-target="41"` → "4.1"、`data-target="245"` → "24.5"）
  - `data-animated` 属性で二重実行を防止
- `.work-card`, `.service-card`, `.kpi-card`, `.media-card` は非タッチデバイスで3Dチルト + カーソルスポットライト（`--cx`, `--cy` CSS変数）
- `.about-timeline-wrap` は IntersectionObserver で `.line-drawn` クラスを付与してタイムライン線描画アニメーションを発火
- `.tech-chips` は IntersectionObserver で各 `.tech-chip` に `--chip-i` CSS変数と `.chip-pop` クラスを付与してスタガードアニメーション
- Hero のタイプライターエフェクトは `main.js` 内の `phrases` 配列を編集して変更（typewriter-cursor スパン要素を動的生成）

### ヘッダー
- `#header` 要素はスクロール量 > 20px で `.scrolled` クラスが付与される（`passive` スクロールリスナー）
- モバイルメニューは `#navHamburger` ボタンと `#navOverlay` オーバーレイで構成
  - 開閉状態: `overlay.classList.toggle('open')`, `aria-expanded`, `body.style.overflow = 'hidden'`
  - 閉じるトリガー: バックドロップクリック、リンククリック、Escapeキー

### アクティブナビゲーション
- `section[id]` 要素を IntersectionObserver（threshold: 0.4）で監視
- 現在ビューポートに表示されているセクションに対応するナビリンクの `color` を `var(--accent)` に変更

### セクション構成
```
Hero (#hero) → About (#about) → Numbers (#numbers) → Works (#works)
→ Media (#media) → Services (#services) → Skills (#skills) → Contact (#contact)
```

ナビゲーションのアンカーリンク: `#about`, `#numbers`, `#works`, `#services`, `#skills`, `#contact`

## コンテンツ更新のポイント

- **KPI数字の変更**: `index.html` の `.count-up` 要素の `data-target` 属性を編集
- **新しい作品の追加**: `#works` 内の `.works-grid` に `.work-card` を追加
  - `data-category` 属性: `mobile-app` / `wordpress` / `web-app`
  - `data-status` 属性: `live` / `wip`
  - ステータスバッジ: `<span class="work-status live">● Live</span>` または `<span class="work-status wip">● In Progress</span>`
- **タイプライターのフレーズ変更**: `js/i18n.js` の `jaPhrases`（日本語）と `enTranslations.typewriter.phrases`（英語）を編集
- **カラーパレット変更**: `css/style.css` の `:root, [data-theme="light"]` と `[data-theme="dark"]` のCSS variablesを編集
- **タイムラインへの項目追加**: `#about` 内の `.about-timeline` に `.timeline-item.reveal` を追加（現在地には `.timeline-item-current` も付与）。`data-i18n` または `data-i18n-html` を付与し、`js/i18n.js` の `enTranslations.about.timeline` に英訳を追加
- **スキルの追加**: `#skills` 内の `.skill-category` に `.skill-badge` を追加（主要スキルには `.main` クラスを付与）
- **tech-chips の更新**: `#skills` 内の `.tech-chips` に `.tech-chip` を追加（日本語チップには `data-i18n` を付与し `enTranslations.skills.chips` に英訳を追加）

## i18n 更新ルール

| やりたいこと | 変更するファイル |
|-------------|----------------|
| 日本語テキストを修正 | `index.html` のみ |
| 英語テキストを修正 | `js/i18n.js` の `enTranslations` のみ |
| 新しい翻訳対象要素を追加 | `index.html` に `data-i18n="新キー"` を付与 ＋ `js/i18n.js` の `enTranslations` に英訳を追加 |
| タイプライターフレーズを変更 | `js/i18n.js` の `jaPhrases`（JA）と `enTranslations.typewriter.phrases`（EN）を両方編集 |

## CSS変数リファレンス（主要）

| 変数 | 用途 |
|------|------|
| `--accent` | ブランドカラー（Apple Blue #0A84FF） |
| `--accent-2` | セカンダリ（Apple Green #30D158） |
| `--bg` | ページ背景 |
| `--bg-secondary` | セクション交互背景（.section-alt） |
| `--bg-card` | カード背景 |
| `--text` | 本文テキスト |
| `--text-muted` | 補助テキスト |
| `--border` | ボーダー・セパレータ |
| `--shadow`, `--shadow-lg`, `--shadow-xl` | エレベーション |
| `--header-bg` | ヘッダー背景（毛ガラスエフェクト） |
| `--radius-sm` `--radius-md` `--radius-lg` | 角丸 |

## デザインシステム

`DESIGN_RULE.md` に Apple HIG 準拠のデザインルールが定義されている。新しいUI要素を追加する際は必ず参照すること。

- カラー・タイポグラフィ・余白はすべて CSS variables で定義済み（`DESIGN_RULE.md` §2〜§4）
- コンポーネント（ボタン・カード・入力フィールド等）のスタイル規約は §7 を参照
- アニメーションのイージング変数（`--ease-default` 等）は §8 を参照
- アクセシビリティ要件（コントラスト・フォーカスリング・タッチターゲット・reduced-motion）は §9 を参照

## コーディング規約

- **クラス命名**: BEM的な命名（`work-card`, `work-card__footer`, `work-status`）
- **セマンティクス**: セクションは `<section>` + `aria-label`、カードは `<article>`
- **`aria-hidden="true"`**: 装飾要素（背景グリッド・グロー・番号・アイコン文字）に付与
- **外部リンク**: 常に `target="_blank" rel="noopener noreferrer"` を付与
- **テーマ対応**: 新しい色はCSS variablesで定義し、ハードコードしない
- **prefers-reduced-motion**: アニメーションを追加する場合は `@media (prefers-reduced-motion: reduce)` で無効化すること（`DESIGN_RULE.md` §8参照）

## cSpell の警告について

`Itonaga`, `taiziii`, `Gamerch`, `technophere` は固有名詞のため cSpell の警告は無視してよい。
