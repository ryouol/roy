// EOX Sentinel-2 cloudless 2016 is CC BY 4.0. No external runtime requests.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const base =
  "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/14";
const count = 16;
const composites = [];
const sources = [];
// Bounded parallel reads of the 27km terrain footprint.
for (let batch = 0; batch < count * count; batch += 8) {
  await Promise.all(
    Array.from({ length: 8 }, async (_, offset) => {
      const index = batch + offset;
      const x = index % count,
        y = Math.floor(index / count);
      const url = `${base}/${5832 + y}/${8496 + x}.jpg`;
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok)
        throw new Error(`Imagery request failed: ${response.status} ${url}`);
      composites.push({
        input: Buffer.from(await response.arrayBuffer()),
        left: x * 256,
        top: y * 256,
      });
      sources[index] = url;
    }),
  );
}
await sharp({
  create: { width: 4096, height: 4096, channels: 3, background: "white" },
})
  .composite(composites)
  .webp({ quality: 93 })
  .toFile("public/scenery/mont-blanc-albedo.webp");
await writeFile(
  "public/scenery/imagery-attribution.json",
  JSON.stringify(
    {
      sources,
      credit:
        "Sentinel-2 cloudless by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)",
      url: "https://s2maps.eu",
      license: "https://creativecommons.org/licenses/by/4.0/",
      modifications:
        "Cropped to the Mont Blanc terrain footprint; encoded as WebP; rendered with cool color grading and artistic snow materials.",
    },
    null,
    2,
  ) + "\n",
);
console.log(await sharp("public/scenery/mont-blanc-albedo.webp").metadata());
