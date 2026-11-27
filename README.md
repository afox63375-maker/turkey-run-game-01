[![make.fun](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/afox63375-maker/turkey-run-game-01/rank.svg)](https://make.fun/bounty/turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/afox63375-maker/turkey-run-game-01/reward.svg)](https://make.fun/bounty/turkey-run-game-01)

# Gobble Dash — Turkey's Great Escape

Thanksgiving is coming, the farmer is hungry and the oven is already hot.
You are the turkey. Run 1200 metres — out of the farmyard, through the
barn, past the kitchen oven — and live to gobble another day.

## How to play

- **Space / Up / click** — jump over fences, carving knives and ovens
- **Down (hold)** — slide low, and hide inside a haystack when you stand on one
- **Shift / D** — dash for a burst of speed (and score)
- **Enter** — start / restart
- **M** — mute the synthesized sounds

Collect corn for points (+10 each), dodge cleanly for a bonus, and hide in a
haystack (+25) to make the farmer lose your trail — while he searches, the
gap behind you grows again. Stumble on a hazard and the farmer closes in;
lose all 3 hearts, or let him catch you, and dinner is served. Reach
1200 m and you escape.

The farmer chases, searches when you hide, and corners you when he gets
close. The run gets faster and the hazards nastier as you move from the
farmyard (dawn) to the barn (dusk) to the kitchen (night).

## Run it

Serve `game/` with any static server and open `game/index.html` in desktop
Chrome. It plays fully offline — no network requests, no libraries, all art
drawn in canvas and all sounds synthesized with WebAudio.

```sh
cd game && python3 -m http.server 8080
# open http://localhost:8080/
```

## Layout

- `game/index.html` — the page
- `game/css/style.css` — page chrome
- `game/js/main.js` — loop, state machine, HUD, menus, scoring
- `game/js/turkey.js` — the player turkey: physics and states
- `game/js/farmer.js` — the farmer AI: chase / search / corner
- `game/js/hazards.js` — fences, knives, ovens, haystacks, corn, spawning
- `game/js/stages.js` — farmyard / barn / kitchen scenery and palettes
- `game/js/art.js` — all canvas-drawn art (turkey, farmer, oven, knife…)
- `game/js/audio.js` — synthesized WebAudio sounds
- `game/js/input.js` — keyboard and mouse controls
- `game/js/shots.js` — deterministic screenshot states (`?shot=start|play|kitchen|end`)
- `main.ts` — copies `game/` and `screenshots/` to the output and writes `dossier.json`
- `screenshots/` — real renders of this game's own code

## Screenshots

`1-title.jpg` is the title screen, `2-play.jpg` a run in the barn,
`3-end.jpg` the escape screen, `4-kitchen.jpg` the kitchen stage.
