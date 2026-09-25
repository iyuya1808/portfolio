// 点群の「形」。各関数は out（全点の目標座標・大きさ・色・不透明度）を書き、辺の配列を返す。
// 座標はワールド単位。カメラは z=6、fov 40 なので画面の高さ ≒ 4.4 単位。
import { LOGO_NODES, LOGO_BASE, LOGO_EDGES } from './logo-graph.js';
import { PV_MONTHLY, SKILLS } from './data.js';

export const N_MAIN = LOGO_NODES.length;

export function hash(i, s = 0) {
  const x = Math.sin(i * 12.9898 + s * 78.233 + 1.7) * 43758.5453;
  return x - Math.floor(x);
}
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mix = (a, b, t) => a + (b - a) * t;
const wrap = (v, lo, hi) => { const r = hi - lo; return ((((v - lo) % r) + r) % r) + lo; };

// 電球の台座（3本のバー）を点に分解する
export function baseSamples() {
  const pts = [];
  for (const b of LOGO_BASE) {
    const n = Math.max(3, Math.round(b.w / 0.06));
    for (let k = 0; k < n; k++) {
      const t = n === 1 ? 0.5 : k / (n - 1);
      pts.push({ x: b.x - b.w / 2 + b.h / 2 + (b.w - b.h) * t, y: b.y, r: b.h / 2 });
    }
  }
  return pts;
}
const BASE = baseSamples();
export const N_BASE = BASE.length;

const COLOR_KEY = {
  '#1e2087': 'navy', '#162b88': 'navy', '#181c62': 'navy', '#00a0e8': 'sky',
  '#23ab39': 'green', '#006935': 'green2', '#7e308f': 'purple', '#e60013': 'red', '#f8b62d': 'yellow',
};
export const NODE_KEYS = LOGO_NODES.map((n) => COLOR_KEY[n.c] || 'navy');

// 電球の中心からの距離（灯るときに内側から黄色くなる）
const bulbCenter = { x: 0, y: 0.15 };
const INNER = LOGO_NODES.map((n) => {
  const d = Math.hypot(n.x - bulbCenter.x, n.y - bulbCenter.y);
  const t = clamp01(1.15 - d * 1.3);
  return t * t * (3 - 2 * t);
});

function setPoint(out, i, x, y, z, size, col, alpha, glow = 0) {
  out.pos[i * 3] = x; out.pos[i * 3 + 1] = y; out.pos[i * 3 + 2] = z;
  out.size[i] = size;
  out.col[i * 3] = col[0]; out.col[i * 3 + 1] = col[1]; out.col[i * 3 + 2] = col[2];
  out.alpha[i] = alpha;
  if (out.glow) out.glow[i] = glow; // 灯っている度合い（結びの電球だけ 0 以外）
}
const smooth01 = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };
// 灯るときの役割: 中心に近い 4 個が芯（白熱）、次の 7 個が中（琥珀）、残りはガラス側
const LIT_RANK = LOGO_NODES.map((_, i) => i).sort((a, b) => INNER[b] - INNER[a]);
const LIT_ROLE = new Array(LOGO_NODES.length).fill('outer');
LIT_RANK.forEach((i, k) => { LIT_ROLE[i] = k < 4 ? 'core' : k < 11 ? 'mid' : 'outer'; });
function mixCol(a, b, t) { return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]; }

// 形の中心。スマホでは文書内の枡（L.box）に置き、PC では空いた側の列に寄せる
function center(L, mobileY) {
  if (L.box) return { cx: L.box.cx, cy: L.box.cy };
  return { cx: L.isMobile ? 0 : L.side * L.halfW * (L.sideFactor || 0.5), cy: L.isMobile ? (mobileY == null ? 0 : mobileY) : 0 };
}
// ロゴの範囲は x ±0.72、y −1.0〜1.09。枡に収まる倍率
export function bulbScale(L) {
  return L.box ? Math.min(L.box.hw / 0.8, L.box.hh / 1.15) : L.scale;
}

/* ---------- 0 / 5: 電球（lit で灯る）。平面に置き、回転はごくわずか ---------- */
export function bulb(out, L, P, o) {
  const S = bulbScale(L), lit = o.lit || 0, rot = o.rot || 0, breath = o.breath || 0;
  const { cx, cy } = center(L, L.mobileY);
  const cs = Math.cos(rot), sn = Math.sin(rot);
  const edges = [];
  for (let i = 0; i < N_MAIN; i++) {
    const n = LOGO_NODES[i];
    let col = P[NODE_KEYS[i]], glow = 0;
    if (lit > 0) {
      // 芯 → 中 → 外の順に点く。境目は幅 0.12 の smoothstep で、濁った中間色を通らない
      const on = smooth01((lit * 1.3 - (1 - INNER[i])) / 0.12);
      const role = LIT_ROLE[i];
      if (role === 'core') { col = mixCol(col, P.core, on); glow = on; }
      else if (role === 'mid') { col = mixCol(col, P.spark, on); glow = on * 0.7; }
      else col = mixCol(col, P.spark, 0.15 * lit);
    }
    const size = n.r * 2 * S * (1 + glow * 0.3) * (1 + glow * 0.04 * breath);
    setPoint(out, i, cx + n.x * cs * S, cy + n.y * S, -n.x * sn * S, size, col, 1, glow);
  }
  for (let k = 0; k < N_BASE; k++) {
    const b = BASE[k];
    setPoint(out, N_MAIN + k, cx + b.x * cs * S, cy + b.y * S, -b.x * sn * S, b.r * 2 * S * 0.9, P.navy, 1);
  }
  const NH = out.n - N_MAIN - N_BASE;
  for (let k = 0; k < NH; k++) {
    const i = N_MAIN + N_BASE + k;
    if (hash(k, 18) > 0.5) { setPoint(out, i, cx, cy, -3, 0.01, P.ink, 0); continue; }
    const u = hash(k, 1), v = hash(k, 2);
    const r = (1.9 + 1.1 * hash(k, 3)) * S * (1 - 0.4 * lit);
    const th = u * Math.PI * 2 + L.time * 0.04 * (0.4 + hash(k, 4));
    const ph = Math.acos(2 * v - 1);
    const x = r * Math.sin(ph) * Math.cos(th), y = r * Math.cos(ph) * 0.85, z = r * Math.sin(ph) * Math.sin(th) * 0.5;
    // 光の中に入った粉は琥珀色に、少し大きく明るく（光の中に舞う塵）
    const near = clamp01((1.6 * S - Math.hypot(x, y)) / (0.6 * S)) * lit;
    setPoint(out, i, cx + x, cy + 0.1 * S + y, z, (0.015 + 0.015 * hash(k, 5)) * S * (1 + 0.6 * near), mixCol(P.ink, P.spark, near), P.dustAlpha * (1 + lit * 0.6) * (1 + near), near * 0.5);
  }
  for (const e of LOGO_EDGES) edges.push([e[0], e[1], 0.9 + lit * 0.1]);
  return edges;
}

/* ---------- 1: 経歴の道。出来事の行の位置（rowYs）にノードを置き、文章と 1:1 で動く ---------- */
export function path(out, L, P, o) {
  const S = L.scale, rows = o.rowYs, lit = o.rowLit || [];
  const n = rows ? rows.length : o.events || 15;
  // スマホは出来事の左に設けた細い列（pathX）を走らせる。PC は年号と出来事の間
  const cx = o.pathX != null ? o.pathX : L.isMobile ? -0.97 * L.halfW : -0.16 * L.halfW;
  const amp = o.pathAmp != null ? o.pathAmp : (L.isMobile ? 0.05 : 0.34) * S;
  const gap = rows && n > 1 ? Math.max(0.3, (rows[0] - rows[n - 1]) / (n - 1)) : 0.62 * S;
  const yAt = (e) => {
    if (!rows) return (7 - e) * gap;
    if (e <= 0) return rows[0] - e * gap;
    if (e >= n - 1) return rows[n - 1] - (e - (n - 1)) * gap;
    const i = Math.floor(e), f = e - i;
    return rows[i] + (rows[i + 1] - rows[i]) * f;
  };
  const xAt = (e) => cx + amp * Math.sin(e * 1.1 + 0.4);
  let curIdx = -1;
  for (let e = 0; e < n; e++) if (lit[e]) curIdx = e;
  const edges = [];
  for (let i = 0; i < N_MAIN; i++) {
    const e = i, x = xAt(e), y = yAt(e);
    if (e < n) {
      const done = !!lit[e], cur = e === curIdx;
      const col = done ? (cur ? P.navy : P.sky) : P.ink;
      const size = (cur ? 0.17 : done ? 0.11 : 0.07) * S;
      setPoint(out, i, x, y, 0, size, col, done ? 1 : 0.4);
    } else {
      setPoint(out, i, x, y, 0, 0.05 * S, P.ink, Math.max(0, 0.25 - (e - n) * 0.04));
    }
  }
  // 導入部への延長。スマホは列が文章の左を通るので短くする
  const NH = out.n - N_MAIN, e0 = o.pathX != null ? -1.2 : -5, e1 = n + 6;
  for (let k = 0; k < NH; k++) {
    const i = N_MAIN + k;
    const ef = e0 + (k / (NH - 1)) * (e1 - e0);
    const j = (hash(k, 6) - 0.5) * 0.08 * S;
    const done = ef < curIdx + 0.5;
    const fade = ef > n - 1 ? Math.max(0, 1 - (ef - (n - 1)) / 7) : 1;
    setPoint(out, i, xAt(ef) + j, yAt(ef) + (hash(k, 7) - 0.5) * 0.04, (hash(k, 8) - 0.5) * 0.3, 0.02 * S, P.ink, (done ? 0.38 : 0.16) * fade);
  }
  for (let e = 0; e < N_MAIN - 1; e++) edges.push([e, e + 1, e + 1 <= curIdx ? 0.8 : e < n - 1 ? 0.3 : Math.max(0, 0.15 - (e - n) * 0.03)]);
  return edges;
}

/* ---------- 2: 累計PVの面グラフ（月次を積み上げるので右肩上がり。終点が累計値） ---------- */
const PV_CUMV = (() => { const c = []; let s = 0; for (const v of PV_MONTHLY) { s += v; c.push(s); } return c; })();
const PV_CUM_MAX = PV_CUMV[PV_CUMV.length - 1];
const PV_LAST = PV_MONTHLY.length - 1;
// 面の下を粉で埋めるため、各月の高さに比例した累積分布
const AREA_CDF = (() => { const c = []; let s = 0; for (const v of PV_CUMV) { s += v; c.push(s); } return c.map((v) => v / s); })();

export function chart(out, L, P, o) {
  // reveal 0→1 で左から右へ描き上がる（1 で最後の月まで満ちる）。まだ描いていない所は見せない
  const S = L.scale, M = PV_MONTHLY.length, reveal = clamp01(o.reveal || 0) * (M + 0.5);
  const { cx, cy } = center(L, -L.mobileY);
  const W = L.box ? L.box.hw * 2 * 0.92 : L.isMobile ? L.halfW * 1.7 : L.halfW * 0.76; // 右端（累計の点）が画面の縁にかからない幅
  const H = L.box ? L.box.hh * 2 * 0.8 : 1.6 * S;
  const base = cy - H / 2;
  const colX = (m) => cx - W / 2 + (W * m) / (M - 1);
  const fac = (m) => clamp01(reveal - m);
  const top = (m) => base + (H * PV_CUMV[m] / PV_CUM_MAX) * fac(m);
  const edges = [];
  for (let i = 0; i < N_MAIN; i++) {
    const m = Math.round((i * (M - 1)) / (N_MAIN - 1));
    const f = fac(m), peak = m === PV_LAST;
    setPoint(out, i, colX(m), top(m), 0, (peak ? 0.14 : 0.06) * S, peak ? P.spark : P.sky, f);
    if (i > 0) edges.push([i - 1, i, 0.75 * Math.min(f, fac(Math.round(((i - 1) * (M - 1)) / (N_MAIN - 1))))]);
  }
  for (let k = 0; k < N_BASE; k++) {
    setPoint(out, N_MAIN + k, cx - W / 2 + (W * k) / (N_BASE - 1), base, 0, 0.02 * S, P.ink, 0.4);
  }
  const NH = out.n - N_MAIN - N_BASE;
  for (let k = 0; k < NH; k++) {
    const i = N_MAIN + N_BASE + k;
    const u = hash(k, 9);
    let m = 0; while (m < M - 1 && AREA_CDF[m] < u) m++;
    const f = fac(m);
    const x = colX(m) + (hash(k, 10) - 0.5) * (W / (M - 1)) * 0.95;
    const y = base + (top(m) - base) * hash(k, 12);
    setPoint(out, i, x, y, (hash(k, 13) - 0.5) * 0.4, 0.022 * S, P.navy, 0.36 * f);
  }
  return edges;
}

/* ---------- 3: 散らばった場（作品・メディアの章の背景）。まばらに、ゆっくり漂い、スクロールで奥行き差 ---------- */
export function field(out, L, P, o) {
  const dim = o.dim == null ? 1 : o.dim;
  const NH = out.n - N_MAIN - N_BASE;
  const W = L.halfW * 1.15, Hh = L.halfH * 1.15;
  for (let i = 0; i < N_MAIN; i++) {
    const a = (i / N_MAIN) * Math.PI * 2 + L.time * 0.06;
    setPoint(out, i, Math.cos(a) * L.halfW * 0.82, Math.sin(a) * L.halfH * 0.78, -0.5, 0.05 * L.scale, i % 2 ? P.sky : P.navy, 0.18 * dim);
  }
  for (let k = 0; k < N_BASE; k++) setPoint(out, N_MAIN + k, 0, 0, -2, 0.01, P.ink, 0);
  for (let k = 0; k < NH; k++) {
    const i = N_MAIN + N_BASE + k;
    if (hash(k, 19) > 0.35) { setPoint(out, i, 0, 0, -3, 0.01, P.ink, 0); continue; }
    const depth = hash(k, 16);
    const vx = (hash(k, 20) - 0.5) * 0.3, vy = (hash(k, 21) - 0.5) * 0.3;
    const wob = Math.sin(L.time * 0.6 + k) * 0.05;
    const x = wrap((hash(k, 14) - 0.5) * 2 * W + vx * L.time + wob, -W, W);
    const y = wrap((hash(k, 15) - 0.5) * 2 * Hh + vy * L.time - wob - (L.scroll || 0) * L.halfH * (0.15 + 0.25 * depth), -Hh, Hh);
    setPoint(out, i, x, y, (depth - 0.5) * 2, (0.015 + 0.015 * hash(k, 17)) * L.scale, P.ink, 0.13 * dim);
  }
  return [];
}

/* ---------- 4: 使う道具の力学グラフ ---------- */
export const SKILL_INDEX = Object.fromEntries(SKILLS.map((s, i) => [s.id, i]));
export const SKILL_EDGES = [];
SKILLS.forEach((s, i) => (s.to || []).forEach((t) => SKILL_EDGES.push([i, SKILL_INDEX[t]])));

export function layoutSkills() {
  const n = SKILLS.length;
  const px = new Float32Array(n), py = new Float32Array(n);
  const hubs = SKILLS.map((s, i) => i).filter((i) => SKILLS[i].hub);
  const hubAngle = {};
  hubs.forEach((h, k) => (hubAngle[SKILLS[h].id] = (k / hubs.length) * Math.PI * 2));
  for (let i = 0; i < n; i++) {
    const s = SKILLS[i];
    const hubId = s.hub ? s.id : (s.to || []).find((t) => SKILLS[SKILL_INDEX[t]].hub) || 'ai';
    const a = hubAngle[hubId] + (s.hub ? 0 : (hash(i, 20) - 0.5) * 1.2);
    const r = s.hub ? 0.55 : 0.9 + hash(i, 21) * 0.4;
    px[i] = Math.cos(a) * r; py[i] = Math.sin(a) * r;
  }
  for (let it = 0; it < 360; it++) {
    const fx = new Float32Array(n), fy = new Float32Array(n);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let dx = px[i] - px[j], dy = py[i] - py[j];
      const d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2);
      const rep = 0.045 / d2;
      dx /= d; dy /= d;
      fx[i] += dx * rep; fy[i] += dy * rep; fx[j] -= dx * rep; fy[j] -= dy * rep;
    }
    for (const [i, j] of SKILL_EDGES) {
      const dx = px[j] - px[i], dy = py[j] - py[i], d = Math.hypot(dx, dy) || 0.001;
      const rest = SKILLS[i].hub && SKILLS[j].hub ? 0.9 : 0.5;
      const f = (d - rest) * 0.08;
      fx[i] += (dx / d) * f; fy[i] += (dy / d) * f; fx[j] -= (dx / d) * f; fy[j] -= (dy / d) * f;
    }
    for (let i = 0; i < n; i++) {
      fx[i] -= px[i] * 0.02; fy[i] -= py[i] * 0.02;
      px[i] += fx[i] * 0.5; py[i] += fy[i] * 0.5;
    }
  }
  let mx = 0, my = 0;
  for (let i = 0; i < n; i++) { mx = Math.max(mx, Math.abs(px[i])); my = Math.max(my, Math.abs(py[i])); }
  for (let i = 0; i < n; i++) { px[i] = (px[i] / mx) * 1.05; py[i] = (py[i] / my) * 0.95; }
  return { px, py };
}

export function graph(out, L, P, o) {
  const S = L.scale, lay = o.layout;
  const { cx, cy } = center(L);
  const n = SKILLS.length;
  // レイアウトは ±1.05 / ±0.95 に正規化済み。枡があればその 82% に収める
  // 枡があるとき（スマホ）: 全幅の枡なら均等に、縦長の枡ならラベルの分だけ横に余白を残す
  const wide = L.box && L.box.hw > L.box.hh * 0.7;
  const sx = L.box ? (L.box.hw * (wide ? 0.84 : 0.66)) / 1.05 : S * 1.05, sy = L.box ? (L.box.hh * (wide ? 0.84 : 0.9)) / 0.95 : S * 1.05;
  const nodeS = L.box ? Math.min(S, Math.max(0.4, Math.min(sx, sy) * 1.2)) : S;
  field(out, L, P, { dim: 0.55 });
  for (let i = 0; i < N_MAIN; i++) {
    if (i < n) {
      const s = SKILLS[i];
      const size = (s.hub ? 0.15 : 0.06 + 0.05 * s.w) * nodeS;
      setPoint(out, i, cx + lay.px[i] * sx, cy + lay.py[i] * sy, (hash(i, 22) - 0.5) * 0.2, size, s.hub ? P.navy : P.sky, 1);
    } else {
      setPoint(out, i, cx, cy, -1, 0.01, P.ink, 0);
    }
  }
  return SKILL_EDGES.map(([i, j]) => [i, j, 0.6]);
}
