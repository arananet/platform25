import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { assets, course } from './course.js';
import { createGame, FIXED_DT } from './physics.js';
import './style.css';

const game = createGame();
const { s } = game;
let ready = false;
window.__platform25 = {
  getState: () => ({ ready, x: s.x, y: s.y, grounded: s.grounded, airborne: !s.grounded,
    coins: s.collected.size, totalCoins: game.totalCoins, started: s.started, finished: s.finished, timeMs: s.timeMs }),
  warpTo: (x) => game.warpTo(x),
};
const keys = new Set();
let jumpQueued = false;
const controls = ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyR'];
addEventListener('keydown', e => {
  if (!controls.includes(e.code)) return;
  e.preventDefault();
  if (!e.repeat && (e.code === 'Space' || e.code === 'KeyW')) jumpQueued = true;
  if (e.code === 'KeyR' && s.finished) { game.restart(); keys.clear(); jumpQueued = false; }
  keys.add(e.code);
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => { keys.clear(); jumpQueued = false; });

const scene = new THREE.Scene();
scene.background = new THREE.Color('#d9e2e6');
scene.fog = new THREE.Fog('#d9e2e6', 22, 55);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.querySelector('#game').append(renderer.domElement);
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 100);
scene.add(new THREE.HemisphereLight('#ffffff', '#a2998e', 2.4));
const sun = new THREE.DirectionalLight('#fff5e6', 3);
sun.position.set(-3, 8, 5);
scene.add(sun);
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
// Two layers of simple palette-derived scenery give real depth and parallax.
for (const [z, color, spacing] of [[-5, '#a7b5b7', 7], [-10, '#bcc6c7', 10]]) {
  const material = new THREE.MeshLambertMaterial({ color });
  for (let i = -3; i < 12; i++) {
    const height = 2 + ((i + 30) * 7 % 5) * 0.8;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(spacing * 0.65, height, 1.6), material);
    mesh.position.set(i * spacing, height / 2 - 2, z);
    scene.add(mesh);
  }
}

const loader = new GLTFLoader();
const models = Object.fromEntries(await Promise.all(Object.entries(assets).map(async ([name, url]) => [name, (await loader.loadAsync(url)).scene])));
// Normalize each exported asset's origin to its bottom centre without changing materials or scale.
function modelAt(name, x, y) {
  const model = models[name].clone(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const centre = bounds.getCenter(new THREE.Vector3());
  model.position.sub(new THREE.Vector3(centre.x, bounds.min.y, centre.z));
  const root = new THREE.Group(); root.add(model); root.position.set(x, y, 0); scene.add(root);
  return root;
}
const coins = [];
for (const p of course) {
  const root = modelAt(p.asset, p.x, p.asset === 'coin' ? p.y - 0.3 : p.y);
  if (p.asset === 'coin') coins.push(root);
}
const player = modelAt('player', s.x, s.y);
const pivots = [];
player.updateMatrixWorld(true);
for (const name of ['arm_left', 'arm_right', 'leg_left', 'leg_right']) {
  const limb = player.getObjectByName(name);
  const bounds = new THREE.Box3().setFromObject(limb);
  const top = bounds.getCenter(new THREE.Vector3()); top.y = bounds.max.y;
  const pivot = new THREE.Group();
  pivot.position.copy(player.worldToLocal(top));
  player.add(pivot); player.updateMatrixWorld(true);
  pivot.attach(limb); // Preserve the exported transform while moving its rotation origin to the joint.
  pivots.push(pivot);
}
const coinLabel = document.querySelector('#coins');
const timerLabel = document.querySelector('#timer');
const overlay = document.querySelector('#completion');
let previous = performance.now(), accumulator = 0, phase = 0, cameraX = 2.3;
function frame(now) {
  const elapsed = Math.min((now - previous) / 1000, 0.1); previous = now;
  accumulator += elapsed;
  while (accumulator >= FIXED_DT) {
    const direction = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
    game.step(direction, jumpQueued);
    jumpQueued = false;
    accumulator -= FIXED_DT;
    if (!s.finished) phase += Math.abs(s.vx) * FIXED_DT * 2;
  }
  player.position.set(s.x, s.y, 0);
  // Rotate the front-facing figure to a readable three-quarter running profile.
  player.rotation.y = s.facing * 0.65;
  const swing = Math.sin(phase) * 0.65 * Math.abs(s.vx) / 6;
  pivots.forEach((pivot, i) => {
    const pose = !s.grounded ? [0.55, 0.55, -0.65, -0.35][i] : (s.finished ? 0 : swing * [1, -1, -1, 1][i]);
    pivot.rotation.x = THREE.MathUtils.lerp(pivot.rotation.x, pose, 1 - Math.exp(-18 * elapsed));
  });
  coins.forEach((coin, i) => { coin.visible = !s.collected.has(i); coin.rotation.y = now / 900; });
  cameraX = THREE.MathUtils.lerp(cameraX, s.x + s.facing * 1.3, 1 - Math.exp(-6 * elapsed));
  camera.position.set(cameraX, 2.4, 9);
  camera.lookAt(cameraX, 1.1, 0);
  coinLabel.textContent = `Coins ${s.collected.size} / ${game.totalCoins}`;
  timerLabel.textContent = `${(s.timeMs / 1000).toFixed(2)} s`;
  overlay.hidden = !s.finished;
  if (s.finished) document.querySelector('#result').textContent = `${s.collected.size} / ${game.totalCoins} coins · ${(s.timeMs / 1000).toFixed(2)} seconds`;
  renderer.render(scene, camera);
  if (!ready) { ready = true; document.querySelector('#loading').hidden = true; }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
