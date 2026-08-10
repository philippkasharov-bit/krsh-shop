/* ========== KRSH Catalog ========== */
(function () {

  const PRODUCTS = window.KRSH_PRODUCTS;
  if (!PRODUCTS) return;

  const PER_PAGE = 9;
  let shown = 0;
  let currentFilter = 'all';
  let currentSort = 'featured';

  const grid = document.getElementById('catalogGrid');
  const emptyState = document.getElementById('emptyState');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const countEl = document.getElementById('productCount');

  if (!grid) return;

  function getFiltered() {
    let list = currentFilter === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.brand === currentFilter);
    if (currentSort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (currentSort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (currentSort === 'newest') list.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
    return list;
  }

  function badgeHTML(p) {
    if (!p.badge) return '';
    const cls = { new: 'badge-new', limited: 'badge-limited', sold: 'badge-sold', sale: 'badge-sale' }[p.badge] || 'badge-new';
    const txt = p.badge === 'sale' ? `-${Math.round((1 - p.price / p.oldPrice) * 100)}%` : p.badge.charAt(0).toUpperCase() + p.badge.slice(1);
    return `<span class="p-card-badge ${cls}">${txt}</span>`;
  }

  function renderCards(list) {
    return list.map(p => {
      const priceHTML = p.oldPrice
        ? `<span class="price-old">$${p.oldPrice}</span> <span class="price-now">$${p.price}</span>`
        : `$${p.price}`;
      return `
        <a class="p-card" href="product.html?id=${p.id}">
          ${badgeHTML(p)}
          <div class="p-card-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
          <div class="p-card-info">
            <span class="p-card-name">${p.name}</span>
            <span class="p-card-price">${priceHTML}</span>
          </div>
        </a>`;
    }).join('');
  }

  function render() {
    const filtered = getFiltered();
    shown = Math.min(PER_PAGE, filtered.length);
    grid.innerHTML = renderCards(filtered.slice(0, shown));
    countEl.textContent = filtered.length;
    emptyState.style.display = filtered.length === 0 ? 'flex' : 'none';
    loadMoreWrap.style.display = shown < filtered.length ? 'flex' : 'none';
    animateCards();
  }

  function loadMore() {
    const filtered = getFiltered();
    const next = filtered.slice(shown, shown + PER_PAGE);
    const tmp = document.createElement('div');
    tmp.innerHTML = renderCards(next);
    const newCards = [...tmp.children];
    newCards.forEach(c => grid.appendChild(c));
    shown += next.length;
    loadMoreWrap.style.display = shown < filtered.length ? 'flex' : 'none';
    animateCards(newCards);
  }

  function animateCards(cards) {
    const els = cards || grid.querySelectorAll('.p-card');
    if (window.gsap) {
      gsap.from(els, {
        y: 40, opacity: 0,
        duration: 0.6, stagger: 0.06, ease: 'power3.out'
      });
    }
  }

  document.querySelectorAll('.filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-tag.active').classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    render();
  });

  loadMoreBtn.addEventListener('click', loadMore);
  render();

  // On back-navigation from product page, tag the matching card image for the reverse morph
  window.addEventListener('pagereveal', (e) => {
    if (!e.viewTransition) return;
    e.viewTransition.ready.catch(() => {});
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'back_forward') {
      const ref = document.referrer;
      const match = ref && ref.match(/[?&]id=(\d+)/);
      if (match) {
        const card = grid.querySelector(`a.p-card[href*="id=${match[1]}"]`);
        if (card) {
          const img = card.querySelector('.p-card-img img');
          if (img) img.style.viewTransitionName = 'product-hero';
        }
      }
    }
  });

})();
