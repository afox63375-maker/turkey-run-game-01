// hazards.js — everything the turkey must dodge, jump or hide from:
// fences, swinging carving knives, hot ovens, and the corn and haystacks
// that help it survive. Spawning uses a seeded RNG so screenshots are
// deterministic.

import { drawFence, drawKnife, drawOven, drawHaystack, drawCorn } from './art.js';
import { GROUND_Y } from './turkey.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const KINDS = ['fence', 'knife', 'oven', 'haystack', 'corn', 'cornRow'];

export function createHazardField(seed) {
  const rng = mulberry32(seed || 12345);
  return {
    items: [],
    distSinceSpawn: 0,
    nextGap: 420,
    rng,

    reset(seedValue) {
      this.items = [];
      this.distSinceSpawn = 0;
      this.nextGap = 420;
      this.rng = mulberry32(seedValue || 12345);
    },

    // pick what appears next, weighted by stage (0 farmyard, 1 barn, 2 kitchen)
    pickKind(stage) {
      const r = this.rng();
      if (stage === 2) {
        if (r < 0.30) return 'oven';
        if (r < 0.55) return 'knife';
        if (r < 0.68) return 'fence';
        if (r < 0.80) return 'haystack';
        if (r < 0.92) return 'corn';
        return 'cornRow';
      }
      if (stage === 1) {
        if (r < 0.28) return 'knife';
        if (r < 0.52) return 'fence';
        if (r < 0.66) return 'haystack';
        if (r < 0.84) return 'corn';
        if (r < 0.93) return 'cornRow';
        return 'oven';
      }
      if (r < 0.34) return 'fence';
      if (r < 0.52) return 'knife';
      if (r < 0.68) return 'haystack';
      if (r < 0.86) return 'corn';
      return 'cornRow';
    },

    spawn(stage, minGap) {
      const kind = this.pickKind(stage);
      const x = 1000 + this.rng() * 160;
      const base = { kind, x, passed: false, hit: false, bob: this.rng() * 6 };
      if (kind === 'cornRow') {
        for (let i = 0; i < 3; i++) this.items.push({ ...base, kind: 'corn', x: x + i * 46 });
      } else {
        this.items.push(base);
      }
      this.distSinceSpawn = 0;
      this.nextGap = (minGap || 340) + this.rng() * 220;
    },

    update(dt, speed, stage) {
      for (const it of this.items) it.x -= speed * dt;
      this.items = this.items.filter((it) => it.x > -140);
      // spawn by distance travelled, so gaps stay fair at any speed
      this.distSinceSpawn += speed * dt;
      if (this.distSinceSpawn >= this.nextGap) {
        this.spawn(stage, 320 + stage * 40);
      }
    },

    hitbox(it) {
      switch (it.kind) {
        case 'fence': return { x: it.x - 14, y: GROUND_Y - 52, w: 54, h: 52 };
        case 'knife': return { x: it.x - 40, y: GROUND_Y - 46, w: 72, h: 46 };
        case 'oven': return { x: it.x, y: GROUND_Y - 96, w: 96, h: 96 };
        case 'haystack': return { x: it.x - 34, y: GROUND_Y - 40, w: 68, h: 40 };
        case 'corn': return { x: it.x - 12, y: GROUND_Y - 66, w: 24, h: 34 };
        default: return { x: it.x, y: GROUND_Y - 40, w: 10, h: 40 };
      }
    },

    draw(ctx, t) {
      for (const it of this.items) {
        if (it.kind === 'fence') drawFence(ctx, it.x, GROUND_Y, 1);
        else if (it.kind === 'knife') {
          const swing = Math.sin(t * 4 + it.bob) * 0.5;
          drawKnife(ctx, it.x, GROUND_Y - 8, 1, -0.5 + swing * 0.4);
        } else if (it.kind === 'oven') drawOven(ctx, it.x, GROUND_Y - 96, 96, 96, t + it.bob);
        else if (it.kind === 'haystack') drawHaystack(ctx, it.x, GROUND_Y, 1);
        else if (it.kind === 'corn') drawCorn(ctx, it.x, GROUND_Y - 52, 1, t * 3 + it.bob);
      }
    },
  };
}

export function boxesOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
