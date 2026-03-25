import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { openCreateQuestDialog } from '../helpers/ui';

test('QA-08 Quest Creation And Blank-Title Validation', async ({ page }) => {
  await seedState(page, {
    snapshot: createSnapshot([]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await openCreateQuestDialog(page);
  await page.getByRole('button', { name: 'Create Quest' }).click();
  await expect(page.getByText('Quest title is required')).toBeVisible();

  await page.getByLabel('Quest Title *').fill('Read 10 pages');
  await page.getByLabel('Description (optional)').fill('Read before bed without distractions.');
  await page.getByRole('button', { name: 'Create Quest' }).click();

  await expect(page.getByRole('heading', { name: 'Read 10 pages' })).toBeVisible();
});
