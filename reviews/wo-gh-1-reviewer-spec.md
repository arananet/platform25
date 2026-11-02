# Review (reviewer-spec) for wo-gh-1: asset factory

Verdict: pass. Checked against .openspec/specs/asset-factory/spec.md only.

- Naming contract: all six exports are present in assets/. The player has six separate parts (torso, head, arm_*, leg_*). Each other asset has a node with its own name (the joined objects are renamed to the contracted name). R2, R3, S1-S3 are met.
- Dimensions: ground block 2x2x1 and platform 2x1.2x0.4 match. The spike is about 0.8 tall, a 4-sided cone on a base. The coin is a disc of radius 0.3 rotated so its faces point along Z. The flag pole is 2.2 tall with a 3-vertex-cylinder triangle on top. The player stands 1.8 tall, with limb pivots at the top ends.
- Look: palette and materials follow the spec (coral body, teal limbs, grass top, light platform top, steel, emissive gold, white pole with coral flag). Materials are made with bpy Principled BSDF only.
- Pipeline: build_all.py is the single entry point. render_lineup.py reuses the same build() functions, with no importer. It uses Cycles on CPU, 32 samples (<= 64), 960x540. It creates assets/ and evidence/ if missing, and paths are relative to the repo root.
- S6: no import_scene, image.load or bpy.data.images.load in blender/; no bytecode or binaries there (sys.dont_write_bytecode set).
- Tests: tests/asset-factory.test.js covers S1-S6 by parsing the glb JSON chunk and the PNG header. `npm test` passes 6/6. The lineup render was viewed and shows all six assets in a row.

Observations (non-blocking):
- R4 (determinism) has no test of its own. Only the contracted node names are checked.
- S3 checks that a node of the asset's name exists. It does not check dimensions or materials, so those were verified by reading the code and the render only.
