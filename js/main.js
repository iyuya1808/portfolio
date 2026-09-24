// ページの配線: テーマ・ナビ・慣性スクロール・章ごとの点群の形・年号スタンプ・スキルラベル
import { createScene, supportsWebGL } from './scene.js';
import { SKILLS, PV_MONTHLY } from './data.js';

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
  scene.setDim(window.innerWidth < 760 && id !== 'cover' && id !== 'contact' ? 0.55 : 1);
  skillLabels.classList.toggle('is-on', id === 'tools');
}

chapters.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end: 'bottom 55%',
    onEnter: () => enter(section),
    onEnterBack: () => enter(section),
    onUpdate: (self) => {
      if (!scene) return;
      const p = self.progress;
      if (section.id === 'numbers') scene.setParams({ reveal: Math.min(1, p / 0.55) });
      else if (section.id === 'contact') scene.setParams({ lit: Math.min(1, p / 0.6) });
      else if (section.id === 'cover') scene.setParams({ rot: p * 0.6 });
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

/* 使う道具: ノード位置に HTML のラベルを重ねる */
if (scene) {
  const labels = SKILLS.map((s) => {
    const el = document.createElement('span');
    el.className = 'label' + (s.hub ? ' is-hub' : '');
    el.textContent = s.label;
    skillLabels.appendChild(el);
    return el;
  });
  gsap.ticker.add(() => {
    if (!skillLabels.classList.contains('is-on')) return;
    for (let i = 0; i < labels.length; i++) {
      const p = scene.project(i);
      labels[i].style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(-50%, -50%)`;
      labels[i].style.opacity = Math.min(1, p.alpha * 1.2).toFixed(2);
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
  if (location.hash && document.querySelector(location.hash)) {
    if (lenis) lenis.scrollTo(document.querySelector(location.hash), { offset: location.hash === '#cover' ? 0 : -72, immediate: true });
    else window.scrollTo(0, document.querySelector(location.hash).getBoundingClientRect().top + window.scrollY - 72);
  }
});

/* ---------- 動きを減らす／WebGL 無し: 数字の章に静止した折れ線 ---------- */
function buildNumbersFallback() {
  const box = document.getElementById('numbersFallback');
  const W = 600, H = 260, max = Math.max(...PV_MONTHLY), n = PV_MONTHLY.length;
  const pts = PV_MONTHLY.map((v, i) => `${(i / (n - 1)) * W},${H - 20 - (v / max) * (H - 40)}`);
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="月次ページビューの推移">
    <polyline points="${pts.join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
    <line x1="0" y1="${H - 20}" x2="${W}" y2="${H - 20}" stroke="currentColor" stroke-width="1" opacity=".25"/>
  </svg>`;
  box.hidden = false;
}
