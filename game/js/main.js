// main.js — Gobble Dash: Turkey's Great Escape. Boots the game, runs the
// loop, owns the state machine (title / playing / caught / escaped), the
// HUD, the menus and the scoring. The turkey escapes Thanksgiving dinner
// by outrunning the farmer from the farmyard, through the barn, past the
// kitchen oven — 1200 metres and it is free.

import { createTurkey, GROUND_Y } from './turkey.js';
import { createFarmer } from './farmer.js';
import { createHazardField, boxesOverlap } from './hazards.js';
import { STAGES, stageFor, drawScenery } from './stages.js';
import { sfx, ensureAudio, toggleMute, isMuted } from './audio.js';
import { createInput } from './input.js';
import { applyShot } from './shots.js';

const W = 960;
const H = 540;
const ESCAPE_DISTANCE = 1200;
const PX_PER_M = 14;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const game = {
  state: 'title', // 'title' | 'playing' | 'caught' | 'escaped'
  time: 0,
  titleBob: 0,
  distanceM: 0,
  distancePx: 0,
  score: 0,
  lives: 3,
  stage: 0,
  frozen: false,
  endReason: '',
  flash: 0,
  shake: 0,
  best: 0,
  turkey: createTurkey(),
  farmer: createFarmer(),
  hazards: createHazardField(20261127),
};

try {
  game.best = parseInt(window.localStorage.getItem('gobble-dash-best') || '0', 10) || 0;
} catch (e) {
  game.best = 0;
}

function saveBest() {
  if (game.score > game.best) {
    game.best = game.score;
    try { window.localStorage.setItem('gobble-dash-best', String(game.best)); } catch (e) { /* offline-safe */ }
  }
}

function startRun() {
  ensureAudio();
  game.state = 'playing';
  game.distanceM = 0;
  game.distancePx = 0;
  game.score = 0;
  game.lives = 3;
  game.stage = 0;
  game.flash = 0;
  game.shake = 0;
  game.endReason = '';
  game.turkey.reset();
  game.farmer.reset();
  game.hazards.reset(20261127 + Math.floor(Math.random() * 100000));
  sfx.gobble();
}

function endRun(reason) {
  game.state = reason;
  game.endReason = reason;
  saveBest();
  if (reason === 'escaped') sfx.escape();
  else sfx.caught();
}

function stageSpeed() {
  return STAGES[game.stage].speed + game.distanceM * 0.06;
}

function update(dt) {
  game.time += dt;
  if (game.state === 'title') {
    game.titleBob += dt;
    return;
  }
  if (game.state === 'caught' || game.state === 'escaped') {
    if (game.flash > 0) game.flash -= dt;
    if (game.shake > 0) game.shake -= dt;
    return;
  }

  // --- playing ---
  const speed = stageSpeed();
  const dashing = game.turkey.dashTime > 0;
  game.distancePx += speed * dt * (dashing ? 1.8 : 1);
  game.distanceM = game.distancePx / PX_PER_M;
  game.score += dt * (dashing ? 26 : 14);

  const newStage = stageFor(game.distanceM);
  if (newStage !== game.stage) {
    game.stage = newStage;
    game.score += 250;
    sfx.stage();
  }

  game.turkey.slide(input.slideHeld());
  game.turkey.update(dt, speed);
  game.farmer.update(dt, game.turkey.hiding, speed, dashing);
  game.hazards.update(dt, speed, game.stage);

  // collisions
  const tb = game.turkey.hitbox();
  for (const it of game.hazards.items) {
    if (it.hit || it.passed) continue;
    const hb = game.hazards.hitbox(it);
    if (it.kind === 'corn') {
      if (boxesOverlap(tb, hb)) {
        it.hit = true;
        game.score += 10;
        sfx.corn();
      }
      continue;
    }
    if (it.kind === 'haystack') {
      if (boxesOverlap(tb, hb) && game.turkey.hiding) {
        it.passed = true;
        game.score += 25;
        game.farmer.loseTrail();
        sfx.hide();
      }
      continue;
    }
    if (boxesOverlap(tb, hb)) {
      if (game.turkey.invulnerable > 0) continue;
      it.hit = true;
      game.lives -= 1;
      game.turkey.invulnerable = 1.6;
      game.farmer.punish(110);
      game.flash = 0.35;
      game.shake = 0.4;
      sfx.stumble();
      if (game.turkey.hiding) game.turkey.unhide();
      if (game.lives <= 0) {
        endRun('caught');
        return;
      }
    } else if (it.x + 60 < game.turkey.x) {
      it.passed = true;
      game.score += 5;
    }
  }

  // caught by the farmer himself
  if (game.farmer.gap <= 0) {
    endRun('caught');
    return;
  }

  // escaped!
  if (game.distanceM >= ESCAPE_DISTANCE) {
    game.score += 1000;
    endRun('escaped');
  }
}

function drawHUD() {
  ctx.save();
  ctx.textAlign = 'left';
  // top bar
  ctx.fillStyle = 'rgba(43, 26, 14, 0.72)';
  ctx.fillRect(0, 0, W, 64);
  ctx.fillStyle = '#f6d9a0';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText('SCORE ' + Math.floor(game.score), 16, 28);
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText(Math.floor(game.distanceM) + ' m / ' + ESCAPE_DISTANCE + ' m', 16, 52);
  // stage tag
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e8b23a';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText(STAGES[game.stage].name, W / 2, 30);
  ctx.fillStyle = '#f6d9a0';
  ctx.font = '15px Georgia, serif';
  ctx.fillText(STAGES[game.stage].sub, W / 2, 52);
  // lives as hearts
  ctx.textAlign = 'right';
  ctx.font = '26px Georgia, serif';
  let hearts = '';
  for (let i = 0; i < 3; i++) hearts += i < game.lives ? '♥' : '♡';
  ctx.fillStyle = '#e84a5f';
  ctx.fillText(hearts, W - 16, 32);
  ctx.fillStyle = '#f6d9a0';
  ctx.font = '15px Georgia, serif';
  ctx.fillText('BEST ' + game.best, W - 16, 54);
  // farmer proximity meter
  const frac = 1 - game.farmer.gap / game.farmer.maxGap;
  ctx.fillStyle = 'rgba(43, 26, 14, 0.72)';
  ctx.fillRect(W - 216, 72, 200, 14);
  ctx.fillStyle = frac > 0.7 ? '#b3402a' : '#e8b23a';
  ctx.fillRect(W - 214, 74, 196 * frac, 10);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('FARMER', W - 116, 83);
  // dash hint
  if (game.turkey.dashTime > 0) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillText('DASH!', game.turkey.x + 40, game.turkey.y - 70);
  }
  ctx.restore();
}

function drawTitle() {
  ctx.save();
  ctx.textAlign = 'center';
  const bob = Math.sin(game.titleBob * 2) * 6;
  ctx.fillStyle = 'rgba(43, 26, 14, 0.45)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#f6d9a0';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.shadowColor = '#b3402a';
  ctx.shadowBlur = 18;
  ctx.fillText('GOBBLE DASH', W / 2, 150);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#e8b23a';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText("Turkey's Great Escape", W / 2, 192);
  ctx.fillStyle = '#fff';
  ctx.font = '18px Georgia, serif';
  ctx.fillText('Thanksgiving is coming. The farmer is hungry. The oven is hot.', W / 2, 232);
  ctx.fillText('Run 1200 metres — farmyard, barn, kitchen — and live to gobble another day.', W / 2, 258);
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillStyle = '#f6d9a0';
  const blink = Math.floor(game.time * 1.6) % 2 === 0;
  if (blink) ctx.fillText('Press ENTER or CLICK to run!', W / 2, 452);
  ctx.font = '15px Georgia, serif';
  ctx.fillStyle = '#d9c9a8';
  ctx.fillText('Space / click: jump · Down: slide & hide in haystacks · Shift: dash · M: mute', W / 2, 482);
  if (game.best > 0) {
    ctx.fillStyle = '#e8b23a';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillText('Best score so far: ' + game.best, W / 2, 508);
  }
  ctx.restore();
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function drawEnd() {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(43, 26, 14, 0.55)';
  ctx.fillRect(0, 0, W, H);
  // a near-opaque panel behind the text so scenery never fights the words
  ctx.fillStyle = 'rgba(43, 26, 14, 0.88)';
  roundRect(ctx, W / 2 - 350, 108, 700, 290, 18);
  ctx.fill();
  const escaped = game.state === 'escaped';
  ctx.fillStyle = escaped ? '#7fae4c' : '#b3402a';
  ctx.font = 'bold 58px Georgia, serif';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 12;
  ctx.fillText(escaped ? 'ESCAPED!' : 'CAUGHT!', W / 2, 170);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.font = '21px Georgia, serif';
  ctx.fillText(
    escaped
      ? 'The turkey made it past the kitchen and into the wild woods. Gobble gobble — freedom!'
      : 'The farmer finally got his Thanksgiving dinner. The oven was already hot…',
    W / 2, 214,
  );
  ctx.fillStyle = '#f6d9a0';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText('Score ' + Math.floor(game.score) + '   ·   ' + Math.floor(game.distanceM) + ' m', W / 2, 268);
  ctx.font = '19px Georgia, serif';
  ctx.fillText('Best score: ' + game.best, W / 2, 300);
  const blink = Math.floor(game.time * 1.6) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#e8b23a';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText('Press ENTER or CLICK to run again', W / 2, 360);
  }
  ctx.restore();
}

function draw() {
  ctx.save();
  if (game.shake > 0) {
    const s = game.shake * 14;
    ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
  }
  drawScenery(ctx, game.stage, game.time, game.distancePx, GROUND_Y);
  game.hazards.draw(ctx, game.time);
  game.farmer.draw(ctx, game.turkey.x, GROUND_Y);
  if (game.state !== 'title') game.turkey.draw(ctx);
  if (game.state === 'playing') drawHUD();
  if (game.state === 'title') {
    // a calm turkey on the title screen, mid-field
    game.turkey.draw(ctx);
    drawTitle();
  }
  if (game.state === 'caught' || game.state === 'escaped') drawEnd();
  if (game.flash > 0) {
    ctx.fillStyle = `rgba(179, 64, 42, ${game.flash * 0.9})`;
    ctx.fillRect(0, 0, W, H);
  }
  // mute tag
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '13px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(isMuted() ? 'M: sound OFF' : 'M: sound on', 10, H - 10);
  ctx.restore();
}

const input = createInput(canvas, {
  jump() {
    ensureAudio();
    if (game.state === 'title' || game.state === 'caught' || game.state === 'escaped') {
      startRun();
      return;
    }
    if (game.state === 'playing' && game.turkey.jump()) sfx.jump();
  },
  slide() {},
  dash() {
    ensureAudio();
    if (game.state === 'playing' && game.turkey.dash()) sfx.dash();
  },
  confirm() {
    if (game.state !== 'playing') startRun();
  },
  mute() {
    toggleMute();
  },
  pointer(x) {
    ensureAudio();
  },
});

// hide when the turkey stands on a haystack and the player holds Down
function checkHide() {
  if (game.state !== 'playing') return;
  const tb = game.turkey.hitbox();
  let onHay = false;
  for (const it of game.hazards.items) {
    if (it.kind === 'haystack' && boxesOverlap(tb, game.hazards.hitbox(it))) onHay = true;
  }
  if (onHay && input.slideHeld() && !game.turkey.hiding) {
    if (game.turkey.hide()) sfx.hide();
  } else if (!onHay && game.turkey.hiding) {
    game.turkey.unhide();
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!game.frozen) {
    checkHide();
    update(dt);
  }
  draw();
  requestAnimationFrame(frame);
}

applyShot(game);
// Exposed for automated play-testing only (headless checks drive the game
// through real key events and read state back here).
window.__gobbleDash = game;
requestAnimationFrame(frame);
