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

  test('hero section has two-column layout', async ({ page }) => {
    const heroSplit = page.locator('.hero-split');
    const gridCols = await heroSplit.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    // Should have two column values (not "1fr" alone)
    const colValues = gridCols.split(' ').filter(v => v.trim());
    expect(colValues.length).toBeGreaterThanOrEqual(2);
  });

  test('bento grid has correct layout', async ({ page }) => {
    const grid = page.locator('.projects-grid.bento');
    await expect(grid).toBeVisible();

    const gridCols = await grid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    const colValues = gridCols.split(' ').filter(v => v.trim());
    expect(colValues.length).toBe(2);
  });

  test('featured project card spans two rows', async ({ page }) => {
    const featured = page.locator('.project-card.featured').first();
    await expect(featured).toBeVisible();

    const gridRowEnd = await featured.evaluate(el => {
      return window.getComputedStyle(el).gridRowEnd;
    });
    expect(gridRowEnd).toContain('span 2');
  });

  test('navigation links work (scroll to section)', async ({ page }) => {
    const aboutLink = page.locator('a[href="#about"]').first();
    await aboutLink.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    const aboutSection = page.locator('#about');
    const box = await aboutSection.boundingBox();
    // Section should be near top of viewport
    expect(box.y).toBeLessThan(200);
  });

  test('education grid has 3 columns on desktop', async ({ page }) => {
    const grid = page.locator('.education-grid');
    const gridCols = await grid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    const colValues = gridCols.split(' ').filter(v => v.trim());
    expect(colValues.length).toBe(3);
  });

  test('gallery grid has 4 columns on desktop', async ({ page }) => {
    const grid = page.locator('.gallery-grid');
    const gridCols = await grid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    const colValues = gridCols.split(' ').filter(v => v.trim());
    expect(colValues.length).toBe(4);
  });

  test('noise overlay is present', async ({ page }) => {
    const noise = page.locator('.noise-overlay');
    await expect(noise).toBeAttached();
    const opacity = await noise.evaluate(el => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0);
  });

  test('custom scrollbar is styled', async ({ page }) => {
    // Check that scrollbar-width is set in CSS
    const scrollbarWidth = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollbarWidth;
    });
    expect(scrollbarWidth).toBe('thin');
  });
});
