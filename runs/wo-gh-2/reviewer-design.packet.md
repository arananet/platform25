# Task packet: reviewer-design

## Station prompt

# Reviewer Design

## Role
Judge interface output against the project's own design system: its design tokens, component and layout rules, motion rules, and quality bars.

## Inputs
- design system (tokens, rules, quality bars from design/DESIGN.md and design/tokens.json)
- interface output (HTML, React components, CSS, user-facing pages, or other interface artifacts)

## Outputs
- review (JSON format with verdict and findings)

## Rules
- Work only from the inputs listed above and the work order in the packet.
- If the project has no design system (no design/DESIGN.md), your verdict MUST be `changes_requested` with a finding stating that no design system exists for the project.
- If the project has a design system, review the interface output against:
  - Design tokens: Are the correct colors, typography, spacing values being used?
  - Component and layout rules: Do components follow the documented patterns?
  - Motion rules: Does any animation or transition follow the motion guidelines?
  - Quality bars: Does the interface meet the stated quality bars for visual hierarchy, scale contrast, spacing rhythm, and responsive behavior?
- Focus on the design system the project has defined. Do not impose external design opinions or preferences that are not documented in the project's design system.
- A design token marked as "TODO" or placeholder means the project hasn't defined that value yet. Flag missing values as findings only if the interface output actually uses undefined tokens.
- Findings should be specific and actionable: cite which quality bar was violated, which token was used incorrectly, or which rule was not followed.
- Your verdict must be one of: `approved`, `changes_requested`, or `comment`.
- Produce the output as a JSON object, not as chat text.

## Output Format

Return a JSON object with this structure:

```json
{
  "station": "reviewer-design",
  "verdict": "approved | changes_requested | comment",
  "findings": [
    "Specific finding with reference to design system rule or quality bar",
    "Another finding if applicable"
  ]
}
```

## Examples

### Example 1: No design system exists
```json
{
  "station": "reviewer-design",
  "verdict": "changes_requested",
  "findings": [
    "No design system exists for this project. The project must define design/DESIGN.md and design/tokens.json before interface output can be reviewed against design standards."
  ]
}
```

### Example 2: Interface violates quality bar
```json
{
  "station": "reviewer-design",
  "verdict": "changes_requested",
  "findings": [
    "Quality bar violation: Scale Contrast - The button text has only 2.8:1 contrast ratio against its background, failing the minimum 4.5:1 requirement stated in the quality bars.",
    "Token usage: The page uses hardcoded color '#FF5733' instead of the defined primary color token."
  ]
}
```

### Example 3: Interface meets design system
```json
{
  "station": "reviewer-design",
  "verdict": "approved",
  "findings": []
}
```


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
- reviewer-security: executed
- reviewer-tests: executed
- reviewer-architecture: executed

## Project design

### Design tokens

```json
{
  "$description": "Platform 2.5 asset palette. 'linear' values are the exact Principled BSDF Base Color values used in blender/*.py; 'hex' is the sRGB equivalent.",
  "color": {
    "coral": {
      "linear": [
        0.95,
        0.19,
        0.12
      ],
      "hex": "#f97961",
      "use": "player torso and head (blender/player.py)"
    },
    "teal": {
      "linear": [
        0.015,
        0.24,
        0.23
      ],
      "hex": "#218684",
      "use": "player arms and legs (blender/player.py)"
    },
    "stone": {
      "linear": [
        0.36,
        0.32,
        0.27
      ],
      "hex": "#a2998e",
      "use": "ground block sides, floating platform body"
    },
    "grass": {
      "linear": [
        0.18,
        0.55,
        0.065
      ],
      "hex": "#76c448",
      "use": "ground block top face"
    },
    "stoneTop": {
      "linear": [
        0.63,
        0.58,
        0.48
      ],
      "hex": "#d0c8b8",
      "use": "floating platform top"
    },
    "steel": {
      "linear": [
        0.65,
        0.72,
        0.77
      ],
      "hex": "#d3dde3",
      "use": "spike",
      "metallic": 0.55
    },
    "gold": {
      "linear": [
        1.0,
        0.57,
        0.025
      ],
      "hex": "#ffc72c",
      "use": "coin",
      "metallic": 0.65,
      "emissionStrength": 0.2
    },
    "flagPole": {
      "linear": [
        0.88,
        0.91,
        0.93
      ],
      "hex": "#f1f5f7",
      "use": "goal flag pole",
      "metallic": 0.15
    },
    "flagCoral": {
      "linear": [
        0.95,
        0.12,
        0.075
      ],
      "hex": "#f9614d",
      "use": "goal flag cloth"
    },
    "backdrop": {
      "linear": [
        0.055,
        0.075,
        0.1
      ],
      "hex": "#424d59",
      "use": "lineup render ground plane (blender/render_lineup.py)"
    }
  },
  "material": {
    "roughness": 0.48,
    "textures": false,
    "shader": "Principled BSDF, flat procedural base color"
  },
  "shape": {
    "language": "primitives and modifiers only; bold boxes and cylinders with small bevels",
    "bevel": {
      "torso": 0.045,
      "head": 0.065
    }
  },
  "render": {
    "width": 960,
    "height": 540,
    "engine": "CYCLES",
    "device": "CPU",
    "maxSamples": 64
  }
}
```

