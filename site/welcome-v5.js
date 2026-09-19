(() => {
'use strict';
const dialog=document.getElementById('aiai-welcome-offer');
if(!dialog)return;
const cards=[...dialog.querySelectorAll('[data-scratch-card]')];
const game=dialog.querySelector('[data-offer-game]');
const result=dialog.querySelector('[data-offer-result]');
const progress=dialog.querySelector('[data-scratch-progress]');
const mode=new URL(location.href).searchParams.get('offer');
let count=0,won=false,previousFocus=null,autoTimer;
const seenKey='aiai-offer-v5-seen';
function reward(){
 won=true;game.hidden=true;result.hidden=false;
 dialog.setAttribute('aria-labelledby','v5-result-title');
 dialog.setAttribute('aria-describedby','v5-result-description');
 if(dialog.open)document.getElementById('v5-result-title').focus({preventScroll:true});
}
function reveal(card){
 if(card.classList.contains('is-revealed')||won)return;
 card.classList.add('is-revealed');
 card.setAttribute('aria-label','已刮開 85 折');
 card.setAttribute('aria-pressed','true');
 count++;progress.textContent=`已刮開 ${Math.min(count,3)} / 3 張`;
 if(count>=3){progress.textContent='3 張相同優惠 已解鎖 85 折';setTimeout(reward,600);}
}
function draw(card){
 const canvas=card.querySelector('canvas'),ctx=canvas.getContext('2d');
 if(!ctx)return;
 const w=card.clientWidth,h=card.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
 canvas.width=w*dpr;canvas.height=h*dpr;
 ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#8c304c';ctx.font=`900 ${Math.min(38,w*.49)}px Arial`;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',w/2,h/2+2);
}
cards.forEach(card=>{
 const canvas=card.querySelector('canvas'),ctx=canvas.getContext('2d');
 let active=false,previous=null,distance=0;
 card.setAttribute('aria-pressed','false');
 const position=e=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
 function erase(a,b){
  if(!ctx)return;
  ctx.globalCompositeOperation='destination-out';
  ctx.lineWidth=Math.max(26,card.clientWidth*.44);ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
 }
 card.addEventListener('pointerdown',e=>{
  if(card.classList.contains('is-revealed')||won||e.button>0)return;
  active=true;distance=0;previous=position(e);
  card.setPointerCapture(e.pointerId);erase(previous,{x:previous.x+.1,y:previous.y});
 });
 card.addEventListener('pointermove',e=>{
  if(!active||card.classList.contains('is-revealed'))return;
  const next=position(e);distance+=Math.hypot(next.x-previous.x,next.y-previous.y);erase(previous,next);previous=next;
  if(distance>card.clientHeight*.95)reveal(card);
 });
 card.addEventListener('pointerup',e=>{
  if(!active)return;active=false;
  if(card.hasPointerCapture(e.pointerId))card.releasePointerCapture(e.pointerId);
  if(distance<8)reveal(card);
 });
 card.addEventListener('pointercancel',()=>{active=false;});
 card.addEventListener('click',e=>{if(e.detail===0)reveal(card);});
});
function open(e){
 clearTimeout(autoTimer);if(dialog.open)return;
 previousFocus=e?.currentTarget||document.activeElement;
 document.documentElement.classList.add('v5-dialog-open');
 dialog.showModal();
 try{sessionStorage.setItem(seenKey,'1');}catch(_){}
 requestAnimationFrame(()=>{
  cards.filter(c=>!c.classList.contains('is-revealed')).forEach(draw);
  document.getElementById(won?'v5-result-title':'v5-offer-title').focus({preventScroll:true});
 });
}
function close(){clearTimeout(autoTimer);if(dialog.open)dialog.close();}
dialog.querySelector('[data-welcome-close]').addEventListener('click',close);
dialog.addEventListener('close',()=>{
 document.documentElement.classList.remove('v5-dialog-open');
 previousFocus?.focus?.({preventScroll:true});
});
dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
document.querySelectorAll('[data-welcome-open]').forEach(b=>b.addEventListener('click',open));
let resizeTimer;
addEventListener('resize',()=>{
 clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(dialog.open&&!won)cards.filter(c=>!c.classList.contains('is-revealed')).forEach(draw);},120);
});
let seen=false;try{seen=sessionStorage.getItem(seenKey)==='1';}catch(_){}
if(mode!=='off'&&(!seen||mode==='play'))autoTimer=setTimeout(()=>open(null),800);
})();
