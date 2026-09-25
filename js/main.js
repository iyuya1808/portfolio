// ページの配線: テーマ・ナビ・慣性スクロール・章ごとの点群の形・年号スタンプ・スキルラベル
import { createScene, supportsWebGL } from './scene.js';
import { SKILLS, PV_MONTHLY } from './data.js';
import { SKILL_GROUP, SKILL_EDGES } from './formations.js';

const html = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useScene = !reduceMotion && supportsWebGL();

/* ---------- テーマ ---------- */
const themeBtn = document.getElementById('themeToggle');
const themeMeta = document.getElementById('themeColorMeta');
function applyTheme(t) {
  html.setAttribute('data-theme', t);
  themeBtn.setAttribute('aria-checked', t === 'dark' ? 'true' : 'false');
  if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0B1033' : '#F4F6FB');
  try { localStorage.setItem('theme', t); } catch (e) {}
}
themeBtn.addEventListener('click', () => applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
themeBtn.setAttribute('aria-checked', html.getAttribute('data-theme') === 'dark' ? 'true' : 'false');

/* ---------- メニュー（モバイル） ---------- */
const menuBtn = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
function closeMenu() { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); if (lenis) lenis.start(); }
menuBtn.addEventListener('click', () => {
  const open = menu.hidden;
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (lenis) open ? lenis.stop() : lenis.start();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });

/* ---------- 慣性スクロールと ScrollTrigger ---------- */
let lenis = null;
gsap.registerPlugin(ScrollTrigger);
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const top = document.getElementById('top');
function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const offset = hash === '#cover' ? 0 : -72;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'auto' });
}
document.querySelectorAll('a[data-scroll]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const hash = a.getAttribute('href');
    if (!hash || !hash.startsWith('#')) return;
    e.preventDefault();
    if (!menu.hidden) closeMenu();
    scrollToHash(hash);
    history.replaceState(null, '', hash);
  });
});
window.addEventListener('scroll', () => top.classList.toggle('is-scrolled', window.scrollY > 24), { passive: true });

/* ---------- 点群 ---------- */
let scene = null;
if (useScene) {
  scene = createScene(document.getElementById('scene'));
  scene.setTheme(html.getAttribute('data-theme'));
  new MutationObserver(() => scene.setTheme(html.getAttribute('data-theme'))).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
} else {
  html.classList.add('no-scene');
  document.getElementById('coverFallback').hidden = false;
  buildNumbersFallback();
}

/* ---------- 章ごとの形 ---------- */
const events = document.querySelectorAll('#events li');
const chapters = document.querySelectorAll('.chapter');
const navLinks = document.querySelectorAll('.top__nav a');
const skillLabels = document.getElementById('skillLabels');
let current = null;

function enter(section) {
  if (current === section) return;
  current = section;
  const id = section.id;
  navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + id));
  if (!scene) return;
  scene.setFormation(section.dataset.formation, Number(section.dataset.side));
  if (id !== 'cover') scene.setParams({ rot: 0 }); // 結びの電球は正面を向く
  // スマホでは形を文書内の枡に置くので暗くしない。文章の裏を漂う「場」だけ少し薄く
  scene.setDim(isMobile() && section.dataset.formation === 'field' ? 0.7 : 1);
  skillLabels.classList.toggle('is-on', id === 'tools');
}
const isMobile = () => window.innerWidth < 760;

chapters.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end: 'bottom 55%',
    onEnter: () => enter(section),
    onEnterBack: () => enter(section),
    onUpdate: (self) => {
      if (!scene || isMobile()) return; // スマホは枡の位置から計算する（下の ticker）
      const p = self.progress;
      if (section.id === 'numbers') {
        // 章の上端が画面の 6 割から 1.5 割まで上がる間に左から描き上がる（見出しが上に来る頃には満ちている）
        const h = window.innerHeight, top = section.getBoundingClientRect().top;
        scene.setParams({ reveal: Math.min(1, Math.max(0, (0.6 * h - top) / (0.45 * h))) });
      }
      else if (section.id === 'contact') scene.setParams({ lit: Math.min(1, p / 0.6) });
    },
  });
});
if (scene) scene.setParams({ events: events.length });

/* 経歴: 見えている出来事に合わせて年号と点を進める */
const yearStamp = document.getElementById('yearStamp');
let yearShown = '2018';
function setYear(y) {
  if (y === yearShown) return;
  yearShown = y;
  yearStamp.classList.add('is-swap');
  setTimeout(() => { yearStamp.textContent = y; yearStamp.classList.remove('is-swap'); }, 180);
}
events.forEach((li, i) => {
  ScrollTrigger.create({
    trigger: li,
    start: 'top 62%',
    onEnter: () => { li.classList.add('is-lit'); setYear(li.dataset.year); if (scene) scene.setParams({ progress: i / (events.length - 1) }); },
    onLeaveBack: () => { li.classList.remove('is-lit'); const prev = events[i - 1]; setYear(prev ? prev.dataset.year : '2018'); if (scene) scene.setParams({ progress: Math.max(0, i - 1) / (events.length - 1) }); },
  });
});

/* 経歴の道: 出来事の行の位置を毎フレーム渡し、点が文章と 1:1 で動く */
const eventsList = document.getElementById('events');
const yearsCol = document.querySelector('.story__years');
const timelineEl = document.getElementById('timeline');
if (scene) {
  const rows = Array.from(events);
  gsap.ticker.add(() => {
    if (scene.formation !== 'path') return;
    const { halfH, halfW, isMobile: mobile } = scene.layout(), h = window.innerHeight, w = window.innerWidth;
    const rowYs = rows.map((li) => { const r = li.getBoundingClientRect(); return (0.5 - (r.top + r.height / 2) / h) * 2 * halfH; });
    // スマホでは年号の列と出来事の列の間（空けてある列）を道が蛇行する
    let pathX = null, pathAmp = null;
    if (mobile) {
      const yr = yearsCol.getBoundingClientRect(), ev = eventsList.getBoundingClientRect();
      // 年号が出来事と同じ列にある（狭い画面）ときは、タイムラインの左端から出来事までが道の列
      const tl = timelineEl.getBoundingClientRect();
      const laneL = yr.right <= ev.left ? yr.right : tl.left + (parseFloat(getComputedStyle(timelineEl).paddingLeft) || 0);
      const lane = ev.left - laneL;
      pathX = ((laneL + lane / 2) / w - 0.5) * 2 * halfW;
      pathAmp = (Math.max(4, lane / 2 - 10) / w) * 2 * halfW;
    }
    scene.setParams({ rowYs, rowLit: rows.map((li) => li.classList.contains('is-lit')), pathX, pathAmp });
  });
}

/* スマホ: PC で点群が占めていた列の代わりに、文書内の枡（.anchor）の矩形へ形を収める */
if (scene) {
  const anchors = Array.from(document.querySelectorAll('.anchor[data-anchor]'));
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  gsap.ticker.add(() => {
    const { halfH, halfW, isMobile: mobile } = scene.layout();
    if (!mobile) { scene.setParams({ boxes: null }); return; }
    const h = window.innerHeight, w = window.innerWidth;
    const boxes = {};
    for (const el of anchors) {
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      boxes[el.dataset.anchor] = {
        cx: ((r.left + r.width / 2) / w - 0.5) * 2 * halfW,
        cy: (0.5 - (r.top + r.height / 2) / h) * 2 * halfH,
        hw: (r.width / w) * halfW,
        hh: (r.height / h) * halfH,
      };
      // 枡が見えてきた分だけチャートを伸ばし、電球を灯す
      if (el.dataset.anchor === 'chart') scene.setParams({ reveal: clamp01((0.9 * h - r.top) / (0.5 * h)) });
      if (el.dataset.anchor === 'lit') scene.setParams({ lit: clamp01((0.85 * h - r.top) / (0.45 * h)) });
    }
    scene.setParams({ boxes });
  });
}

/* 使う道具: ノード位置に HTML のラベルを重ねる */
if (scene) {
  const labels = SKILLS.map((s, i) => {
    const el = document.createElement('span');
    el.className = 'label' + (s.hub ? ' is-hub' : '');
    el.dataset.g = SKILL_GROUP[i];
    el.textContent = s.label;
    skillLabels.appendChild(el);
    return el;
  });
  // oy: 押し分けで決まる縦のずれ（目標）、sy: 実際に使うずれ（時間でならす）
  const pts = labels.map(() => ({ x: 0, y: 0, w: 0, h: 0, a: 0, oy: 0, sy: 0, shown: false }));
  const graphAnchor = document.querySelector('[data-anchor="graph"]');
  let lastHot = -1;
  gsap.ticker.add((time, dtMs) => {
    if (!skillLabels.classList.contains('is-on')) return;
    // PC: カーソルが近づいたノードとつながった道具のラベルを目立たせる
    const hot = scene.hoverSkill();
    if (hot !== lastHot) {
      lastHot = hot;
      const near = new Set(hot < 0 ? [] : [hot]);
      for (const [i, j] of SKILL_EDGES) { if (i === hot) near.add(j); if (j === hot) near.add(i); }
      labels.forEach((el, i) => el.classList.toggle('is-hot', near.has(i)));
    }
    for (let i = 0; i < labels.length; i++) {
      const p = scene.project(i), q = pts[i];
      q.x = p.x; q.y = p.y; q.a = p.alpha; q.w = labels[i].offsetWidth; q.h = labels[i].offsetHeight; q.oy = 0;
    }
    // スマホは狭いので、ラベルを枡の内側に収める
    if (isMobile()) {
      const box = graphAnchor.getBoundingClientRect();
      if (box.width) for (const q of pts) q.x = Math.min(Math.max(q.x, box.left + q.w / 2 + 2), box.right - q.w / 2 - 2);
    }
    // 重なった組を縦に押し分ける。横の重なり具合に応じて段階的に効かせ、組み上がり中に急に跳ねないようにする
    for (let it = 0; it < 6; it++) for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j];
      const needX = (a.w + b.w) / 2 + 4, needY = (a.h + b.h) / 2 + 3;
      const dx = Math.abs(a.x - b.x), dy = (b.y + b.oy) - (a.y + a.oy);
      if (dx >= needX || Math.abs(dy) >= needY) continue;
      const w = Math.min(1, (needX - dx) / 16);
      const push = (needY - Math.abs(dy)) / 2 * w, s = dy >= 0 ? 1 : -1;
      a.oy -= push * s; b.oy += push * s;
    }
    // ずれだけを時間でならす（点への追従はそのままなので、スクロールには遅れない）
    const k = 1 - Math.exp(-(dtMs || 16) / 90);
    for (let i = 0; i < labels.length; i++) {
      const q = pts[i];
      if (q.a < 0.02) { q.shown = false; q.sy = q.oy; } else if (!q.shown) { q.shown = true; q.sy = q.oy; } else q.sy += (q.oy - q.sy) * k;
      const y = q.y + q.sy;
      labels[i].style.transform = `translate(${q.x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      labels[i].style.opacity = Math.min(1, q.a * 1.2).toFixed(2);
    }
  });
}

/* ---------- レイアウトが変わったら ScrollTrigger を測り直す ---------- */
const refresh = () => ScrollTrigger.refresh();
document.fonts?.ready.then(refresh);
document.addEventListener('langchange', () => setTimeout(refresh, 50));
document.querySelectorAll('img[loading="lazy"]').forEach((img) => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
window.addEventListener('load', () => {
  refresh();
  // 直リンク（#numbers など）は固定ヘッダーの分だけ下げて止める
  if (location.hash && location.hash !== '#cover' && document.querySelector(location.hash)) {
    // ブラウザ自身のフラグメント移動の後に走らせる
    setTimeout(() => {
      const el = document.querySelector(location.hash);
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
    }, 150);
  }
});

/* ---------- 動きを減らす／WebGL 無し: 数字の章に静止した折れ線 ---------- */
function buildNumbersFallback() {
  const box = document.getElementById('numbersFallback');
  const cum = []; let sum = 0; for (const v of PV_MONTHLY) { sum += v; cum.push(sum); }
  const W = 600, H = 260, max = sum, n = cum.length;
  const pts = cum.map((v, i) => `${(i / (n - 1)) * W},${H - 20 - (v / max) * (H - 40)}`);
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="累計ページビューの推移">
    <polyline points="${pts.join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
    <line x1="0" y1="${H - 20}" x2="${W}" y2="${H - 20}" stroke="currentColor" stroke-width="1" opacity=".25"/>
  </svg>`;
  box.hidden = false;
}
