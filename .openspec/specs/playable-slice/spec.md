# Playable Slice

Status: approved for build
Slug: playable-slice

## Roles
- implementer: builds the change described here
- reviewer: checks the change against this spec
- qa: checks the scenarios below with tests
- product_owner: owns the purpose and accepts the result

## Purpose

Platform 2.5 has its assets (work order 1, owner accepted on the evidence on 2026-10-30). This spec covers the playable slice: a small Vite plus Three.js game that loads the six contracted `.glb` assets from `assets/` and turns them into a side view 2.5D course the player can run, jump and finish in the browser. The slice is the proof that the asset contract works in a real game: the character's six named parts are animated in code, the course is built from the exported pieces, and an automated headless browser pass plays the opening of the course with scripted keys and proves movement, a jump landing and a coin pickup with zero console errors.

## Product shape

- `index.html` at the repo root loads the game as an ES module from `src/main.js`. Supporting modules under `src/` are the builder's choice.
- `package.json` gains `three` and `vite` as dependencies and `playwright` as a devDependency, from npm. The existing scripts stay: `npm run dev`, `npm run build`, `npm run preview`, `npm test`.
- The game loads the six assets from `assets/` by their contracted paths. No downloaded models, textures, images or fonts; the page background, HUD and overlay are DOM and CSS with the project palette.
- The build output is the standard Vite `dist/`.

## The course

A single course about 60 units long along plus X, built from a course data table in code (an array of placements), so tests and reviewers can read the layout without running the game. Ground tops sit at y = 0 unless a placement says otherwise. Required features, in order from spawn:

- Spawn on flat ground at about x = 1. The opening stretch is flat ground blocks at least 12 units long.
- Coin 1 on the opening flat stretch at about x = 5, at standing pickup height (about y = 1.2), so running through it collects it with no jump.
- A floating platform used as a step over a shallow pit in the second segment (platform top about y = 1.2), with a coin above it.
- Ground spikes in the third segment, placed on the ground where a running player must jump them or be reset.
- A ground gap of about 3 units in the fourth segment that must be jumped; falling in resets the player.
- A short rise of floating platforms in the fifth segment with at least two more coins.
- A final flat stretch and the goal flag at about x = 58.
- At least 8 coins in total across the course.

Blocks and slabs are the exported `ground_block` (2 wide, 1 tall, 2 deep) and `platform_floating` (2 wide, 0.4 tall, 1.2 deep) models, instanced or cloned per placement. Collision uses each placement's box (position and size from the course data), not mesh raycasting.

## Controls and physics

- Run: A and D, or the left and right arrow keys. Jump: Space or W. Restart after finishing: R.
- Run speed about 6 units per second. Gravity about minus 22 units per second squared. Jump velocity set so the character clears about 1.6 units of height and a 3 unit gap at full run speed.
- Physics advances in fixed steps (a fixed timestep with an accumulator, or substeps), so the same input sequence produces the same motion on every run and every machine. This determinism is a requirement, not a nicety: the automated browser pass depends on it.
- Collision is axis aligned box against box. Falling onto a platform top lands the player on it; hitting a side stops horizontal movement; the player stands on ground and platform tops only.
- Reset rule: touching a spike, or falling below y = minus 6, returns the player to the last position where it stood on a surface. Coins already collected stay collected. The timer keeps running across resets.
- The timer starts on the first movement input and stops when the goal is reached.

## The character in motion

- The player model is `assets/player.glb` with its six named parts: `torso`, `head`, `arm_left`, `arm_right`, `leg_left`, `leg_right`.
- Each limb is wrapped in a pivot group positioned at the limb's top end, so rotating the pivot swings the limb from the shoulder or hip.
- While running, the arms and legs swing in opposite phase, amplitude proportional to run speed. While airborne the limbs hold a tucked pose. While idle the swing eases to rest. A slight torso bob while running is welcome.

## Camera and scene

- Side view camera with slight depth: the camera sits at about z = 9 and y = 2.4, looks at the player, and follows the player's x with a small lookahead in the facing direction. The angle never changes; this is a 2.5D presentation of a 3D scene.
- Lighting: one hemisphere light plus one directional light are enough; flat materials from the assets carry the look.
- Backdrop: simple geometry at two or more depths behind the course (for example muted boxes and slabs at z = minus 5 and z = minus 10 in the backdrop and stone tones of `design/tokens.json`), so camera movement produces real parallax. No image textures.
- The scene background color is a soft sky tone derived from the palette (a lightened backdrop tone); the ground course reads clearly against it.

## HUD and completion

- A DOM HUD shows the coin count as collected of total (for example "Coins 3 / 9") and the elapsed timer, styled with the palette (coral and teal accents, dark slate text) in a clean sans serif.
- Reaching the goal flag sets the finished state: the timer stops and a completion overlay appears with the coin count, the final time, and the restart hint (press R). R resets the course state (position, coins, timer) for another run.

## Test hook

The game exposes a small read and position hook for the automated checks, and nothing else depends on it:

- `window.__platform25.getState()` returns an object with at least: `ready` (true once assets are loaded and the first frame has rendered), `x`, `y` (the player's position), `grounded`, `airborne`, `coins`, `totalCoins`, `started`, `finished`, `timeMs`.
- `window.__platform25.warpTo(x)` places the player standing on the surface at the given x, keeping collected coins and the timer state. The browser check uses it once, to stand near the goal for the goal screenshot after the unassisted assertions have passed; the final approach to the flag and the flag touch itself use real key input.

## Look

The look anchor is `design/DESIGN.md` and `design/tokens.json` from work order 1: clean, bold, readable; flat saturated colors; the coral and teal character readable against stone and grass platforms; gold coins; the coral flag on its white pole. The scene keeps the assets' own materials; the backdrop and HUD use the same palette tokens (coral #f97961, teal #218684, stone #a2998e, grass #76c448, gold #ffc72c, flag coral #f9614d, backdrop #424d59). Reviewer-design judges the run's screenshots against this anchor: palette fidelity, the fixed side camera with depth, a readable course, and a HUD that does not fight the scene.

## Verification (project checks)

Project tests live under `tests/` and run with `npm test` (node --test). The work order 1 suite keeps passing unchanged. The new checks:

- Static checks assert: `index.html` and the `src/` entry exist; the course data in the source references all six contracted asset paths; `package.json` declares three, vite and playwright.
- The browser check (one test file, using Playwright):
  1. Runs `npm run build`, serves `dist/` with `vite preview` on a fixed port, and launches Chromium headless with software WebGL flags (the runner has no GPU).
  2. Collects every console error and page error from load onwards.
  3. Loads the page and waits until `getState().ready` is true, then saves `evidence/play-spawn.png`.
  4. Holds the right arrow key and polls `getState()`: the run must show x increasing, and the first coin collected (coins at least 1) from unassisted running.
  5. While still holding the key, presses Space once and polls at a short interval: `airborne` must be observed true at least once, and afterwards `grounded` true again with x beyond the jump point (a jump and a landing, unassisted).
  6. Saves `evidence/play-mid.png` after those assertions, mid traversal.
  7. Calls `warpTo` once to stand a few units before the goal, holds the right arrow key, and requires `finished` to become true and the completion overlay to be visible in the DOM. Saves `evidence/play-goal.png` showing the overlay.
  8. Requires the collected console and page error list to be empty. Zero errors is a hard requirement.
- Screenshots land in `evidence/` at a viewport of 1280 by 720.

## Requirements

- R1: Only the six contracted assets from `assets/` are used for the character, course, hazard, pickup and goal. No external assets of any kind.
- R2: The character's limbs are animated by rotating pivot groups at the limbs' top ends, addressed by the contracted part names.
- R3: Physics is fixed timestep; scripted input is deterministic.
- R4: The reset rule, the timer rule and the completion state behave exactly as specified above.
- R5: The browser check passes with zero console errors, and the three screenshots exist in `evidence/`.
- R6: The work order 1 suite (asset factory) still passes, and `npm run build` succeeds.

## Scenarios

- S1: Opening the built game shows the character standing at spawn, the course ahead, the HUD at zero coins, and the spawn screenshot matches that state.
- S2: Holding the run key moves the character along plus X and collects the first coin without any jump.
- S3: Pressing jump while running makes the character airborne and then grounded again further along the course.
- S4: Touching a spike, or falling into the gap, returns the character to its last grounded position with its coins kept.
- S5: Walking into the goal flag finishes the course: the timer stops and the completion overlay shows the coin count and the final time.
- S6: The automated browser pass completes with zero console errors and writes play-spawn.png, play-mid.png and play-goal.png to evidence/.
