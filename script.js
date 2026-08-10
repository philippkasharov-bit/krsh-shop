/* ========== KRSH — Editorial Streetwear ========== */
(function () {
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Collapse every GSAP tween (scroll reveals, hero, etc.) to effectively
     instant instead of editing each .from()/.to() call individually. */
  if (prefersReducedMotion && window.gsap) {
    gsap.globalTimeline.timeScale(50);
  }

  /* ---------- Lenis smooth scroll (synced with GSAP ticker + ScrollTrigger) ---------- */
  if (window.Lenis && !prefersReducedMotion) {
    try {
      const lenis = new Lenis({ duration: 0.55, smoothWheel: true, wheelMultiplier: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });

      if (window.gsap) {
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }

      if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
      }
    } catch (e) {}
  }

  /* ---------- Custom cursor ---------- */
  if (!isTouchDevice) {
    const drop = document.getElementById('cursorDrop');
    const splatter = document.getElementById('cursorSplatter');
    let mx = 0, my = 0, dx = 0, dy = 0;

    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

    (function animCursor() {
      dx += (mx - dx) * 0.12;
      dy += (my - dy) * 0.12;
      if (drop) { drop.style.left = dx + 'px'; drop.style.top = dy + 'px'; }
      requestAnimationFrame(animCursor);
    })();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .p-card, .lookbook-card, .catalog-card')) {
        drop && drop.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .p-card, .lookbook-card, .catalog-card')) {
        drop && drop.classList.remove('hovering');
      }
    });

    document.addEventListener('click', (e) => {
      if (!splatter) return;
      splatter.style.left = e.clientX + 'px';
      splatter.style.top = e.clientY + 'px';
      for (let i = 0; i < 5; i++) {
        const s = document.createElement('div');
        s.className = 'splat';
        const angle = Math.random() * Math.PI * 2;
        const dist = 15 + Math.random() * 25;
        s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        s.style.width = s.style.height = (3 + Math.random() * 6) + 'px';
        splatter.appendChild(s);
        setTimeout(() => s.remove(), 450);
      }
    });
  }

  /* ---------- Toasts ---------- */
  window.showToast = function (message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 2600);
  };

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    const closeMobileNav = () => {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      document.body.classList.remove('nav-open');
    };
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
  }

  /* ---------- Cart drawer ---------- */
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartBadge = document.getElementById('cartBadge');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');

  function updateCartTotals() {
    if (!cartItems) return;
    const items = cartItems.querySelectorAll('.cart-item');
    const total = [...items].reduce((sum, el) => sum + Number(el.dataset.price || 0), 0);
    if (cartBadge) cartBadge.textContent = items.length;
    if (cartBtn) cartBtn.setAttribute('aria-label', `Open cart, ${items.length} item${items.length === 1 ? '' : 's'}`);
    if (cartCount) cartCount.textContent = `(${items.length})`;
    if (cartSubtotal) cartSubtotal.textContent = `$${total}`;
    const isEmpty = items.length === 0;
    if (cartEmpty) cartEmpty.hidden = !isEmpty;
    if (cartFooter) cartFooter.style.display = isEmpty ? 'none' : '';
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartBtn && cartBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }
  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartBtn && cartBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
  window.krshOpenCart = openCart;

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  if (cartItems) {
    cartItems.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.cart-item-remove');
      if (!removeBtn) return;
      const item = removeBtn.closest('.cart-item');
      item.style.transition = 'opacity 0.25s, transform 0.25s';
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => { item.remove(); updateCartTotals(); }, 250);
    });
    updateCartTotals();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeCart();
    if (mobileNav) mobileNav.classList.remove('open');
    if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    document.body.classList.remove('nav-open');
  });

  /* ---------- Wishlist + Quick View (product cards) ---------- */
  (function () {
    const WISHLIST_KEY = 'krsh_wishlist';
    const getWishlist = () => { try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch (e) { return []; } };
    const setWishlist = (arr) => { try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr)); } catch (e) {} };

    function cardKey(card) {
      return card.querySelector('.p-card-name')?.textContent.trim() || '';
    }

    function injectControls(card) {
      if (card.querySelector('.wish-btn')) return;
      const imgWrap = card.querySelector('.p-card-img');
      if (imgWrap) {
        imgWrap.insertAdjacentHTML('beforeend', '<button class="quickview-btn" type="button">Quick View</button>');
      }
      card.insertAdjacentHTML('beforeend',
        '<button class="wish-btn" aria-label="Add to wishlist" type="button">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
        '<path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2 0 3.5 1.2 4 2 .5-.8 2-2 4-2 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg></button>'
      );
    }

    function refreshWishlistIcons() {
      const list = getWishlist();
      document.querySelectorAll('.p-card').forEach(card => {
        const btn = card.querySelector('.wish-btn');
        if (btn) btn.classList.toggle('active', list.includes(cardKey(card)));
      });
    }

    function setupCards() {
      document.querySelectorAll('.p-card').forEach(injectControls);
      refreshWishlistIcons();
    }
    setupCards();

    // Re-inject controls whenever catalog.js re-renders the grid (filter/sort/load more)
    const catalogGrid = document.getElementById('catalogGrid');
    if (catalogGrid && window.MutationObserver) {
      new MutationObserver(setupCards).observe(catalogGrid, { childList: true });
    }

    document.addEventListener('click', (e) => {
      const wishBtn = e.target.closest('.wish-btn');
      if (wishBtn) {
        e.preventDefault(); e.stopPropagation();
        const card = wishBtn.closest('.p-card');
        const key = cardKey(card);
        let list = getWishlist();
        if (list.includes(key)) {
          list = list.filter(k => k !== key);
          if (window.showToast) window.showToast(`Removed ${key} from wishlist`);
        } else {
          list.push(key);
          if (window.showToast) window.showToast(`${key} added to wishlist`);
        }
        setWishlist(list);
        refreshWishlistIcons();
        return;
      }
      const qvBtn = e.target.closest('.quickview-btn');
      if (qvBtn) {
        e.preventDefault(); e.stopPropagation();
        openQuickView(qvBtn.closest('.p-card'));
      }
    });

    let qvModal, qvOverlay;
    function buildModal() {
      if (qvModal) return;
      qvOverlay = document.createElement('div');
      qvOverlay.className = 'qv-overlay';
      qvModal = document.createElement('div');
      qvModal.className = 'qv-modal';
      qvModal.innerHTML =
        '<button class="qv-close" aria-label="Close quick view">&times;</button>' +
        '<div class="qv-img"><img src="" alt=""></div>' +
        '<div class="qv-info">' +
        '<span class="qv-badge"></span>' +
        '<h3 class="qv-name"></h3>' +
        '<span class="qv-price"></span>' +
        '<div class="qv-sizes"><label>Size</label><div class="qv-size-grid"></div></div>' +
        '<button class="btn-primary qv-add" type="button">Add to Bag</button>' +
        '<a href="product.html" class="qv-full-link">View Full Details &rarr;</a>' +
        '</div>';
      document.body.appendChild(qvOverlay);
      document.body.appendChild(qvModal);
      qvOverlay.addEventListener('click', closeQuickView);
      qvModal.querySelector('.qv-close').addEventListener('click', closeQuickView);
    }

    function openQuickView(card) {
      if (!card) return;
      buildModal();
      const name = card.querySelector('.p-card-name')?.textContent.trim() || 'Product';
      const priceEl = card.querySelector('.p-card-price');
      const price = priceEl ? priceEl.textContent.trim() : '';
      const img = card.querySelector('.p-card-img img');
      const badge = card.querySelector('.p-card-badge');
      const href = card.getAttribute('href') || 'product.html';

      const qvImg = qvModal.querySelector('.qv-img img');
      qvImg.src = img ? img.src.replace(/w=\d+&h=\d+/, 'w=800&h=800') : '';
      qvImg.alt = name;
      qvModal.querySelector('.qv-name').textContent = name;
      qvModal.querySelector('.qv-price').textContent = price;
      const qvBadge = qvModal.querySelector('.qv-badge');
      qvBadge.textContent = badge ? badge.textContent : '';
      qvBadge.style.display = badge ? '' : 'none';
      qvModal.querySelector('.qv-full-link').href = href;

      const sizeGrid = qvModal.querySelector('.qv-size-grid');
      sizeGrid.innerHTML = ['7', '8', '9', '9.5', '10', '11'].map((s, i) =>
        `<button type="button" class="size-btn${i === 2 ? ' active' : ''}" data-size="${s}">${s}</button>`
      ).join('');
      sizeGrid.querySelectorAll('.size-btn').forEach(b => {
        b.addEventListener('click', () => {
          sizeGrid.querySelector('.size-btn.active')?.classList.remove('active');
          b.classList.add('active');
        });
      });

      qvModal.querySelector('.qv-add').onclick = () => {
        closeQuickView();
        if (window.showToast) window.showToast(`${name} added to your bag`);
        if (window.krshOpenCart) setTimeout(window.krshOpenCart, 250);
      };

      document.body.classList.add('nav-open');
      requestAnimationFrame(() => {
        qvOverlay.classList.add('open');
        qvModal.classList.add('open');
      });
    }

    function closeQuickView() {
      if (!qvModal) return;
      qvOverlay.classList.remove('open');
      qvModal.classList.remove('open');
      document.body.classList.remove('nav-open');
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeQuickView();
    });
  })();

  /* ---------- Header scroll ---------- */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* ---------- Hero animation ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('loaded'));

    if (window.gsap) {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
        .to('.hero-link', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform' }, '-=0.6');
    }
  }

  /* ---------- GSAP ScrollTrigger ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Lookbook cards
    gsap.utils.toArray('.lookbook-card').forEach((card, i) => {
      gsap.from(card, {
        y: 60, opacity: 0,
        duration: 0.9, delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' }
      });
    });

    // Featured drop
    const featuredSplit = document.querySelector('.featured-split');
    if (featuredSplit) {
      gsap.from('.featured-img-wrap', {
        x: -40, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: featuredSplit, start: 'top 75%' }
      });
      gsap.from('.featured-info', {
        x: 40, opacity: 0, duration: 1, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: featuredSplit, start: 'top 75%' }
      });
    }

    // Product cards
    gsap.utils.toArray('.p-card').forEach((card, i) => {
      gsap.from(card, {
        y: 40, opacity: 0,
        duration: 0.7, delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%' }
      });
    });

    // Manifesto
    const manifesto = document.querySelector('.manifesto-text');
    if (manifesto) {
      gsap.from(manifesto, {
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: manifesto, start: 'top 80%' }
      });
      gsap.from('.manifesto-sub', {
        y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: manifesto, start: 'top 80%' }
      });
      gsap.from('.btn-secondary', {
        y: 20, opacity: 0, duration: 0.6, delay: 0.35, ease: 'power3.out',
        scrollTrigger: { trigger: manifesto, start: 'top 80%' }
      });
    }

    // Section headers
    gsap.utils.toArray('.section-header').forEach((h) => {
      gsap.from(h, {
        y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 88%' }
      });
    });
  }

  /* ---------- Image fallback for external sources ---------- */
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' && !e.target.dataset.fallback) {
      e.target.dataset.fallback = '1';
      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' fill='%23222'%3E%3Crect width='500' height='500'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='18'%3EImage unavailable%3C/text%3E%3C/svg%3E";
    }
  }, true);

  /* ---------- Newsletter form validation ---------- */
  document.querySelectorAll('.nl-form').forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!input || !btn) return;
    btn.addEventListener('click', (e) => {
      if (!input.value || !input.validity.valid) {
        input.focus();
        return;
      }
      if (window.showToast) window.showToast("You’re in! Welcome to the crew.");
      input.value = '';
    });
  });

  /* ---------- Inactive links (social placeholders not wired to real accounts yet) ---------- */
  document.addEventListener('click', (e) => {
    const inactive = e.target.closest('a[aria-disabled="true"]');
    if (inactive) e.preventDefault();
  });

})();
