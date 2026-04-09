#!/usr/bin/env python3
"""
Generate WebP thumbnails for group photos.

Outputs to material/group_photos/thumbs/
  - Gallery thumbnails: max 900px wide, WebP quality 82
  - Hero image: max 1600px wide, WebP quality 85 (suffix _hero)

Usage:
    pip install Pillow
    python generate_thumbnails.py
"""

from pathlib import Path
from PIL import Image, ImageOps

SRC_DIR = Path("material/group_photos")
THUMB_DIR = SRC_DIR / "thumbs"
THUMB_DIR.mkdir(exist_ok=True)

GALLERY_MAX_W = 900
GALLERY_QUALITY = 82

HERO_MAX_W = 1600
HERO_QUALITY = 85

# Hero image gets an extra _hero variant at larger size
HERO_SRC = "San_Sunset_MISO_2019-IMG_1089-HDR-Pano-Edit.jpg"

EXTENSIONS = {".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"}


def resize_and_save(src_path: Path, dest_path: Path, max_width: int, quality: int):
    with Image.open(src_path) as img:
        img = ImageOps.exif_transpose(img)  # respect EXIF orientation
        img = img.convert("RGB")
        w, h = img.size
        if w > max_width:
            new_w = max_width
            new_h = int(h * max_width / w)
            img = img.resize((new_w, new_h), Image.LANCZOS)
        img.save(dest_path, "WEBP", quality=quality, method=6)
    print(f"  {src_path.name} → {dest_path.name}  ({dest_path.stat().st_size // 1024} KB)")


print("Generating gallery thumbnails...")
for src in sorted(SRC_DIR.iterdir()):
    if src.suffix not in EXTENSIONS:
        continue
    dest = THUMB_DIR / (src.stem + ".webp")
    resize_and_save(src, dest, GALLERY_MAX_W, GALLERY_QUALITY)

print("\nGenerating hero thumbnail...")
hero_src = SRC_DIR / HERO_SRC
hero_dest = THUMB_DIR / (Path(HERO_SRC).stem + "_hero.webp")
resize_and_save(hero_src, hero_dest, HERO_MAX_W, HERO_QUALITY)

print("\nDone.")
