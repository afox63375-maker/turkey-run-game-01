// turkey.js — the player: a turkey running for its life. Physics, states
// (run / jump / slide / hide / dash) and its hitbox live here.

import { drawTurkey } from './art.js';

export const GROUND_Y = 452;

export function createTurkey() {
  return {
    x: 210,
    y: GROUND_Y,
    vy: 0,
    runCycle: 0,
    sliding: false,
    hiding: false,
    dashTime: 0,
    invulnerable: 0,
    wingFlap: 0,
    grounded: true,

    reset() {
      this.y = GROUND_Y;
      this.vy = 0;
      this.runCycle = 0;
      this.sliding = false;
      this.hiding = false;
      this.dashTime = 0;
      this.invulnerable = 0;
      this.grounded = true;
    },

    jump() {
      if (!this.grounded || this.hiding) return false;
      this.vy = -640;
      this.grounded = false;
      this.sliding = false;
      this.wingFlap = 1;
      return true;
    },

    slide(on) {
      if (!this.grounded) return;
      this.sliding = on && !this.hiding;
    },

    dash() {
      if (this.dashTime > 0 || this.hiding) return false;
      this.dashTime = 0.45;
      return true;
    },

    hide() {
      if (!this.grounded) return false;
      this.hiding = true;
      this.sliding = false;
      return true;
    },

    unhide() {
      this.hiding = false;
    },

    update(dt, speed) {
      this.runCycle += dt * (this.dashTime > 0 ? 2.2 : 1.15);
      if (this.dashTime > 0) this.dashTime -= dt;
      if (this.invulnerable > 0) this.invulnerable -= dt;
      if (this.wingFlap > 0) this.wingFlap = Math.max(0, this.wingFlap - dt * 3);
      if (!this.grounded) {
        this.vy += 1750 * dt;
        this.y += this.vy * dt;
        if (this.y >= GROUND_Y) {
          this.y = GROUND_Y;
          this.vy = 0;
          this.grounded = true;
        }
      }
    },

    // hitbox in world (screen) coordinates; low when sliding, tiny when hiding
    hitbox() {
      if (this.hiding) return { x: this.x - 22, y: this.y - 16, w: 44, h: 16 };
      if (this.sliding) return { x: this.x - 24, y: this.y - 22, w: 48, h: 22 };
      return { x: this.x - 24, y: this.y - 62, w: 48, h: 62 };
    },

    draw(ctx) {
      if (this.invulnerable > 0 && Math.floor(this.invulnerable * 12) % 2 === 0) return; // blink
      const bob = this.grounded && !this.sliding ? Math.abs(Math.sin(this.runCycle * Math.PI)) * -3 : 0;
      drawTurkey(ctx, this.x, this.y + bob, 1, {
        run: this.runCycle,
        sliding: this.sliding,
        hiding: this.hiding,
        wing: this.wingFlap,
      });
    },
  };
}
