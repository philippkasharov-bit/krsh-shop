/* KRSH v2 hero — floating product stage.
   Motion system adapted from the GetLayers "Soda" template (commercial licence): cursor lean (lerp 0.14),
   parallax layers, pointer repulsion (r 400 / -80), rising particles, and a scene switch with a full
   revolution + implode/explode. The product is a 360° image sequence (spin360.js), freely draggable.
   Under prefers-reduced-motion everything decorative is skipped; drag, keys and scene switch still work. */
(function () {
  const hero = document.querySelector('.hero-v2');
  if (!hero) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const center = hero.querySelector('.v2-float');
  const tagsFront = hero.querySelector('.v2-tags-front');
  const tagsBack = hero.querySelector('.v2-tags-back');
  const tags = [...hero.querySelectorAll('.v2-tag')];
  const SCENES = ['concrete', 'night', 'signal'];

  /* ---- 360° stage: pre-rendered sequence (spin360.js), no WebGL ---- */
  const spinner = window.KrshSpin && KrshSpin.mount(hero.querySelector('.v2-spin'), {
    base: 'media/venom-360/f', count: 48,
    label: 'KRSH Venom, 360° view. Drag or use the arrow keys to turn.'
  });
  const N = spinner ? spinner.frames : 48;

  /* ---- scene switch (works with or without motion) ---- */
  const buttons = [...hero.querySelectorAll('.v2-scene')];
  const spin = { val: 0, blur: 0 };
  function applyScene(name) {
    hero.dataset.scene = name;
    document.body.classList.toggle('scene-night', name === 'night');
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scene === name)));
  }
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const name = btn.dataset.scene;
    if (hero.dataset.scene === name) return;
    if (reduce || !window.gsap) { applyScene(name); return; }
    const tl = gsap.timeline();
    // phase 1: wind up with motion blur, swap the scene at the peak
    tl.to(spin, { val: N / 2, blur: 8, duration: 0.35, ease: 'power2.in' })
      .add(() => applyScene(name))
      .to(spin, { val: N, blur: 0, duration: 0.8, ease: 'power3.out' })
      .add(() => { spin.val = 0; });
    // tags implode to centre, hold, explode back out
    tags.forEach(t => {
      gsap.timeline()
        .to(t, { '--k': 0.1, opacity: 0, duration: 0.3, ease: 'power2.in' })
        .to(t, { '--k': 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.1,
                 '--jx': (Math.random() - 0.5) * 200 + 'px', '--jy': (Math.random() - 0.5) * 200 + 'px' });
    });
  }));

  if (reduce) return;

  /* ---- pointer: tilt, parallax, repulsion ---- */
  const target = { x: 0, y: 0 }, current = { x: 0, y: 0 };
  let px = -9999, py = -9999;
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    px = e.clientX; py = e.clientY;
  });
  hero.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; px = py = -9999; });
  const push = tags.map(() => ({ x: 0, y: 0, a: 0 }));

  let visible = true, raf = 0;
  function frame(t) {
    current.x += (target.x - current.x) * 0.14; // was 0.05: felt laggy
    current.y += (target.y - current.y) * 0.14;
    // cursor leans the shoe up to ±3 frames (±22°) on top of the free 360° turn; tilt is a 2D lean
    if (spinner) spinner.extra = (fine ? current.x * 3 : 0) + spin.val;
    center.style.transform = fine ? `rotate(${current.y * -2}deg)` : '';
    center.style.filter = spin.blur ? `blur(${spin.blur}px)` : '';
    tagsFront.style.transform = `translate(${current.x * 60}px, ${current.y * 60}px)`;
    tagsBack.style.transform = `translate(${current.x * -30}px, ${current.y * -30}px)`;
    tags.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - px, dy = r.top + r.height / 2 - py;
      const dist = Math.hypot(dx, dy);
      const force = dist < 400 ? (1 - dist / 400) : 0;
      const p = push[i];
      p.x += ((force ? (dx / dist) * force * 80 : 0) - p.x) * 0.1;
      p.y += ((force ? (dy / dist) * force * 80 : 0) - p.y) * 0.1;
      p.a += 0.2 * (1 + force * 5);
      el.style.setProperty('--px', p.x.toFixed(1) + 'px');
      el.style.setProperty('--py', p.y.toFixed(1) + 'px');
      el.style.setProperty('--pa', (p.a % 360).toFixed(1) + 'deg');
    });
    raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
  }
  const kick = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(hero);
  document.addEventListener('visibilitychange', kick);
  kick();

  /* ---- rising dust (the template's bubbles), spawned only while visible ---- */
  const dust = hero.querySelector('.v2-dust');
  setInterval(() => {
    if (!visible || document.hidden || dust.childElementCount > 24) return;
    const d = document.createElement('i');
    const size = 4 + Math.random() * 8;
    d.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;opacity:${(0.2 + Math.random() * 0.4).toFixed(2)};animation-duration:${(4 + Math.random() * 6).toFixed(1)}s`;
    d.addEventListener('animationend', () => d.remove());
    dust.appendChild(d);
  }, 400);
})();
