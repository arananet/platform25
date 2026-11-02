# Asset Factory

Status: approved for build
Slug: asset-factory

Revision note (operator, 2026-10-30): the round 1 revision of this spec is approved as committed. It aligns two clauses with the implementation (the render script builds the lineup from the same per-asset build functions and never calls a glTF importer, and the character look line drops a phrase the model never had). The asset list, the naming contract and scenarios S1 to S6 are unchanged.

## Roles
- implementer: builds the change described here
- reviewer: checks the change against this spec
- qa: checks the scenarios below with tests
- product_owner: owns the purpose and accepts the result

## Purpose

Platform 2.5 needs its 3D assets, and none of them may be downloaded or hand made. This spec covers the asset factory: Blender Python scripts, written by the builder station, that model every asset the game needs from primitives and modifiers with procedural materials only, and export them as `.glb` files the game and the tests can rely on. A deterministic pipeline step runs the scripts headless with the pinned Blender (4.5.15), so the assets in the repo always come from the committed scripts.

## Asset list and naming contract

All exports land in `assets/`. Node names inside each `.glb` are a contract: the game code and the tests address parts by name.

- `assets/player.glb`: the player character, built from exactly these separate named objects: `torso`, `head`, `arm_left`, `arm_right`, `leg_left`, `leg_right`. The parts must be arranged as a standing humanoid figure (head above torso, arms at the sides of the torso, legs below it) so code can swing the limbs around their top ends. Roughly 1.8 units tall.
- `assets/ground_block.glb`: one node named `ground_block`, a solid block 2 wide, 1 tall, 2 deep, the course's basic ground piece.
- `assets/platform_floating.glb`: one node named `platform_floating`, a slab 2 wide, 0.4 tall, 1.2 deep.
- `assets/spike.glb`: one node named `spike`, a sharp cone or pyramid on a small base, about 0.8 tall, clearly a hazard.
- `assets/coin.glb`: one node named `coin`, a flat cylinder (a disc) about 0.6 across, standing upright facing sideways (its flat faces look along plus and minus Z), the pickup.
- `assets/goal_flag.glb`: one node named `goal_flag`, a pole about 2.2 tall with a triangular flag at the top, the level goal.

## Look

Clean, bold, readable shapes with flat saturated procedural colors, no textures:

- Character: warm coral body (torso and head), deep teal limbs; the figure must read clearly against the platforms.
- Ground block: warm gray stone sides with a grass green top face.
- Floating platform: warm gray stone with a lighter top.
- Spike: light steel gray.
- Coin: gold with a slight emissive feel from its material values (no bloom dependency).
- Goal flag: white pole, coral red flag.

Materials are created in the scripts with bpy (Principled BSDF base colors are enough). No image textures, no external files.

## Pipeline contract

- Scripts live under `blender/`, one module per asset plus `blender/build_all.py`, the single entry point that (re)builds every asset into `assets/`.
- A second script, `blender/render_lineup.py`, builds all six assets into one scene by calling the same per-asset build functions the asset modules use (it must not call a glTF importer, so S6 holds), arranges them in a row on a ground plane with a camera and light, and renders a still to `evidence/asset-lineup.png` at 960x540 using the Cycles engine on CPU (headless safe), at most 64 samples.
- The workflow's deterministic step runs `blender --background --python blender/build_all.py` and then `blender/render_lineup.py` after the line, before the suite. The builder may also run them during its station work (Blender 4.5.15 is on PATH in the runner).
- The scripts must run with `blender --background --python <script>` from the repo root and write paths relative to the repo root, creating `assets/` and `evidence/` when missing.
- The project test script in `package.json` runs `node --test` over `tests/**/*.test.js` (recorded here per the round 1 architecture review; the glob form is what the suite uses).

## Requirements

- R1: Only bpy primitives, modifiers and procedural materials. No imported meshes, no image textures, no network access from the scripts.
- R2: Every asset exports to its contracted path with its contracted node names.
- R3: The character's six parts are separate objects in the export, positioned as one standing figure.
- R4: The exports are deterministic: running build_all.py twice produces the same node structure (byte equality is not required).
- R5: Project tests (node, under `tests/`) verify the scenarios below by parsing the `.glb` files (the glTF JSON chunk) and the file system, with no Blender dependency at test time.
- R6: The lineup render is produced by the pipeline and committed as run evidence for the human gate.

## Scenarios

### Scenario: Every asset exists after the build
- S1: Given the pipeline's Blender step has run, when the tests list `assets/`, then `player.glb`, `ground_block.glb`, `platform_floating.glb`, `spike.glb`, `coin.glb` and `goal_flag.glb` all exist and are non-empty.

### Scenario: The character keeps its named parts
- S2: Given `assets/player.glb`, when the tests parse its glTF JSON, then the node names include `torso`, `head`, `arm_left`, `arm_right`, `leg_left` and `leg_right`, each as its own node.

### Scenario: Platform pieces keep their names
- S3: Given each platform set `.glb`, when the tests parse its glTF JSON, then a node with the asset's own name exists (`ground_block`, `platform_floating`, `spike`, `coin`, `goal_flag`).

### Scenario: Sizes stay sane
- S4: Given the exported assets, when the tests stat them, then every `.glb` is at least 800 bytes and at most 5 MB.

### Scenario: The lineup render exists
- S5: Given the pipeline's render step has run, when the tests read `evidence/asset-lineup.png`, then the file exists, is a PNG, and is 960x540.

### Scenario: No external assets sneak in
- S6: Given the scripts under `blender/`, when the tests scan them, then none of them calls an importer or image loader (no `import_scene`, no `image.load`, no `bpy.data.images.load`), and no file under `blender/` is a binary asset.
