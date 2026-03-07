// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Desktop Layout', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('all sections render correctly', async ({ page }) => {
    const sections = ['#about', '#skills', '#experience', '#projects', '#education', '#gallery', '#contact'];
    for (const selector of sections) {
      await expect(page.locator(selector)).toBeAttached();
    }
  });

  test('hero section is full viewport with centered name', async ({ page }) => {
    const heroName = page.locator('.hero-name');
    await expect(heroName).toBeVisible();
    const box = await heroName.boundingBox();
    const viewport = page.viewportSize();
    // Name should be roughly centered horizontally
    expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(100);
  });

  test('skills grid has 2x2 layout on desktop', async ({ page }) => {
    const grid = page.locator('.skills-grid');
    const cols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    expect(cols.split(' ').length).toBe(2);
  });

  test('projects stack has at least 4 cards', async ({ page }) => {
    const cards = page.locator('.project-card');
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

  test('gallery is horizontal scroll', async ({ page }) => {
    const gallery = page.locator('.gallery-scroll');
    const overflow = await gallery.evaluate(el => getComputedStyle(el).overflowX);
    expect(overflow).toBe('auto');
  });

  test('experience cards have watermark text', async ({ page }) => {
    const watermark = page.locator('.experience-watermark').first();
    await expect(watermark).toBeAttached();
    const opacity = await watermark.evaluate(el => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeLessThan(0.1);
  });

  test('custom scrollbar is styled', async ({ page }) => {
    const scrollbarWidth = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollbarWidth;
    });
    expect(scrollbarWidth).toBe('thin');
  });
});
