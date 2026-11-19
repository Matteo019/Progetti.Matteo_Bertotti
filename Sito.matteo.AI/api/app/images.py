"""Image uploads: every file is decoded and re-encoded to WebP, which drops EXIF/GPS data
and anything that is not a real image."""

import re
import uuid
from io import BytesIO
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps, UnidentifiedImageError

from .config import Settings

MAX_SIDE = 1600
NAME_RE = re.compile(r"^[0-9a-f]{32}\.webp$")

# Refuse decompression bombs well before Pillow's own (very high) limit
Image.MAX_IMAGE_PIXELS = 40_000_000


def is_valid_name(name: str) -> bool:
    return bool(NAME_RE.fullmatch(name))


def image_path(name: str, settings: Settings) -> Path:
    return settings.upload_dir / name


async def save_upload(file: UploadFile, settings: Settings) -> str:
    limit = settings.max_upload_mb * 1024 * 1024
    data = await file.read(limit + 1)
    if len(data) > limit:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, f"Immagine oltre {settings.max_upload_mb} MB")

    try:
        with Image.open(BytesIO(data)) as img:
            img = ImageOps.exif_transpose(img)
            img.thumbnail((MAX_SIDE, MAX_SIDE))
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
            out = BytesIO()
            img.save(out, "WEBP", quality=85, method=4)
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Il file non è un'immagine valida") from None

    name = f"{uuid.uuid4().hex}.webp"
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    image_path(name, settings).write_bytes(out.getvalue())
    return name


def delete_image(name: str | None, settings: Settings) -> None:
    if name and is_valid_name(name):
        image_path(name, settings).unlink(missing_ok=True)
