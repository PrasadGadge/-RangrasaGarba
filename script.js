(() => {
  'use strict';

  const imageFallback = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80';
  function bandhaniPlaceholder(label) {
    const pals = [['#6f2437','#f6c984'],['#4b2a6b','#f0deda'],['#a3262f','#ffd9a0'],['#d97939','#fff1d6']];
    const [bg, dot] = pals[[...label].reduce((a, c) => a + c.charCodeAt(0), 0) % pals.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="4" fill="${dot}"/><circle cx="0" cy="0" r="2.5" fill="${dot}"/><circle cx="40" cy="0" r="2.5" fill="${dot}"/><circle cx="0" cy="40" r="2.5" fill="${dot}"/><circle cx="40" cy="40" r="2.5" fill="${dot}"/></pattern></defs><rect width="600" height="800" fill="${bg}"/><rect width="600" height="800" fill="url(#p)"/><rect x="24" y="24" width="552" height="752" fill="none" stroke="${dot}" stroke-width="2"/></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  const products = [
    {
      id: 'gulabi-raas', name: 'Gulabi Raas Set', category: 'chaniya', categoryLabel: 'Chaniya choli', price: 4890,
      badge: 'Best loved', note: 'Mirror-work · Flared fit',
      description: 'A joyful pink ensemble with festive embroidery and a full, movement-friendly skirt. Made for your main-character Garba moment.',
      image: 'https://www.dulariahmedabad.com/cdn/shop/files/05BB8648-6295-4F41-8B8F-95EAF22A3809.jpg?v=1768898358&width=1100',
      alt: 'Pink Bandhani lehenga choli with embroidered blouse and dupatta'
    },
    {
      id: 'neel-bandhani', name: 'Neel Bandhani Lehenga', category: 'bandhani', categoryLabel: 'Bandhani edit', price: 5290,
      badge: 'New arrival', note: 'Bandhani print · Sitara work',
      description: 'A rich jewel-toned Bandhani look with tiny dotted motifs and a celebratory shimmer. Traditional at heart, unforgettable in motion.',
      image: 'https://i.pinimg.com/736x/31/39/7b/31397bc55052eae279a2b11dafb1a7fd.jpg',
      alt: 'Purple Bandhani lehenga and matching dupatta on a model'
    },
    {
      id: 'laal-gajji', name: 'Laal Gajji Silk Set', category: 'chaniya', categoryLabel: 'Chaniya choli', price: 6190,
      badge: 'Festive pick', note: 'Silk blend · Zari detail',
      description: 'A timeless red-and-gold story, finished with traditional Bandhani-inspired motifs and a graceful, festive drape.',
      image: 'https://www.leelas.co.za/cdn/shop/files/BD-EL4959-3.png?v=1762528620&width=1100',
      alt: 'Red Bandhani silk festive lehenga set'
    },
    {
      id: 'kutch-kediyu', name: 'Kutch Kediyu Set', category: 'mens', categoryLabel: 'Men’s edit', price: 3290,
      badge: 'Raas ready', note: 'Embroidered jacket · Easy fit',
      description: 'A bright, embroidered kediyu-inspired look with classic Gujarati details. Bring your own rhythm to every Dandiya round.',
      image: 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-TitanSharedLibrary/default/dw32d4c618/images/Blog/Navaratri_4.jpg',
      alt: 'Traditional colourful Gujarati kediyu outfit with embroidered jacket'
    },
    {
      id: 'bandhej-dupatta', name: 'Bandhej Zari Dupatta', category: 'bandhani', categoryLabel: 'Bandhani edit', price: 1490,
      badge: 'Craft classic', note: 'Tie-dye motif · Zari edge',
      description: 'A vivid red Bandhani dupatta with dotted patterns and a decorative border — the easiest way to bring a little Gujarat into your look.',
      image: 'https://uppada.com/cdn/shop/products/red-bandhani-chiffon-dupatta-with-grill-and-zari-border-design-ds2947-37880749818110.jpg?v=1659784398',
      alt: 'Close-up of red Bandhani dupatta featuring a white dot pattern and zari border'
    },
    {
      id: 'raas-potli', name: 'Raas Mini Potli', category: 'accessories', categoryLabel: 'Finishing touches', price: 890,
      badge: 'Little detail', note: 'Embroidered finish · Giftable',
      description: 'A festive finishing touch for the little essentials. Pair it with your favourite set and let the details do their thing.',
      image: 'https://i.pinimg.com/736x/de/24/cd/de24cda06382a4cf2bb50711180c5ec8.jpg',
      alt: 'Colourful embroidered traditional Gujarati festive textile details'
    }
  ];

  const state = {
    category: 'all',
    search: '',
    sort: 'featured',
    wishlistOnly: false,
    wishlist: readStorage('rangrasa-wishlist', []),
    cart: readStorage('rangrasa-cart', []),
    coupon: false
  };
  const FREE_SHIP = 5000;
  let lastFocus = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const productById = id => products.find(product => product.id === id);
  const money = amount => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  function readStorage(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveStorage() {
    try {
      localStorage.setItem('rangrasa-wishlist', JSON.stringify(state.wishlist));
      localStorage.setItem('rangrasa-cart', JSON.stringify(state.cart));
    } catch (_) {
      // The demo still works for the current page when localStorage is unavailable.
    }
  }

  function heartIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 8.8c0 5.2-8.5 10.1-8.5 10.1S3.5 14 3.5 8.8A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.5 2.6Z"/></svg>';
  }

  function productCard(product, index) {
    const saved = state.wishlist.includes(product.id);
    return `
      <article class="product-card" style="animation-delay:${Math.min(index * 45, 270)}ms" data-product-id="${product.id}">
        <div class="product-media">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" data-fallback="true">
          <span class="product-badge">${product.badge}</span>
          <button class="wishlist-button ${saved ? 'is-saved' : ''}" data-wishlist="${product.id}" aria-label="${saved ? 'Remove from' : 'Add to'} wishlist: ${product.name}" aria-pressed="${saved}">${heartIcon()}</button>
          <button class="quick-view-button" data-quick-view="${product.id}">Quick look <span aria-hidden="true">↗</span></button>
        </div>
        <div class="product-info">
          <p class="product-category">${product.categoryLabel}</p>
          <div class="product-name-row"><h3>${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
          <p class="product-description">${product.description}</p>
          <div class="product-bottom-row"><span class="product-detail-note">${product.note}</span><button class="add-button" data-add="${product.id}">Add to bag <span aria-hidden="true">＋</span></button></div>
        </div>
      </article>`;
  }

  function visibleProducts() {
    let found = products.filter(product => {
      const matchesCategory = state.category === 'all' || product.category === state.category;
      const haystack = `${product.name} ${product.categoryLabel} ${product.note} ${product.description}`.toLowerCase();
      const matchesSearch = haystack.includes(state.search.trim().toLowerCase());
      const matchesWishlist = !state.wishlistOnly || state.wishlist.includes(product.id);
      return matchesCategory && matchesSearch && matchesWishlist;
    });
    if (state.sort === 'price-asc') found.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-desc') found.sort((a, b) => b.price - a.price);
    if (state.sort === 'name') found.sort((a, b) => a.name.localeCompare(b.name));
    return found;
  }

  function renderProducts() {
    const list = visibleProducts();
    $('#productGrid').innerHTML = list.map(productCard).join('');
    $('#emptyState').hidden = list.length > 0;
    $('#productGrid').hidden = list.length === 0;
    $('#resultsLine').textContent = state.wishlistOnly
      ? `Showing ${list.length} saved ${list.length === 1 ? 'piece' : 'pieces'}`
      : `Showing ${list.length} ${list.length === 1 ? 'thoughtfully chosen piece' : 'thoughtfully chosen pieces'}`;
    $$('#filterList .filter-chip').forEach(button => {
      const active = !state.wishlistOnly && button.dataset.category === state.category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function cartQuantity() {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function cartSubtotal() {
    return state.cart.reduce((sum, item) => {
      const product = productById(item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  function updateCounts() {
    $('#bagCount').textContent = cartQuantity();
    $('#drawerCount').textContent = cartQuantity();
    $('#wishlistCount').textContent = state.wishlist.length;
  }

  function renderCart() {
    const itemsRoot = $('#cartItems');
    const hasItems = state.cart.length > 0;
    $('#cartEmpty').hidden = hasItems;
    $('#cartFooter').hidden = !hasItems;
    itemsRoot.innerHTML = state.cart.map(item => {
      const product = productById(item.id);
      if (!product) return '';
      return `<article class="cart-item">
        <img src="${product.image}" alt="" loading="lazy" data-fallback="true">
        <div class="cart-item-copy"><h3>${product.name}</h3><small>${product.categoryLabel}</small>
          <div class="quantity-control" aria-label="Quantity for ${product.name}"><button data-quantity="${product.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-delta="1" aria-label="Increase quantity">＋</button></div>
          <button class="remove-item" data-remove="${product.id}">Remove</button>
        </div><span class="cart-item-price">${money(product.price * item.quantity)}</span>
      </article>`;
    }).join('');
    updateTotals();
    updateCounts();
    saveStorage();
  }

  function updateTotals() {
    const sub = cartSubtotal();
    const disc = state.coupon ? Math.round(sub * 0.1) : 0;
    const total = sub - disc;
    $('#discountRow').hidden = !disc;
    $('#cartDiscount').textContent = '−' + money(disc);
    $('#cartSubtotal').textContent = money(total);
    const left = FREE_SHIP - total;
    $('#shipFill').style.width = Math.min(100, Math.round(total / FREE_SHIP * 100)) + '%';
    $('#shipMsg').textContent = left > 0 ? `You are ${money(left)} away from free shipping.` : 'Free shipping unlocked. Nice.';
  }

  function addToCart(id) {
    const product = productById(id);
    if (!product) return;
    const existing = state.cart.find(item => item.id === id);
    if (existing) existing.quantity += 1;
    else state.cart.push({ id, quantity: 1 });
    renderCart();
    showToast(`${product.name} added to your bag.`);
  }

  function setQuantity(id, delta) {
    const item = state.cart.find(line => line.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) state.cart = state.cart.filter(line => line.id !== id);
    renderCart();
  }

  function toggleWishlist(id) {
    const product = productById(id);
    if (!product) return;
    const saved = state.wishlist.includes(id);
    state.wishlist = saved ? state.wishlist.filter(item => item !== id) : [...state.wishlist, id];
    saveStorage();
    renderProducts();
    updateCounts();
    showToast(saved ? `${product.name} removed from wishlist.` : `${product.name} saved for later.`);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span aria-hidden="true">✳</span><div>${message}</div>`;
    $('#toastRegion').append(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function openOverlay() {
    $('#overlay').hidden = false;
    document.body.classList.add('is-locked');
  }

  function closeOverlayIfClear() {
    const cartOpen = $('#cartDrawer').classList.contains('is-open');
    const modalOpen = $('#quickViewModal').classList.contains('is-open');
    if (!cartOpen && !modalOpen) {
      $('#overlay').hidden = true;
      document.body.classList.remove('is-locked');
    }
  }

  function openCart() {
    if (!$('#quickViewModal').classList.contains('is-open')) lastFocus = document.activeElement;
    closeQuickView(false);
    renderCart();
    openOverlay();
    const drawer = $('#cartDrawer');
    drawer.inert = false;
    drawer.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    $('#bagClose').focus();
  }

  function closeCart(restoreFocus = true) {
    const drawer = $('#cartDrawer');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    closeOverlayIfClear();
    if (restoreFocus) (lastFocus && lastFocus.isConnected ? lastFocus : $('#bagOpen')).focus();
  }

  function openQuickView(id) {
    const product = productById(id);
    if (!product) return;
    lastFocus = document.activeElement;
    closeCart(false);
    $('#quickViewContent').innerHTML = `<div class="quick-view-layout">
      <img src="${product.image}" alt="${product.alt}" data-fallback="true">
      <div class="quick-view-copy"><p class="eyebrow">${product.categoryLabel}</p><h2 id="quickViewTitle">${product.name}</h2><div class="quick-price">${money(product.price)}</div><p>${product.description}</p><p><strong>Details:</strong> ${product.note}. Product information and prices are illustrative demo content.</p><button class="button button-primary" data-add-from-modal="${product.id}">Add to bag <span>＋</span></button><button class="text-link modal-save" data-wishlist="${product.id}" aria-pressed="${state.wishlist.includes(product.id)}">${state.wishlist.includes(product.id) ? '♥ Saved to wishlist' : '♡ Save to wishlist'}</button></div>
      </div>`;
    const modal = $('#quickViewModal');
    modal.inert = false;
    modal.setAttribute('aria-hidden', 'false');
    openOverlay();
    requestAnimationFrame(() => modal.classList.add('is-open'));
    $('#quickViewClose').focus();
  }

  function closeQuickView(restoreFocus = true) {
    const modal = $('#quickViewModal');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    closeOverlayIfClear();
    if (restoreFocus && lastFocus && lastFocus.isConnected) lastFocus.focus();
  }

  function closeEverything() {
    closeCart(false);
    closeQuickView(false);
    $('#overlay').hidden = true;
    document.body.classList.remove('is-locked');
  }

  function setCategory(category) {
    state.category = category;
    state.wishlistOnly = false;
    renderProducts();
    $('#shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Product actions are delegated so re-rendered product cards keep working.
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    const quick = event.target.closest('[data-quick-view]');
    const wishlist = event.target.closest('[data-wishlist]');
    const quantity = event.target.closest('[data-quantity]');
    const remove = event.target.closest('[data-remove]');
    const addFromModal = event.target.closest('[data-add-from-modal]');
    const filterLink = event.target.closest('[data-filter-link]');

    if (add) addToCart(add.dataset.add);
    if (quick) openQuickView(quick.dataset.quickView);
    if (wishlist) {
      const id = wishlist.dataset.wishlist;
      toggleWishlist(id);
      if (wishlist.closest('#quickViewContent')) {
        const product = productById(id);
        const button = $('#quickViewContent [data-wishlist]');
        if (button && product) {
          button.textContent = state.wishlist.includes(id) ? '♥ Saved to wishlist' : '♡ Save to wishlist';
          button.setAttribute('aria-pressed', String(state.wishlist.includes(id)));
        }
      }
    }
    if (quantity) setQuantity(quantity.dataset.quantity, Number(quantity.dataset.delta));
    if (remove) {
      const product = productById(remove.dataset.remove);
      state.cart = state.cart.filter(item => item.id !== remove.dataset.remove);
      renderCart();
      showToast(`${product ? product.name : 'Item'} removed from your bag.`);
    }
    if (addFromModal) {
      addToCart(addFromModal.dataset.addFromModal);
      closeQuickView(false);
      openCart();
    }
    if (filterLink) {
      event.preventDefault();
      setCategory(filterLink.dataset.filterLink);
    }
  });

  $('#filterList').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    state.wishlistOnly = false;
    renderProducts();
  });

  $('#sortSelect').addEventListener('change', event => {
    state.sort = event.target.value;
    renderProducts();
  });

  $('#siteSearch').addEventListener('input', event => {
    state.search = event.target.value;
    state.wishlistOnly = false;
    renderProducts();
  });

  $('#resetFilters').addEventListener('click', () => {
    state.category = 'all'; state.search = ''; state.wishlistOnly = false;
    $('#siteSearch').value = ''; $('#sortSelect').value = 'featured'; state.sort = 'featured';
    renderProducts();
  });

  $('#searchToggle').addEventListener('click', () => {
    const panel = $('#searchPanel');
    const opening = panel.hidden;
    panel.hidden = !opening;
    $('#searchToggle').setAttribute('aria-expanded', String(opening));
    if (opening) $('#siteSearch').focus();
  });
  $('#clearSearch').addEventListener('click', () => {
    $('#siteSearch').value = ''; state.search = ''; renderProducts(); $('#siteSearch').focus();
  });

  $('#wishlistShortcut').addEventListener('click', () => {
    state.wishlistOnly = !state.wishlistOnly;
    state.category = 'all';
    $('#shopTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
    renderProducts();
    showToast(state.wishlistOnly ? 'Showing your saved pieces.' : 'Showing the full festive edit.');
  });

  $('#bagOpen').addEventListener('click', openCart);
  $('#bagClose').addEventListener('click', () => closeCart());
  $('#continueShopping').addEventListener('click', () => { closeEverything(); $('#shop').scrollIntoView({ behavior: 'smooth' }); });
  $('#checkoutButton').addEventListener('click', () => showToast('This is a front-end demo — checkout is not connected yet.'));
  $('#overlay').addEventListener('click', closeEverything);
  $('#quickViewClose').addEventListener('click', () => closeQuickView());

  $('#menuToggle').addEventListener('click', () => {
    const nav = $('#mainNav');
    const isOpen = nav.classList.toggle('is-open');
    $('#menuToggle').setAttribute('aria-expanded', String(isOpen));
    $('#menuToggle').setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  $$('[data-close-menu]').forEach(link => link.addEventListener('click', () => {
    $('#mainNav').classList.remove('is-open');
    $('#menuToggle').setAttribute('aria-expanded', 'false');
  }));

  $('#newsletterForm').addEventListener('submit', event => {
    event.preventDefault();
    const input = $('#emailInput');
    if (!input.checkValidity()) { input.reportValidity(); return; }
    $('#newsletterMessage').textContent = 'You’re on the list — thanks for joining our little celebration!';
    $('#newsletterMessage').style.color = 'var(--wine)';
    input.value = '';
    showToast('You’re in! A little festive joy is headed your way.');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const wasOpen = $('#cartDrawer').classList.contains('is-open') || $('#quickViewModal').classList.contains('is-open');
      closeEverything();
      if (wasOpen && lastFocus && lastFocus.isConnected) lastFocus.focus();
      $('#searchPanel').hidden = true;
      $('#searchToggle').setAttribute('aria-expanded', 'false');
      $('#mainNav').classList.remove('is-open');
      $('#menuToggle').setAttribute('aria-expanded', 'false');
    }
    const trap = $('#cartDrawer').classList.contains('is-open') ? $('#cartDrawer') : $('#quickViewModal').classList.contains('is-open') ? $('#quickViewModal') : null;
    if (event.key === 'Tab' && trap) {
      const focusable = $$('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])', trap).filter(el => !el.closest('[hidden]'));
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener('error', event => {
    const image = event.target;
    if (image instanceof HTMLImageElement && image.dataset.fallback === 'true' && !image.dataset.fallbackUsed) {
      image.dataset.fallbackUsed = 'true';
      image.src = bandhaniPlaceholder(image.alt || 'Rangrasa');
    }
  }, true);

  // ---- Style finder quiz ----
  const quiz = [
    { q: 'Your Garba night looks like…', a: [
      ['Hours of fast raas, no breaks', { 'gulabi-raas': 2, 'kutch-kediyu': 1 }],
      ['Photos, family and the full look', { 'laal-gajji': 2, 'neel-bandhani': 1 }],
      ['Easy, light and a little last-minute', { 'bandhej-dupatta': 2, 'raas-potli': 1 }]] },
    { q: 'Pick a colour mood', a: [
      ['Blush and bright', { 'gulabi-raas': 2 }],
      ['Deep jewel tones', { 'neel-bandhani': 2 }],
      ['Red and gold, always', { 'laal-gajji': 2, 'bandhej-dupatta': 1 }],
      ['Loud and festive', { 'kutch-kediyu': 2, 'raas-potli': 1 }]] },
    { q: 'Who are we dressing?', a: [
      ['Me, in a chaniya choli', { 'gulabi-raas': 1, 'neel-bandhani': 1, 'laal-gajji': 1 }],
      ['Me, in a kediyu', { 'kutch-kediyu': 3 }],
      ['I just need one finishing detail', { 'bandhej-dupatta': 2, 'raas-potli': 2 }]] }
  ];
  const finder = { step: 0, score: {} };
  function renderFinder() {
    const card = $('#finderCard');
    if (finder.step < quiz.length) {
      const item = quiz[finder.step];
      card.innerHTML = `<p class="finder-step">Question ${finder.step + 1} of ${quiz.length}</p><div class="finder-dots">${quiz.map((_, i) => `<i class="${i <= finder.step ? 'on' : ''}"></i>`).join('')}</div><h3>${item.q}</h3><div class="finder-options">${item.a.map((o, i) => `<button type="button" data-finder="${i}">${o[0]}</button>`).join('')}</div>`;
      return;
    }
    const best = Object.entries(finder.score).sort((x, y) => y[1] - x[1])[0];
    const p = productById(best ? best[0] : 'gulabi-raas');
    card.innerHTML = `<div class="finder-result"><img src="${p.image}" alt="${p.alt}" data-fallback="true" loading="lazy"><div><p class="finder-step">Your match</p><h3>${p.name}</h3><p>${p.description}</p><p class="finder-price">${money(p.price)}</p><div class="finder-actions"><button class="button button-primary" data-add="${p.id}">Add to bag <span>＋</span></button><button class="text-link" data-quick-view="${p.id}">Quick look</button><button class="text-link" data-finder-reset>Retake</button></div></div></div>`;
  }
  $('#finderCard').addEventListener('click', event => {
    const opt = event.target.closest('[data-finder]');
    if (opt) {
      Object.entries(quiz[finder.step].a[Number(opt.dataset.finder)][1]).forEach(([id, n]) => { finder.score[id] = (finder.score[id] || 0) + n; });
      finder.step += 1; renderFinder();
      $('#finderCard').querySelector('button')?.focus({ preventScroll: true });
    }
    if (event.target.closest('[data-finder-reset]')) { finder.step = 0; finder.score = {}; renderFinder(); }
  });

  // ---- Coupon ----
  $('#couponForm').addEventListener('submit', event => {
    event.preventDefault();
    const ok = $('#couponInput').value.trim().toUpperCase() === 'GARBA10';
    state.coupon = ok;
    $('#couponMsg').textContent = ok ? 'GARBA10 applied: 10% off.' : 'That code is not valid. Try GARBA10.';
    updateTotals();
  });

  // ---- Header polish ----
  const bar = $('#scrollProgress');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      $('.site-header').classList.toggle('is-scrolled', scrollY > 40);
      ticking = false;
    });
  }, { passive: true });

  renderFinder();
  renderProducts();
  renderCart();
})();
