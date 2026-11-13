// Converts the original artwork in assets-src/ into responsive AVIF + WebP files
// in public/img/, and writes src/data/images.json (dimensions + available widths).
// Run with: npm run images
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'assets-src');
const outDir = path.join(root, 'public', 'img');

// name (without extension) -> target widths
const ICONS = ['html', 'css', 'js', 'js-flat', 'sass', 'php', 'psd', 'illustrator', 'indesign', 'figma', 'canva', 'vscode'];
const PHOTO_WIDTHS = [640, 1024, 1600];
const ICON_WIDTHS = [96];
const SKIP = new Set(['bl-monogram', 'js-flat']);

await mkdir(outDir, { recursive: true });
const manifest = {};

for (const file of (await readdir(srcDir)).sort()) {
  const name = path.parse(file).name;
  if (SKIP.has(name)) continue;
  const input = path.join(srcDir, file);
  const meta = await sharp(input).metadata();
  const isIcon = ICONS.includes(name);
  const widths = (isIcon ? ICON_WIDTHS : PHOTO_WIDTHS).filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  if (!isIcon && meta.width > widths.at(-1) && meta.width < PHOTO_WIDTHS.at(-1)) widths.push(meta.width);

  for (const w of widths) {
    const base = sharp(input).resize({ width: w, withoutEnlargement: true });
    await base.clone().webp({ quality: isIcon ? 90 : 78 }).toFile(path.join(outDir, `${name}-${w}.webp`));
    if (!isIcon) await base.clone().avif({ quality: 55 }).toFile(path.join(outDir, `${name}-${w}.avif`));
  }
  manifest[name] = { width: meta.width, height: meta.height, widths, avif: !isIcon };
  console.log(`${name}: ${widths.join(', ')}`);
}

await writeFile(path.join(root, 'src', 'data', 'images.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Wrote src/data/images.json');
