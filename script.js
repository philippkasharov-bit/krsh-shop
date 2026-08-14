/* Suppress View Transition AbortErrors (expected when transitions are skipped) */
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.name === 'AbortError') e.preventDefault();
});

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

  /* ---------- Shared focus management for dialog-like overlays
     (cart drawer, mobile nav, Quick View) ---------- */
  let lastFocusedEl = null;
  function focusInto(container) {
    lastFocusedEl = document.activeElement;
    const target = container.querySelector('button, a[href], input, select, textarea, [tabindex]');
    if (target) target.focus();
  }
  function focusReturn() {
    if (lastFocusedEl && document.contains(lastFocusedEl)) lastFocusedEl.focus();
    lastFocusedEl = null;
  }
  function focusableIn(container) {
    return [...container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => el.offsetParent !== null);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const openDialog =
      document.getElementById('mobileNav')?.classList.contains('open') && document.getElementById('mobileNav') ||
      document.getElementById('cartDrawer')?.classList.contains('open') && document.getElementById('cartDrawer') ||
      document.querySelector('.qv-modal.open');
    if (!openDialog) return;
    const list = focusableIn(openDialog);
    if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    const closeMobileNav = () => {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
      focusReturn();
    };
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('nav-open', isOpen);
      if (isOpen) focusInto(mobileNav);
      else focusReturn();
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
  }

  /* ---------- Cart (localStorage-backed, shared across every page) ---------- */
  const CART_KEY = 'krsh_cart';
  const DEFAULT_CART = [
    { name: 'KRSH Venom', price: 310, size: '8.5', color: 'White', img: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=160&h=160&fit=crop' },
    { name: 'Street Phantom', price: 220, size: '9', color: 'White', img: 'https://images.unsplash.com/photo-1596480370804-cff0eed14888?w=160&h=160&fit=crop' }
  ];

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw === null) return DEFAULT_CART.slice();
      return JSON.parse(raw) || [];
    } catch (e) { return []; }
  }
  function setCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
  }

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
  const orderItems = document.getElementById('orderItems');

  function cartRowHTML(item, index, removable) {
    const meta = item.size ? 'Size ' + item.size + (item.color ? ' &middot; ' + item.color : '') : (item.color || '');
    return '<div class="cart-item" data-index="' + index + '" data-price="' + item.price + '">' +
      '<img src="' + item.img + '" alt="' + item.name + '">' +
      '<div class="cart-item-info">' +
      '<span class="cart-item-name">' + item.name + '</span>' +
      (meta ? '<span class="cart-item-meta">' + meta + '</span>' : '') +
      '<span class="cart-item-price">$' + item.price + '</span></div>' +
      (removable ? '<button class="cart-item-remove" aria-label="Remove ' + item.name + ' from cart">&times;</button>' : '') +
      '</div>';
  }

  function renderCart() {
    const items = getCart();
    if (cartItems) cartItems.innerHTML = items.map((item, i) => cartRowHTML(item, i, true)).join('');
    if (orderItems) orderItems.innerHTML = items.map((item, i) => cartRowHTML(item, i, false)).join('');
    updateCartTotals();
    document.dispatchEvent(new CustomEvent('krsh:cart-updated', { detail: { items } }));
  }

  function updateCartTotals() {
    const items = getCart();
    const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
    if (cartBadge) cartBadge.textContent = items.length;
    if (cartBtn) cartBtn.setAttribute('aria-label', `Open cart, ${items.length} item${items.length === 1 ? '' : 's'}`);
    if (cartCount) cartCount.textContent = `(${items.length})`;
    if (cartSubtotal) cartSubtotal.textContent = `$${total}`;
    const isEmpty = items.length === 0;
    if (cartEmpty) cartEmpty.hidden = !isEmpty;
    if (cartFooter) cartFooter.style.display = isEmpty ? 'none' : '';
  }

  function addToCart(item) {
    const items = getCart();
    items.push(item);
    setCart(items);
    renderCart();
    if (window.showToast) window.showToast(item.name + ' added to your bag');
    if (window.krshOpenCart) setTimeout(window.krshOpenCart, 300);
    if (!prefersReducedMotion && window.anime && cartBtn) {
      const { animate, spring } = window.anime;
      animate(cartBtn, {
        scale: [
          { to: 1.25, duration: 200, ease: 'out(3)' },
          { to: 1, duration: 400, ease: spring({ bounce: 0.5 }) }
        ]
      });
    }
  }
  function removeFromCart(index) {
    const items = getCart();
    items.splice(index, 1);
    setCart(items);
    renderCart();
  }
  window.krshAddToCart = addToCart;
  window.krshGetCart = getCart;
  window.krshClearCart = function () { setCart([]); renderCart(); };

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartBtn && cartBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    focusInto(cartDrawer);
  }
  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartBtn && cartBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    focusReturn();
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
      const index = Number(item.dataset.index);
      item.style.transition = 'opacity 0.25s, transform 0.25s';
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => removeFromCart(index), 250);
    });
    renderCart();
  }

  /* ---------- Promo code (demo-only: no real discount backend) ---------- */
  document.querySelectorAll('.cart-promo').forEach(promo => {
    const input = promo.querySelector('input');
    const btn = promo.querySelector('button');
    if (!input || !btn) return;
    btn.addEventListener('click', () => {
      if (!input.value.trim()) return;
      if (window.showToast) window.showToast('"' + input.value.trim() + '" is not a valid code');
      input.value = '';
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } });
  });

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
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>'
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

    // product.html's "You Might Also Like" grid is populated after this script
    // runs, so it misses both the Quick View/wishlist button injection above
    // and the ScrollTrigger reveal below unless we handle it explicitly here.
    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid && window.MutationObserver) {
      new MutationObserver(() => {
        setupCards();
        const cards = relatedGrid.querySelectorAll('.p-card');
        if (!prefersReducedMotion && window.anime && cards.length) {
          const { animate, stagger } = window.anime;
          animate(cards, {
            y: { from: 40, to: 0 }, opacity: { from: 0, to: 1 },
            duration: 650, delay: stagger(60), ease: 'out(3)'
          });
        }
      }).observe(relatedGrid, { childList: true });
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
          if (!prefersReducedMotion && window.anime) {
            const { animate, spring } = window.anime;
            animate(wishBtn, {
              scale: [
                { to: 1.5, duration: 160, ease: 'out(3)' },
                { to: 1, duration: 350, ease: spring({ bounce: 0.55 }) }
              ]
            });
          }
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
      qvModal.setAttribute('role', 'dialog');
      qvModal.setAttribute('aria-modal', 'true');
      qvModal.setAttribute('aria-labelledby', 'qvModalName');
      qvModal.innerHTML =
        '<button class="qv-close" aria-label="Close quick view">&times;</button>' +
        '<div class="qv-img"><img src="" alt=""></div>' +
        '<div class="qv-info">' +
        '<span class="qv-badge"></span>' +
        '<h3 class="qv-name" id="qvModalName"></h3>' +
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
        const sizeBtn = sizeGrid.querySelector('.size-btn.active');
        const idMatch = href.match(/[?&]id=(\d+)/);
        const product = idMatch && window.KRSH_PRODUCTS ? window.KRSH_PRODUCTS.find(p => p.id === Number(idMatch[1])) : null;
        const cartItem = product
          ? { name: product.name, price: product.price, size: sizeBtn ? sizeBtn.dataset.size : '9', color: product.color || '', img: product.img.replace(/w=\d+&h=\d+/, 'w=160&h=160') }
          : { name, price: parseInt((price.match(/\$?(\d+)\s*$/) || [])[1] || '0', 10), size: sizeBtn ? sizeBtn.dataset.size : '9', color: card.dataset.color || '', img: img ? img.src.replace(/w=\d+&h=\d+/, 'w=160&h=160') : '' };
        closeQuickView();
        if (window.krshAddToCart) window.krshAddToCart(cartItem);
      };

      document.body.classList.add('nav-open');
      requestAnimationFrame(() => {
        qvOverlay.classList.add('open');
        qvModal.classList.add('open');
        if (!prefersReducedMotion && window.anime) {
          const { animate, stagger } = window.anime;
          const infoEls = qvModal.querySelectorAll('.qv-info > *');
          animate(infoEls, {
            opacity: { from: 0, to: 1 },
            x: { from: 16, to: 0 },
            duration: 450,
            delay: stagger(50, { start: 150 }),
            ease: 'out(3)'
          });
        }
      });
      focusInto(qvModal);
    }

    function closeQuickView() {
      if (!qvModal) return;
      qvOverlay.classList.remove('open');
      qvModal.classList.remove('open');
      document.body.classList.remove('nav-open');
      focusReturn();
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

  /* ---------- Hero animation (Anime.js v4) ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('loaded'));

    const heroEls = ['.hero-eyebrow', '.hero-sub', '.hero-title', '.hero-link']
      .map(sel => document.querySelector(sel)).filter(Boolean);

    if (prefersReducedMotion) {
      heroEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    } else if (window.anime) {
      const { createTimeline, spring } = window.anime;
      const tl = createTimeline({ delay: 300 });
      const eyebrow = document.querySelector('.hero-eyebrow');
      if (eyebrow) tl.add('.hero-eyebrow', { opacity: { from: 0, to: 1 }, y: { from: 20, to: 0 }, duration: 700, ease: 'out(3)' });
      tl.add('.hero-title', {
          opacity: { from: 0, to: 1 }, y: { from: 40, to: 0 },
          duration: 900, ease: spring({ bounce: 0.35, duration: 900 })
        }, eyebrow ? '-=500' : 0)
        .add(document.querySelector('.hero-sub') ? '.hero-sub' : '.hero-link', { opacity: { from: 0, to: 1 }, y: { from: 20, to: 0 }, duration: 600, ease: 'out(3)' }, '-=400');
      if (document.querySelector('.hero-sub'))
        tl.add('.hero-link', { opacity: { from: 0, to: 1 }, y: { from: 20, to: 0 }, duration: 600, ease: 'out(3)' }, '-=300');
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

  /* ---------- 3D tilt on product cards ---------- */
  if (!isTouchDevice && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.p-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
      card.style.setProperty('--glow-x', ((x + 0.5) * 100) + '%');
      card.style.setProperty('--glow-y', ((y + 0.5) * 100) + '%');
      const img = card.querySelector('.p-card-img img');
      if (img) img.style.transform = `scale(1.05) translateX(${x * -6}px) translateY(${y * -6}px)`;
    });
    document.addEventListener('mouseout', (e) => {
      if (!e.target || !e.target.closest) return;
      const card = e.target.closest('.p-card');
      if (card && !card.contains(e.relatedTarget)) {
        card.style.transform = '';
        const img = card.querySelector('.p-card-img img');
        if (img) img.style.transform = '';
      }
    });
  }

  /* ---------- Scroll-driven reveals ---------- */
  if (!prefersReducedMotion) {
    const revealTargets = [
      { sel: '.value-card', cls: '' },
      { sel: '.stat-item', cls: '' },
      { sel: '.story-grid', cls: 'reveal-scale' },
      { sel: '.trust-item', cls: '' },
      { sel: '.footer-brand', cls: 'reveal-left' },
      { sel: '.footer-newsletter', cls: 'reveal-right' },
      { sel: '.checkout-step', cls: '' },
      { sel: '.contact-block', cls: '' },
      { sel: '.faq-groups', cls: 'reveal-scale' },
      { sel: '.reviews-summary', cls: 'reveal-left' },
      { sel: '.reviews-list', cls: 'reveal-right' },
    ];
    revealTargets.forEach(({ sel, cls }) => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('reveal');
        if (cls) el.classList.add(cls);
      });
    });
    const staggerContainers = ['.values-grid', '.stats-grid', '.trust-strip'];
    staggerContainers.forEach(sel => {
      const c = document.querySelector(sel);
      if (c) c.classList.add('reveal-stagger');
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- View Transitions: shared-element morph for product navigation ---------- */
  (function() {
    let lastClickedCard = null;

    document.addEventListener('click', (e) => {
      const card = e.target.closest('a.p-card');
      if (card && card.href && card.href.includes('product.html')) {
        lastClickedCard = card;
      }
    });

    window.addEventListener('pageswap', (e) => {
      if (!e.viewTransition) return;
      e.viewTransition.finished.catch(() => {});
      e.viewTransition.ready.catch(() => {});
      if (!lastClickedCard) return;
      const img = lastClickedCard.querySelector('.p-card-img img');
      if (img) img.style.viewTransitionName = 'product-hero';
    });

    window.addEventListener('pagereveal', (e) => {
      if (!e.viewTransition) return;
      e.viewTransition.finished.catch(() => {});
      e.viewTransition.ready.catch(() => {});
    });
  })();

})();
