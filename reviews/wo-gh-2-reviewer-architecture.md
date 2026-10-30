# Review: reviewer-architecture (wo-gh-2)

Verdict: pass

Inputs: code change (index.html, src/, tests/, package.json) and decisions. There is no `brain/decisions/`; the standing decisions are in `brain/project.md`.

Fits the standing decisions:
- Vite plus Three.js with no framework. `three` and `vite` are dependencies and `playwright` is a devDependency.
- Controls are A/D or arrows to run and Space or W to jump.
- The six assets load only through `new URL(..., import.meta.url)` from `assets/*.glb`. No downloaded models, textures, images or fonts: the CSS uses the system Arial stack with no `url()` or `@import`, and the scenery is plain boxes.
- Limbs are animated by pivot groups looked up by the contracted part names (`arm_left`, `arm_right`, `leg_left`, `leg_right`).
- The spec and the asset factory are untouched. Nothing is deployed.

Structure is sound: `course.js` holds data, `physics.js` is a DOM-free fixed-step simulation (testable under node), and `main.js` does rendering, input and the hook.

Findings (non-blocking):
1. `index.html` hardcodes "Coins 0 / 9" in the HUD, and `main.js` overwrites it each frame. If the coin count changes, the initial markup is stale for the first frame.
2. `main.js` uses top-level await for asset loading. This works with the Vite build, but it ties the build target to modern browsers.
3. `package.json` keeps the glob `test` script from work order 1.
4. Not checked: I did not run the build or the tests; I judged fit from the code and the project brain.
