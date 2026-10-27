import {CONFIG} from './config.js';
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
export const wrap=t=>((t%CONFIG.duration)+CONFIG.duration)%CONFIG.duration;
export function activeComments(t,comments){return comments.filter(c=>t>=c.at&&t<c.at+CONFIG.commentLife)}
export function stateAt(t,comments,holds=[]){
 const seats=Array.from({length:5},()=>({role:'',alternate:'',strength:0,held:false}));
 for(const c of comments){if(c.role&&t>=c.at){const s=seats[c.seat];s.alternate=t-c.at<5&&s.role!==c.role?s.role:'';s.role=c.role;s.strength=smooth((t-c.at)/2);}}
 const ending=1-smooth((t-100)/19);
 for(const s of seats)s.strength*=ending;
 for(const h of holds){const age=t-h.at;if(age>=0&&age<CONFIG.holdDuration){seats[h.seat]={role:h.role,alternate:'',strength:1-0.5*smooth(age-4),held:true};}}
 const disturbance=comments.reduce((n,c)=>c.role?Math.max(n,clamp(1-Math.abs(t-c.at-0.2)/0.45)):n,0);
 const acknowledgment=comments.reduce((n,c)=>c.local?Math.max(n,Math.max(0,1-Math.abs(t-c.at-1)/2)):n,0);
 return {seats,disturbance,acknowledgment,breach:smooth((t-76)/4)*(1-smooth((t-85)/4)),ending};
}
export function advance(time,dt){return wrap(time+dt)}
