import './style.css';
import {CONFIG,COMMENTS,MOVEMENTS} from './config.js';
import {stateAt,activeComments,advance,clamp,smooth} from './timeline.js';
import {createRoom} from './room.js';
import {createAudio} from './audio.js';
const $=id=>document.getElementById(id),comments=[...COMMENTS],holds=[],nodes=new Map(),rows=new Map();
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let time=0,playing=false,showComments=true,still=reduced.matches,low=innerWidth<760,sound=false,presence=1,transition=null,last=0,raf=0,dirty=true,room;
const pointer={x:0,y:0},audio=createAudio();
try{room=createRoom($('room'))}catch(error){$('fallback').hidden=false;console.error(error)}
const fmt=t=>`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
function toggle(button,value,on,off){$(button).textContent=value?on:off;$(button).setAttribute('aria-pressed',String(value))}
function hold(c){if(!c.role)return;holds.push({id:c.id,role:c.role,seat:c.seat,at:time});dirty=true;draw(performance.now())}
function addRow(c){const row=document.createElement(c.role?'button':'div');row.className='log-row';const stamp=document.createElement('time');stamp.textContent=fmt(c.at);const text=document.createElement('span');text.textContent=c.text;row.append(stamp,text);if(c.role){row.dataset.role=c.role;row.title=`Hold ${c.role} at this moment`;row.addEventListener('click',()=>hold(c))}rows.set(c.id,row);$('transcript').append(row)}
function updateCount(){$('count').textContent=comments.length}
comments.forEach(addRow);updateCount();
function draw(now){
 if(transition){const f=smooth((now-transition.start)/800);presence=transition.from+(transition.to-transition.from)*f;if(f===1)transition=null;}
 const state=stateAt(time,comments,holds);room?.render(time,state,presence,pointer,still);audio.update(time,state,presence,playing&&!document.hidden);
 $('time').textContent=`${fmt(time)} / 02:00`;$('seek').value=time;$('movement').textContent=MOVEMENTS[Math.min(3,Math.floor(time/30))];$('seek').setAttribute('aria-valuetext',`${fmt(time)}, ${MOVEMENTS[Math.min(3,Math.floor(time/30))]}`);
 $('interference').style.opacity=still?0:state.disturbance*CONFIG.effectIntensity;
 const active=activeComments(time,comments);const held=holds.findLast(h=>time>=h.at&&time<h.at+CONFIG.holdDuration);
 if(held){const c=comments.find(c=>c.id===held.id);if(!active.includes(c))active.push(c)}
 const ids=new Set(active.map(c=>c.id));for(const [id,node]of nodes){if(!ids.has(id)){node.remove();nodes.delete(id)}}
 for(const c of active){let node=nodes.get(c.id);if(!node){node=document.createElement(c.role?'button':'span');node.className='danmaku-line'+(c.local?' local':'');node.textContent=c.text;if(c.role){node.dataset.role=c.role;node.tabIndex=-1;node.addEventListener('click',()=>hold(c))}$('danmaku').append(node);nodes.set(c.id,node)}
 const pinned=held?.id===c.id;const width=$('screen').clientWidth;const age=time-c.at;const x=still||pinned?width*.06:width-(age/CONFIG.commentLife)*(width+node.offsetWidth);node.style.transform=`translate(${x}px, 0)`;node.style.top=`${12+c.lane*9}%`;node.style.opacity=presence;node.style.maxWidth=still?'88%':'none';node.style.whiteSpace=still?'normal':'nowrap';node.style.fontSize=pinned?'18px':'';}
 $('danmaku').style.visibility=presence<.01?'hidden':'visible';$('held').textContent=held&&showComments?`◇ holding: ${held.role}`:'';
 for(const c of comments){rows.get(c.id).classList.toggle('current',ids.has(c.id));rows.get(c.id).classList.toggle('past',time>=c.at)}
 const house=time>=46&&time<53,figure=time>=80&&time<84;$('art').textContent=house?'        ／＼        \n     ／      ＼     \n  ／            ＼  \n│                  │\n│                  │\n└──────      ──────┘':figure?'       · ·       \n      (   )      \n   ──       ──   \n  │           │  ':'';$('art').style.opacity=presence*(house?Math.sin((time-46)/7*Math.PI):figure?.35:0);
 dirty=false;
}
function frame(now){raf=0;if(document.hidden)return;const interval=1000/(low?CONFIG.lowFps:CONFIG.fps);if(now-last>=interval){const dt=last?Math.min((now-last)/1000,.15):0;last=now;if(playing){const previous=time;time=advance(time,dt);if(time<previous)holds.length=0;for(const c of comments)if(c.role&&previous<c.at&&time>=c.at)audio.tap();}if(playing||dirty||transition)draw(now)}if(playing||dirty||transition)raf=requestAnimationFrame(frame)}
function wake(){dirty=true;if(!raf&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame)}}
function seek(t){time=clamp(t,0,119.99);draw(performance.now());wake()}
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'Ⅱ Pause':'▶ Play';$('play').setAttribute('aria-label',playing?'Pause recording':'Play recording');audio.resume();draw(performance.now());wake()};
$('seek').addEventListener('input',e=>seek(Number(e.target.value)));
document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>seek(Number(b.dataset.time)));
$('comments').onclick=()=>{showComments=!showComments;transition={from:presence,to:showComments?1:0,start:performance.now()};toggle('comments',showComments,'Comments on','Comments off');wake()};
function setStill(value){still=value;pointer.x=pointer.y=0;toggle('motion',still,'Still mode on','Still mode off');document.body.classList.toggle('still',still);wake()}
$('motion').onclick=()=>setStill(!still);reduced.addEventListener('change',e=>setStill(e.matches));setStill(still);
$('quality').onclick=()=>{low=!low;toggle('quality',low,'Low power on','Low power off');room?.resize(low);wake()};toggle('quality',low,'Low power on','Low power off');
$('sound').onclick=async()=>{try{sound=!sound;await audio.enable(sound);toggle('sound',sound,'Sound on','Sound off');draw(performance.now())}catch{sound=false;$('notice').textContent='Audio could not start. Try Sound again.';toggle('sound',false,'Sound on','Sound off')}};
$('form').onsubmit=e=>{e.preventDefault();const text=$('message').value.trim();if(!text)return;const c={id:`local${comments.length}`,at:Math.round(time*100)/100,text:text.slice(0,80),local:true,lane:6};comments.push(c);addRow(c);updateCount();$('message').value='';$('notice').textContent=`Saved at ${fmt(c.at)} for this tab’s replay.`;draw(performance.now());wake()};
$('screen').addEventListener('pointermove',e=>{if(still||e.pointerType==='touch')return;const r=$('screen').getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=.5-(e.clientY-r.top)/r.height;wake()});$('screen').addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;wake()});
const observer=new ResizeObserver(()=>{room?.resize(low);wake()});observer.observe($('screen'));
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;audio.suspend()}else{last=0;audio.resume();wake()}});
addEventListener('pagehide',()=>{cancelAnimationFrame(raf);observer.disconnect();room?.dispose();audio.dispose()},{once:true});
// Read-only diagnostics for verification and performance inspection.
window.artwork={snapshot:()=>({time,playing,showComments,presence,still,low,state:stateAt(time,comments,holds),active:activeComments(time,comments).map(c=>c.text),comments:comments.length,audio:audio.status(),render:room?.stats()})};
room?.resize(low);draw(performance.now());wake();
