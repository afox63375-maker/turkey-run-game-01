// Gobble Dash hand-in (Node 22, standard library only).
//
// This program takes the entry that sits beside it — the game/ folder with
// the plain static turkey escape game, and screenshots/ with real renders
// of that game — and lays them out in the output directory together with
// dossier.json, the summary the judge reads, built by the vendored
// make.fun library in vendor/makefun-game.ts.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Refuse early, with a readable error, when the entrypoint is missing —
// a hand-in without game/index.html would fail the gate anyway, and a
// silent empty copy would hide that until grading time.
const entrypoint = join(repoRoot, 'game', 'index.html');
if (!existsSync(entrypoint)) {
  throw new Error(`Gobble Dash hand-in refused: ${entrypoint} is missing`);
}

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });

mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The scorer's caps, mirrored here so a bad entry is refused locally
// instead of at grading time: at most 4 screenshots of 256 KiB each, at
// most 993 files and 48 MiB under game/, no game/ path over 1000 bytes.
const dossierText = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossierText);

// A one-line receipt on stdout so a local run shows what it handed in.
console.log(`gobble-dash: game/ + screenshots/ -> ${outDir} (dossier ${dossierText.length} bytes)`);
