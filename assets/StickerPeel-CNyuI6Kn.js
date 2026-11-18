import{r as k,j as Ee}from"./Footer-CzJEu2iA.js";const _=96,ye=.18,yt=1024,qe=96,se=260,Tt={gloss:0,matte:1,holo:2};let Ye=1;const Rt=`#version 300 es
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
}`,wt=`#version 300 es
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
}`,Mt=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,bt=`#version 300 es
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
}`,P=(c,T,F)=>Math.min(F,Math.max(T,c)),$e=c=>Math.atan2(Math.sin(c),Math.cos(c)),je=c=>c*Math.PI/180,Te=(c,T,F,x,w,f)=>{const R=2*Math.PI*x,G=`${T}V`;c[G]+=(R*R*(F-c[T])-2*w*R*c[G])*f,c[T]+=c[G]*f},Ke=(c,T,F)=>{const x=c.createShader(T);return x?(c.shaderSource(x,F),c.compileShader(x),c.getShaderParameter(x,c.COMPILE_STATUS)?x:(c.deleteShader(x),null)):null},Ze=(c,T,F)=>{const x=Ke(c,c.VERTEX_SHADER,T),w=Ke(c,c.FRAGMENT_SHADER,F),f=c.createProgram();if(!x||!w||!f)return null;if(c.attachShader(f,x),c.attachShader(f,w),c.bindAttribLocation(f,0,"aGrid"),c.linkProgram(f),c.deleteShader(x),c.deleteShader(w),!c.getProgramParameter(f,c.LINK_STATUS))return c.deleteProgram(f),null;const R={},G=c.getProgramParameter(f,c.ACTIVE_UNIFORMS);for(let $=0;$<G;$++){const j=c.getActiveUniform(f,$);j&&(R[j.name]=c.getUniformLocation(f,j.name))}return{program:f,uniforms:R}},St=c=>{const T=[...c].sort((f,R)=>f[0]-R[0]||f[1]-R[1]);if(T.length<3)return T;const F=(f,R,G)=>(R[0]-f[0])*(G[1]-f[1])-(R[1]-f[1])*(G[0]-f[0]),x=[];T.forEach(f=>{for(;x.length>=2&&F(x[x.length-2],x[x.length-1],f)<=0;)x.pop();x.push(f)});const w=[];for(let f=T.length-1;f>=0;f--){const R=T[f];for(;w.length>=2&&F(w[w.length-2],w[w.length-1],R)<=0;)w.pop();w.push(R)}return x.slice(0,-1).concat(w.slice(0,-1))},_t=({imageSrc:c,width:T=200,rotate:F=0,peelDirection:x=0,peelBackHoverPct:w=25,peelBackActivePct:f=40,curlRadius:R=12,finish:G="gloss",backColor:$="#d4d4d8",lightingIntensity:j=.5,shadowIntensity:Je=.6,followPointer:Qe=!0,draggable:et=!0,swing:tt=1,friction:ot=.5,bounce:rt=.35,intro:nt=!0,initialPosition:it="center",onDragStart:at,onDragEnd:st,dpr:ct,className:Re="",style:lt,...ut})=>{const we=k.useRef(null),Me=k.useRef(null),be=k.useRef(null),K=k.useRef(null),Se={imageSrc:c,width:Math.max(16,T),rotate:je(F),peelDirection:je(x),hoverPeel:P(w,0,100)/100,activePeel:P(f,0,100)/100,curlRadius:Math.max(2,R),finish:Tt[G]??0,backColor:$,lighting:P(j,0,1),shadow:P(Je,0,1),followPointer:Qe,draggable:et,swing:P(tt,0,3),friction:P(ot,0,1),bounce:P(rt,0,1),intro:nt,initialPosition:it,onDragStart:at,onDragEnd:st,dpr:ct},y=k.useRef(Se);return y.current=Se,k.useEffect(()=>{var Oe;const N=we.current,L=Me.current,d=be.current,B=N==null?void 0:N.parentElement,e=L==null?void 0:L.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!0,depth:!0,stencil:!1});if(!N||!L||!d||!B||!e)return;const V=Ze(e,Rt,wt),Z=Ze(e,Mt,bt);if(!V||!Z)return;const m=V.uniforms,H=Z.uniforms,ee=[0,1].map(()=>{const r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const o=e.createFramebuffer();return{texture:r,buffer:o,width:0,height:0}}),ft=()=>{const r=Math.max(1,Math.round(I.size/2)),o=r;ee.forEach(n=>{n.width===r&&n.height===o||(n.width=r,n.height=o,e.bindTexture(e.TEXTURE_2D,n.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,r,o,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindFramebuffer(e.FRAMEBUFFER,n.buffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n.texture,0))}),e.bindFramebuffer(e.FRAMEBUFFER,null)},ce=new Float32Array((_+1)*(_+1)*2);for(let r=0;r<=_;r++)for(let o=0;o<=_;o++){const n=(r*(_+1)+o)*2;ce[n]=o/_,ce[n+1]=r/_}const Ae=new Uint16Array(_*_*6);let _e=0;for(let r=0;r<_;r++)for(let o=0;o<_;o++){const n=r*(_+1)+o,i=n+1,a=n+_+1,s=a+1;Ae.set([n,i,s,n,s,a],_e),_e+=6}const le=e.createVertexArray();e.bindVertexArray(le);const Pe=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,Pe),e.bufferData(e.ARRAY_BUFFER,ce,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const Ue=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,Ue),e.bufferData(e.ELEMENT_ARRAY_BUFFER,Ae,e.STATIC_DRAW);const ue=e.createTexture(),C=document.createElement("canvas"),O=C.getContext("2d",{willReadFrequently:!0}),W=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),Fe=new Map,ht=r=>{const o=String(r),n=Fe.get(o);if(n)return n;let i=[.83,.83,.85];if(W){W.clearRect(0,0,1,1),W.fillStyle="#d4d4d8",W.fillStyle=o,W.fillRect(0,0,1,1);const[a,s,g]=W.getImageData(0,0,1,1).data;i=[a/255,s/255,g/255]}return Fe.set(o,i),i},Le=((Oe=window.matchMedia)==null?void 0:Oe.call(window,"(prefers-reduced-motion: reduce)").matches)??!1,l={ready:!1,aspect:1,meshX:1,meshY:1,texel:1,mask:null,maskW:1,maskH:1,hull:[]},I={ratio:1,size:1,density:0},D={width:1,height:1},t={x:0,y:0,vx:0,vy:0,placed:!1,swing:0,swingV:0,peel:0,peelV:0,lift:0,liftV:0,dir:y.current.peelDirection,hover:!1,local:{x:0,y:0},press:null,pivotV:{x:0,y:0},light:{x:0,y:0,z:se},pointer:{x:0,y:0,inside:!1},intro:y.current.intro&&!Le?0:1};t.intro<1&&(t.lift=1.5,t.peel=.3,t.swing=.1,t.dir+=.6);let J=0,q=0,te=!0,fe=null,Ie=!0;const Y=()=>y.current.width*l.aspect,dt=(r,o)=>{const i=y.current.width,a=Y();if(!l.hull.length){const E=(Math.abs(r)*i+Math.abs(o)*a)/2;return[-E,E]}let s=1/0,g=-1/0;return l.hull.forEach(([E,M])=>{const u=E*i*r+M*a*o;u<s&&(s=u),u>g&&(g=u)}),[s,g]},De=r=>{if(fe=r,l.ready=!1,!r)return;const o=new Image;o.crossOrigin="anonymous",o.decoding="async",o.onload=()=>{if(!Ie||fe!==r||!O)return;const n=o.naturalWidth||1,i=o.naturalHeight||1,a=Math.min(1,yt/(Math.max(n,i)*(1+2*ye))),s=Math.max(1,Math.round(n*a)),g=Math.max(1,Math.round(i*a)),E=Math.round(s*ye),M=Math.round(g*ye);C.width=s+E*2,C.height=g+M*2,O.clearRect(0,0,C.width,C.height),O.drawImage(o,E,M,s,g),e.bindTexture(e.TEXTURE_2D,ue),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,C),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),l.aspect=i/n,l.meshX=C.width/s,l.meshY=C.height/g,l.texel=C.width;const u=Math.max(8,Math.round(qe*Math.min(1,n/i))),p=Math.max(8,Math.round(qe*Math.min(1,i/n)));C.width=u,C.height=p,O.clearRect(0,0,u,p),O.drawImage(o,0,0,u,p);const Q=O.getImageData(0,0,u,p).data,A=new Uint8Array(u*p).fill(255),X=[],b=(h,v)=>{const S=v*u+h;A[S]===0||Q[S*4+3]>100||(A[S]=0,X.push(S))};for(let h=0;h<u;h++)b(h,0),b(h,p-1);for(let h=0;h<p;h++)b(0,h),b(u-1,h);for(;X.length;){const h=X.pop(),v=h%u,S=(h-v)/u;v>0&&b(v-1,S),v<u-1&&b(v+1,S),S>0&&b(v,S-1),S<p-1&&b(v,S+1)}const z=[];for(let h=0;h<p;h++)for(let v=0;v<u;v++)Q[(h*u+v)*4+3]>127&&z.push([(v+.5)/u-.5,(h+.5)/p-.5]);l.mask=A,l.maskW=u,l.maskH=p,l.hull=St(z),l.ready=!0,oe(),U()},o.src=r};let he=!1;const mt=()=>{const r=y.current;I.ratio=Math.min(r.dpr||window.devicePixelRatio||1,2),D.width=Math.max(1,B.clientWidth),D.height=Math.max(1,B.clientHeight);const o=Y(),n=Math.ceil(Math.hypot(r.width,o)*1.16+2*(36+r.curlRadius));if((n!==I.size||I.ratio!==I.density)&&(I.size=n,I.density=I.ratio,N.style.width=`${n}px`,N.style.height=`${n}px`,L.width=Math.round(n*I.ratio),L.height=Math.round(n*I.ratio)),d.style.width=`${r.width}px`,d.style.height=`${o}px`,!t.placed){const i=r.initialPosition,a=i&&typeof i=="object"?i:{x:0,y:0};t.x=D.width/2+(a.x||0),t.y=D.height/2+(a.y||0),t.light={x:t.x-r.width*.45,y:t.y-o*.9,z:se*1.6},t.placed=!0}de()},oe=()=>{he=!0,U()},vt=()=>{const r=y.current,o=r.rotate+t.swing,n=1+.07*Math.max(0,t.lift),i=r.width/2*n,a=Y()/2*n,s=Math.abs(Math.cos(o)),g=Math.abs(Math.sin(o));return{x:i*s+a*g,y:i*g+a*s}},de=()=>{const r=y.current,o=vt(),n=Math.min(o.x,D.width/2),i=Math.max(D.width-o.x,D.width/2),a=Math.min(o.y,D.height/2),s=Math.max(D.height-o.y,D.height/2);t.x<n?(t.x=n,t.vx<0&&(t.vx=-t.vx*r.bounce)):t.x>i&&(t.x=i,t.vx>0&&(t.vx=-t.vx*r.bounce)),t.y<a?(t.y=a,t.vy<0&&(t.vy=-t.vy*r.bounce)):t.y>s&&(t.y=s,t.vy>0&&(t.vy=-t.vy*r.bounce))},re=r=>{const o=B.getBoundingClientRect();return{x:r.clientX-o.left-B.clientLeft,y:r.clientY-o.top-B.clientTop}},me=r=>{const n=-(y.current.rotate+t.swing),i=1+.07*Math.max(0,t.lift),a=r.x-t.x,s=r.y-t.y;return{x:(Math.cos(n)*a-Math.sin(n)*s)/i,y:(Math.sin(n)*a+Math.cos(n)*s)/i}},xt=r=>{if(!l.mask)return!1;const o=y.current,n=Math.floor((r.x/o.width+.5)*l.maskW),i=Math.floor((r.y/Y()+.5)*l.maskH);return n<0||i<0||n>=l.maskW||i>=l.maskH?!1:l.mask[i*l.maskW+n]>100},pt=()=>{const r=y.current,o=I.size;N.style.transform=`translate3d(${t.x-o/2}px, ${t.y-o/2}px, 0)`;const n=r.rotate+t.swing,i=1+.07*Math.max(0,t.lift);if(d.style.transform=`translate(-50%, -50%) rotate(${n}rad) scale(${i})`,e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,L.width,L.height),e.clearColor(0,0,0,0),e.clearDepth(1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),!l.ready)return;const a=r.width,s=Y(),g=-Math.sin(t.dir),E=Math.cos(t.dir),[M,u]=dt(g,E),p=P(t.peel,0,1),Q=M+p*(u-M),A=Math.max(0,t.lift),X=o/2,b=_*_*6,z=p>.001;e.useProgram(V.program),e.bindVertexArray(le),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,ue),e.uniform1i(m.uImage,0),e.uniform2f(m.uCanvas,o,o),e.uniform2f(m.uMesh,a*l.meshX,s*l.meshY),e.uniform2f(m.uCenter,X,X),e.uniform2f(m.uDir,g,E),e.uniform1f(m.uFold,Q),e.uniform1f(m.uRadius,r.curlRadius),e.uniform1f(m.uAngle,n),e.uniform1f(m.uScale,i),e.uniform1f(m.uLift,A*26),e.uniform2f(m.uShadowOffset,1.2,2.4),e.uniform2f(m.uShadowSlope,.28,.55),e.uniform1i(m.uFinish,r.finish),e.uniform3fv(m.uBack,ht(r.backColor)),e.uniform3f(m.uLight,t.light.x-(t.x-X),t.light.y-(t.y-X),t.light.z),e.uniform1f(m.uShine,r.lighting),e.uniform1f(m.uShadow,r.shadow*.55),e.uniform1f(m.uTexel,l.texel/(a*l.meshX)),e.uniform1f(m.uLod,Math.max(0,Math.log2(l.texel/(a*l.meshX*i*I.ratio))));const h=me(t.light);if(e.uniform2f(m.uGlint,h.x/(a*l.meshX)+.5,h.y/(s*l.meshY)+.5),e.disable(e.DEPTH_TEST),z){ft();const[v,S]=ee;e.bindFramebuffer(e.FRAMEBUFFER,v.buffer),e.viewport(0,0,v.width,v.height),e.clear(e.COLOR_BUFFER_BIT),e.disable(e.BLEND),e.uniform1i(m.uPass,2),e.drawElements(e.TRIANGLES,b,e.UNSIGNED_SHORT,0),e.useProgram(Z.program),e.uniform1i(H.uSource,1),e.uniform1i(H.uMode,0),e.uniform1f(H.uSigma,Math.min(4,(2.5+r.curlRadius*.15)/2)),e.activeTexture(e.TEXTURE1),e.bindFramebuffer(e.FRAMEBUFFER,S.buffer),e.bindTexture(e.TEXTURE_2D,v.texture),e.uniform2f(H.uStep,1/v.width,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,v.buffer),e.bindTexture(e.TEXTURE_2D,S.texture),e.uniform2f(H.uStep,0,1/v.height),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,L.width,L.height),e.useProgram(V.program),e.activeTexture(e.TEXTURE0)}e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.uniform1i(m.uPass,0),e.drawElements(e.TRIANGLES,b,e.UNSIGNED_SHORT,0),e.uniform1i(m.uPass,1),e.drawElements(e.TRIANGLES,b,e.UNSIGNED_SHORT,0),z&&(e.useProgram(Z.program),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,ee[0].texture),e.uniform1i(H.uMode,1),e.uniform1f(H.uStrength,r.shadow*.6),e.drawArrays(e.TRIANGLES,0,3),e.useProgram(V.program),e.activeTexture(e.TEXTURE0),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.uniform1i(m.uPass,3),e.drawElements(e.TRIANGLES,b,e.UNSIGNED_SHORT,0),e.disable(e.DEPTH_TEST))},Ne=r=>{if(J=0,he&&(he=!1,mt()),!te||document.hidden)return;const o=y.current,n=q?P((r-q)/1e3,.001,1/30):1/60;q=r,o.imageSrc!==fe&&De(o.imageSrc);const i=Y();t.intro<1&&l.ready&&(t.intro=Math.min(1,t.intro+n/1.1));const a=t.press,s=a&&a.moving?a:null;if(s){const A=s.pointer,X=s.pivot,b=1-Math.exp(-n/.045),z=t.pivotV.x+((A.x-X.x)/n-t.pivotV.x)*b,h=t.pivotV.y+((A.y-X.y)/n-t.pivotV.y)*b,v=(z-t.pivotV.x)/n,S=(h-t.pivotV.y)/n;t.pivotV.x=z,t.pivotV.y=h,s.pivot={x:A.x,y:A.y};const ie=o.rotate+t.swing,xe=-(Math.cos(ie)*s.grab.x-Math.sin(ie)*s.grab.y),pe=-(Math.sin(ie)*s.grab.x+Math.cos(ie)*s.grab.y),gt=(o.width*o.width+i*i)/12+xe*xe+pe*pe,Et=(xe*-P(S,-24e3,24e3)-pe*-P(v,-24e3,24e3))/gt,ge=2*Math.PI*1.5;t.swingV+=(Et*1.1*o.swing-ge*ge*t.swing-2*.45*ge*t.swingV)*n,t.swing=P(t.swing+t.swingV*n,-1.2,1.2);const ae=o.rotate+t.swing,We=1+.07*Math.max(0,t.lift);t.x=A.x-(Math.cos(ae)*s.grab.x-Math.sin(ae)*s.grab.y)*We,t.y=A.y-(Math.sin(ae)*s.grab.x+Math.cos(ae)*s.grab.y)*We,de()}else{Te(t,"swing",0,1.4,.32,n);const A=Math.exp(-n*(1.5+9*o.friction));t.vx*=A,t.vy*=A,Math.hypot(t.vx,t.vy)<4&&(t.vx=0,t.vy=0),t.x+=t.vx*n,t.y+=t.vy*n,de()}const g=t.intro<.2,E=g?.3:a?o.activePeel:t.hover?o.hoverPeel:0;Te(t,"peel",E,a||t.hover?3:3.6,a||t.hover?.7:.62,n),Te(t,"lift",s?1:0,3.2,.55,n);let M=o.peelDirection;a&&Math.hypot(a.grab.x,a.grab.y)>Math.min(o.width,i)*.12?M=Math.atan2(a.grab.x,-a.grab.y):o.followPointer&&t.hover&&Math.hypot(t.local.x,t.local.y)>Math.min(o.width,i)*.12&&(M=Math.atan2(t.local.x,-t.local.y)),g||(t.dir+=$e(M-t.dir)*(1-Math.exp(-n/.12)));const u=t.pointer.inside?{x:t.pointer.x,y:t.pointer.y,z:se}:{x:t.x-o.width*.45,y:t.y-i*.9,z:se*1.6},p=1-Math.exp(-n/.08);t.light.x+=(u.x-t.light.x)*p,t.light.y+=(u.y-t.light.y)*p,t.light.z+=(u.z-t.light.z)*p,L.style.opacity=String(P(t.intro/.12,0,1)),pt(),t.intro<1&&l.ready||a||Math.abs(t.peel-E)>5e-4||Math.abs(t.peelV)>5e-4||Math.abs(t.lift-(s?1:0))>5e-4||Math.abs(t.liftV)>5e-4||Math.abs(t.swing)>5e-4||Math.abs(t.swingV)>5e-4||t.vx!==0||t.vy!==0||Math.abs($e(M-t.dir))>.002||Math.hypot(u.x-t.light.x,u.y-t.light.y,u.z-t.light.z)>.5?J=requestAnimationFrame(Ne):q=0};function U(){!J&&te&&!document.hidden&&(J=requestAnimationFrame(Ne))}const ve=r=>{const o=re(r);t.local=me(o);const n=xt(t.local);n!==t.hover&&(t.hover=n),d.style.cursor=n&&y.current.draggable?t.press?"grabbing":"grab":""},Ce=r=>{const o=re(r);t.pointer.x=o.x,t.pointer.y=o.y,t.pointer.inside=o.x>=0&&o.y>=0&&o.x<=D.width&&o.y<=D.height,U()},Xe=r=>{var n,i;const o=t.press;if(!o)ve(r);else if(o.id===r.pointerId){const a=re(r);o.pointer=a,!o.moving&&Math.hypot(a.x-o.origin.x,a.y-o.origin.y)>3&&(o.moving=y.current.draggable,o.moving&&((i=(n=y.current).onDragStart)==null||i.call(n))),o.samples.push({x:a.x,y:a.y,t:performance.now()}),o.samples.length>8&&o.samples.shift()}U()},Ge=()=>{t.press||(t.hover=!1,d.style.cursor="",U())},Be=r=>{var i;const o=y.current;if(r.button!==0||!l.ready||(ve(r),!t.hover))return;const n=re(r);t.press={id:r.pointerId,grab:me(n),origin:n,pointer:n,pivot:n,moving:!1,samples:[]},t.pivotV={x:0,y:0},t.vx=0,t.vy=0,(i=d.setPointerCapture)==null||i.call(d,r.pointerId),o.draggable&&(d.style.cursor="grabbing",Ye+=1,N.style.zIndex=String(Ye)),r.preventDefault(),U()},ne=r=>{var a,s,g;const o=t.press;if(!o||o.id!==r.pointerId)return;t.press=null,(a=d.hasPointerCapture)!=null&&a.call(d,r.pointerId)&&d.releasePointerCapture(r.pointerId);const n=performance.now(),i=o.samples.filter(E=>n-E.t<90);if(o.moving&&i.length>1&&!Le){const E=i[0],M=i[i.length-1],u=Math.max(M.t-E.t,16)/1e3,p=2600;t.vx=P((M.x-E.x)/u,-p,p),t.vy=P((M.y-E.y)/u,-p,p)}ve(r),r.pointerType!=="mouse"&&(t.hover=!1),o.moving&&((g=(s=y.current).onDragEnd)==null||g.call(s)),U()},ze=()=>{t.pointer.inside=!1,U()},He=()=>{q=0,U()},ke=new ResizeObserver(()=>{oe(),U()});ke.observe(B);const Ve=new IntersectionObserver(r=>{te=r.some(o=>o.isIntersecting),te&&(q=0,U())});return Ve.observe(B),window.addEventListener("pointermove",Ce,{passive:!0}),document.documentElement.addEventListener("pointerleave",ze),document.addEventListener("visibilitychange",He),d.addEventListener("pointermove",Xe),d.addEventListener("pointerleave",Ge),d.addEventListener("pointerdown",Be),d.addEventListener("pointerup",ne),d.addEventListener("pointercancel",ne),De(y.current.imageSrc),oe(),K.current=()=>{oe(),U()},U(),()=>{var r;Ie=!1,cancelAnimationFrame(J),K.current=null,ke.disconnect(),Ve.disconnect(),window.removeEventListener("pointermove",Ce),document.documentElement.removeEventListener("pointerleave",ze),document.removeEventListener("visibilitychange",He),d.removeEventListener("pointermove",Xe),d.removeEventListener("pointerleave",Ge),d.removeEventListener("pointerdown",Be),d.removeEventListener("pointerup",ne),d.removeEventListener("pointercancel",ne),e.deleteTexture(ue),ee.forEach(o=>{e.deleteTexture(o.texture),e.deleteFramebuffer(o.buffer)}),e.deleteProgram(Z.program),e.deleteBuffer(Pe),e.deleteBuffer(Ue),e.deleteVertexArray(le),e.deleteProgram(V.program),L.isConnected||(r=e.getExtension("WEBGL_lose_context"))==null||r.loseContext()}},[]),k.useEffect(()=>{var N;(N=K.current)==null||N.call(K)}),Ee.jsxs("div",{ref:we,className:`sticker-peel${Re?` ${Re}`:""}`,style:lt,...ut,children:[Ee.jsx("canvas",{ref:Me,className:"sticker-peel-canvas","aria-hidden":"true"}),Ee.jsx("div",{ref:be,className:"sticker-peel-hit"})]})};export{_t as default};
