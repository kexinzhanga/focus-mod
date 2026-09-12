import{O as a,K as m,s as b,i as T,m as v,F as w,b as x}from"./shared-DVEWfojv.js";function y(e){return`
uniform vec2 size;
uniform float time;
float ring(float r, float target, float width) {
  return 1.0 - smoothstep(width, width + 0.012, abs(r-target));
}
half4 main(float2 coord) {
  vec2 p = (coord / size - 0.5) * ${e?"4.0":"3.3"};
  float r = length(p);
  float a = atan(p.y,p.x);
  float pulse = 0.86 + 0.14 * sin(time * 1.8);
  float light = ring(r,1.13,0.036) * pulse;
  light += exp(-abs(r-1.13)*18.0) * 0.35;
  float wave=fract(time*0.38);
  light+=ring(r,1.16+wave*${e?"0.68":"0.38"},0.018)*(1.0-wave)*0.65;
  ${e?`
  light+=ring(r,1.42,0.025)*0.85;
  light+=ring(r,1.68,0.021)*0.65;
  float runes = pow(max(0.0,cos(a*18.0-time*1.4)),18.0);
  light += ring(r,1.4,0.105)*runes;
  light += ring(r,1.65,0.095)*pow(max(0.0,cos(a*12.0+time*1.1)),16.0);
  float flame=0.5+0.5*sin(a*17.0+sin(a*9.0+time*1.7)*1.9+p.y*8.0+time*4.0);
  float flameTop=1.3+0.52*pow(flame,2.0)*(0.65-0.35*sin(a));
  light+=smoothstep(1.03,1.17,r)*(1.0-smoothstep(1.18,flameTop+0.03,r))*0.7;
  float jagged=1.52+0.055*sin(a*31.0+time*2.0)+0.035*sin(a*67.0-time*3.0);
  light+=ring(r,jagged,0.012)*pow(max(0.0,cos(a*3.0-time*1.6)),10.0)*1.5;
  for (int i=0;i<8;i++) {
    float phase = fract(time*0.14+float(i)*0.127);
    float x = sin(float(i)*8.73)*1.65;
    vec2 pos = vec2(x,1.1-phase*2.8);
    float spark = exp(-length(p-pos)*65.0)*sin(phase*3.14159);
    light += spark;
  }
  `:""}
  for(int i=0;i<${e?6:4};i++) {
    float angle = time*${e?"0.8":"0.6"}+float(i)*${e?"1.0472":"1.570796"};
    for(int j=0;j<6;j++) {
      float trail=float(j)*0.065;
      vec2 pos=vec2(cos(angle-trail),sin(angle-trail))*${e?"1.43":"1.15"};
      light+=exp(-length(p-pos)*38.0)*(1.0-float(j)/7.0);
    }
  }
  float alpha=clamp(light,0.0,1.0)*smoothstep(1.0,1.065,r)
    *(1.0-smoothstep(${e?"1.85,1.98":"1.51,1.64"},r));
  vec3 base=${e?"vec3(1.0,0.57,0.06)":"vec3(0.08,0.57,1.0)"};
  vec3 color=mix(base,${e?"vec3(1.0,0.94,0.65)":"vec3(0.7,0.96,1.0)"},smoothstep(0.6,1.8,light));
  return half4(color*alpha,alpha);
}`}let d=!1,p=!1;async function A(){if(p=!0,!d){d=!0;try{for(;p&&(p=!1,!!await a.scene.isReady());){const e=(await a.scene.items.getItems()).filter(t=>T(t)&&v(t)!=="off"),c=(await a.scene.local.getItems()).filter(t=>t.metadata[w]===!0),l=new Map(e.map(t=>[t.id,t])),u=c.filter(t=>!t.attachedTo||!l.has(t.attachedTo));u.length&&await a.scene.local.deleteItems(u.map(t=>t.id));for(const t of e){const o=v(t),f=await a.scene.items.getItemBounds([t.id]),s=Math.max(f.width,f.height,1)*(o==="strong"?2:1.65),h={x:f.center.x-s/2,y:f.center.y-s/2},i=c.find(n=>n.attachedTo===t.id);if(i)(i.metadata[m]!==o||i.visible!==t.visible||i.metadata.revision!==2||i.position.x!==h.x||i.position.y!==h.y||i.width!==s)&&await a.scene.local.updateItems([i.id],n=>{for(const r of n)r.visible=t.visible,r.metadata[m]=o,r.metadata.revision=2,r.type==="EFFECT"&&Object.assign(r,{sksl:y(o==="strong"),effectType:"STANDALONE",width:s,height:s,position:h,rotation:0,scale:{x:1,y:1},disableAttachmentBehavior:["SCALE","ROTATION"]})});else{const n=x().name(o==="strong"?"强专注":"弱专注").effectType("STANDALONE").attachedTo(t.id).width(s).height(s).position(h).disableAttachmentBehavior(["SCALE","ROTATION"]).sksl(y(o==="strong")).layer("ATTACHMENT").locked(!0).disableHit(!0).visible(t.visible).metadata({[w]:!0,[m]:o,revision:2}).build();await a.scene.local.addItems([n])}}}}finally{d=!1}}}function g(){A().catch(e=>console.error("Focus Aura:",e))}a.onReady(async()=>{a.scene.items.onChange(g),a.scene.onReadyChange(g);for(const e of["weak","strong","off"])await a.contextMenu.create({id:`${m}/${e}`,icons:[{icon:"https://kexinzhanga.github.io/focus-mod/icon.svg",label:e==="weak"?"弱专注":e==="strong"?"强专注":"关闭专注",filter:{every:[{key:"type",value:"IMAGE"},{key:"layer",value:"CHARACTER"}]}}],onClick:async c=>{try{await b(c.items.map(l=>l.id),e)}catch(l){await a.notification.show(l instanceof Error?l.message:"操作失败，请检查角色权限。","ERROR")}}});g()});
