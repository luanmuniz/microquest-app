import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';

test('QA-15 History Review And Expandable Entries', async ({ page }) => {
  const questOne = createBaseQuest('q-his-1', 'Quest With Reflection', 'History entry one');
  const questTwo = createBaseQuest('q-his-2', 'Quest Without Reflection', 'History entry two');
  const completionOne = createBaseCompletion(
    'c-his-1',
    questOne.id,
    questOne.title,
    'I completed it and felt more focused afterwards.',
  );
  const completionTwo = createBaseCompletion('c-his-2', questTwo.id, questTwo.title, '');

  await seedState(page, {
    snapshot: createSnapshot([questOne, questTwo], null, [completionOne, completionTwo]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/history');
  await expect(page.getByText('2 completed quests')).toBeVisible();

  const reflectionEntry = page.locator('.quest-card').filter({ hasText: 'Quest With Reflection' }).first();
  await reflectionEntry.click();
  await expect(page.getByText('I completed it and felt more focused afterwards.')).toBeVisible();
  await reflectionEntry.click();
  await expect(page.getByText('I completed it and felt more focused afterwards.')).toHaveCount(0);

  const noReflectionEntry = page
    .locator('.quest-card')
    .filter({ hasText: 'Quest Without Reflection' })
    .first();
  await noReflectionEntry.click();
  await expect(page.getByText('No reflection recorded.')).toBeVisible();
});
