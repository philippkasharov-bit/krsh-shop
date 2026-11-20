/* KRSH 360° viewer: a pre-rendered image sequence instead of live WebGL.
   Frames are rendered offline from the full-quality 6.3 MB model (media/venom-360/f00–f47.webp,
   frame 0 = side profile), so the shoe looks exactly like the source on any device.
   - drag / swipe to scrub (touch-action: pan-y keeps vertical page scroll)
   - keyboard: it is a slider; ← → step 7.5°, Home resets to the side profile
   - auto-turn when idle; off under prefers-reduced-motion, paused off-screen / hidden tab
   - frame 0 ships in the markup; the other 47 load after window "load"
   Usage: const s = KrshSpin.mount(el, { base: 'media/venom-360/f', count: 48, label: '…' });
          s.extra = 2.5;  // caller-driven offset in frames (cursor tilt, scene-switch spin) */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mount(el, opts) {
    const N = opts.count || 48;
    const src = i => opts.base + String(i).padStart(2, '0') + '.webp';
    const img = el.querySelector('img') || el.appendChild(document.createElement('img'));
    img.draggable = false;
    img.alt = '';
    el.classList.add('spin360');
    el.tabIndex = 0;
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', opts.label || '360° view. Drag or use the arrow keys to turn.');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '360');

    const loaded = new Array(N).fill(false);
    loaded[0] = true;
    const preload = () => {
      for (let i = 1; i < N; i++) {
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => { loaded[i] = true; };
        im.src = src(i);
      }
    };
    if (document.readyState === 'complete') preload(); else window.addEventListener('load', preload, { once: true });

    const state = { pos: 0, extra: 0, shown: -1, auto: !reduce && opts.autoplay !== false, dragging: false, resumeAt: 0 };
    const SPEED = N / 9000; // one revolution per 9 s

    // nearest loaded frame, so scrubbing works while the rest are still downloading
    function nearest(i) {
      for (let d = 0; d < N / 2; d++) {
        if (loaded[(i + d) % N]) return (i + d) % N;
        if (loaded[(i - d + N) % N]) return (i - d + N) % N;
      }
      return 0;
    }
    function draw() {
      const i = ((Math.round(state.pos + state.extra) % N) + N) % N;
      const f = nearest(i);
      if (f !== state.shown) {
        img.src = src(f);
        state.shown = f;
        const deg = Math.round(f * 360 / N);
        el.setAttribute('aria-valuenow', String(deg));
        el.setAttribute('aria-valuetext', deg + ' degrees');
      }
    }

    // drag
    let lastX = 0;
    el.addEventListener('pointerdown', e => {
      state.dragging = true; lastX = e.clientX;
      el.setPointerCapture(e.pointerId); el.classList.add('is-dragging');
    });
    el.addEventListener('pointermove', e => {
      if (!state.dragging) return;
      const w = el.getBoundingClientRect().width || 1;
      state.pos -= (e.clientX - lastX) * N / (w * 1.2); // one revolution ≈ 1.2× the viewer width
      lastX = e.clientX; draw();
    });
    const end = () => { if (!state.dragging) return; state.dragging = false; el.classList.remove('is-dragging'); state.resumeAt = performance.now() + 1500; };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);

    // keyboard
    el.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 6, PageDown: -6 }[e.key];
      if (step) { state.pos += step; }
      else if (e.key === 'Home') { state.pos = 0; }
      else return;
      e.preventDefault(); state.resumeAt = performance.now() + 3000; draw();
    });
    el.addEventListener('focus', () => { state.resumeAt = Infinity; });
    el.addEventListener('blur', () => { state.resumeAt = performance.now() + 1500; });

    // loop: only while visible
    let visible = true, raf = 0, last = 0;
    function tick(t) {
      const dt = last ? Math.min(t - last, 64) : 0; last = t;
      if (state.auto && !state.dragging && t > state.resumeAt) state.pos += dt * SPEED;
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
      frames: N,
      el
    };
  }

  window.KrshSpin = { mount };
})();
