import { expect, test } from '@playwright/test';
import { createBaseQuest } from '../helpers/fixtures';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { openStarterTemplatesDialog, selectStarterTemplate } from '../helpers/ui';

test('QA-32 Starter Templates Header Flow Prefills Create Quest', async ({ page }) => {
  await seedState(page, {
    snapshot: createSnapshot([createBaseQuest('q-existing-1', 'Existing Quest', 'Already here')]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await openStarterTemplatesDialog(page);

  await expect(page.getByRole('heading', { name: 'Fitness' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Study' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mindfulness' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Work' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Health' })).toBeVisible();

  await selectStarterTemplate(page, 'Run one 25-minute focus sprint');
  await expect(page.getByLabel('Quest Title *')).toHaveValue('Run one 25-minute focus sprint');
  await expect(page.getByLabel('Description (optional)')).toHaveValue(
    'Study with full focus for one Pomodoro block.',
  );
  await page.getByRole('button', { name: 'Create Quest' }).click();

  await expect(page.getByRole('heading', { name: 'Run one 25-minute focus sprint' })).toBeVisible();
});

test('QA-32 Starter Templates Empty State Flow Replaces Empty View', async ({ page }) => {
  await seedState(page, {
    snapshot: createSnapshot([]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await expect(page.getByText('No quests yet')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create Your First Quest' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Starter Templates' })).toBeVisible();

  await openStarterTemplatesDialog(page);
  await selectStarterTemplate(page, 'Prepare one balanced meal');
  await expect(page.getByLabel('Quest Title *')).toHaveValue('Prepare one balanced meal');
  await expect(page.getByLabel('Description (optional)')).toHaveValue(
    'Build a simple meal with protein, fiber, and healthy carbs.',
  );
  await page.getByRole('button', { name: 'Create Quest' }).click();

  await expect(page.getByRole('heading', { name: 'Prepare one balanced meal' })).toBeVisible();
  await expect(page.getByText('No quests yet')).toHaveCount(0);
});
