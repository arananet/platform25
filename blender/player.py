"""Six articulated pieces, standing 1.8 units tall."""
from common import box, material, pivot


def build():
    coral = material('Warm coral', (0.95, 0.19, 0.12))
    teal = material('Deep teal', (0.015, 0.24, 0.23))
    parts = [box('torso', (0.58, 0.34, 0.62), (0, 0, 1.05), coral, 0.045),
             box('head', (0.44, 0.38, 0.44), (0, 0, 1.58), coral, 0.065)]
    for side, x in [('left', -1), ('right', 1)]:
        arm = box(f'arm_{side}', (0.19, 0.27, 0.59),
                  (x * 0.405, 0, 1.025), teal, 0.035)
        pivot(arm, (x * 0.405, 0, 1.32))
        leg = box(f'leg_{side}', (0.23, 0.31, 0.74),
                  (x * 0.155, 0, 0.37), teal, 0.035)
        pivot(leg, (x * 0.155, 0, 0.74))
        parts.extend([arm, leg])
    return parts
