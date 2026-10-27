export const CONFIG = { duration:120, commentLife:11, holdDuration:5, fps:30, lowFps:24, width:960, lowWidth:640, pixelRatio:1.25, cameraDrift:0.055, effectIntensity:0.2, audioLevel:0.12,
 palette:{cream:0xd8d2bf,green:0x8b9585,wood:0x6d5140,shadow:0x19151e,red:0x9a454b,white:0xedf0e5}, roles:{mother:0,sister:1,guest:2,stranger:1,you:4} };
const lines = [
[1,'the light was already on'],[5,'is anybody home?'],[9,'おかえり','mother'],[14,'someone washed all five bowls'],[20,'that clock has no hands'],[25,'( ´ ▽ ` )'],
[30,'leave the small cup for mother','mother'],[34,'your sister asked for the window','sister'],[38,'a guest can become a habit','guest'],[41,'ただいま'],[43,'there is enough rice'],[45,'おかえり'],[47,'おかえり'],[49,'the room sounds less empty now'],[53,'she folds the cloth that way','mother'],[57,'please leave that chair out','sister'],
[61,'there was never a sister','stranger'],[65,'but I remember her coat','sister'],[69,'guest_004, your bowl is here','you'],[73,'someone is typing from inside'],[76,'you can be both','guest'],[79,'the wires go through the wallpaper'],[82,'a stranger knows where the spoons are','stranger'],[85,'stay until the light settles','you'],
[91,'no need to explain tonight'],[96,'I will keep yours warm','you'],[102,'the dishes can wait'],[109,'thank you for sitting with us'],[115,'leave the light as it is']
];
export const COMMENTS = lines.map(([at,text,role],id)=>({id:`a${id}`,at,text,role,seat:CONFIG.roles[role],lane:(id*3)%7,local:false}));
export const MOVEMENTS=['I. ARRIVAL','II. RECOGNITION','III. CONTRADICTION','IV. AFTER DINNER'];
