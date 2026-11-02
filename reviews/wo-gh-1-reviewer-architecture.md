# Review: reviewer-architecture (wo-gh-1)

Verdict: changes_requested

Inputs: code change (blender/, tests/, package.json, spec diff) and decisions. There is no `brain/decisions/` in the project; the standing decisions are in `brain/project.md` (the only decisions directory is the ANVIL factory's own, `.anvil-factory/brain/decisions/0001-composable-stations.md`, which does not apply to the asset code).

Fits the standing decisions:
- One module per asset plus `blender/build_all.py` as the single entry point. `render_lineup.py` reuses `build_all.ASSETS`, so no duplicated modeling.
- Primitives, modifiers and procedural materials only. No importer or image loader in `blender/`; bytecode writing is disabled so the directory stays text-only.
- The player is six separate named parts with pivots at the limb tops. Assets export to `assets/*.glb`, and tests run with `node --test` without Blender.

Findings:
1. The contract was edited inside the feature change. `.openspec/specs/asset-factory/spec.md` is modified in the working tree: the status moved from "approved for build" to "revised, awaiting approval", and the character look line and the `render_lineup.py` import clause were rewritten. The builder and reviewer stations do not own the spec. The spec is now not approved, yet the code is built against it. Either the spec-writer or human gate must re-approve the revised spec, or the edit must be reverted and the code fitted to the approved text.
2. `package.json` changes the `test` script from `node --test tests/` to `node --test "tests/**/*.test.js"`. The change is reasonable, but it is outside the spec and not mentioned in it. Record it in the work order or the spec.
3. Minor: `reset()` calls `read_factory_settings` for each asset. That is fine for determinism, but `render_lineup.py` depends on `build_all` import side effects only through `ASSETS`. Keep `main()` guarded, as it is now.

Not checked: the pinned Blender 4.5.15 was not run by this station.
