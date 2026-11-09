import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const i18n = read('js/i18n.js');
const dictionarySource = i18n.slice(i18n.indexOf('var translations = ') + 19, i18n.indexOf('\n  function getLang')).trim().replace(/;$/, '');
const dictionaries = vm.runInNewContext('(' + dictionarySource + ')');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
for (const [, href] of html.matchAll(/\bhref="(#([^"]+))"/g)) assert.ok(ids.has(href.slice(1)), `Missing local anchor target: ${href}`);
for (const [lang, nav] of [['en', ['Work', 'About', 'Contact']], ['ru', ['Работы', 'Обо мне', 'Контакты']]]) {
  assert.deepEqual(['nav.work', 'nav.about', 'nav.contact'].map(key => dictionaries[lang][key]), nav);
  if (lang === 'en') assert.match(dictionaries[lang]['hero.kicker'], /Product designer (?:& builder|and developer)/i);
  else assert.match(dictionaries[lang]['hero.kicker'], /Продуктовый дизайнер и разработчик/);
  assert.match(dictionaries[lang]['about.p1'], lang === 'en' ? /^Product Designer & Builder/ : /^Продуктовый дизайнер и разработчик/);
  assert.match(dictionaries[lang]['meta.title'], lang === 'en' ? /Product Designer & Builder$/ : /Продуктовый дизайнер и разработчик$/);
}
assert.equal(dictionaries.ru['case.tripmaxx.proof'], 'В App Store · работает на телефоне');
for (const [, key] of html.matchAll(/data-i18n="([^"]+)"/g)) assert.ok(!/[А-Яа-яЁё]/.test(dictionaries.en[key]), `English contains Cyrillic: ${key}`);
for (const lang of ['en', 'ru']) {
  const keys = Object.keys(dictionaries[lang]);
  assert.deepEqual(keys.sort(), Object.keys(dictionaries.en).sort());
  for (const [, key] of html.matchAll(/data-i18n="([^"]+)"/g)) assert.ok(dictionaries[lang][key], `${lang}: ${key}`);
  const source = dictionarySource.split(`"${lang}": {`)[1].split(/\n  }/)[0];
  const rawKeys = [...source.matchAll(/^    "([^"]+)":/gm)].map(match => match[1]);
  assert.equal(rawKeys.length, new Set(rawKeys).size, 'Duplicate translation keys');
}
assert.equal((html.match(/class="case-card\b/g) || []).length, 9);
const requiredSlugs = ['tripmaxx', 'naqyl', 'tact', 'yasnoten', 'netmatch', 'ozger', 'motion-teaser', 'redteu', 'beni'];
const gridMarkup = html.slice(html.indexOf('id="projects"'), html.indexOf('id="about"'));
const cardSlugs = [...gridMarkup.matchAll(/data-case-slug="([^"]+)"/g)].map(([, slug]) => slug);
assert.deepEqual(cardSlugs, requiredSlugs);
for (const file of ['naqyl-app-frame.webp', 'yasnoten-2026-11-08-poster.webp', 'beni-hero.webp', 'redteu-site.webp', 'motion-teaser-2026-11-08-poster.webp', 'ai-cinematic-2026-11-09.webp']) {
  assert.ok(read('scripts/build-site.mjs').includes(`assets/portfolio/${file}`), `Missing build asset: ${file}`);
  assert.ok(read('sw.js').includes(`/assets/portfolio/${file}`), `Missing precache asset: ${file}`);
  assert.ok(existsSync(new URL('../assets/portfolio/' + file, import.meta.url)), `Missing image: ${file}`);
}
assert.equal((html.match(/id="projects"/g) || []).length, 1);
assert.match(html, /href="https:\/\/yasnoten\.web\.app"/);
assert.doesNotMatch(html, /github\.com[^"]*yasnoten|3ERA/i);
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
const links = [...html.matchAll(/data-case-slug="([^"]+)"/g)].map(([, slug]) => element({ 'data-case-slug': slug }));
const metas = new Map();
const docListeners = {};
const document = { readyState: 'loading', documentElement: {}, hidden: false, title: '',
  querySelectorAll(selector) { return selector === '[data-i18n]' ? nodes : selector === '[data-case-slug]' ? links : []; },
  querySelector(selector) { if (!metas.has(selector)) metas.set(selector, element()); return metas.get(selector); },
  getElementById() { return null; }, addEventListener(k, fn) { docListeners[k] = fn; },
  dispatchEvent(event) { docListeners[event.type]?.(); } };
const window = { __siteLang: 'en', location: { hostname: 'luvor.github.io' } };
vm.runInNewContext(i18n, { document, window, Event, localStorage: { setItem() {} }, history: { replaceState() {} } });
for (const lang of ['en', 'ru', 'en']) {
  window.__i18n.switchLang(lang);
  assert.equal(document.documentElement.lang, lang);
  assert.equal(document.title, dictionaries[lang]['meta.title']);
  for (const node of nodes) {
    const key = node.getAttribute('data-i18n');
    assert.equal(node.getAttribute('data-i18n-attr') ? node.getAttribute(node.getAttribute('data-i18n-attr')) : node.textContent, dictionaries[lang][key]);
  }
  for (const link of links) assert.ok(link.href.startsWith('https://chynybekov.com/' + (lang === 'en' ? 'en/' : '') + 'projects'));
  assert.equal(/[А-Яа-я]/.test(metas.get('meta[name="description"]').content), lang === 'ru');
}

// Run the real motion block against a deferred play promise to exercise races.
const main = read('js/main.js');
const motion = main.slice(main.indexOf('  var motionPreference ='), main.indexOf("  document.addEventListener('keydown'", main.indexOf('  var motionPreference =')));
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
preference.matches = false; preference.change(); assert.equal(video.src, 'preview.mp4');
preference.matches = true; preference.change(); finishPlay(); await Promise.resolve();
assert.ok(video.paused && !video.src && !classes.has('is-playing'), 'Pending play must not survive reduced motion');
preference.matches = false; preference.change();
intersection([{ isIntersecting: true }]); rejectPlay(new Error('Autoplay denied'));
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
