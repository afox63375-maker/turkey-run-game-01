// stages.js — the three places the escape runs through: the farmyard,
// the barn, and the kitchen. Each stage has its own palette, scenery and
// name; the run gets faster and the hazards nastier as stages change.

import { drawPumpkin } from './art.js';

export const STAGES = [
  {
    name: 'THE FARMYARD',
    sub: 'Dawn — the farmer just woke up hungry',
    skyTop: '#f2a65a', skyBottom: '#f6d9a0',
    ground: '#b98a4e', groundDark: '#9a6f3a',
    hill: '#c98a4b', hill2: '#a86f38',
    silhouette: '#7a4a21',
    speed: 300,
  },
  {
    name: 'THE BARN',
    sub: 'Dusk — hay, shadows and a very cross farmer',
    skyTop: '#8a4a3a', skyBottom: '#d97b29',
    ground: '#6e4520', groundDark: '#54331a',
    hill: '#8a5a2b', hill2: '#6e4520',
    silhouette: '#3c2412',
    speed: 360,
  },
  {
    name: 'THE KITCHEN',
    sub: 'Night — the oven is already hot. Run!',
    skyTop: '#3a2a4a', skyBottom: '#b3402a',
    ground: '#5a3a2a', groundDark: '#452c20',
    hill: '#6e4520', hill2: '#54331a',
    silhouette: '#241608',
    speed: 430,
  },
];

export function stageFor(distanceM) {
  if (distanceM >= 800) return 2;
  if (distanceM >= 350) return 1;
  return 0;
}

export function drawScenery(ctx, stage, t, distancePx, groundY) {
  const s = STAGES[stage];
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, groundY);
  sky.addColorStop(0, s.skyTop);
  sky.addColorStop(1, s.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 960, groundY);

  // sun / moon, kept left so it never sits behind the HUD's farmer meter
  ctx.fillStyle = stage === 2 ? '#f6e8c9' : '#fff3c9';
  ctx.beginPath();
  ctx.arc(130 + (distancePx * 0.01 % 60), 110, stage === 2 ? 30 : 44, 0, Math.PI * 2);
  ctx.fill();

  // rolling hills, two parallax layers
  ctx.fillStyle = s.hill;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= 960; x += 24) {
    ctx.lineTo(x, groundY - 60 - Math.sin((x + distancePx * 0.3) * 0.008) * 26);
  }
  ctx.lineTo(960, groundY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = s.hill2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= 960; x += 24) {
    ctx.lineTo(x, groundY - 26 - Math.sin((x + distancePx * 0.6) * 0.011) * 14);
  }
  ctx.lineTo(960, groundY);
  ctx.closePath();
  ctx.fill();

  // stage silhouette props, drifting with the world
  ctx.fillStyle = s.silhouette;
  const off = distancePx % 480;
  if (stage === 0) {
    // farmhouse + windmill blades turning
    const hx = 700 - off;
    ctx.fillRect(hx, groundY - 110, 130, 110);
    ctx.beginPath();
    ctx.moveTo(hx - 12, groundY - 110);
    ctx.lineTo(hx + 65, groundY - 150);
    ctx.lineTo(hx + 142, groundY - 110);
    ctx.closePath();
    ctx.fill();
    const mx = 180 - off;
    ctx.fillRect(mx - 8, groundY - 130, 16, 130);
    ctx.save();
    ctx.translate(mx, groundY - 140);
    ctx.rotate(t * 0.7);
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(0, -6, 52, 12);
    }
    ctx.restore();
  } else if (stage === 1) {
    // barn doors + hay bales
    const bx = 620 - off;
    ctx.fillRect(bx, groundY - 130, 170, 130);
    ctx.beginPath();
    ctx.moveTo(bx - 14, groundY - 130);
    ctx.lineTo(bx + 85, groundY - 175);
    ctx.lineTo(bx + 184, groundY - 130);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = s.groundDark;
    ctx.fillRect(bx + 62, groundY - 96, 46, 96);
  } else {
    // kitchen window + hanging pots
    const wx = 560 - off;
    ctx.fillStyle = '#f6e8c9';
    ctx.fillRect(wx, groundY - 190, 90, 70);
    ctx.strokeStyle = s.silhouette;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(wx + 45, groundY - 190); ctx.lineTo(wx + 45, groundY - 120);
    ctx.moveTo(wx, groundY - 155); ctx.lineTo(wx + 90, groundY - 155);
    ctx.stroke();
  }

  // pumpkins along the ground, farmyard and barn only
  if (stage < 2) {
    const px = 960 - ((distancePx * 1.0 + 240) % 480);
    drawPumpkin(ctx, px, groundY - 8, 0.9);
    drawPumpkin(ctx, px - 300, groundY - 6, 0.7);
  }

  // ground
  ctx.fillStyle = s.ground;
  ctx.fillRect(0, groundY, 960, 540 - groundY);
  ctx.fillStyle = s.groundDark;
  ctx.fillRect(0, groundY, 960, 8);
  // scrolling ground tufts
  ctx.strokeStyle = s.groundDark;
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const gx = 960 - ((distancePx + i * 83) % 960);
    ctx.beginPath();
    ctx.moveTo(gx, groundY + 26);
    ctx.lineTo(gx + 6, groundY + 16);
    ctx.lineTo(gx + 12, groundY + 26);
    ctx.stroke();
  }
}
