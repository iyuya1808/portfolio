// 画面奥に固定した 1 枚の WebGL キャンバス。点群が章ごとに形を変える。
import * as THREE from '../assets/vendor/three.module.min.js';
import * as F from './formations.js';

const PALETTE = {
  light: { navy: '#1F2A8C', sky: '#1DA3E8', ink: '#12173F', spark: '#F5B82E', red: '#E30613', green: '#23AB39', green2: '#0A7A45', purple: '#7E308F', yellow: '#F8B62D', edge: '#12173F', edgeAlpha: 0.32, dustAlpha: 0.22, glow: 0.3, additive: false },
  dark:  { navy: '#5563E8', sky: '#4FC1FF', ink: '#EEF1FA', spark: '#FFC94D', red: '#FF5A69', green: '#3ED069', green2: '#2CB57A', purple: '#C07BE0', yellow: '#FFC94D', edge: '#EEF1FA', edgeAlpha: 0.28, dustAlpha: 0.3, glow: 0.9, additive: true },
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
    const u = F.hash(i, 31), v = F.hash(i, 32), r = 4 + 3 * F.hash(i, 33);
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

  // 辺
  const egeo = new THREE.BufferGeometry();
  const epos = new Float32Array(MAX_EDGES * 2 * 3), ealpha = new Float32Array(MAX_EDGES * 2);
  egeo.setAttribute('position', new THREE.BufferAttribute(epos, 3));
  egeo.setAttribute('aAlpha', new THREE.BufferAttribute(ealpha, 1));
  const edgeMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color('#12173F') }, uAlpha: { value: 0.3 }, uDim: { value: 1 } },
    vertexShader: `attribute float aAlpha; varying float vA; void main(){ vA = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `precision mediump float; uniform vec3 uColor; uniform float uAlpha; uniform float uDim; varying float vA; void main(){ gl_FragColor = vec4(uColor, vA * uAlpha * uDim); }`,
    transparent: true, depthWrite: false, depthTest: false,
  });
  const lines = new THREE.LineSegments(egeo, edgeMat);
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
  let dim = 1, dimT = 1, running = true, lastT = performance.now();
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
    L.time += dt;
    mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 4));
    mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 4));
    dim += (dimT - dim) * (1 - Math.exp(-dt * 3));
    pointMat.uniforms.uDim.value = dim; edgeMat.uniforms.uDim.value = dim;

    let edges;
    if (formation === 'bulb' || formation === 'lit') {
      const rot = mouse.x * 0.22 + Math.sin(L.time * 0.25) * 0.09 + (params.rot || 0);
      edges = F.bulb(tgt, L, P, { lit: formation === 'lit' ? params.lit : 0, rot });
    } else if (formation === 'path') edges = F.path(tgt, L, P, { progress: params.progress, events: params.events });
    else if (formation === 'chart') edges = F.chart(tgt, L, P, { reveal: params.reveal });
    else if (formation === 'graph') edges = F.graph(tgt, L, P, { layout: skillLayout });
    else edges = F.field(tgt, L, P, { dim: 1 });
    assignEdges(edges);

    const kp = 1 - Math.exp(-dt * 3.2), ka = 1 - Math.exp(-dt * 4.5);
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
      const sl = slots[s], b = s * 6;
      sl.a += (sl.t * settled - sl.a) * ka;
      if (sl.i >= 0) {
        epos[b] = pos[sl.i * 3]; epos[b + 1] = pos[sl.i * 3 + 1]; epos[b + 2] = pos[sl.i * 3 + 2];
        epos[b + 3] = pos[sl.j * 3]; epos[b + 4] = pos[sl.j * 3 + 1]; epos[b + 5] = pos[sl.j * 3 + 2];
      }
      ealpha[s * 2] = ealpha[s * 2 + 1] = sl.a;
    }
    egeo.attributes.position.needsUpdate = true; egeo.attributes.aAlpha.needsUpdate = true;

    // 灯り
    const lit = formation === 'lit' ? params.lit : 0;
    const c = L.isMobile ? { x: 0, y: L.mobileY } : { x: L.side * L.halfW * L.sideFactor, y: 0 };
    glow.position.set(c.x, c.y + 0.15 * L.scale, 0.2);
    glow.scale.set(2.8 * L.scale, 2.8 * L.scale, 1);
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
    setFormation(name, side) { formation = name; if (side != null) L.side = side; },
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
