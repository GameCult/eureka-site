// Eureka: a PS1-style world the camera flies through as the page scrolls.
// One timeline owns everything: scroll position -> path parameter u -> camera, organs, staccato lines.
import * as THREE from 'three';
import { shared, framebuffer } from './ps1.js';
import { buildWorld } from './world.js';

const smooth = (x) => x * x * (3 - 2 * x);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PARAMS = new URLSearchParams(location.search);
const DEBUG = PARAMS.has('debug');
const BASE_LINES = 240; // shorter screen side, in rendered pixels

const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' });
} catch (e) {
  canvas.remove(); // no WebGL: the page is still a readable page
  throw e;
}
renderer.setPixelRatio(1);
const fb = framebuffer(renderer);

const world = buildWorld();
const camera = new THREE.PerspectiveCamera(58, 4 / 3, 0.05, 60);
const skyCam = new THREE.PerspectiveCamera(58, 4 / 3, 5, 3000); // shares the camera's rotation, never its position

// ---------- scroll timeline: the single owner of u ----------
const sections = [...document.querySelectorAll('[data-stop]')];
const stopIds = Object.keys(world.U); // insertion order = route order
const U_OF = sections.map(s => world.U[s.dataset.stop]);
{
  const order = sections.map(s => s.dataset.stop).join(',');
  if (order !== stopIds.join(',')) console.error('[eureka] page sections and route stops disagree', { order, stops: stopIds.join(',') });
}
// Framing: push the subject away from the section's text panel. Owned by the DOM (panel side), eased by u.
const SHIFT = sections.map(s => s.classList.contains('hero') ? 0 : s.classList.contains('right') ? -0.2 : 0.18);
function shiftAt(u) {
  for (let i = 0; i < U_OF.length - 1; i++) if (u <= U_OF[i + 1]) {
    const f = (u - U_OF[i]) / (U_OF[i + 1] - U_OF[i] || 1);
    return SHIFT[i] + (SHIFT[i + 1] - SHIFT[i]) * smooth(Math.min(1, Math.max(0, f)));
  }
  return SHIFT[SHIFT.length - 1];
}
const staccatos = [...document.querySelectorAll('.staccato')];
const MOTION = document.documentElement.classList.contains('motion');
let anchors = [];
const measure = () => { anchors = sections.map(s => s.offsetTop + s.offsetHeight / 2 - innerHeight / 2); };
function targetU() {
  const y = scrollY, a = anchors;
  if (y <= a[0]) return U_OF[0];
  for (let i = 0; i < a.length - 1; i++) {
    if (y < a[i + 1]) {
      const f = (y - a[i]) / (a[i + 1] - a[i]);
      const e = REDUCED ? (f < 0.5 ? 0 : 1) : smooth(f); // reduced motion: hold still frames instead of flying
      return U_OF[i] + (U_OF[i + 1] - U_OF[i]) * e;
    }
  }
  return U_OF[U_OF.length - 1];
}

// Staccato: lines slide in, hold, slide out, one at a time; the last one holds.
function updateStaccato() {
  if (!MOTION) return;
  for (const s of staccatos) {
    const lines = s.querySelectorAll('.line'), k = lines.length;
    const p = Math.min(1, Math.max(0, (scrollY - s.offsetTop) / (s.offsetHeight - innerHeight)));
    lines.forEach((el, j) => {
      const local = p * k - j;
      let x = 0, o = 0;
      if ((local >= 0 && local < 1) || (j === k - 1 && local >= 1)) {
        const inT = Math.min(1, local / 0.22), outT = j === k - 1 ? 0 : Math.max(0, (local - 0.78) / 0.22);
        x = (1 - smooth(inT)) * 6 - smooth(outT) * 6; o = smooth(inT) * (1 - smooth(outT));
      }
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateX(${x.toFixed(2)}vw)`;
    });
  }
}

// ---------- sizing ----------
function resize() {
  const aspect = innerWidth / innerHeight;
  const h = aspect >= 1 ? BASE_LINES : Math.round(BASE_LINES / aspect);
  const w = aspect >= 1 ? Math.round(BASE_LINES * aspect) : BASE_LINES;
  renderer.setSize(w, h, false); fb.setSize(w, h);
  shared.uRes.value.set(w, h);
  for (const c of [camera, skyCam]) { c.aspect = aspect; c.updateProjectionMatrix(); }
  measure();
}
addEventListener('resize', resize);
resize();
let u = targetU();
addEventListener('load', () => {
  measure(); // fonts shift layout
  // Dev probe: ?wp=N (fractional ok) jumps straight to a section's stop, for headless captures.
  const wp = parseFloat(PARAMS.get('wp'));
  if (!Number.isNaN(wp)) {
    const i = Math.min(Math.floor(wp), anchors.length - 1), f = wp - i;
    scrollTo(0, anchors[i] + (i + 1 < anchors.length ? (anchors[i + 1] - anchors[i]) * f : 0));
    u = targetU();
  }
});

// ---------- frame ----------
const probeEl = document.getElementById('probe');
if (DEBUG) probeEl.hidden = false;
const LIGHT = new THREE.Vector3(0.35, 1, 0.55).normalize();
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const W = world.U;
const ctx = {
  u: 0, end: 0,
  near(id, width = 0.02) { return 1 - clamp01(Math.abs(ctx.u - W[id]) / width); },
};
let last = performance.now(), fps = 60;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  fps += (1 / Math.max(dt, 1e-3) - fps) * 0.05;
  const t = now / 1000;
  shared.uTime.value = t;

  const tu = targetU();
  u = REDUCED ? tu : u + (tu - u) * (1 - Math.exp(-dt * 5));
  camera.position.copy(world.posCurve.getPoint(u));
  camera.lookAt(world.lookCurve.getPoint(u));
  camera.updateMatrixWorld();
  skyCam.quaternion.copy(camera.quaternion);
  const { x: rw, y: rh } = shared.uRes.value, shift = rw >= rh ? shiftAt(u) : 0;
  for (const c of [camera, skyCam]) c.setViewOffset(rw, rh, -shift * rw, 0, rw, rh);
  shared.uLightDir.value.copy(LIGHT).transformDirection(camera.matrixWorldInverse);

  ctx.u = u;
  ctx.end = clamp01((u - W.open) / (W.home - W.open));
  shared.uEnd.value = ctx.end;
  shared.uProbe.value = clamp01((u - W.prompts) / (W.mutation - W.prompts));
  for (const a of world.anims) a(t, ctx);
  world.skyUpdate(t, u, camera.position.y);

  updateStaccato();
  fb.render(world.sky, skyCam, world.scene, camera);

  if (DEBUG) {
    const sec = anchors.reduce((best, a, i) => Math.abs(a - scrollY) < Math.abs(anchors[best] - scrollY) ? i : best, 0);
    const p = camera.position;
    probeEl.textContent = `u ${u.toFixed(3)} -> ${tu.toFixed(3)}\nstop ${sections[sec]?.dataset.stop}  probe ${shared.uProbe.value.toFixed(2)} end ${ctx.end.toFixed(2)}\ncam ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p.z.toFixed(1)}\nres ${shared.uRes.value.x}x${shared.uRes.value.y}  ${fps.toFixed(0)} fps\nmotion ${MOTION} reduced ${REDUCED}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
