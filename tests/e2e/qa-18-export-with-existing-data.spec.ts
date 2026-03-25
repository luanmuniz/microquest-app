import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';
import { readDownloadJson } from '../helpers/files';
import { openDataActionDialog } from '../helpers/ui';

test('QA-18 Export With Existing Data', async ({ page }, testInfo) => {
  const quest = createBaseQuest('q-export-1', 'Exportable Quest', 'Available for export');
  const completion = createBaseCompletion('c-export-1', quest.id, quest.title, 'Completed');
  await seedState(page, {
    snapshot: createSnapshot([quest], quest.id, [completion]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await openDataActionDialog(page, testInfo.project.name, 'Export data');
  await expect(page.getByRole('heading', { name: 'Export your data?' })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export data' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^microquest-data-\d{4}-\d{2}-\d{2}\.json$/);

  const exported = await readDownloadJson(download);
  expect(exported.quests).toHaveLength(1);
  expect(exported.todayQuestId).toBe(quest.id);
  expect(exported.completions).toHaveLength(1);
});
