// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
  });

  test('all sections are visible and not clipped', async ({ page }) => {
    const sections = ['#about', '#skills', '#experience', '#projects', '#education', '#gallery', '#contact'];
    for (const selector of sections) {
      const section = page.locator(selector);
      await expect(section).toBeVisible({ timeout: 10000 });
      const box = await section.boundingBox();
      expect(box).not.toBeNull();
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }
  });

  test('images do not overflow container', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const imgBox = await img.boundingBox();
        if (imgBox) {
          const viewportWidth = await page.evaluate(() => window.innerWidth);
          expect(imgBox.x + imgBox.width).toBeLessThanOrEqual(viewportWidth + 5);
        }
      }
    }
  });

  test('hamburger menu opens and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');

    const toggle = page.locator('#nav-toggle');
    await expect(toggle).toBeVisible();

    // Open menu
    await toggle.click();
    const navLinks = page.locator('#nav-links');
    await expect(navLinks).toHaveClass(/open/);

    // Close menu
    await toggle.click();
    await expect(navLinks).not.toHaveClass(/open/);
  });

  test('touch targets are at least 44px', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');

    // Check nav toggle
    const toggle = page.locator('#nav-toggle');
    if (await toggle.isVisible()) {
      const box = await toggle.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    // Check buttons
    const buttons = page.locator('.btn');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        const box = await btn.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('text is readable (font-size >= 12px)', async ({ page }) => {
    const tooSmall = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, span, a, li, h1, h2, h3, h4, h5, h6');
      const issues = [];
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        if (fontSize < 12 && el.offsetParent !== null && styles.display !== 'none') {
          issues.push({ tag: el.tagName, text: el.textContent.slice(0, 30), size: fontSize });
        }
      });
      return issues;
    });
    expect(tooSmall).toHaveLength(0);
  });
});
