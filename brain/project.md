# Platform 2.5

Project brain for platform25. Principles, context and decisions live here.

## Idea

A 2.5D platformer game for the web, built end to end by the ANVIL factory as a proof that the line can drive a headless Blender asset pipeline. The player runs and jumps along a side view course with real depth in the scene, collects coins, avoids spikes and reaches a goal flag.

## Standing decisions

- Every 3D asset is modeled by a Blender Python script under `blender/`, from primitives and modifiers only, with procedural materials only. No downloaded models, textures or images, ever.
- Blender is pinned to the 4.5 LTS series (4.5.15) in the workflow; assets export to `assets/*.glb` through one deterministic entry point, `blender/build_all.py`.
- The player character is separate named parts (torso, head, arm_left, arm_right, leg_left, leg_right) so the game code animates the limbs; names are a contract the tests check.
- The game is Vite plus Three.js, no framework. Controls: A/D or arrow keys to run, Space or W to jump.
- Look: clean, bold, readable platformer. Strong shapes, a limited palette stated in each spec, fixed angle camera with slight depth and a parallax backdrop of simple geometry.
- Nothing is deployed to a public URL by the line. Runs stop at the human gate with renders and screenshots as evidence.
