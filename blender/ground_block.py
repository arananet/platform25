from common import box, material


def build():
    stone = material('Warm stone', (0.36, 0.32, 0.27))
    grass = material('Grass green', (0.18, 0.55, 0.065))
    return [box('ground_block', (2, 2, 1), (0, 0, 0.5), stone, top=grass)]
