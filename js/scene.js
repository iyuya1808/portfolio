// 画面奥に固定した 1 枚の WebGL キャンバス。点群が章ごとに形を変える。
import * as THREE from '../assets/vendor/three.module.min.js';
import * as F from './formations.js';

const PALETTE = {
  light: { navy: '#1F2A8C', sky: '#1DA3E8', ink: '#12173F', spark: '#F5B82E', red: '#E30613', green: '#23AB39', green2: '#0A7A45', purple: '#7E308F', yellow: '#F8B62D', edge: '#12173F', edgeAlpha: 0.55, edgeWidth: 2.5, dustAlpha: 0.15, glow: 0.3, additive: false },
  dark:  { navy: '#5563E8', sky: '#4FC1FF', ink: '#EEF1FA', spark: '#FFC94D', red: '#FF5A69', green: '#3ED069', green2: '#2CB57A', purple: '#C07BE0', yellow: '#FFC94D', edge: '#EEF1FA', edgeAlpha: 0.4, edgeWidth: 2, dustAlpha: 0.22, glow: 0.9, additive: true },
};
function rgb(hex) { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; }
function toPalette(p) {
  const o = {};
  for (const k of ['navy', 'sky', 'ink', 'spark', 'red', 'green', 'green2', 'purple', 'yellow']) o[k] = rgb(p[k]);
  o.dustAlpha = p.dustAlpha; return o;
}

export function supportsWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

export function createScene(canvas, opts = {}) {
  const isMobile = () => window.innerWidth < 760;
  const helpers = opts.helpers || (isMobile() ? 180 : 360);
  const N = F.N_MAIN + F.N_BASE + helpers;
  const MAX_EDGES = 140;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  // 点
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3), size = new Float32Array(N), col = new Float32Array(N * 3), alpha = new Float32Array(N);
  const tgt = { n: N, pos: new Float32Array(N * 3), size: new Float32Array(N), col: new Float32Array(N * 3), alpha: new Float32Array(N) };
  for (let i = 0; i < N; i++) { // 最初は遠くに散らばっている
    const u = F.hash(i, 31), v = F.hash(i, 32), r = 2.5 + 1.5 * F.hash(i, 33);
    const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.cos(ph); pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
    alpha[i] = 0; size[i] = 0.02;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  const pointMat = new THREE.ShaderMaterial({
    uniforms: { uProj: { value: 1000 }, uDim: { value: 1 } },
    vertexShader: `
      attribute float aSize; attribute vec3 aColor; attribute float aAlpha;
      uniform float uProj; varying vec3 vColor; varying float vAlpha;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
        gl_PointSize = max(1.0, aSize * uProj / -mv.z); vColor = aColor; vAlpha = aAlpha; }`,
    fragmentShader: `
      precision mediump float; uniform float uDim; varying vec3 vColor; varying float vAlpha;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = 1.0 - smoothstep(0.40, 0.5, d);
        if (a <= 0.001) discard; gl_FragColor = vec4(vColor, a * vAlpha * uDim); }`,
    transparent: true, depthWrite: false, depthTest: false,
  });
  const points = new THREE.Points(geo, pointMat);
  points.frustumCulled = false;
  scene.add(points);

  // 辺（辺ごとに 4 頂点・2 三角形。頂点シェーダで画面上の太さを付ける）
  const egeo = new THREE.BufferGeometry();
  const EV = MAX_EDGES * 4;
  const eStart = new Float32Array(EV * 3), eEnd = new Float32Array(EV * 3), eSide = new Float32Array(EV), eT = new Float32Array(EV), ealpha = new Float32Array(EV);
  const eIdx = new Uint16Array(MAX_EDGES * 6);
  for (let s = 0; s < MAX_EDGES; s++) {
    const b = s * 4;
    eSide[b] = -1; eT[b] = 0; eSide[b + 1] = 1; eT[b + 1] = 0; eSide[b + 2] = 1; eT[b + 2] = 1; eSide[b + 3] = -1; eT[b + 3] = 1;
    eIdx.set([b, b + 1, b + 2, b, b + 2, b + 3], s * 6);
  }
  egeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(EV * 3), 3));
  egeo.setAttribute('aStart', new THREE.BufferAttribute(eStart, 3));
  egeo.setAttribute('aEnd', new THREE.BufferAttribute(eEnd, 3));
  egeo.setAttribute('aSide', new THREE.BufferAttribute(eSide, 1));
  egeo.setAttribute('aT', new THREE.BufferAttribute(eT, 1));
  egeo.setAttribute('aAlpha', new THREE.BufferAttribute(ealpha, 1));
  egeo.setIndex(new THREE.BufferAttribute(eIdx, 1));
  const edgeMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color('#12173F') }, uAlpha: { value: 0.5 }, uDim: { value: 1 }, uRes: { value: new THREE.Vector2(1, 1) }, uWidth: { value: 2.5 } },
    vertexShader: `
      attribute vec3 aStart; attribute vec3 aEnd; attribute float aSide; attribute float aT; attribute float aAlpha;
      uniform vec2 uRes; uniform float uWidth; varying float vA;
      void main(){
        vec4 s = projectionMatrix * modelViewMatrix * vec4(aStart, 1.0);
        vec4 e = projectionMatrix * modelViewMatrix * vec4(aEnd, 1.0);
        vec2 sn = s.xy / s.w * uRes * 0.5; vec2 en = e.xy / e.w * uRes * 0.5;
        vec2 d = en - sn; float len = length(d);
        vec2 dir = len > 0.0001 ? d / len : vec2(1.0, 0.0);
        vec2 nrm = vec2(-dir.y, dir.x);
        vec4 p = mix(s, e, aT);
        vec2 pn = p.xy / p.w * uRes * 0.5 + nrm * aSide * uWidth * 0.5;
        gl_Position = vec4(pn / (uRes * 0.5) * p.w, p.z, p.w);
        vA = aAlpha;
      }`,
    fragmentShader: `precision mediump float; uniform vec3 uColor; uniform float uAlpha; uniform float uDim; varying float vA; void main(){ gl_FragColor = vec4(uColor, vA * uAlpha * uDim); }`,
    transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
  });
  const lines = new THREE.Mesh(egeo, edgeMat);
  lines.frustumCulled = false;
  scene.add(lines);
  const slots = []; for (let s = 0; s < MAX_EDGES; s++) slots.push({ i: -1, j: -1, a: 0, t: 0 });

  // 灯り（ぼんやり光る 1 枚のスプライト）
  const gc = document.createElement('canvas'); gc.width = gc.height = 128;
  const g2 = gc.getContext('2d'); const grad = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(0.35, 'rgba(255,255,255,0.45)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
  g2.fillStyle = grad; g2.fillRect(0, 0, 128, 128);
  const glowTex = new THREE.CanvasTexture(gc);
  const glowMat = new THREE.SpriteMaterial({ map: glowTex, color: '#F5B82E', transparent: true, opacity: 0, depthWrite: false, depthTest: false });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.set(2.6, 2.6, 1);
  scene.add(glow);

  // 状態
  let P = toPalette(PALETTE.light), theme = 'light';
  let formation = 'bulb';
  const params = { progress: 0, reveal: 0, lit: 0, events: 15, rot: 0 };
  const L = { side: 1, sideFactor: 0.55, scale: 1, halfW: 2, halfH: 2.18, time: 0, isMobile: isMobile(), mobileY: 1.0 };
  const skillLayout = F.layoutSkills();
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let dim = 1, dimT = 1, running = true, lastT = performance.now(), sinceSwitch = 9;
  let settled = 0;

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    L.halfH = 6 * Math.tan((camera.fov * Math.PI) / 360);
    L.halfW = L.halfH * camera.aspect;
    L.isMobile = isMobile();
    L.scale = L.isMobile ? Math.min(0.72, L.halfW * 0.6) : Math.min(1.05, L.halfW * 0.42);
    pointMat.uniforms.uProj.value = (h / (2 * Math.tan((camera.fov * Math.PI) / 360))) * dpr;
    edgeMat.uniforms.uRes.value.set(w, h);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function setTheme(t) {
    theme = t === 'dark' ? 'dark' : 'light';
    const p = PALETTE[theme];
    P = toPalette(p);
    edgeMat.uniforms.uColor.value.set(p.edge);
    edgeMat.uniforms.uAlpha.value = p.edgeAlpha;
    edgeMat.uniforms.uWidth.value = p.edgeWidth;
    glowMat.color.set(p.spark);
    glowMat.blending = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    glowMat.needsUpdate = true;
  }

  function assignEdges(list) {
    const want = new Map(list.map((e) => [e[0] < e[1] ? e[0] + ':' + e[1] : e[1] + ':' + e[0], e[2]]));
    for (const s of slots) {
      if (s.i < 0) continue;
      const k = s.i < s.j ? s.i + ':' + s.j : s.j + ':' + s.i;
      if (want.has(k)) { s.t = want.get(k); want.delete(k); } else s.t = 0;
    }
    for (const [k, a] of want) {
      let slot = slots.find((s) => s.i < 0) || slots.find((s) => s.t === 0 && s.a < 0.03) || slots.find((s) => s.t === 0);
      if (!slot) break;
      const [i, j] = k.split(':').map(Number);
      slot.i = i; slot.j = j; slot.a = 0; slot.t = a;
    }
  }

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    L.time += dt; sinceSwitch += dt;
    L.scroll = window.scrollY / window.innerHeight;
    mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 4));
    mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 4));
    dim += (dimT - dim) * (1 - Math.exp(-dt * 3));
    pointMat.uniforms.uDim.value = dim; edgeMat.uniforms.uDim.value = dim;

    // スマホでは文書内の枡（main.js が毎フレーム渡す）に形を置く
    L.box = (L.isMobile && params.boxes && params.boxes[formation]) || null;

    let edges;
    if (formation === 'bulb' || formation === 'lit') {
      const rot = mouse.x * 0.07 + Math.sin(L.time * 0.25) * 0.03 + (params.rot || 0);
      edges = F.bulb(tgt, L, P, { lit: formation === 'lit' ? params.lit : 0, rot });
    } else if (formation === 'path') edges = F.path(tgt, L, P, { rowYs: params.rowYs, rowLit: params.rowLit, events: params.events, pathX: L.isMobile ? params.pathX : null, pathAmp: L.isMobile ? params.pathAmp : null });
    else if (formation === 'chart') edges = F.chart(tgt, L, P, { reveal: params.reveal });
    else if (formation === 'graph') edges = F.graph(tgt, L, P, { layout: skillLayout });
    else edges = F.field(tgt, L, P, { dim: 1 });
    assignEdges(edges);

    const rate = formation === 'path' ? 3.2 + (14 - 3.2) * Math.min(1, sinceSwitch / 1.2) : 3.2;
    const kp = 1 - Math.exp(-dt * rate), ka = 1 - Math.exp(-dt * 4.5);
    let dist = 0;
    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      pos[i3] += (tgt.pos[i3] - pos[i3]) * kp; pos[i3 + 1] += (tgt.pos[i3 + 1] - pos[i3 + 1]) * kp; pos[i3 + 2] += (tgt.pos[i3 + 2] - pos[i3 + 2]) * kp;
      size[i] += (tgt.size[i] - size[i]) * ka; alpha[i] += (tgt.alpha[i] - alpha[i]) * ka;
      col[i3] += (tgt.col[i3] - col[i3]) * ka; col[i3 + 1] += (tgt.col[i3 + 1] - col[i3 + 1]) * ka; col[i3 + 2] += (tgt.col[i3 + 2] - col[i3 + 2]) * ka;
      if (i < F.N_MAIN) dist += Math.abs(tgt.pos[i3] - pos[i3]) + Math.abs(tgt.pos[i3 + 1] - pos[i3 + 1]);
    }
    settled = Math.max(0, 1 - dist / F.N_MAIN / 0.25); // 点が目標に着くまで辺は薄い
    geo.attributes.position.needsUpdate = true; geo.attributes.aSize.needsUpdate = true;
    geo.attributes.aColor.needsUpdate = true; geo.attributes.aAlpha.needsUpdate = true;

    for (let s = 0; s < MAX_EDGES; s++) {
      const sl = slots[s];
      sl.a += (sl.t * settled - sl.a) * ka;
      for (let v = 0; v < 4; v++) {
        const b = (s * 4 + v) * 3;
        if (sl.i >= 0) {
          eStart[b] = pos[sl.i * 3]; eStart[b + 1] = pos[sl.i * 3 + 1]; eStart[b + 2] = pos[sl.i * 3 + 2];
          eEnd[b] = pos[sl.j * 3]; eEnd[b + 1] = pos[sl.j * 3 + 1]; eEnd[b + 2] = pos[sl.j * 3 + 2];
        }
        ealpha[s * 4 + v] = sl.a;
      }
    }
    egeo.attributes.aStart.needsUpdate = true; egeo.attributes.aEnd.needsUpdate = true; egeo.attributes.aAlpha.needsUpdate = true;

    // 灯り
    const lit = formation === 'lit' ? params.lit : 0;
    const c = L.box ? { x: L.box.cx, y: L.box.cy } : L.isMobile ? { x: 0, y: L.mobileY } : { x: L.side * L.halfW * L.sideFactor, y: 0 };
    const gs = F.bulbScale(L);
    glow.position.set(c.x, c.y + 0.15 * gs, 0.2);
    glow.scale.set(2.8 * gs, 2.8 * gs, 1);
    glowMat.opacity += (lit * PALETTE[theme].glow * dim - glowMat.opacity) * ka;

    camera.position.x = mouse.x * 0.08; camera.position.y = -mouse.y * 0.06;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false; else if (!running) { running = true; lastT = performance.now(); requestAnimationFrame(frame); }
  });

  const v = new THREE.Vector3();
  return {
    setFormation(name, side) { if (name !== formation) sinceSwitch = 0; formation = name; if (side != null) L.side = side; },
    layout() { return { halfW: L.halfW, halfH: L.halfH, scale: L.scale, isMobile: L.isMobile }; },
    setParams(o) { Object.assign(params, o); },
    setDim(d) { dimT = d; },
    setTheme,
    resize,
    // 主要ノード i の画面座標（px）
    project(i) {
      v.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]).project(camera);
      return { x: ((v.x + 1) / 2) * window.innerWidth, y: ((1 - v.y) / 2) * window.innerHeight, alpha: alpha[i] };
    },
    get formation() { return formation; },
  };
}
