import { expect, test } from '@playwright/test';
import { createSnapshot, expectPath, gotoHash, seedState } from '../helpers/state';

test('QA-12 Today Empty State', async ({ page }) => {
  await seedState(page, {
    snapshot: createSnapshot([]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/today');
  await expect(page.getByText('No quest selected for today')).toBeVisible();
  await page.getByRole('link', { name: 'Choose a Quest' }).click();
  await expectPath(page, '/quests');
});
