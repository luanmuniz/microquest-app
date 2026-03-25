import { expect, test } from '@playwright/test';
import { createSnapshot, expectPath, gotoHash, seedState } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';
import { openDataActionDialog } from '../helpers/ui';

test('QA-22 Clean Data Reset From Navigation', async ({ page }, testInfo) => {
  const quest = createBaseQuest('q-clean-1', 'Quest Before Clean', 'Will be removed');
  const completion = createBaseCompletion('c-clean-1', quest.id, quest.title, 'Completed once');

  await seedState(page, {
    snapshot: createSnapshot([quest], quest.id, [completion]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await openDataActionDialog(page, testInfo.project.name, 'Clean data');
  await expect(page.getByRole('heading', { name: 'Clean all app data?' })).toBeVisible();
  await page.getByRole('button', { name: 'Clean data', exact: true }).click();

  await expectPath(page, '/welcome');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expectPath(page, '/welcome');

  const onboardingState = await page.evaluate(() => ({
    welcome: localStorage.getItem('microquest-welcome-seen'),
    tutorial: localStorage.getItem('microquest-tutorial-seen'),
  }));
  expect(onboardingState.welcome).toBeNull();
  if (testInfo.project.name.includes('mobile')) {
    expect(onboardingState.tutorial).toBe('true');
  } else {
    expect(onboardingState.tutorial).toBeNull();
  }
});
