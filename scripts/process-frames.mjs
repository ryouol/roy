/* Convert picked demo stills (assets/frames/picked/*.png) into web assets:
   AVIF + WebP at 1600 and 800 wide → public/frames/.
   Budget: ≤150KB per file — quality steps down until each fits.

   Usage: node scripts/process-frames.mjs */

import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets/frames/picked";
const OUT = "public/frames";
const WIDTHS = [1600, 800];
const BUDGET = 150 * 1024;

const encoders = {
  avif: (img, quality) => img.avif({ quality, effort: 6 }),
  webp: (img, quality) => img.webp({ quality }),
};

const startQuality = { avif: 55, webp: 74 };

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => f.endsWith(".png"));

for (const file of files) {
  const name = path.basename(file, ".png");
  for (const width of WIDTHS) {
    for (const [ext, encode] of Object.entries(encoders)) {
      const dest = path.join(OUT, `${name}-${width}.${ext}`);
      let quality = startQuality[ext];
      for (;;) {
        await encode(
          sharp(path.join(SRC, file)).resize({ width }),
          quality
        ).toFile(dest);
        const { size } = await stat(dest);
        if (size <= BUDGET || quality <= 30) {
          console.log(
            `${dest}  ${(size / 1024).toFixed(0)}KB  q${quality}${size > BUDGET ? "  ⚠ over budget" : ""}`
          );
          break;
        }
        quality -= 8;
      }
    }
  }
}
