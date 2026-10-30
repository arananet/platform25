I wrote the S1–S6 tests in `tests/asset-factory.test.js`. All six fail right now, as expected: there are no scripts, `assets/` or `evidence/` yet.

- **Coverage:**
  - S1 checks that each of the six `.glb` files exists and is non-empty.
  - S2 checks that `player.glb` has exactly one node for each of the six part names.
  - S3 checks that each platform-set file has a node with its own name.
  - S4 checks that every `.glb` is between 800 bytes and 5 MB.
  - S5 checks that `evidence/asset-lineup.png` is a PNG at 960x540.
  - S6 scans `blender/` for `import_scene`, `image.load` and `bpy.data.images.load`. It also fails if any file there is binary or isn't `.py`, `.md`, `.txt` or `.json`.
- **No Blender at test time:** The tests parse the glTF JSON chunk and the PNG header directly.
- **Needs review:** I changed the `test` script in `package.json`. The original `node --test tests/` fails on the runner's Node 22.23.4, which treats `tests/` as a module path and exits with MODULE_NOT_FOUND. It is now `node --test "tests/**/*.test.js"`. This is outside the test-writer's outputs, so please confirm it.

{"model": "claude-sonnet-5-5", "runtime": "claude-code"}
