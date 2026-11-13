// Runs after `vite build`. Renders the above-the-fold app (navigation + hero) to static HTML
// and writes it into dist/index.html, so visitors see the page before any JavaScript runs.
// It also preloads the two fonts the hero text needs, which avoids a late text reflow.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr');

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true, copyPublicDir: false },
});

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const markup = render();

const indexPath = path.join(dist, 'index.html');
let html = await readFile(indexPath, 'utf8');

const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
html = html.replace(placeholder, `<div id="root">${markup}</div>`);

// Same public path the bundler used for its own assets (e.g. /portfolio/assets/).
const assetBase = html.match(/href="([^"]*assets\/)[^"]+\.css"/)?.[1] ?? './assets/';
const fonts = (await readdir(path.join(dist, 'assets')))
  .filter((file) => /^(space-grotesk|geist)-latin-wght-normal-.+\.woff2$/.test(file))
  .map((file) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${assetBase}${file}" />`);
html = html.replace('</head>', `  ${fonts.join('\n    ')}\n  </head>`);

await writeFile(indexPath, html);
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: wrote ${(markup.length / 1024).toFixed(1)} kB of HTML and ${fonts.length} font preloads`);
