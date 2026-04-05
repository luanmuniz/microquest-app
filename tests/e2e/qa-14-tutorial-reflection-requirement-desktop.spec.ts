import { expect, type Page, test } from '@playwright/test';
import { clearAllState, expectPath, gotoHash, isDesktopProject } from '../helpers/state';
import { createQuestViaDialog, setTodayForQuest, startUsingMicroquest } from '../helpers/ui';

async function clickPrimaryNav(page: Page, label: 'Today') {
  await page.getByRole('link', { name: new RegExp(`^${label}$`) }).first().click();
}

test('QA-14 Tutorial Reflection Requirement On Desktop', async ({ page }, testInfo) => {
  test.skip(!isDesktopProject(testInfo.project.name), 'Desktop only scenario');

  await clearAllState(page);
  await gotoHash(page, '/');
  await startUsingMicroquest(page);
  await expectPath(page, '/quests');
  await expect(page.getByText('Guided Tutorial')).toBeVisible();

  await createQuestViaDialog(
    page,
    'Tutorial Reflection Quest',
    'Used to validate tutorial reflection requirement',
  );
  await setTodayForQuest(page, 'Tutorial Reflection Quest');
  await clickPrimaryNav(page, 'Today');

  await expect(page.getByText('Fill the reflection and complete quest')).toBeVisible();
  const completeButton = page.getByRole('button', { name: 'Complete Quest' });
  const restartButton = page.getByRole('button', { name: 'Complete and Restart' });
  await expect(completeButton).toBeDisabled();
  await expect(restartButton).toBeDisabled();
  await page.getByLabel('Reflection (optional)').fill('Reflection required by tutorial.');
  await expect(completeButton).toBeEnabled();
  await expect(restartButton).toBeEnabled();
  await completeButton.click();

  await expect(page.getByText('See it in history')).toBeVisible();
});
