import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseQuest } from '../helpers/fixtures';
import { createImportFile } from '../helpers/files';
import { openDataActionDialog } from '../helpers/ui';

test('QA-21 Import Invalid Files', async ({ page }, testInfo) => {
  const baselineQuest = createBaseQuest('q-invalid-1', 'Baseline Quest', 'Should remain');

  await seedState(page, {
    snapshot: createSnapshot([baselineQuest]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');

  const invalidCases = [
    {
      file: createImportFile('invalid-json.json', '{"quests":['),
      expected: 'This file is not valid JSON.',
    },
    {
      file: createImportFile('invalid-structure.json', JSON.stringify({ invalid: true }, null, 2)),
      expected: 'This file is not a valid Microquest backup.',
    },
    {
      file: createImportFile(
        'missing-today-quest.json',
        JSON.stringify(
          {
            quests: [createBaseQuest('q-a', 'Quest A')],
            todayQuestId: 'missing-id',
            completions: [],
          },
          null,
          2,
        ),
      ),
      expected: 'This backup references a today quest that does not exist.',
    },
    {
      file: createImportFile(
        'invalid-favorite-flag.json',
        JSON.stringify(
          {
            quests: [
              {
                ...createBaseQuest('q-b', 'Quest B'),
                isFavorite: 'yes',
              },
            ],
            todayQuestId: null,
            completions: [],
          },
          null,
          2,
        ),
      ),
      expected: 'This backup contains an invalid quest entry.',
    },
  ] as const;

  for (const invalidCase of invalidCases) {
    await openDataActionDialog(page, testInfo.project.name, 'Import data');
    const dialog = page.getByRole('dialog').filter({ hasText: 'Import Microquest data' });
    await dialog.locator('input[type="file"]').setInputFiles(invalidCase.file);
    await expect(dialog.getByText(invalidCase.expected)).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Import data' })).toBeDisabled();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
  }

  await expect(page.getByText('Baseline Quest')).toBeVisible();
});
