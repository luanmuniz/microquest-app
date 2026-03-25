import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, readStoredSnapshot, seedState, expectPath } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';

test('QA-04 Welcome Secondary Flow Clear And Start Fresh', async ({ page }) => {
  const questOne = createBaseQuest('q-clear-1', 'Quest To Remove', 'To be removed');
  const questTwo = createBaseQuest('q-clear-2', 'Second Quest To Remove', 'To be removed too');
  const completion = createBaseCompletion('c-clear-1', questOne.id, questOne.title, 'Done once');

  await seedState(page, {
    snapshot: createSnapshot([questOne, questTwo], questOne.id, [completion]),
    welcomeSeen: false,
    tutorialSeen: false,
  });

  await gotoHash(page, '/welcome');
  await page.getByRole('button', { name: 'I already know the app' }).click();
  await page.getByRole('button', { name: 'Clear and start fresh' }).click();

  await expectPath(page, '/quests');
  await expect(page.getByText('No quests yet')).toBeVisible();

  await gotoHash(page, '/today');
  await expect(page.getByText('No quest selected for today')).toBeVisible();

  await gotoHash(page, '/history');
  await expect(page.getByText('No completed quests yet')).toBeVisible();

  const snapshot = await readStoredSnapshot(page);
  expect(snapshot?.quests).toHaveLength(0);
  expect(snapshot?.completions).toHaveLength(0);
  expect(snapshot?.todayQuestId).toBeNull();
});
