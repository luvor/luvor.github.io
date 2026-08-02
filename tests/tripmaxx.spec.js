// @ts-check
const { test, expect } = require('@playwright/test');

const NEW_HOST = 'https://tripmaxx.chynybekov.com';

test.describe('Tripmaxx public release pages', () => {
  // Сайт проекта переехал на собственный поддомен (2026-08-03). В user-site
  // остаются AASA — ради установленных 1.0.x, чей QR зашит на этот домен, —
  // и редиректы с прошитых в подписанный билд корневых URL.
  test('legacy paths redirect to the project subdomain', async ({ request }) => {
    for (const p of ['privacy.html', 'privacy.ru.html', 'licenses.html', 'use/']) {
      const response = await request.get(`/${p}`);
      expect(response.ok()).toBeTruthy();
      const target = p === 'use/' ? `${NEW_HOST}/use/` : `${NEW_HOST}/${p}`;
      expect(await response.text()).toContain(`url=${target}`);
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
