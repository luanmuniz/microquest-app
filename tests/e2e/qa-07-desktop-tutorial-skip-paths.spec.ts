import { expect, test } from '@playwright/test';
import { clearAllState, expectPath, gotoHash, isDesktopProject, readStoredSnapshot } from '../helpers/state';
import { startUsingMicroquest } from '../helpers/ui';

test('QA-07 Desktop Tutorial Skip Paths', async ({ page }, testInfo) => {
  test.skip(!isDesktopProject(testInfo.project.name), 'Desktop only scenario');

  const startTutorial = async () => {
    await clearAllState(page);
    await gotoHash(page, '/');
    await startUsingMicroquest(page);
    await expectPath(page, '/quests');
    await expect(page.getByText('Guided Tutorial')).toBeVisible();
  };

  await startTutorial();
  await page.getByRole('button', { name: 'Skip tutorial' }).click();
  await expect(page.getByRole('heading', { name: 'Skip tutorial?' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue tutorial' }).click();
  await expect(page.getByRole('heading', { name: 'Skip tutorial?' })).toHaveCount(0);
  await expect(page.getByText('Guided Tutorial')).toBeVisible();

  await page.getByRole('button', { name: 'Skip tutorial' }).click();
  await page.getByRole('button', { name: 'Skip and keep data' }).click();
  await expect(page.getByText('Guided Tutorial')).toHaveCount(0);
  await expectPath(page, '/quests');

  const keptDataSnapshot = await readStoredSnapshot(page);
  expect((keptDataSnapshot?.quests.length ?? 0) > 0).toBeTruthy();

  await startTutorial();
  await page.getByRole('button', { name: 'Skip tutorial' }).click();
  await page.getByRole('button', { name: 'Skip and clean data' }).click();

  await expect(page.getByText('Guided Tutorial')).toHaveCount(0);
  await expect(page.getByText('No quests yet')).toBeVisible();

  const cleanedSnapshot = await readStoredSnapshot(page);
  expect(cleanedSnapshot?.quests).toHaveLength(0);
});
