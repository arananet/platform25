// Asset URLs are resolved by Vite into the build, never fetched externally.
export const assets = {
  player: new URL('../assets/player.glb', import.meta.url).href,
  ground_block: new URL('../assets/ground_block.glb', import.meta.url).href,
  platform_floating: new URL('../assets/platform_floating.glb', import.meta.url).href,
  spike: new URL('../assets/spike.glb', import.meta.url).href,
  coin: new URL('../assets/coin.glb', import.meta.url).href,
  goal_flag: new URL('../assets/goal_flag.glb', import.meta.url).href,
};
const ground = (x) => ({ asset: 'ground_block', x, y: -1, size: [2, 1, 2], solid: true });
const platform = (x, top) => ({ asset: 'platform_floating', x, y: top - 0.4, size: [2, 0.4, 1.2], solid: true });
const coin = (x, y) => ({ asset: 'coin', x, y, size: [0.6, 0.6, 0.15] });
// Positions are bottom-centred; coin y denotes its centre instead.
export const course = [
  // 1. Fourteen units of flat opening, including the unassisted first pickup.
  ...[1, 3, 5, 7, 9, 11, 13].map(ground),
  coin(5, 1.2), coin(11, 1.2),
  // 2. Shallow pit and a raised stepping stone.
  { ...ground(15), y: -1.8 }, { ...ground(17), y: -1.8 },
  platform(16, 1.2), coin(16, 2.4),
  // 3. Ground hazards. Jump from the approach to clear the spikes.
  ...[19, 21, 23, 25, 27, 29].map(ground),
  { asset: 'spike', x: 23, y: 0, size: [0.8, 0.8, 0.8] },
  { asset: 'spike', x: 24, y: 0, size: [0.8, 0.8, 0.8] },
  coin(23.5, 2.4), coin(28, 1.2),
  // 4. Three-unit gap: x = 30 to 33, with no floor beneath.
  ...[34, 36, 38].map(ground), coin(35, 1.2),
  // 5. Rising platforms, each within one running jump.
  platform(40, 0.8), platform(43, 1.6), platform(46, 2.4),
  coin(43, 2.8), coin(46, 3.6),
  // 6. Final flat and flag.
  ...[49, 51, 53, 55, 57, 59].map(ground), coin(52, 1.2),
  { asset: 'goal_flag', x: 58, y: 0, size: [0.8, 2.2, 0.4] },
];
