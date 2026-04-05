import { expect, test } from '@playwright/test';
import { createBaseQuest } from '../helpers/fixtures';
import { createSnapshot, gotoHash, readStoredSnapshot, seedState } from '../helpers/state';
import { questCard, toggleFavoriteForQuest } from '../helpers/ui';

test('QA-27 Favorite Quests Stay At Top And Persist', async ({ page }) => {
  const firstQuest = createBaseQuest('q-favorite-1', 'Quest Alpha', 'First quest');
  const secondQuest = createBaseQuest('q-favorite-2', 'Quest Beta', 'Second quest');
  const thirdQuest = createBaseQuest('q-favorite-3', 'Quest Gamma', 'Third quest');

  await seedState(page, {
    snapshot: createSnapshot([firstQuest, secondQuest, thirdQuest]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await expect(page.locator('.quest-card h3')).toHaveText([
    'Quest Alpha',
    'Quest Beta',
    'Quest Gamma',
  ]);

  await toggleFavoriteForQuest(page, 'Quest Gamma');
  await expect(page.locator('.quest-card h3')).toHaveText([
    'Quest Gamma',
    'Quest Alpha',
    'Quest Beta',
  ]);

  await toggleFavoriteForQuest(page, 'Quest Beta');
  await expect(page.locator('.quest-card h3')).toHaveText([
    'Quest Beta',
    'Quest Gamma',
    'Quest Alpha',
  ]);

  await toggleFavoriteForQuest(page, 'Quest Beta');
  await expect(page.locator('.quest-card h3')).toHaveText([
    'Quest Gamma',
    'Quest Alpha',
    'Quest Beta',
  ]);

  await expect(questCard(page, 'Quest Gamma').locator('button[title="Remove from favorites"]')).toBeVisible();
  await expect(questCard(page, 'Quest Alpha').locator('button[title="Add to favorites"]')).toBeVisible();

  const snapshotBeforeReload = await readStoredSnapshot(page);
  expect(snapshotBeforeReload?.quests.find((quest) => quest.id === thirdQuest.id)?.isFavorite).toBeTruthy();
  expect(snapshotBeforeReload?.quests.find((quest) => quest.id === secondQuest.id)?.isFavorite).toBeFalsy();

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.quest-card h3')).toHaveText([
    'Quest Gamma',
    'Quest Alpha',
    'Quest Beta',
  ]);
  await expect(questCard(page, 'Quest Gamma').locator('button[title="Remove from favorites"]')).toBeVisible();
});
