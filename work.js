/* MirWeb — work interactions
   1) Hover a project: a generative preview follows the cursor and tilts with your movement.
   2) Click / tap a project: a full-screen case study opens with a circular reveal from the click point.
      It has its own URL (#p-nocturne), closes with Esc / Back, and moves on to the next project.
   Everything below runs without GSAP (Web Animations API), so it also works if a CDN is slow. */
(function () {
  /* ------------------------------------------------------------------
     EDIT HERE: your projects.
     - tone: 'solid' | 'soft' | 'volt' (artwork style, used only when there is no img)
     - img: put a file path (e.g. 'assets/nocturne.jpg') to use a real image
       instead of the generated artwork, in both the hover preview and the case study.
     - desc/role/stack: replace with the real story of each project.
  ------------------------------------------------------------------ */
  var PROJECTS = [
    { id: 'nocturne', tone: 'volt',   title: 'Nocturne',   kind: 'Brand website',      year: '2026', pattern: 'rings', role: 'Design & Development', stack: 'GSAP · WebGL', img: '', desc: 'Full case study coming soon. This panel is ready for the story, images and video of the project.' },
    { id: 'halo-audio', tone: 'soft', title: 'Halo Audio', kind: '3D product page',    year: '2025', pattern: 'waves', role: 'Design & Development', stack: 'Three.js · GLSL', img: '', desc: 'Full case study coming soon. This panel is ready for the story, images and video of the project.' },
    { id: 'fieldnotes', tone: 'solid', title: 'Fieldnotes', kind: 'Editorial platform', year: '2025', pattern: 'lines', role: 'Design & Development', stack: 'Next.js · Figma', img: '', desc: 'Full case study coming soon. This panel is ready for the story, images and video of the project.' },
    { id: 'orbit-labs', tone: 'volt', title: 'Orbit Labs', kind: 'Web app',            year: '2024', pattern: 'dots', role: 'Design & Development', stack: 'Next.js · GSAP', img: '', desc: 'Full case study coming soon. This panel is ready for the story, images and video of the project.' },
    { id: 'pulse', tone: 'soft',      title: 'Pulse',      kind: 'Mobile landing',     year: '2024', pattern: 'waves', role: 'Design & Development', stack: 'GSAP · Figma', img: '', desc: 'Full case study coming soon. This panel is ready for the story, images and video of the project.' },
    { id: 'atlas', tone: 'solid',      title: 'Atlas',      kind: 'Data dashboard',     year: '2023', pattern: 'rings', role: 'Design & Development', stack: 'Next.js · D3', img: '', desc: 'Full case study coming soon. This panel is ready for the story, images and video of the project.' }
  ];

  var byId = {}, order = [];
  PROJECTS.forEach(function (p, i) { byId[p.id] = p; p.i = i; order.push(p.id); });

  var de = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  var EASE = 'cubic-bezier(.7,0,.2,1)', EASE_OUT = 'cubic-bezier(.2,.7,.2,1)';

  function tap() { try { navigator.vibrate && navigator.vibrate(8); } catch (e) {} }

  /* ---------- generative artwork (swap for real images via `img`) ---------- */
  function art(p) {
    if (p.img) return '<img src="' + p.img + '" alt="' + p.title + '" loading="lazy" decoding="async">';
    // Artwork from the palette: "solid" = bone panel, "soft" = tinted panel, "volt" = accent panel
    var tone = p.tone || 'solid', panel, ink;
    if (tone === 'volt') { panel = 'var(--acc)'; ink = 'var(--ink)'; }
    else if (tone === 'soft') { panel = 'color-mix(in srgb,var(--fg) 12%,var(--bg))'; ink = 'var(--fg)'; }
    else { panel = 'var(--fg)'; ink = 'var(--bg)'; }
    var S = 'style="stroke:' + ink + '"', F = 'style="fill:' + ink + '"', s = '', i, r, c;
    if (p.pattern === 'rings') {
      for (i = 1; i <= 10; i++) s += '<circle cx="270" cy="110" r="' + (i * i * 2.4 + 8) + '" fill="none" ' + S + ' stroke-opacity="' + (0.6 - i * 0.045).toFixed(2) + '" stroke-width="1.4"/>';
    } else if (p.pattern === 'waves') {
      for (i = 0; i < 10; i++) { var y = 60 + i * 21; s += '<path d="M0 ' + y + ' C 80 ' + (y - 42) + ', 140 ' + (y + 42) + ', 220 ' + y + ' S 340 ' + (y - 42) + ', 400 ' + y + '" fill="none" ' + S + ' stroke-opacity="' + (0.2 + i * 0.07).toFixed(2) + '" stroke-width="1.6"/>'; }
    } else if (p.pattern === 'lines') {
      for (i = 0; i < 24; i++) s += '<line x1="' + (i * 20) + '" y1="-10" x2="' + (i * 20 - 90 + i * 3) + '" y2="310" ' + S + ' stroke-opacity=".4" stroke-width="1.2"/>';
    } else {
      for (r = 0; r < 11; r++) for (c = 0; c < 15; c++) { var d = Math.sqrt((c - 9) * (c - 9) + (r - 4) * (r - 4)); s += '<circle cx="' + (c * 28 + 14) + '" cy="' + (r * 28 + 10) + '" r="' + Math.max(1, 7 - d * 0.75).toFixed(1) + '" ' + F + ' fill-opacity=".8"/>'; }
    }
    return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" style="fill:' + panel + '"/>' + s + '</svg>';
  }

  /* ---------- 1) hover preview that follows the cursor ---------- */
  var pv = document.getElementById('pv');
  var rows = document.querySelectorAll('.work a[data-id]');
  var tilt = 0, tiltT;

  if (pv && canHover) {
    rows.forEach(function (a) {
      var p = byId[a.dataset.id];
      if (!p) return;
      a.addEventListener('mouseenter', function () {
        pv.innerHTML = art(p) + '<div class="pv-cap"><b>' + p.title + '</b><span>' + p.kind + ' · ' + p.year + '</span></div>';
        pv.style.opacity = 1;
        pv.style.transform = 'translate(-50%,-50%) scale(1) rotate(0deg)';
      });
      a.addEventListener('mouseleave', function () {
        pv.style.opacity = 0;
        pv.style.transform = 'translate(-50%,-50%) scale(.6) rotate(0deg)';
      });
      a.addEventListener('mousemove', function (e) {
        // tilt the card with horizontal speed, then settle
        tilt = Math.max(-14, Math.min(14, e.movementX * 0.6));
        pv.style.transform = 'translate(-50%,-50%) scale(1) rotate(' + tilt + 'deg)';
        clearTimeout(tiltT);
        tiltT = setTimeout(function () { pv.style.transform = 'translate(-50%,-50%) scale(1) rotate(0deg)'; }, 90);
      });
    });
  }

  /* small thumbnails for touch screens (no hover there) */
  if (!canHover) {
    rows.forEach(function (a) {
      var p = byId[a.dataset.id];
      if (p) a.insertAdjacentHTML('beforeend', '<span class="th" aria-hidden="true">' + art(p) + '</span>');
    });
  }

  /* ---------- 2) case-study overlay ---------- */
  var box = document.getElementById('case');
  if (!box) return;
  var $ = function (id) { return document.getElementById(id); };
  var xBtn = $('case-x'), nextBtn = $('case-next');
  var current = null, pushed = false, closing = false, lastFocus = null, anim = null;

  function fill(p) {
    $('case-kind').textContent = p.kind + ' · ' + p.year;
    $('case-title').textContent = p.title;
    $('case-desc').textContent = p.desc;
    $('case-year').textContent = p.year;
    $('case-role').textContent = p.role;
    $('case-stack').textContent = p.stack;
    $('case-art').innerHTML = art(p);
    var n = byId[order[(p.i + 1) % order.length]];
    $('case-next-t').textContent = n.title + ' →';
    nextBtn.dataset.id = n.id;
  }

  function stagger(delay) {
    if (reduce || !box.animate) return;
    box.querySelectorAll('[data-in]').forEach(function (el, i) {
      el.animate([{ opacity: 0, transform: 'translateY(44px)' }, { opacity: 1, transform: 'none' }], { duration: 850, delay: delay + i * 90, easing: EASE_OUT, fill: 'backwards' });
    });
    var a = $('case-art');
    if (a && a.firstElementChild) a.firstElementChild.animate([{ transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 1400, delay: delay, easing: EASE_OUT });
  }

  function openCase(id, x, y, instant, noPush) {
    var p = byId[id];
    if (!p) return;
    if (anim) { anim.cancel(); anim = null; }
    closing = false;
    current = p.id;
    fill(p);
    var wasHidden = box.hidden;
    box.hidden = false;
    box.scrollTop = 0;
    de.classList.add('case-open');
    if (window.__l && window.__l.stop) window.__l.stop();
    if (wasHidden) lastFocus = document.activeElement;
    if (!noPush) { try { history.pushState({ p: p.id }, '', '#p-' + p.id); pushed = true; } catch (e) { pushed = false; } }
    tap();

    if (!instant && !reduce && box.animate && wasHidden) {
      var r = Math.sqrt(Math.pow(Math.max(x, innerWidth - x), 2) + Math.pow(Math.max(y, innerHeight - y), 2));
      anim = box.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + Math.ceil(r) + 'px at ' + x + 'px ' + y + 'px)'] }, { duration: 850, easing: EASE });
      anim.onfinish = function () { anim = null; };
      stagger(380);
    } else if (!wasHidden) {
      stagger(0);
    }
    xBtn.focus({ preventScroll: true });
  }

  function finishClose() {
    box.hidden = true;
    de.classList.remove('case-open');
    if (window.__l && window.__l.start) window.__l.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    current = null;
    closing = false;
  }

  function closeCase(fromPop) {
    if (box.hidden || closing) return;
    closing = true;
    if (anim) { anim.cancel(); anim = null; }
    if (!fromPop && location.hash.indexOf('#p-') === 0) {
      try {
        if (pushed) { pushed = false; history.back(); }          // popstate will finish the job
        else history.replaceState(null, '', location.pathname + location.search + '#work');
      } catch (e) {}
    }
    var r = xBtn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (!reduce && box.animate) {
      var R = Math.sqrt(Math.pow(Math.max(x, innerWidth - x), 2) + Math.pow(Math.max(y, innerHeight - y), 2));
      anim = box.animate({ clipPath: ['circle(' + Math.ceil(R) + 'px at ' + x + 'px ' + y + 'px)', 'circle(0px at ' + x + 'px ' + y + 'px)'] }, { duration: 650, easing: EASE });
      anim.onfinish = function () { anim = null; finishClose(); };
      anim.oncancel = function () { /* reopened mid-close */ };
    } else finishClose();
  }

  /* triggers */
  function center(el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function trigger(el, e) {
    var x = e && e.clientX, y = e && e.clientY;
    if (!x && !y) { var c = center(el); x = c[0]; y = c[1]; }          // keyboard activation
    if (pv) { pv.style.opacity = 0; }
    openCase(el.dataset.id, x, y, false, false);
  }
  document.querySelectorAll('.work a[data-id]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); trigger(a, e); });
  });
  document.querySelectorAll('.card[data-id]').forEach(function (c) {
    c.addEventListener('click', function (e) { trigger(c, e); });
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(c, null); } });
  });

  xBtn.addEventListener('click', function () { closeCase(false); });
  nextBtn.addEventListener('click', function () {
    var id = nextBtn.dataset.id;
    box.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    openCase(id, 0, 0, true, true);                       // swap content in place, no new history entry
    try { history.replaceState(history.state, '', '#p-' + id); } catch (e) {}
  });
  addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeCase(false); }
    else if (e.key === 'Tab') {                                       // keep focus inside the dialog
      var f = box.querySelectorAll('button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Back / forward buttons and direct links (#p-nocturne) */
  addEventListener('popstate', function () {
    var h = location.hash;
    if (h.indexOf('#p-') === 0 && byId[h.slice(3)]) openCase(h.slice(3), innerWidth / 2, innerHeight / 2, true, true);
    else if (!box.hidden) closeCase(true);
  });
  if (location.hash.indexOf('#p-') === 0 && byId[location.hash.slice(3)]) {
    openCase(location.hash.slice(3), innerWidth / 2, innerHeight / 2, true, true);
  }
})();
