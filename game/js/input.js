// input.js — keyboard and mouse (pointer) controls, one small module.

export function createInput(canvas, hooks) {
  const keys = {};
  const pressed = {}; // edge-triggered, consumed once per frame

  function press(action) {
    pressed[action] = true;
    if (hooks[action]) hooks[action]();
  }

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    keys[e.code] = true;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      press('jump');
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      e.preventDefault();
      press('slide');
      keys.slideHeld = true;
    } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyD') {
      press('dash');
    } else if (e.code === 'Enter') {
      press('confirm');
    } else if (e.code === 'KeyM') {
      press('mute');
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.slideHeld = false;
  });

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (x > 0.86 && hooks.dashZone && hooks.dashZone()) {
      press('dash');
    } else {
      press('jump');
    }
    if (hooks.pointer) hooks.pointer(x);
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  return {
    keys,
    pressed,
    consume(action) {
      const v = !!pressed[action];
      pressed[action] = false;
      return v;
    },
    slideHeld() { return !!keys.slideHeld; },
  };
}
