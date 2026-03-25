import { expect, test } from '@playwright/test';
import { createSnapshot, expectPath, gotoHash, seedState } from '../helpers/state';

test('QA-25 Not-Found Route Handling', async ({ page }) => {
  await seedState(page, {
    snapshot: createSnapshot([]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/does-not-exist');
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to Quests' })).toBeVisible();
  await page.getByRole('link', { name: 'Return to Quests' }).click();
  await expectPath(page, '/quests');
});
