/* Entry is always the home hero. Selection persistence is independent of scroll. */
(()=>{'use strict';
if('scrollRestoration' in history)history.scrollRestoration='manual';
const root=document.documentElement;
const url=new URL(location.href);
if(url.hash){url.hash='';history.replaceState(history.state,'',url.href);}
let interacted=false;
const mark=()=>{interacted=true;};
['pointerdown','touchstart','wheel','keydown'].forEach(type=>addEventListener(type,mark,{passive:true,capture:true}));
function top(){
 if(interacted)return;
 const old=root.style.scrollBehavior;root.style.scrollBehavior='auto';
 window.scrollTo({top:0,left:0,behavior:'instant'});
 root.style.scrollBehavior=old;
}
top();
document.addEventListener('DOMContentLoaded',()=>{top();requestAnimationFrame(()=>{top();requestAnimationFrame(top);});},{once:true});
addEventListener('load',top,{once:true});
addEventListener('pageshow',event=>{
 if(event.persisted){interacted=false;if(location.hash)history.replaceState(history.state,'',location.pathname+location.search);}
 top();requestAnimationFrame(top);
});
window.AIAI_ENTRY_V3={mode:'homepage',version:3};
})();
