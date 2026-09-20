 (function(){ 'use strict'; if (window.__AIAI_SPLIT_BOOTED__) return; window.__AIAI_SPLIT_BOOTED__ = true; function onReady(fn){ if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', fn, { once:true }); } else { fn(); } } function waitForAiaiDom(fn){ var tries = 0; function boot(){ var hasSku = !!document.getElementById('aiai-sku'); var hasRoot = !!document.getElementById('aiai'); if((hasSku && hasRoot) || tries >= 240){ fn(); return; } tries++; setTimeout(boot, 50); } onReady(boot); } waitForAiaiDom(function(){ /* ====== 跳到選片卡（點我選擇儀式/立即選擇片數）｜更穩定：處理固定表頭/載圖 CLS 偏移 ====== */ (function initScrollToSku(){ if (window.__aiaiScrollToSku) return; var _token = 0; var _cachedTop = 0; var _cachedAt = 0; function now(){ return (Date.now ? Date.now() : (new Date()).getTime()); } function getFixedHeaderHeight(){ var max = 0; try{ var nodes = (document.body && document.body.querySelectorAll) ? document.body.querySelectorAll('*') : document.querySelectorAll('*'); for(var i=0;i<nodes.length;i++){ var el = nodes[i]; if(!el || el === document.documentElement || el === document.body) continue; var st = window.getComputedStyle(el); if(!st) continue; if(st.position !== 'fixed') continue; if(st.display === 'none' || st.visibility === 'hidden') continue; var top = st.top || ''; if(top !== '0px' && top !== '0') continue; var r = el.getBoundingClientRect(); if(!r) continue; /* 只取「接近全寬」的固定表頭，避免抓到浮動按鈕/小物件 */ if(r.width < window.innerWidth * 0.6) continue; if(r.height > max && r.height < 240) max = r.height; } }catch(e){} return Math.round(max || 0); } function getTopOffset(){ var t = now(); if(t - _cachedAt < 1200) return _cachedTop; _cachedAt = t; var h = getFixedHeaderHeight(); var safe = 0; try{ if(window.visualViewport && typeof window.visualViewport.offsetTop === 'number'){ safe = Math.max(0, Math.round(window.visualViewport.offsetTop)); } }catch(e){} _cachedTop = Math.min(240, h) + 12 + safe; return _cachedTop; } function scrollToTarget(target){ if(!target) return; var offset = getTopOffset(); function calcY(){ var y = window.pageYOffset + target.getBoundingClientRect().top - offset; if(y < 0) y = 0; return y; } var y0 = calcY(); try{ window.scrollTo({ top:y0, behavior:'smooth' }); }catch(e){ window.scrollTo(0, y0); } var my = ++_token; function correct(){ if(my !== _token) return; var diff = target.getBoundingClientRect().top - offset; if(Math.abs(diff) < 2) return; window.scrollTo(0, window.pageYOffset + diff); } setTimeout(correct, 320); setTimeout(correct, 820); setTimeout(correct, 1400); try{ target.setAttribute('tabindex','-1'); target.focus({ preventScroll:true }); }catch(e2){} } window.__aiaiScrollToSku = function(){ var target = document.querySelector('#aiai-sku #card') || document.getElementById('aiai-sku'); if(!target) return; scrollToTarget(target); }; })(); /* ====== cust-rec 箭頭 ====== */ (function initCustRec(){ var container = document.querySelector('.cust-rec'); if(!container) return; var track = container.querySelector('#cardTrack'); if(!track) return; var gapVal = parseInt(getComputedStyle(container).getPropertyValue('--gap'), 10); var gap = isNaN(gapVal) ? 16 : gapVal; var cardWidth = 260 + gap; var nextBtn = container.querySelector('.nav-btn.next'); var prevBtn = container.querySelector('.nav-btn.prev'); if(nextBtn) nextBtn.onclick = function(){ track.scrollBy({left:cardWidth, behavior:'smooth'}); }; if(prevBtn) prevBtn.onclick = function(){ track.scrollBy({left:-cardWidth, behavior:'smooth'}); }; })(); /* ====== 原本 Part2（AIAI 主頁互動）保留但修成不會爆 ====== */ (function () { var root = document.getElementById('aiai'); if (!root) return; var counts = root.querySelectorAll('.count'); function animateCount(el){ var max = parseInt(el.getAttribute('data-target') || '0', 10) || 0; var step = Math.max(1, Math.round(max/70)); var cur = 0; function run(){ cur += step; if(cur > max) cur = max; el.textContent = cur.toLocaleString(); if(cur < max) requestAnimationFrame(run); } requestAnimationFrame(run); } if ('IntersectionObserver' in window){ try{ var ioK = new IntersectionObserver(function(entries){ for(var i=0;i<entries.length;i++){ var t = entries[i]; if(!t.isIntersecting) continue; animateCount(t.target); ioK.unobserve(t.target); } },{threshold:.4}); for(var c=0;c<counts.length;c++) ioK.observe(counts[c]); }catch(e){ for(var c2=0;c2<counts.length;c2++){ counts[c2].textContent = (parseInt(counts[c2].getAttribute('data-target')||'0',10) || 0).toLocaleString(); } } }else{ for(var c3=0;c3<counts.length;c3++){ counts[c3].textContent = (parseInt(counts[c3].getAttribute('data-target')||'0',10) || 0).toLocaleString(); } } /* ====== Benefits：改回「點擊各別項目才展開圖片」(預設收合) ====== */ (function(){ var items = root.querySelectorAll('#benefits .benefit-item'); if(!items || !items.length) return; function setOpen(item, open){ var btn = item ? item.querySelector('.bi-btn') : null; var box = item ? item.querySelector('.bi-img') : null; if(!btn || !box) return; btn.setAttribute('aria-expanded', open ? 'true' : 'false'); if(open){ box.style.maxHeight = box.scrollHeight + 'px'; }else{ box.style.maxHeight = '0px'; } } for(var i=0;i<items.length;i++){ (function(item){ var btn = item.querySelector('.bi-btn'); var box = item.querySelector('.bi-img'); if(!btn || !box) return; /* init collapsed */ btn.setAttribute('aria-expanded','false'); box.style.maxHeight = '0px'; btn.addEventListener('click', function(){ var isOpen = (btn.getAttribute('aria-expanded') === 'true'); /* 需要手風琴效果就關掉其他項目（更省版面） */ for(var j=0;j<items.length;j++){ if(items[j] !== item) setOpen(items[j], false); } setOpen(item, !isOpen); }); })(items[i]); } /* resize 時修正已展開高度 */ window.addEventListener('resize', function(){ for(var i=0;i<items.length;i++){ var btn = items[i].querySelector('.bi-btn'); var box = items[i].querySelector('.bi-img'); if(!btn || !box) continue; if(btn.getAttribute('aria-expanded') === 'true'){ box.style.maxHeight = box.scrollHeight + 'px'; } } }); })(); var faqs = root.querySelectorAll('.faq-q'); for(var fq=0;fq<faqs.length;fq++){ (function(q){ q.onclick = function(){ q.classList.toggle('open'); var a = q.nextElementSibling; var open = !!(a && a.style.maxHeight); if(a) a.style.maxHeight = open ? '' : a.scrollHeight + 'px'; q.setAttribute('aria-expanded', String(!open)); }; q.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); q.click(); } }); })(faqs[fq]); } var ingEl = root.querySelector('.swiper-ing'); if (ingEl && typeof window.Swiper === 'function') { new Swiper(ingEl,{ loop:true, slidesPerView:1.25, spaceBetween:16, navigation:{ nextEl:root.querySelector('.swiper-button-next'), prevEl:root.querySelector('.swiper-button-prev') }, breakpoints:{600:{slidesPerView:2},1024:{slidesPerView:3}}, touchAngle:30 }); } var effEl = root.querySelector('.effect-swiper'); if (effEl && typeof window.Swiper === 'function') { var effSwiper = new Swiper(effEl,{ loop:false, slidesPerView:1, touchAngle:30 }); var btnF = root.querySelector('#btn-f'); var btnM = root.querySelector('#btn-m'); function sync(){ if(!btnF||!btnM) return; var idx = effSwiper.realIndex || 0; btnF.classList.toggle('active', idx===0); btnM.classList.toggle('active', idx===1); btnF.setAttribute('aria-selected', String(idx===0)); btnM.setAttribute('aria-selected', String(idx===1)); } if (btnF) btnF.onclick = function(){ effSwiper.slideTo(0); sync(); }; if (btnM) btnM.onclick = function(){ effSwiper.slideTo(1); sync(); }; effSwiper.on('slideChange', sync); sync(); } var rbs = root.querySelectorAll('.review-block'); for(var r=0;r<rbs.length;r++){ var b = rbs[r]; var tag = b.querySelector('.random-product-label'); if(tag) tag.textContent = b.getAttribute('data-product') || '豪華甜蜜六片組'; } (function(){ var promoTargets = document.querySelectorAll('#aiai-promo .fade-target'); if(!promoTargets || !promoTargets.length) return; if('IntersectionObserver' in window){ try{ var io = new IntersectionObserver(function(entries){ for(var i=0;i<entries.length;i++){ if(entries[i].isIntersecting){ entries[i].target.classList.add('active'); io.unobserve(entries[i].target); } } },{threshold:.3}); for(var j=0;j<promoTargets.length;j++) io.observe(promoTargets[j]); }catch(e){ for(var j2=0;j2<promoTargets.length;j2++) promoTargets[j2].classList.add('active'); } }else{ for(var j3=0;j3<promoTargets.length;j3++) promoTargets[j3].classList.add('active'); } })(); })(); /* ====== SKU / Modal / Float CTA（恢復：按「立即結帳」先跳加購，點叉叉/點空白處=直接結帳不加購）— 已補回 24 ====== */ (function(){ var skuRoot = document.getElementById('aiai-sku'); if(!skuRoot) return; function qs(sel){ return skuRoot.querySelector(sel); } var SHIPPING_FEE_SMALL = 80; /* 主選片卡維持兩排：上排 3片 / 12片 / 24片，下排 6片主推，1片只作單片補購 */ var PACK = {
  "3": {qty:3, price:948, displayPrice:948, originalPrice:null, itemCount:1, bubble:"3片組｜一人約 NT$158", perText:"（一人約 NT$158）"},
  "6": {qty:6, price:998, displayPrice:998, originalPrice:1298, itemCount:1, bubble:"6片甜蜜組｜限時優惠中，只比3片多 NT$50", perText:"（一人約 NT$83）"},
  "6lube": {qty:6, price:1317, displayPrice:1317, originalPrice:1497, grossPrice:1497, compareAtPrice:1497, itemCount:2, bubble:"6片＋熱感瑪卡潤滑液｜完整準備，一次帶齊", perText:"（巧克力 6 片＋熱感瑪卡潤滑液）"},
  "12": {qty:12, price:1698, displayPrice:1698, originalPrice:1998, itemCount:1, bubble:"12片常備｜固定伴侶、多次約會都備好，不用每次臨時買", perText:"（一人約 NT$71）"},
  "24": {qty:24, price:2598, displayPrice:2598, originalPrice:2998, itemCount:1, bubble:"24片回購備貨｜買過後大量常備更適合", perText:"（一人約 NT$54）"}
};
var ADDON = { lube:{price:499, originalPrice:899}, bag:{price:29} };
var BAG_GIFT_THRESHOLD = 1000;
var AIAI_IMAGES = {
  "3":"assets/aa9fcd5ab8968bc1.avif",
  "6":"assets/ec3c80768f7403a5.avif",
  "12":"assets/f3e91337c21c6df3.avif",
  "6lube":"assets/9bd8ef1c0ce2e52b.png",
  "24":"assets/393724eb68a45440.avif"
};
function formatTWD(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); } function perPerson(price, qty){ return Math.floor(price/(qty*2)); } function packLabel(q){ q = String(q); return (q === '3' ? '3片組' : (q === '6' ? '6片甜蜜組' : (q === '6lube' ? '6片＋熱感瑪卡組' : (q === '12' ? '12片常備組' : (q === '24' ? '24片回購組' : (q + ' 片')))))); } var imgEl = qs('#img'); var bubbleEl = qs('#bubble'); var priceEl = qs('#price'); var comparePriceEl = qs('#comparePrice'); var perEl = qs('#per'); var ctaEl = qs('#cta'); var stickyEl = qs('#sticky'); var shipTipEl = qs('#shipTip'); var skuModal = qs('#skuModal'); var sheetCloseBtn = qs('#sheetClose'); var sumCountEl = qs('#sum-count'); var bagPriceTextEl = qs('#bagPriceText'); var sheetChocoEl = qs('#sheetChoco'); var discountTipEl = qs('#discountTip'); var discountBarWrapEl = qs('#discountProgress'); var discountBarEl = qs('#discountBar'); var bagLineEl = qs('#bagLine'); var bagNeedEl = qs('#bagNeed'); var saveAmountEl = qs('#saveAmount'); var totalAmountEl = qs('#totalAmount'); function getBaseQty(){ var r = qs('input[name="qty"]:checked'); return r ? String(r.value) : "6"; } function updateShipTip(q){ if(!shipTipEl) return; shipTipEl.textContent = '線上支付限量免運｜隱私包裝出貨'; } function getAddonChecked(id){ var el = qs('#' + id); return !!(el && el.checked); } function getMorePacks(){ var ids = ["more-3","more-6","more-12","more-24"]; var out = []; for(var i=0;i<ids.length;i++){ var el = qs('#' + ids[i]); if(el && el.checked) out.push(String(el.value)); } return out; } function syncSheetTop(){ var baseQty = getBaseQty(); if(sheetChocoEl){ sheetChocoEl.src = AIAI_IMAGES[baseQty] || (imgEl ? imgEl.src : sheetChocoEl.src); sheetChocoEl.alt = 'AIAI 愛艾巧克力 ' + packLabel(baseQty); } } function syncFloatPrice(){ var price = document.getElementById('float-price'); var sel = document.getElementById('float-pack'); if(!price || !sel) return; var opt = sel.options[sel.selectedIndex]; var p = opt ? opt.getAttribute('data-price') : ''; price.textContent = p ? ('NT$' + p) : ''; } function syncFloatTo(q){ var sel = document.getElementById('float-pack'); if(!sel) return; var opts = sel.options || []; for(var i=0;i<opts.length;i++){ if(String(opts[i].value) === String(q)){ sel.value = String(q); break; } } syncFloatPrice(); } function calcTotals(){
  var baseQty = getBaseQty();
  var base = PACK[baseQty];
  if(!base) base = PACK["6"];
  var more = getMorePacks();
  var moreSum = 0;
  var moreCompareSum = 0;
  var moreCount = 0;
  for(var i=0;i<more.length;i++){
    var p = PACK[more[i]];
    if(p){
      moreSum += (p.grossPrice || p.price || 0);
      moreCompareSum += (p.compareAtPrice || p.grossPrice || p.price || 0);
      moreCount += (p.itemCount || 1);
    }
  }
  var lube = getAddonChecked('addon-lube');
  var bag = getAddonChecked('addon-bag');
  var baseSpend = (base.grossPrice || base.price || 0);
  var baseCompare = (base.compareAtPrice || base.grossPrice || base.price || 0);
  var baseCount = (base.itemCount || 1);
  var spendTotal = baseSpend + moreSum + (lube ? ADDON.lube.price : 0);
  var compareTotal = baseCompare + moreCompareSum + (lube ? (ADDON.lube.originalPrice || ADDON.lube.price) : 0);
  var bagReached = (spendTotal >= BAG_GIFT_THRESHOLD);
  var bagIsGift = !!(bag && bagReached);
  var bagPay = bag ? (bagIsGift ? 0 : ADDON.bag.price) : 0;
  var originalTotal = compareTotal + bagPay;
  var discountCount = baseCount + moreCount + (lube ? 1 : 0);
  var discountRate = discountCount >= 3 ? 0.85 : (discountCount >= 2 ? 0.88 : 1);
  var discountedTotal = spendTotal;
  var saveFromDiscount = 0;
  if(discountRate < 1 && spendTotal > 0){
    discountedTotal = Math.round(spendTotal * discountRate);
  }
  saveFromDiscount = Math.max(0, compareTotal - discountedTotal);
  var totalItems = discountCount;
  var finalTotal = discountedTotal + bagPay;
  return {
    baseQty: baseQty,
    basePrice: base.price,
    baseGrossPrice: baseSpend,
    shippingFee: 0,
    morePacks: more,
    moreSum: moreSum,
    lube: lube,
    bag: bag,
    spendTotal: spendTotal,
    bagReached: bagReached,
    originalTotal: originalTotal,
    bagIsGift: bagIsGift,
    bagPay: bagPay,
    discountCount: discountCount,
    discountRate: discountRate,
    saveFromDiscount: saveFromDiscount,
    discountedTotal: discountedTotal,
    finalTotal: finalTotal,
    totalItems: totalItems
  };
}
function updateSummary(){ var t = calcTotals();
  var lubeInput = qs('#addon-lube');
  var lubeCard = qs('#lubeCard');
  if(lubeInput && lubeCard){
    if(t.baseQty === '6lube'){
      lubeInput.checked = false;
      lubeInput.disabled = true;
      lubeCard.style.display = 'none';
    }else{
      lubeInput.disabled = false;
      lubeCard.style.display = '';
    }
  }
  t = calcTotals(); /* 提袋邏輯修正： - 未滿 NT$1000：使用者點「送禮提袋」才會真的加購（+NT$29） - 滿 NT$1000：只顯示為「贈品」（由 1shop 滿額贈自動送），不需要也不會被這段 JS 加入購物車 */ var bagInput = qs('#addon-bag'); if(bagInput){ if(t.bagReached){ if(!bagInput.checked){ bagInput.checked = true; } bagInput.disabled = true; bagInput.dataset.autoGift = '1'; }else{ bagInput.disabled = false; if(bagInput.dataset.autoGift === '1'){ bagInput.checked = false; delete bagInput.dataset.autoGift; } } } /* 重新計算一次，確保顯示與勾選狀態一致 */ t = calcTotals(); if(sumCountEl) sumCountEl.textContent = t.totalItems + ' 件'; if(bagPriceTextEl){ if(t.bag){ bagPriceTextEl.textContent = t.bagIsGift ? '已贈送' : '單購 NT$' + formatTWD(ADDON.bag.price) + '｜滿額贈'; }else{ bagPriceTextEl.textContent = '單購 NT$' + formatTWD(ADDON.bag.price) + '｜滿額贈'; } } /* 多省下：只顯示折扣省下，不含提袋贈品 29 */ if(saveAmountEl){ saveAmountEl.textContent = 'NT$' + formatTWD(Math.max(0, t.saveFromDiscount || 0)); } if(totalAmountEl){ totalAmountEl.textContent = 'NT$' + formatTWD(Math.max(0, t.finalTotal || 0)); } /* 折扣提示文字 */ if(discountTipEl){ if(t.discountCount >= 3){ discountTipEl.textContent = '已套用 3 件 85 折'; }else if(t.discountCount >= 2){ discountTipEl.textContent = '已套用 2 件 88 折，再加 1 件升級 85 折'; }else{ discountTipEl.textContent = '目前 1 件，加購任一品項享 88 折'; } } /* 提袋贈品狀態文字（滿1000 提袋變贈品｜以 spendTotal 判斷） */ var progTotal = t.spendTotal; var need = Math.max(0, BAG_GIFT_THRESHOLD - progTotal); var bagReached = t.bagReached; if(bagNeedEl){ bagNeedEl.textContent = bagReached ? '已贈送' : '滿額即贈'; } if(bagLineEl){ bagLineEl.setAttribute('data-reached', bagReached ? '1' : '0'); } /* 合併單一進度條（折扣2階段 + 贈品滿額1階段 = 共3格權重） */ var discStep = t.discountCount; if(discStep < 1) discStep = 1; if(discStep > 3) discStep = 3; var discNorm = (discStep - 1) / 2; /* 0~1 */ var bagNorm = Math.min(1, progTotal / BAG_GIFT_THRESHOLD); /* 0~1 */ /* 折扣(2階)權重 2，滿額贈品(1階)權重 1 */ var overallNorm = (discNorm * 2 + bagNorm) / 3; var overallPct = Math.round(overallNorm * 100); if(discountBarEl){ discountBarEl.style.width = overallPct + '%'; } if(discountBarWrapEl){ discountBarWrapEl.setAttribute('aria-valuenow', String(overallPct)); discountBarWrapEl.setAttribute('aria-valuetext', '折扣進度：' + discStep + ' 件 / 3 件，提袋贈品：' + (bagReached ? '已贈送' : '滿額即贈') + '，總件數：' + t.totalItems + ' 件' ); } } function updateVariant(q){
  q = String(q);
  var v = PACK[q];
  if(!v) return;
  if(imgEl) imgEl.src = AIAI_IMAGES[q] || imgEl.src;
  if(sheetChocoEl) {
    sheetChocoEl.src = AIAI_IMAGES[q] || sheetChocoEl.src;
    sheetChocoEl.alt = 'AIAI 愛艾巧克力 ' + packLabel(q);
  }
  if(bubbleEl) bubbleEl.innerHTML = '<span></span><small>' + (v.bubble || '') + '</small>';
  var showPrice = (typeof v.displayPrice === 'number') ? v.displayPrice : v.price;
  if(priceEl) priceEl.textContent = 'NT$ ' + formatTWD(showPrice);
  if(comparePriceEl){
    if(typeof v.originalPrice === 'number'){
      comparePriceEl.textContent = '原價 NT$' + formatTWD(v.originalPrice);
      comparePriceEl.style.display = 'inline';
    }else{
      comparePriceEl.textContent = '';
      comparePriceEl.style.display = 'none';
    }
  }
  if(perEl){
    if(v.perText){ perEl.textContent = v.perText; }
    else { perEl.textContent = '（一人約 NT$ ' + perPerson(showPrice, v.qty) + '）'; }
  }
  var labelName = packLabel(q);
  var label = '立即結帳・' + labelName;
  if(ctaEl){ ctaEl.textContent = label; ctaEl.href = '#buy-' + q; }
  if(stickyEl){ stickyEl.textContent = label; stickyEl.href = '#buy-' + q; }
  syncFloatTo(q);
  updateShipTip(q);
  updateSummary();
}
function selectQty(q){ q = String(q); var inp = qs('input[name="qty"][value="' + q + '"]'); if(inp){ inp.checked = true; inp.dispatchEvent(new Event('change',{bubbles:true})); } } var qtyInputs = skuRoot.querySelectorAll('input[name="qty"]'); for(var i=0;i<qtyInputs.length;i++){ qtyInputs[i].addEventListener('change', function(e){ updateVariant(e.target.value); }); } /* 缺貨時隱藏潤滑液，避免造成挫折 */ (function(){ var lube = qs('#addon-lube'); var card = qs('#lubeCard'); if(lube && lube.disabled && card){ card.style.display = 'none'; } })(); function openSheet(){ if(!skuModal) return; var resetIds = ["more-3","more-6","more-12","more-24","addon-lube","addon-bag"]; for(var i=0;i<resetIds.length;i++){ var el = qs('#' + resetIds[i]); if(el) el.checked = false; } syncSheetTop(); updateSummary(); skuModal.classList.add('show'); skuModal.setAttribute('aria-hidden','false'); document.body.classList.add('aiai-sheet-open'); } function closeSheet(){ if(!skuModal) return; skuModal.classList.remove('show'); skuModal.setAttribute('aria-hidden','true'); document.body.classList.remove('aiai-sheet-open'); } var watchIds = ["more-3","more-6","more-12","more-24","addon-lube","addon-bag"]; for(var w=0;w<watchIds.length;w++){ (function(id){ var el = qs('#' + id); if(el) el.addEventListener('change', updateSummary); })(watchIds[w]); } function delay(ms){ return new Promise(function(r){ setTimeout(r, ms); }); } async function proceed(includeExtras){
  var addPack = window.__aiaiAddToCartByPack;
  if(typeof addPack !== 'function'){ closeSheet(); return; }
  var t = calcTotals();
  closeSheet();
  await delay(50);
  try{
    /* 使用舊版穩定跳結帳流程：先加主商品，成功後才處理加購與打開結帳區。 */
    var baseAdded = await addPack(String(t.baseQty), false);
    if(!baseAdded) return;
    await delay(320);

    if(includeExtras){
      for(var i=0;i<t.morePacks.length;i++){
        await addPack(String(t.morePacks[i]), false);
        await delay(320);
      }
      if(t.lube && t.baseQty !== '6lube' && typeof window.__aiaiAddLube === 'function'){
        await window.__aiaiAddLube(false);
        await delay(320);
      }
      if(t.bag && !t.bagIsGift && typeof window.__aiaiAddBag === 'function'){
        await window.__aiaiAddBag(false);
        await delay(320);
      }
    }

    try{
      if(typeof window.__aiaiOpenCheckoutPanelSoftSafe === 'function'){
        await window.__aiaiOpenCheckoutPanelSoftSafe();
      }
      var target = document.getElementById('one-checkout') || document.querySelector('.one-checkout') || document.querySelector('.cart-wrap');
      if(target && target.scrollIntoView){
        try{ target.scrollIntoView({behavior:'smooth', block:'start'}); }catch(e2){}
      }
    }catch(e){}
    if(typeof window.__aiaiForceRevealImages === 'function'){
      try{ window.__aiaiForceRevealImages(); }catch(e3){}
    }
    if(typeof window.__aiaiCleanupBootstrap === 'function'){
      try{ window.__aiaiCleanupBootstrap(); }catch(e4){}
    }
  } finally {
    closeSheet();
  }
}
var keepBtn = qs('#aiai-keep'); var checkoutBtn = qs('#aiai-checkout'); if(keepBtn){ keepBtn.addEventListener('click', function(e){ e.preventDefault(); proceed(false); }); } if(checkoutBtn){ checkoutBtn.addEventListener('click', function(e){ e.preventDefault(); proceed(true); }); } /* 點叉叉 / 點空白處（遮罩）= 視同「直接結帳（不加購）」 */ var __dismissLock = false; async function dismissAsDirectCheckout(){ if(__dismissLock) return; __dismissLock = true; try{ await proceed(false); }finally{ __dismissLock = false; } } if(sheetCloseBtn){ sheetCloseBtn.addEventListener('click', function(e){ e.preventDefault(); dismissAsDirectCheckout(); }); } if(skuModal){ skuModal.addEventListener('click', function(e){ if(e.target === skuModal){ dismissAsDirectCheckout(); } }); } if(ctaEl){ ctaEl.addEventListener('click', function(e){ e.preventDefault(); openSheet(); }); } if(stickyEl){ stickyEl.addEventListener('click', function(e){ e.preventDefault(); openSheet(); }); } /* ====== Float CTA（不擋選片卡） ====== */ var bar = document.getElementById('float-cta'); var sel = document.getElementById('float-pack'); var buy = document.getElementById('float-buy'); function isSkuInView(){ var r = skuRoot.getBoundingClientRect(); return (r.top < window.innerHeight*0.85) && (r.bottom > window.innerHeight*0.15); } function isCheckoutInView(){ try{ var nodes = [ document.getElementById('one-checkout'), document.querySelector('.one-checkout'), document.querySelector('.cart-wrap'), document.querySelector('.cart-content'), document.querySelector('.list-cart-summary') ]; for(var i=0;i<nodes.length;i++){ var el = nodes[i]; if(!el) continue; var st = null; try{ st = window.getComputedStyle(el); }catch(e0){} if(st && (st.display === 'none' || st.visibility === 'hidden')) continue; var r = el.getBoundingClientRect(); if(!r || r.width <= 1 || r.height <= 1) continue; if((r.top < window.innerHeight*0.85) && (r.bottom > window.innerHeight*0.15)){ return true; } } }catch(e){} return false; } function toggleBar(){ if(!bar) return; var scrolled = window.scrollY > window.innerHeight * 0.35; var show = scrolled && !isSkuInView() && !isCheckoutInView(); bar.classList.toggle('show', show); bar.setAttribute('aria-hidden', show ? 'false' : 'true'); } if(sel){ sel.addEventListener('change', function(){ syncFloatPrice(); }); syncFloatPrice(); } if(buy){ buy.addEventListener('click', function(){ var pack = sel ? String(sel.value || '6') : '6'; selectQty(pack); openSheet(); }); } window.addEventListener('scroll', toggleBar, {passive:true}); window.addEventListener('resize', toggleBar); setTimeout(toggleBar, 400); /* init */ selectQty('6'); toggleBar(); syncSheetTop(); updateShipTip('6'); updateSummary(); })(); }); })();

