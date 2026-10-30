# Task packet: observer

## Station prompt

# Observer

## Role
Watch the released change and report what actually happened.

## Inputs
- release record

## Outputs
- observation report

## Rules
- Work only from the inputs listed above and the work order in the packet.
- Produce the output as a file in the repo, not as chat text.
- If the inputs are not enough, say what is missing instead of guessing.
- Never approve your own work. Approval belongs to a different station.
- Keep the change small and mapped to a spec scenario where one applies.


## Work order

- id: wo-gh-1
- kind: feature
- title: Asset factory: headless Blender scripts that model and export all game assets
- source: github-issue
- description: Build the asset factory for Platform 2.5, exactly as specified in .openspec/specs/asset-factory/spec.md (the contract; read it first).

Done looks like:
- Blender Python scripts under blender/ model, from primitives and modifiers only with procedural materials only: the player character as six separate named parts (torso, head, arm_left, arm_right, leg_left, leg_right) exported to assets/player.glb, plus ground_block, platform_floating, spike, coin and goal_flag, each exported to its own assets/*.glb with its contracted node names.
- blender/build_all.py is the single entry point that exports every asset; blender/render_lineup.py renders all six assets in a row to evidence/asset-lineup.png (960x540, Cycles CPU, at most 64 samples).
- Project tests under tests/ (node --test, run by npm test) verify spec scenarios S1 to S6 by parsing the glb files: existence, node names, size bounds (800 bytes to 5 MB), the lineup PNG dimensions, and a scan that no script imports external assets.
- The workflow provides pinned Blender 4.5.15 on PATH and runs a deterministic step after the line: blender --background --python blender/build_all.py, then blender/render_lineup.py, then the suite. The builder may run the scripts during its own station work too; the exported assets in the final tree must come from the committed scripts.

Palette and proportions are stated in the spec. No downloaded models, textures or images. No deployment in this work order; the run stops at the human gate with the lineup render as evidence.

GitHub issue: https://github.com/arananet/platform25/issues/1

Loopback round 2 directives (operator, from the round 1 reviews):
- The spec revision produced in round 1 is operator approved: .openspec/specs/asset-factory/spec.md as committed for this round is the approved contract. Do not modify anything under .openspec/specs/ in this round.
- reviewer-design finding: author design/DESIGN.md and design/tokens.json for this project, documenting the palette, the shape language and the quality bars from the spec Look section, so design review has its documented anchor. The tokens must match the colors the Blender scripts actually use.
- Keep the assets, the scripts and the tests as they are unless a directive above requires a change: scenarios S1 to S6 already pass and must keep passing.
- risk_hints: 
- status: new

## Upstream steps

- intake: completed
- spec-writer: executed
- test-writer: executed
- builder: executed
- reviewer-spec: executed
- reviewer-security: executed
- reviewer-tests: executed
- reviewer-architecture: executed
- reviewer-design: executed
- approver: completed
- approver: loopback
- triage-human: completed
- deployer: packet_ready
