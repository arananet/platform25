# Review: reviewer-tests (wo-gh-1)

Verdict: pass

- tests/asset-factory.test.js has one test per scenario, named S1 to S6, each mapped to the spec text.
- `npm test` (node --test "tests/**/*.test.js") ran 6 tests: 6 pass, 0 fail, 0 skipped.
- S1 to S4 parse the real glb header and JSON chunk (magic, length, chunk type) and check node names, so they test real files.
- S2 requires exactly one node for each of the six part names.
- S4 uses the 800 byte and 5 MB bounds from the spec.
- S5 checks the PNG signature and the IHDR width and height (960x540).
- S6 scans every file under blender/ for import_scene, image.load and bpy.data.images.load, and rejects binary files.
- Gaps (non-blocking): S3 checks only that the node exists, not that it is the only one. R4 (deterministic structure) and the Cycles/64-sample limit are not tested, and the spec does not require tests for them. A stray `__pycache__` under blender/ would fail S6, which is strict but consistent with the spec.
