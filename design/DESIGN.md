# Platform 2.5 design

Anchor for design review of the asset factory. Source of truth for intent is
`.openspec/specs/asset-factory/spec.md` (Look section); machine-readable values are in
`design/tokens.json`, which match the colors used in `blender/*.py`.

## Shape language
- Clean, bold, readable silhouettes built only from bpy primitives (boxes, cylinders, cones) and modifiers such as bevel.
- Chunky proportions; small bevels soften edges (torso 0.045, head 0.065) without adding detail.
- The character is one standing figure of six separate named parts: torso, head, arm_left, arm_right, leg_left, leg_right.
- Keep the head above the torso, arms beside it and legs below it; limb pivots sit at their top ends for animation. The standing figure is roughly 1.8 units tall.
- Ground is a solid 2 wide × 1 tall × 2 deep block; the floating platform is a 2 wide × 0.4 tall × 1.2 deep slab.
- The spike is a sharp cone or pyramid on a small base, about 0.8 tall, with an unmistakable hazard silhouette.
- The coin is an upright disc about 0.6 across, with flat faces along exported ±Z. The goal is a pole about 2.2 tall with a triangular flag at the top.

## Palette
Flat, saturated, procedural colors (Principled BSDF base colors). Values are Blender linear; hex is sRGB.
Use the linear RGB triples in `tokens.json` for shader inputs, with alpha 1.
The hex swatches describe the same base colors in sRGB; lighting and the lineup's
AgX view transform affect their rendered appearance. All materials use roughness
0.48; metallic and emission strength default to zero unless specified in the tokens.

| Asset | Part | Token | Hex |
|---|---|---|---|
| Character | torso, head | coral | #f97961 |
| Character | arms, legs | teal | #218684 |
| Ground block | sides | stone | #a2998e |
| Ground block | top face | grass | #76c448 |
| Floating platform | body | stone | #a2998e |
| Floating platform | top | stoneTop (lighter) | #d0c8b8 |
| Spike | all | steel (light steel gray) | #d3dde3 |
| Coin | all | gold, metallic 0.65, emission 0.2 | #ffc72c |
| Goal flag | pole | flagPole (white) | #f1f5f7 |
| Goal flag | cloth | flagCoral (coral red) | #f9614d |
| Lineup | ground plane | backdrop | #424d59 |

## Quality bars
- Readability: the coral/teal figure must stand out clearly against the stone and grass platforms.
- Coin has a slight emissive feel from material values only; no bloom dependency.
- No image textures, downloaded models or external files; scripts never import meshes or load images.
- Every asset exports to `assets/*.glb` with its contracted node names, between 800 bytes and 5 MB.
- The lineup render shows all six assets in a row: `evidence/asset-lineup.png`, 960x540, Cycles CPU, at most 64 samples.
- Review the lineup for distinct silhouettes, visible contrasting top faces and a clearly readable hazard, pickup and goal. Scenario tests S1–S6 check the export and evidence contracts; visual acceptance belongs to the separate reviewer and human gate.
