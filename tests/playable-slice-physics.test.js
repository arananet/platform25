import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../src/physics.js';

const run = (g, n, direction = 1) => { for (let i = 0; i < n; i++) g.step(direction, false); };

test('S4: spike and fall resets retain coins and keep the timer running', () => {
  const g = createGame();
  run(g, 80);
  assert.equal(g.s.collected.size, 1);
  g.warpTo(22);
  let reset = false;
  for (let i = 0; i < 30; i++) {
    const x = g.s.x;
    g.step(1, false);
    if (g.s.x === x) { reset = true; break; }
  }
  assert.ok(reset, 'spike returns to previous safe grounded position');
  assert.equal(g.s.collected.size, 1);
  const before = g.s.timeMs;
  g.warpTo(29);
  run(g, 35);
  assert.ok(!g.s.grounded);
  run(g, 150, 0);
  assert.ok(g.s.grounded);
  assert.ok(g.s.x >= 29 && g.s.x < 30.3);
  assert.equal(g.s.collected.size, 1);
  assert.ok(g.s.timeMs > before);
});

test('S3: platform sides block movement and a jump lands on the platform top', () => {
  const g = createGame();
  g.warpTo(38);
  run(g, 30);
  assert.ok(g.s.x <= 38.7);
  g.step(1, true);
  run(g, 24);
  run(g, 100, 0);
  assert.ok(g.s.grounded);
  assert.equal(g.s.y, 0.8);
});

test('R3/R4: identical fixed input sequences agree; finish freezes time and restart clears state', () => {
  const a = createGame(), b = createGame();
  for (const g of [a, b]) {
    run(g, 80); g.step(1, true); run(g, 90);
  }
  assert.deepEqual(a.s, b.s);
  a.warpTo(54); run(a, 100);
  assert.ok(a.s.finished);
  const time = a.s.timeMs;
  run(a, 100);
  assert.equal(a.s.timeMs, time);
  a.restart();
  assert.equal(a.s.x, 1);
  assert.equal(a.s.collected.size, 0);
  assert.equal(a.s.timeMs, 0);
  assert.equal(a.s.started, false);
  assert.equal(a.s.finished, false);
});
