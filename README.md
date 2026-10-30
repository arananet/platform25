# Platform 2.5

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![Three.js](https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white) ![Blender](https://img.shields.io/badge/Blender-4.5-E87D0D?logo=blender&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black) ![OpenSpec](https://img.shields.io/badge/OpenSpec-SDD-0E7C66) ![License](https://img.shields.io/badge/License-Apache%202.0-blue)

> "A 2.5D platformer for the web whose 3D assets are modeled by headless Blender scripts and whose game is built end to end by a software factory."

Platform 2.5 is a concept game built end to end with [ANVIL](https://github.com/arananet/anvil-factory), an open source software factory: spec first, tests before code, factory runs with their reports kept in the repo. No 3D model is downloaded or hand made: every asset is produced by a Blender Python script under `blender/`, executed headless (`blender --background --python`), and exported as `.glb`. The game itself is a Vite plus Three.js page: a side view course with depth, a character with code animated limbs, coins, spikes and a goal flag.

## What is in the repo

| Path | What it is |
| --- | --- |
| `blender/` | Blender Python scripts that model every asset from primitives and procedural materials |
| `assets/` | The exported `.glb` assets, built deterministically by the pipeline |
| `src/` | The game: Three.js scene, player controller, HUD (added by the playable slice work order) |
| `.openspec/specs/` | OpenSpec specifications, written before the code |
| `tests/` | Node tests: asset contract checks and browser checks |
| `runs/` | ANVIL factory run reports, one folder per work order |
| `tools/` | The executed run station wrappers (Claude Code and Codex routes) |
| `brain/` | Project brain: context, glossary, learnings, worklog |

## Development

```bash
npm install     # game dependencies (Vite, Three.js)
npm run dev     # play the slice locally
npm test        # project checks (asset contract, build, browser pass)
```

Rebuild the 3D assets (requires the pinned Blender 4.5 on PATH):

```bash
blender --background --python blender/build_all.py
```

## Contributing (OpenSpec)

This project follows Spec-Driven Development with OpenSpec. Specs live under `.openspec/specs/` and are written before implementation changes. A change starts as a spec with scenarios, lands with tests that reference the scenario ids, and keeps the factory gates green. Please open an issue or a pull request on GitHub.

## Documentation

| Document | Description |
| --- | --- |
| [.openspec/specs/](.openspec/specs/) | The capability specs: asset factory, playable slice |
| [PIPELINES.md](PIPELINES.md) | The factory pipelines available to this project |
| [BLUEPRINT.md](BLUEPRINT.md) | The blueprint this project was scaffolded from |
| [brain/project.md](brain/project.md) | Project context and standing decisions |

## License

[Apache 2.0](LICENSE). Copyright 2026 Eduardo Arana.

## Developer

**Eduardo Arana**

- Website: [arananet.net](https://arananet.net)
- GitHub: [github.com/arananet](https://github.com/arananet)
- LinkedIn: [linkedin.com/in/eduardoluisarana](https://www.linkedin.com/in/eduardoluisarana)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/H2H51MPWG)
