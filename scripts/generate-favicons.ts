/**
 * Generate the favicons, the navbar logo and the social preview image from
 * public/favicon.png (the Nino icon).
 *
 * Usage: bun run favicons
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import ico from 'sharp-ico';

const publicDir = path.resolve(import.meta.dirname, '../public');
const source = path.join(publicDir, 'favicon.png');

const pngVariants = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'logo.png', size: 128 },
];

function resize(size: number) {
  return sharp(source).resize(size, size, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
}

// 1200x630 card: navy background, glow, icon and title
async function socialImage() {
  const background =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="60%">
      <stop offset="0" stop-color="#6366f1" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#0b0e24" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="text" x1="0" x2="1">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.4" stop-color="#3b82f6"/>
      <stop offset="0.7" stop-color="#6366f1"/>
      <stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0b0e24"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="600" y="470" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="96" font-weight="800" fill="url(#text)">Nino</text>
  <text x="600" y="540" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="34" fill="#c7cbe8">High-performance binary serialization for C#</text>
</svg>`);
  const icon = await resize(260).png().toBuffer();
  await sharp(background)
    .composite([{ input: icon, top: 80, left: 470 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'og.png'));
  console.log('  og.png (1200x630)');
}

async function main() {
  console.log('Generating icons from', path.relative('.', source));

  await Promise.all(
    pngVariants.map(async ({ name, size }) => {
      await resize(size)
        .png({ compressionLevel: 9 })
        .toFile(path.join(publicDir, name));
      console.log(`  ${name} (${size}x${size})`);
    }),
  );

  const icoSizes = [16, 32, 48];
  const buffers = await Promise.all(
    icoSizes.map((size) => resize(size).png().toBuffer()),
  );
  await writeFile(path.join(publicDir, 'favicon.ico'), ico.encode(buffers));
  console.log(`  favicon.ico (${icoSizes.join('+')})`);

  await socialImage();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
