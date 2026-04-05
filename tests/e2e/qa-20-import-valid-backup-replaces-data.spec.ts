import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';
import { createSnapshotImportFile } from '../helpers/files';
import { openDataActionDialog, questCard } from '../helpers/ui';

test('QA-20 Import Valid Backup And Replace Existing Data', async ({ page }, testInfo) => {
  const existingQuest = createBaseQuest('q-import-old-1', 'Old Quest', 'Should be replaced');
  const importedQuest = createBaseQuest('q-import-new-1', 'Imported Quest', 'From backup');
  const importedFavoriteQuest = {
    ...createBaseQuest('q-import-new-2', 'Imported Favorite Quest', 'Pinned from backup'),
    isFavorite: true,
  };
  const importedCompletion = createBaseCompletion(
    'c-import-new-1',
    importedFavoriteQuest.id,
    importedFavoriteQuest.title,
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
        createSnapshot(
          [importedQuest, importedFavoriteQuest],
          importedFavoriteQuest.id,
          [importedCompletion],
        ),
      ),
    );

  await expect(page.getByText('2 quests, 1 history entries')).toBeVisible();
  await page.getByRole('button', { name: 'Import data' }).click();

  await expect(page.getByRole('heading', { name: 'Imported Quest' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Imported Favorite Quest' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Old Quest' })).toHaveCount(0);
  await expect(page.locator('.quest-card h3')).toHaveText([
    'Imported Favorite Quest',
    'Imported Quest',
  ]);
  await expect(
    questCard(page, 'Imported Favorite Quest').locator('button[title="Remove from favorites"]'),
  ).toBeVisible();

  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: 'Imported Favorite Quest' })).toBeVisible();

  await gotoHash(page, '/history');
  await expect(page.getByRole('heading', { name: 'Imported Favorite Quest' })).toBeVisible();
});
