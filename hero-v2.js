/* KRSH v2 hero — floating product stage.
   Motion system adapted from the GetLayers "Soda" template (commercial licence):
   cursor tilt (lerp 0.12), parallax layers, pointer repulsion (r 400 / -80),
   rising particles, and a scene switch with a 720° spin + implode/explode.
   Everything is skipped under prefers-reduced-motion; the scene switch still works. */
(function () {
  const hero = document.querySelector('.hero-v2');
  if (!hero) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const center = hero.querySelector('.v2-float');
  const poster = hero.querySelector('.v2-poster');
  const tagsFront = hero.querySelector('.v2-tags-front');
  const tagsBack = hero.querySelector('.v2-tags-back');
  const tags = [...hero.querySelectorAll('.v2-tag')];
  const SCENES = ['concrete', 'night', 'signal'];

  /* ---- 3D model: poster first, model-viewer + GLB after window load ---- */
  let mv = null;
  function mountModel() {
    if (navigator.connection && navigator.connection.saveData) return;
    if (window.krshLoadModelViewer) window.krshLoadModelViewer();
    mv = document.createElement('model-viewer');
    mv.className = 'v2-model';
    mv.setAttribute('src', 'media/sneaker.glb');
    mv.setAttribute('alt', 'KRSH Venom, 3D model');
    const cine = !reduce && window.gsap;
    mv.setAttribute('camera-orbit', cine ? '-110deg 84deg 150%' : '-30deg 75deg 105%');
    mv.setAttribute('tone-mapping', 'agx');
    mv.setAttribute('shadow-softness', '0.7');
    mv.setAttribute('field-of-view', '30deg');
    mv.setAttribute('interaction-prompt', 'none');
    mv.setAttribute('disable-zoom', '');
    mv.setAttribute('shadow-intensity', '1.6');
    mv.setAttribute('exposure', '1.0');
    if (reduce || !fine) {
      // no cursor to follow: let people drag it (and keep it still under reduced motion)
      mv.setAttribute('camera-controls', '');
      mv.setAttribute('touch-action', 'pan-y');
      if (!reduce) { mv.setAttribute('auto-rotate', ''); mv.setAttribute('rotation-per-second', '14deg'); }
    }
    mv.addEventListener('load', () => {
      hero.classList.add('is-3d');
      if (!cine) return;
      const o = { t: -110, p: 84, r: 150 };
      gsap.to(o, { t: -30, p: 75, r: 105, duration: 1.6, ease: 'expo.out',
        onUpdate: () => { mv.cameraOrbit = o.t + 'deg ' + o.p + 'deg ' + o.r + '%'; } });
    }, { once: true });
    center.appendChild(mv);
  }
  if (document.readyState === 'complete') mountModel();
  else window.addEventListener('load', mountModel, { once: true });

  /* ---- scene switch (works with or without motion) ---- */
  const buttons = [...hero.querySelectorAll('.v2-scene')];
  const spin = { val: 0, blur: 0 };
  function applyScene(name) {
    hero.dataset.scene = name;
    document.body.classList.toggle('scene-night', name === 'night');
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scene === name)));
  }
  applyScene(hero.dataset.scene); // sync body theme with the default scene
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const name = btn.dataset.scene;
    if (hero.dataset.scene === name) return;
    if (reduce || !window.gsap) { applyScene(name); return; }
    const tl = gsap.timeline();
    // phase 1: wind up with motion blur, swap the scene at the peak
    tl.to(spin, { val: 360, blur: 15, duration: 0.35, ease: 'power2.in' })
      .add(() => applyScene(name))
      .to(spin, { val: 720, blur: 0, duration: 0.8, ease: 'expo.out' })
      .add(() => { spin.val = 0; });
    // tags implode to centre, hold, explode back out
    tags.forEach(t => {
      gsap.timeline()
        .to(t, { '--k': 0.1, opacity: 0, duration: 0.3, ease: 'power2.in' })
        .to(t, { '--k': 1, opacity: 1, duration: 0.55, ease: 'back.out(1.5)', delay: 0.15,
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
    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;
    if (mv && fine) {
      mv.cameraOrbit = `${-30 + current.x * 40 + spin.val}deg ${75 + current.y * 12}deg 105%`;
    } else if (mv && spin.val) {
      mv.cameraOrbit = `${-30 + spin.val}deg 75deg 105%`;
    }
    center.style.filter = spin.blur ? `blur(${spin.blur}px)` : '';
    if (!mv) poster.style.transform = `rotate(${current.x * 4}deg)`;
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
