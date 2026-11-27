// shots.js — deterministic states for the screenshots, driven by the URL
// query: ?shot=start | play | kitchen | end (with &seed=1). Each shot puts
// the game in a fixed, readable pose and freezes it, so the screenshots
// are exact renders of this game's own code.

export function applyShot(game) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return null;
  const seed = parseInt(params.get('seed') || '1', 10) || 1;
  game.frozen = true;
  // screenshots must not carry a best score from an earlier play-test
  // (localStorage in the screenshot browser); each shot sets its own.
  game.best = 0;

  if (shot === 'start') {
    game.state = 'title';
    game.titleBob = 0;
  } else if (shot === 'play') {
    game.state = 'playing';
    game.distanceM = 412;
    game.distancePx = 412 * 14;
    game.score = 1250;
    game.best = 1250;
    game.lives = 3;
    game.stage = 1;
    game.turkey.y = 452 - 120;
    game.turkey.vy = 120;
    game.turkey.grounded = false;
    game.turkey.runCycle = 0.4;
    game.farmer.gap = 130;
    game.farmer.state = 'chase';
    game.hazards.reset(seed);
    game.hazards.items = [
      { kind: 'fence', x: 640, passed: false, hit: false, bob: 1 },
      { kind: 'knife', x: 820, passed: false, hit: false, bob: 2 },
      { kind: 'corn', x: 480, passed: false, hit: false, bob: 0.5 },
      { kind: 'corn', x: 526, passed: false, hit: false, bob: 1.5 },
      { kind: 'haystack', x: 330, passed: false, hit: false, bob: 3 },
    ];
  } else if (shot === 'kitchen') {
    game.state = 'playing';
    game.distanceM = 950;
    game.distancePx = 950 * 14;
    game.score = 4860;
    game.best = 4860;
    game.lives = 2;
    game.stage = 2;
    game.turkey.runCycle = 0.8;
    game.farmer.gap = 80;
    game.farmer.state = 'corner';
    game.hazards.reset(seed);
    game.hazards.items = [
      { kind: 'oven', x: 700, passed: false, hit: false, bob: 0 },
      { kind: 'knife', x: 880, passed: false, hit: false, bob: 1 },
      { kind: 'corn', x: 420, passed: false, hit: false, bob: 0.5 },
    ];
  } else if (shot === 'end') {
    game.state = 'escaped';
    game.distanceM = 1200;
    game.distancePx = 1200 * 14;
    game.score = 8420;
    game.best = 8420;
    game.lives = 3;
    game.stage = 2;
    game.endReason = 'escaped';
    game.turkey.runCycle = 0.2;
    game.farmer.gap = 300;
    game.farmer.state = 'search';
    game.hazards.reset(seed);
    game.hazards.items = [
      { kind: 'haystack', x: 700, passed: false, hit: false, bob: 1 },
      { kind: 'corn', x: 520, passed: false, hit: false, bob: 0.5 },
    ];
  }
  game.time = shot === 'play' ? 1.7 : shot === 'kitchen' ? 2.3 : 0.6;
  return shot;
}
