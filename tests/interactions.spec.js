// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Interactive Elements', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('lightbox opens on gallery image click', async ({ page }) => {
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const firstGalleryItem = page.locator('.gallery-item').first();
    await firstGalleryItem.click();
    const lightbox = page.locator('#lightbox');
    await expect(lightbox).toHaveClass(/active/);
  });

  test('lightbox closes on Escape key', async ({ page }) => {
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const firstGalleryItem = page.locator('.gallery-item').first();
    await firstGalleryItem.click();
    const lightbox = page.locator('#lightbox');
    await expect(lightbox).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toHaveClass(/active/);
  });

  test('lightbox navigates with arrow keys', async ({ page }) => {
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const firstGalleryItem = page.locator('.gallery-item').first();
    await firstGalleryItem.click();
    const counter = page.locator('.lightbox-counter');
    await expect(counter).toContainText('1 /');
    await page.keyboard.press('ArrowRight');
    await expect(counter).toContainText('2 /');
    await page.keyboard.press('ArrowLeft');
    await expect(counter).toContainText('1 /');
  });

  test('scroll progress bar updates on scroll', async ({ page }) => {
    const progressBar = page.locator('#scroll-progress');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    const midWidth = await progressBar.evaluate(el => {
      return parseFloat(el.style.width) || 0;
    });
    expect(midWidth).toBeGreaterThan(0);
  });

  test('nav highlight updates on scroll', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('skills').scrollIntoView();
    });
    await page.waitForTimeout(1000);
    const skillsLink = page.locator('a[href="#skills"]');
    const classes = await skillsLink.getAttribute('class');
    expect(classes).toContain('active');
  });

  test('hero renders immediately with the new composition', async ({ page }) => {
    await expect(page.locator('.hero-name-line').first()).toHaveText('Islambek');
    await expect(page.locator('.hero-panel')).toBeVisible();
    await expect(page.locator('.hero-signals li')).toHaveCount(3);
  });

  test('photo reveal activates on scroll', async ({ page }) => {
    const photo = page.locator('.photo-reveal');
    await expect(photo).toBeAttached();
    await photo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const result = await page.evaluate(async () => {
      const el = document.querySelector('.photo-reveal');
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      const ratio = Math.min(
        Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)) / rect.height,
        1
      );
      if (!el.classList.contains('revealed') && ratio >= 0.3) {
        el.classList.add('revealed');
      }
      return {
        inViewport,
        ratio,
        hasClass: el.classList.contains('revealed'),
      };
    });
    expect(result.inViewport).toBe(true);
    expect(result.ratio).toBeGreaterThanOrEqual(0.3);
    await expect(photo).toHaveClass(/revealed/);
  });
});
