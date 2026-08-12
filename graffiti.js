/* ========== KRSH GRAFFITI ENGINE v2 — Full Street Chaos ========== */
(function () {
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NEON = ['#E8FF00', '#FF2D6B', '#00F5FF', '#FF6B00', '#B400FF'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ========== ICON DRAWING FUNCTIONS (Canvas) ========== */
  function drawSneaker(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(-12, 2); ctx.lineTo(-10, -4); ctx.lineTo(-4, -6);
    ctx.lineTo(8, -6); ctx.lineTo(12, -3); ctx.lineTo(12, 2);
    ctx.lineTo(10, 4); ctx.lineTo(-10, 4); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-4, -6); ctx.lineTo(-2, -10); ctx.lineTo(4, -10); ctx.lineTo(8, -6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, -2); ctx.lineTo(3, 0); ctx.lineTo(6, 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawBasketball(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 8); ctx.stroke();
    ctx.beginPath(); ctx.arc(-3, 0, 7, -1.2, 1.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(3, 0, 7, Math.PI - 1.2, Math.PI + 1.2); ctx.stroke();
    ctx.restore();
  }

  function drawSkateboard(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.quadraticCurveTo(-16, -4, -12, -4);
    ctx.lineTo(12, -4);
    ctx.quadraticCurveTo(16, -4, 14, 0);
    ctx.quadraticCurveTo(16, 4, 12, 4);
    ctx.lineTo(-12, 4);
    ctx.quadraticCurveTo(-16, 4, -14, 0);
    ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-8, 6, 2.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(8, 6, 2.5, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function drawSprayCan(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.fillRect(-4, -2, 8, 14);
    ctx.strokeRect(-4, -2, 8, 14);
    ctx.fillRect(-2, -6, 4, 4);
    ctx.beginPath(); ctx.arc(0, -7, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -9); ctx.quadraticCurveTo(-5, -14, -3, -18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1, -9); ctx.quadraticCurveTo(3, -13, 0, -16);
    ctx.stroke();
    ctx.restore();
  }

  function drawCrown(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(-10, 6); ctx.lineTo(-10, -2); ctx.lineTo(-5, 3);
    ctx.lineTo(0, -6); ctx.lineTo(5, 3); ctx.lineTo(10, -2);
    ctx.lineTo(10, 6); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-5, -4, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -8, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -4, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawStar(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI / 5) - Math.PI / 2;
      const r = 8;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawHeadphones(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath(); ctx.arc(0, 0, 9, Math.PI, 0); ctx.stroke();
    ctx.fillRect(-11, -2, 4, 8);
    ctx.fillRect(7, -2, 4, 8);
    ctx.strokeRect(-11, -2, 4, 8);
    ctx.strokeRect(7, -2, 4, 8);
    ctx.restore();
  }

  function drawCap(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath(); ctx.arc(0, 2, 10, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 2, 10, Math.PI, 0); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-10, 2); ctx.lineTo(-16, 5); ctx.lineTo(-14, 2); ctx.stroke();
    ctx.restore();
  }

  function drawLightning(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(2, -10); ctx.lineTo(-3, -1); ctx.lineTo(1, -1);
    ctx.lineTo(-2, 10); ctx.lineTo(5, 1); ctx.lineTo(1, 1);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawBoombox(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.strokeRect(-14, -6, 28, 14);
    ctx.beginPath(); ctx.arc(-5, 1, 4, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(5, 1, 4, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(-5, 1, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, 1, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-2, -9, 4, 3);
    ctx.restore();
  }

  function drawDiamond(ctx, x, y, s, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, -10); ctx.lineTo(7, -3); ctx.lineTo(0, 10);
    ctx.lineTo(-7, -3); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-7, -3); ctx.lineTo(7, -3); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -10); ctx.lineTo(0, 10); ctx.stroke();
    ctx.restore();
  }

  const iconDrawers = [
    drawSneaker, drawBasketball, drawSkateboard, drawSprayCan,
    drawCrown, drawStar, drawHeadphones, drawCap,
    drawLightning, drawBoombox, drawDiamond
  ];


  /* ========== 1. FLOATING ICON PARTICLES (Canvas Background) ========== */
  /* Skipped under prefers-reduced-motion: continuous full-viewport motion
     is exactly what that setting exists to suppress. */
  if (!prefersReducedMotion)
  (function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'graffitiParticles';
    canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, mx = -999, my = -999;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

    const ICON_COUNT = isTouchDevice ? 14 : 28;
    const icons = [];

    // Bias spawn x toward the page edges so icons don't sit behind the
    // centered content column (readable text) on wide viewports.
    function edgeBiasedX() {
      if (W < 900) return Math.random() * W;
      const edgeZone = W * 0.16;
      const inEdge = Math.random() < 0.72;
      if (!inEdge) return edgeZone + Math.random() * (W - edgeZone * 2);
      return Math.random() < 0.5
        ? Math.random() * edgeZone
        : W - Math.random() * edgeZone;
    }

    function makeIcon() {
      return {
        x: edgeBiasedX(),
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.15 + Math.random() * 0.4,
        color: pick(NEON),
        alpha: 0.05 + Math.random() * 0.09,
        scale: 0.8 + Math.random() * 1.4,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        drawer: pick(iconDrawers),
      };
    }
    for (let i = 0; i < ICON_COUNT; i++) icons.push(makeIcon());

    function drawIcons() {
      ctx.clearRect(0, 0, W, H);
      for (const ic of icons) {
        const dx = mx - ic.x, dy = my - ic.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const parallax = dist < 300 ? (300 - dist) / 300 * 0.08 : 0;
        const px = ic.x - dx * parallax;
        const py = ic.y - dy * parallax;

        ctx.globalAlpha = ic.alpha;
        ctx.fillStyle = ic.color;
        ctx.strokeStyle = ic.color;
        ctx.lineWidth = 1.2;

        ic.drawer(ctx, px, py, ic.scale, ic.angle);

        ic.x += ic.vx;
        ic.y += ic.vy;
        ic.angle += ic.rotSpeed;
        if (ic.y > H + 50) { ic.y = -50; ic.x = edgeBiasedX(); ic.drawer = pick(iconDrawers); ic.color = pick(NEON); }
        if (ic.x < -50) ic.x = W + 50;
        if (ic.x > W + 50) ic.x = -50;
      }
      requestAnimationFrame(drawIcons);
    }
    drawIcons();
  })();


  /* ========== 2. INTERACTIVE SPRAY CURSOR ========== */
  if (!isTouchDevice && !prefersReducedMotion) {
    const sprayCanvas = document.createElement('canvas');
    sprayCanvas.id = 'sprayCanvas';
    sprayCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
    document.body.appendChild(sprayCanvas);
    const sCtx = sprayCanvas.getContext('2d');
    let sW, sH;

    function resizeSpray() {
      sW = sprayCanvas.width = window.innerWidth;
      sH = sprayCanvas.height = window.innerHeight;
    }
    resizeSpray();
    window.addEventListener('resize', resizeSpray);

    let painting = false;
    let pmx = 0, pmy = 0;
    let sprayColor = pick(NEON);

    const strokes = [];

    document.addEventListener('mousedown', (e) => {
      if (e.target.closest('a, button, input, select, textarea, .cart-drawer, .mobile-nav, .qv-modal, .header')) return;
      painting = true;
      pmx = e.clientX;
      pmy = e.clientY;
      sprayColor = pick(NEON);
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 20;
        strokes.push({
          x: pmx + Math.cos(angle) * dist,
          y: pmy + Math.sin(angle) * dist,
          r: 1 + Math.random() * 3,
          color: sprayColor,
          alpha: 0.5 + Math.random() * 0.4,
          born: Date.now()
        });
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!painting) return;
      const cx = e.clientX, cy = e.clientY;
      const dist = Math.sqrt((cx - pmx) ** 2 + (cy - pmy) ** 2);
      const dots = Math.max(3, Math.min(15, Math.floor(dist / 2)));
      for (let i = 0; i < dots; i++) {
        const t = i / dots;
        const bx = pmx + (cx - pmx) * t;
        const by = pmy + (cy - pmy) * t;
        const spread = 8 + Math.random() * 12;
        const angle = Math.random() * Math.PI * 2;
        strokes.push({
          x: bx + Math.cos(angle) * spread * Math.random(),
          y: by + Math.sin(angle) * spread * Math.random(),
          r: 0.5 + Math.random() * 2.5,
          color: sprayColor,
          alpha: 0.3 + Math.random() * 0.5,
          born: Date.now()
        });
      }
      pmx = cx;
      pmy = cy;
    });

    document.addEventListener('mouseup', () => {
      if (painting) {
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 15 + Math.random() * 25;
          strokes.push({
            x: pmx + Math.cos(angle) * dist,
            y: pmy + Math.sin(angle) * dist,
            r: 2 + Math.random() * 5,
            color: sprayColor,
            alpha: 0.6 + Math.random() * 0.3,
            born: Date.now()
          });
        }
      }
      painting = false;
    });

    function renderSpray() {
      sCtx.clearRect(0, 0, sW, sH);
      const now = Date.now();
      const FADE = 2500;
      for (let i = strokes.length - 1; i >= 0; i--) {
        const s = strokes[i];
        const age = now - s.born;
        if (age > FADE) { strokes.splice(i, 1); continue; }
        const fade = 1 - age / FADE;
        sCtx.globalAlpha = s.alpha * fade;
        sCtx.fillStyle = s.color;
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fill();
      }
      requestAnimationFrame(renderSpray);
    }
    renderSpray();
  }


  /* ========== 3. SPRAY-PAINT SCROLL REVEALS ========== */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const revealSections = document.querySelectorAll(
      '.lookbook, .featured-drop, .products-section, .manifesto, .story-content, .values-section, .stats-section, .faq-section, .contact-section, .checkout-section'
    );

    revealSections.forEach((section) => {
      const overlay = document.createElement('div');
      overlay.className = 'spray-reveal-overlay';
      const colorA = pick(NEON);
      const colorB = pick(NEON.filter(c => c !== colorA));
      overlay.style.setProperty('--spray-a', colorA);
      overlay.style.setProperty('--spray-b', colorB);
      section.style.position = 'relative';
      section.style.overflow = 'hidden';
      section.appendChild(overlay);

      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        onEnter: () => overlay.classList.add('revealed'),
        once: true,
      });
    });
  }


  /* ========== 4. GRAFFITI ART SVGs AT SECTION INTERSECTIONS ========== */
  const graffitiSVGs = [
    // Crown with drips
    { viewBox: '0 0 120 100', paths: [
      { d: 'M20,70 L20,30 L35,50 L60,15 L85,50 L100,30 L100,70 Z', fill: true, stroke: true },
      { d: 'M30,25 A4,4 0 1,1 30.1,25', fill: true },
      { d: 'M60,10 A4,4 0 1,1 60.1,10', fill: true },
      { d: 'M90,25 A4,4 0 1,1 90.1,25', fill: true },
      { d: 'M30,70 L30,85 Q30,90 32,85', stroke: true },
      { d: 'M60,70 L60,92 Q60,97 62,92', stroke: true },
      { d: 'M80,70 L80,82 Q80,87 82,82', stroke: true },
    ]},
    // Spray can with mist
    { viewBox: '0 0 80 130', paths: [
      { d: 'M25,45 L25,115 Q25,120 30,120 L50,120 Q55,120 55,115 L55,45 Z', fill: true, stroke: true },
      { d: 'M30,45 L30,30 L50,30 L50,45', fill: true, stroke: true },
      { d: 'M37,30 L37,22 L43,22 L43,30', stroke: true },
      { d: 'M40,20 A3,3 0 1,1 40.1,20', fill: true },
      { d: 'M40,15 Q32,5 28,0', stroke: true },
      { d: 'M40,14 Q45,3 50,0', stroke: true },
      { d: 'M40,16 Q36,8 40,2', stroke: true },
      { d: 'M35,75 L45,75 M35,85 L45,85 M35,95 L45,95', stroke: true },
    ]},
    // Sneaker outline with drip
    { viewBox: '0 0 160 100', paths: [
      { d: 'M15,60 L20,35 Q25,20 40,18 L70,18 Q80,18 85,22 L130,22 Q145,22 148,35 L150,50 L150,65 Q150,75 140,75 L30,75 Q15,75 15,60 Z', fill: true, stroke: true },
      { d: 'M40,18 L38,8 Q37,3 42,3 L60,3 Q65,3 63,8 L58,18', stroke: true },
      { d: 'M85,35 L115,30 L120,45 L90,50 Z', stroke: true },
      { d: 'M110,40 L102,38', stroke: true },
      { d: 'M30,75 L30,90 Q30,95 32,90', stroke: true },
      { d: 'M80,75 L80,88 Q80,93 82,88', stroke: true },
    ]},
    // Boom box
    { viewBox: '0 0 160 110', paths: [
      { d: 'M10,25 L150,25 Q155,25 155,30 L155,90 Q155,95 150,95 L10,95 Q5,95 5,90 L5,30 Q5,25 10,25 Z', stroke: true },
      { d: 'M50,60 A18,18 0 1,1 50.1,60', stroke: true },
      { d: 'M50,60 A8,8 0 1,1 50.1,60', fill: true },
      { d: 'M110,60 A18,18 0 1,1 110.1,60', stroke: true },
      { d: 'M110,60 A8,8 0 1,1 110.1,60', fill: true },
      { d: 'M70,15 L70,25 M90,15 L90,25', stroke: true },
      { d: 'M75,5 L85,5 Q87,5 87,8 L87,15 L73,15 L73,8 Q73,5 75,5 Z', stroke: true },
    ]},
    // Basketball with flames
    { viewBox: '0 0 120 120', paths: [
      { d: 'M60,20 A40,40 0 1,1 59.9,20', stroke: true },
      { d: 'M20,60 L100,60', stroke: true },
      { d: 'M60,20 L60,100', stroke: true },
      { d: 'M35,60 A25,35 0 0,1 35,25', stroke: true },
      { d: 'M35,60 A25,35 0 0,0 35,95', stroke: true },
      { d: 'M85,60 A25,35 0 0,0 85,25', stroke: true },
      { d: 'M85,60 A25,35 0 0,1 85,95', stroke: true },
      { d: 'M30,15 Q25,5 30,0 Q35,8 28,15', fill: true },
      { d: 'M90,15 Q95,5 90,0 Q85,8 92,15', fill: true },
    ]},
  ];

  function createGraffitiArt(parent, artDef, color, scale) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'graffiti-art-svg');
    svg.setAttribute('viewBox', artDef.viewBox);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    artDef.paths.forEach((pDef) => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', pDef.d);
      if (pDef.fill) {
        p.setAttribute('fill', color);
        /* Starts invisible: the fill blooms in as its own beat, after the
           outline finishes drawing, instead of ghosting through pre-scroll. */
        p.setAttribute('fill-opacity', '0');
        p.classList.add('graffiti-fill-path');
      } else {
        p.setAttribute('fill', 'none');
      }
      if (pDef.stroke) {
        p.setAttribute('stroke', color);
        p.setAttribute('stroke-width', '2');
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        p.setAttribute('stroke-opacity', '0.45');
        const len = 800;
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.classList.add('graffiti-draw-path');
      }
      svg.appendChild(p);
    });

    parent.style.position = 'relative';
    parent.appendChild(svg);
    return svg;
  }

  const artPositions = [
    { bottom: '10px', left: '3%', width: '120px', height: '100px' },
    { top: '15px', right: '4%', left: 'auto', width: '80px', height: '110px' },
    { bottom: '15px', right: '5%', left: 'auto', width: '140px', height: '90px' },
    { top: '20px', left: '6%', width: '130px', height: '90px' },
    { bottom: '5px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '100px' },
  ];

  const lookbook = document.querySelector('.lookbook');
  const featured = document.querySelector('.featured-drop');
  const productsSection = document.querySelector('.products-section');
  const manifesto = document.querySelector('.manifesto');
  const heroSection = document.querySelector('.hero');
  const contactSection = document.querySelector('.contact-section');
  const faqSection = document.querySelector('.faq-section');
  const checkoutSection = document.querySelector('.checkout-section');

  const artTargets = [
    lookbook, featured, productsSection, manifesto, heroSection,
    contactSection, faqSection, checkoutSection,
  ].filter(Boolean);

  artTargets.forEach((el, i) => {
    const artDef = graffitiSVGs[i % graffitiSVGs.length];
    const color = NEON[i % NEON.length];
    const svg = createGraffitiArt(el, artDef, color, 1);
    const pos = artPositions[i % artPositions.length];
    Object.assign(svg.style, pos);

    const strokePaths = svg.querySelectorAll('.graffiti-draw-path');
    const fillPaths = svg.querySelectorAll('.graffiti-fill-path');

    if (window.gsap && window.ScrollTrigger) {
      /* Two-beat tag reveal: the outline sprays on first (existing stagger),
         then the fill blooms in as its own beat once the outline lands —
         same two-step a real spray tag goes down in. */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
      });
      strokePaths.forEach((p, pi) => {
        tl.to(p, {
          strokeDashoffset: 0,
          duration: prefersReducedMotion ? 0 : 1.5 + pi * 0.3,
          ease: 'power2.inOut',
        }, pi * (prefersReducedMotion ? 0 : 0.3));
      });
      if (fillPaths.length) {
        tl.to(fillPaths, {
          fillOpacity: 0.3,
          duration: prefersReducedMotion ? 0 : 0.9,
          ease: 'power1.out',
          stagger: prefersReducedMotion ? 0 : 0.08,
        }, prefersReducedMotion ? 0 : '-=0.4');
      }
    } else {
      /* No GSAP/ScrollTrigger: show the finished art immediately rather
         than leaving it invisible forever. */
      strokePaths.forEach((p) => { p.style.strokeDashoffset = 0; });
      fillPaths.forEach((p) => { p.setAttribute('fill-opacity', '0.3'); });
    }
  });




  /* ========== 6. SPRAY DOTS ON PRODUCT CARDS ========== */
  function addSprayDotsToCards() {
    document.querySelectorAll('.p-card, .lookbook-card, .catalog-card').forEach(card => {
      if (card.querySelector('.card-spray-dots')) return;
      const dots = document.createElement('div');
      dots.className = 'card-spray-dots';
      const count = 6 + Math.floor(Math.random() * 8);
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.style.cssText = `
          position:absolute;
          width:${1 + Math.random() * 3}px;
          height:${1 + Math.random() * 3}px;
          border-radius:50%;
          background:${pick(NEON)};
          opacity:${0.15 + Math.random() * 0.25};
          left:${Math.random() * 100}%;
          top:${Math.random() * 100}%;
        `;
        dots.appendChild(dot);
      }
      card.style.position = 'relative';
      card.appendChild(dots);
    });
  }
  addSprayDotsToCards();

  const catalogGrid = document.getElementById('catalogGrid');
  if (catalogGrid && window.MutationObserver) {
    new MutationObserver(addSprayDotsToCards).observe(catalogGrid, { childList: true });
  }

})();
