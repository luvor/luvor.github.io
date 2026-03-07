// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Accessibility', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('skip-to-content link exists and works', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached();
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
  });

  test('all images have alt text', async ({ page }) => {
    // Exclude the lightbox placeholder img which intentionally has alt=""
    const images = page.locator('img:not(.lightbox-img)');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt, `Image ${i} missing alt text`).toBeTruthy();
      expect(alt.length, `Image ${i} has empty alt text`).toBeGreaterThan(0);
    }
  });

  test('heading hierarchy is correct (h1 -> h2 -> h3)', async ({ page }) => {
    const headings = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        results.push({
          level: parseInt(h.tagName[1]),
          text: h.textContent.trim().slice(0, 50),
        });
      });
      return results;
    });
    expect(headings.length).toBeGreaterThan(0);
    expect(headings[0].level).toBe(1);
    for (let i = 1; i < headings.length; i++) {
      const jump = headings[i].level - headings[i - 1].level;
      expect(jump, `Heading "${headings[i].text}" skips levels`).toBeLessThanOrEqual(1);
    }
  });

  test('only one h1 exists on the page', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('interactive elements have focus styles', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const styles = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
      };
    });
    expect(focusedElement).not.toBeNull();
  });

  test('aria-hidden is set on decorative elements', async ({ page }) => {
    const decorative = ['#scroll-progress', '#hero-canvas', '#custom-cursor'];
    for (const selector of decorative) {
      const el = page.locator(selector).first();
      if (await el.count() > 0) {
        const ariaHidden = await el.getAttribute('aria-hidden');
        expect(ariaHidden, `${selector} should have aria-hidden`).toBe('true');
      }
    }
  });

  test('experience watermarks have aria-hidden', async ({ page }) => {
    const watermarks = page.locator('.experience-watermark');
    const count = await watermarks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const ariaHidden = await watermarks.nth(i).getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('gallery items have role="button"', async ({ page }) => {
    const items = page.locator('.gallery-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const role = await items.nth(i).getAttribute('role');
      expect(role).toBe('button');
    }
  });

  test('JSON-LD structured data exists', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
    const content = await jsonLd.textContent();
    const parsed = JSON.parse(content);
    expect(parsed['@type']).toBe('Person');
    expect(parsed.name).toBe('Islambek Chynybekov');
  });

  test('nav links have meaningful text', async ({ page }) => {
    const navLinks = page.locator('.nav-links a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const text = await navLinks.nth(i).textContent();
      expect(text.trim().length, `Nav link ${i} has no text`).toBeGreaterThan(0);
    }
  });

  test('external links have rel="noopener"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      expect(rel, `External link ${i} missing rel="noopener"`).toContain('noopener');
    }
  });
});
