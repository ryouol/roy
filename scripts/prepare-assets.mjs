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
const mark = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#10282b"/><path d="M80 364 204 144l66 116 44-72 118 176H80Z" fill="none" stroke="#e7e9da" stroke-width="24" stroke-linejoin="round"/><circle cx="365" cy="133" r="22" fill="#e0bc87"/></svg>',
);
await writeFile("public/icon.svg", mark);
for (const [name, size] of [
  ["favicon-16", 16],
  ["favicon-32", 32],
  ["apple-touch-icon", 180],
  ["icon-192", 192],
  ["icon-512", 512],
]) {
  await sharp(mark).resize(size).png().toFile(`public/${name}.png`);
}
const png = await sharp(mark).resize(32).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico[6] = 32;
ico[7] = 32;
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png.length, 14);
ico.writeUInt32LE(22, 18);
await writeFile("src/app/favicon.ico", Buffer.concat([ico, png]));
