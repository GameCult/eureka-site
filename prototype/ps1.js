// PS1 rendering kit: one material, the framebuffer dither, low-res textures, geometry helpers.
import * as THREE from 'three';

THREE.ColorManagement.enabled = false; // raw sRGB values end to end; the PS1 had no colour management either

// Brand tokens, plus colours the brand does not define: the mascot's greens.
// Organ colours come from Aquarium's visual language and live with the organs.
export const C = {
  ground: 0x07111a, panel: 0x16212c, accent: 0xff8a2a,
  green: 0x4dff88, greenDim: 0x1f6a45,
};

// Uniforms every PS1 material shares by reference.
export const shared = {
  uRes: { value: new THREE.Vector2(320, 240) },
  uLightDir: { value: new THREE.Vector3() },
  uFogColor: { value: new THREE.Color(C.ground) },
  uFogNear: { value: 6 },
  uFogFar: { value: 38 },
  uTime: { value: 0 },
  uProbe: { value: 0 }, // Soul's probe phase in the lattice
  uEnd: { value: 0 },   // the return to the hall
  uAlt: { value: new THREE.Color(C.accent) },
};

const VERT = /* glsl */`
uniform vec2 uRes; uniform vec3 uLightDir; uniform float uFogNear, uFogFar, uFogMax; uniform vec3 uRim;
varying vec2 vUv; varying float vW; varying vec3 vLight; varying float vFog; varying vec3 vCol; varying vec3 vRimC;
#ifdef NODES
attribute float aSeed; varying float vSeed;
#endif
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec4 clip = projectionMatrix * mv;
  // PS1 GTE: no sub-pixel precision. Snap projected vertices to the low-res pixel grid.
  if (clip.w > 0.05) {
    vec2 h = uRes * 0.5;
    clip.xy = floor(clip.xy / clip.w * h + 0.5) / h * clip.w;
  }
  gl_Position = clip;
#ifdef USE_TEX
  // Affine texturing: pre-multiply by w so the GPU's perspective correction cancels out.
  vUv = uv * clip.w; vW = clip.w;
#endif
#if !defined(EMISSIVE) || defined(RIM)
  vec3 n = normalize(normalMatrix * normal);
#endif
#ifdef EMISSIVE
  vLight = vec3(1.0);
#else
  vLight = vec3(0.30, 0.34, 0.42) + vec3(0.95, 0.9, 0.82) * max(dot(n, uLightDir), 0.0); // per-vertex (Gouraud)
#endif
#ifdef RIM
  vRimC = uRim * pow(1.0 - abs(dot(n, normalize(-mv.xyz))), 2.0); // Fresnel, per vertex
#else
  vRimC = vec3(0.0);
#endif
#ifdef USE_COLOR
  vCol = color;
#else
  vCol = vec3(1.0);
#endif
  vFog = min(smoothstep(uFogNear, uFogFar, -mv.z), uFogMax);
#ifdef NODES
  vSeed = aSeed;
#endif
}`;

const FRAG = /* glsl */`
uniform sampler2D uMap; uniform vec3 uColor, uFogColor, uAlt; uniform float uTime, uProbe, uEnd, uAlpha;
varying vec2 vUv; varying float vW; varying vec3 vLight; varying float vFog; varying vec3 vCol; varying vec3 vRimC;
#ifdef NODES
varying float vSeed;
#endif
void main() {
  vec4 c = vec4(uColor * vCol, 1.0);
#ifdef USE_TEX
  vec4 t = texture2D(uMap, vUv / vW);
  #ifdef ALPHA_TEST
  if (t.a < 0.5) discard;
  #endif
  c *= t;
#endif
#ifdef NODES
  // Soul's probes: as uProbe rises, nodes flip from green to accent and flicker.
  float hit = step(vSeed, uProbe);
  float fl = step(0.5, fract(sin(floor(uTime * 9.0) + vSeed * 91.7) * 43758.5));
  c.rgb = mix(c.rgb, uAlt, hit) * mix(1.0, 0.5 + 0.5 * fl, hit);
#endif
#ifdef CELLS
  // On the way back up, a scatter of the wall's green checks has been re-graded.
  vec2 cell = floor(vUv / vW);
  float h = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
  c.rgb = mix(c.rgb, uAlt * dot(c.rgb, vec3(0.3, 0.59, 0.11)) * 2.4, step(h, uEnd * 0.45));
#endif
  c.rgb = c.rgb * vLight + vRimC;
  gl_FragColor = vec4(mix(c.rgb, uFogColor, vFog), uAlpha);
}`;

/**
 * The one PS1 material. Options switch shader features by define.
 * alpha < 1 gives PS1-style semi-transparency (no depth write).
 */
export function ps1({
  map = null, color = 0xffffff, emissive = false, alphaTest = false, nodes = false, cells = false,
  rim = null, alpha = 1, vcolor = false, fogMax = 1, side = THREE.FrontSide,
} = {}) {
  const defines = {};
  if (map) defines.USE_TEX = '';
  if (emissive) defines.EMISSIVE = '';
  if (alphaTest) defines.ALPHA_TEST = '';
  if (nodes) defines.NODES = '';
  if (cells) defines.CELLS = '';
  if (rim !== null) defines.RIM = '';
  return new THREE.ShaderMaterial({
    defines, side, vertexColors: vcolor, vertexShader: VERT, fragmentShader: FRAG,
    transparent: alpha < 1, depthWrite: alpha >= 1,
    uniforms: {
      ...shared,
      uMap: { value: map }, uColor: { value: new THREE.Color(color) },
      uRim: { value: new THREE.Color(rim ?? 0) }, uAlpha: { value: alpha }, uFogMax: { value: fogMax },
    },
  });
}

/** PS1 framebuffer: sky pass, world pass, then 15-bit colour with the console's 4x4 ordered dither. */
export function framebuffer(renderer) {
  const rt = new THREE.WebGLRenderTarget(320, 240, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: { tScene: { value: rt.texture } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D tScene; varying vec2 vUv;
      const mat4 D = mat4(-4.,0.,-3.,1., 2.,-2.,3.,-1., -3.,1.,-4.,0., 3.,-1.,2.,-2.);
      void main() {
        vec3 c = texture2D(tScene, vUv).rgb * 255.0;
        ivec2 p = ivec2(mod(gl_FragCoord.xy, 4.0));
        c = clamp(c + D[p.x][p.y], 0.0, 255.0);
        gl_FragColor = vec4(floor(c / 8.0) * 8.0 / 255.0, 1.0);
      }`,
    depthTest: false, depthWrite: false,
  }));
  const postScene = new THREE.Scene(); postScene.add(quad);
  const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  renderer.setClearColor(C.ground, 1);
  return {
    setSize(w, h) { rt.setSize(w, h); },
    render(sky, skyCam, scene, camera) {
      renderer.setRenderTarget(rt);
      renderer.autoClear = true; renderer.render(sky, skyCam);
      renderer.autoClear = false; renderer.clearDepth(); renderer.render(scene, camera);
      renderer.autoClear = true;
      renderer.setRenderTarget(null); renderer.render(postScene, postCam);
    },
  };
}

// ---------- textures ----------
export function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export function canvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; draw(g, w, h);
  return c;
}
export function texOf(c, repeat = false) {
  const t = new THREE.CanvasTexture(c);
  t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; // the PS1 had no mipmaps
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
export const tex = (w, h, draw, repeat = false) => texOf(canvas(w, h, draw), repeat);

export function noise(g, w, h, base, spread, seed) {
  const r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < w * h / 3; i++) {
    const v = (r() - 0.5) * spread; g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`;
    g.fillRect(r() * w | 0, r() * h | 0, 1, 1);
  }
}

// ---------- geometry ----------
/** Flat-shaded copy: the PS1 look for faceted solids. */
export function flat(geo) { const g = geo.index ? geo.toNonIndexed() : geo; g.computeVertexNormals(); return g; }

/** Floor of square tiles at height y. Each tile gets its own 0..1 UVs, which keeps affine warp per tile. */
export function tiles(x0, z0, nx, nz, size, y, keep = () => true) {
  const pos = [], nor = [], uv = [], idx = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x = x0 + i * size, z = z0 + j * size;
    if (!keep(x, z)) continue;
    const b = pos.length / 3;
    pos.push(x, y, z, x + size, y, z, x + size, y, z + size, x, y, z + size);
    nor.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
    uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    idx.push(b, b + 2, b + 1, b, b + 3, b + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return geo;
}

/** Bake many (geometry, matrix) pairs into one draw call. Keeps position, normal and uv. */
export function merge(parts) {
  const out = { position: [], normal: [], uv: [] };
  const m3 = new THREE.Matrix3(), v = new THREE.Vector3();
  for (const [geo, mat] of parts) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    m3.getNormalMatrix(mat);
    const p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(mat); out.position.push(v.x, v.y, v.z);
      v.fromBufferAttribute(n, i).applyMatrix3(m3).normalize(); out.normal.push(v.x, v.y, v.z);
      out.uv.push(t ? t.getX(i) : 0, t ? t.getY(i) : 0);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(out.position, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(out.normal, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(out.uv, 2));
  return geo;
}

export const mat4 = (x, y, z, ry = 0, rx = 0, rz = 0, s = 1) =>
  new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(s, s, s));

/** Line strip geometry from points (for LineSegments pairs, pass pairs). */
export const lineGeo = (pts) => new THREE.BufferGeometry().setFromPoints(pts);

export function circlePts(r, n, y = 0) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)); }
  return pts;
}
