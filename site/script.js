
(() => {
  'use strict';

  const config = window.AIAI_GUMMY_CONFIG || {
    checkoutUrl: '',
    unitPrice: null,
    currency: 'NT$',
    packDiscounts: { 1: 1, 2: 0.92, 3: 0.85 },
    cartCount: 0
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Announcement rotator
  const announcement = $('[data-announcement]');
  if (announcement) {
    const slides = $$('.announcement__slide', announcement);
    let current = 0;
    const activate = (index) => {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      const active = slides[index];
      announcement.style.backgroundColor = active.dataset.bg || '#111111';
      announcement.style.color = active.dataset.bg === '#e8b8b7' ? '#111111' : '#ffffff';
      const duration = Number(active.dataset.duration || 5200);
      window.setTimeout(() => {
        current = (current + 1) % slides.length;
        activate(current);
      }, duration);
    };
    if (slides.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) activate(0);
  }

  // Sticky header after hero top
  const header = $('[data-header]');
  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle('is-sticky', window.scrollY > 360);
  };
  syncHeader();
  addEventListener('scroll', syncHeader, { passive: true });

  // Mobile navigation
  const menuOpen = $('[data-menu-open]');
  const drawer = $('[data-menu-drawer]');
  const overlay = $('.menu-overlay');
  const closeButtons = $$('[data-menu-close]');
  const menuLinks = $$('[data-menu-link]');
  let closeTimer;

  const openMenu = () => {
    if (!drawer || !overlay || !menuOpen) return;
    clearTimeout(closeTimer);
    drawer.hidden = false;
    overlay.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
    });
    drawer.setAttribute('aria-hidden', 'false');
    menuOpen.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    if (!drawer || !overlay || !menuOpen) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    menuOpen.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    closeTimer = window.setTimeout(() => {
      drawer.hidden = true;
      overlay.hidden = true;
    }, 260);
  };
  menuOpen?.addEventListener('click', () => menuOpen.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu());
  closeButtons.forEach(btn => btn.addEventListener('click', closeMenu));
  menuLinks.forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Reveal animations — content remains visible if JS is unavailable.
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    reveals.forEach(el => revealObserver.observe(el));
  }

  // Accordion behavior
  $$('.accordion').forEach((item, index) => {
    const button = $('button', item);
    const panel = $('.accordion__panel', item);
    if (!button || !panel) return;
    const panelId = `aiai-accordion-panel-${index}`;
    panel.id = panelId;
    button.setAttribute('aria-controls', panelId);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
    });
  });

  // Product gallery
  const gallery = $('[data-gallery]');
  if (gallery) {
    const slides = $$('.gallery-slide', gallery);
    const thumbs = $$('[data-gallery-thumb]', gallery);
    let current = 0;
    const setSlide = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('is-active', i === current);
        thumb.setAttribute('aria-selected', String(i === current));
      });
    };
    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => setSlide(i)));
    $('[data-gallery-prev]', gallery)?.addEventListener('click', () => setSlide(current - 1));
    $('[data-gallery-next]', gallery)?.addEventListener('click', () => setSlide(current + 1));
    setSlide(0);
  }

  // Grüns-style people + purchase-plan selector
  const personButtons = $$('[data-person-count]');
  const planButtons = $$('[data-plan]');
  const peopleNote = $('[data-people-note]');
  const saveTag = $('[data-save-tag]');
  const subscriptionFrequency = $('[data-subscription-frequency]');
  const onetimeFrequency = $('[data-onetime-frequency]');
  const atcLabel = $('[data-atc-label]');
  const atcPrice = $('[data-atc-price]');
  let selectedPeople = 1;
  let selectedPlan = 'subscription';

  const formatPrice = value => Number.isFinite(value)
    ? `${config.currency || 'NT$'} ${Math.round(value).toLocaleString('zh-TW')}`
    : 'NT$ —';

  const toOptionalNumber = value => (value === null || value === undefined || value === '') ? NaN : Number(value);
  const getPlanBasePrice = plan => plan === 'subscription'
    ? toOptionalNumber(config.subscriptionPrice)
    : toOptionalNumber(config.oneTimePrice);

  const updatePurchaseUI = () => {
    personButtons.forEach(button => {
      const selected = Number(button.dataset.personCount) === selectedPeople;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-checked', String(selected));
    });
    planButtons.forEach(button => {
      const selected = button.dataset.plan === selectedPlan;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-checked', String(selected));
    });

    if (peopleNote) peopleNote.textContent = selectedPeople === 1
      ? '每個配送週期準備 1 袋，適合自己每天固定補充。'
      : '每個配送週期準備 2 袋，適合兩個人一起把習慣養起來。';
    if (saveTag) saveTag.classList.toggle('is-active', selectedPeople === 2);
    if (subscriptionFrequency) subscriptionFrequency.textContent = `每 ${config.deliveryWeeks || 4} 週配送 ${selectedPeople} 袋`;
    if (onetimeFrequency) onetimeFrequency.textContent = `${selectedPeople} 袋・一次配送，不自動續訂`;

    ['subscription', 'onetime'].forEach(plan => {
      const base = getPlanBasePrice(plan);
      const total = Number.isFinite(base) ? base * selectedPeople : NaN;
      const daily = Number.isFinite(total) && Number(config.daysPerPouch) > 0
        ? total / Number(config.daysPerPouch)
        : NaN;
      const priceNode = $(`[data-plan-price="${plan}"]`);
      const compareNode = $(`[data-plan-compare="${plan}"]`);
      const dailyNode = $(`[data-plan-daily="${plan}"]`);
      if (priceNode) priceNode.textContent = formatPrice(total);
      if (dailyNode) dailyNode.textContent = Number.isFinite(daily)
        ? `${selectedPeople === 2 ? '兩人' : ''}每天約 ${formatPrice(daily)}`
        : '每日約 NT$ —';
      if (compareNode) {
        const compareBase = toOptionalNumber(config.compareAtPrice);
        const compareTotal = Number.isFinite(compareBase) ? compareBase * selectedPeople : NaN;
        compareNode.textContent = Number.isFinite(compareTotal) && plan === 'subscription' ? formatPrice(compareTotal) : '';
      }
    });

    const selectedBase = getPlanBasePrice(selectedPlan);
    const selectedTotal = Number.isFinite(selectedBase) ? selectedBase * selectedPeople : NaN;
    if (atcPrice) atcPrice.textContent = formatPrice(selectedTotal);
    if (atcLabel) atcLabel.textContent = selectedPlan === 'subscription' ? '開始定期補貨' : '單次加入購物車';
  };

  personButtons.forEach(button => button.addEventListener('click', () => {
    selectedPeople = Number(button.dataset.personCount || 1);
    updatePurchaseUI();
  }));
  planButtons.forEach(button => {
    const selectPlan = () => {
      selectedPlan = button.dataset.plan || 'onetime';
      updatePurchaseUI();
    };
    button.addEventListener('click', selectPlan);
    button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectPlan();
      }
    });
  });
  updatePurchaseUI();

  // Nutrition label modal
  const nutritionModal = $('[data-nutrition-modal]');
  const openNutrition = () => {
    if (!nutritionModal) return;
    nutritionModal.classList.add('is-open');
    nutritionModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('[data-nutrition-close]', nutritionModal)?.focus();
  };
  const closeNutrition = () => {
    if (!nutritionModal) return;
    nutritionModal.classList.remove('is-open');
    nutritionModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  $$('[data-nutrition-open]').forEach(button => button.addEventListener('click', openNutrition));
  $('[data-nutrition-close]')?.addEventListener('click', closeNutrition);
  nutritionModal?.addEventListener('click', event => { if (event.target === nutritionModal) closeNutrition(); });
  $('[data-flavor-info]')?.addEventListener('click', () => {
    const flavorSlide = $('[data-gallery-thumb="2"]');
    flavorSlide?.click();
    flavorSlide?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Cart preview behavior
  const cartCountNodes = $$('[data-cart-count]');
  let cartCount = Number(config.cartCount || 0);
  const toast = $('[data-toast]');
  let toastTimer;
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
  };
  $$('[data-add-to-cart]').forEach(button => {
    button.addEventListener('click', () => {
      const planUrl = config.checkoutUrls?.[selectedPlan] || config.checkoutUrl;
      if (planUrl) {
        location.href = planUrl;
        return;
      }
      cartCount += selectedPeople;
      cartCountNodes.forEach(node => node.textContent = String(cartCount));
      showToast(`已選擇 ${selectedPeople} 人份・${selectedPlan === 'subscription' ? '定期補貨' : '單次購買'}｜正式上線後連到 1SHOP`);
    });
  });
  $('[data-cart-button]')?.addEventListener('click', () => showToast('目前為互動設計稿，購物車尚未串接。'));
  addEventListener('keydown', event => { if (event.key === 'Escape') closeNutrition(); });

  // Native mobile buybar. Observer callbacks avoid per-scroll layout reads.
  const mobileBuybar = $('[data-mobile-buybar]');
  if (mobileBuybar && 'IntersectionObserver' in window) {
    let heroVisible = true, buyVisible = false, footerVisible = false, ctaVisible = false;
    const sync = () => mobileBuybar.classList.toggle('is-visible', !heroVisible && !buyVisible && !footerVisible && !ctaVisible);
    const watch = (selector, set, threshold) => {
      const el=$(selector); if(!el) return;
      new IntersectionObserver(entries=>{set(entries[0].isIntersecting);sync();}, {threshold:threshold || 0}).observe(el);
    };
    watch('.hero', v=>heroVisible=v);
    watch('#buy', v=>buyVisible=v, 0);
    watch('.site-footer', v=>footerVisible=v);
    watch('.final-cta', v=>ctaVisible=v);
    sync();
  }
})();
