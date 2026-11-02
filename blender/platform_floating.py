from common import box, material


def build():
    stone = material('Platform stone', (0.36, 0.32, 0.27))
    top = material('Light stone top', (0.63, 0.58, 0.48))
    return [box('platform_floating', (2, 1.2, 0.4), (0, 0, 0.2), stone, top=top)]
