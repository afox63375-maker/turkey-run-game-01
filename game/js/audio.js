// audio.js — every sound is synthesized with WebAudio. No audio files.

let ctx = null;
let muted = false;

export function ensureAudio() {
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

function tone(freq, dur, type, vol, slideTo) {
  if (!ctx || muted) return;
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(vol || 0.15, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noiseBurst(dur, vol, lowpass) {
  if (!ctx || muted) return;
  const t0 = ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = lowpass || 1200;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol || 0.2, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(t0);
}

export const sfx = {
  jump() { tone(280, 0.16, 'square', 0.10, 560); },
  dash() { noiseBurst(0.18, 0.16, 2400); tone(520, 0.14, 'sawtooth', 0.06, 900); },
  corn() { tone(880, 0.09, 'sine', 0.14); setTimeout(() => tone(1320, 0.12, 'sine', 0.14), 70); },
  stumble() { noiseBurst(0.22, 0.22, 700); tone(160, 0.25, 'sawtooth', 0.12, 70); },
  gobble() {
    // the turkey's own two-note gobble
    tone(340, 0.09, 'square', 0.12, 260);
    setTimeout(() => tone(300, 0.09, 'square', 0.12, 220), 110);
    setTimeout(() => tone(380, 0.14, 'square', 0.12, 240), 220);
  },
  spotted() { tone(196, 0.12, 'sawtooth', 0.16); setTimeout(() => tone(196, 0.12, 'sawtooth', 0.16), 140); setTimeout(() => tone(262, 0.2, 'sawtooth', 0.16), 280); },
  hide() { tone(520, 0.2, 'sine', 0.1, 780); },
  escape() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle', 0.16), i * 130));
  },
  caught() {
    [392, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'sawtooth', 0.12), i * 160));
  },
  click() { tone(700, 0.05, 'sine', 0.08); },
  stage() { tone(440, 0.12, 'triangle', 0.12); setTimeout(() => tone(587, 0.16, 'triangle', 0.12), 120); },
};

export function toggleMute() {
  muted = !muted;
  return muted;
}
export function isMuted() { return muted; }
