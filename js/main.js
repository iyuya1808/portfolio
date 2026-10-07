/* メニューの開閉と、表紙の電球の点をつまんで遊ぶ仕掛け。
   スクロール位置は毎フレーム読まない（スクロールの動きは CSS の animation-timeline）。 */
(function () {
  var btn = document.getElementById('menuToggle');
  var menu = document.getElementById('menu');
  if (!btn || !menu) return;
  function set(open) {
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { set(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
})();

/* 表紙の電球（PC のマウスだけ）: 点をドラッグすると線が伸び、つながった点がばねで引っぱられる。
   離すと元の形に戻る。動くのは触っている間と戻るまでだけ。 */
(function () {
  var svg = document.querySelector('.bulb');
  if (!svg || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var circles = Array.prototype.slice.call(svg.querySelectorAll('circle'));
  var nodes = circles.map(function (c) {
    var x = +c.getAttribute('cx'), y = +c.getAttribute('cy');
    return { el: c, rx: x, ry: y, x: x, y: y, vx: 0, vy: 0 };
  });
  function find(x, y) {
    for (var i = 0; i < nodes.length; i++) if (nodes[i].rx === x && nodes[i].ry === y) return nodes[i];
    return null;
  }
  var edges = [];
  Array.prototype.forEach.call(svg.querySelectorAll('line'), function (l) {
    var a = find(+l.getAttribute('x1'), +l.getAttribute('y1'));
    var b = find(+l.getAttribute('x2'), +l.getAttribute('y2'));
    if (a && b) edges.push({ el: l, a: a, b: b, len: Math.hypot(a.rx - b.rx, a.ry - b.ry) });
  });

  var grabbed = null, px = 0, py = 0, raf = 0;
  svg.classList.add('is-playable');

  function toSvg(e) {
    return new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
  }
  function step() {
    var moving = false;
    nodes.forEach(function (n) {
      if (n === grabbed) return;
      n.vx += (n.rx - n.x) * 0.018;
      n.vy += (n.ry - n.y) * 0.018;
    });
    edges.forEach(function (e) {
      var dx = e.b.x - e.a.x, dy = e.b.y - e.a.y;
      var d = Math.hypot(dx, dy) || 1;
      var f = (d - e.len) * 0.06 / d;
      if (e.a !== grabbed) { e.a.vx += dx * f; e.a.vy += dy * f; }
      if (e.b !== grabbed) { e.b.vx -= dx * f; e.b.vy -= dy * f; }
    });
    nodes.forEach(function (n) {
      if (n === grabbed) { n.x = px; n.y = py; n.vx = n.vy = 0; moving = true; }
      else {
        n.vx *= 0.8; n.vy *= 0.8;
        n.x += n.vx; n.y += n.vy;
        if (Math.abs(n.vx) + Math.abs(n.vy) > 0.02 || Math.abs(n.x - n.rx) + Math.abs(n.y - n.ry) > 0.05) moving = true;
        else { n.x = n.rx; n.y = n.ry; }
      }
      n.el.setAttribute('cx', n.x.toFixed(2));
      n.el.setAttribute('cy', n.y.toFixed(2));
    });
    edges.forEach(function (e) {
      e.el.setAttribute('x1', e.a.x.toFixed(2)); e.el.setAttribute('y1', e.a.y.toFixed(2));
      e.el.setAttribute('x2', e.b.x.toFixed(2)); e.el.setAttribute('y2', e.b.y.toFixed(2));
    });
    raf = moving ? requestAnimationFrame(step) : 0;
  }
  function wake() { if (!raf) raf = requestAnimationFrame(step); }

  svg.addEventListener('pointerdown', function (e) {
    var c = e.target.closest('circle');
    if (!c) return;
    grabbed = nodes[circles.indexOf(c)];
    var p = toSvg(e); px = p.x; py = p.y;
    svg.setPointerCapture(e.pointerId);
    svg.classList.add('is-grabbing');
    e.preventDefault();
    wake();
  });
  svg.addEventListener('pointermove', function (e) {
    if (!grabbed) return;
    var p = toSvg(e);
    // 元の位置から離れすぎないように（電球の形が分かるくらいまで）
    var dx = p.x - grabbed.rx, dy = p.y - grabbed.ry, d = Math.hypot(dx, dy), max = 140;
    if (d > max) { dx *= max / d; dy *= max / d; }
    px = grabbed.rx + dx; py = grabbed.ry + dy;
    wake();
  });
  function release() {
    if (!grabbed) return;
    grabbed = null;
    svg.classList.remove('is-grabbing');
    wake();
  }
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);
})();
