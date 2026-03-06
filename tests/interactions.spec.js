// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Interactive Elements', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('lightbox opens on gallery image click', async ({ page }) => {
    // Scroll to gallery section
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const firstGalleryItem = page.locator('.gallery-item').first();
    await firstGalleryItem.click();

    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/active/);
  });

  test('lightbox closes on Escape key', async ({ page }) => {
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const firstGalleryItem = page.locator('.gallery-item').first();
    await firstGalleryItem.click();

    const lightbox = page.locator('.lightbox');
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

    // Initially should have 0 or very small width
    const initialWidth = await progressBar.evaluate(el => el.style.width || '0%');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    const midWidth = await progressBar.evaluate(el => {
      return parseFloat(el.style.width) || 0;
    });
    expect(midWidth).toBeGreaterThan(0);
  });

  test('nav highlight updates on scroll', async ({ page }) => {
    // Scroll to skills section
    await page.evaluate(() => {
      document.getElementById('skills').scrollIntoView();
    });
    await page.waitForTimeout(1000);

    const skillsLink = page.locator('a[href="#skills"]');
    const classes = await skillsLink.getAttribute('class');
    expect(classes).toContain('active');
  });

  test('orchestrated page load animation', async ({ page }) => {
    // Reload to trigger animation
    await page.goto('/');

    // Body starts with hero-load class
    const body = page.locator('body');

    // After load, hero-revealed should be added
    await page.waitForTimeout(2000);
    await expect(body).not.toHaveClass(/hero-load/);
  });

  test('section clip-path reveals on scroll', async ({ page }) => {
    // Initially sections should have clip-path
    const aboutSection = page.locator('#about');
    const initialClip = await aboutSection.evaluate(el => {
      return window.getComputedStyle(el).clipPath;
    });

    // Scroll to section
    await aboutSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // After scroll, section should have visible class
    await expect(aboutSection).toHaveClass(/visible/);
  });
});
