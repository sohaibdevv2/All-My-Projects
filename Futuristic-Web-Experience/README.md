# F·W·E — Futuristic Web Experience

> *Liquid Mirror Intelligence. A cinematic, spatially-aware AI interface built for the future.*

---

![License](https://img.shields.io/badge/license-MIT-white?style=flat-square)
![Three.js](https://img.shields.io/badge/Three.js-r160-silver?style=flat-square&logo=threedotjs)
![GSAP](https://img.shields.io/badge/GSAP-3.12-green?style=flat-square)
![WebGL](https://img.shields.io/badge/WebGL-2.0-orange?style=flat-square)
![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)

---

## What is F·W·E?

**F·W·E** (Futuristic Web Experience) is a cinematic, browser-native 3D intelligence interface — built to push the boundary of what a webpage can feel like.

It is not a dashboard. It is not a landing page template. It is a **spatial experience** — one that reacts to your cursor, responds to your scroll, and remembers how you move through it.

Every surface is a mirror. Every mirror is a mind.

---

## Live Preview

```
Open index.html via any local server.
Recommended: python3 -m http.server 9191
Then visit: http://localhost:9191
```

---

## Design Philosophy

| Principle | Implementation |
|---|---|
| **No lazy particles** | Procedural surface distortion via GLSL noise |
| **Controlled light hierarchy** | One active glow at a time (amber → silver → cyan) |
| **Cinematic scroll** | GSAP ScrollTrigger + Lenis inertia scroll |
| **Tactile depth** | True 3D card tilt, magnetic cursor, spatial parallax |
| **Premium restraint** | Weight 200 typography, minimal color, maximum depth |

---

## Color System

```
Obsidian Black    #050505   — Background void
Titanium Gray     #1a1a1a   — Surface layers
Deep Space Blue   #070d17   — Environment fog
Liquid Silver     #b8c1cc   — Primary text
Soft Frost White  #edf2f7   — Highlights
─────────────────────────────────────────
Amber Energy      #f5a623   — Single active glow
Electric Silver   rgba(184,193,204,0.15)
```

---

## Spatial Realms

The site is divided into five distinct spatial environments, each with its own Three.js camera state, lighting mood, and scroll choreography.

### Realm 0 — Hero
The entry point. Camera sits at `z: 5.5`. A liquid chrome orb floats in space, its surface alive with layered Perlin noise. Mirror shards orbit the periphery. The hero title assembles from nothing.

### Realm 1 — Mirror Intelligence
Two glassmorphism panels emerge from below. Left panel delivers copy. Right panel fires animated metric counters — 99.7% accuracy, 0.3ms response, 847B parameters — triggered by scroll position.

### Realm 2 — Neural Chamber
A centered layout with four feature cards. Each card responds to mouse with true `rotateX/Y` perspective tilt via GSAP. Cards stagger in from below on enter.

### Realm 3 — Holographic Finance
Camera drifts toward `x: 2.5` to face the coin cluster. Four metallic coins — CylinderGeometry with iridescent MeshPhysicalMaterial — float and respond to cursor gravity within the viewport zone. Animated stat bars fill on scroll. Bloom intensity increases in this realm.

### Realm 4 — Spatial Data Vault
Five data cards arranged in a radial CSS orbit. The entire orbit tilts in 3D as the cursor moves. Cards stagger in with `back.out` easing.

### Realm 5 — Infinite Future
The finale. Renderer tone mapping exposure increases. Bloom softens. The environment transitions from obsidian toward near-white — a spatial exhale. Massive weight-200 typography fills the viewport.

---

## Tech Stack

### Rendering
| Library | Version | Purpose |
|---|---|---|
| **Three.js** | r160 | 3D scene, WebGL renderer |
| **EffectComposer** | r160 | Post-processing pipeline |
| **UnrealBloomPass** | r160 | Selective volumetric bloom |
| **Custom ShaderPass** | — | Radial chromatic aberration |

### Animation
| Library | Version | Purpose |
|---|---|---|
| **GSAP** | 3.12.4 | All motion, easing, stagger |
| **ScrollTrigger** | 3.12.4 | Scroll-driven animations |
| **Lenis** | 1.1.14 | Inertia smooth scroll |

### Shaders (Custom GLSL)
| Shader | Type | Effect |
|---|---|---|
| Perlin 3D Noise | Vertex | Liquid surface distortion on orb |
| Chromatic Aberration | Fragment | Radial RGB split post-process |
| Environment Gradient | Fragment | Procedural skybox (no texture file) |

---

## GLSL Architecture

The liquid orb is a `THREE.MeshPhysicalMaterial` extended via `onBeforeCompile`. This preserves Three.js's full PBR pipeline (iridescence, clearcoat, env map) while injecting custom vertex displacement.

```glsl
// Three-octave Perlin noise displacement
float n1 = cnoise(transformed * 1.1 + vec3(uTime * .09, uTime * .07, uTime * .11));
float n2 = cnoise(transformed * 2.5 - vec3(uTime * .05, ...)) * 0.45;
float n3 = cnoise(transformed * 5.0 + vec3(uTime * .03)) * 0.22;
transformed += normal * (n1 + n2 + n3) * 0.14;
```

The three octaves create organic, non-repeating liquid motion — fine detail layered over coarse waves.

---

## Real-Time Reflections

The orb uses a `WebGLCubeRenderTarget` with a `CubeCamera` updated every 4 frames. This gives genuine live reflections of the scene — lights, glass planes, coins — without the cost of every-frame updates.

```js
if (frame % 4 === 0) {
  orb.visible = false;
  cubeCamera.update(renderer, scene);
  orb.visible = true;
}
```

---

## Post-Processing Pipeline

```
RenderPass
    ↓
UnrealBloomPass  (strength: 0.35 → 0.6, threshold: 0.88)
    ↓
ChromaticAberrationPass  (radial, dist² falloff, strength: 0.004)
    ↓
OutputPass  (sRGB color space, ACES filmic tonemapping, exposure: 1.4)
```

---

## Cursor System

- **Dot**: follows mouse at `lerp factor 0.9` — near-instant
- **Ring**: follows at `0.12` — fluid trailing
- **Magnetic**: all `.magnetic` elements pull cursor using `getBoundingClientRect` delta
- **Elastic snap**: elements spring back with `elastic.out(1, 0.5)` on mouseleave
- **Mix-blend-mode: difference** — cursor inverts what's beneath it

---

## Camera Choreography

Each realm has a target camera state. ScrollTrigger scrubs between them:

```js
const camStates = [
  { x:  0,   y: 0,    z: 5.5 },  // Hero
  { x: -0.4, y: 0.3,  z: 5.0 },  // Mirror Intelligence
  { x:  0.6, y: -0.2, z: 4.5 },  // Neural Chamber
  { x:  2.5, y: -0.1, z: 4.8 },  // Finance (toward coins)
  { x:  0,   y: 0.5,  z: 5.2 },  // Data Vault
  { x:  0,   y: 0.2,  z: 6.5 },  // Finale (pull back)
];
```

Mouse parallax is layered on top at `±0.15` units for a living, breathing camera.

---

## File Structure

```
F.W.E/
├── index.html       — Structure, realm sections, importmap
├── style.css        — Full design system, glass panels, typography
├── app.js           — Three.js scene, shaders, GSAP, Lenis, cursor
└── README.md        — This file
```

Zero build tools. Zero bundlers. Zero dependencies to install.

---

## Performance Notes

- Pixel ratio capped at `2` to protect high-DPI mobile
- CubeCamera updates every 4th frame (~15fps reflections, indistinguishable)
- Glass planes use `transmission` material — GPU-accelerated refraction
- Bloom threshold set high (0.88) to fire only on the brightest speculars
- `will-change: transform` on cursor elements to promote to compositor

---

## Typography Scale

```
Hero title      clamp(60px, 10vw, 150px)   weight 200   tracking -0.025em
Realm titles    clamp(54px, 7.5vw, 110px)  weight 200   tracking -0.025em
Finale title    clamp(72px, 13vw, 200px)   weight 200   tracking -0.03em
Panel heads     clamp(36px, 3.5vw, 54px)   weight 200
Body            14–17px                     weight 300
Labels          8–10px, Space Mono          weight 400   tracking 0.30–0.38em
```

Fonts: **Space Grotesk** (display) + **Space Mono** (labels) via Google Fonts.

---

## Glassmorphism System

Not simple CSS blur. Each glass panel uses:

- `backdrop-filter: blur(22px) saturate(1.2)` — multi-layer diffusion
- `linear-gradient` background with three opacity stops — internal depth
- `inset 0 0 0 1px rgba(255,255,255,.04)` — inner border for depth
- Top-edge shimmer via `::before` pseudo-element with horizontal gradient
- Amber radial glow via `::after` on hover — fades in at 0.4s
- `glassShimmer` keyframe — sweeping light reflection on hover

---

## Inspiration

The experience sits psychologically between:

- **Apple** — spatial minimalism
- **Tesla** — industrial futurism
- **OpenAI** — intelligence made visible
- **Nothing** — silence as design
- **BMW** — cinematic motion language

Without copying any of them.

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 110+ | Full |
| Safari 16.4+ | Full |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| Mobile Chrome | Full (touch scroll via Lenis) |

WebGL 2.0 required. `MeshPhysicalMaterial` with `transmission` requires WebGL 2.

---

## License

MIT — use it, build on it, make it yours.

---

<div align="center">

**F·W·E** &nbsp;·&nbsp; Futuristic Web Experience &nbsp;·&nbsp; Liquid Mirror Intelligence

*The mirror has no edges.*

</div>
