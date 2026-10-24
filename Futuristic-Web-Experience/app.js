import * as THREE from 'three';
import { EffectComposer }   from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }       from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass }       from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass }       from 'three/addons/postprocessing/OutputPass.js';

gsap.registerPlugin(ScrollTrigger);

/* ====================================================
   NOISE GLSL — Perlin 3D (Stefan Gustavson)
   ==================================================== */
const NOISE_GLSL = /* glsl */`
vec3 _mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 _mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 _permute(vec4 x){return _mod289v4(((x*34.)+1.)*x);}
vec4 _taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
vec3 _fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}
float cnoise(vec3 P){
  vec3 Pi0=floor(P),Pi1=Pi0+vec3(1.);
  Pi0=_mod289v3(Pi0);Pi1=_mod289v3(Pi1);
  vec3 Pf0=fract(P),Pf1=Pf0-vec3(1.);
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz,iz1=Pi1.zzzz;
  vec4 ixy=_permute(_permute(ix)+iy);
  vec4 ixy0=_permute(ixy+iz0),ixy1=_permute(ixy+iz1);
  vec4 gx0=ixy0*(1./7.),gy0=fract(floor(gx0)*(1./7.))-.5;
  gx0=fract(gx0);
  vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
  vec4 sz0=step(gz0,vec4(0.));
  gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);
  vec4 gx1=ixy1*(1./7.),gy1=fract(floor(gx1)*(1./7.))-.5;
  gx1=fract(gx1);
  vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
  vec4 sz1=step(gz1,vec4(0.));
  gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x),g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z),g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x),g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z),g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0=_taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
  vec4 norm1=_taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
  float n000=dot(g000,Pf0),n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)),n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z)),n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz)),n111=dot(g111,Pf1);
  vec3 fade_xyz=_fade(Pf0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  return 2.2*mix(n_yz.x,n_yz.y,fade_xyz.x);
}
`;

/* ====================================================
   CHROMATIC ABERRATION POST-PROCESS PASS
   ==================================================== */
const ChromaShader = {
  uniforms: {
    tDiffuse: { value: null },
    uStrength: { value: 0.004 }
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uStrength;
    varying vec2 vUv;
    void main(){
      vec2 c=vec2(.5);
      vec2 dir=normalize(vUv-c);
      float d=length(vUv-c);
      float off=uStrength*d*d;
      float r=texture2D(tDiffuse,vUv+dir*off).r;
      float g=texture2D(tDiffuse,vUv).g;
      float b=texture2D(tDiffuse,vUv-dir*off).b;
      gl_FragColor=vec4(r,g,b,1.);
    }
  `
};

/* ====================================================
   SCENE SETUP
   ==================================================== */
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 12, 40);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5.5);

/* ====================================================
   POST PROCESSING
   ==================================================== */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.35,   // strength
  0.6,    // radius
  0.88    // threshold
);
composer.addPass(bloom);

const chromaPass = new ShaderPass(ChromaShader);
composer.addPass(chromaPass);
composer.addPass(new OutputPass());

/* ====================================================
   ENVIRONMENT MAP (gradient cube baked once)
   ==================================================== */
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Build a simple gradient env using a sphere scene trick
const envScene = new THREE.Scene();
const envGeo = new THREE.SphereGeometry(10, 32, 32);
const envMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    uTop:    { value: new THREE.Color(0x070d17) },
    uMid:    { value: new THREE.Color(0x0d0d0d) },
    uBottom: { value: new THREE.Color(0x020202) }
  },
  vertexShader:   `varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `
    uniform vec3 uTop,uMid,uBottom;
    varying vec3 vPos;
    void main(){
      float t=normalize(vPos).y*.5+.5;
      vec3 c=mix(uBottom,uMid,smoothstep(0.,.5,t));
      c=mix(c,uTop,smoothstep(.5,1.,t));
      gl_FragColor=vec4(c,1.);
    }
  `
});
envScene.add(new THREE.Mesh(envGeo, envMat));

const envRT = pmremGenerator.fromScene(envScene, 0.04);
scene.environment = envRT.texture;
pmremGenerator.dispose();

/* ====================================================
   CUBE CAMERA (live reflections on the orb)
   ==================================================== */
const cubeRT = new THREE.WebGLCubeRenderTarget(128, {
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter
});
const cubeCamera = new THREE.CubeCamera(0.5, 30, cubeRT);
scene.add(cubeCamera);

/* ====================================================
   LIQUID ORB
   ==================================================== */
function buildOrb() {
  const geo = new THREE.SphereGeometry(1.3, 128, 128);
  const mat = new THREE.MeshPhysicalMaterial({
    metalness:                  0.92,
    roughness:                  0.04,
    envMap:                     cubeRT.texture,
    envMapIntensity:            2.8,
    color:                      new THREE.Color(0x8a9098),
    iridescence:                0.9,
    iridescenceIOR:             1.75,
    iridescenceThicknessRange:  [180, 700],
    clearcoat:                  1.0,
    clearcoatRoughness:         0.02,
  });

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uMouse = { value: new THREE.Vector2(0, 0) };

    shader.vertexShader =
      NOISE_GLSL +
      'uniform float uTime;\nuniform vec2 uMouse;\n' +
      shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      float n1=cnoise(transformed*1.1+vec3(uTime*.09,uTime*.07,uTime*.11));
      float n2=cnoise(transformed*2.5-vec3(uTime*.05,uTime*.08,uTime*.04))*.45;
      float n3=cnoise(transformed*5.0+vec3(uTime*.03))*.22;
      float disp=(n1+n2+n3)*0.14;
      // subtle mouse influence
      vec3 mDir=vec3(uMouse.x,uMouse.y,0.)*0.08;
      transformed+=normal*(disp+dot(normalize(transformed),mDir)*0.05);`
    );

    mat.userData.shader = shader;
  };

  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  return mesh;
}
const orb = buildOrb();

/* ====================================================
   GLASS BACKGROUND PLANES
   ==================================================== */
function buildGlassPlanes() {
  const planes = [];
  const positions = [
    { pos: [-4, 1.5, -3], rot: [0.05, 0.3, 0], scale: [3.2, 4.5, 1] },
    { pos: [4.5, -1, -2.5], rot: [-0.05, -0.25, 0.05], scale: [2.8, 3.8, 1] },
    { pos: [0, -3.5, -4], rot: [0.4, 0, 0], scale: [6, 2, 1] },
  ];

  positions.forEach(({ pos, rot, scale }) => {
    const geo = new THREE.PlaneGeometry(1, 1, 1, 1);
    const mat = new THREE.MeshPhysicalMaterial({
      metalness:    0,
      roughness:    0.05,
      transmission: 0.92,
      thickness:    0.5,
      envMapIntensity: 0.8,
      color:        new THREE.Color(0x8090a8),
      transparent:  true,
      opacity:      0.15,
      side:         THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    scene.add(mesh);
    planes.push(mesh);
  });
  return planes;
}
const glassPlanes = buildGlassPlanes();

/* ====================================================
   FLOATING COINS (Realm 3 area)
   ==================================================== */
function buildCoins() {
  const coins = [];
  const coinMat = new THREE.MeshPhysicalMaterial({
    metalness:       1.0,
    roughness:       0.06,
    envMapIntensity: 3.5,
    color:           new THREE.Color(0x9a8060),
    iridescence:     0.6,
    iridescenceIOR:  1.5,
    iridescenceThicknessRange: [100, 400],
  });

  const configs = [
    { r: 0.5, t: 0.06, pos: [2.8, 0.3, 2], speed: 0.7,  tilt: 0.3  },
    { r: 0.7, t: 0.07, pos: [3.8, -0.8, 1.5], speed: 0.5, tilt: -0.4 },
    { r: 0.35, t: 0.05, pos: [2.2, 1.2, 1.8], speed: 0.9, tilt: 0.6 },
    { r: 0.55, t: 0.06, pos: [4.2, 0.6, 2.2], speed: 0.6, tilt: -0.2 },
  ];

  configs.forEach(({ r, t, pos, speed, tilt }) => {
    const geo = new THREE.CylinderGeometry(r, r, t, 64);
    const mesh = new THREE.Mesh(geo, coinMat.clone());
    mesh.position.set(...pos);
    mesh.rotation.x = tilt;
    mesh.userData = { speed, baseY: pos[1] };
    scene.add(mesh);
    coins.push(mesh);
  });
  return coins;
}
const coins = buildCoins();

/* ====================================================
   MIRROR SHARDS (hero decoration)
   ==================================================== */
function buildShards() {
  const shards = [];
  const shardMat = new THREE.MeshPhysicalMaterial({
    metalness:       0.85,
    roughness:       0.08,
    envMapIntensity: 2.5,
    color:           new THREE.Color(0x707880),
    transparent:     true,
    opacity:         0.6,
    side:            THREE.DoubleSide,
  });

  for (let i = 0; i < 12; i++) {
    const w = 0.15 + Math.random() * 0.4;
    const h = 0.2 + Math.random() * 0.6;
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = shardMat.clone();
    mat.opacity = 0.2 + Math.random() * 0.4;
    const mesh = new THREE.Mesh(geo, mat);
    const angle = (i / 12) * Math.PI * 2;
    const radius = 2.5 + Math.random() * 1.5;
    mesh.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 3,
      -1 + Math.random() * -2
    );
    mesh.rotation.set(
      Math.random() * 0.6,
      Math.random() * Math.PI,
      Math.random() * 0.4
    );
    mesh.userData = {
      floatSpeed:  0.3 + Math.random() * 0.5,
      floatOffset: Math.random() * Math.PI * 2,
      rotSpeed:    (Math.random() - 0.5) * 0.004
    };
    scene.add(mesh);
    shards.push(mesh);
  }
  return shards;
}
const shards = buildShards();

/* ====================================================
   LIGHTING
   ==================================================== */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.04);
scene.add(ambientLight);

const amberLight = new THREE.PointLight(0xf5a623, 18, 12);
amberLight.position.set(3, 2, 3);
scene.add(amberLight);

const silverLight = new THREE.PointLight(0xb8c5d6, 12, 15);
silverLight.position.set(-4, 1, 2);
scene.add(silverLight);

const blueLight = new THREE.PointLight(0x1428a0, 8, 10);
blueLight.position.set(0, -3, -2);
scene.add(blueLight);

const rimLight = new THREE.DirectionalLight(0xdde3ea, 0.4);
rimLight.position.set(-2, 4, -5);
scene.add(rimLight);

/* ====================================================
   MOUSE & CURSOR
   ==================================================== */
const mouse = { x: 0, y: 0, nx: 0, ny: 0 };
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let dotX = 0, dotY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouse.x  = e.clientX;
  mouse.y  = e.clientY;
  mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Magnetic effect for interactive elements
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    gsap.to(el, {
      x: dx * 0.28,
      y: dy * 0.28,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ====================================================
   SMOOTH SCROLL — Lenis
   ==================================================== */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ====================================================
   CAMERA STATES (one per realm)
   ==================================================== */
const camStates = [
  { x:  0,    y: 0,    z: 5.5  },  // hero
  { x: -0.4,  y: 0.3,  z: 5.0  },  // mirror intelligence
  { x:  0.6,  y: -0.2, z: 4.5  },  // neural
  { x:  2.5,  y: -0.1, z: 4.8  },  // finance (shift toward coins)
  { x:  0,    y: 0.5,  z: 5.2  },  // data vault
  { x:  0,    y: 0.2,  z: 6.5  },  // finale (pull back)
];

/* ====================================================
   LOADING SEQUENCE
   ==================================================== */
const loaderEl   = document.getElementById('loader');
const progressEl = document.getElementById('loader-progress');
const shardEls   = document.querySelectorAll('.loader-logo .shard');

function runLoader() {
  // Animate shards in
  gsap.to(shardEls, {
    y: 0, rotation: 0, skewX: 0, opacity: 1,
    stagger: 0.07,
    duration: 0.9,
    ease: 'power4.out',
    delay: 0.3
  });

  // Fake progress bar
  gsap.to(progressEl, {
    width: '100%',
    duration: 1.8,
    ease: 'power1.inOut',
    onComplete: () => {
      setTimeout(dismissLoader, 400);
    }
  });
}

function dismissLoader() {
  gsap.to(shardEls, {
    y: -120, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power3.in'
  });
  setTimeout(() => {
    loaderEl.classList.add('gone');
    document.getElementById('nav').classList.add('show');
    revealHero();
  }, 500);
}

function revealHero() {
  gsap.to('#hero-label', { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.to(['#tl-0','#tl-1','#tl-2'], {
    y: 0, opacity: 1,
    stagger: 0.12,
    duration: 1.2,
    ease: 'power4.out',
    delay: 0.3
  });
  gsap.to('#hero-sub',  { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 });
  gsap.to('#hero-btns', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.0 });

  // Orb float-in
  gsap.from(orb.position, { y: -3, duration: 2.0, ease: 'power4.out', delay: 0.2 });
  gsap.from(orb.scale,    { x: 0, y: 0, z: 0, duration: 1.8, ease: 'back.out(1.5)', delay: 0.3 });
}

/* ====================================================
   SCROLL CHOREOGRAPHY
   ==================================================== */
function initScrollTriggers() {
  // Camera interpolation per section
  const realms = ['#realm-0','#realm-1','#realm-2','#realm-3','#realm-4','#realm-5'];

  realms.forEach((id, i) => {
    if (i === 0) return;
    const state = camStates[i];
    ScrollTrigger.create({
      trigger: id,
      start: 'top 80%',
      end:   'top 20%',
      scrub: 1.8,
      onUpdate: (self) => {
        const prev = camStates[i - 1];
        const p = self.progress;
        camera.position.x = THREE.MathUtils.lerp(prev.x, state.x, p);
        camera.position.y = THREE.MathUtils.lerp(prev.y, state.y, p);
        camera.position.z = THREE.MathUtils.lerp(prev.z, state.z, p);
      }
    });
  });

  // Glass panels reveal
  document.querySelectorAll('.glass-panel').forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 85%',
      onEnter: () => panel.classList.add('visible')
    });
  });

  // Metric counters
  document.querySelectorAll('.metric-num').forEach((el) => {
    const target = parseFloat(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() { el.textContent = target < 10 ? this.targets()[0].val.toFixed(1) : Math.round(this.targets()[0].val); }
        });
      }
    });
  });

  // Stat bars
  document.querySelectorAll('.stat-fill').forEach((bar) => {
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(bar, { width: bar.dataset.w + '%', duration: 1.6, ease: 'power3.out' });
      }
    });
  });

  // Feature cards stagger in
  ScrollTrigger.create({
    trigger: '#realm-2',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.from('.feat-card', {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out'
      });
    }
  });

  // Orbit cards stagger
  ScrollTrigger.create({
    trigger: '#realm-4',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.from('.orbit-card', {
        scale: 0.6, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'back.out(1.4)'
      });
    }
  });

  // Finale title
  ScrollTrigger.create({
    trigger: '#realm-5',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.from('.finale-h', { y: 80, opacity: 0, duration: 1.4, ease: 'power4.out' });
      gsap.from('.finale-sub',  { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
      gsap.from('.btn-finale',  { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
      gsap.from('.finale-tags span', { y: 15, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.7 });
    }
  });

  // Realm title reveals
  document.querySelectorAll('.realm-h, .panel-h').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out' })
    });
  });

  // Scroll-driven orb distortion + lighting
  ScrollTrigger.create({
    trigger: '#realm-3',
    start: 'top 60%',
    end:   'bottom 40%',
    scrub: 2,
    onUpdate: (self) => {
      amberLight.intensity = 18 + self.progress * 24;
      amberLight.position.x = 3 + self.progress * 1.5;
      bloom.strength = 0.35 + self.progress * 0.25;
    }
  });

  // Finale: environment brightens slightly
  ScrollTrigger.create({
    trigger: '#realm-5',
    start: 'top 70%',
    end:   'center center',
    scrub: 2,
    onUpdate: (self) => {
      renderer.toneMappingExposure = 1.4 + self.progress * 0.4;
      bloom.strength = 0.6 - self.progress * 0.3;
    }
  });
}

/* ====================================================
   COIN 3D HOVER (orbit around cursor in #realm-3)
   ==================================================== */
function initCoinCursorGravity() {
  const coinViewport = document.getElementById('coin-viewport');
  coinViewport.addEventListener('mousemove', (e) => {
    const rect  = coinViewport.getBoundingClientRect();
    const cx    = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const cy    = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    coins.forEach((coin, i) => {
      gsap.to(coin.position, {
        x: coin.position.x + cx * 0.08,
        y: coin.userData.baseY + cy * 0.08,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  });
}

/* ====================================================
   DATA ORBIT — CSS-driven rotation + cursor tilt
   ==================================================== */
function initOrbitCards() {
  const orbitEl = document.getElementById('orbit-system');
  let orbitAngle = 0;

  gsap.ticker.add(() => {
    orbitAngle += 0.12;
    document.querySelectorAll('.orbit-card').forEach((card) => {
      const baseA = parseFloat(card.style.getPropertyValue('--a'));
      card.style.setProperty('--a', (baseA + 0.05) + 'deg');
    });
  });

  orbitEl.addEventListener('mousemove', (e) => {
    const rect = orbitEl.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const cy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    gsap.to(orbitEl, {
      rotateX: -cy * 15,
      rotateY:  cx * 15,
      duration: 0.8,
      ease: 'power2.out',
      transformPerspective: 800
    });
  });
  orbitEl.addEventListener('mouseleave', () => {
    gsap.to(orbitEl, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, 0.5)' });
  });
}

/* ====================================================
   3D CARD TILT — Feature cards
   ==================================================== */
document.querySelectorAll('.feat-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateX: -cy * 12,
      rotateY:  cx * 12,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 600
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
  });
});

/* ====================================================
   RESIZE
   ==================================================== */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

/* ====================================================
   ANIMATION LOOP
   ==================================================== */
const clock = new THREE.Clock();
let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  frame++;

  // Cursor smooth follow
  dotX  += (mouse.x - dotX)  * 0.9;
  dotY  += (mouse.y - dotY)  * 0.9;
  ringX += (mouse.x - ringX) * 0.12;
  ringY += (mouse.y - ringY) * 0.12;
  cursorDot.style.left  = dotX  + 'px';
  cursorDot.style.top   = dotY  + 'px';
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  // Orb shader time + mouse uniforms
  if (orb.material.userData.shader) {
    orb.material.userData.shader.uniforms.uTime.value  = t;
    orb.material.userData.shader.uniforms.uMouse.value.set(mouse.nx, mouse.ny);
  }

  // Slow ambient orb rotation
  orb.rotation.y = t * 0.06;
  orb.rotation.x = Math.sin(t * 0.04) * 0.08;

  // Camera mouse parallax (subtle)
  const parallaxX = mouse.nx * 0.15;
  const parallaxY = mouse.ny * 0.1;
  camera.position.x += (parallaxX - camera.position.x + camStates[0].x) * 0.01;
  camera.position.y += (parallaxY - camera.position.y + camStates[0].y) * 0.01;

  // Look at origin softly
  camera.lookAt(0, 0, 0);

  // Glass planes drift
  glassPlanes.forEach((p, i) => {
    p.rotation.z += 0.0003 * (i % 2 === 0 ? 1 : -1);
    p.position.y += Math.sin(t * 0.2 + i * 1.3) * 0.0005;
  });

  // Shards float + spin
  shards.forEach((s) => {
    s.position.y += Math.sin(t * s.userData.floatSpeed + s.userData.floatOffset) * 0.001;
    s.rotation.y  += s.userData.rotSpeed;
    s.rotation.x  += s.userData.rotSpeed * 0.3;
  });

  // Coins spin + float
  coins.forEach((c, i) => {
    c.rotation.y  += 0.012 * c.userData.speed;
    c.position.y   = c.userData.baseY + Math.sin(t * 0.4 * c.userData.speed + i) * 0.18;
  });

  // Lights subtle pulse
  amberLight.intensity  = 18 + Math.sin(t * 0.5) * 2;
  silverLight.intensity = 12 + Math.sin(t * 0.3 + 1.5) * 1.5;

  // CubeCamera every 4 frames (performance)
  if (frame % 4 === 0) {
    orb.visible = false;
    cubeCamera.position.copy(orb.position);
    cubeCamera.update(renderer, scene);
    orb.visible = true;
  }

  composer.render();
}

/* ====================================================
   INIT
   ==================================================== */
runLoader();
initScrollTriggers();
initCoinCursorGravity();
initOrbitCards();
animate();
