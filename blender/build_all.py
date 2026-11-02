"""Run with blender --background --python blender/build_all.py."""
import sys
from pathlib import Path

# Keep the script directory text-only, including after module imports.
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))

import player
import ground_block
import platform_floating
import spike
import coin
import goal_flag
from common import export, reset

ASSETS = (player, ground_block, platform_floating, spike, coin, goal_flag)


def main():
    for module in ASSETS:
        reset()
        export(module.__name__, module.build())


if __name__ == '__main__':
    main()
