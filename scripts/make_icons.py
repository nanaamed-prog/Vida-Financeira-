"""Gera os ícones do app (web + Android) a partir de um desenho vetorial simples."""
from PIL import Image, ImageDraw
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = 1024

def draw(size, rounded=True, pad=0.0):
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # fundo com gradiente esmeralda -> teal
    bg = Image.new("RGBA", (S, S))
    bd = ImageDraw.Draw(bg)
    for y in range(S):
        t = y / S
        c = (int(16 + (13 - 16) * t), int(185 + (148 - 185) * t), int(129 + (136 - 129) * t), 255)
        bd.line([(0, y), (S, y)], fill=c)
    mask = Image.new("L", (S, S), 0)
    md = ImageDraw.Draw(mask)
    if rounded:
        md.ellipse([0, 0, S - 1, S - 1], fill=255)
    else:
        md.rectangle([0, 0, S, S], fill=255)
    img.paste(bg, (0, 0), mask)
    # barras crescentes
    inset = S * (0.26 + pad)
    w = S - 2 * inset
    bw = w / 5
    heights = [0.35, 0.6, 0.9]
    base = S - inset
    for i, h in enumerate(heights):
        x0 = inset + i * bw * 2 - (bw * 0 if i == 0 else 0)
        x0 = inset + i * (bw * 2)
        d.rounded_rectangle([x0, base - w * h, x0 + bw * 1.15, base], radius=bw * 0.3, fill=(255, 255, 255, 255))
    # seta
    d.line([(inset, base - w * 0.55), (inset + w * 0.45, base - w * 0.95), (inset + w * 1.0, base - w * 1.1)],
           fill=(2, 6, 23, 230), width=int(S * 0.035), joint="curve")
    return img.resize((size, size), Image.LANCZOS)

def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path)

save(draw(192, rounded=False), f"{ROOT}/public/icon-192.png")
save(draw(512, rounded=False), f"{ROOT}/public/icon-512.png")
res = f"{ROOT}/android/app/src/main/res"
for name, px in {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}.items():
    save(draw(px, rounded=True), f"{res}/mipmap-{name}/ic_launcher.png")
