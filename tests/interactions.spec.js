// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Interactive Elements', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('scroll progress bar updates on scroll', async ({ page }) => {
    const progressBar = page.locator('#scroll-progress');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    const midWidth = await progressBar.evaluate((el) => parseFloat(el.style.width) || 0);
    expect(midWidth).toBeGreaterThan(0);
  });

  test('nav highlight updates on scroll', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('projects').scrollIntoView();
    });
    await page.waitForTimeout(1000);
    const skillsLink = page.locator('a[href="#projects"]');
    const classes = await skillsLink.getAttribute('class');
    expect(classes).toContain('active');
  });

  test('hero renders immediately with the new composition', async ({ page }) => {
    await expect(page.locator('.hero-name-line').first()).toHaveText('One designer. Six disciplines.');
    await expect(page.locator('.case-card')).toHaveCount(9);
    await expect(page.locator('.hero-signals li')).toHaveCount(3);
  });

  test('case showcase links to all nine case studies', async ({ page }) => {
    await expect(page.locator('[data-case-slug]')).toHaveCount(9);
  });

});
