import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, readStoredSnapshot, seedState } from '../helpers/state';
import { createBaseQuest } from '../helpers/fixtures';

test('QA-31 Complete And Restart Keeps Today Quest And Persists', async ({ page }) => {
  const quest = createBaseQuest('q-restart-1', 'Repeatable Focus Quest', 'Keep momentum daily');
  const reflection = 'Did a second pass to reinforce the habit.';

  await seedState(page, {
    snapshot: createSnapshot([quest], quest.id, []),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/today');
  const reflectionInput = page.getByLabel('Reflection (optional)');
  await reflectionInput.fill(reflection);
  await page.getByRole('button', { name: 'Complete and Restart' }).click();

  await expect
    .poll(async () => (await readStoredSnapshot(page))?.completions.length ?? 0)
    .toBe(1);

  const snapshotAfterRestart = await readStoredSnapshot(page);
  expect(snapshotAfterRestart?.todayQuestId).toBe(quest.id);
  expect(snapshotAfterRestart?.completions[0]?.questId).toBe(quest.id);
  expect(snapshotAfterRestart?.completions[0]?.reflection).toBe(reflection);

  await expect(page.getByRole('heading', { name: quest.title })).toBeVisible();
  await expect(reflectionInput).toHaveValue('');

  await gotoHash(page, '/history');
  const entry = page.locator('.quest-card').filter({ hasText: quest.title }).first();
  await expect(entry).toBeVisible();
  await entry.click();
  await expect(entry.getByText(reflection)).toBeVisible();

  await page.reload({ waitUntil: 'domcontentloaded' });
  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: quest.title })).toBeVisible();

  const snapshotAfterReload = await readStoredSnapshot(page);
  expect(snapshotAfterReload?.todayQuestId).toBe(quest.id);
  expect(snapshotAfterReload?.completions).toHaveLength(1);
});
