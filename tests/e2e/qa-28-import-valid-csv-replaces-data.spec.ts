import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseQuest } from '../helpers/fixtures';
import { createCsvImportFile } from '../helpers/files';
import { openDataActionDialog, questCard } from '../helpers/ui';

test('QA-28 Import Valid CSV And Replace Existing Data', async ({ page }, testInfo) => {
  const existingQuest = createBaseQuest('q-import-old-csv-1', 'Old Quest', 'Should be replaced');

  await seedState(page, {
    snapshot: createSnapshot([existingQuest]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await expect(page.getByRole('heading', { name: 'Old Quest' })).toBeVisible();

  const validCsv = [
    'entry_type,title,description,created_at,completed_at,reflection,is_today,is_favorite',
    'quest,Imported CSV Quest,From human export,2026-03-24T10:00:00.000Z,,,true,true',
    'quest,Imported CSV Side Quest,Secondary,2026-03-24T11:00:00.000Z,,,false,false',
    'completed_quest,Imported CSV Quest,From human export,,2026-03-24T12:00:00.000Z,Imported reflection,false,false',
  ].join('\n');

  await openDataActionDialog(page, testInfo.project.name, 'Import data');
  await page
    .locator('input[type="file"]')
    .setInputFiles(createCsvImportFile('valid-backup.csv', validCsv));

  await expect(page.getByText('2 quests, 1 history entries')).toBeVisible();
  await page.getByRole('button', { name: 'Import data' }).click();

  await expect(page.getByRole('heading', { name: 'Imported CSV Quest' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Imported CSV Side Quest' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Old Quest' })).toHaveCount(0);
  await expect(page.locator('.quest-card h3')).toHaveText([
    'Imported CSV Quest',
    'Imported CSV Side Quest',
  ]);
  await expect(
    questCard(page, 'Imported CSV Quest').locator('button[title="Remove from favorites"]'),
  ).toBeVisible();

  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: 'Imported CSV Quest' })).toBeVisible();

  await gotoHash(page, '/history');
  await expect(page.getByRole('heading', { name: 'Imported CSV Quest' })).toBeVisible();
});
