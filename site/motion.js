/* AIAI V4: native scroll, no scroll interception, no pinned multi-screen slideshow.
   The supplied reference exposes word masks followed by back/candy/front layers.
   This independent implementation uses that layering; its external GSAP timing
   source was not available, so these timings are not represented as a 1:1 copy. */
(()=>{
 'use strict';
 const root=document.querySelector('[data-scroll-story]');
 if(!root) return;
 const lines=[...root.querySelectorAll('.story-line span')];
 const stage=root.querySelector('.story-packet-stage');
 const seal=root.querySelector('.story-packet__seal');
 const gummy=root.querySelector('.story-packet__gummy');
 const back=root.querySelector('.story-packet__back');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(x)=>Math.max(0,Math.min(1,x));
 const smooth=(x)=>x*x*(3-2*x);
 let geometry=null,scheduled=false,inRange=true,oldWidth=innerWidth;
 // Measurements occur on layout changes only, never interleaved with scroll writes.
 const measure=()=>{
   const y=scrollY;
   geometry={vh:innerHeight,
     rows:lines.map(el=>el.parentElement.getBoundingClientRect().top+y),
     packet:stage.getBoundingClientRect().top+y,
     packetWidth:stage.clientWidth,
     top:root.getBoundingClientRect().top+y,
     height:root.offsetHeight};
   request();
 };
 const render=()=>{
   scheduled=false;
   if(!geometry) return;
   if(reduced.matches){
     root.classList.remove('is-motion-ready');
     lines.forEach(el=>el.style.transform='none');
     seal.style.transform='none';seal.style.opacity='1';
     gummy.style.transform='none';back.style.opacity='0';
     return;
   }
   const y=scrollY, h=geometry.vh;
   // All rows use the same viewport trigger, naturally yielding a stagger as the page moves.
   lines.forEach((el,i)=>{
     const trigger=innerWidth<=820?.5:.15;
     const p=clamp((y+h*(trigger+.32)-geometry.rows[i])/(h*.32));
     el.style.transform=`translate3d(0,${((1-smooth(p))*115).toFixed(3)}%,0)`;
   });
   // The pouch is BELOW the words. It never enters the title's layout box.
   const p=smooth(clamp((y+h*.76-geometry.packet)/(h*.32)));
   const w=geometry.packetWidth;
   seal.style.transform=`translate3d(${(p*w*.035).toFixed(2)}px,${(-p*w*.23).toFixed(2)}px,0) rotate(${(-8*p).toFixed(2)}deg)`;
   seal.style.opacity=String(1-.75*p);
   gummy.style.transform=`translate3d(0,${(-p*w*.46).toFixed(2)}px,0) rotate(${(p*7).toFixed(2)}deg)`;
   back.style.opacity=String(p);
   root.classList.add('is-motion-ready');
 };
 function request(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
 addEventListener('scroll',()=>{if(inRange) request();},{passive:true});
 addEventListener('resize',()=>{
   // Ignore mobile URL-bar height-only resizes: they used to reset the scroll scene.
   if(Math.abs(innerWidth-oldWidth)>1){oldWidth=innerWidth;measure();}
 },{passive:true});
 addEventListener('orientationchange',()=>setTimeout(measure,180));
 addEventListener('load',measure,{once:true});
 if('ResizeObserver' in window){
   const observer=new ResizeObserver(measure);
   observer.observe(document.querySelector('#main')||document.body);
   observer.observe(root);
 }
 if('IntersectionObserver' in window){
   new IntersectionObserver(entries=>{inRange=entries[0].isIntersecting;if(inRange)request();}, {rootMargin:'100% 0px'}).observe(root);
 }
 reduced.addEventListener?.('change',measure);
 document.fonts?.ready.then(measure);
 measure();
})();
