#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy==2.2.6", "rasterio==1.4.4", "Pillow==12.3.0"]
# ///
"""Build the local Jungfrau–Mönch–Eiger terrain from official swisstopo data.

Run: uv run scripts/prepare-swiss-alps.py
Downloads are cached outside the repository; runtime assets require no data API.
The checked-in source manifest pins the chosen acquisition years and tile URLs.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
from pathlib import Path
import tempfile
import time
from urllib.request import Request, urlopen

import numpy as np
from PIL import Image
import rasterio
from rasterio.enums import Resampling
from rasterio.io import MemoryFile
from rasterio.transform import from_bounds


ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "public" / "scenery"
SOURCE_MANIFEST = DESTINATION / "swiss-alps-sources.json"


def download(source, cache):
    path = cache / source["url"].rsplit("/", 1)[1]
    if not path.exists():
        for attempt in range(4):
            try:
                request = Request(source["url"], headers={"User-Agent": "RoyLuoPortfolioAssetBuilder/1.0"})
                with urlopen(request, timeout=90) as response:
                    payload = response.read()
                temporary = path.with_suffix(".download")
                temporary.write_bytes(payload)
                temporary.replace(path)
                break
            except Exception:
                if attempt == 3:
                    raise
                time.sleep(2 ** attempt)
    return source, path


def mosaic(sources, bounds, cache, is_elevation):
    native_size = int((bounds["east"] - bounds["west"]) / 2)
    raster = np.empty((native_size, native_size) if is_elevation else (native_size, native_size, 3),
                      dtype=np.float32 if is_elevation else np.uint8)
    coverage = np.zeros((native_size // 500, native_size // 500), dtype=bool)
    checksums = {}
    with ThreadPoolExecutor(max_workers=6) as executor:
        pending = [executor.submit(download, source, cache) for source in sources]
        for index, future in enumerate(as_completed(pending), 1):
            source, path = future.result()
            easting, northing = [int(part) * 1000 for part in source["tile"].split("-")]
            x = int((easting - bounds["west"]) / 2)
            y = int((bounds["north"] - northing - 1000) / 2)
            with rasterio.open(path) as tile:
                if tile.crs.to_epsg() != 2056 or tile.shape != (500, 500):
                    raise ValueError(f"Unexpected raster layout: {path}")
                if not np.allclose(tuple(tile.bounds), (easting, northing, easting + 1000, northing + 1000)):
                    raise ValueError(f"Misaligned tile: {path}")
                data = tile.read(masked=True)
                if np.any(np.ma.getmaskarray(data)):
                    raise ValueError(f"Missing pixels: {path}")
                raster[y:y + 500, x:x + 500] = data[0] if is_elevation else np.moveaxis(data[:3], 0, -1)
                coverage[y // 500, x // 500] = True
            checksums[source["id"]] = hashlib.sha256(path.read_bytes()).hexdigest()
            if index % 20 == 0 or index == len(sources):
                print(f"{'Elevation' if is_elevation else 'Imagery'}: {index}/{len(sources)}", flush=True)
    if not coverage.all() or not np.isfinite(raster).all():
        raise ValueError("Incomplete or invalid terrain coverage")
    return raster, checksums


def resample_elevation(elevation, size, bounds):
    # Use the same complete extent as the aerial texture; north is the first row.
    transform = from_bounds(bounds["west"], bounds["south"], bounds["east"], bounds["north"],
                            elevation.shape[1], elevation.shape[0])
    with MemoryFile() as memory:
        with memory.open(driver="GTiff", height=elevation.shape[0], width=elevation.shape[1],
                         count=1, dtype="float32", crs="EPSG:2056", transform=transform) as source:
            source.write(elevation, 1)
            result = source.read(1, out_shape=(size, size), resampling=Resampling.bilinear)
    if result.min() < 0 or result.max() > 65535:
        raise ValueError("Elevation exceeds uint16 encoding")
    return np.rint(result).astype("<u2")


def write_preview(elevation, imagery, directory):
    directory.mkdir(parents=True, exist_ok=True)
    image = Image.fromarray(imagery)
    image.thumbnail((1600, 1600))
    image.save(directory / "swiss-alps-color.jpg", quality=95)
    # Diagnostic hillshade only. Runtime color retains the unmodified aerial RGB.
    dy, dx = np.gradient(elevation, 2)
    light = np.array([-0.45, -0.55, 0.70])
    light /= np.linalg.norm(light)
    normal_length = np.sqrt(dx * dx + dy * dy + 1)
    shade = np.clip((-dx * light[0] - dy * light[1] + light[2]) / normal_length, 0, 1)
    diagnostic = Image.fromarray(np.uint8(255 * (0.18 + 0.82 * shade)))
    diagnostic.thumbnail((1600, 1600))
    diagnostic.save(directory / "swiss-alps-hillshade.jpg", quality=94)


def write_normal_map(elevation):
    # Terrain axes: x=east, y=up, z=south. Derive normals before downsampling,
    # retaining more of the native 2m slope variation than the geometry grid.
    gradient_row, gradient_x = np.gradient(elevation, 2)
    denominator = np.sqrt(gradient_x * gradient_x + gradient_row * gradient_row + 1)
    encoded = np.empty((*elevation.shape, 3), dtype=np.uint8)
    encoded[..., 0] = np.rint((-gradient_x / denominator * 0.5 + 0.5) * 255).astype(np.uint8)
    encoded[..., 1] = np.rint((1 / denominator * 0.5 + 0.5) * 255).astype(np.uint8)
    encoded[..., 2] = np.rint((-gradient_row / denominator * 0.5 + 0.5) * 255).astype(np.uint8)
    reduced = Image.fromarray(encoded).resize((2048, 2048), Image.Resampling.BOX)
    vectors = np.asarray(reduced).astype(np.float32) / 127.5 - 1
    vectors /= np.maximum(np.linalg.norm(vectors, axis=-1, keepdims=True), 1e-6)
    final = np.rint(np.clip(vectors * 0.5 + 0.5, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(final).save(DESTINATION / "swiss-alps-normal.webp", quality=95, method=6)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--size", type=int, default=1025, choices=(1025, 1536, 2048))
    parser.add_argument("--cache", type=Path, default=Path(tempfile.gettempdir()) / "roy-swiss-alps-cache")
    parser.add_argument("--preview-dir", type=Path, default=Path(tempfile.gettempdir()))
    args = parser.parse_args()
    args.cache.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(SOURCE_MANIFEST.read_text())
    bounds = manifest["bounds"]
    elevation, elevation_checksums = mosaic(manifest["elevation"], bounds, args.cache, True)
    imagery, imagery_checksums = mosaic(manifest["imagery"], bounds, args.cache, False)
    heights = resample_elevation(elevation, args.size, bounds)
    heights.tofile(DESTINATION / "swiss-alps.bin")
    Image.fromarray(imagery).save(DESTINATION / "swiss-alps-albedo.webp", quality=94, method=6)
    write_normal_map(elevation)
    metadata = {
        "name": "Jungfrau, Mönch and Eiger",
        "size": args.size,
        "widthKm": 10,
        "bounds": bounds,
        "encoding": "uint16 little-endian, elevation in metres; rows north to south, columns west to east",
        "nativeGroundResolutionMetres": 2,
        "heightGroundResolutionMetres": 10000 / args.size,
        "textureSize": [int(imagery.shape[1]), int(imagery.shape[0])],
        "normalMapSize": [2048, 2048],
        "normalMapEncoding": "Object-space RGB = (normal * 0.5 + 0.5) * 255. Axes: x=east, y=up, z=south. Native 2m gradients averaged to 4.88m and renormalized; relief=1. WebP quality95 approximates the normals.",
        "minimumElevationMetres": int(heights.min()),
        "maximumElevationMetres": int(heights.max()),
        "attribution": "©swisstopo",
        "attributionUrl": "https://www.swisstopo.admin.ch/",
        "licenseUrl": "https://www.swisstopo.admin.ch/en/terms-of-use-free-geodata-and-geoservices",
        "elevationProductUrl": "https://www.swisstopo.admin.ch/en/height-model-swissalti3d",
        "imageryProductUrl": "https://www.swisstopo.admin.ch/en/orthoimage-swissimage-10",
        "modifications": "Mosaicked 2m source tiles. Elevation bilinearly resampled and rounded to whole metres. Aerial RGB unchanged before WebP encoding.",
        "sources": {"elevation": manifest["elevation"], "imagery": manifest["imagery"]},
        "sourceSha256": dict(sorted({**elevation_checksums, **imagery_checksums}.items())),
    }
    (DESTINATION / "swiss-alps.json").write_text(json.dumps(metadata, indent=2) + "\n")
    write_preview(elevation, imagery, args.preview_dir)
    print(json.dumps({key: metadata[key] for key in ("size", "widthKm", "textureSize", "minimumElevationMetres", "maximumElevationMetres")}), flush=True)


if __name__ == "__main__":
    main()
