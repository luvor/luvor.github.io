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
    const sections = ['#about', '#skills', '#experience', '#projects', '#education', '#evidence', '#contact'];
    for (const selector of sections) {
      await expect(page.locator(selector)).toBeAttached();
    }
  });

  test('hero uses the split manifesto layout', async ({ page }) => {
    await expect(page.locator('.hero-name')).toBeVisible();
    await expect(page.locator('.hero-panel')).toBeVisible();
    const columns = await page.locator('.hero-shell').evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(columns.split(' ').filter(Boolean).length).toBe(2);
  });

  test('skills grid has 2x2 layout on desktop', async ({ page }) => {
    const grid = page.locator('.skills-grid');
    const cols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    expect(cols.split(' ').length).toBe(2);
  });

  test('projects stack has curated case studies', async ({ page }) => {
    const cards = page.locator('.case-study');
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
  });

  test('navigation links work (scroll to section)', async ({ page }) => {
    const aboutLink = page.locator('#nav-links a[href="#about"]');
    await aboutLink.click();
    await page.waitForTimeout(1000);
    const aboutSection = page.locator('#about');
    const box = await aboutSection.boundingBox();
    expect(box.y).toBeLessThan(200);
  });

  test('education grid has 3 columns on desktop', async ({ page }) => {
    const grid = page.locator('.education-grid');
    const gridCols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const colValues = gridCols.split(' ').filter(v => v.trim());
    expect(colValues.length).toBe(3);
  });

  test('evidence grid uses two columns on desktop', async ({ page }) => {
    const grid = page.locator('.evidence-grid');
    const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(columns.split(' ').filter(Boolean).length).toBe(2);
  });

  test('experience cards have watermark text', async ({ page }) => {
    const watermark = page.locator('.experience-watermark').first();
    await expect(watermark).toBeAttached();
    const color = await watermark.evaluate((el) => getComputedStyle(el).color);
    const alphaMatch = color.match(/rgba?\((?:\d+,\s*){2}\d+(?:,\s*([0-9.]+))?\)/);
    const alpha = alphaMatch && alphaMatch[1] ? parseFloat(alphaMatch[1]) : 1;
    expect(alpha).toBeLessThanOrEqual(0.1);
  });

  test('custom scrollbar is styled', async ({ page }) => {
    const scrollbarWidth = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollbarWidth;
    });
    expect(scrollbarWidth).toBe('thin');
  });
});
