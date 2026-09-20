/* Presentation interactions; product data and offer arithmetic are retained in original-interactions.js. */
(()=>{'use strict';const reduced=matchMedia('(prefers-reduced-motion: reduce)');const motion=()=>reduced.matches?'auto':'smooth';
const nav=document.querySelector('.ac-menu-toggle'),menu=document.getElementById('ac-menu');
function toggleMenu(open){menu.hidden=!open;nav.setAttribute('aria-expanded',String(open));}
nav?.addEventListener('click',()=>toggleMenu(menu.hidden));
menu?.addEventListener('click',e=>{if(e.target.closest('a'))toggleMenu(false)});
document.addEventListener('click',e=>{if(!e.target.closest('.ac-nav,.ac-menu'))toggleMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggleMenu(false);window.AIAI_PRESENTATION_PREVIEW.closeSheet();}});
const heroRail=document.querySelector('[data-ac-hero-rail]');
function heroMove(d){heroRail.scrollBy({left:d*heroRail.clientWidth,behavior:motion()});}
document.querySelector('[data-ac-hero-prev]')?.addEventListener('click',()=>heroMove(-1));document.querySelector('[data-ac-hero-next]')?.addEventListener('click',()=>heroMove(1));
heroRail?.addEventListener('scroll',()=>{const n=Math.round(heroRail.scrollLeft/heroRail.clientWidth)+1;document.querySelector('[data-ac-hero-counter]').textContent=`0${n} / 02`;},{passive:true});
const ing=document.querySelector('.swiper-ing .swiper-wrapper');
function slideStep(el,dir){const c=el.firstElementChild;if(c)el.scrollBy({left:dir*(c.getBoundingClientRect().width+16),behavior:motion()});}
document.querySelector('.swiper-ing .swiper-button-prev')?.addEventListener('click',()=>slideStep(ing,-1));document.querySelector('.swiper-ing .swiper-button-next')?.addEventListener('click',()=>slideStep(ing,1));
for(const b of document.querySelectorAll('.swiper-ing .swiper-button-prev,.swiper-ing .swiper-button-next')){b.setAttribute('role','button');b.tabIndex=0;b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.click()}});}
const genderRail=document.querySelector('.effect-swiper .swiper-wrapper');const btnF=document.getElementById('btn-f'),btnM=document.getElementById('btn-m');
function gender(i){genderRail.style.transform=`translateX(-${i*100}%)`;[btnF,btnM].forEach((b,n)=>{b.classList.toggle('active',n===i);b.setAttribute('aria-selected',String(n===i));b.tabIndex=n===i?0:-1;const panel=document.getElementById(n?'tab-m':'tab-f');panel.setAttribute('aria-hidden',String(n!==i));panel.inert=n!==i;});}
btnF?.addEventListener('click',()=>gender(0));btnM?.addEventListener('click',()=>gender(1));[btnF,btnM].forEach((b,n)=>b?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();gender(1-n);[btnF,btnM][1-n].focus();}}));if(genderRail)gender(0);
const rec=document.getElementById('cardTrack');const prev=document.querySelector('.cust-rec .prev'),next=document.querySelector('.cust-rec .next');if(prev)prev.onclick=()=>slideStep(rec,-1);if(next)next.onclick=()=>slideStep(rec,1);
// Original copy and image content stays present even when a browser disables animation.
if('IntersectionObserver'in window&&!reduced.matches){document.documentElement.classList.add('ac-reveal-ready');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ac-in');io.unobserve(e.target);}}),{rootMargin:'80px 0px',threshold:.06});
 for(const el of document.querySelectorAll('#features .feat-item,#aiai-vs-chocolate .wrap,.timing-item,.mid-cta .wrap,.cust-rec .header-row,#benefits>h2,.faq-header,.review-dark-wrapper>h2')){el.dataset.acReveal='';io.observe(el);}}
// Make existing source photographs inspectable without cropping or replacing them.
for(const image of document.querySelectorAll('.bi-img img,.rec-card>img,.review-image img')){image.style.cursor='zoom-in';image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label','放大查看原圖');const open=()=>{let d=document.getElementById('ac-image-view');if(!d){d=document.createElement('dialog');d.id='ac-image-view';d.innerHTML='<button type="button" aria-label="關閉">×</button><img alt="">';d.style.cssText='border:0;border-radius:16px;padding:44px 12px 12px;background:#111;width:min(860px,94vw);max-height:94dvh';const b=d.querySelector('button');b.style.cssText='position:absolute;top:5px;right:8px;width:34px;height:34px;font-size:24px;color:white;border:0;background:transparent';b.onclick=()=>d.close();d.onclick=e=>{if(e.target===d)d.close()};document.body.append(d)}const im=d.querySelector('img');im.src=image.src;im.alt=image.alt;im.style.cssText='display:block;max-height:80dvh;width:100%;object-fit:contain';d.showModal()};image.addEventListener('click',open);image.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();open()}});}
// Announce correct selection state without any external tracking calls.
for(const input of document.querySelectorAll('input[name="qty"]')){input.addEventListener('change',()=>{const p=document.querySelector('.ac-product-panel');p?.setAttribute('data-current-pack',input.value);});}
})();
