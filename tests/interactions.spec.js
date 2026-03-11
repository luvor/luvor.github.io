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

  test('case studies render with evidence panels', async ({ page }) => {
    const cases = page.locator('.case-study');
    await expect(cases).toHaveCount(4);
    await expect(cases.first().locator('.case-study-aside')).toBeVisible();
    await expect(cases.first().locator('.case-study-points li')).toHaveCount(3);
  });

  test('evidence section exposes four strategic cards', async ({ page }) => {
    const cards = page.locator('.evidence-card');
    await expect(cards).toHaveCount(4);
    await expect(cards.first().locator('.evidence-label')).toBeVisible();
  });
});
