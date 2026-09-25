// The world the camera flies through, and the path it flies along.
// Route: hall -> hatch + shaft -> Eureka's organ chamber -> lattice -> specimen gallery
//        -> archive -> Epiphany's chamber -> second shaft -> back to the hall.
import * as THREE from 'three';
import { C, ps1, rng, canvas, texOf, tex, noise, flat, tiles, merge, mat4, lineGeo, circlePts } from './ps1.js';
import * as O from './organs.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- textures ----------
const tabletCanvas = canvas(80, 96, (g, w, h) => {
  noise(g, w, h, '#3a4757', 0.25, 3);
  g.textAlign = 'center'; g.font = 'bold 17px Georgia, serif';
  [['ALL', 34], ['TESTS', 54], ['PASSING', 74]].forEach(([s, y]) => {
    g.fillStyle = '#56657a'; g.fillText(s, w / 2 + 1, y + 1);
    g.fillStyle = '#141c26'; g.fillText(s, w / 2, y);
  });
  g.strokeStyle = '#05090d'; g.lineWidth = 2; g.beginPath();
  [[42, 0], [38, 14], [43, 26], [37, 40], [42, 55], [36, 70], [41, 84], [39, 96]].forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
  g.stroke();
});
const half = (x0) => texOf(canvas(40, 96, (g) => g.drawImage(tabletCanvas, x0, 0, 40, 96, 0, 0, 40, 96)));

const T = {
  stone: tex(32, 32, (g, w, h) => noise(g, w, h, '#2b3746', 0.25, 1), true),
  tile: tex(32, 32, (g, w, h) => { noise(g, w, h, '#1b2632', 0.22, 2); g.fillStyle = '#0d151d'; g.fillRect(0, 0, w, 1); g.fillRect(0, 0, 1, h); }, true),
  grid: tex(32, 32, (g, w, h) => { noise(g, w, h, '#0e1a20', 0.18, 9); g.fillStyle = '#1b4a48'; g.fillRect(0, 0, w, 1); g.fillRect(0, 0, 1, h); }, true),
  tabletL: half(0), tabletR: half(40),
  checks: tex(32, 32, (g, w, h) => {
    g.fillStyle = '#081510'; g.fillRect(0, 0, w, h); g.fillStyle = '#12301f'; g.fillRect(3, 3, w - 6, h - 6);
    g.strokeStyle = '#4dff88'; g.lineWidth = 3; g.beginPath(); g.moveTo(9, 17); g.lineTo(14, 22); g.lineTo(24, 10); g.stroke();
  }, true),
  hatch: tex(64, 64, (g, w, h) => {
    noise(g, w, h, '#3c4756', 0.3, 4);
    g.fillStyle = '#1a222c'; [[4, 4], [56, 4], [4, 56], [56, 56]].forEach(([x, y]) => g.fillRect(x, y, 4, 4));
    g.fillStyle = '#3fd77a'; g.font = 'bold 15px monospace'; g.textAlign = 'center'; g.fillText('GREEN', 32, 37);
  }),
  shaft: tex(32, 32, (g, w, h) => { noise(g, w, h, '#0f1f19', 0.25, 5); g.fillStyle = '#2c4a3a'; g.fillRect(6, 14, 20, 2); }, true),
  cabinet: tex(96, 128, (g, w, h) => {
    noise(g, w, h, '#1a1410', 0.2, 6); g.strokeStyle = '#5a4130'; g.lineWidth = 2;
    for (let i = 0; i <= 3; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.stroke(); }
    for (let j = 0; j <= 4; j++) { g.beginPath(); g.moveTo(0, j * 32); g.lineTo(w, j * 32); g.stroke(); }
    g.fillStyle = '#b8a888'; for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) g.fillRect(i * 32 + 9, j * 32 + 26, 14, 3);
  }),
  wood: tex(32, 32, (g, w, h) => { noise(g, w, h, '#3a291c', 0.2, 12); g.fillStyle = '#2a1d14'; for (let y = 3; y < h; y += 7) g.fillRect(0, y, w, 1); }, true),
  slab: tex(16, 32, (g, w, h) => { noise(g, w, h, '#4a5666', 0.25, 13); g.fillStyle = '#232c38'; for (let y = 6; y < 28; y += 4) g.fillRect(3, y, 10 - (y % 3) * 2, 1); }),
  survived: tex(64, 12, (g, w) => { g.fillStyle = '#1a0f07'; g.fillRect(0, 0, w, 12); g.fillStyle = '#ff8a2a'; g.font = 'bold 9px monospace'; g.textAlign = 'center'; g.fillText('SURVIVED', w / 2, 9); }),
};

function bugTex(seed, bodyCol, legCol) {
  const r = rng(seed);
  return tex(32, 32, (g) => {
    const len = 6 + r() * 4, wid = 3 + r() * 2.5, legs = r() < 0.3 ? 4 : 3, spread = 8 + r() * 5;
    g.strokeStyle = legCol; g.lineWidth = 1;
    for (let k = 0; k < legs; k++) for (const s of [-1, 1]) {
      const y = 16 - len * 0.5 + (k + 0.5) * len / legs;
      g.beginPath(); g.moveTo(16, y); g.lineTo(16 + s * spread * 0.7, y + (y - 16) * 0.6 - 2); g.lineTo(16 + s * spread, y + (y - 16)); g.stroke();
    }
    g.beginPath(); g.moveTo(15, 16 - len); g.lineTo(11 - r() * 3, 3); g.moveTo(17, 16 - len); g.lineTo(21 + r() * 3, 3); g.stroke();
    if (r() < 0.4) { g.fillStyle = 'rgba(190,220,240,0.55)'; g.beginPath(); g.ellipse(11, 17, 5, 8, -0.4, 0, 7); g.ellipse(21, 17, 5, 8, 0.4, 0, 7); g.fill(); }
    g.fillStyle = bodyCol; g.beginPath(); g.ellipse(16, 17, wid, len, 0, 0, 7); g.fill();
    g.fillStyle = '#d6e0ea'; g.fillRect(15, 17 - len * 0.6, 2, len * 0.5);
  });
}
function labelTex(a, b) {
  return tex(128, 24, (g, w) => {
    g.fillStyle = '#1b1712'; g.fillRect(0, 0, w, 24); g.fillStyle = '#c9b48a'; g.fillRect(0, 0, w, 1); g.fillRect(0, 23, w, 1);
    g.font = 'bold 9px monospace'; g.fillStyle = '#e9dcc0'; g.fillText(a, 4, 10); g.fillStyle = '#ff8a2a'; g.fillText(b, 4, 20);
  });
}

// ---------- the route: stops pin page sections; vias shape the flight between them ----------
const OC = V(0, -17, -5);  // Eureka's organ chamber, Self at the centre
const EC = V(20, -49, 4);  // Epiphany's chamber
const R_EUREKA = 6, R_EPIPHANY = 9, ORGAN_Y = -16.8;
const orbit = (c, deg, r, y) => { const a = deg * Math.PI / 180; return V(c.x + Math.cos(a) * r, y, c.z - Math.sin(a) * r); };
const org = Object.fromEntries(['imagination', 'hands', 'soul', 'life'].map(id => [id, O.slot(OC, id, R_EUREKA).setY(ORGAN_Y)]));
const up = (v, d = 0.3) => v.clone().setY(v.y + d);

export const ROUTE = [
  { id: 'hero',          p: V(5.5, 4, 13),             l: V(-2.8, 2.5, 0) },
  { id: 'reassuring',    p: V(3.2, 2.4, 8.8),          l: V(0, 0.6, 4) },
  { id: 'green',         p: V(-0.4, 4.2, 4.9),         l: V(-0.4, -6, 3.7) },
  { id: 'epiphany',      p: V(-0.4, -3, 4.1),          l: V(-0.3, -13, 3.4) },
  { id: 'sister',        p: V(-0.4, -9, 4.0),          l: V(-0.2, -18, 3.0) },
  { id: 'faculties',     p: V(-0.3, -12.4, 4.4),       l: V(0, -17.5, -4) },
  {                      p: orbit(OC, 200, 8.2, -15.5), l: V(-2, -16.8, -6) },
  { id: 'imagination',   p: orbit(OC, 135, 7.8, -15.8), l: up(org.imagination) },
  {                      p: orbit(OC, 190, 8.4, -15.8), l: OC.clone() },
  { id: 'hands',         p: orbit(OC, 250, 7.5, -15.6), l: org.hands },
  { id: 'soul',          p: orbit(OC, 330, 7.5, -15.6), l: org.soul },
  { id: 'self',          p: orbit(OC, 20, 3.3, -14.6),  l: up(OC, 0.2) },
  { id: 'life',          p: orbit(OC, 80, 7, -15.8),    l: org.life },
  {                      p: orbit(OC, 15, 8.6, -15),    l: OC.clone() },
  { id: 'operator',      p: V(2.2, -14.3, 5.5),        l: V(0, -16.6, -5) },
  {                      p: V(9.5, -15, -13),          l: V(3, -26, -22) },
  { id: 'prompts',       p: V(5, -24, -17),            l: V(0, -29, -26) },
  { id: 'mutation',      p: V(-4, -29.5, -23.5),       l: V(1, -32, -31) },
  {                      p: V(0, -35, -33),            l: V(-4, -37, -44) },
  { id: 'campaign',      p: V(3, -37, -45),            l: V(-3.4, -37.4, -45) },
  { id: 'case-drop',     p: V(9.4, -37.6, -44.2),      l: V(9, -38.3, -48.4) },
  { id: 'case-uaf',      p: V(15.4, -37.6, -45.8),     l: V(15, -38.3, -41.6) },
  { id: 'case-leak',     p: V(21.4, -37.6, -44.2),     l: V(21, -38.3, -48.4) },
  { id: 'case-int',      p: V(27.4, -37.6, -45.8),     l: V(27, -38.3, -41.6) },
  { id: 'case-exec',     p: V(33.4, -37.6, -44.2),     l: V(33, -38.3, -48.4) },
  { id: 'pattern',       p: V(37, -37, -45),           l: V(41, -37.5, -38) },
  { id: 'bodycount',     p: V(41, -37.2, -34),         l: V(38.5, -37.5, -28) },
  { id: 'expense',       p: V(41, -36.8, -22),         l: V(44, -37, -16) },
  {                      p: V(41, -38.5, -6),          l: V(26, -48, 2) },
  { id: 'sisters',       p: V(32.5, -45, 8),           l: V(20, -49, 3) },
  { id: 'open',          p: V(12, -45.5, 14.5),        l: V(21, -49, 2) },
  {                      p: V(19.6, -43.5, 4.4),       l: V(20, -20, 3.8) },
  {                      p: V(20.2, -12, 4.1),         l: V(20.2, 10, 3.8) },
  {                      p: V(20.3, 1.5, 4.2),         l: V(12, 2.5, 1) },
  { id: 'home',          p: V(7.8, 3.3, 8.2),          l: V(0.6, 2.0, -0.6) },
];

export function buildWorld() {
  const scene = new THREE.Scene();
  const anims = []; // (t, ctx) => void; ctx = { u, near(id, width) }
  const posCurve = new THREE.CatmullRomCurve3(ROUTE.map(k => k.p), false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(ROUTE.map(k => k.l), false, 'centripetal');
  const U = Object.fromEntries(ROUTE.flatMap((k, i) => k.id ? [[k.id, i / (ROUTE.length - 1)]] : []));
  const pathSamples = posCurve.getSpacedPoints(600);
  const stone = ps1({ map: T.stone });

  // ---------- the hall ----------
  scene.add(new THREE.Mesh(tiles(-21, -21, 21, 21, 2, 0, (x, z) => !(z === 3 && (x === -1 || x === 19))), ps1({ map: T.tile })));
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(5, 0.6, 2.2, 3, 1, 2), stone); plinth.position.set(0, 0.3, -0.4); scene.add(plinth);
  const tabletPivot = new THREE.Group(); tabletPivot.position.set(0, 0.6, -0.4); tabletPivot.rotation.x = -0.15; scene.add(tabletPivot);
  const halves = [[T.tabletL, -0.9, 1], [T.tabletR, 0.9, -1]].map(([map, x, s]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4.4, 0.5, 2, 4, 1), [stone, stone, stone, stone, ps1({ map }), stone]);
    m.position.set(x, 2.2, 0); tabletPivot.add(m); return { m, x, s };
  });
  anims.push((t, ctx) => { // on the way back up the monument has split along its crack
    const e = THREE.MathUtils.smoothstep(ctx.end, 0, 1);
    halves.forEach(({ m, x, s }) => { m.position.x = x - s * e * 0.55; m.rotation.z = s * e * 0.2; m.rotation.y = -s * e * 0.15; });
  });

  const wallGeo = new THREE.PlaneGeometry(22, 11, 11, 5);
  wallGeo.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? 5 : 11); });
  const wall = new THREE.Mesh(wallGeo, ps1({ map: T.checks, emissive: true, cells: true }));
  wall.position.set(0, 5.5, -9); scene.add(wall);

  const metal = ps1({ map: T.stone, color: 0x8899aa });
  const hatchMesh = () => new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 2, 2, 1, 2), [metal, metal, ps1({ map: T.hatch }), metal, metal, metal]);
  const hinge = new THREE.Group(); hinge.position.set(1, 0.02, 4); hinge.rotation.z = -1.0; scene.add(hinge);
  const hatch = hatchMesh(); hatch.position.set(-1, 0.05, 0); hinge.add(hatch);
  const lid = hatchMesh(); lid.position.set(22.3, 0.06, 4.6); lid.rotation.y = 0.4; scene.add(lid); // the second hatch, lid off

  const shaftMat = ps1({ map: T.shaft, emissive: true, side: THREE.DoubleSide });
  const shaft = (cx, top, depth) => {
    for (const [x, z, ry] of [[cx - 1, 4, Math.PI / 2], [cx + 1, 4, Math.PI / 2], [cx, 3, 0], [cx, 5, 0]]) {
      const g = new THREE.PlaneGeometry(2, depth, 2, Math.round(depth));
      g.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? depth / 2 : 1); });
      const m = new THREE.Mesh(g, shaftMat); m.position.set(x, top - depth / 2, z); m.rotation.y = ry; scene.add(m);
    }
  };
  shaft(0, 0, 12);
  shaft(20, 0, 40);

  // ---------- organ chambers ----------
  const shadowMat = ps1({ color: 0x000000, emissive: true, alpha: 0.45 });
  function chamber(center, floorY, radius, pillarR, pillars, pillarH) {
    const n = Math.ceil(radius);
    scene.add(new THREE.Mesh(tiles(center.x - n, center.z - n, n, n, 2, floorY,
      (x, z) => Math.hypot(x + 1 - center.x, z + 1 - center.z) < radius), ps1({ map: T.grid })));
    const parts = [];
    for (let i = 0; i < pillars; i++) {
      const a = (i + 0.5) / pillars * Math.PI * 2;
      parts.push([new THREE.BoxGeometry(0.9, pillarH, 0.9, 1, 3, 1), mat4(center.x + Math.cos(a) * pillarR, floorY + pillarH / 2, center.z + Math.sin(a) * pillarR, -a)]);
    }
    scene.add(new THREE.Mesh(merge(parts), stone));
  }
  function place(build, pos, id, scale, floorY) {
    const o = build(); o.group.position.copy(pos); o.group.scale.setScalar(scale); scene.add(o.group);
    const sh = new THREE.Mesh(new THREE.CircleGeometry(0.9 * scale, 8), shadowMat);
    sh.rotation.x = -Math.PI / 2; sh.position.set(pos.x, floorY + 0.03, pos.z); scene.add(sh);
    const phase = pos.x * 1.7 + pos.z;
    anims.push((t, ctx) => { o.group.position.y = pos.y + Math.sin(t * 1.3 + phase) * 0.12 * scale; o.update(t, ctx.near(id)); });
    return o;
  }

  // Eureka: five organs lit. The sixth seat, where Epiphany keeps Face, is the viewer's.
  chamber(OC, -19, 11, 11.5, 8, 7);
  const guide = new THREE.Line(lineGeo(circlePts(0.78 * R_EUREKA, 40)), ps1({ color: 0x1d5a5a, emissive: true }));
  guide.position.set(OC.x, -18.95, OC.z); scene.add(guide);
  place(O.self, up(OC, 0.4 + ORGAN_Y - OC.y), 'self', 1, -19);
  for (const id of ['imagination', 'hands', 'soul', 'life']) place(O[id], org[id], id, 1, -19);

  // Epiphany: all eight organs, in scaffolding.
  chamber(EC, -52, 14, 14.5, 10, 12);
  const toViewer = V(32.5 - EC.x, 0, 8 - EC.z).normalize();
  const eslots = {
    self: up(EC, 0.4), face: EC.clone().addScaledVector(toViewer, 0.58 * R_EPIPHANY),
    ...Object.fromEntries(['imagination', 'eyes', 'body', 'hands', 'soul', 'life'].map(id => [id, O.slot(EC, id, R_EPIPHANY)])),
  };
  for (const [id, pos] of Object.entries(eslots)) {
    place(O[id], pos, 'sisters', 1.3, -52);
    const big = id === 'self', cage = O.scaffold(big ? 6.4 : 3.6, big ? 6.5 : 4.6);
    cage.position.set(pos.x, -52, pos.z); scene.add(cage);
  }
  {
    const tops = [];
    for (let i = 0; i < 10; i++) {
      const a = (i + 0.5) / 10 * Math.PI * 2, b = (i + 1.5) / 10 * Math.PI * 2;
      tops.push(V(EC.x + Math.cos(a) * 14.5, -40, EC.z + Math.sin(a) * 14.5), V(EC.x + Math.cos(b) * 14.5, -40, EC.z + Math.sin(b) * 14.5));
      tops.push(V(EC.x + Math.cos(a) * 14.5, -40, EC.z + Math.sin(a) * 14.5), V(EC.x + Math.cos(a) * 6, -38, EC.z + Math.sin(a) * 6));
    }
    scene.add(new THREE.LineSegments(lineGeo(tops), ps1({ color: 0x3c4a58, emissive: true })));
  }

  // ---------- the lattice: green nodes wired together, kept clear of the flight path ----------
  {
    const r = rng(11), nodes = [];
    for (let x = -10; x <= 10; x += 3.2) for (let y = -23; y >= -36; y -= 3.2) for (let z = -15; z >= -34; z -= 3.2) {
      const p = V(x + (r() - .5) * 1.6, y + (r() - .5) * 1.6, z + (r() - .5) * 1.6);
      if (p.y > -22.5 || pathSamples.some(s => s.distanceToSquared(p) < 2.6)) continue;
      nodes.push(p);
    }
    const octa = new THREE.OctahedronGeometry(0.28), pos = [], seed = [];
    for (const n of nodes) {
      const s = r() * 1.15; // a few (seed > 1) never flip: what the probes missed
      for (let i = 0; i < octa.attributes.position.count; i++) {
        pos.push(octa.attributes.position.getX(i) + n.x, octa.attributes.position.getY(i) + n.y, octa.attributes.position.getZ(i) + n.z);
        seed.push(s);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
    scene.add(new THREE.Mesh(g, ps1({ color: C.green, emissive: true, nodes: true })));
    const edges = [];
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++)
      if (nodes[i].distanceTo(nodes[j]) < 4.0 && r() < 0.55) edges.push(nodes[i], nodes[j]);
    scene.add(new THREE.LineSegments(lineGeo(edges), ps1({ color: C.greenDim, emissive: true })));

    // Soul's probes descend with little verdict crystals at their tips.
    const beam = ps1({ color: C.accent, emissive: true }), tipMat = ps1({ color: 0x9fd0ff, emissive: true });
    const probes = [...Array(7)].map(() => {
      const g = new THREE.BoxGeometry(0.08, 1, 0.08); g.translate(0, -0.5, 0);
      const m = new THREE.Mesh(g, beam); m.position.set((r() - .5) * 16, -21, -17 - r() * 15); scene.add(m);
      const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), tipMat); scene.add(tip);
      return { m, tip, len: 8 + r() * 7 };
    });
    anims.push((t, ctx) => {
      const k = THREE.MathUtils.clamp((ctx.u - U.prompts) / (U.mutation - U.prompts), 0, 1);
      probes.forEach(p => {
        p.m.scale.y = Math.max(0.001, k * p.len);
        p.tip.position.set(p.m.position.x, p.m.position.y - k * p.len, p.m.position.z); p.tip.rotation.y = t;
        p.tip.visible = k > 0.01;
      });
    });
  }

  // ---------- the specimen gallery ----------
  scene.add(new THREE.Mesh(tiles(-6, -50, 22, 5, 2, -40), ps1({ map: T.tile })));
  const wallG = (w, x, z, ry) => {
    const g = new THREE.PlaneGeometry(w, 5, Math.round(w / 2), 3);
    g.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? 2.5 : w / 2); });
    const m = new THREE.Mesh(g, stone); m.position.set(x, -37.5, z); m.rotation.y = ry; scene.add(m);
  };
  wallG(44, 16, -50, 0);
  wallG(32, 22, -40, Math.PI); // the south wall leaves an opening where the camera drops in from the lattice
  {
    // The first campaign's cabinet: twelve pinned mutants, one still moving.
    const cab = new THREE.Group(); cab.position.set(-3.4, -37.4, -45); cab.rotation.y = Math.PI / 2; cab.scale.setScalar(0.52); scene.add(cab);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(7.4, 9.4, 0.6, 3, 4, 1), ps1({ map: T.cabinet })); frame.position.z = -0.4; cab.add(frame);
    const bug = bugTex(1, '#5d6b78', '#8795a3'), bugMat = ps1({ map: bug, alphaTest: true, emissive: true, color: 0xcfd8e2 });
    let survivor;
    [-2.4, 0, 2.4].forEach((cx, i) => [3.3, 1.1, -1.1, -3.3].forEach((cy, j) => {
      const live = i === 1 && j === 1;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), live ? ps1({ map: bug, alphaTest: true, emissive: true, color: C.accent }) : bugMat);
      m.position.set(cx, cy + 0.15, -0.05); cab.add(m);
      if (live) {
        survivor = m;
        const tag = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.36), ps1({ map: T.survived, emissive: true })); tag.position.set(cx, cy - 0.85, -0.04); cab.add(tag);
      }
    }));
    anims.push((t) => { survivor.rotation.z = Math.sin(t * 11) * 0.12 * (Math.sin(t * 1.4) > 0.3 ? 1 : 0); });
  }
  const glass = ps1({ color: 0x9fc4e8, rim: 0xbfe3ff, alpha: 0.22, side: THREE.DoubleSide });
  const brass = ps1({ color: 0xb08a4a, emissive: true });
  const CASES = [
    ['case-drop', 9, 'north', 11, '#6a5a78', '#a795c3', 'No.01 HANDSHAKE EVICTION', 'SUITE GREEN  SOUL CAUGHT'],
    ['case-uaf', 15, 'south', 12, '#78604a', '#c3a587', 'No.02 USE AFTER FREE', 'SUITE GREEN  SOUL CAUGHT'],
    ['case-leak', 21, 'north', 13, '#4a7868', '#87c3ad', 'No.03 53 BYTES A CALL', 'SUITE GREEN  SOUL CAUGHT'],
    ['case-int', 27, 'south', 14, '#78784a', '#c3c387', 'No.04 FRACTION IN INT', 'SUITE GREEN  SOUL CAUGHT'],
    ['case-exec', 33, 'north', 15, '#4a5a78', '#8799c3', 'No.05 SHARED SLOT', 'SUITE GREEN  SOUL CAUGHT'],
  ];
  for (const [id, x, side, seed, body, leg, l1, l2] of CASES) {
    const g = new THREE.Group(); g.position.set(x, -40, side === 'north' ? -48.4 : -41.6); g.rotation.y = side === 'north' ? 0 : Math.PI; scene.add(g);
    const ped = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.6), stone); ped.position.y = 0.5; g.add(ped);
    const box = new THREE.BoxGeometry(1.5, 1.6, 1.5);
    const gl = new THREE.Mesh(box, glass); gl.position.y = 1.8; g.add(gl);
    const fr = new THREE.LineSegments(new THREE.EdgesGeometry(box), brass); fr.position.y = 1.8; g.add(fr);
    const spec = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), ps1({ map: bugTex(seed, body, leg), alphaTest: true, emissive: true, color: 0xdde6ee }));
    spec.position.y = 1.8; g.add(spec);
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.26), ps1({ map: labelTex(l1, l2), emissive: true })); lab.position.set(0, 0.7, 0.81); g.add(lab);
    anims.push((t, ctx) => { spec.rotation.y = Math.sin(t * 0.7) * 0.25 * ctx.near(id); });
  }

  // ---------- the archive: rules as tablets, each with a body count ----------
  scene.add(new THREE.Mesh(tiles(34, -44, 7, 17, 2, -40), ps1({ map: T.tile })));
  {
    const r = rng(31), woodParts = [], slabParts = [], markParts = [];
    for (const [bx, face] of [[37.4, 1], [44.6, -1]]) for (let z = -40; z <= -14; z += 3.2) {
      woodParts.push([new THREE.BoxGeometry(0.2, 4.6, 3.0), mat4(bx, -37.7, z)]);
      for (let k = 0; k < 4; k++) {
        const py = -39.9 + k * 1.1, px = bx + face * 0.45;
        woodParts.push([new THREE.BoxGeometry(0.8, 0.1, 3.0), mat4(px, py, z)]);
        for (let zz = z - 1.3; zz < z + 1.3; zz += 0.3 + r() * 0.12) {
          const h = 0.5 + r() * 0.35;
          slabParts.push([new THREE.BoxGeometry(0.28, h, 0.2), mat4(px, py + 0.05 + h / 2, zz, 0, 0, (r() - 0.5) * 0.12)]);
          if (r() < 0.06) markParts.push([new THREE.BoxGeometry(0.3, 0.06, 0.22), mat4(px, py + 0.05 + h * 0.8, zz)]);
        }
      }
    }
    scene.add(new THREE.Mesh(merge(woodParts), ps1({ map: T.wood })));
    scene.add(new THREE.Mesh(merge(slabParts), ps1({ map: T.slab })));
    scene.add(new THREE.Mesh(merge(markParts), ps1({ color: C.accent, emissive: true })));
  }

  // ---------- the far plane: GameCult's aperture, a populated megastructure behind the fog ----------
  const { sky, skyUpdate } = aperture();

  return { scene, sky, anims, posCurve, lookCurve, U, skyUpdate };
}

// ---------- the aperture ----------
const BIOMES = [
  ['#1f4a2a', (g, r) => { for (let i = 0; i < 90; i++) { g.fillStyle = r() < .5 ? '#12301b' : '#3f7a3a'; g.fillRect(r() * 64 | 0, r() * 64 | 0, 2, 2); } g.fillStyle = '#dfeff5'; for (let i = 0; i < 4; i++) g.fillRect(r() * 64 | 0, r() * 40 | 0, 1, 10 + r() * 14); }],
  ['#a0602a', (g, r) => { g.fillStyle = '#c98a45'; for (let y = 4; y < 64; y += 9) g.fillRect(0, y, 64, 2); g.fillStyle = '#5a3418'; for (let i = 0; i < 7; i++) { const x = r() * 64, y = r() * 64; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 3, y - 11); g.lineTo(x + 6, y); g.fill(); } }],
  ['#b9ccd8', (g, r) => { g.fillStyle = '#7f9fb8'; for (let i = 0; i < 8; i++) { const x = r() * 64, y = r() * 64; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6, y - 12); g.lineTo(x + 12, y); g.fill(); } g.fillStyle = '#2a3a4a'; for (let i = 0; i < 20; i++) g.fillRect(r() * 64 | 0, r() * 64 | 0, 1, 1); }],
  ['#1e5a52', (g, r) => { g.fillStyle = '#5fd0c0'; for (let i = 0; i < 7; i++) g.fillRect(r() * 64 | 0, 0, 1, 64); g.fillStyle = '#123a33'; for (let i = 0; i < 60; i++) g.fillRect(r() * 64 | 0, r() * 64 | 0, 2, 2); }],
  ['#4a5a4a', (g, r) => { g.fillStyle = '#7a8a7a'; for (let i = 0; i < 8; i++) { const x = r() * 64, y = r() * 64; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 7, y - 13); g.lineTo(x + 14, y); g.fill(); g.fillStyle = '#e8f0f0'; g.fillRect(x + 6, y - 13, 2, 2); g.fillStyle = '#7a8a7a'; } }],
  ['#0b1320', (g, r) => { for (let i = 0; i < 160; i++) { g.fillStyle = r() < .6 ? '#ffb45a' : '#6fe0ff'; g.fillRect(r() * 64 | 0, r() * 64 | 0, 1, 1); } }],
];

function aperture() {
  const sky = new THREE.Scene();
  const R = 230, FOG = 0.62;
  const hull = tex(64, 64, (g, w, h) => {
    const r = rng(41); g.fillStyle = '#0a1420'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#13263a'; for (let i = 0; i < 64; i += 8) { g.fillRect(i, 0, 1, h); g.fillRect(0, i, w, 1); }
    for (let i = 0; i < 70; i++) { g.fillStyle = r() < .55 ? '#ffb45a' : '#6fe0ff'; g.fillRect(r() * 64 | 0, r() * 64 | 0, 1, 1); }
  }, true);
  const root = new THREE.Group(); sky.add(root);
  root.position.copy(V(-0.45, 0.3, -1).normalize().multiplyScalar(560));
  root.lookAt(0, 0, 0); root.rotateX(-0.55); root.rotateY(0.25); // tilted: a structure seen at an angle, not a badge

  const discGeo = new THREE.CircleGeometry(R * 0.96, 28);
  discGeo.attributes.uv.array.forEach((v, i, a) => { a[i] = v * 7; });
  const disc = new THREE.Mesh(discGeo, ps1({ map: hull, emissive: true, fogMax: FOG, side: THREE.DoubleSide })); disc.position.z = -3; root.add(disc);
  const ringGeo = new THREE.TorusGeometry(R, R * 0.06, 4, 48);
  const ring = new THREE.Mesh(ringGeo, ps1({ map: hull, color: 0x8fdcff, emissive: true, fogMax: FOG - 0.12 })); root.add(ring);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(R * 0.92, R * 0.012, 3, 48), ps1({ color: C.accent, emissive: true, fogMax: FOG - 0.1 })); root.add(inner);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.15, R * 0.15, R * 0.05, 8), ps1({ color: 0xffc860, emissive: true, fogMax: FOG - 0.15 }));
  hub.rotation.x = Math.PI / 2; hub.position.z = 6; root.add(hub);
  const coreGlow = new THREE.Mesh(new THREE.IcosahedronGeometry(R * 0.06, 0), ps1({ color: 0xffffff, emissive: true, fogMax: FOG - 0.3 })); coreGlow.position.z = 14; root.add(coreGlow);

  // Six habitat blades on pivots around the rim; rotating them about the pivot opens the iris.
  const N = 18, blades = [];
  BIOMES.forEach(([base, draw], i) => {
    const map = tex(64, 64, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); draw(g, rng(50 + i)); }, true);
    const a0 = i / 6 * Math.PI * 2, pivot = V(Math.cos(a0) * R * 0.95, Math.sin(a0) * R * 0.95, 0);
    const pos = [], uv = [], idx = [], edge = [];
    for (let k = 0; k <= N; k++) {
      const s = k / N, rho = THREE.MathUtils.lerp(R * 0.95, R * 0.14, s), th = a0 + 1.75 * s;
      const c = V(Math.cos(th) * rho, Math.sin(th) * rho, 0);
      const d = V(Math.cos(th + 0.01) * THREE.MathUtils.lerp(R * 0.95, R * 0.14, s + 0.001), Math.sin(th + 0.01) * THREE.MathUtils.lerp(R * 0.95, R * 0.14, s + 0.001), 0).sub(c).normalize();
      const side = V(-d.y, d.x, 0), w = R * (0.2 * (1 - 0.55 * s) + 0.02) * Math.sin(Math.min(1, s * 6 + 0.2) * Math.PI / 2);
      const pa = c.clone().addScaledVector(side, w).sub(pivot), pb = c.clone().addScaledVector(side, -w).sub(pivot);
      pos.push(pa.x, pa.y, 0, pb.x, pb.y, 0); uv.push(s * 3, 0, s * 3, 1);
      edge.push(pa, pb);
      if (k < N) { const b = k * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx);
    const holder = new THREE.Group(); holder.position.copy(pivot).setZ(i * 0.8); root.add(holder);
    holder.add(new THREE.Mesh(geo, ps1({ map, emissive: true, fogMax: FOG, side: THREE.DoubleSide })));
    const rimPts = [];
    for (let k = 0; k < N; k++) rimPts.push(edge[k * 2], edge[k * 2 + 2], edge[k * 2 + 1], edge[k * 2 + 3]);
    holder.add(new THREE.LineSegments(lineGeo(rimPts), ps1({ color: 0x3fa7d6, emissive: true, fogMax: FOG - 0.15 })));
    // Choose the rotation sign that swings the inner tip away from the centre.
    const tip = V(pos[N * 6], pos[N * 6 + 1], 0);
    const out = (sgn) => tip.clone().applyAxisAngle(V(0, 0, 1), sgn * 0.3).add(pivot).length();
    blades.push({ holder, sign: out(1) > out(-1) ? 1 : -1 });
  });

  // Stations in orbit around the rim.
  const r = rng(77), stations = [...Array(16)].map(() => {
    const m = new THREE.Mesh(r() < 0.5 ? new THREE.OctahedronGeometry(R * (0.015 + r() * 0.02), 0) : new THREE.BoxGeometry(R * 0.04, R * 0.012, R * 0.012),
      ps1({ color: r() < 0.5 ? 0xd9c08a : 0x8fb6d0, emissive: true, fogMax: FOG - 0.05 }));
    root.add(m); return { m, a: r() * Math.PI * 2, rad: R * (1.1 + r() * 0.25), sp: (0.02 + r() * 0.04) * (r() < 0.5 ? 1 : -1), z: (r() - 0.5) * R * 0.2 };
  });

  // Underground the aperture fades to a faint presence; it returns in full on the climb out.
  const skyMats = []; root.traverse(o => { if (o.material?.uniforms?.uFogMax) skyMats.push([o.material, o.material.uniforms.uFogMax.value]); });
  const skyUpdate = (t, u, camY) => {
    const vis = 0.3 + 0.7 * THREE.MathUtils.smoothstep(camY, -16, -2);
    for (const [m, base] of skyMats) m.uniforms.uFogMax.value = 1 - (1 - base) * vis;
    const open = 0.2 + 0.75 * u; // the aperture opens as the page goes on
    blades.forEach(b => { b.holder.rotation.z = b.sign * open * 0.62; });
    root.rotateZ(0.00025);
    coreGlow.scale.setScalar(1 + Math.sin(t * 1.1) * 0.12);
    stations.forEach(s => { const a = s.a + t * s.sp; s.m.position.set(Math.cos(a) * s.rad, Math.sin(a) * s.rad, s.z); s.m.rotation.y = t * 0.5; });
  };
  return { sky, skyUpdate };
}
