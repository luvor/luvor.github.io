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

  test('text is readable (font-size >= 10px)', async ({ page }) => {
    const tooSmall = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, a, li, h1, h2, h3, h4, h5, h6');
      const issues = [];
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        // 10px minimum — small labels/tags may be 11px which is fine
        if (fontSize < 10 && el.offsetParent !== null && styles.display !== 'none' && styles.visibility !== 'hidden') {
          issues.push({ tag: el.tagName, text: el.textContent.slice(0, 30), size: fontSize });
        }
      });
      return issues;
    });
    expect(tooSmall).toHaveLength(0);
  });
});

test.describe('Mobile Tab Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('tab bar is visible on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    const tabBar = page.locator('#mobile-tab-bar');
    await expect(tabBar).toBeVisible();
  });

  test('tab bar is hidden on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only test');
    const tabBar = page.locator('#mobile-tab-bar');
    await expect(tabBar).not.toBeVisible();
  });

  test('tab bar has 5 tabs', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    const tabs = page.locator('#mobile-tab-bar .tab-item');
    await expect(tabs).toHaveCount(5);
  });

  test('tab items have minimum touch target', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    const tabs = page.locator('#mobile-tab-bar .tab-item');
    const count = await tabs.count();
    for (let i = 0; i < count; i++) {
      const box = await tabs.nth(i).boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
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

test.describe('Mobile Carousels', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('gallery becomes horizontal carousel on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    const gallery = page.locator('.gallery-grid');
    const display = await gallery.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
    const overflow = await gallery.evaluate(el => getComputedStyle(el).overflowX);
    expect(overflow).toBe('auto');
  });

  test('projects becomes horizontal carousel on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    const projects = page.locator('.projects-grid');
    const display = await projects.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });
});

test.describe('Context-Aware FAB', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('FAB is visible on page', async ({ page }) => {
    const fab = page.locator('#context-fab');
    await expect(fab).toBeVisible();
  });

  test('FAB has an icon', async ({ page }) => {
    const fabIcon = page.locator('#context-fab .fab-icon svg');
    await expect(fabIcon).toBeAttached();
  });

  test('FAB has a label', async ({ page }) => {
    const fabLabel = page.locator('#context-fab .fab-label');
    await expect(fabLabel).toBeAttached();
    const text = await fabLabel.textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  test('FAB changes icon on scroll', async ({ page }) => {
    const fabIcon = page.locator('#context-fab .fab-icon');
    const initialIcon = await fabIcon.innerHTML();

    // Scroll to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const newIcon = await fabIcon.innerHTML();
    expect(newIcon).not.toBe(initialIcon);
  });
});

test.describe('Skeleton Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('skeleton-wrap elements exist around images', async ({ page }) => {
    const skeletons = page.locator('.skeleton-wrap');
    const count = await skeletons.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('skeleton-wrap elements get loaded class', async ({ page }) => {
    await page.waitForTimeout(2000);
    const loadedSkeletons = page.locator('.skeleton-wrap.loaded');
    const count = await loadedSkeletons.count();
    expect(count).toBeGreaterThan(0);
  });
});
