// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Interactive Elements', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('language toggle updates copy and case URLs without changing the path', async ({ page }) => {
    const heading = page.locator('#hero h1');
    const caseLink = page.locator('#projects .flagship').first().locator('.case-link');
    await expect(heading).toContainText('One designer');
    await page.locator('#lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(heading).toContainText('Один дизайнер');
    await expect(caseLink).toHaveAttribute('href', 'https://chynybekov.com/projects/tripmaxx');
    expect(new URL(page.url()).pathname).toBe('/');
    await page.locator('#lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(heading).toContainText('One designer');
    await expect(caseLink).toHaveAttribute('href', 'https://chynybekov.com/en/projects/tripmaxx');
    expect(new URL(page.url()).pathname).toBe('/');
  });

  test('hero renders with the three proof facts', async ({ page }) => {
    await expect(page.locator('#hero h1')).toBeVisible();
    await expect(page.locator('.fact-strip .facts > p')).toHaveCount(3);
    await expect(page.locator('#projects article')).toHaveCount(9);
  });

  test('case showcase links to all nine case studies', async ({ page }) => {
    const slugs = await page.locator('#projects article').evaluateAll(cards => cards.map(card => card.querySelector('[data-case-slug]')?.dataset.caseSlug));
    expect(new Set(slugs).size).toBe(9);
    expect(slugs).toEqual(['tripmaxx', 'netmatch', 'naqyl', 'tact', 'yasnoten', 'ozger', 'motion-teaser', 'redteu', 'beni']);
  });

});
