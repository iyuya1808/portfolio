# プログラミング学習サイト デザインシステム
## Apple HIG準拠 洗練版

---

## 1. 基本原則（Apple HIGより）

| 原則 | 説明 |
|------|------|
| **Clarity（明瞭性）**  | テキスト・アイコン・要素は常に読みやすく、目的が明確 |
| **Deference（控えめさ）** | UIはコンテンツを邪魔しない。背景は沈み、コンテンツを際立たせる |
| **Depth（奥行き）** | 視覚的な階層と動きで情報の文脈・関係性を伝える |

---

## 2. カラーシステム

### プライマリパレット

```css
:root {
  /* === ブランドカラー === */
  --color-brand-primary:    #0A84FF;  /* Apple Blue */
  --color-brand-secondary:  #30D158;  /* Apple Green（完了・成功） */
  --color-brand-accent:     #FF9F0A;  /* Apple Orange（注目・バッジ） */

  /* === セマンティックカラー === */
  --color-success:   #30D158;
  --color-warning:   #FFD60A;
  --color-error:     #FF453A;
  --color-info:      #0A84FF;

  /* === ニュートラル（Light Mode） === */
  --color-bg-primary:      #FFFFFF;
  --color-bg-secondary:    #F2F2F7;   /* Apple systemGray6 */
  --color-bg-tertiary:     #EFEFF4;
  --color-bg-grouped:      #F2F2F7;

  --color-label-primary:   #000000;
  --color-label-secondary: rgba(60, 60, 67, 0.60);
  --color-label-tertiary:  rgba(60, 60, 67, 0.30);
  --color-label-quaternary:rgba(60, 60, 67, 0.18);

  --color-separator:       rgba(60, 60, 67, 0.12);
  --color-fill-primary:    rgba(120, 120, 128, 0.20);
  --color-fill-secondary:  rgba(120, 120, 128, 0.16);
}

/* === Dark Mode === */
[data-theme="dark"] {
  --color-bg-primary:      #000000;
  --color-bg-secondary:    #1C1C1E;   /* Apple systemGray6 Dark */
  --color-bg-tertiary:     #2C2C2E;
  --color-bg-grouped:      #000000;

  --color-label-primary:   #FFFFFF;
  --color-label-secondary: rgba(235, 235, 245, 0.60);
  --color-label-tertiary:  rgba(235, 235, 245, 0.30);
  --color-label-quaternary:rgba(235, 235, 245, 0.18);

  --color-separator:       rgba(84, 84, 88, 0.60);
  --color-brand-primary:   #0A84FF;   /* Blueは同一（Adaptive Color）*/
  --color-brand-secondary: #30D158;
}
```

### プログラミング学習特有のカラー（言語別バッジ）

```css
:root {
  --lang-javascript: #F7DF1E;
  --lang-python:     #3776AB;
  --lang-rust:       #CE422B;
  --lang-go:         #00ADD8;
  --lang-typescript: #3178C6;
  --lang-css:        #264DE4;
}
```

> **アクセシビリティ**: 全テキストは WCAG 2.1 AA 基準（通常テキスト 4.5:1、大テキスト 3:1）を必ず満たす。

---

## 3. タイポグラフィ

Apple は San Francisco フォントを使用しますが、Web では **Inter** が最も近い代替です。

```css
:root {
  --font-sans:  "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  --font-mono:  "JetBrains Mono", "Fira Code", "SF Mono", Menlo, monospace;
}
```

### タイプスケール（Apple HIG準拠）

| トークン | サイズ | 行間 | 字間 | 用途 |
|----------|--------|------|------|------|
| `--text-largeTitle`   | 34px | 41px | +0.37px | ヒーロー見出し |
| `--text-title1`       | 28px | 34px | +0.36px | セクション見出し H1 |
| `--text-title2`       | 22px | 28px | +0.35px | カード見出し H2 |
| `--text-title3`       | 20px | 25px | +0.38px | サブ見出し H3 |
| `--text-headline`     | 17px | 22px | -0.41px | **Bold** 強調テキスト |
| `--text-body`         | 17px | 22px | -0.41px | 本文（Regular） |
| `--text-callout`      | 16px | 21px | -0.32px | 注釈・補足 |
| `--text-subheadline`  | 15px | 20px | -0.23px | 二次的ラベル |
| `--text-footnote`     | 13px | 18px | -0.08px | フッター・メタ情報 |
| `--text-caption1`     | 12px | 16px |  0px   | バッジ・タグ |
| `--text-caption2`     | 11px | 13px | +0.06px | 最小ラベル |

```css
:root {
  --text-largeTitle-size: 2.125rem;  /* 34px */
  --text-title1-size:     1.75rem;   /* 28px */
  --text-title2-size:     1.375rem;  /* 22px */
  --text-title3-size:     1.25rem;   /* 20px */
  --text-headline-size:   1.0625rem; /* 17px */
  --text-body-size:       1.0625rem; /* 17px */
  --text-callout-size:    1rem;      /* 16px */
  --text-subheadline-size:0.9375rem; /* 15px */
  --text-footnote-size:   0.8125rem; /* 13px */
  --text-caption1-size:   0.75rem;   /* 12px */
}
```

---

## 4. 余白・間隔システム

Apple の 8pt グリッドを基盤とした Spacing Scale：

```css
:root {
  --space-1:   4px;   /* micro — アイコン内パディング */
  --space-2:   8px;   /* xs    — 要素間の最小間隔 */
  --space-3:  12px;   /* sm    — インライン要素間 */
  --space-4:  16px;   /* md    — 標準パディング */
  --space-5:  20px;   /* lg    — カード内余白 */
  --space-6:  24px;   /* xl    — セクション内余白 */
  --space-8:  32px;   /* 2xl   — カード間隔 */
  --space-10: 40px;   /* 3xl   — セクション間 */
  --space-12: 48px;   /* 4xl   — 大セクション余白 */
  --space-16: 64px;   /* 5xl   — ページトップ余白 */
  --space-20: 80px;   /* 6xl   — ヒーロー余白 */
  --space-24: 96px;   /* hero  — 特大余白 */
}
```

### グリッドシステム

```css
/* コンテナ最大幅 */
.container {
  max-width: 1200px;
  padding-inline: var(--space-6);  /* 24px */
  margin-inline: auto;
}

/* カードグリッド（学習コース一覧など） */
.grid-courses {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);  /* 24px */
}
```

---

## 5. 角丸（Border Radius）

Apple の UI は用途によって角丸を使い分けます：

```css
:root {
  --radius-xs:   4px;    /* インラインバッジ、小タグ */
  --radius-sm:   8px;    /* 小ボタン、入力フィールド */
  --radius-md:  12px;    /* 標準ボタン、セル */
  --radius-lg:  16px;    /* カード（iOS風） */
  --radius-xl:  20px;    /* モーダル、ボトムシート */
  --radius-2xl: 24px;    /* 大カード、ヒーローカード */
  --radius-full: 9999px; /* Pill ボタン、アバター */
}
```

> **ルール**: 要素が大きいほど角丸も大きくする（Apple の Continuous Corners 原則）

---

## 6. 影の効果（Elevation System）

Apple の Material/Elevation 概念をWebに適用：

```css
:root {
  /* Light Mode */
  --shadow-1: 0 1px 3px rgba(0,0,0,0.08),
              0 1px 2px rgba(0,0,0,0.06);          /* カード（非ホバー） */

  --shadow-2: 0 4px 6px rgba(0,0,0,0.07),
              0 2px 4px rgba(0,0,0,0.06);          /* カード（ホバー） */

  --shadow-3: 0 10px 15px rgba(0,0,0,0.08),
              0 4px  6px rgba(0,0,0,0.05);         /* ドロップダウン、ポップオーバー */

  --shadow-4: 0 20px 25px rgba(0,0,0,0.10),
              0  8px 10px rgba(0,0,0,0.06);        /* モーダル */

  --shadow-5: 0 25px 50px rgba(0,0,0,0.15);       /* フルスクリーンモーダル */

  /* ブランドグロー（ボタンホバー、CTA強調） */
  --shadow-brand: 0 0 0 3px rgba(10, 132, 255, 0.30);
}

/* Dark Mode は影を薄くし、代わりにボーダーで層を表現 */
[data-theme="dark"] {
  --shadow-1: 0 1px 3px rgba(0,0,0,0.30);
  --shadow-2: 0 4px 6px rgba(0,0,0,0.40);
  --shadow-3: 0 10px 15px rgba(0,0,0,0.50);
}
```

---

## 7. コンポーネント設計

### 7-1. ボタン

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* サイズバリアント */
.btn--sm  { padding: var(--space-2) var(--space-4); font-size: var(--text-subheadline-size); }
.btn--md  { padding: var(--space-3) var(--space-6); font-size: var(--text-callout-size); }
.btn--lg  { padding: var(--space-4) var(--space-8); font-size: var(--text-body-size); }
.btn--pill { border-radius: var(--radius-full); }

/* Primary（CTA） */
.btn--primary {
  background: var(--color-brand-primary);
  color: #FFFFFF;
}
.btn--primary:hover {
  background: #0071E3;
  box-shadow: var(--shadow-brand);
  transform: translateY(-1px);
}
.btn--primary:active {
  transform: translateY(0) scale(0.97);
  box-shadow: none;
}

/* Secondary（Outlined） */
.btn--secondary {
  background: transparent;
  color: var(--color-brand-primary);
  border: 1.5px solid var(--color-brand-primary);
}
.btn--secondary:hover {
  background: rgba(10, 132, 255, 0.08);
}

/* Ghost */
.btn--ghost {
  background: var(--color-fill-primary);
  color: var(--color-label-primary);
}
.btn--ghost:hover {
  background: var(--color-fill-secondary);
}

/* フォーカスリング（アクセシビリティ） */
.btn:focus-visible {
  outline: 3px solid var(--color-brand-primary);
  outline-offset: 2px;
}

/* 無効状態 */
.btn:disabled {
  opacity: 0.38;
  pointer-events: none;
}
```

### 7-2. カード

```css
.card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--color-separator);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

/* インタラクティブカード */
.card--interactive {
  cursor: pointer;
}
.card--interactive:hover {
  box-shadow: var(--shadow-2);
  transform: translateY(-2px);
}
.card--interactive:active {
  transform: translateY(0);
  box-shadow: var(--shadow-1);
}

/* コースカード（学習サイト固有） */
.card--course {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-4);
}
.card--course .card__thumbnail {
  border-radius: var(--radius-sm);
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.card--course .card__badge {  /* 言語バッジ */
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-xs);
  font-size: var(--text-caption1-size);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```

### 7-3. 入力フィールド

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-body-size);
  font-family: var(--font-sans);
  background: var(--color-bg-secondary);
  border: 1.5px solid var(--color-separator);
  border-radius: var(--radius-sm);
  color: var(--color-label-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.input:focus {
  border-color: var(--color-brand-primary);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.20);
}
.input::placeholder {
  color: var(--color-label-tertiary);
}
.input--error {
  border-color: var(--color-error);
}
.input--error:focus {
  box-shadow: 0 0 0 3px rgba(255, 69, 58, 0.20);
}
```

### 7-4. プログレスバー（学習進捗）

```css
.progress {
  height: 6px;
  background: var(--color-fill-primary);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress__fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-brand-primary),
    var(--color-brand-secondary)
  );
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 7-5. コードブロック

```css
.code-block {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.7;
  background: #1C1C1E;          /* 常にダークで表示 */
  color: #F8F8F2;
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-6);
  overflow-x: auto;
  position: relative;
  border: 1px solid rgba(255,255,255,0.08);

  /* シンタックスハイライト用カラー */
  --sh-keyword:  #FF79C6;
  --sh-function: #50FA7B;
  --sh-string:   #F1FA8C;
  --sh-comment:  #6272A4;
  --sh-number:   #BD93F9;
}
```

### 7-6. ナビゲーション

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  padding-inline: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-6);

  /* Apple のすりガラスエフェクト */
  background: rgba(255, 255, 255, 0.72);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--color-separator);
}

[data-theme="dark"] .navbar {
  background: rgba(28, 28, 30, 0.72);
}
```

---

## 8. アニメーション・トランジション

```css
:root {
  /* Apple のイージング曲線 */
  --ease-default:  cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* 標準 */
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1.00);  /* バネ感（ボタンなど） */
  --ease-in:       cubic-bezier(0.55, 0.00, 1.00, 0.45);  /* 要素が消える */
  --ease-out:      cubic-bezier(0.00, 0.55, 0.45, 1.00);  /* 要素が現れる */

  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   400ms;
  --duration-reveal: 600ms;
}
```

```css
/* Reveal アニメーション（スクロール連動） */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity   var(--duration-reveal) var(--ease-out),
    transform var(--duration-reveal) var(--ease-out);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 親から子への連鎖（stagger） */
.reveal.visible:nth-child(1) { transition-delay: 0ms; }
.reveal.visible:nth-child(2) { transition-delay: 80ms; }
.reveal.visible:nth-child(3) { transition-delay: 160ms; }
.reveal.visible:nth-child(4) { transition-delay: 240ms; }
```

> **原則**: `prefers-reduced-motion` が有効な場合は全アニメーションを無効化

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. アクセシビリティチェックリスト

| カテゴリ | ルール |
|----------|--------|
| **コントラスト** | 通常テキスト ≥ 4.5:1 / 大テキスト・UI ≥ 3:1（WCAG AA） |
| **フォーカス** | 全インタラクティブ要素に `:focus-visible` のリングを表示 |
| **タッチターゲット** | 最小44×44px（Apple HIG 基準） |
| **色のみに頼らない** | エラーはアイコン＋テキストで補完。色盲対応 |
| **motion** | `prefers-reduced-motion: reduce` で全アニメーション停止 |
| **セマンティクス** | `<button>`, `<nav>`, `<main>`, `<article>` などの適切なHTML要素使用 |
| **ARIA** | `aria-label`, `aria-describedby`, `role` を必要な場所のみ使用 |
| **スクリーンリーダー** | 装飾画像は `alt=""`。意味のある画像には適切な `alt` 属性 |
| **キーボード操作** | Tab順序が視覚的流れと一致。モーダルはフォーカストラップ実装 |

---

## 10. デザイン判断ツリー

```
新しいUIを追加するとき
│
├─ 情報の強調度は？
│   ├─ 最重要（CTA）         → btn--primary + shadow-brand
│   ├─ 重要（サブアクション） → btn--secondary
│   └─ 補助的               → btn--ghost
│
├─ コンテンツの粒度は？
│   ├─ スタンドアロン情報    → card（shadow-1）
│   ├─ リスト内の1項目       → list-item（separator のみ）
│   └─ ハイライト情報        → card + accent border-left
│
└─ 動きが必要か？
    ├─ 状態変化              → transition（250ms, ease-default）
    ├─ 出現                  → reveal + translateY（600ms, ease-out）
    └─ 注目喚起              → spring easing（bounce）
```
