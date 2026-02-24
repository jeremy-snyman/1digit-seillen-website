#!/usr/bin/env python3
"""
Remove baked-in checkerboard transparency pattern from AI-generated images.

The Nano Banana AI generator rendered a transparency checkerboard as actual
pixel data. This script detects the grey checkerboard squares (low saturation)
and replaces them with real alpha transparency, preserving the blue/cyan
holographic foreground elements.

Usage:
    python3 scripts/remove-checkerboard.py
"""

import colorsys
import os
from pathlib import Path
from PIL import Image

# Project root (one level up from scripts/)
ROOT = Path(__file__).resolve().parent.parent
INPUT_DIR = ROOT / "images"
OUTPUT_DIR = ROOT / "public" / "images" / "what-we-do"

# Mapping: source filename → output filename
FILE_MAP = {
    "what-we-do-2.png":  "ai-readiness-thumb.png",
    "what-we-do-3.png":  "data-platforms-thumb.png",
    "what-we-do-4.png":  "ai-products-thumb.png",
    "what-we-do-5.png":  "governance-thumb.png",
    "what-we-do-6.png":  "ai-readiness-detail.png",
    "what-we-do-7.png":  "data-platforms-detail.png",
    "what-we-do-8.png":  "ai-products-detail.png",
    "what-we-do-9.png":  "governance-detail.png",
    "what-we-do-10.jpeg": "positioning-accent.png",
}

# --- Image 10 (dark blue background, no checkerboard) ---
IMG10_BG_VALUE_THRESHOLD = 0.12


def process_checkerboard_image(img: Image.Image) -> Image.Image:
    """Remove grey checkerboard background from images 2-9.

    The composited pixel C is: C = alpha * Foreground + (1-alpha) * Background
    where Background alternates between grey_light and grey_dark.

    Strategy:
    1. Build a "local background" estimate by median-filtering the image
       at the checkerboard frequency — this averages out the checkerboard
       into a smooth grey field.
    2. Compute each pixel's deviation from this local grey → alpha.
    3. Un-multiply the colour: reconstruct the pure foreground colour by
       removing the grey background contribution.
    4. Smooth the alpha channel to remove any residual grid artefacts.
    """
    import numpy as np
    from PIL import ImageFilter

    img = img.convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]

    # --- Step 1: Estimate local background grey ---
    # The checkerboard has ~15px period. A large median filter on the
    # luminance channel gives us the smooth local grey level.
    grey = (r + g + b) / 3.0
    grey_img = Image.fromarray(grey.astype(np.uint8), "L")
    # Median filter with kernel > checkerboard period → smooth background
    bg_img = grey_img.filter(ImageFilter.MedianFilter(size=17))
    bg = np.array(bg_img, dtype=np.float32)

    # --- Step 2: Compute alpha from colour deviation ---
    # Chroma measures how far each pixel is from pure grey
    rgb_stack = np.stack([r, g, b], axis=-1)
    ch_max = rgb_stack.max(axis=-1)
    ch_min = rgb_stack.min(axis=-1)
    chroma = ch_max - ch_min
    sat = np.where(ch_max > 0, chroma / ch_max, 0.0)

    # Alpha from chroma
    CHROMA_ZERO = 2.0
    CHROMA_FULL = 30.0
    alpha_chroma = np.clip(
        (chroma - CHROMA_ZERO) / (CHROMA_FULL - CHROMA_ZERO), 0.0, 1.0
    )

    # Alpha from saturation (catches bright glow with low absolute chroma)
    SAT_ZERO = 0.02
    SAT_FULL = 0.15
    alpha_sat = np.clip(
        (sat - SAT_ZERO) / (SAT_FULL - SAT_ZERO), 0.0, 1.0
    )

    new_alpha = np.maximum(alpha_chroma, alpha_sat)

    # --- Step 3: Un-multiply colours ---
    # Where alpha < 1, the displayed pixel was:
    #   C = alpha * FG + (1-alpha) * BG
    # Solve for FG: FG = (C - (1-alpha)*BG) / alpha
    # This removes the grey contamination from the foreground colour.
    alpha_safe = np.maximum(new_alpha, 0.01)  # avoid division by zero
    for ch in range(3):
        c = arr[:,:,ch]
        fg = (c - (1.0 - new_alpha) * bg) / alpha_safe
        # Only apply un-mixing where alpha is partial (avoid artefacts on solid pixels)
        mask = new_alpha < 0.95
        arr[:,:,ch] = np.where(mask, np.clip(fg, 0, 255), c)

    # --- Step 4: Smooth RGB channels to remove checkerboard-frequency noise ---
    # The original checkerboard modulates brightness at ~15px period.
    # Even after un-mixing, the RGB data retains this alternating pattern.
    # A median filter >= the checkerboard period removes it.
    # Blend the smoothed version in based on how "partial" the alpha is.
    for ch in range(3):
        ch_img = Image.fromarray(arr[:,:,ch].astype(np.uint8), "L")
        ch_smooth = ch_img.filter(ImageFilter.MedianFilter(size=17))
        ch_smooth = ch_smooth.filter(ImageFilter.GaussianBlur(radius=1))
        ch_smooth_arr = np.array(ch_smooth, dtype=np.float32)
        # Blend: fully smoothed where alpha is low, original where alpha is high
        # This preserves sharp detail in solid foreground areas
        blend = np.clip(new_alpha * 2.0, 0.0, 1.0)  # 0→0.5 alpha → full smooth, 0.5→1 → original
        arr[:,:,ch] = blend * arr[:,:,ch] + (1.0 - blend) * ch_smooth_arr

    # --- Step 5: Smooth the alpha channel ---
    alpha_255 = (new_alpha * 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha_255, "L")
    # Median kernel must exceed the ~15px checkerboard period
    alpha_img = alpha_img.filter(ImageFilter.MedianFilter(size=17))
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=3))
    arr[:,:,3] = np.array(alpha_img, dtype=np.float32)

    return Image.fromarray(arr.astype(np.uint8))


def process_dark_bg_image(img: Image.Image) -> Image.Image:
    """Remove dark blue background from image 10."""
    import numpy as np

    img = img.convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

    # Value = max(R,G,B) / 255
    v = np.stack([r, g, b], axis=-1).max(axis=-1) / 255.0

    threshold = IMG10_BG_VALUE_THRESHOLD
    # Dark pixels → proportional alpha
    mask = v < threshold
    t = np.where(mask, v / threshold, 1.0)
    new_alpha = (t * 255).astype(np.uint8)
    final_alpha = np.minimum(a.astype(np.uint8), new_alpha)

    arr[:,:,3] = final_alpha.astype(np.float32)
    return Image.fromarray(arr.astype(np.uint8))


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for src_name, dst_name in FILE_MAP.items():
        src_path = INPUT_DIR / src_name
        dst_path = OUTPUT_DIR / dst_name

        if not src_path.exists():
            print(f"  SKIP  {src_name} (not found)")
            continue

        print(f"  Processing {src_name} → {dst_name} ...", end="", flush=True)
        img = Image.open(src_path)

        if src_name == "what-we-do-10.jpeg":
            result = process_dark_bg_image(img)
        else:
            result = process_checkerboard_image(img)

        result.save(dst_path, "PNG")
        print(f" ✓ ({result.size[0]}x{result.size[1]})")

    print(f"\nDone. Output in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
