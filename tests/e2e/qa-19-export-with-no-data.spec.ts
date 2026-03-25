import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { openDataActionDialog } from '../helpers/ui';

test('QA-19 Export With No Data', async ({ page }, testInfo) => {
  await seedState(page, {
    snapshot: createSnapshot([]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await openDataActionDialog(page, testInfo.project.name, 'Export data');
  await expect(page.getByRole('heading', { name: 'No data to export yet' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export data' })).toBeDisabled();
});
