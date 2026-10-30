# Security review: wo-gh-1 (reviewer-security)

Verdict: pass

Scope: blender/*.py, tests/asset-factory.test.js, package.json change.

Findings:
- No network access, subprocess, eval/exec, or dynamic imports in blender/*.py or the tests.
- Scripts import only bpy, mathutils, stdlib (sys, pathlib, math) and sibling modules. No external assets are loaded.
- File writes are confined to ROOT/assets and ROOT/evidence, with fixed names built from module names. No user-controlled paths.
- build_all.py sets sys.dont_write_bytecode and prepends only its own directory to sys.path. This is acceptable.
- package.json: the test glob changed to "tests/**/*.test.js". There are no new dependencies and no new install scripts.
- Minor, non-blocking: sys.path.insert(0, ...) gives the blender/ directory precedence over stdlib module names, so a future file named like a stdlib module would shadow it. Current filenames do not collide.
