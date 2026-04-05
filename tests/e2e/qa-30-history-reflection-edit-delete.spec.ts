import { expect, test } from '@playwright/test';
import {
  createSnapshot,
  gotoHash,
  readStoredSnapshot,
  seedState,
} from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';

test('QA-30 History Reflection Edit And Delete', async ({ page }) => {
  const questOne = createBaseQuest(
    'q-his-edit-1',
    'Quest To Edit Reflection',
    'First history entry',
  );
  const questTwo = createBaseQuest(
    'q-his-edit-2',
    'Quest To Delete Entry',
    'Second history entry',
  );
  const completionOne = createBaseCompletion(
    'c-his-edit-1',
    questOne.id,
    questOne.title,
    'Original reflection text.',
  );
  const completionTwo = createBaseCompletion(
    'c-his-edit-2',
    questTwo.id,
    questTwo.title,
    'Reflection to be deleted.',
  );

  await seedState(page, {
    snapshot: createSnapshot([questOne, questTwo], null, [completionOne, completionTwo]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/history');
  await expect(page.getByText('2 completed quests')).toBeVisible();

  const entryToEdit = page
    .locator('.quest-card')
    .filter({ hasText: questOne.title })
    .first();
  const entryToDelete = page
    .locator('.quest-card')
    .filter({ hasText: questTwo.title })
    .first();

  await entryToEdit.locator('button[title="Edit reflection"]').click();
  await expect(page.getByRole('heading', { name: 'Edit reflection' })).toBeVisible();
  const editDialog = page.getByRole('dialog', { name: 'Edit reflection' });
  const reflectionInput = editDialog.getByRole('textbox', { name: 'Reflection' });
  await expect(reflectionInput).toHaveValue('Original reflection text.');
  await reflectionInput.fill('Updated reflection after typo fix.');
  await page.getByRole('button', { name: 'Save changes' }).click();

  await entryToEdit.click();
  await expect(entryToEdit.getByText('Updated reflection after typo fix.')).toBeVisible();

  await entryToEdit.locator('button[title="Edit reflection"]').click();
  await reflectionInput.fill('   ');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(entryToEdit.getByText('No reflection recorded.')).toBeVisible();

  await entryToDelete.locator('button[title="Delete entry"]').click();
  await expect(page.getByRole('heading', { name: 'Delete this history entry?' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(page.getByText('1 completed quest')).toBeVisible();
  await expect(page.getByRole('heading', { name: questTwo.title })).toHaveCount(0);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await gotoHash(page, '/history');

  await expect(page.getByText('1 completed quest')).toBeVisible();
  const persistedEntry = page
    .locator('.quest-card')
    .filter({ hasText: questOne.title })
    .first();
  await persistedEntry.click();
  await expect(persistedEntry.getByText('No reflection recorded.')).toBeVisible();
  await expect(page.getByRole('heading', { name: questTwo.title })).toHaveCount(0);

  const storedSnapshot = await readStoredSnapshot(page);
  expect(storedSnapshot?.completions).toHaveLength(1);
  expect(storedSnapshot?.completions[0]?.id).toBe(completionOne.id);
  expect(storedSnapshot?.completions[0]?.reflection).toBe('');
});
