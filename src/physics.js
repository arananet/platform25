import { course } from './course.js';
export const FIXED_DT = 1 / 120;
const WIDTH = 0.6, HEIGHT = 1.8;
const solids = course.filter(p => p.solid);
const hazards = course.filter(p => p.asset === 'spike');
const pickups = course.filter(p => p.asset === 'coin');
const goal = course.find(p => p.asset === 'goal_flag');
const overlapsX = (x, p) => Math.abs(x - p.x) < (WIDTH + p.size[0]) / 2 - 1e-7;
const overlaps = (s, p) => overlapsX(s.x, p) && s.y < p.y + p.size[1] && s.y + HEIGHT > p.y;
export function createGame() {
  const s = {};
  let checkpoint;
  function restart() {
    Object.assign(s, { x: 1, y: 0, vx: 0, vy: 0, grounded: true, started: false, finished: false, timeMs: 0, facing: 1, collected: new Set() });
    checkpoint = { x: 1, y: 0 };
  }
  function reset() { Object.assign(s, checkpoint, { vx: 0, vy: 0, grounded: true }); }
  function warpTo(x) {
    const surfaces = solids.filter(p => Math.abs(x - p.x) <= p.size[0] / 2);
    if (!Number.isFinite(x) || !surfaces.length) return;
    s.x = x; s.y = Math.max(...surfaces.map(p => p.y + p.size[1]));
    s.vx = s.vy = 0; s.grounded = true;
    checkpoint = { x: s.x, y: s.y };
  }
  function step(direction, jump) {
    if (s.finished) return;
    if (direction || jump) s.started = true;
    if (s.started) s.timeMs += FIXED_DT * 1000;
    s.vx = direction * 6;
    if (direction) s.facing = direction;
    if (jump && s.grounded) { s.vy = 8.6; s.grounded = false; }
    s.x += s.vx * FIXED_DT;
    for (const p of solids) {
      if (overlaps(s, p)) {
        s.x = p.x - Math.sign(s.vx) * (p.size[0] + WIDTH) / 2;
        s.vx = 0;
      }
    }
    const oldY = s.y;
    s.vy -= 22 * FIXED_DT;
    s.y += s.vy * FIXED_DT;
    s.grounded = false;
    for (const p of solids) {
      if (!overlapsX(s.x, p)) continue;
      const top = p.y + p.size[1];
      if (s.vy <= 0 && oldY >= top - 1e-7 && s.y <= top) {
        s.y = top; s.vy = 0; s.grounded = true;
      } else if (s.vy > 0 && oldY + HEIGHT <= p.y && s.y + HEIGHT >= p.y) {
        s.y = p.y - HEIGHT; s.vy = 0;
      }
    }
    if (s.y < -6 || hazards.some(p => overlaps(s, p))) { reset(); return; }
    // Record only a non-hazardous grounded position, before the next step.
    if (s.grounded) checkpoint = { x: s.x, y: s.y };
    pickups.forEach((p, i) => {
      if (Math.abs(s.x - p.x) < 0.6 && s.y < p.y + 0.3 && s.y + HEIGHT > p.y - 0.3) s.collected.add(i);
    });
    if (overlaps(s, goal)) s.finished = true;
  }
  restart();
  return { s, step, restart, warpTo, totalCoins: pickups.length };
}
