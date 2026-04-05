import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseQuest } from '../helpers/fixtures';
import { createCsvImportFile } from '../helpers/files';
import { openDataActionDialog, questCard } from '../helpers/ui';

test('QA-29 Import CSV Dedupe By Title And Description', async ({ page }, testInfo) => {
  const existingQuest = createBaseQuest('q-import-old-csv-2', 'Old Quest', 'Should be replaced');

  await seedState(page, {
    snapshot: createSnapshot([existingQuest]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  const dedupeCsv = [
    'entry_type,title,description,created_at,completed_at,reflection,is_today,is_favorite',
    'quest,Read Book,Daily pages,2026-03-24T10:00:00.000Z,,,true,false',
    'completed_quest, read book , Daily pages ,,2026-03-25T10:00:00.000Z,Done once,false,false',
    'quest,READ BOOK,daily pages,2026-03-26T10:00:00.000Z,,,false,true',
    'completed_quest,Hydrate,Drink water,,2026-03-24T12:00:00.000Z,Done,false,false',
    'quest,  HYDRATE  , drink water ,2026-03-23T10:00:00.000Z,,,false,false',
  ].join('\n');

  await gotoHash(page, '/quests');
  await openDataActionDialog(page, testInfo.project.name, 'Import data');
  await page
    .locator('input[type="file"]')
    .setInputFiles(createCsvImportFile('dedupe-backup.csv', dedupeCsv));

  await expect(page.getByText('2 quests, 2 history entries')).toBeVisible();
  await page.getByRole('button', { name: 'Import data' }).click();

  await expect(page.getByRole('heading', { name: 'Read Book' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hydrate' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Old Quest' })).toHaveCount(0);
  await expect(page.locator('.quest-card h3')).toHaveText(['Read Book', 'Hydrate']);
  await expect(
    questCard(page, 'Read Book').locator('button[title="Remove from favorites"]'),
  ).toBeVisible();

  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: 'Read Book' })).toBeVisible();

  await gotoHash(page, '/history');
  await expect(page.getByRole('heading', { name: 'Read Book' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hydrate' })).toBeVisible();
});
