# Yuya Itonaga Portfolio — コンテンツ（v2.0.0、2026-09-25）

日本語は `index.html` がソース。英語は `js/i18n.js` の `EN` 辞書。数字は `js/data.js`（GA4 / Search Console の実測、2026-09-24 取得）。

## 章構成

| id | 見出し | 点群の形 |
|----|--------|---------|
| cover | Yuya Itonaga | ロゴの電球が組み上がる |
| story | はじまり | 経歴の道（年ごとに点が灯る） |
| numbers | 数字 | 累計PVの面グラフ（月次実データの積み上げ。右肩上がり） |
| works | つくったもの | 散らばった場 |
| media | 育てているメディア | 散らばった場 |
| tools | 使う道具 | スキルの力学グラフ（ラベル付き） |
| contact | 次のアイデアへ | 電球が灯る |

## 表紙

- 一文: 中学生でゲーム攻略を書き始めた。いまは、累計1,900万回読まれたメディアと、ストアに並ぶアプリをつくっている。
- 肩書: 慶應義塾大学 理工学部 3年 ／ テクノフィア代表

## 数字（2026-09-24 時点）

| 表示 | 値 | 補足 |
|------|----|------|
| 月間ページビューの最高値 | 1,433,841 | 2024年5月・運営サイト合計 |
| 累計ページビュー | 19,044,113 | 2023年8月〜2026年9月 |
| 月間ユーザーの最高値 | 448,208 | 2024年5月・ブロスタ攻略Lab |
| 直近28日の検索クリック | 100,669 | game.technophere.com・表示 3,093,611・平均掲載順位 6.4 |

累計と直近28日、KPass の App Store 評価（4.4・173件）は時間とともにずれるので、年に数回 `js/data.js` と `index.html` の数字を更新する。

## つくったもの

BrawlTech（App Store / Google Play）、KPass（App Store、評価 4.4・173件は取得時点）、Mimishare、
App Link Generator（WordPress.org / GitHub）、Push from GitHub（GitHub）、Lemon AI。
App Store のスクリーンショットは iTunes Lookup API の `screenshotUrls` から取得し `assets/images/works/` に保存。

## 育てているメディア

攻略Lab（ブロスタ・ツムツム・MSFS・eFootball・クラロワ・Cities: Skylines・NTE）、テクログ、App Gallery。
サムネイルは各サイトの実画面を Playwright で撮影し、上部 1280×560 を切り出して `assets/images/media/` に保存。

## 共有画像

`assets/images/og-portfolio.png`（1200×630）。作り直すときは `.github/og-source.html` をブラウザで開いて 1200×630 で撮影する。

## 更新のしかた

- 文言: `index.html` の日本語を直し、対応する `EN` の文言を `js/i18n.js` で直す。
- 経歴: `#events` の `li` を足す（`data-year` は年号スタンプ用）。点群の道は自動で追従する。
- 道具: `js/data.js` の `SKILLS`（`hub` が分類、`to` がつながり）。
- 数字: `js/data.js` の `PV_MONTHLY` に月を足し、`index.html` の 4 つの値を更新する。
