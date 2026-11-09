import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const css = read('css/style.css').replace(/\s+/g, '');
const i18n = read('js/i18n.js');
const dictionarySource = i18n.slice(i18n.indexOf('var translations = ') + 19, i18n.indexOf('\n  function getLang')).trim().replace(/;$/, '');
const dictionaries = vm.runInNewContext('(' + dictionarySource + ')');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
for (const [, href] of html.matchAll(/\bhref="(#([^"]+))"/g)) assert.ok(ids.has(href.slice(1)), `Missing local anchor target: ${href}`);
for (const [lang, nav] of [['en', ['Work', 'About', 'Contact']], ['ru', ['Работы', 'Обо мне', 'Контакты']]]) {
  assert.deepEqual(['nav.work', 'nav.about', 'nav.contact'].map(key => dictionaries[lang][key]), nav);
}
for (const [, key] of html.matchAll(/data-i18n="([^"]+)"/g)) assert.ok(!/[А-Яа-яЁё]/.test(dictionaries.en[key]), `English contains Cyrillic: ${key}`);
for (const lang of ['en', 'ru']) {
  const keys = Object.keys(dictionaries[lang]);
  assert.deepEqual(keys.sort(), Object.keys(dictionaries.en).sort());
  for (const [, key] of html.matchAll(/data-i18n="([^"]+)"/g)) assert.ok(dictionaries[lang][key], `${lang}: ${key}`);
  const source = dictionarySource.split(`${lang}: {`)[1].split(/\n    }/)[0];
  const rawKeys = [...source.matchAll(/['"]([^'"]+)['"]\s*:/g)].map(match => match[1]);
  assert.equal(rawKeys.length, new Set(rawKeys).size, 'Duplicate translation keys');
}
const requiredSlugs = ['tripmaxx', 'netmatch', 'naqyl', 'tact', 'yasnoten', 'ozger', 'motion-teaser', 'redteu', 'beni'];
const gridMarkup = html.slice(html.indexOf('id="projects"'), html.indexOf('id="about"'));
assert.equal((gridMarkup.match(/<article\b/g) || []).length, 9);
const cardSlugs = [...new Set([...gridMarkup.matchAll(/data-case-slug="([^"]+)"/g)].map(([, slug]) => slug))];
assert.deepEqual(cardSlugs, requiredSlugs);
assert.deepEqual(cardSlugs.slice(0, 2), ['tripmaxx', 'netmatch']);
const heroMarkup = html.slice(html.indexOf('class="hero-mosaic"'), html.indexOf('class="fact-strip"'));
assert.equal((heroMarkup.match(/class="hero-tile"/g) || []).length, 6);
assert.match(gridMarkup, /src="assets\/portfolio\/cases\/tripmaxx\.webp"/);
assert.match(gridMarkup, /src="assets\/portfolio\/cases\/netmatch-promo\.webp"/);
assert.doesNotMatch(html, /tripmaxx-2|netmatch-2|cases\/netmatch\.webp/);
assert.doesNotMatch(html, /class="disciplines"|class="hero-art"/);
for (const [, card] of gridMarkup.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)) {
  assert.equal((card.match(/class="proof"/g) || []).length, 1);
  const links = card.match(/<div class="project-links">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(links?.startsWith('<a class="case-link"'), 'Case study must lead the link row');
  assert.equal((card.match(/class="status-chip/g) || []).length, 1);
}
for (const [lang, allowed] of [['en', ['Live', 'Demo', 'Concept', 'In preparation']], ['ru', ['Работает', 'Демо', 'Концепт', 'В подготовке']]]) {
  for (const slug of requiredSlugs) assert.ok(allowed.includes(dictionaries[lang][`case.${slug}.status`]));
}
const portfolioAssets = [...new Set([...html.matchAll(/(?:src|poster|data-src)="(assets\/portfolio\/[^\"]+)"/g)].map(([, file]) => file))];
for (const file of portfolioAssets) {
  assert.ok(read('scripts/build-site.mjs').includes(`'${file}'`) || read('scripts/build-site.mjs').includes(`\`${file}\``), `Missing build asset: ${file}`);
  if (file.endsWith('.mp4')) assert.ok(!read('sw.js').includes(`/${file}`), `Video must stay out of precache: ${file}`);
  else assert.ok(read('sw.js').includes(`/${file}`), `Missing precache asset: ${file}`);
  assert.ok(existsSync(new URL('../' + file, import.meta.url)), `Missing image/video: ${file}`);
}
assert.equal((html.match(/id="projects"/g) || []).length, 1);
assert.match(html, /<a\b(?=[^>]*class="live-link")(?=[^>]*href="https:\/\/yasnoten\.web\.app")[^>]*>/);
assert.doesNotMatch(html, /github\.com[^"\s]*yasnoten|3ERA/i);
assert.equal((html.match(/class="[^"]*\bfacts\b[^"]*"/g) || []).length, 1);
assert.equal((html.match(/data-i18n="hero\.fact\.[^"]+"/g) || []).length, 4);
assert.match(html, /<h1><span data-i18n="hero\.claim\.1"/);
assert.equal((html.match(/data-i18n="hero\.claim\.[123]"/g) || []).length, 3);
assert.match(css, /\.hero-mosaic\{[^}]*width:100%;max-width:100%/);
assert.match(css, /\.case-grid\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(min-width:768px\)and\(max-width:1000px\)[\s\S]*?\.case-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css, /\.hero-tile:first-child,\.hero-tile:last-child\{grid-column:1\/-1\}/);
assert.match(css, /\.motion-toggle\{[^}]*width:40px;height:40px[^}]*border-radius:50%/);
assert.doesNotMatch(html, /class="flagships|flagship-reverse/);
assert.match(html, /class="nav-logo"[^>]*>Islambek Chynybekov<\/a>/);
assert.doesNotMatch(html, /Моушн|В продакшне/);
assert.match(css, /\.wrap\{[^}]*max-width:1200px/);
assert.match(css, /aspect-ratio:16\/10;object-fit:cover/);
assert.match(css, /--paper:#F2F4F8/i);
assert.match(css, /--blue:#2236FF/i);
assert.match(css, /text-wrap:balance/);
assert.ok(!/<video[^>]*\ssrc=/.test(html));
assert.ok(/<video[^>]*preload="none"/.test(html));
assert.match(html, /data-motion/);
assert.match(html, /class="motion-toggle"/);
assert.ok(!/PRECACHE_ASSETS[\s\S]*?\];/.exec(read('sw.js'))[0].includes('.mp4'));
for (const [, tag] of html.matchAll(/<(a\s[^>]+)>/g)) if (/href="https:/.test(tag)) assert.match(tag, /rel="[^"]*noopener/);
for (const [, file] of html.matchAll(/(?:src|poster)="(assets\/[^\"]+)"/g)) assert.ok(existsSync(new URL('../' + file, import.meta.url)), file);

function element(attrs = {}) {
  return { attrs, textContent: '', listeners: {}, getAttribute(k) { return this.attrs[k] ?? null; },
    setAttribute(k, v) { this.attrs[k] = v; this[k] = v; }, addEventListener(k, fn) { this.listeners[k] = fn; } };
}
const nodes = [...html.matchAll(/<\w+\b[^>]*data-i18n="[^"]+"[^>]*>/g)].map(([tag]) => element(Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]))));
const links = [...gridMarkup.matchAll(/<a\b[^>]*data-case-slug="([^"]+)"[^>]*>/g)].map(([, slug]) => element({ 'data-case-slug': slug, href: `https://chynybekov.com/en/projects/${slug}` }));
const metas = new Map();
const docListeners = {};
const historyPaths = [];
const document = { readyState: 'loading', documentElement: {}, hidden: false, title: '',
  querySelectorAll(selector) { return selector === '[data-i18n]' ? nodes : selector === '[data-case-slug]' ? links : []; },
  querySelector(selector) { if (!metas.has(selector)) metas.set(selector, element()); return metas.get(selector); },
  getElementById() { return null; }, addEventListener(k, fn) { docListeners[k] = fn; },
  dispatchEvent(event) { docListeners[event.type]?.(); } };
const window = { __siteLang: 'en', location: { hostname: 'luvor.github.io' } };
vm.runInNewContext(i18n, { document, window, Event, localStorage: { setItem() {} }, history: { replaceState(_, __, path) { historyPaths.push(path); } } });
for (const lang of ['en', 'ru', 'en']) {
  window.__i18n.switchLang(lang);
  assert.equal(document.documentElement.lang, lang);
  assert.equal(document.title, dictionaries[lang]['meta.title']);
  for (const node of nodes) {
    const key = node.getAttribute('data-i18n');
    assert.equal(node.getAttribute('data-i18n-attr') ? node.getAttribute(node.getAttribute('data-i18n-attr')) : node.textContent, dictionaries[lang][key]);
  }
  for (const link of links) assert.equal(link.href, `https://chynybekov.com/${lang === 'en' ? 'en/' : ''}projects/${link.getAttribute('data-case-slug')}`);
  assert.equal(historyPaths.at(-1), lang === 'en' ? '/' : '/?lang=ru');
  assert.equal(/[А-Яа-я]/.test(metas.get('meta[name="description"]').content), lang === 'ru');
}

// Run the real motion block against a deferred play promise to exercise races.
const main = read('js/main.js');
const motionStart = main.search(/\bvar\s+motionPreference\s*=/);
const motionEnd = /\n\s*\}\s*(?:\)\s*\(\s*\)|\(\s*\)\s*\))\s*;?\s*$/.exec(main);
assert.ok(motionStart >= 0 && motionEnd && motionEnd.index > motionStart, 'Could not isolate motion block for the deferred-play check');
const motion = main.slice(motionStart, motionEnd.index);
const video = element(); video.dataset = { src: 'preview.mp4' }; video.paused = true;
video.hasAttribute = k => k === 'src' ? Boolean(video.src) : k in video.attrs;
video.removeAttribute = k => { delete video[k]; delete video.attrs[k]; };
video.pause = () => { video.paused = true; video.listeners.pause?.(); };
video.load = () => {};
let finishPlay, rejectPlay;
video.play = () => new Promise((resolve, reject) => { finishPlay = () => { video.paused = false; resolve(); }; rejectPlay = reject; });
const button = element();
const classes = new Set();
const tile = { querySelector: s => s === 'video' ? video : button, classList: { toggle(k, yes) { yes ? classes.add(k) : classes.delete(k); } } };
const preference = { matches: true, addEventListener(_, fn) { this.change = fn; } };
let intersection;
class Observer { constructor(fn) { intersection = fn; } observe() {} }
window.matchMedia = () => preference; window.IntersectionObserver = Observer;
const queryAll = document.querySelectorAll.bind(document);
document.querySelectorAll = selector => selector === '[data-motion]' ? [tile] : queryAll(selector);
vm.runInNewContext(motion, { window, document, IntersectionObserver: Observer });
intersection([{ isIntersecting: true }]); assert.ok(!video.src, 'Reduced motion must not load video');
preference.matches = false; preference.change(); assert.ok(!video.src, 'Visible preview must wait for a user gesture');
button.listeners.click(); assert.equal(video.src, 'preview.mp4');
preference.matches = true; preference.change(); finishPlay(); await Promise.resolve();
assert.ok(video.paused && !video.src && !classes.has('is-playing'), 'Pending play must not survive reduced motion');
preference.matches = false; preference.change();
rejectPlay(new Error('Playback denied'));
await Promise.resolve(); await Promise.resolve();
assert.ok(video.paused && !classes.has('is-playing'));
button.listeners.click(); finishPlay(); await Promise.resolve();
assert.ok(classes.has('is-playing')); assert.equal(button.getAttribute('aria-label'), 'Pause preview');
window.__i18n.switchLang('ru'); assert.equal(button.getAttribute('aria-label'), 'Пауза превью');
window.__i18n.switchLang('en'); assert.equal(button.getAttribute('aria-label'), 'Pause preview');
button.listeners.click(); assert.ok(video.paused); assert.equal(button.getAttribute('aria-label'), 'Play preview');
intersection([{ isIntersecting: false }]); intersection([{ isIntersecting: true }]); assert.ok(video.paused, 'Respect user pause');
button.listeners.click(); finishPlay(); await Promise.resolve();
intersection([{ isIntersecting: false }]); assert.ok(video.paused && !classes.has('is-playing'));
console.log('Portfolio checks passed: dictionaries, language roundtrip, links, media, motion preferences and play races.');
