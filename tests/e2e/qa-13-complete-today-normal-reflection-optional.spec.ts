import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseQuest } from '../helpers/fixtures';

test('QA-13 Complete Today Quest In Normal Use', async ({ page }) => {
  const quest = createBaseQuest('q-complete-1', 'Daily Focus Quest', 'Keep moving');
  await seedState(page, {
    snapshot: createSnapshot([quest], quest.id, []),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/today');
  const completeButton = page.getByRole('button', { name: 'Complete Quest' });
  await expect(completeButton).toBeEnabled();
  await completeButton.click();

  await expect(page.getByText('No quest selected for today')).toBeVisible();
  await gotoHash(page, '/history');
  await expect(page.getByRole('heading', { name: 'Daily Focus Quest' })).toBeVisible();
  await page.locator('.quest-card').filter({ hasText: 'Daily Focus Quest' }).first().click();
  await expect(page.getByText('No reflection recorded.')).toBeVisible();
});
