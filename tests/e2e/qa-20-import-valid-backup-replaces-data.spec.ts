import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';
import { createSnapshotImportFile } from '../helpers/files';
import { openDataActionDialog } from '../helpers/ui';

test('QA-20 Import Valid Backup And Replace Existing Data', async ({ page }, testInfo) => {
  const existingQuest = createBaseQuest('q-import-old-1', 'Old Quest', 'Should be replaced');
  const importedQuest = createBaseQuest('q-import-new-1', 'Imported Quest', 'From backup');
  const importedCompletion = createBaseCompletion(
    'c-import-new-1',
    importedQuest.id,
    importedQuest.title,
    'Imported reflection',
  );

  await seedState(page, {
    snapshot: createSnapshot([existingQuest]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await expect(page.getByRole('heading', { name: 'Old Quest' })).toBeVisible();

  await openDataActionDialog(page, testInfo.project.name, 'Import data');
  await page
    .locator('input[type="file"]')
    .setInputFiles(
      createSnapshotImportFile(
        'valid-backup.json',
        createSnapshot([importedQuest], importedQuest.id, [importedCompletion]),
      ),
    );

  await expect(page.getByText('1 quests, 1 history entries')).toBeVisible();
  await page.getByRole('button', { name: 'Import data' }).click();

  await expect(page.getByRole('heading', { name: 'Imported Quest' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Old Quest' })).toHaveCount(0);

  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: 'Imported Quest' })).toBeVisible();

  await gotoHash(page, '/history');
  await expect(page.getByRole('heading', { name: 'Imported Quest' })).toBeVisible();
});
