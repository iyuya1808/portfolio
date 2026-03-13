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
├── index.html     # 全セクションのHTML（1ファイル完結）
├── css/style.css  # CSS variables によるテーマ管理 + 全スタイル
└── js/main.js     # テーマ切り替え・アニメーション・Intersection Observer
```

外部依存は Google Fonts（Inter）のみ。

## アーキテクチャ

### テーマシステム
- `<html data-theme="light|dark">` 属性で切り替え
- CSS variables（`--bg`, `--text`, `--accent` 等）が `:root` と `[data-theme="dark"]` の2セットで定義
- `localStorage` キー `"theme"` でユーザー設定を保持
- OS設定（`prefers-color-scheme`）をデフォルトとして使用
- テーマ初期化は `DOMContentLoaded` より前に即時実行（FOUC防止のため `main.js` 冒頭のIIFEで処理）

### アニメーション
- `.reveal` クラスの要素は `IntersectionObserver` でビューポート進入時に `.visible` を付与してフェードイン
- `.count-up[data-target]` 要素はカウントアップアニメーション（`data-suffix="万"` で万単位表示、`data-decimals="1"` で小数表示）
- `.skill-fill[style="--fill: XX%"]` はCSSの `transition` と `var(--fill)` で制御され、親`.skill-category`に`.visible`が付いたときに発火
- Hero のタイプライターエフェクトは `main.js` 内の `phrases` 配列を編集して変更

### セクション構成
Hero → About → Numbers → Projects → Media → Services → Plugins → Skills → Contact（`id` 属性でアンカーリンク）

## コンテンツ更新のポイント

- **KPI数字の変更**: `index.html` の `.count-up` 要素の `data-target` 属性を編集
- **新しいプロジェクトの追加**: `.projects-grid` 内に `.project-card` を追加（ステータスは `live` / `wip`）
- **タイプライターのフレーズ変更**: `js/main.js` の `phrases` 配列を編集
- **カラーパレット変更**: `css/style.css` の `:root` と `[data-theme="dark"]` のCSS variablesを編集

## cSpell の警告について

`Itonaga`, `taiziii`, `Gamerch`, `technophere` は固有名詞のため cSpell の警告は無視してよい。
