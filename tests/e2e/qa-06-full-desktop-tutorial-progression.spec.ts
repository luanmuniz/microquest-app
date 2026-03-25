import { expect, type Page, test } from '@playwright/test';
import { clearAllState, expectPath, gotoHash, isDesktopProject } from '../helpers/state';
import { openCreateQuestDialog, setTodayForQuest, startUsingMicroquest } from '../helpers/ui';

async function clickPrimaryNav(page: Page, label: 'Today' | 'History') {
  await page.getByRole('link', { name: new RegExp(`^${label}$`) }).first().click();
}

test('QA-06 Full Desktop Tutorial Progression', async ({ page }, testInfo) => {
  test.skip(!isDesktopProject(testInfo.project.name), 'Desktop only scenario');

  await clearAllState(page);
  await gotoHash(page, '/');
  await startUsingMicroquest(page);
  await expectPath(page, '/quests');
  await expect(page.getByText('Guided Tutorial')).toBeVisible();
  await expect(page.getByText('Create your first quest')).toBeVisible();

  await openCreateQuestDialog(page);
  await page.getByLabel('Quest Title *').fill('Read 10 pages');
  await page.getByLabel('Description (optional)').fill('Read before bed without distractions.');
  await page.getByRole('button', { name: 'Create Quest' }).click();

  await expect(page.getByText("Mark it as today's quest")).toBeVisible();
  await setTodayForQuest(page, 'Read 10 pages');

  await expect(page.getByText("Open Today's Quest page")).toBeVisible();
  await clickPrimaryNav(page, 'Today');
  await expectPath(page, '/today');

  await expect(page.getByText('Fill the reflection and complete quest')).toBeVisible();
  await page.getByLabel('Reflection (optional)').fill(
    'I completed it and felt more focused afterwards.',
  );
  await page.getByRole('button', { name: 'Complete Quest' }).click();

  await expect(page.getByText('See it in history')).toBeVisible();
  await clickPrimaryNav(page, 'History');
  await expectPath(page, '/history');

  await expect(page.getByText('Confirm your result')).toBeVisible();
  await expect(page.locator('.quest-card').filter({ hasText: 'Read 10 pages' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Tutorial Complete')).toBeVisible();
  await page.getByRole('button', { name: 'Keep tutorial data' }).click();
  await expect(page.getByText('Guided Tutorial')).toHaveCount(0);
});
