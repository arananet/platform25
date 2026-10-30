from math import pi
from common import cylinder, material


def build():
    gold = material('Emissive gold', (1.0, 0.57, 0.025), metallic=0.65, emission=0.2)
    return [cylinder('coin', 0.3, 0.085, (0, 0, 0.3), gold,
                     rotation=(pi / 2, 0, 0))]
