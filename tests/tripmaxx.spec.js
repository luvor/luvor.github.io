// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Tripmaxx public release pages', () => {
  test('install landing links to the tripmaxx project page', async ({ page }) => {
    await page.goto('/use/');
    await expect(page.getByRole('heading', { name: 'Get Tripmaxx' })).toBeVisible();

    // Контент проекта живёт в project-page репе luvor/tripmaxx (/tripmaxx/);
    // в user-site остаются только AASA + /use. Кликом не проверить — локальный
    // сервер этой репы /tripmaxx/ не обслуживает, поэтому проверяем href.
    await expect(page.getByRole('link', { name: 'Credits & Licenses' }))
      .toHaveAttribute('href', '/tripmaxx/licenses.html');
    await expect(page.getByRole('link', { name: 'Privacy Policy' }))
      .toHaveAttribute('href', '/tripmaxx/privacy.html');
  });

  test('legacy root pages redirect to the project page', async ({ request }) => {
    // Прошитые в подписанный билд корневые URL обязаны остаться рабочими.
    for (const f of ['privacy.html', 'privacy.ru.html', 'licenses.html']) {
      const response = await request.get(`/${f}`);
      expect(response.ok()).toBeTruthy();
      const body = await response.text();
      expect(body).toContain(`url=https://luvor.github.io/tripmaxx/${f}`);
    }
  });

  test('AASA covers both /use and /use/ with one honest path contract', async ({ request }) => {
    const response = await request.get('/.well-known/apple-app-site-association');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    const detail = body.applinks.details[0];

    expect(detail.appIDs).toEqual(['V45669B929.com.luvor.tracy']);
    expect(detail.components).toEqual([
      {
        '/': '/use*',
        comment: 'Open the Tripmaxx recap QR and install landing in the app',
      },
    ]);
  });
});
