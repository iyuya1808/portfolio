// 英語版 en/index.html を、日本語の index.html と js/i18n.js の EN 辞書から作る。
// 英語版を別の URL にするのは、Google に英語版を別ページとして登録してもらうため。
// GitHub Actions が配信の前に毎回実行する（en/ は Git に入れない）。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const root = new URL('..', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const BASE = 'https://technophere.com/portfolio/';

const dom = new JSDOM(read('index.html'), { runScripts: 'outside-only' });
const { window } = dom;
const doc = window.document;
window.eval(read('js/i18n.js'));
await new Promise((resolve) => {
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', resolve);
  else resolve();
});
window.setLang('en');

const $ = (sel) => {
  const el = doc.querySelector(sel);
  if (!el) throw new Error(`見つからない: ${sel}`);
  return el;
};

// head
doc.documentElement.lang = 'en';
doc.title = 'Yuya Itonaga | Portfolio';
$('meta[property="og:title"]').setAttribute('content', 'Yuya Itonaga | Portfolio');
$('meta[property="og:description"]').setAttribute('content', `${$('.cover__statement').textContent} ${$('.cover__sub').textContent}`);
$('link[rel="canonical"]').setAttribute('href', `${BASE}en/`);
$('meta[property="og:url"]').setAttribute('content', `${BASE}en/`);
$('meta[property="og:locale"]').setAttribute('content', 'en_US');
$('meta[property="og:locale:alternate"]').setAttribute('content', 'ja_JP');

const ld = $('script[type="application/ld+json"]');
const data = JSON.parse(ld.textContent);
data.url = `${BASE}en/`;
data.name = 'Yuya Itonaga | Portfolio';
data.inLanguage = 'en';
Object.assign(data.mainEntity, {
  name: 'Yuya Itonaga',
  alternateName: '糸長優矢',
  jobTitle: 'Head',
  knowsAbout: ['iOS app development', 'Flutter', 'WordPress', 'SEO', 'AI-driven development'],
});
data.mainEntity.worksFor.name = 'Technophere Inc.';
data.mainEntity.affiliation.name = 'Keio University';
ld.textContent = `\n  ${JSON.stringify(data, null, 2).replace(/\n/g, '\n  ')}\n  `;

// 辞書に無い本文
$('.skip').textContent = 'Skip to content';
doc.querySelectorAll('[aria-label]').forEach((el) => {
  const m = el.getAttribute('aria-label').match(/^(App Store|Google Play) で (.+) を見る$/);
  if (m) el.setAttribute('aria-label', `View ${m[2]} on ${m[1]}`);
});
const ALT = {
  'BrawlTech のマップ詳細画面。マップ別の勝率ランキング': 'BrawlTech map detail screen, with win-rate rankings per map',
  'BrawlTech のホーム画面。開催中のマップで勝っているキャラを表示': 'BrawlTech home screen, showing the brawlers winning on the maps live now',
  'KPass の課題一覧画面': 'KPass assignments screen',
  'KPass のホーム画面': 'KPass home screen',
};
doc.querySelectorAll('img[alt]').forEach((el) => {
  const v = ALT[el.getAttribute('alt')];
  if (v) el.setAttribute('alt', v);
});

// 言語切替は日本語版へのリンク
const toggle = $('.top__lang');
toggle.setAttribute('href', '../');
toggle.setAttribute('hreflang', 'ja');
toggle.setAttribute('lang', 'ja');
toggle.setAttribute('aria-label', '日本語版');
toggle.querySelector('span').textContent = 'JA';

// en/ から見た相対パスに直す（# のリンクはそのページ内なので触らない）
const rel = (v) => (/^(css|js|assets)\//.test(v) ? `../${v}` : v);
doc.querySelectorAll('[src]').forEach((el) => el.setAttribute('src', rel(el.getAttribute('src'))));
doc.querySelectorAll('link[href]').forEach((el) => el.setAttribute('href', rel(el.getAttribute('href'))));
doc.querySelectorAll('[srcset]').forEach((el) => {
  el.setAttribute('srcset', el.getAttribute('srcset').split(',').map((s) => rel(s.trim())).join(', '));
});

const html = dom.serialize();
const left = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/aria-label="日本語版"|<span class="labs__name">[^<]*<\/span>/g, '').match(/[ぁ-んァ-ヶ一-龯]+/g);
if (left) throw new Error(`英語版に日本語が残っている: ${[...new Set(left)].join(' / ')}`);

mkdirSync(new URL('en/', root), { recursive: true });
writeFileSync(new URL('en/index.html', root), html);
console.log('en/index.html を書き出しました');
