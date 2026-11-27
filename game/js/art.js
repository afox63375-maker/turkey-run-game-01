// art.js — every picture in Gobble Dash is drawn here with plain canvas
// shapes: the turkey, the farmer, the oven, the carving knife and the farm
// props. No image files, no borrowed art.

export function drawTurkey(ctx, x, y, scale, pose) {
  // pose: { run: 0..1 (leg cycle), sliding: bool, hiding: bool, wing: 0..1 }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const legSwing = Math.sin(pose.run * Math.PI * 2) * 10;

  if (pose.hiding) {
    // tucked low, only the tail fan and a nervous eye peep out of the hay
    ctx.fillStyle = '#8a5a2b';
    ctx.beginPath();
    ctx.ellipse(0, -6, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(16, -14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1d1d1d';
    ctx.beginPath();
    ctx.arc(17, -14, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  // fanned tail feathers
  const tailColors = ['#b3402a', '#d97b29', '#e8b23a', '#7a4a21', '#b3402a'];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI * 0.82 + (i * Math.PI * 0.32);
    ctx.save();
    ctx.rotate(a);
    ctx.fillStyle = tailColors[i];
    ctx.beginPath();
    ctx.ellipse(-26, 0, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f6d9a0';
    ctx.beginPath();
    ctx.arc(-40, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // legs
  ctx.strokeStyle = '#e8a13a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const lift = pose.sliding ? 0 : 1;
  ctx.beginPath();
  ctx.moveTo(-6, 14);
  ctx.lineTo(-6 + legSwing * lift, 30);
  ctx.moveTo(6, 14);
  ctx.lineTo(6 - legSwing * lift, 30);
  ctx.stroke();

  // body
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a86f38';
  ctx.beginPath();
  ctx.ellipse(4, -4, 18, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // wing
  ctx.fillStyle = '#6e4520';
  ctx.beginPath();
  ctx.ellipse(-4, 2, 15, 9, -0.3 + pose.wing * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // neck + head
  ctx.fillStyle = '#c98a4b';
  ctx.beginPath();
  ctx.ellipse(20, -18, 7, 13, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8b23a';
  ctx.beginPath();
  ctx.arc(24, -32, 10, 0, Math.PI * 2);
  ctx.fill();
  // snood + wattle
  ctx.fillStyle = '#b3402a';
  ctx.beginPath();
  ctx.ellipse(30, -28, 3, 6, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(24, -22, 4, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // beak
  ctx.fillStyle = '#e8a13a';
  ctx.beginPath();
  ctx.moveTo(32, -34);
  ctx.lineTo(42, -30);
  ctx.lineTo(32, -27);
  ctx.closePath();
  ctx.fill();
  // eye
  ctx.fillStyle = '#1d1d1d';
  ctx.beginPath();
  ctx.arc(27, -35, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawFarmer(ctx, x, y, scale, pose) {
  // pose: { run: 0..1, searching: bool, angry: bool }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const swing = Math.sin(pose.run * Math.PI * 2) * 9;

  // legs (blue overalls)
  ctx.strokeStyle = '#2f4d7a';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, 6);
  ctx.lineTo(-8 + swing, 34);
  ctx.moveTo(8, 6);
  ctx.lineTo(8 - swing, 34);
  ctx.stroke();
  // boots
  ctx.fillStyle = '#4a2f1a';
  ctx.fillRect(-14 + swing, 30, 13, 7);
  ctx.fillRect(2 - swing, 30, 13, 7);

  // torso: red plaid shirt + overalls
  ctx.fillStyle = '#a83226';
  ctx.fillRect(-18, -22, 36, 32);
  ctx.strokeStyle = '#7c1f16';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-18, -10); ctx.lineTo(18, -10);
  ctx.moveTo(-18, 2); ctx.lineTo(18, 2);
  ctx.moveTo(-6, -22); ctx.lineTo(-6, 10);
  ctx.moveTo(6, -22); ctx.lineTo(6, 10);
  ctx.stroke();
  ctx.fillStyle = '#2f4d7a';
  ctx.fillRect(-14, -8, 28, 18);

  // arm reaching forward, holding a pitchfork
  ctx.strokeStyle = '#e8b98a';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(10, -16);
  ctx.lineTo(30, -6 + Math.sin(pose.run * Math.PI * 2) * 3);
  ctx.stroke();
  ctx.strokeStyle = '#8a6a3b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(28, -34);
  ctx.lineTo(36, 6);
  ctx.stroke();
  ctx.strokeStyle = '#c9c9c9';
  ctx.lineWidth = 3;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(28 + i * 5, -34);
    ctx.lineTo(28 + i * 5, -44);
    ctx.stroke();
  }

  // head
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath();
  ctx.arc(0, -34, 12, 0, Math.PI * 2);
  ctx.fill();
  // moustache + angry brows
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(-8, -28, 16, 4);
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-9, -40); ctx.lineTo(-3, -37);
  ctx.moveTo(9, -40); ctx.lineTo(3, -37);
  ctx.stroke();
  ctx.fillStyle = '#1d1d1d';
  ctx.beginPath();
  ctx.arc(-5, -35, 1.8, 0, Math.PI * 2);
  ctx.arc(5, -35, 1.8, 0, Math.PI * 2);
  ctx.fill();
  // straw hat
  ctx.fillStyle = '#d9b25f';
  ctx.beginPath();
  ctx.ellipse(0, -44, 20, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-11, -56, 22, 13);
  ctx.fillStyle = '#a83226';
  ctx.fillRect(-11, -47, 22, 4);

  if (pose.searching) {
    // question mark above his head while he hunts for the turkey
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.fillText('?', 14, -66);
  }
  ctx.restore();
}

export function drawOven(ctx, x, y, w, h, t) {
  ctx.save();
  ctx.translate(x, y);
  // body
  ctx.fillStyle = '#5a5f66';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#3c4046';
  ctx.fillRect(0, 0, w, 10);
  // glowing door with fire
  const flick = 0.75 + Math.sin(t * 9) * 0.25;
  ctx.fillStyle = '#1d1d1d';
  ctx.fillRect(w * 0.14, h * 0.22, w * 0.72, h * 0.6);
  ctx.fillStyle = `rgba(255, ${Math.floor(120 + 80 * flick)}, 20, ${0.85 * flick})`;
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.78);
  ctx.quadraticCurveTo(w * 0.3, h * 0.35, w * 0.5, h * 0.55);
  ctx.quadraticCurveTo(w * 0.65, h * 0.3, w * 0.8, h * 0.78);
  ctx.closePath();
  ctx.fill();
  // knobs + handle
  ctx.fillStyle = '#c9c9c9';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(w * (0.28 + i * 0.22), h * 0.12, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#c9c9c9';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.18);
  ctx.lineTo(w * 0.9, h * 0.18);
  ctx.stroke();
  // heat waves
  ctx.strokeStyle = 'rgba(255, 140, 40, 0.7)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const hx = w * (0.25 + i * 0.25);
    ctx.beginPath();
    ctx.moveTo(hx, -6);
    ctx.quadraticCurveTo(hx + 6, -18 - (t * 30 + i * 12) % 14, hx, -30);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawKnife(ctx, x, y, scale, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  // blade
  ctx.fillStyle = '#d7dde3';
  ctx.beginPath();
  ctx.moveTo(-34, -6);
  ctx.lineTo(22, -6);
  ctx.quadraticCurveTo(40, 0, 22, 6);
  ctx.lineTo(-34, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#9aa2ab';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(24, 0);
  ctx.stroke();
  // handle
  ctx.fillStyle = '#4a2f1a';
  ctx.fillRect(-52, -8, 20, 16);
  ctx.fillStyle = '#c9a86a';
  ctx.fillRect(-34, -8, 3, 16);
  ctx.restore();
}

export function drawHaystack(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#d9a93c';
  ctx.beginPath();
  ctx.moveTo(-34, 0);
  ctx.quadraticCurveTo(-30, -34, 0, -40);
  ctx.quadraticCurveTo(30, -34, 34, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#b8892a';
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 12, -34 + Math.abs(i) * 6);
    ctx.lineTo(i * 14, -2);
    ctx.stroke();
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('HIDE!', 0, -46);
  ctx.restore();
}

export function drawCorn(ctx, x, y, scale, bob) {
  ctx.save();
  ctx.translate(x, y + Math.sin(bob) * 3);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#f2c531';
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d9a93c';
  for (let r = -1; r <= 1; r++) {
    ctx.beginPath();
    ctx.ellipse(r * 5, 0, 2.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#7fae4c';
  ctx.beginPath();
  ctx.moveTo(-8, 12);
  ctx.lineTo(-14, 22);
  ctx.lineTo(-2, 16);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(8, 12);
  ctx.lineTo(14, 22);
  ctx.lineTo(2, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawFence(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#8a6a3b';
  ctx.fillRect(-4, -52, 8, 52);
  ctx.fillRect(22, -52, 8, 52);
  ctx.fillStyle = '#a87f45';
  ctx.fillRect(-14, -46, 54, 9);
  ctx.fillRect(-14, -24, 54, 9);
  ctx.restore();
}

export function drawPumpkin(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#d96f1e';
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#b85a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(-7, 0, 6, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(7, 0, 6, 15, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#5a7a2a';
  ctx.fillRect(-2, -20, 4, 7);
  ctx.restore();
}
