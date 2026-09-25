// PS1 demakes of the Epiphany organs, after Aquarium's visual language
// (Aquarium/docs/epiphany-agent-sdf-visual-language.md). Each keeps its organ's
// silhouette, palette and motion grammar; the SDF raymarching becomes low-poly.
// Every builder returns { group, update(t, k) } where k in [0,1] is how close the
// camera's scroll position is to that organ's stop (0 far, 1 at the stop).
import * as THREE from 'three';
import { ps1, flat, lineGeo, circlePts } from './ps1.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const lathe = (pts, segs) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), segs);
const lines = (pts, color) => new THREE.Line(lineGeo(pts), ps1({ color, emissive: true }));
const segs = (pts, color) => new THREE.LineSegments(lineGeo(pts), ps1({ color, emissive: true }));

// Self: black void core, one gold band, nested gold orrery rails with gate nodes.
export function self() {
  const group = new THREE.Group();
  const core = new THREE.Mesh(flat(new THREE.IcosahedronGeometry(0.8, 1)), ps1({ color: 0x050608, rim: 0xffc860 }));
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.83, 0.06, 3, 16), ps1({ color: 0xd9a441, rim: 0xfff0b0 }));
  band.rotation.x = Math.PI / 2;
  group.add(core, band);
  const frames = [[Math.PI / 2, 0, 0], [0.25, Math.PI / 2, 0], [0.6, 0.3, Math.PI / 2]];
  const rails = [1.3, 1.65, 2.0].map((r, i) => {
    const frame = new THREE.Group(); frame.rotation.set(...frames[i]);
    const rail = new THREE.Group();
    rail.add(new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 4, 24), ps1({ color: i === 1 ? 0xc8963a : 0xe0b458, rim: 0xffe8a0 })));
    for (let g = 0; g < 4; g++) {
      const gate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), ps1({ color: g === 0 ? 0xfff3c0 : 0xffc450, emissive: true }));
      const a = g / 4 * Math.PI * 2 + i; gate.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      rail.add(gate);
    }
    frame.add(rail); group.add(frame);
    return { frame, rail, speed: [0.35, -0.22, 0.15][i] };
  });
  return {
    group,
    update(t, k) {
      core.scale.setScalar(1 + Math.sin(t * 1.4) * 0.04); // heartbeat
      rails.forEach(({ rail, frame, speed }) => { rail.rotation.z = t * speed; frame.rotation.y += 0.0008; });
      band.material.uniforms.uRim.value.setHex(k > 0.5 ? 0xfff6d0 : 0xffe0a0);
    },
  };
}

// Soul: verdict polyhedron. Translucent facets, white oath core, blue confidence edges, red risk seam.
export function soul() {
  const group = new THREE.Group();
  const solid = new THREE.OctahedronGeometry(1, 0); solid.scale(0.9, 1.3, 0.9);
  const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), ps1({ color: 0xffffff, emissive: true }));
  const facets = new THREE.Mesh(flat(solid.clone()), ps1({ color: 0x9fbfe0, rim: 0xcfe8ff, alpha: 0.5, side: THREE.DoubleSide }));
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(solid), ps1({ color: 0x6fb6ff, emissive: true }));
  const seam = new THREE.Group();
  for (const dy of [-0.03, 0.03]) seam.add(lines([V(0.93, dy, 0), V(0, dy, 0.93), V(-0.93, dy, 0), V(0, dy, -0.93), V(0.93, dy, 0)], 0xff3b3b));
  group.add(coreMesh, facets, edges, seam);
  return {
    group,
    update(t, k) {
      group.rotation.y = t * 0.25;
      seam.scale.y = 1 + k * 6; // risk tightens the seam band as Soul takes the stage
      coreMesh.scale.setScalar(1 + Math.sin(t * 3) * 0.08 * k);
    },
  };
}

// Hands: dark tool-seed with a three-jaw chuck field and a hot forward seam.
export function hands() {
  const group = new THREE.Group();
  const tool = new THREE.Group(); tool.rotation.z = -Math.PI / 2 * 0.85; group.add(tool); // leans along its work direction
  tool.add(new THREE.Mesh(lathe([[0, -1.1], [0.25, -1.0], [0.42, -0.6], [0.46, 0], [0.4, 0.5], [0.24, 0.9], [0.05, 1.12]], 7), ps1({ color: 0x24272d, rim: 0x7a8699 })));
  const edge = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 3, 8), ps1({ color: 0xff6a1a, emissive: true }));
  edge.position.y = 1.12; edge.rotation.x = Math.PI / 2; tool.add(edge);
  const enamel = ps1({ color: 0xc9824a, rim: 0xffd0a0 });
  const jaws = [0, 1, 2].map(i => {
    const around = new THREE.Group(); around.rotation.y = i * Math.PI * 2 / 3; tool.add(around);
    const jaw = new THREE.Group(); jaw.position.set(0.42, 0.35, 0); around.add(jaw);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.9, 0.24), enamel); arm.position.y = 0.45; jaw.add(arm);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.2), enamel); tip.position.set(-0.12, 0.95, 0); tip.rotation.z = 0.7; jaw.add(tip);
    return jaw;
  });
  const sparks = [...Array(6)].map(() => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), ps1({ color: 0xffd08a, emissive: true }));
    tool.add(s); return s;
  });
  return {
    group,
    update(t, k) {
      const open = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.2)) * (0.4 + 0.6 * k);
      jaws.forEach(j => { j.rotation.z = -open; });
      sparks.forEach((s, i) => { // changed-file receipts: quick flecks at the cutting seam that fade
        const ph = (t * 1.7 + i / 6) % 1;
        s.visible = k > 0.2 && ph < 0.6;
        s.position.set(Math.sin(i * 7.1 + t * 3) * 0.35 * ph, 1.2 + ph * 0.6, Math.cos(i * 3.3 + t * 2) * 0.35 * ph);
      });
    },
  };
}

// Imagination: opal seed wrapped by six curling translucent ribbon-sheets with bright rims.
export function imagination() {
  const group = new THREE.Group();
  const seed = new THREE.Mesh(lathe([[0, -0.55], [0.3, -0.45], [0.42, -0.1], [0.38, 0.3], [0.22, 0.6], [0, 0.72]], 8), ps1({ color: 0xf4e8ff, rim: 0x9ff4ff }));
  const calyx = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.45, 6), ps1({ color: 0x3f8f86 }));
  calyx.rotation.x = Math.PI; calyx.position.y = -0.6;
  group.add(seed, calyx);

  const N = 14, ribbons = [];
  const cyan = new THREE.Color(0x7fe8ff), pink = new THREE.Color(0xf0a8ff), gold = new THREE.Color(0xffd27a);
  for (let k = 0; k < 6; k++) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array((N + 1) * 2 * 3), col = [], idx = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N, c = cyan.clone().lerp(s < 0.5 ? pink : gold, Math.abs(s - 0.5) * 2);
      col.push(c.r, c.g, c.b, c.r * 0.8, c.g * 0.8, c.b);
      if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setIndex(idx);
    const sheet = new THREE.Mesh(geo, ps1({ vcolor: true, emissive: true, alpha: 0.5, side: THREE.DoubleSide }));
    const rimGeo = new THREE.BufferGeometry(); rimGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 4 * 3), 3));
    const rim = new THREE.LineSegments(rimGeo, ps1({ color: 0xcffcff, emissive: true }));
    group.add(sheet, rim);
    ribbons.push({ geo, rimGeo, phi: k * Math.PI / 3, sign: k % 2 ? 1 : -1 });
  }
  function write(open) {
    const c = new THREE.Vector3(), side = new THREE.Vector3(), up = V(0, 1, 0);
    for (const r of ribbons) {
      const p = r.geo.attributes.position.array, e = r.rimGeo.attributes.position.array;
      for (let i = 0; i <= N; i++) {
        const s = i / N;
        const rad = 0.3 + 1.5 * open * s * (1 - 0.6 * s * s);          // flare out, then curl back in
        const ang = r.phi + r.sign * 0.9 * s;                             // twist around the seed
        c.set(Math.cos(ang) * rad, -0.35 + 2.1 * s, Math.sin(ang) * rad);
        const tang = V(-Math.sin(ang), 0, Math.cos(ang));
        const curl = r.sign * 1.3 * s;                                    // sheet normal rolls along the blade
        side.copy(tang).multiplyScalar(Math.cos(curl)).addScaledVector(up, Math.sin(curl));
        const w = (0.06 + 0.5 * Math.pow(Math.sin(Math.PI * s), 0.8)) * 0.5;
        p.set([c.x + side.x * w, c.y + side.y * w, c.z + side.z * w, c.x - side.x * w, c.y - side.y * w, c.z - side.z * w], i * 6);
      }
      for (let i = 0; i < N; i++) for (let edge = 0; edge < 2; edge++) {
        const a = (i * 2 + edge) * 3, b = ((i + 1) * 2 + edge) * 3, o = (i * 2 + edge) * 6;
        e.set([p[a], p[a + 1], p[a + 2], p[b], p[b + 1], p[b + 2]], o);
      }
      r.geo.attributes.position.needsUpdate = true; r.rimGeo.attributes.position.needsUpdate = true;
      r.geo.computeBoundingSphere(); r.rimGeo.computeBoundingSphere();
    }
  }
  const filaments = [0, 1, 2, 3].map(i => {
    const a = i * 1.7, pts = [0, 1, 2, 3, 4].map(j => V(Math.cos(a) * 0.08 * j, 0.7 + j * 0.35, Math.sin(a) * 0.08 * j));
    group.add(lines(pts, 0xffc861));
    const bead = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), ps1({ color: 0xfff0b0, emissive: true }));
    group.add(bead); return { bead, pts };
  });
  let lastOpen = -1;
  return {
    group,
    update(t, k) {
      const open = 0.55 + 0.45 * k; // planning readiness opens the bloom
      if (Math.abs(open - lastOpen) > 0.004) { write(open); lastOpen = open; }
      group.rotation.y = t * 0.12;
      filaments.forEach(({ bead, pts }, i) => {
        const ph = (t * 0.4 + i / 4) % 1, j = ph * 4, a = pts[Math.floor(j)], b = pts[Math.min(4, Math.floor(j) + 1)];
        bead.position.lerpVectors(a, b, j % 1);
      });
    },
  };
}

// Life: memory nautilus seed. Teal shell on a logarithmic spiral, warm ember, beads on the same spiral.
export function life() {
  const group = new THREE.Group();
  const shell = new THREE.Group(); shell.rotation.x = -0.25; group.add(shell);
  const TMAX = 3.2 * Math.PI, rho = (t) => 0.12 * Math.exp(0.18 * t);
  const P = (t) => V(rho(t) * Math.cos(t), rho(t) * Math.sin(t), 0);
  const ring = 7, steps = 44, pos = [], idx = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps * TMAX, c = P(t), tr = rho(t) * 0.62;
    const outward = V(Math.cos(t), Math.sin(t), 0);
    for (let j = 0; j < ring; j++) {
      const a = j / ring * Math.PI * 2;
      const v = c.clone().addScaledVector(outward, Math.cos(a) * tr).add(V(0, 0, Math.sin(a) * tr));
      pos.push(v.x, v.y, v.z);
    }
    if (i < steps) for (let j = 0; j < ring; j++) {
      const a = i * ring + j, b = i * ring + (j + 1) % ring;
      idx.push(a, b, a + ring, b, b + ring, a + ring);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  shell.add(new THREE.Mesh(geo, ps1({ color: 0x2f9e9a, rim: 0x9ff5ea, side: THREE.DoubleSide })));
  const seamOf = (t) => P(t).addScaledVector(V(Math.cos(t), Math.sin(t), 0), rho(t) * 0.66);
  shell.add(lines([...Array(61)].map((_, i) => seamOf(i / 60 * TMAX)), 0xd8f5ee));
  const ember = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 0), ps1({ color: 0xffa24a, emissive: true }));
  ember.position.copy(P(TMAX)).multiplyScalar(0.8); shell.add(ember);
  const beads = [...Array(7)].map(() => {
    const b = new THREE.Mesh(new THREE.OctahedronGeometry(0.07, 0), ps1({ color: 0xf0ead8, emissive: true }));
    shell.add(b); return b;
  });
  shell.scale.setScalar(1.35);
  return {
    group,
    update(t, k) {
      group.rotation.y = Math.sin(t * 0.2) * 0.5;
      ember.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
      beads.forEach((b, i) => { b.position.copy(seamOf(((t * 0.05 + i / 7) % 1) * TMAX)).multiplyScalar(1.08); });
    },
  };
}

// ---------- Epiphany-only organs (Face, Eyes, Body): lower detail, they live in her chamber ----------

// Face: speech lantern. Translucent bell, warm throat, pearls around the lip.
export function face() {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(lathe([[0, 1], [0.45, 0.85], [0.7, 0.4], [0.8, 0], [0.95, -0.3], [0.7, -0.36]], 9), ps1({ color: 0xf1d2b0, rim: 0xffe4c0, alpha: 0.6, side: THREE.DoubleSide })));
  const throat = new THREE.Mesh(new THREE.CircleGeometry(0.5, 8), ps1({ color: 0xffa860, emissive: true }));
  throat.rotation.x = Math.PI / 2; throat.position.y = -0.1; group.add(throat);
  const pearls = [...Array(5)].map(() => { const p = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), ps1({ color: 0xfff2dc, emissive: true })); group.add(p); return p; });
  return { group, update(t) { pearls.forEach((p, i) => { const a = t * 0.6 + i * 1.26, r = 0.9 + 0.25 * Math.sin(t + i); p.position.set(Math.cos(a) * r, -0.4 + 0.1 * Math.sin(t * 2 + i), Math.sin(a) * r); }); } };
}

// Eyes: evidence astrolabe. Black glass lens, blue-metal aperture ring, proof meridians, cyan sparks.
export function eyes() {
  const group = new THREE.Group();
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6), ps1({ color: 0x07090c, rim: 0x5ff2ff })); lens.scale.z = 0.45; group.add(lens);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.09, 4, 16), ps1({ color: 0x4a6a8f, rim: 0x9fc8ff })); group.add(ring);
  const meridians = [0, 1].map(i => { const m = lines(circlePts(0.98, 20), 0xcfe2f0); m.rotation.x = Math.PI / 2 * i; group.add(m); return m; });
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), ps1({ color: 0x6ff7ff, emissive: true }));
    const a = i * 1.3; s.position.set(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.3); group.add(s);
  }
  return { group, update(t) { meridians.forEach((m, i) => { m.rotation.y = t * (0.3 + i * 0.2); }); ring.rotation.z = t * 0.1; } };
}

// Body: load-bearing graph stone. Soft geode mass, enamel stress ribs, checkpoint pearls.
export function body() {
  const group = new THREE.Group();
  const stone = new THREE.Mesh(flat(new THREE.IcosahedronGeometry(0.95, 1)), ps1({ color: 0x22332a, rim: 0x5b8f74 }));
  stone.scale.y = 0.72; group.add(stone);
  const ribs = new THREE.Group(); ribs.scale.set(1.02, 0.74, 1.02); group.add(ribs);
  ribs.add(lines(circlePts(0.97, 20), 0x9fe0bf));
  for (const r of [0, 0.9, -0.9]) { const m = lines(circlePts(0.97, 20), 0x9fe0bf); m.rotation.set(Math.PI / 2, r, 0); ribs.add(m); }
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), ps1({ color: 0xfff4d6, emissive: true }));
    const a = i / 6 * Math.PI * 2; p.position.set(Math.cos(a) * 0.99, 0, Math.sin(a) * 0.99); ribs.add(p);
  }
  return { group, update(t) { stone.scale.y = 0.72 + Math.sin(t * 0.9) * 0.02; group.rotation.y = t * 0.05; } };
}

// Scaffolding: Epiphany is still growing bones.
export function scaffold(w, h) {
  const x = w / 2, pts = [];
  const c = [V(-x, 0, -x), V(x, 0, -x), V(x, 0, x), V(-x, 0, x)];
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4];
    for (const y of [0, h * 0.5, h]) pts.push(a.clone().setY(y), b.clone().setY(y));
    pts.push(a.clone(), a.clone().setY(h), a.clone(), b.clone().setY(h * 0.5)); // uprights and braces
  }
  return segs(pts, 0x3c4a58);
}

// Aquarium orbit slots: angle (deg) and ring fraction around Self.
export const SLOTS = {
  imagination: [135, 0.78], eyes: [35, 0.86], body: [215, 0.66], hands: [270, 0.82], soul: [325, 0.78], life: [80, 0.62],
};
/** Aquarium's XY grid mapped onto world XZ: +Y (grid forward) points away from the viewer, toward -z. */
export function slot(center, id, r) {
  const [deg, ring] = SLOTS[id], a = deg * Math.PI / 180;
  return V(center.x + Math.cos(a) * ring * r, center.y, center.z - Math.sin(a) * ring * r);
}
