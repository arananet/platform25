# Task packet: reviewer-security

## Station prompt

# Reviewer Security

## Role
Check the change for security risks and unsafe defaults.

## Inputs
- code change

## Outputs
- review

## Rules
- Work only from the inputs listed above and the work order in the packet.
- Produce the output as a file in the repo, not as chat text.
- If the inputs are not enough, say what is missing instead of guessing.
- Never approve your own work. Approval belongs to a different station.
- Keep the change small and mapped to a spec scenario where one applies.


## Work order

- id: wo-gh-2
- kind: feature
- title: Playable slice: a 2.5D course you can run, jump and finish in the browser
- source: github-issue
- description: Build the playable slice of Platform 2.5, exactly as specified in .openspec/specs/playable-slice/spec.md (the contract; read it first, together with design/DESIGN.md and design/tokens.json for the look). Work order 1 (issue 1) was accepted by the owner on the evidence on 2026-10-30; this branch starts from its evidence head, so assets/, blender/, design/ and the asset factory tests are already in tree and must keep passing.

Done looks like:
- index.html plus src/ implement the game with Vite and Three.js (three and vite as dependencies, playwright as a devDependency, all from npm): a side view 2.5D course of about 60 units built from the six contracted assets in assets/ (player, ground_block, platform_floating, spike, coin, goal_flag), laid out from a course data table in code with every feature the spec lists in order (flat opening, coin 1 at about x = 5, a floating platform step over a pit, ground spikes, a 3 unit gap, a rising platform section, the goal flag at about x = 58, at least 8 coins).
- Controls and rules per spec: A/D or arrow keys run, Space or W jumps; fixed timestep physics with gravity, box collision and landing on platform tops; spikes and falls reset to the last grounded position with coins kept; the timer starts on first movement and stops at the goal; reaching the flag shows a completion overlay with coins and time, and R restarts.
- The character animates in code: pivot groups at the top end of arm_left, arm_right, leg_left and leg_right swing the limbs in opposite phase while running, addressed by the contracted part names.
- The game exposes the spec's test hook (window.__platform25 with getState and warpTo) so the automated checks can observe and verify play.
- Project tests under tests/ (node --test, run by npm test) verify spec scenarios S1 to S6: static checks on the entry, course data and declared dependencies, plus one Playwright browser check that builds the game, serves dist/ with vite preview, launches Chromium headless with software WebGL flags, drives the character with scripted keys to prove movement, a jump landing and a first coin pickup with no assistance, uses warpTo once to stand near the goal and walks into the flag with real key input, saves evidence/play-spawn.png, evidence/play-mid.png and evidence/play-goal.png at 1280 by 720, and requires ZERO console and page errors.
- npm run build succeeds and the work order 1 asset factory suite still passes.

No downloaded models, textures, images or fonts. No deployment in this work order; the run stops at the human gate with the screenshots as evidence.

GitHub issue: https://github.com/arananet/platform25/issues/2
- risk_hints: 
- status: new

## Upstream steps

- intake: completed
- spec-writer: executed
- test-writer: executed
- builder: executed
- reviewer-spec: executed
