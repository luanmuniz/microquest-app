import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';
import { readDownloadJson, readDownloadText } from '../helpers/files';
import { openDataActionDialog } from '../helpers/ui';

test('QA-18 Export With Existing Data', async ({ page }, testInfo) => {
  const quest = {
    ...createBaseQuest('q-export-1', 'Exportable Quest', 'Available for export'),
    isFavorite: true,
  };
  const completion = createBaseCompletion('c-export-1', quest.id, quest.title, 'Completed');
  await seedState(page, {
    snapshot: createSnapshot([quest], quest.id, [completion]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await openDataActionDialog(page, testInfo.project.name, 'Export data');
  await expect(page.getByRole('heading', { name: 'Export your data?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export JSON backup' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export in human format (CSV)' })).toBeVisible();

  const csvDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export in human format (CSV)' }).click();
  const csvDownload = await csvDownloadPromise;
  expect(csvDownload.suggestedFilename()).toMatch(/^microquest-data-\d{4}-\d{2}-\d{2}\.csv$/);
  const exportedCsvText = await readDownloadText(csvDownload);
  const csvLines = exportedCsvText.split(/\r?\n/);
  expect(csvLines[0]).toBe(
    'entry_type,title,description,created_at,completed_at,reflection,is_today,is_favorite',
  );
  expect(csvLines.length).toBe(3);
  expect(csvLines[1]).toContain('quest,Exportable Quest,Available for export');
  expect(csvLines[1]).toContain(',true,true');
  expect(csvLines[2]).toContain('completed_quest,Exportable Quest,Available for export');
  expect(csvLines[2]).toContain(',Completed,false,false');

  await openDataActionDialog(page, testInfo.project.name, 'Export data');
  const jsonDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON backup' }).click();
  const jsonDownload = await jsonDownloadPromise;
  expect(jsonDownload.suggestedFilename()).toMatch(/^microquest-data-\d{4}-\d{2}-\d{2}\.json$/);

  const exported = await readDownloadJson(jsonDownload);
  expect(exported.quests).toHaveLength(1);
  expect(exported.quests[0]?.isFavorite).toBe(true);
  expect(exported.todayQuestId).toBe(quest.id);
  expect(exported.completions).toHaveLength(1);
});
