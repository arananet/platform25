import bpy
from common import box, finish, join, material


def build():
    steel = material('Light steel', (0.65, 0.72, 0.77), metallic=0.55)
    base = box('spike', (0.64, 0.64, 0.1), (0, 0, 0.05), steel)
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.4, radius2=0,
                                    depth=0.7, location=(0, 0, 0.45))
    tip = finish(bpy.context.object, 'Spike tip', steel)
    return join('spike', [base, tip])
