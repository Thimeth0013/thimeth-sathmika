import{r as V,j as Ee}from"./Footer-Cl7WYcfe.js";const _=96,ye=.18,Tt=1024,$e=96,se=260,Rt={gloss:0,matte:1,holo:2};let je=1;const wt=`#version 300 es
in vec2 aGrid;
uniform vec2 uCanvas;
uniform vec2 uMesh;
uniform vec2 uCenter;
uniform vec2 uDir;
uniform float uFold;
uniform float uRadius;
uniform float uAngle;
uniform float uScale;
uniform float uLift;
uniform int uPass;
uniform vec2 uShadowOffset;
uniform vec2 uShadowSlope;
out vec2 vUv;
out float vFold;
out vec3 vNormal;
out vec3 vPos;
out float vHeight;
out float vCurl;
const float PI = 3.14159265;

void main() {
  vec2 local = (aGrid - 0.5) * uMesh;
  float s = dot(local, uDir);
  float d = uFold - s;
  vec3 normal = vec3(0.0, 0.0, 1.0);
  float z = 0.0;
  vec2 p = local;
  if (d > 0.0) {
    float theta = d / uRadius;
    float along = uFold + d - PI * uRadius;
    z = 2.0 * uRadius;
    normal = vec3(0.0, 0.0, -1.0);
    if (theta < PI) {
      along = uFold - uRadius * sin(theta);
      z = uRadius * (1.0 - cos(theta));
      normal = vec3(uDir * sin(theta), cos(theta));
    }
    p += (along - s) * uDir;
  }
  float c = cos(uAngle);
  float sn = sin(uAngle);
  vec2 turned = vec2(c * p.x - sn * p.y, sn * p.x + c * p.y) * uScale;
  vNormal = vec3(c * normal.x - sn * normal.y, sn * normal.x + c * normal.y, normal.z);
  vUv = aGrid;
  vFold = d;
  vCurl = z * uScale;
  float height = z * uScale + uLift;
  vec2 screen = uCenter + turned;
  float depth = 0.0;
  if (uPass == 0 || uPass == 2) {
    vHeight = uPass == 0 ? height : z * uScale;
    screen += uShadowOffset + uShadowSlope * vHeight;
  } else {
    vHeight = height;
    depth = clamp(-height / 1000.0, -1.0, 1.0);
  }
  vPos = vec3(uCenter + turned, height);
  gl_Position = vec4(screen.x / uCanvas.x * 2.0 - 1.0, 1.0 - screen.y / uCanvas.y * 2.0, depth, 1.0);
}`,Mt=`#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uImage;
uniform int uPass;
uniform int uFinish;
uniform vec3 uBack;
uniform vec3 uLight;
uniform float uShine;
uniform float uShadow;
uniform float uTexel;
uniform float uLod;
uniform float uRadius;
uniform vec2 uGlint;
in vec2 vUv;
in float vFold;
in vec3 vNormal;
in vec3 vPos;
in float vHeight;
in float vCurl;
out vec4 outColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

vec3 spectrum(float t) {
  t = fract(t) * 6.0;
  vec3 a = vec3(1.0, 0.478, 0.46);
  vec3 b = vec3(1.0, 0.928, 0.38);
  vec3 c = vec3(0.659, 1.0, 0.38);
  vec3 d = vec3(0.52, 1.0, 0.968);
  vec3 e = vec3(0.48, 0.584, 1.0);
  vec3 f = vec3(0.68, 0.52, 1.0);
  if (t < 1.0) return mix(a, b, t);
  if (t < 2.0) return mix(b, c, t - 1.0);
  if (t < 3.0) return mix(c, d, t - 2.0);
  if (t < 4.0) return mix(d, e, t - 3.0);
  if (t < 5.0) return mix(e, f, t - 4.0);
  return mix(f, a, t - 5.0);
}

float bars(float t) {
  t = fract(t) * 12.0;
  if (t < 3.8) return mix(0.08, 0.6, t / 3.8);
  if (t < 4.5) return mix(0.6, 0.72, (t - 3.8) / 0.7);
  if (t < 5.2) return mix(0.72, 0.6, (t - 4.5) / 0.7);
  if (t < 10.0) return mix(0.6, 0.08, (t - 5.2) / 4.8);
  return 0.08;
}

void main() {
  if (uPass == 0) {
    float alpha;
    if (vFold > 0.0) {
      alpha = textureLod(uImage, vUv, log2(max(1.5 * uTexel, 1.0))).a * (1.0 - smoothstep(0.0, uRadius, vCurl));
    } else {
      alpha = textureLod(uImage, vUv, log2(max((1.2 + vHeight * 0.55) * uTexel, 1.0))).a;
    }
    outColor = vec4(0.0, 0.0, 0.0, alpha * uShadow / (1.0 + vHeight * 0.03));
    return;
  }
  if (uPass == 2) {
    if (vFold <= 0.0) discard;
    float alpha = textureLod(uImage, vUv, log2(max(uTexel, 1.0))).a * smoothstep(0.0, uRadius, vCurl);
    outColor = vec4(alpha);
    return;
  }
  if (uPass == 1 && vFold > 0.0) discard;
  if (uPass == 3 && vFold <= 0.0) discard;
  vec4 art = textureLod(uImage, vUv, uLod);
  if (art.a < 0.004) discard;
  bool front = vNormal.z >= 0.0;
  vec3 n = normalize(front ? vNormal : -vNormal);
  vec3 toLight = normalize(uLight - vPos);
  vec3 halfway = normalize(toLight + vec3(0.0, 0.0, 1.0));
  float diffuse = max(dot(n, toLight), 0.0);
  float nh = max(dot(n, halfway), 0.0);
  vec3 key = normalize(vec3(-0.45, -0.6, 0.66));
  float shade = clamp(0.5 + 0.25 * dot(n, key) / key.z + 0.25 * n.z, 0.5, front ? 1.0 : 1.08);
  if (uPass == 1) shade = 1.0;
  vec3 color;
  if (!front) {
    float grain = hash(floor(vUv * 700.0)) * 0.06 - 0.03;
    color = uBack * (0.7 + 0.3 * diffuse + grain) * art.a + vec3(pow(nh, 24.0) * 0.2 * uShine) * art.a;
  } else if (uFinish == 1) {
    color = art.rgb * (0.8 + 0.22 * diffuse) + vec3(pow(nh, 8.0) * 0.08 * uShine) * art.a;
  } else if (uFinish == 2) {
    vec3 albedo = art.rgb / art.a;
    float lum = dot(albedo, vec3(0.299, 0.587, 0.114));
    float foil = smoothstep(0.5, 0.92, lum);
    vec2 q = vUv - uGlint;
    float near = exp(-dot(q, q) * 3.0);
    float tilt = dot(n.xy, vec2(0.6, 0.8)) * 1.6;
    vec3 rainbow = spectrum((vUv.x + vUv.y) * 0.85 - (uGlint.x + uGlint.y) * 1.2 + tilt);
    float streak = bars((vUv.x - vUv.y) * 2.6 + uGlint.x * 1.8 - uGlint.y * 0.6 + tilt * 0.5);
    float band = smoothstep(0.32, 0.7, streak);
    vec3 silver = vec3(0.8, 0.82, 0.86) * (0.88 + 0.16 * diffuse);
    vec3 film = mix(silver, rainbow * 1.08, clamp(band * (0.55 + 0.45 * near) + 0.18 * near, 0.0, 1.0));
    vec3 ink = albedo * (0.86 + 0.14 * diffuse) + rainbow * band * 0.22 * (0.4 + 0.6 * near);
    vec3 base = mix(albedo * (0.86 + 0.14 * diffuse), mix(ink, film, foil), uShine * 0.6 + 0.4);
    vec2 cell = floor(vUv * 180.0);
    vec2 jitter = vec2(hash(cell), hash(cell + 7.3)) * 0.6 + 0.2;
    float dist = length(fract(vUv * 180.0) - jitter);
    vec3 facet = normalize(vec3(vec2(hash(cell + 2.1), hash(cell + 5.7)) * 2.0 - 1.0, 1.6));
    float glint = pow(max(dot(facet, halfway), 0.0), 60.0) * smoothstep(0.32, 0.05, dist) * step(0.55, hash(cell + 3.1)) * (0.15 + 0.85 * foil);
    color = (base + spectrum(hash(cell) + uGlint.x) * glint * 1.6 * uShine + vec3(pow(nh, 140.0) * 0.4 * uShine)) * art.a;
  } else {
    color = art.rgb * (0.86 + 0.16 * diffuse) + vec3(pow(nh, 220.0) * 0.4 + pow(nh, 24.0) * 0.03) * uShine * art.a;
  }
  float bend = uPass == 3 ? smoothstep(0.0, uRadius * 0.6, vCurl) : 0.0;
  float glare = pow(max(dot(n, normalize(key + vec3(0.0, 0.0, 1.0))), 0.0), 28.0) * bend * (0.18 + 0.3 * uShine);
  outColor = vec4(min(color * shade + vec3(glare) * art.a, vec3(art.a)), art.a);
}`,bt=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,St=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uStep;
uniform float uSigma;
uniform float uStrength;
uniform int uMode;
in vec2 vUv;
out vec4 outColor;

void main() {
  if (uMode == 1) {
    outColor = vec4(0.0, 0.0, 0.0, texture(uSource, vUv).a * uStrength);
    return;
  }
  vec4 sum = vec4(0.0);
  float total = 0.0;
  for (int i = -8; i <= 8; i++) {
    float offset = float(i);
    float weight = exp(-0.5 * offset * offset / (uSigma * uSigma));
    sum += texture(uSource, vUv + uStep * offset) * weight;
    total += weight;
  }
  outColor = sum / total;
}`,P=(c,T,L)=>Math.min(L,Math.max(T,c)),Ke=c=>Math.atan2(Math.sin(c),Math.cos(c)),Ze=c=>c*Math.PI/180,Te=(c,T,L,p,w,f)=>{const R=2*Math.PI*p,G=`${T}V`;c[G]+=(R*R*(L-c[T])-2*w*R*c[G])*f,c[T]+=c[G]*f},Je=(c,T,L)=>{const p=c.createShader(T);return p?(c.shaderSource(p,L),c.compileShader(p),c.getShaderParameter(p,c.COMPILE_STATUS)?p:(c.deleteShader(p),null)):null},Qe=(c,T,L)=>{const p=Je(c,c.VERTEX_SHADER,T),w=Je(c,c.FRAGMENT_SHADER,L),f=c.createProgram();if(!p||!w||!f)return null;if(c.attachShader(f,p),c.attachShader(f,w),c.bindAttribLocation(f,0,"aGrid"),c.linkProgram(f),c.deleteShader(p),c.deleteShader(w),!c.getProgramParameter(f,c.LINK_STATUS))return c.deleteProgram(f),null;const R={},G=c.getProgramParameter(f,c.ACTIVE_UNIFORMS);for(let $=0;$<G;$++){const j=c.getActiveUniform(f,$);j&&(R[j.name]=c.getUniformLocation(f,j.name))}return{program:f,uniforms:R}},At=c=>{const T=[...c].sort((f,R)=>f[0]-R[0]||f[1]-R[1]);if(T.length<3)return T;const L=(f,R,G)=>(R[0]-f[0])*(G[1]-f[1])-(R[1]-f[1])*(G[0]-f[0]),p=[];T.forEach(f=>{for(;p.length>=2&&L(p[p.length-2],p[p.length-1],f)<=0;)p.pop();p.push(f)});const w=[];for(let f=T.length-1;f>=0;f--){const R=T[f];for(;w.length>=2&&L(w[w.length-2],w[w.length-1],R)<=0;)w.pop();w.push(R)}return p.slice(0,-1).concat(w.slice(0,-1))},Pt=({imageSrc:c,width:T=200,rotate:L=0,peelDirection:p=0,peelBackHoverPct:w=25,peelBackActivePct:f=40,curlRadius:R=12,finish:G="gloss",backColor:$="#d4d4d8",lightingIntensity:j=.5,shadowIntensity:et=.6,followPointer:tt=!0,draggable:nt=!0,swing:rt=1,friction:ot=.5,bounce:it=.35,intro:at=!0,hold:Re=!1,initialPosition:st="center",onDragStart:ct,onDragEnd:lt,dpr:ut,className:we="",style:ft,...ht})=>{const Me=V.useRef(null),be=V.useRef(null),Se=V.useRef(null),K=V.useRef(null),Ae={imageSrc:c,width:Math.max(16,T),rotate:Ze(L),peelDirection:Ze(p),hoverPeel:P(w,0,100)/100,activePeel:P(f,0,100)/100,curlRadius:Math.max(2,R),finish:Rt[G]??0,backColor:$,lighting:P(j,0,1),shadow:P(et,0,1),followPointer:tt,draggable:nt,swing:P(rt,0,3),friction:P(ot,0,1),bounce:P(it,0,1),intro:at,hold:Re,initialPosition:st,onDragStart:ct,onDragEnd:lt,dpr:ut},E=V.useRef(Ae);return E.current=Ae,V.useEffect(()=>{var qe;const N=Me.current,U=be.current,d=Se.current,B=N==null?void 0:N.parentElement,e=U==null?void 0:U.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!0,depth:!0,stencil:!1});if(!N||!U||!d||!B||!e)return;const O=Qe(e,wt,Mt),Z=Qe(e,bt,St);if(!O||!Z)return;const m=O.uniforms,H=Z.uniforms,ee=[0,1].map(()=>{const r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const n=e.createFramebuffer();return{texture:r,buffer:n,width:0,height:0}}),dt=()=>{const r=Math.max(1,Math.round(I.size/2)),n=r;ee.forEach(o=>{o.width===r&&o.height===n||(o.width=r,o.height=n,e.bindTexture(e.TEXTURE_2D,o.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,r,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindFramebuffer(e.FRAMEBUFFER,o.buffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o.texture,0))}),e.bindFramebuffer(e.FRAMEBUFFER,null)},ce=new Float32Array((_+1)*(_+1)*2);for(let r=0;r<=_;r++)for(let n=0;n<=_;n++){const o=(r*(_+1)+n)*2;ce[o]=n/_,ce[o+1]=r/_}const _e=new Uint16Array(_*_*6);let Pe=0;for(let r=0;r<_;r++)for(let n=0;n<_;n++){const o=r*(_+1)+n,i=o+1,a=o+_+1,s=a+1;_e.set([o,i,s,o,s,a],Pe),Pe+=6}const le=e.createVertexArray();e.bindVertexArray(le);const Ue=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,Ue),e.bufferData(e.ARRAY_BUFFER,ce,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const Fe=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,Fe),e.bufferData(e.ELEMENT_ARRAY_BUFFER,_e,e.STATIC_DRAW);const ue=e.createTexture(),C=document.createElement("canvas"),W=C.getContext("2d",{willReadFrequently:!0}),q=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),Le=new Map,mt=r=>{const n=String(r),o=Le.get(n);if(o)return o;let i=[.83,.83,.85];if(q){q.clearRect(0,0,1,1),q.fillStyle="#d4d4d8",q.fillStyle=n,q.fillRect(0,0,1,1);const[a,s,g]=q.getImageData(0,0,1,1).data;i=[a/255,s/255,g/255]}return Le.set(n,i),i},Ie=((qe=window.matchMedia)==null?void 0:qe.call(window,"(prefers-reduced-motion: reduce)").matches)??!1,l={ready:!1,aspect:1,meshX:1,meshY:1,texel:1,mask:null,maskW:1,maskH:1,hull:[]},I={ratio:1,size:1,density:0},D={width:1,height:1},t={x:0,y:0,vx:0,vy:0,placed:!1,swing:0,swingV:0,peel:0,peelV:0,lift:0,liftV:0,dir:E.current.peelDirection,hover:!1,local:{x:0,y:0},press:null,pivotV:{x:0,y:0},light:{x:0,y:0,z:se},pointer:{x:0,y:0,inside:!1},intro:E.current.intro&&!Ie?0:1};t.intro<1&&(t.lift=1.5,t.peel=.3,t.swing=.1,t.dir+=.6);let J=0,k=0,te=!0,fe=null,De=!0;const Y=()=>E.current.width*l.aspect,vt=(r,n)=>{const i=E.current.width,a=Y();if(!l.hull.length){const y=(Math.abs(r)*i+Math.abs(n)*a)/2;return[-y,y]}let s=1/0,g=-1/0;return l.hull.forEach(([y,M])=>{const u=y*i*r+M*a*n;u<s&&(s=u),u>g&&(g=u)}),[s,g]},Ne=r=>{if(fe=r,l.ready=!1,!r)return;const n=new Image;n.crossOrigin="anonymous",n.decoding="async",n.onload=()=>{if(!De||fe!==r||!W)return;const o=n.naturalWidth||1,i=n.naturalHeight||1,a=Math.min(1,Tt/(Math.max(o,i)*(1+2*ye))),s=Math.max(1,Math.round(o*a)),g=Math.max(1,Math.round(i*a)),y=Math.round(s*ye),M=Math.round(g*ye);C.width=s+y*2,C.height=g+M*2,W.clearRect(0,0,C.width,C.height),W.drawImage(n,y,M,s,g),e.bindTexture(e.TEXTURE_2D,ue),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,C),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),l.aspect=i/o,l.meshX=C.width/s,l.meshY=C.height/g,l.texel=C.width;const u=Math.max(8,Math.round($e*Math.min(1,o/i))),x=Math.max(8,Math.round($e*Math.min(1,i/o)));C.width=u,C.height=x,W.clearRect(0,0,u,x),W.drawImage(n,0,0,u,x);const Q=W.getImageData(0,0,u,x).data,A=new Uint8Array(u*x).fill(255),X=[],b=(h,v)=>{const S=v*u+h;A[S]===0||Q[S*4+3]>100||(A[S]=0,X.push(S))};for(let h=0;h<u;h++)b(h,0),b(h,x-1);for(let h=0;h<x;h++)b(0,h),b(u-1,h);for(;X.length;){const h=X.pop(),v=h%u,S=(h-v)/u;v>0&&b(v-1,S),v<u-1&&b(v+1,S),S>0&&b(v,S-1),S<x-1&&b(v,S+1)}const z=[];for(let h=0;h<x;h++)for(let v=0;v<u;v++)Q[(h*u+v)*4+3]>127&&z.push([(v+.5)/u-.5,(h+.5)/x-.5]);l.mask=A,l.maskW=u,l.maskH=x,l.hull=At(z),l.ready=!0,ne(),F()},n.src=r};let he=!1;const pt=()=>{const r=E.current;I.ratio=Math.min(r.dpr||window.devicePixelRatio||1,2),D.width=Math.max(1,B.clientWidth),D.height=Math.max(1,B.clientHeight);const n=Y(),o=Math.ceil(Math.hypot(r.width,n)*1.16+2*(36+r.curlRadius));if((o!==I.size||I.ratio!==I.density)&&(I.size=o,I.density=I.ratio,N.style.width=`${o}px`,N.style.height=`${o}px`,U.width=Math.round(o*I.ratio),U.height=Math.round(o*I.ratio)),d.style.width=`${r.width}px`,d.style.height=`${n}px`,!t.placed){const i=r.initialPosition,a=i&&typeof i=="object"?i:{x:0,y:0};t.x=D.width/2+(a.x||0),t.y=D.height/2+(a.y||0),t.light={x:t.x-r.width*.45,y:t.y-n*.9,z:se*1.6},t.placed=!0}de()},ne=()=>{he=!0,F()},xt=()=>{const r=E.current,n=r.rotate+t.swing,o=1+.07*Math.max(0,t.lift),i=r.width/2*o,a=Y()/2*o,s=Math.abs(Math.cos(n)),g=Math.abs(Math.sin(n));return{x:i*s+a*g,y:i*g+a*s}},de=()=>{const r=E.current,n=xt(),o=Math.min(n.x,D.width/2),i=Math.max(D.width-n.x,D.width/2),a=Math.min(n.y,D.height/2),s=Math.max(D.height-n.y,D.height/2);t.x<o?(t.x=o,t.vx<0&&(t.vx=-t.vx*r.bounce)):t.x>i&&(t.x=i,t.vx>0&&(t.vx=-t.vx*r.bounce)),t.y<a?(t.y=a,t.vy<0&&(t.vy=-t.vy*r.bounce)):t.y>s&&(t.y=s,t.vy>0&&(t.vy=-t.vy*r.bounce))},re=r=>{const n=B.getBoundingClientRect();return{x:r.clientX-n.left-B.clientLeft,y:r.clientY-n.top-B.clientTop}},me=r=>{const o=-(E.current.rotate+t.swing),i=1+.07*Math.max(0,t.lift),a=r.x-t.x,s=r.y-t.y;return{x:(Math.cos(o)*a-Math.sin(o)*s)/i,y:(Math.sin(o)*a+Math.cos(o)*s)/i}},gt=r=>{if(!l.mask)return!1;const n=E.current,o=Math.floor((r.x/n.width+.5)*l.maskW),i=Math.floor((r.y/Y()+.5)*l.maskH);return o<0||i<0||o>=l.maskW||i>=l.maskH?!1:l.mask[i*l.maskW+o]>100},Ce=()=>{const r=E.current,n=I.size;N.style.transform=`translate3d(${t.x-n/2}px, ${t.y-n/2}px, 0)`;const o=r.rotate+t.swing,i=1+.07*Math.max(0,t.lift);if(d.style.transform=`translate(-50%, -50%) rotate(${o}rad) scale(${i})`,e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,U.width,U.height),e.clearColor(0,0,0,0),e.clearDepth(1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),!l.ready)return;const a=r.width,s=Y(),g=-Math.sin(t.dir),y=Math.cos(t.dir),[M,u]=vt(g,y),x=P(t.peel,0,1),Q=M+x*(u-M),A=Math.max(0,t.lift),X=n/2,b=_*_*6,z=x>.001;e.useProgram(O.program),e.bindVertexArray(le),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,ue),e.uniform1i(m.uImage,0),e.uniform2f(m.uCanvas,n,n),e.uniform2f(m.uMesh,a*l.meshX,s*l.meshY),e.uniform2f(m.uCenter,X,X),e.uniform2f(m.uDir,g,y),e.uniform1f(m.uFold,Q),e.uniform1f(m.uRadius,r.curlRadius),e.uniform1f(m.uAngle,o),e.uniform1f(m.uScale,i),e.uniform1f(m.uLift,A*26),e.uniform2f(m.uShadowOffset,1.2,2.4),e.uniform2f(m.uShadowSlope,.28,.55),e.uniform1i(m.uFinish,r.finish),e.uniform3fv(m.uBack,mt(r.backColor)),e.uniform3f(m.uLight,t.light.x-(t.x-X),t.light.y-(t.y-X),t.light.z),e.uniform1f(m.uShine,r.lighting),e.uniform1f(m.uShadow,r.shadow*.55),e.uniform1f(m.uTexel,l.texel/(a*l.meshX)),e.uniform1f(m.uLod,Math.max(0,Math.log2(l.texel/(a*l.meshX*i*I.ratio))));const h=me(t.light);if(e.uniform2f(m.uGlint,h.x/(a*l.meshX)+.5,h.y/(s*l.meshY)+.5),e.disable(e.DEPTH_TEST),z){dt();const[v,S]=ee;e.bindFramebuffer(e.FRAMEBUFFER,v.buffer),e.viewport(0,0,v.width,v.height),e.clear(e.COLOR_BUFFER_BIT),e.disable(e.BLEND),e.uniform1i(m.uPass,2),e.drawElements(e.TRIANGLES,b,e.UNSIGNED_SHORT,0),e.useProgram(Z.program),e.uniform1i(H.uSource,1),e.uniform1i(H.uMode,0),e.uniform1f(H.uSigma,Math.min(4,(2.5+r.curlRadius*.15)/2)),e.activeTexture(e.TEXTURE1),e.bindFramebuffer(e.FRAMEBUFFER,S.buffer),e.bindTexture(e.TEXTURE_2D,v.texture),e.uniform2f(H.uStep,1/v.width,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,v.buffer),e.bindTexture(e.TEXTURE_2D,S.texture),e.uniform2f(H.uStep,0,1/v.height),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,U.width,U.height),e.useProgram(O.program),e.activeTexture(e.TEXTURE0)}e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.uniform1i(m.uPass,0),e.drawElements(e.TRIANGLES,b,e.UNSIGNED_SHORT,0),e.uniform1i(m.uPass,1),e.drawElements(e.TRIANGLES,b,e.UNSIGNED_SHORT,0),z&&(e.useProgram(Z.program),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,ee[0].texture),e.uniform1i(H.uMode,1),e.uniform1f(H.uStrength,r.shadow*.6),e.drawArrays(e.TRIANGLES,0,3),e.useProgram(O.program),e.activeTexture(e.TEXTURE0),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.uniform1i(m.uPass,3),e.drawElements(e.TRIANGLES,b,e.UNSIGNED_SHORT,0),e.disable(e.DEPTH_TEST))},Xe=r=>{if(J=0,he&&(he=!1,pt()),E.current.hold){l.ready&&!document.hidden&&(U.style.opacity="0",Ce()),k=0;return}if(!te||document.hidden)return;const n=E.current,o=k?P((r-k)/1e3,.001,1/30):1/60;k=r,n.imageSrc!==fe&&Ne(n.imageSrc);const i=Y();t.intro<1&&l.ready&&(t.intro=Math.min(1,t.intro+o/1.1));const a=t.press,s=a&&a.moving?a:null;if(s){const A=s.pointer,X=s.pivot,b=1-Math.exp(-o/.045),z=t.pivotV.x+((A.x-X.x)/o-t.pivotV.x)*b,h=t.pivotV.y+((A.y-X.y)/o-t.pivotV.y)*b,v=(z-t.pivotV.x)/o,S=(h-t.pivotV.y)/o;t.pivotV.x=z,t.pivotV.y=h,s.pivot={x:A.x,y:A.y};const ie=n.rotate+t.swing,pe=-(Math.cos(ie)*s.grab.x-Math.sin(ie)*s.grab.y),xe=-(Math.sin(ie)*s.grab.x+Math.cos(ie)*s.grab.y),Et=(n.width*n.width+i*i)/12+pe*pe+xe*xe,yt=(pe*-P(S,-24e3,24e3)-xe*-P(v,-24e3,24e3))/Et,ge=2*Math.PI*1.5;t.swingV+=(yt*1.1*n.swing-ge*ge*t.swing-2*.45*ge*t.swingV)*o,t.swing=P(t.swing+t.swingV*o,-1.2,1.2);const ae=n.rotate+t.swing,Ye=1+.07*Math.max(0,t.lift);t.x=A.x-(Math.cos(ae)*s.grab.x-Math.sin(ae)*s.grab.y)*Ye,t.y=A.y-(Math.sin(ae)*s.grab.x+Math.cos(ae)*s.grab.y)*Ye,de()}else{Te(t,"swing",0,1.4,.32,o);const A=Math.exp(-o*(1.5+9*n.friction));t.vx*=A,t.vy*=A,Math.hypot(t.vx,t.vy)<4&&(t.vx=0,t.vy=0),t.x+=t.vx*o,t.y+=t.vy*o,de()}const g=t.intro<.2,y=g?.3:a?n.activePeel:t.hover?n.hoverPeel:0;Te(t,"peel",y,a||t.hover?3:3.6,a||t.hover?.7:.62,o),Te(t,"lift",s?1:0,3.2,.55,o);let M=n.peelDirection;a&&Math.hypot(a.grab.x,a.grab.y)>Math.min(n.width,i)*.12?M=Math.atan2(a.grab.x,-a.grab.y):n.followPointer&&t.hover&&Math.hypot(t.local.x,t.local.y)>Math.min(n.width,i)*.12&&(M=Math.atan2(t.local.x,-t.local.y)),g||(t.dir+=Ke(M-t.dir)*(1-Math.exp(-o/.12)));const u=t.pointer.inside?{x:t.pointer.x,y:t.pointer.y,z:se}:{x:t.x-n.width*.45,y:t.y-i*.9,z:se*1.6},x=1-Math.exp(-o/.08);t.light.x+=(u.x-t.light.x)*x,t.light.y+=(u.y-t.light.y)*x,t.light.z+=(u.z-t.light.z)*x,U.style.opacity=String(P(t.intro/.12,0,1)),Ce(),t.intro<1&&l.ready||a||Math.abs(t.peel-y)>5e-4||Math.abs(t.peelV)>5e-4||Math.abs(t.lift-(s?1:0))>5e-4||Math.abs(t.liftV)>5e-4||Math.abs(t.swing)>5e-4||Math.abs(t.swingV)>5e-4||t.vx!==0||t.vy!==0||Math.abs(Ke(M-t.dir))>.002||Math.hypot(u.x-t.light.x,u.y-t.light.y,u.z-t.light.z)>.5?J=requestAnimationFrame(Xe):k=0};function F(){!J&&te&&!document.hidden&&(J=requestAnimationFrame(Xe))}const ve=r=>{const n=re(r);t.local=me(n);const o=gt(t.local);o!==t.hover&&(t.hover=o),d.style.cursor=o&&E.current.draggable?t.press?"grabbing":"grab":""},Ge=r=>{const n=re(r);t.pointer.x=n.x,t.pointer.y=n.y,t.pointer.inside=n.x>=0&&n.y>=0&&n.x<=D.width&&n.y<=D.height,F()},Be=r=>{var o,i;const n=t.press;if(!n)ve(r);else if(n.id===r.pointerId){const a=re(r);n.pointer=a,!n.moving&&Math.hypot(a.x-n.origin.x,a.y-n.origin.y)>3&&(n.moving=E.current.draggable,n.moving&&((i=(o=E.current).onDragStart)==null||i.call(o))),n.samples.push({x:a.x,y:a.y,t:performance.now()}),n.samples.length>8&&n.samples.shift()}F()},ze=()=>{t.press||(t.hover=!1,d.style.cursor="",F())},He=r=>{var i;const n=E.current;if(r.button!==0||!l.ready||(ve(r),!t.hover))return;const o=re(r);t.press={id:r.pointerId,grab:me(o),origin:o,pointer:o,pivot:o,moving:!1,samples:[]},t.pivotV={x:0,y:0},t.vx=0,t.vy=0,(i=d.setPointerCapture)==null||i.call(d,r.pointerId),n.draggable&&(d.style.cursor="grabbing",je+=1,N.style.zIndex=String(je)),r.preventDefault(),F()},oe=r=>{var a,s,g;const n=t.press;if(!n||n.id!==r.pointerId)return;t.press=null,(a=d.hasPointerCapture)!=null&&a.call(d,r.pointerId)&&d.releasePointerCapture(r.pointerId);const o=performance.now(),i=n.samples.filter(y=>o-y.t<90);if(n.moving&&i.length>1&&!Ie){const y=i[0],M=i[i.length-1],u=Math.max(M.t-y.t,16)/1e3,x=2600;t.vx=P((M.x-y.x)/u,-x,x),t.vy=P((M.y-y.y)/u,-x,x)}ve(r),r.pointerType!=="mouse"&&(t.hover=!1),n.moving&&((g=(s=E.current).onDragEnd)==null||g.call(s)),F()},ke=()=>{t.pointer.inside=!1,F()},Ve=()=>{k=0,F()},Oe=new ResizeObserver(()=>{ne(),F()});Oe.observe(B);const We=new IntersectionObserver(r=>{te=r.some(n=>n.isIntersecting),te&&(k=0,F())});return We.observe(B),window.addEventListener("pointermove",Ge,{passive:!0}),document.documentElement.addEventListener("pointerleave",ke),document.addEventListener("visibilitychange",Ve),d.addEventListener("pointermove",Be),d.addEventListener("pointerleave",ze),d.addEventListener("pointerdown",He),d.addEventListener("pointerup",oe),d.addEventListener("pointercancel",oe),Ne(E.current.imageSrc),ne(),K.current=()=>{ne(),F()},F(),()=>{var r;De=!1,cancelAnimationFrame(J),K.current=null,Oe.disconnect(),We.disconnect(),window.removeEventListener("pointermove",Ge),document.documentElement.removeEventListener("pointerleave",ke),document.removeEventListener("visibilitychange",Ve),d.removeEventListener("pointermove",Be),d.removeEventListener("pointerleave",ze),d.removeEventListener("pointerdown",He),d.removeEventListener("pointerup",oe),d.removeEventListener("pointercancel",oe),e.deleteTexture(ue),ee.forEach(n=>{e.deleteTexture(n.texture),e.deleteFramebuffer(n.buffer)}),e.deleteProgram(Z.program),e.deleteBuffer(Ue),e.deleteBuffer(Fe),e.deleteVertexArray(le),e.deleteProgram(O.program),U.isConnected||(r=e.getExtension("WEBGL_lose_context"))==null||r.loseContext()}},[]),V.useEffect(()=>{var N;(N=K.current)==null||N.call(K)}),Ee.jsxs("div",{ref:Me,className:`sticker-peel${we?` ${we}`:""}`,style:ft,...ht,children:[Ee.jsx("canvas",{ref:be,className:"sticker-peel-canvas","aria-hidden":"true"}),Ee.jsx("div",{ref:Se,className:"sticker-peel-hit",style:Re?{pointerEvents:"none"}:void 0})]})};export{Pt as default};
