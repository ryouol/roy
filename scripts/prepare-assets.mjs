import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const input = process.argv[2];
if (input) {
  for (const width of [800, 1600]) {
    await sharp(input)
      .resize({ width })
      .webp({ quality: 86 })
      .toFile(`public/scenery/alpine-${width}.webp`);
    await sharp(input)
      .resize({ width })
      .avif({ quality: 65 })
      .toFile(`public/scenery/alpine-${width}.avif`);
  }
}
// Keep every browser/home-screen size derived from the approved generated mark.
const mark = "src/assets/alpine-icon.png";
for (const [name, size] of [
  ["favicon-16", 16],
  ["favicon-32", 32],
  ["apple-touch-icon", 180],
  ["icon-192", 192],
  ["icon-512", 512],
]) {
  await sharp(mark).resize(size).png().toFile(`public/${name}.png`);
}
const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map((size) => sharp(mark).resize(size).png().toBuffer()),
);
const ico = Buffer.alloc(6 + 16 * sizes.length);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(sizes.length, 4);
let imageOffset = ico.length;
images.forEach((png, index) => {
  const entry = 6 + index * 16;
  ico[entry] = sizes[index];
  ico[entry + 1] = sizes[index];
  ico.writeUInt16LE(1, entry + 4);
  ico.writeUInt16LE(32, entry + 6);
  ico.writeUInt32LE(png.length, entry + 8);
  ico.writeUInt32LE(imageOffset, entry + 12);
  imageOffset += png.length;
});
await writeFile("src/app/favicon.ico", Buffer.concat([ico, ...images]));
