I wrote the tests for S1 to S6, but I haven't run them. The game doesn't exist yet, so they will fail until it does. I only syntax-checked both files.

- **`tests/playable-slice-static.test.js`** (S1 support, R1 to R3):
  - `index.html` loads `src/main.js` as a module.
  - `src/` references all six `assets/*.glb` paths and the four limb part names.
  - `src/` contains `window.__platform25`, `getState`, `warpTo` and a fixed-timestep marker.
  - `package.json` declares `three` and `vite` as dependencies and `playwright` as a devDependency, and keeps the four scripts.
- **`tests/playable-slice-browser.test.js`** (S1 to S6):
  - **Setup:** it runs `npm run build`, serves `dist/` with `vite preview` on port 4173, and launches headless Chromium with software WebGL flags at 1280 by 720.
  - **Spawn:** it checks the spawn state (0 coins, at least 8 total, grounded, not started) and saves `evidence/play-spawn.png`.
  - **Run and jump:** holding the right arrow must increase x and collect a coin with no jump. Pressing Space must show `airborne`, then `grounded` again with x past the jump point. It then saves `evidence/play-mid.png`.
  - **Finish:** it calls `warpTo(54)` once, then walks into the flag with the real arrow key. It requires `finished`, a stopped timer, an overlay showing the coin count and a restart hint, and saves `evidence/play-goal.png`.
  - **Errors:** the console and page error list must be empty.

The spec doesn't give the course layout, so I picked the warp point. The browser test warps to x = 54, 4 units before the flag at about x = 58.

The spec says the overlay shows the coin count and a restart hint, but not the exact text or element. The overlay check only looks for an "R" and the coin count in the page text, so it is loose. The implementation should keep that text visible.

There are no automated tests for S4 (spike and gap resets). The spec's browser check doesn't cover them, so they stay with the reviewer unless you want a test added.

{"model": "claude-sonnet-5-5", "runtime": "claude-code"}
