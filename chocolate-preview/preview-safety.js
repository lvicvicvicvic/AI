/* Preview only. The original store and its checkout are never modified or invoked. */
window.__aiaiScrollToSku=function(){const el=document.getElementById('aiai-sku');if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});};
(()=>{'use strict';
 function closeSheet(){const modal=document.getElementById('skuModal');if(modal){modal.classList.remove('show','open','active');modal.setAttribute('aria-hidden','true');}document.body.classList.remove('aiai-sheet-open','modal-open');document.body.style.overflow='';document.body.style.position='';document.body.style.top='';document.body.style.width='';}
 function checkout(){closeSheet();const d=document.getElementById('ac-checkout-preview');if(d&&!d.open)d.showModal();}
 document.addEventListener('click',e=>{const target=e.target.closest('a,button,#skuModal');if(!target)return;
  if(target.matches('#sheetClose')||(target.id==='skuModal'&&e.target===target)){e.preventDefault();e.stopImmediatePropagation();closeSheet();return;}
  if(target.matches('#aiai-keep,#aiai-checkout,[data-ac-checkout]')){e.preventDefault();e.stopImmediatePropagation();checkout();return;}
  if(target.matches('[data-ac-close-checkout]')){e.preventDefault();document.getElementById('ac-checkout-preview')?.close();}
 },true);
 document.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();checkout();},true);
 window.AIAI_PRESENTATION_PREVIEW={checkout,closeSheet,ordersEnabled:false};
})();
