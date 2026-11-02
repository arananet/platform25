I added `design/DESIGN.md` and `design/tokens.json`. I didn't run the tests or the Blender pipeline, since nothing they cover changed. I also wrote a short `runs/wo-gh-1/spec-writer.output.md` for this station.

- **Colors:** Every color token carries the exact linear Base Color value from `blender/*.py`, plus an sRGB hex I converted from it. The tokens cover the coral and teal character, stone, grass, lighter stone top, steel, gold, the white pole, the coral-red flag and the lineup backdrop. I also recorded the metallic and emission values the scripts use for the spike, coin and pole.
- **Other tokens:** The roughness (0.48) and the two bevel sizes (torso 0.045, head 0.065) come from the scripts. The render settings (960x540, Cycles on CPU, at most 64 samples) come from the spec.
- **`DESIGN.md`:** It covers the shape language, a palette table keyed to each asset part, and the quality bars from the spec Look section.

I didn't touch `.openspec/specs/`, the scripts, the assets or the tests.

{"model": "claude-sonnet-5-5", "runtime": "claude-code"}
