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
  ['css/style.css', 'css'],
  ['css/versions.css', 'css'],
  ['js/main.js', 'js'],
  ['js/animations.js', 'js'],
  ['js/particles.js', 'js'],
  ['js/versions.js', 'js'],
  ['sw.js', 'js'],
  ['manifest.webmanifest', 'json'],
];

const staticAssets = [
  'favicon.svg',
  'assets/icons/apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/portfolio/CV_Chynybekov_2026.pdf',
  'assets/portfolio/imagine-99.jpg',
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
