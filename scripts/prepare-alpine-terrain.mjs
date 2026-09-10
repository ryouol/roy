// Reproducible Mont Blanc elevation asset. No browser-time data service needed.
// Source/attribution: https://github.com/tilezen/joerd/blob/master/docs/attribution.md
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const zoom = 12;
const origin = [2124, 1458];
const tileCount = 4;
const size = 1024;
const heights = new Uint16Array(size * size);
const sources = [];
await Promise.all(
  Array.from({ length: tileCount ** 2 }, async (_, index) => {
    const x = index % tileCount;
    const y = Math.floor(index / tileCount);
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${zoom}/${origin[0] + x}/${origin[1] + y}.png`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status}: ${url}`);
    const { data, info } = await sharp(
      Buffer.from(await response.arrayBuffer()),
    )
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let row = 0; row < 256; row++) {
      for (let col = 0; col < 256; col++) {
        const p = (row * 256 + col) * info.channels;
        heights[(y * 256 + row) * size + x * 256 + col] = Math.round(
          data[p] * 256 + data[p + 1] + data[p + 2] / 256 - 32768,
        );
      }
    }
    sources[index] = url;
  }),
);
const metresPerTile =
  (40075016.686 * Math.cos((45.85 * Math.PI) / 180)) / 2 ** zoom;
const metadata = {
  size,
  widthKm: (metresPerTile * tileCount) / 1000,
  zoom,
  origin,
  sources,
  encoding: "uint16 little-endian, elevation in metres; rows north to south",
  attribution:
    "Produced using Copernicus data and information funded by the European Union — EU-DEM layers. SRTM terrain data courtesy of the U.S. Geological Survey. Distributed by Mapzen/AWS.",
  modifications:
    "Elevation rounded to metres; terrain rendering exaggerates vertical relief and adds artistic snow materials.",
};
await mkdir("public/scenery", { recursive: true });
const buffer = Buffer.alloc(heights.length * 2);
heights.forEach((value, index) => buffer.writeUInt16LE(value, index * 2));
await writeFile("public/scenery/mont-blanc.bin", buffer);
await writeFile(
  "public/scenery/mont-blanc.json",
  JSON.stringify(metadata, null, 2) + "\n",
);
let maximum = 0,
  peak = 0;
heights.forEach((value, index) => {
  if (value > maximum) {
    maximum = value;
    peak = index;
  }
});
console.log({
  size,
  widthKm: metadata.widthKm,
  maximum,
  peak: [peak % size, Math.floor(peak / size)],
});
