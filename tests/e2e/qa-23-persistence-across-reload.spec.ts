import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';

test('QA-23 Persistence Across Reloads', async ({ page }) => {
  const todayQuest = createBaseQuest('q-persist-1', 'Persistent Today Quest', 'Should persist');
  const historyQuest = createBaseQuest('q-persist-2', 'Persistent History Quest', 'Completed once');
  const completion = createBaseCompletion(
    'c-persist-1',
    historyQuest.id,
    historyQuest.title,
    'Persistence reflection',
  );

  await seedState(page, {
    snapshot: createSnapshot([todayQuest, historyQuest], todayQuest.id, [completion]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await expect(page.getByRole('heading', { name: 'Persistent Today Quest' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Persistent History Quest' })).toBeVisible();

  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: 'Persistent Today Quest' })).toBeVisible();

  await gotoHash(page, '/history');
  await expect(page.getByRole('heading', { name: 'Persistent History Quest' })).toBeVisible();

  await page.reload({ waitUntil: 'domcontentloaded' });

  await gotoHash(page, '/quests');
  await expect(page.getByRole('heading', { name: 'Persistent Today Quest' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Persistent History Quest' })).toBeVisible();

  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: 'Persistent Today Quest' })).toBeVisible();

  await gotoHash(page, '/history');
  await expect(page.getByRole('heading', { name: 'Persistent History Quest' })).toBeVisible();
});
