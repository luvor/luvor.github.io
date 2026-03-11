// @ts-check
const { test, expect } = require('@playwright/test');

const mockCommits = [
  {
    sha: 'abc1234567890def',
    html_url: 'https://github.com/luvor/luvor.github.io/commit/abc1234',
    commit: {
      message: 'Add versions page\n\nwith details',
      author: {
        date: '2026-03-11T08:30:00Z',
      },
    },
  },
  {
    sha: 'def9876543210abc',
    html_url: 'https://github.com/luvor/luvor.github.io/commit/def9876',
    commit: {
      message: 'Slim service worker precache',
      author: {
        date: '2026-03-10T08:30:00Z',
      },
    },
  },
];

test.describe('Versions Page', () => {
  test('page loads with title, back link, and timeline entries', async ({ page }) => {
    await page.route('https://api.github.com/repos/luvor/luvor.github.io/commits?per_page=100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCommits),
      });
    });

    await page.goto('/versions.html');

    await expect(page).toHaveTitle(/Version History/);
    await expect(page.locator('.versions-back')).toHaveAttribute('href', '/');
    await expect(page.locator('.version-entry')).toHaveCount(2);
    await expect(page.locator('.version-badge').first()).toHaveText('v2');
    await expect(page.locator('.version-message').first()).toContainText('Add versions page');
  });

  test('error fallback renders when the GitHub request fails', async ({ page }) => {
    await page.route('https://api.github.com/repos/luvor/luvor.github.io/commits?per_page=100', async (route) => {
      await route.abort();
    });

    await page.goto('/versions.html');

    await expect(page.locator('#versions-error')).toBeVisible();
    await expect(page.locator('.versions-fallback-link')).toHaveAttribute(
      'href',
      'https://github.com/luvor/luvor.github.io/commits/main'
    );
  });

  test('main site exposes the versions link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.contact-links a[href="/versions.html"]')).toBeVisible();
  });
});
