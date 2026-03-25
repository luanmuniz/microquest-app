import { expect, test } from '@playwright/test';
import { createSnapshot, expectPath, gotoHash, seedState } from '../helpers/state';

test('QA-16 History Empty State', async ({ page }) => {
  await seedState(page, {
    snapshot: createSnapshot([]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/history');
  await expect(page.getByText('No completed quests yet')).toBeVisible();
  await page.getByRole('link', { name: "View Today's Quest" }).click();
  await expectPath(page, '/today');
});
