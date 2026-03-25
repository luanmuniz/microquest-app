import { expect, test } from '@playwright/test';
import { expectPath, gotoHash } from '../helpers/state';

test('QA-24 Recovery From Corrupted Stored Data', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('microquest-data', '{"brokenJson":');
    localStorage.setItem('microquest-welcome-seen', 'true');
    localStorage.setItem('microquest-tutorial-seen', 'true');
  });

  await gotoHash(page, '/');
  await expectPath(page, '/quests');
  await expect(page.getByRole('heading', { name: 'Your Quests' })).toBeVisible();
  await expect(page.getByText('3 quests in your collection')).toBeVisible();
  await expect(page.getByText('Take a 10-minute walk')).toBeVisible();
});
