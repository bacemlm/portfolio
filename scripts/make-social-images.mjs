// Generates public/og.png (1200×630 social sharing image) and public/apple-touch-icon.png.
// Run with: npm run social
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

const monogram = (x, y, scale) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <path fill="#fafafa" fill-rule="evenodd" d="M5 7h13a6 6 0 0 1 4.3 10.2A6.5 6.5 0 0 1 18.5 29H5zM10.5 11.5v4.5H17a2.25 2.25 0 0 0 0-4.5zM10.5 20v4.5H18a2.25 2.25 0 0 0 0-4.5z"/>
    <path fill="#8b5cf6" d="M26.5 18h5v10.5H37v4.5H26.5z"/>
  </g>`;

// Dots on a sphere, echoing the hero visual.
const dots = [];
const count = 520;
const golden = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < count; i++) {
  const y = 1 - (i / (count - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const t = golden * i + 0.6;
  const x = Math.cos(t) * r;
  const z = Math.sin(t) * r;
  if (z < -0.15) continue;
  const depth = (z + 1) / 2;
  const mix = (y + 1) / 2;
  const red = Math.round(139 + (34 - 139) * mix);
  const green = Math.round(92 + (211 - 92) * mix);
  const blue = Math.round(246 + (238 - 246) * mix);
  dots.push(
    `<circle cx="${(930 + x * 250).toFixed(1)}" cy="${(315 + y * 250).toFixed(1)}" r="${(1 + depth * 2.6).toFixed(2)}" fill="rgb(${red},${green},${blue})" opacity="${(0.15 + depth * 0.75).toFixed(2)}"/>`,
  );
}

const font = "font-family='Segoe UI, Helvetica Neue, Arial, sans-serif'";
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="50%" r="55%">
      <stop offset="0" stop-color="#8b5cf6" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="text" x1="0" x2="1">
      <stop offset="0" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#67e8f9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#09090b"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${dots.join('')}
  ${monogram(72, 64, 1.7)}
  <text x="160" y="110" ${font} font-size="28" font-weight="600" fill="#fafafa">Bacem Lamloumi</text>
  <text x="76" y="330" ${font} font-size="92" font-weight="700" letter-spacing="-3" fill="#fafafa">I build</text>
  <text x="76" y="430" ${font} font-size="92" font-weight="700" letter-spacing="-3" fill="url(#text)">digital experiences.</text>
  <text x="80" y="548" font-family="Consolas, Menlo, monospace" font-size="24" letter-spacing="3" fill="#a1a1aa">FRONTEND DEVELOPER · GRAPHIC DESIGNER</text>
</svg>`;

const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#09090b"/>
  ${monogram(18, 14, 3.6)}
</svg>`;

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(path.join(publicDir, 'og.png'));
await sharp(Buffer.from(icon)).png({ compressionLevel: 9 }).toFile(path.join(publicDir, 'apple-touch-icon.png'));
console.log('Wrote public/og.png and public/apple-touch-icon.png');
