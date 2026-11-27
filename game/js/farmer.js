// farmer.js — the farmer who chases the turkey. He has three moods:
// CHASE (closing in), SEARCH (the turkey hid and he hunts around),
// CORNER (he is close enough that the screen shakes and the alarm sounds).
// The gap is measured in pixels behind the turkey; gap <= 0 means caught.

import { drawFarmer } from './art.js';

export function createFarmer() {
  return {
    gap: 260,          // px behind the turkey
    maxGap: 300,
    state: 'chase',    // 'chase' | 'search' | 'corner'
    searchTime: 0,
    runCycle: 0,
    spottedFlash: 0,

    reset() {
      this.gap = 260;
      this.state = 'chase';
      this.searchTime = 0;
      this.spottedFlash = 0;
    },

    // called when the turkey stumbles on a hazard
    punish(amount) {
      this.gap = Math.max(0, this.gap - amount);
      this.spottedFlash = 0.6;
    },

    // called when the turkey hides in a haystack: the farmer loses the trail
    loseTrail() {
      this.state = 'search';
      this.searchTime = 2.2;
    },

    update(dt, turkeyHiding, speed, dashing) {
      this.runCycle += dt * 1.3;
      if (this.spottedFlash > 0) this.spottedFlash -= dt;
      // gap 0 means caught: hold it there so the main loop can end the run
      if (this.gap <= 0) return;

      if (this.state === 'search') {
        this.searchTime -= dt;
        // while searching he creeps forward slowly, then gives up ground
        this.gap = Math.min(this.maxGap, this.gap + 26 * dt);
        if (this.searchTime <= 0) {
          this.state = 'chase';
          this.gap = Math.min(this.maxGap, this.gap + 60);
        }
        return;
      }

      // chase: clean running slowly opens the gap; dashing opens it faster
      let drift = 7;
      if (dashing) drift = 55;
      if (turkeyHiding) drift = 30;
      this.gap = Math.min(this.maxGap, this.gap + drift * dt);
      this.state = this.gap < 90 ? 'corner' : 'chase';
    },

    draw(ctx, turkeyX, groundY) {
      const x = turkeyX - this.gap - 40;
      drawFarmer(ctx, x, groundY + 8, 1.05, {
        run: this.runCycle,
        searching: this.state === 'search',
        angry: this.state === 'corner',
      });
      if (this.state === 'corner') {
        ctx.save();
        ctx.fillStyle = '#b3402a';
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('HE IS RIGHT BEHIND YOU!', turkeyX + 60, 92);
        ctx.restore();
      }
    },
  };
}
