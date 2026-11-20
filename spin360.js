/* KRSH 360° viewer: a pre-rendered image sequence instead of live WebGL.
   Frames are rendered offline from the full-quality 6.3 MB model (media/venom-360/f00–f47.webp,
   frame 0 = side profile), so the shoe looks exactly like the source on any device.
   - frames are decoded up front (createImageBitmap / decode) and drawn on a <canvas>:
     no <img> src swaps, so no flashes or decode stutter while turning
   - drag / swipe to scrub with release momentum (touch-action: pan-y keeps page scroll)
   - keyboard: it is a slider; ← → step 7.5°, PageUp/PageDown 45°, Home = side profile
   - auto-turn (5 s / rev) starts only once every frame is ready; off under reduced motion,
     paused while off-screen or in a hidden tab
   Usage: const s = KrshSpin.mount(el, { base: 'media/venom-360/f', count: 48, label: '…' });
          s.extra = 2.5;  // caller-driven offset in frames (cursor lean, scene-switch spin) */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mount(el, opts) {
    const N = opts.count || 48;
    const src = i => opts.base + String(i).padStart(2, '0') + '.webp';
    const poster = el.querySelector('img'); // frame 0 in the markup: instant first paint, no-JS fallback
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.setAttribute('aria-hidden', 'true');
    el.appendChild(canvas);
    el.classList.add('spin360');
    el.tabIndex = 0;
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', opts.label || '360° view. Drag or use the arrow keys to turn.');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '360');

    const frames = new Array(N).fill(null);
    let ready = 0, allReady = false;
    const decode = (i) => {
      const im = new Image();
      im.decoding = 'async';
      im.src = src(i);
      const done = (bmp) => {
        frames[i] = bmp; ready++;
        if (i === 0) { sizeCanvas(); el.classList.add('is-canvas'); state.shown = -1; draw(); }
        if (ready === N) { allReady = true; el.classList.add('is-ready'); }
      };
      (im.decode ? im.decode() : new Promise(r => { im.onload = r; }))
        .then(() => (window.createImageBitmap ? createImageBitmap(im) : im))
        .then(done, () => { ready++; });
    };
    decode(0);
    const preload = () => { for (let i = 1; i < N; i++) decode(i); };
    if (document.readyState === 'complete') preload(); else window.addEventListener('load', preload, { once: true });

    function sizeCanvas() {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round((r.width || 600) * dpr);
      if (canvas.width !== w) { canvas.width = w; canvas.height = w; state.shown = -1; }
    }
    window.addEventListener('resize', () => { sizeCanvas(); draw(); }, { passive: true });

    const state = { pos: 0, extra: 0, vel: 0, shown: -1, auto: !reduce && opts.autoplay !== false, dragging: false, resumeAt: 0 };
    const SPEED = N / 5000; // one revolution per 5 s

    function nearest(i) {
      for (let d = 0; d < N / 2; d++) {
        if (frames[(i + d) % N]) return (i + d) % N;
        if (frames[(i - d + N) % N]) return (i - d + N) % N;
      }
      return -1;
    }
    function draw() {
      const i = ((Math.round(state.pos + state.extra) % N) + N) % N;
      const f = nearest(i);
      if (f < 0 || f === state.shown) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frames[f], 0, 0, canvas.width, canvas.height);
      state.shown = f;
      const deg = Math.round(f * 360 / N);
      el.setAttribute('aria-valuenow', String(deg));
      el.setAttribute('aria-valuetext', deg + ' degrees');
    }

    // drag: one revolution ≈ 0.8× the viewer width; velocity carries on after release
    let lastX = 0, lastT = 0;
    el.addEventListener('pointerdown', e => {
      state.dragging = true; state.vel = 0; lastX = e.clientX; lastT = e.timeStamp;
      el.setPointerCapture(e.pointerId); el.classList.add('is-dragging');
    });
    el.addEventListener('pointermove', e => {
      if (!state.dragging) return;
      const w = el.getBoundingClientRect().width || 1;
      const d = -(e.clientX - lastX) * N / (w * 0.8);
      const dt = Math.max(e.timeStamp - lastT, 1);
      state.pos += d;
      state.vel = state.vel * 0.6 + (d / dt) * 0.4; // frames per ms, smoothed
      lastX = e.clientX; lastT = e.timeStamp; draw();
    });
    const end = () => {
      if (!state.dragging) return;
      state.dragging = false; el.classList.remove('is-dragging');
      if (reduce) state.vel = 0;
      state.resumeAt = performance.now() + 1200;
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);

    el.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 6, PageDown: -6 }[e.key];
      if (step) state.pos += step;
      else if (e.key === 'Home') state.pos = 0;
      else return;
      e.preventDefault(); state.vel = 0; state.resumeAt = performance.now() + 2500; draw();
    });
    el.addEventListener('focus', () => { state.resumeAt = Infinity; });
    el.addEventListener('blur', () => { state.resumeAt = performance.now() + 1200; });

    let visible = true, raf = 0, last = 0;
    function tick(t) {
      const dt = last ? Math.min(t - last, 50) : 0; last = t;
      if (!state.dragging) {
        if (Math.abs(state.vel) > 0.0005) { state.pos += state.vel * dt; state.vel *= Math.pow(0.94, dt / 16); }
        else { state.vel = 0; if (state.auto && allReady && t > state.resumeAt) state.pos += dt * SPEED; }
      }
      draw();
      raf = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    }
    const kick = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); };
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(el);
    document.addEventListener('visibilitychange', kick);
    kick();

    return {
      get extra() { return state.extra; },
      set extra(v) { state.extra = v; },
      get ready() { return allReady; },
      frames: N,
      el
    };
  }

  window.KrshSpin = { mount };
})();
