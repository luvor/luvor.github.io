import { mkdir, readFile, rm, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CleanCSS from 'clean-css';
import { minify as minifyHtml } from 'html-minifier-terser';
import { minify as minifyJs } from 'terser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, '_site');

const textAssets = [
  ['index.html', 'html'],
  ['versions.html', 'html'],
  ['privacy.html', 'html'],
  ['privacy.ru.html', 'html'],
  ['licenses.html', 'html'],
  ['use/index.html', 'html'],
  ['.well-known/apple-app-site-association', 'json'],
  ['css/style.css', 'css'],
  ['css/versions.css', 'css'],
  ['js/i18n.js', 'js'],
  ['js/main.js', 'js'],
  ['js/versions.js', 'js'],
  ['sw.js', 'js'],
  ['manifest.webmanifest', 'json'],
];

const staticAssets = [
  'favicon.svg',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  '162631f96075cf4846476746f963cbce.txt',
  'assets/icons/apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/portfolio/portrait.webp',
  'assets/portfolio/cases/tripmaxx.webp',
  'assets/portfolio/cases/netmatch-promo.webp',
  'assets/portfolio/cases/naqyl.webp',
  'assets/portfolio/cases/tact.webp',
  'assets/portfolio/cases/yasnoten.webp',
  'assets/portfolio/cases/ozger.webp',
  'assets/portfolio/cases/motion.webp',
  'assets/portfolio/cases/redteu.webp',
  'assets/portfolio/cases/beni.webp',
  'assets/portfolio/cases/ai.webp',
];

function resolveFromRoot(relativePath) {
  return path.join(rootDir, relativePath);
}

function resolveFromOut(relativePath) {
  return path.join(outDir, relativePath);
}

async function ensureParentDir(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function minifyText(source, type) {
  if (type === 'html') {
    return minifyHtml(source, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      keepClosingSlash: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    });
  }

  if (type === 'css') {
    const result = new CleanCSS({ level: 2 }).minify(source);
    if (result.errors.length) {
      throw new Error(result.errors.join('\n'));
    }

    return result.styles;
  }

  if (type === 'js') {
    const result = await minifyJs(source, {
      compress: {
        passes: 2,
      },
      format: {
        comments: false,
      },
      mangle: true,
    });

    if (!result.code) {
      throw new Error('Terser returned empty output');
    }

    return result.code;
  }

  if (type === 'json') {
    return JSON.stringify(JSON.parse(source));
  }

  return source;
}

async function buildTextAsset(relativePath, type) {
  const inputPath = resolveFromRoot(relativePath);
  const outputPath = resolveFromOut(relativePath);
  const source = await readFile(inputPath, 'utf8');
  const minified = await minifyText(source, type);
  await ensureParentDir(outputPath);
  await writeFile(outputPath, minified);
}

async function copyStaticAsset(relativePath) {
  const inputPath = resolveFromRoot(relativePath);
  const outputPath = resolveFromOut(relativePath);
  await ensureParentDir(outputPath);
  await copyFile(inputPath, outputPath);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const [relativePath, type] of textAssets) {
  await buildTextAsset(relativePath, type);
}

for (const relativePath of staticAssets) {
  await copyStaticAsset(relativePath);
}

try {
  await copyStaticAsset('assets/portfolio/motion-teaser-2026-11-08.mp4');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
