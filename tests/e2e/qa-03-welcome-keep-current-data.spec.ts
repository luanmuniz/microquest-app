import { expect, test } from '@playwright/test';
import {
  createSnapshot,
  expectPath,
  gotoHash,
  readStoredSnapshot,
  seedState,
} from '../helpers/state';
import { createBaseQuest } from '../helpers/fixtures';

test('QA-03 Welcome Secondary Flow Keep Current Data', async ({ page }) => {
  const keepQuest = createBaseQuest('q-keep-1', 'Keep Existing Quest', 'Should stay after flow');
  await seedState(page, {
    snapshot: createSnapshot([keepQuest]),
    welcomeSeen: false,
    tutorialSeen: false,
  });

  await gotoHash(page, '/welcome');
  await page.getByRole('button', { name: 'I already know the app' }).click();
  await page.getByRole('button', { name: 'Keep current data' }).click();

  await expectPath(page, '/quests');
  const snapshot = await readStoredSnapshot(page);
  expect(snapshot?.quests.some((quest) => quest.title === 'Keep Existing Quest')).toBeTruthy();
  await expect(page.getByText('Keep Existing Quest')).toBeVisible();
});
