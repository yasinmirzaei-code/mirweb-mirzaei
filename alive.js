/* MirWeb — signature interaction: "Alive"
   Words made of living particles. They breathe, flee from your cursor / finger,
   and re-form into the next word on click or tap. */
(function () {
  var cv = document.getElementById('alive-cv');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  if (!ctx) return;

  var WORDS = ['ALIVE', 'MOTION', 'DETAIL', 'MIRWEB'];
  var CYCLE_MS = 4800;
  function FONT(px) { return '700 ' + px + 'px "Bricolage Grotesque", Inter, system-ui, sans-serif'; }

  var stage = cv.parentNode;
  var counter = document.getElementById('al-count');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var off = document.createElement('canvas');
  var octx = off.getContext('2d', { willReadFrequently: true });

  var W = 0, H = 0, dpr = 1, gap = 5, fg = '#ece9e2', hi = '#d6ff3d';
  var P = [];              // particles
  var targets = [];        // targets[wordIndex] = Float32Array [x0,y0,x1,y1,...]
  var word = 0, last = 0, visible = false, running = false;
  var px = -9999, py = -9999, cx = -9999, cy = -9999, pActive = false;

  function readColor() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim();
    fg = v || '#ece9e2';
    hi = getComputedStyle(document.documentElement).getPropertyValue('--hi').trim() || '#d6ff3d';
  }

  function sample(text) {
    off.width = W; off.height = H;
    octx.clearRect(0, 0, W, H);
    var fs = H * 0.62;
    octx.font = FONT(fs);
    var w = octx.measureText(text).width;
    if (w > W * 0.9) { fs *= (W * 0.9) / w; octx.font = FONT(fs); }
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillStyle = '#fff';
    octx.fillText(text, W / 2, H / 2 + fs * 0.04);
    var d = octx.getImageData(0, 0, W, H).data, pts = [];
    for (var y = 0; y < H; y += gap) {
      for (var x = 0; x < W; x += gap) {
        if (d[(y * W + x) * 4 + 3] > 128) pts.push(x + (Math.random() - .5) * gap * .6, y + (Math.random() - .5) * gap * .6);
      }
    }
    return pts;
  }

  function assign(pts, count) {
    // Fit any number of target points onto exactly `count` particles
    var n = pts.length / 2, out = new Float32Array(count * 2);
    if (!n) return out;
    var order = [], i;
    for (i = 0; i < n; i++) order.push(i);
    for (i = n - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, t = order[i]; order[i] = order[j]; order[j] = t; }
    for (i = 0; i < count; i++) {
      var k = order[i % n];
      out[i * 2] = pts[k * 2];
      out[i * 2 + 1] = pts[k * 2 + 1];
    }
    return out;
  }

  function build() {
    var r = stage.getBoundingClientRect();
    W = Math.max(200, Math.round(r.width));
    H = Math.max(200, Math.round(r.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = Math.max(3, Math.min(6, Math.round(W / 240)));
    readColor();

    var raw = WORDS.map(sample), count = 0;
    raw.forEach(function (p) { count = Math.max(count, p.length / 2); });
    count = Math.min(count, 6500);
    targets = raw.map(function (p) { return assign(p, count); });

    var t0 = targets[word];
    P = [];
    for (var i = 0; i < count; i++) {
      P.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0, vy: 0,
        s: 1.8 + Math.random() * 1.2,
        o: Math.random() * 6.28
      });
      if (reduce) { P[i].x = t0[i * 2]; P[i].y = t0[i * 2 + 1]; }
    }
    if (reduce) draw();
  }

  function setWord(n, burst) {
    word = (n + WORDS.length) % WORDS.length;
    last = performance.now();
    if (counter) counter.textContent = '0' + (word + 1);
    var t = targets[word];
    for (var i = 0; i < P.length; i++) {
      if (reduce) { P[i].x = t[i * 2]; P[i].y = t[i * 2 + 1]; continue; }
      if (burst) {
        var a = Math.random() * 6.283, f = 4 + Math.random() * 9;
        P[i].vx += Math.cos(a) * f; P[i].vy += Math.sin(a) * f;
      }
    }
    if (reduce) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var i, p, s2;
    ctx.fillStyle = fg;
    ctx.beginPath();
    for (i = 0; i < P.length; i++) {
      p = P[i]; s2 = p.vx * p.vx + p.vy * p.vy;
      if (s2 <= 1.2) ctx.rect(p.x, p.y, p.s, p.s);
    }
    ctx.fill();
    ctx.fillStyle = hi;
    ctx.beginPath();
    for (i = 0; i < P.length; i++) {
      p = P[i]; s2 = p.vx * p.vx + p.vy * p.vy;
      if (s2 > 1.2) ctx.rect(p.x - .3, p.y - .3, p.s + .6, p.s + .6);
    }
    ctx.fill();
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || reduce || !P.length) return;

    if (now - last > CYCLE_MS && !pActive) setWord(word + 1, true);

    // pointer position relative to stage (recomputed each frame so smooth-scroll stays accurate)
    var r = stage.getBoundingClientRect();
    var tx = pActive ? cx - r.left : -9999, ty = pActive ? cy - r.top : -9999;
    px += (tx - px) * .35; py += (ty - py) * .35;
    if (!pActive) { px = tx; py = ty; }

    var R = Math.min(170, W * .2), R2 = R * R, t = targets[word], time = now * .001;
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      var dx = t[i * 2] - p.x + Math.sin(time * 1.3 + p.o) * .7;
      var dy = t[i * 2 + 1] - p.y + Math.cos(time * 1.1 + p.o) * .7;
      p.vx += dx * .05; p.vy += dy * .05;

      var mx = p.x - px, my = p.y - py, d2 = mx * mx + my * my;
      if (d2 < R2 && d2 > 0.01) {
        var d = Math.sqrt(d2), f = (1 - d / R); f *= f * 11;
        p.vx += (mx / d) * f; p.vy += (my / d) * f;
      }
      p.vx *= .86; p.vy *= .86;
      p.x += p.vx; p.y += p.vy;
    }
    draw();
  }

  /* input — pointer events cover mouse, touch and pen; vertical page scroll still works on touch */
  stage.addEventListener('pointermove', function (e) {
    cx = e.clientX; cy = e.clientY;
    if (!pActive) { pActive = true; var r = stage.getBoundingClientRect(); px = cx - r.left; py = cy - r.top; }
  });
  function leave() { pActive = false; }
  stage.addEventListener('pointerleave', leave);
  stage.addEventListener('pointercancel', leave);
  stage.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') leave(); });

  var downX = 0, downY = 0;
  stage.addEventListener('pointerdown', function (e) { downX = e.clientX; downY = e.clientY; cx = e.clientX; cy = e.clientY; pActive = true; });
  stage.addEventListener('click', function (e) {
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 12) return;
    setWord(word + 1, true);
    try { navigator.vibrate && navigator.vibrate(8); } catch (err) {}
  });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setWord(word + 1, true); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) last = performance.now(); }, { threshold: .05 }).observe(stage);
  } else { visible = true; }

  var rt;
  addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 200); });
  if (window.matchMedia) {
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { readColor(); if (reduce) draw(); }); } catch (e) {}
  }

  function start() {
    build();
    setWord(0, false);
    if (!running) { running = true; requestAnimationFrame(frame); }
  }
  if (document.fonts && document.fonts.load) {
    // wait (max 2.5s) for the display font so the particles sample the real letterforms
    Promise.race([document.fonts.load('700 100px "Bricolage Grotesque"'), new Promise(function (r) { setTimeout(r, 2500); })]).then(start, start);
  } else start();

  if (window.gsap && window.ScrollTrigger) {
    gsap.from('.alive .label,.alive .hint', { y: 40, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.alive', start: 'top 80%' } });
  }
})();
