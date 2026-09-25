// 確認用（?diag=1 のときだけ読み込む）: スマホで指スクロール中の 1 コマごとの様子を記録して送る
// 記録: 描画の間隔、JS から見えるスクロール位置、ticker（main.js）と点群の描画（scene.js）にかかった時間
const d = { scene: 0, tick: 0, t0: 0, touching: false, lastTouchEnd: -1e9 };
window.__diag = d;

const rows = []; // [t, scrollY, touching, tickMs, sceneMs]
const WANT_MS = 10000; // 指で動かしている間（離して 1.5 秒の慣性も含む）の合計
let active = 0, lastT = 0, sent = false;

addEventListener('touchstart', () => { d.touching = true; }, { passive: true });
addEventListener('touchend', () => { d.touching = false; d.lastTouchEnd = performance.now(); }, { passive: true });

const box = document.createElement('div');
box.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99;background:#000c;color:#fff;font:12px/1.4 monospace;padding:6px 8px;border-radius:6px;pointer-events:none';
box.textContent = '計測: 指でスクロールしてください';
document.body.appendChild(box);

export function tickStart() { d.t0 = performance.now(); }
export function tickEnd() { d.tick = performance.now() - d.t0; }

function loop(t) {
  if (sent) return;
  requestAnimationFrame(loop);
  const moving = d.touching || t - d.lastTouchEnd < 1500;
  if (moving) {
    if (lastT) active += Math.min(100, t - lastT);
    rows.push([Math.round(t * 10) / 10, Math.round(window.scrollY * 10) / 10, d.touching ? 1 : 0, Math.round(d.tick * 100) / 100, Math.round(d.scene * 100) / 100]);
    box.textContent = `計測中 ${Math.min(100, Math.round(active / WANT_MS * 100))}%`;
  }
  lastT = t;
  if (active >= WANT_MS) send();
}
requestAnimationFrame(loop);

function send() {
  sent = true;
  const body = JSON.stringify({
    ua: navigator.userAgent, dpr: devicePixelRatio, w: innerWidth, h: innerHeight,
    sync: new URLSearchParams(location.search).has('sync'), rows,
  });
  fetch('diag.php', { method: 'POST', body, keepalive: true })
    .then((r) => { box.textContent = r.ok ? '計測完了・送信しました' : '送信失敗 ' + r.status; })
    .catch(() => { box.textContent = '送信失敗'; });
}
