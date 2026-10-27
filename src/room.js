import * as T from 'three';
import {CONFIG} from './config.js';
export function createRoom(container){
 const p=CONFIG.palette,scene=new T.Scene();scene.background=new T.Color(p.shadow);scene.fog=new T.FogExp2(p.shadow,0.035);
 const renderer=new T.WebGLRenderer({antialias:false,powerPreference:'low-power'});renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;container.append(renderer.domElement);
 const camera=new T.PerspectiveCamera(53,4/3,0.1,35);
 const mats=new Map(),geos=new Map(),textures=[];
 function mat(color){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:0.87}));return mats.get(color)}
 const boxGeo=new T.BoxGeometry(1,1,1);geos.set('box',boxGeo);
 function box(w,h,d,x,y,z,color,parent=scene){const m=new T.Mesh(boxGeo,mat(color));m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function cylinder(r1,r2,h,x,y,z,color,parent=scene){const key=[r1,r2,h].join();if(!geos.has(key))geos.set(key,new T.CylinderGeometry(r1,r2,h,24));const m=new T.Mesh(geos.get(key),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function line(points,color=0x19151e){const g=new T.BufferGeometry().setFromPoints(points.map(a=>new T.Vector3(...a)));geos.set(Symbol(),g);const material=new T.LineBasicMaterial({color});mats.set(Symbol(),material);const l=new T.Line(g,material);scene.add(l);return l}
 // Room shell; doorway is an actual opening between separate wall sections.
 box(9,0.12,11,0,-.08,0,0x554b43);const wall=box(9,4.6,.15,0,2.2,-4.1,0x949480);wall.material=mat(0x949480).clone();wall.material.transparent=true;mats.set('wall',wall.material);
 box(.15,4.6,10,-4.5,2.2,0,0x797c6e);box(.15,4.6,10,4.5,2.2,0,0x686c61);
 for(let x=-4.4;x<4.5;x+=.42)line([[x,0,-4],[x,0,5]],0x3e3934);
 box(9,.12,.12,0,.09,-3.96,0x504c40);
 // Window, mullions, and outdoor wires.
 box(2.7,1.65,.12,-2.35,2.6,-3.96,0x423f3e);box(2.48,1.44,.13,-2.35,2.6,-3.88,0x161c23);
 box(.07,1.5,.13,-2.35,2.6,-3.78,0x707164);box(2.5,.06,.13,-2.35,2.6,-3.78,0x707164);
 for(let i=0;i<4;i++)line([[-4.4,2.9+i*.13,-3.7],[-1.8,2.7+i*.12,-3.7],[.4,2.86+i*.12,-3.7]],0x292830);
 // A dim corridor inset into the back wall.
 box(1.35,2.65,.18,2.8,1.32,-3.92,0x27231f);box(.12,2.8,.3,2.05,1.4,-3.7,0x625644);box(.12,2.8,.3,3.55,1.4,-3.7,0x625644);box(1.6,.12,.3,2.8,2.8,-3.7,0x625644);box(.35,2.5,.02,3.32,1.3,-3.8,0x89704e);
 // Veneer table, grain, and legs.
 box(3.4,.16,3.55,0,1.15,.05,p.wood);box(3.43,.045,3.58,0,1.235,.05,0x795b45);
 for(const x of [-1.4,1.4])for(const z of [-1.4,1.5])box(.14,1.15,.14,x,.55,z,0x40372d);
 for(let i=0;i<16;i++)line([[-1.68,1.261,-1.65+i*.218],[1.68,1.261,-1.65+i*.218]],0x6b503e);
 // Cup-ring and folded towel.
 const ringGeo=new T.RingGeometry(.14,.153,32);geos.set('ring',ringGeo);const ring=new T.Mesh(ringGeo,mat(0x594837));ring.rotation.x=-Math.PI/2;ring.position.set(.65,1.264,.9);scene.add(ring);
 box(.43,.045,.26,-.5,1.29,-.1,0xa5a597);box(.4,.02,.12,-.5,1.32,-.14,0xbbb7a1);
 const seatDefs=[[-.8,-1.85,0],[1.95,-.7,-Math.PI/2],[-1.95,-.4,Math.PI/2],[.8,-1.85,0],[.1,2.1,Math.PI]];
 const labels=[];
 function label(){const c=document.createElement('canvas');c.width=256;c.height=64;const texture=new T.CanvasTexture(c);textures.push(texture);const material=new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.DoubleSide});mats.set(Symbol(),material);const g=new T.PlaneGeometry(.82,.205);geos.set(Symbol(),g);const mesh=new T.Mesh(g,material);scene.add(mesh);return {mesh,c,texture,last:''}}
 const seats=seatDefs.map(([x,z,angle],i)=>{
 const chair=new T.Group();chair.position.set(x,0,z);chair.rotation.y=angle;scene.add(chair);
 box(.68,.12,.65,0,.64,0,0x514235,chair);for(const dx of [-.27,.27])for(const dz of [-.25,.25])box(.07,.62,.07,dx,.31,dz,0x40382f,chair);
 for(const dx of [-.27,.27])box(.075,.95,.075,dx,1.06,-.28,0x5b4939,chair);box(.63,.28,.08,0,1.42,-.28,0x5b4939,chair);
 const sx=x*.62,sz=z*.65;const dishes=new T.Group();dishes.position.set(sx,1.27,sz);scene.add(dishes);
 cylinder(.29,.29,.025,0,.01,0,i===1?0x677d77:0xb5b2a0,dishes);cylinder(.23,.13,.14,0,.1,0,i===4?0x8e6259:0xc1bda8,dishes);cylinder(.205,.205,.01,0,.173,0,0x4f4233,dishes);
 const cup=new T.Group();cup.position.set(.3,0,-.17);dishes.add(cup);cylinder(.09,.075,.22,0,.11,0,i%2?0x9d9d83:0x79918b,cup);cylinder(.073,.073,.01,0,.223,0,0x36382e,cup);box(.05,.1,.02,.09,.13,0,0xbbb7a1,cup);
 for(const dx of [-.023,.023]){const stick=box(.016,.018,.43,-.3+dx,.03,.02,0xbaa17c,dishes);stick.rotation.y=.15;}
 const glow=new T.Mesh(new T.CircleGeometry(.53,32),new T.MeshBasicMaterial({color:0xe8ae61,transparent:true,opacity:0,depthWrite:false}));geos.set(Symbol(),glow.geometry);mats.set(Symbol(),glow.material);glow.rotation.x=-Math.PI/2;glow.position.set(sx,1.267,sz);scene.add(glow);
 const tag=label();tag.mesh.position.set(sx,1.53,sz);labels.push(tag);
 return {chair,cup,glow,tag,x,z,angle};
 });
 // CRT on a low side cabinet, with its own emissive screen.
 box(1.25,.56,.62,-2.9,.3,-2.5,0x494337);box(.94,.67,.6,-2.9,.91,-2.5,0x333736);box(.71,.49,.03,-2.97,.94,-2.18,0x57716d);const crt=box(.64,.4,.02,-2.97,.94,-2.155,0x637c74);crt.material=new T.MeshStandardMaterial({color:0x637c74,emissive:0x8bada0,emissiveIntensity:.4});mats.set('crt',crt.material);cylinder(.025,.025,.02,-2.51,.81,-2.14,0xbbb7a1).rotation.x=Math.PI/2;
 line([[-2.8,.6,-2.7],[-3.3,.1,-2.7],[-3.6,.1,-3.8],[-3.6,1.4,-3.9]],0x1d1b20);
 box(1.8,.08,.23,0,3.65,-.35,0x444a43);const fluorescent=box(1.65,.025,.14,0,3.59,-.35,0xedf0e5);fluorescent.material=new T.MeshBasicMaterial({color:0xc5d5b5});mats.set('tube',fluorescent.material);
 for(const x of [-.65,.65])line([[x,3.7,-.35],[x,4.5,-.35]]);
 const ambient=new T.HemisphereLight(0xa3b49a,0x352737,1.1);scene.add(ambient);const key=new T.SpotLight(0xdde2b8,45,13,1.05,.75,1.2);key.position.set(0,3.5,-.2);key.target.position.set(0,.5,0);key.castShadow=true;key.shadow.mapSize.set(512,512);key.shadow.bias=-.002;scene.add(key,key.target);
 const warm=new T.PointLight(0xf5ac60,7,7,1.5);warm.position.set(2.9,2,-3);scene.add(warm);
 const trace=label();trace.mesh.rotation.x=-Math.PI/2;trace.mesh.position.set(0,1.27,.4);trace.mesh.scale.set(1.8,1.8,1.8);
 const breachLines=[];for(let i=0;i<6;i++)breachLines.push(line([[-4,1.9+i*.16,-3.6],[0,1.7+i*.15,-2.2],[4,2+i*.1,-3.6]],0xa5aaa0));
 function setText(tag,text){if(tag.last===text)return;tag.last=text;const ctx=tag.c.getContext('2d');ctx.clearRect(0,0,256,64);ctx.font='24px monospace';ctx.textAlign='center';ctx.fillStyle='#eee3c4';ctx.fillText(text,128,40);tag.texture.needsUpdate=true;}
 function resize(low){const width=Math.min(low?CONFIG.lowWidth:CONFIG.width,Math.round(container.clientWidth*Math.min(devicePixelRatio,CONFIG.pixelRatio)));renderer.setSize(width,Math.round(width*.75),false)}
 function render(t,state,presence,pointer,still){
 camera.position.set(still?0:pointer.x*.12,2.42+(still?0:pointer.y*.055),4.45);camera.lookAt(still?0:pointer.x*.055,1.35+(still?0:pointer.y*.04),-.65);
 ambient.intensity=.85+presence*.25;key.intensity=36+presence*9+(still?0:Math.sin(t*17)*.25);warm.intensity=5+state.seats.reduce((a,s)=>a+s.strength,0)*presence*.5;
 seats.forEach((s,i)=>{const v=state.seats[i],strength=v.strength*presence;s.chair.position.set(s.x*(1-.055*strength),0,s.z*(1-.055*strength));s.cup.rotation.y=strength*.8;s.glow.material.opacity=strength*.11+(i===4?state.acknowledgment*.2*presence:0);setText(s.tag,v.role?(i===4?'guest_004 / '+v.role:v.role)+(v.alternate?' / '+v.alternate:''):'');s.tag.mesh.quaternion.copy(camera.quaternion);s.tag.mesh.material.opacity=strength*.9;});
 wall.material.opacity=1-state.breach*.8*presence;breachLines.forEach(l=>l.visible=state.breach*presence>.05);setText(trace,'someone kept this place');trace.mesh.material.opacity=presence*Math.max(0,Math.min(1,(t-68)/4,(96-t)/5))*.45;
 crt.material.emissiveIntensity=.3+Math.sin(t*8)*.035;renderer.render(scene,camera);
 }
 function dispose(){geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove()}
 return {render,resize,dispose,stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,width:renderer.domElement.width,height:renderer.domElement.height})};
}
