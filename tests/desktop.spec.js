// @ts-check
const { test, expect } = require('@playwright/test');
const { mkdirSync } = require('node:fs');

test.describe('Desktop Layout', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Desktop Chrome', 'Desktop-only regression suite');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('all sections render correctly', async ({ page }) => {
    const sections = ['#projects', '#about', '#contact'];
    for (const selector of sections) {
      await expect(page.locator(selector)).toBeAttached();
    }
  });

  test('portfolio grid, proof and responsive hero render in English and Russian', async ({ page }) => {
    await expect(page.locator('#hero h1')).toBeVisible();
    await expect(page.locator('#projects .case-grid > article')).toHaveCount(9);
    const slugs = await page.locator('#projects .case-grid > article').evaluateAll(nodes => nodes.map(node => node.querySelector('[data-case-slug]')?.dataset.caseSlug));
    expect(slugs).toEqual(['tripmaxx', 'netmatch', 'naqyl', 'tact', 'yasnoten', 'ozger', 'motion-teaser', 'redteu', 'beni']);
    await expect(page.locator('.fact-strip .facts > p')).toHaveCount(3);
    await expect(page.locator('#about .experience-list')).toBeVisible();
    await expect(page.locator('.hero-mosaic .hero-tile')).toHaveCount(6);
    for (const width of [1440, 900, 390]) for (const lang of ['en', 'ru']) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(lang => window.__i18n.switchLang(lang), lang);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const hero = document.querySelector('#hero');
        const wrap = hero.querySelector('.wrap').getBoundingClientRect();
        const mosaic = hero.querySelector('.hero-mosaic').getBoundingClientRect();
        const tiles = [...hero.querySelectorAll('.hero-tile')].map(tile => tile.getBoundingClientRect());
        const grid = document.querySelector('.case-grid');
        const heading = [...hero.querySelectorAll('h1 span')];
        const singleWordLines = heading.some(sentence => {
          const node = sentence.firstChild;
          const lines = new Map();
          for (const match of node.textContent.matchAll(/\S+/g)) {
            const range = document.createRange();
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            const top = Math.round(range.getBoundingClientRect().top);
            lines.set(top, (lines.get(top) || 0) + 1);
          }
          return [...lines.values()].some(count => count === 1);
        });
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          mosaicInWrap: mosaic.left >= wrap.left && mosaic.right <= wrap.right,
          heroHeight: hero.getBoundingClientRect().height,
          firstImageTop: tiles[0].top + scrollY,
          tileWidths: tiles.map(tile => tile.width),
          tileRows: [...new Set(tiles.map(tile => Math.round(tile.top)))].length,
          caseColumns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          singleWordLines,
          linkRows: [...document.querySelectorAll('.project-links')].every(row => {
            const links = [...row.querySelectorAll('a')];
            return links.length < 2 || links.every(link => Math.abs(link.getBoundingClientRect().top - links[0].getBoundingClientRect().top) < 1);
          })
        };
      });
      expect(layout.overflow).toBe(false);
      expect(layout.mosaicInWrap).toBe(true);
      expect(layout.linkRows).toBe(true);
      expect(layout.caseColumns).toBe(width > 1000 ? 3 : width >= 768 ? 2 : 1);
      if (lang === 'ru') expect(layout.singleWordLines).toBe(false);
      if (width === 1440) {
        expect(layout.heroHeight).toBeLessThanOrEqual(780);
        expect(layout.tileRows).toBe(2);
      } else if (width === 900) {
        expect(layout.tileRows).toBe(2);
      } else {
        expect(layout.tileRows).toBe(4);
        expect(layout.firstImageTop).toBeLessThan(640);
        expect(layout.tileWidths[0]).toBeGreaterThan(layout.tileWidths[1] * 1.9);
        expect(layout.tileWidths[5]).toBeGreaterThan(layout.tileWidths[1] * 1.9);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('#projects a.live-link[href="https://yasnoten.web.app"]')).toBeVisible();
    await expect(page.locator('#projects a[href*="github.com"][href*="yasnoten"]')).toHaveCount(0);
    await expect(page.locator('#projects a[href*="3era"]')).toHaveCount(0);
    await page.evaluate(() => window.__i18n.switchLang('en'));
    mkdirSync('/private/tmp/qa-out/portfolio/final-r9', { recursive: true });
    await page.screenshot({ path: '/private/tmp/qa-out/portfolio/final-r9/desktop.png', fullPage: true });
  });

  test('navigation links work (scroll to section)', async ({ page }) => {
    const aboutLink = page.locator('#nav-links a[href="#about"]');
    await aboutLink.click();
    await page.waitForTimeout(1000);
    const aboutSection = page.locator('#about');
    const box = await aboutSection.boundingBox();
    expect(box.y).toBeLessThan(200);
  });

});
