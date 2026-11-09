// @ts-check
const { test, expect } = require('@playwright/test');

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

  test('hero leads directly into the six-discipline showcase', async ({ page }) => {
    await expect(page.locator('.hero-name')).toBeVisible();
    await expect(page.locator('.case-card')).toHaveCount(9);
    const columns = await page.locator('.range-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(columns.split(' ').filter(Boolean).length).toBe(3);
    for (const lang of ['en', 'ru']) {
      await page.evaluate(lang => window.__i18n.switchLang(lang), lang);
      const layout = await page.evaluate(() => {
        const heading = document.querySelector('.hero-name');
        return {
          lines: heading.getBoundingClientRect().height / parseFloat(getComputedStyle(heading).lineHeight),
          firstRow: [...document.querySelectorAll('.case-card')].slice(0, 3).every(el => el.getBoundingClientRect().top < innerHeight),
        };
      });
      expect(layout.lines).toBeLessThanOrEqual(2.1);
      expect(layout.firstRow).toBe(true);
    }
    await expect(page.locator('#hero-canvas, script[src="js/particles.js"]')).toHaveCount(0);
    await expect(page.locator('.range-all')).toHaveAttribute('href', 'https://yasnoten.web.app');
  });

  test('navigation links work (scroll to section)', async ({ page }) => {
    const aboutLink = page.locator('#nav-links a[href="#about"]');
    await aboutLink.click();
    await page.waitForTimeout(1000);
    const aboutSection = page.locator('#about');
    const box = await aboutSection.boundingBox();
    expect(box.y).toBeLessThan(200);
  });

  test('custom scrollbar is styled', async ({ page }) => {
    const scrollbarWidth = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollbarWidth;
    });
    expect(scrollbarWidth).toBe('thin');
  });
});
