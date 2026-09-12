import{O as t,K as r,s as v,i as w,m as p,F as g,b as y}from"./shared-DVEWfojv.js";function u(a){return`
uniform vec2 size;
uniform float time;
float ring(float r, float target, float width) {
  return 1.0 - smoothstep(width, width + 0.012, abs(r-target));
}
half4 main(float2 coord) {
  vec2 p = (coord / size - 0.5) * 2.0;
  float r = length(p);
  float a = atan(p.y,p.x);
  float pulse = 0.72 + 0.22 * sin(time * 1.8);
  float light = ring(r,0.89,0.012) * pulse;
  light += exp(-abs(r-0.89)*65.0) * 0.16;
  ${a?`
  float runes = pow(max(0.0,cos(a*16.0-time*0.9)),12.0);
  light += ring(r,0.77,0.022) * (0.2+0.65*runes);
  light += ring(r,0.91,0.035) * pow(max(0.0,cos(a*12.0+time*0.75)),18.0)*0.6;
  for (int i=0;i<8;i++) {
    float phase = fract(time*0.14+float(i)*0.127);
    float x = sin(float(i)*8.73)*0.8;
    vec2 pos = vec2(x,0.65-phase*1.45);
    float spark = exp(-length(p-pos)*150.0)*sin(phase*3.14159);
    light += spark * smoothstep(0.55,0.74,r);
  }
  `:""}
  for(int i=0;i<${a?6:3};i++) {
    float angle = time*${a?"0.65":"0.35"}+float(i)*${a?"1.0472":"2.0944"};
    vec2 pos = vec2(cos(angle),sin(angle))*0.89;
    light += exp(-length(p-pos)*95.0)*0.8;
  }
  float alpha = clamp(light,0.0,0.95)*(1.0-smoothstep(0.97,1.0,r));
  vec3 color = ${a?"vec3(1.0,0.72,0.22)":"vec3(0.28,0.76,1.0)"};
  return half4(color*alpha,alpha);
}`}let f=!1,d=!1;async function b(){if(d=!0,!f){f=!0;try{for(;d&&(d=!1,!!await t.scene.isReady());){const a=(await t.scene.items.getItems()).filter(e=>w(e)&&p(e)!=="off"),l=(await t.scene.local.getItems()).filter(e=>e.metadata[g]===!0),i=new Map(a.map(e=>[e.id,e])),h=l.filter(e=>!e.attachedTo||!i.has(e.attachedTo));h.length&&await t.scene.local.deleteItems(h.map(e=>e.id));for(const e of a){const o=p(e),n=l.find(s=>s.attachedTo===e.id);if(n)(n.metadata[r]!==o||n.visible!==e.visible)&&await t.scene.local.updateItems([n.id],s=>{for(const c of s)c.visible=e.visible,c.metadata[r]=o,c.type==="EFFECT"&&Object.assign(c,{sksl:u(o==="strong")})});else{const s=y().name(o==="strong"?"强专注":"弱专注").effectType("ATTACHMENT").attachedTo(e.id).sksl(u(o==="strong")).layer("ATTACHMENT").locked(!0).disableHit(!0).visible(e.visible).metadata({[g]:!0,[r]:o}).build();await t.scene.local.addItems([s])}}}}finally{f=!1}}}function m(){b().catch(a=>console.error("Focus Aura:",a))}t.onReady(async()=>{t.scene.items.onChange(m),t.scene.onReadyChange(m);for(const a of["weak","strong","off"])await t.contextMenu.create({id:`${r}/${a}`,icons:[{icon:"/icon.svg",label:a==="weak"?"弱专注":a==="strong"?"强专注":"关闭专注",filter:{every:[{key:"type",value:"IMAGE"},{key:"layer",value:"CHARACTER"}]}}],onClick:async l=>{try{await v(l.items.map(i=>i.id),a)}catch(i){await t.notification.show(i instanceof Error?i.message:"操作失败，请检查角色权限。","ERROR")}}});m()});
