// Tests for the asset factory spec (.openspec/specs/asset-factory/spec.md), scenarios S1 to S6.
// They read the exported files only; no Blender is needed at test time.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'assets');
const blenderDir = path.join(root, 'blender');
const lineupPath = path.join(root, 'evidence', 'asset-lineup.png');

const ASSETS = {
  'player.glb': ['torso', 'head', 'arm_left', 'arm_right', 'leg_left', 'leg_right'],
  'ground_block.glb': ['ground_block'],
  'platform_floating.glb': ['platform_floating'],
  'spike.glb': ['spike'],
  'coin.glb': ['coin'],
  'goal_flag.glb': ['goal_flag'],
};

function readGltfJson(file) {
  const buf = fs.readFileSync(path.join(assetsDir, file));
  assert.equal(buf.toString('ascii', 0, 4), 'glTF', `${file} is not a binary glTF`);
  const length = buf.readUInt32LE(8);
  assert.equal(length, buf.length, `${file} header length mismatch`);
  const chunkLength = buf.readUInt32LE(12);
  assert.equal(buf.readUInt32LE(16), 0x4e4f534a, `${file} first chunk is not JSON`);
  return JSON.parse(buf.toString('utf8', 20, 20 + chunkLength));
}

function nodeNames(file) {
  return (readGltfJson(file).nodes ?? []).map((n) => n.name);
}

test('S1: every asset exists and is non-empty', () => {
  for (const file of Object.keys(ASSETS)) {
    const p = path.join(assetsDir, file);
    assert.ok(fs.existsSync(p), `${file} is missing`);
    assert.ok(fs.statSync(p).size > 0, `${file} is empty`);
  }
});

test('S2: player.glb has its six named parts as separate nodes', () => {
  const names = nodeNames('player.glb');
  for (const part of ASSETS['player.glb']) {
    assert.equal(names.filter((n) => n === part).length, 1, `expected exactly one node named ${part}`);
  }
});

test('S3: each platform set glb has a node with its own name', () => {
  for (const [file, expected] of Object.entries(ASSETS)) {
    if (file === 'player.glb') continue;
    assert.ok(nodeNames(file).includes(expected[0]), `${file} has no node named ${expected[0]}`);
  }
});

test('S4: every glb is between 800 bytes and 5 MB', () => {
  for (const file of Object.keys(ASSETS)) {
    const size = fs.statSync(path.join(assetsDir, file)).size;
    assert.ok(size >= 800, `${file} is too small (${size} bytes)`);
    assert.ok(size <= 5 * 1024 * 1024, `${file} is too large (${size} bytes)`);
  }
});

test('S5: lineup render is a 960x540 PNG', () => {
  assert.ok(fs.existsSync(lineupPath), 'evidence/asset-lineup.png is missing');
  const buf = fs.readFileSync(lineupPath);
  assert.deepEqual([...buf.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 'not a PNG');
  assert.equal(buf.toString('ascii', 12, 16), 'IHDR');
  assert.equal(buf.readUInt32BE(16), 960, 'width');
  assert.equal(buf.readUInt32BE(20), 540, 'height');
});

test('S6: no script imports external assets and no binary files sit under blender/', () => {
  assert.ok(fs.existsSync(blenderDir), 'blender/ is missing');
  const files = fs.readdirSync(blenderDir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile());
  assert.ok(files.length > 0, 'blender/ has no files');
  const banned = [/import_scene/, /image\.load/, /bpy\.data\.images\.load/];
  for (const entry of files) {
    const p = path.join(entry.parentPath ?? entry.path, entry.name);
    const rel = path.relative(root, p);
    const buf = fs.readFileSync(p);
    assert.ok(!buf.includes(0), `${rel} looks like a binary file`);
    assert.ok(/\.(py|md|txt|json)$/.test(entry.name), `${rel} is not a script or text file`);
    const text = buf.toString('utf8');
    for (const re of banned) assert.ok(!re.test(text), `${rel} matches banned pattern ${re}`);
  }
});
