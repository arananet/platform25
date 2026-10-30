"""Primitive-only modeling helpers. Blender Z-up becomes glTF Y-up."""
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parents[1]


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, color, metallic=0.0, emission=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = 0.48
    shader.inputs['Metallic'].default_value = metallic
    shader.inputs['Emission Color'].default_value = (*color, 1)
    shader.inputs['Emission Strength'].default_value = emission
    return mat


def finish(obj, name, mat):
    obj.name = name
    obj.data.materials.append(mat)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    return obj


def box(name, dimensions, location, mat, bevel=0.0, top=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.dimensions = dimensions
    finish(obj, name, mat)
    if top:
        obj.data.materials.append(top)
        for face in obj.data.polygons:
            if face.normal.z > 0.5:
                face.material_index = 1
    if bevel:
        modifier = obj.modifiers.new('Soft edges', 'BEVEL')
        modifier.width = bevel
        modifier.segments = 2
    return obj


def cylinder(name, radius, depth, location, mat, vertices=32, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth,
                                      location=location, rotation=rotation)
    return finish(bpy.context.object, name, mat)


def join(name, objects):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    objects[0].name = name
    return [objects[0]]


def pivot(obj, location):
    bpy.context.scene.cursor.location = location
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')


def export(name, objects):
    directory = ROOT / 'assets'
    directory.mkdir(exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(directory / f'{name}.glb'),
                              export_format='GLB', use_selection=True,
                              export_apply=True, export_yup=True,
                              export_animations=False, export_cameras=False,
                              export_lights=False)
