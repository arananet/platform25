"""Rebuild the six assets with their shared builders and render review evidence."""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))

import bpy
from mathutils import Vector
from build_all import ASSETS
from common import ROOT, box, material, reset


def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


def main():
    reset()
    positions = (-5.2, -2.8, 0, 2.2, 3.8, 5.4)
    for module, x in zip(ASSETS, positions):
        for obj in module.build():
            obj.location.x += x
            if module.__name__ == 'platform_floating':
                obj.location.z += 0.55
    box('Studio floor', (200, 200, 0.1), (0, 0, -0.055),
        material('Backdrop', (0.055, 0.075, 0.10)))
    bpy.ops.object.camera_add(location=(7, -19, 9))
    camera = bpy.context.object
    aim(camera, (0.25, 0, 0.85))
    camera.data.type = 'ORTHO'
    camera.data.ortho_scale = 14.5
    scene = bpy.context.scene
    scene.camera = camera
    for location, power, size in [((-3, -6, 9), 2200, 8), ((4, 3, 7), 1700, 6)]:
        bpy.ops.object.light_add(type='AREA', location=location)
        light = bpy.context.object
        light.data.energy = power
        light.data.shape = 'DISK'
        light.data.size = size
        aim(light, (0, 0, 0))
    scene.world = bpy.data.worlds.new('Studio world')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.3, 0.3, 0.3, 1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.5
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 32
    scene.cycles.seed = 0
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 960
    scene.render.resolution_y = 540
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.view_settings.view_transform = 'AgX'
    directory = ROOT / 'evidence'
    directory.mkdir(exist_ok=True)
    scene.render.filepath = str(directory / 'asset-lineup.png')
    bpy.ops.render.render(write_still=True)


if __name__ == '__main__':
    main()
