from PIL import Image
import os

SRC = "msw-dev-tools/resources/샤이닝레이"
DST = os.path.join(SRC, "padded")

seqs = {
    "effect": [(36,21),(99,78),(102,113),(120,121),(125,126),(126,125),(125,124),(124,124),
               (121,121),(120,121),(119,121),(118,119),(120,115),(122,116),(123,107),(125,104)],
    # frame 9 ori.txt = (120,12) -> 앞뒤 프레임(121) 대비 명백한 오탈자로 판단, 121로 보정
    "sineffect": [(78,203),(84,205),(358,290),(376,375),(380,375),(380,375),(380,375),(379,375),
                  (376,375),(376,375),(358,375),(353,375),(339,375),(312,375),(274,364),(268,349),
                  (255,342),(255,344),(252,330),(250,217)],
    "hit": [(84,84),(106,106),(108,104),(100,100),(91,89),(92,92),(91,91),(79,75)],
}

for name, origins in seqs.items():
    imgs = []
    for i in range(len(origins)):
        im = Image.open(os.path.join(SRC, f"{name}{i}.png")).convert("RGBA")
        imgs.append(im)
    L = max(o[0] for o in origins)
    T = max(o[1] for o in origins)
    R = max(im.width - o[0] for im, o in zip(imgs, origins))
    B = max(im.height - o[1] for im, o in zip(imgs, origins))
    W, H = L + R, T + B
    for i, (im, (ox, oy)) in enumerate(zip(imgs, origins)):
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        canvas.paste(im, (L - ox, T - oy))
        canvas.save(os.path.join(DST, f"{name}{i}.png"))
    wx = (W / 2 - L) / 100.0
    wy = (T - H / 2) / 100.0
    print(f"{name}: canvas {W}x{H}, origin ({L},{T}), world offset x={wx:.3f} y={wy:.3f}, frames={len(origins)}")
