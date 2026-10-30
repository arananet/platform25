I revised `.openspec/specs/asset-factory/spec.md`, which already matched the work order, in three small ways. I haven't committed the change or run any scripts or tests.

- **Contradiction fixed:** the Pipeline contract said `render_lineup.py` "imports all six assets into one scene". That would need `import_scene`, which scenario S6 and requirement R1 ban anywhere under `blender/`. The spec now says the lineup script builds the six assets by calling the same per-asset build functions the asset modules use, and must not call a glTF importer. The builder therefore has to write each asset module with a callable build function.
- **Wording fixed:** I removed the stray phrase "dark boots area not required" from the Character look line.
- **Status changed:** it was "approved for build" and is now "revised, awaiting approval". Approval of this revision belongs to a different station, so I didn't carry it over.

The asset list, palette, proportions, scenarios S1–S6 and size bounds are unchanged.

{"model": "claude-sonnet-5-5", "runtime": "claude-code"}
