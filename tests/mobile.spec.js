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
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('all sections are visible and not clipped', async ({ page }) => {
    const sections = ['#about', '#skills', '#experience', '#projects', '#education', '#evidence', '#contact'];
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
    const overflowingImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).flatMap((img) => {
        if (!(img instanceof HTMLImageElement)) return [];
        if (!img.offsetParent) return [];

        const rect = img.getBoundingClientRect();
        if (rect.right <= window.innerWidth + 5) return [];

        return [{
          src: img.currentSrc || img.src,
          right: rect.right,
          viewportWidth: window.innerWidth,
        }];
      });
    });

    expect(overflowingImages).toHaveLength(0);
  });

  test('hamburger menu opens and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    const toggle = page.locator('#nav-toggle');
    if (!(await toggle.isVisible())) {
      test.skip(true, 'Hamburger not visible at this viewport width');
      return;
    }
    await toggle.click();
    const navLinks = page.locator('#nav-links');
    await expect(navLinks).toHaveClass(/open/);
    await toggle.click();
    await expect(navLinks).not.toHaveClass(/open/);
  });

  test('touch targets are at least 44px', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    const toggle = page.locator('#nav-toggle');
    if (await toggle.isVisible()) {
      const box = await toggle.boundingBox();
      expect(Math.round(box.width)).toBeGreaterThanOrEqual(44);
      expect(Math.round(box.height)).toBeGreaterThanOrEqual(44);
    }
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

  test('text is readable (font-size >= 10px)', async ({ page }) => {
    const tooSmall = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, a, li, h1, h2, h3, h4, h5, h6');
      const issues = [];
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        if (fontSize < 10 && el.offsetParent !== null && styles.display !== 'none' && styles.visibility !== 'hidden') {
          issues.push({ tag: el.tagName, text: el.textContent.slice(0, 30), size: fontSize });
        }
      });
      return issues;
    });
    expect(tooSmall).toHaveLength(0);
  });
});

test.describe('PWA Features', () => {
  test('manifest is linked in head', async ({ page }) => {
    await page.goto('/');
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', 'manifest.webmanifest');
  });

  test('manifest.webmanifest is valid JSON', async ({ page }) => {
    const response = await page.goto('/manifest.webmanifest');
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.name).toBeTruthy();
    expect(json.start_url).toBe('/');
    expect(json.display).toBe('standalone');
    expect(json.icons.length).toBeGreaterThan(0);
  });

  test('service worker file exists', async ({ page }) => {
    const response = await page.goto('/sw.js');
    expect(response.status()).toBe(200);
  });

  test('apple-mobile-web-app-capable meta tag exists', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="apple-mobile-web-app-capable"]');
    await expect(meta).toHaveAttribute('content', 'yes');
  });
});

test.describe('Case Study Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('case studies collapse into a single column', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    const firstCase = page.locator('.case-study').first();
    const columns = await firstCase.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(columns.split(' ').filter(Boolean).length).toBe(1);
  });

  test('evidence cards stay readable on mobile', async ({ page }) => {
    const cards = page.locator('.evidence-card');
    await expect(cards).toHaveCount(4);
    await expect(cards.first()).toBeVisible();
  });
});
