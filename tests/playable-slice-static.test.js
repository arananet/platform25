// Static checks for the playable slice spec (.openspec/specs/playable-slice/spec.md), S1 to S6 support.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function srcFiles(dir = path.join(root, 'src')) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? srcFiles(path.join(dir, e.name)) : /\.(js|mjs)$/.test(e.name) ? [path.join(dir, e.name)] : [],
  );
}
const allSource = () => srcFiles().map((f) => fs.readFileSync(f, 'utf8')).join('\n');

test('S1: index.html loads the game as a module from src/main.js', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /<script[^>]+type="module"[^>]+src="\/?src\/main\.js"/);
  assert.ok(fs.existsSync(path.join(root, 'src', 'main.js')), 'src/main.js missing');
});

test('R1: the source references all six contracted asset paths', () => {
  const src = allSource();
  for (const a of ['player', 'ground_block', 'platform_floating', 'spike', 'coin', 'goal_flag']) {
    assert.ok(src.includes(`assets/${a}.glb`), `no reference to assets/${a}.glb in src/`);
  }
});

test('R2: limb pivots address the contracted part names', () => {
  const src = allSource();
  for (const n of ['arm_left', 'arm_right', 'leg_left', 'leg_right']) {
    assert.ok(src.includes(n), `src/ does not mention ${n}`);
  }
});

test('Test hook: window.__platform25 with getState and warpTo exists in source', () => {
  const src = allSource();
  assert.match(src, /__platform25/);
  assert.match(src, /getState/);
  assert.match(src, /warpTo/);
});

test('R3: physics uses a fixed timestep', () => {
  assert.match(allSource(), /fixed|accumulator|FIXED_DT|STEP/i);
});

test('package.json declares three, vite and playwright, and keeps the scripts', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.ok(pkg.dependencies?.three, 'three must be a dependency');
  assert.ok(pkg.dependencies?.vite, 'vite must be a dependency');
  assert.ok(pkg.devDependencies?.playwright, 'playwright must be a devDependency');
  for (const s of ['dev', 'build', 'preview', 'test']) assert.ok(pkg.scripts?.[s], `script ${s} missing`);
});
