// Browser check for the playable slice spec, scenarios S1 to S6.
// Builds the game, serves dist/ with vite preview, plays it headless with scripted keys.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = path.join(root, 'evidence');
const PORT = 4173;
const URL = `http://127.0.0.1:${PORT}/`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(timeoutMs = 30000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try {
      if ((await fetch(URL)).ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('vite preview did not start');
}

async function pollUntil(page, pred, { timeout = 15000, interval = 50 } = {}) {
  const end = Date.now() + timeout;
  let s;
  while (Date.now() < end) {
    s = await page.evaluate(() => window.__platform25.getState());
    if (pred(s)) return s;
    await sleep(interval);
  }
  throw new Error(`condition not met in ${timeout}ms; last state ${JSON.stringify(s)}`);
}

test('S1-S6: build, play the opening, jump, collect, finish, zero console errors', { timeout: 240000 }, async () => {
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
  fs.mkdirSync(evidence, { recursive: true });

  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'ignore',
  });
  let browser;
  try {
    await waitForServer();
    const { chromium } = await import('playwright');
    browser = await chromium.launch({
      headless: true,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'],
    });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

    // S1: spawn state
    await page.goto(URL);
    await page.waitForFunction(() => window.__platform25?.getState().ready === true, null, { timeout: 60000 });
    const spawn0 = await page.evaluate(() => window.__platform25.getState());
    assert.equal(spawn0.coins, 0);
    assert.ok(spawn0.totalCoins >= 8, `totalCoins ${spawn0.totalCoins} < 8`);
    assert.ok(spawn0.grounded, 'player should stand at spawn');
    assert.equal(spawn0.started, false);
    assert.equal(spawn0.finished, false);
    assert.ok(spawn0.x > 0 && spawn0.x < 3, `spawn x ${spawn0.x}`);
    await page.screenshot({ path: path.join(evidence, 'play-spawn.png') });

    // S2: run right, first coin with no jump
    await page.keyboard.down('ArrowRight');
    const moved = await pollUntil(page, (s) => s.x > spawn0.x + 1);
    assert.ok(moved.x > spawn0.x, 'x must increase while running');
    const coined = await pollUntil(page, (s) => s.coins >= 1);
    assert.ok(coined.coins >= 1);
    assert.ok(coined.started, 'timer starts on first movement');

    // S3: jump and landing while still running
    const jumpX = (await page.evaluate(() => window.__platform25.getState())).x;
    await page.keyboard.press('Space');
    await pollUntil(page, (s) => s.airborne === true, { interval: 10, timeout: 3000 });
    const landed = await pollUntil(page, (s) => s.grounded === true && s.x > jumpX, { interval: 20, timeout: 5000 });
    assert.ok(landed.x > jumpX, 'landed beyond the jump point');
    await page.screenshot({ path: path.join(evidence, 'play-mid.png') });
    await page.keyboard.up('ArrowRight');

    // S5: warp near the goal, finish with real key input
    await page.evaluate(() => window.__platform25.warpTo(54));
    await page.keyboard.down('ArrowRight');
    const done = await pollUntil(page, (s) => s.finished === true, { timeout: 20000 });
    await page.keyboard.up('ArrowRight');
    assert.ok(done.timeMs > 0);
    const t1 = (await page.evaluate(() => window.__platform25.getState())).timeMs;
    await sleep(300);
    const t2 = (await page.evaluate(() => window.__platform25.getState())).timeMs;
    assert.equal(t1, t2, 'timer stops at the goal');
    const body = await page.evaluate(() => document.body.innerText);
    assert.match(body, /R/, 'overlay shows a restart hint');
    assert.match(body, new RegExp(`${done.coins}`), 'overlay shows the coin count');
    await page.screenshot({ path: path.join(evidence, 'play-goal.png') });

    for (const f of ['play-spawn.png', 'play-mid.png', 'play-goal.png']) {
      assert.ok(fs.statSync(path.join(evidence, f)).size > 5000, `${f} missing or empty`);
    }
    assert.deepEqual(errors, [], `console/page errors: ${errors.join(' | ')}`);
  } finally {
    await browser?.close();
    server.kill();
  }
});
