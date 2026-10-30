from math import pi
from common import cylinder, join, material
import bpy


def build():
    white = material('White pole', (0.88, 0.91, 0.93), metallic=0.15)
    coral = material('Coral flag', (0.95, 0.12, 0.075))
    pole = cylinder('goal_flag', 0.035, 2.2, (0, 0, 1.1), white)
    # A three-sided cylinder makes a solid triangular flag from a primitive.
    flag = cylinder('Flag triangle', 1, 0.035, (0.25, 0, 1.89), coral,
                    vertices=3, rotation=(pi / 2, 0, 0))
    flag.dimensions = (0.75, 0.035, 0.52)
    bpy.context.view_layer.objects.active = flag
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return join('goal_flag', [pole, flag])
