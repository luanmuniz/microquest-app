import { expect, test } from '@playwright/test';
import { clearAllState, expectPath, gotoHash, isMobileProject } from '../helpers/state';
import { startUsingMicroquest } from '../helpers/ui';

test('QA-05 First Launch Routing On Mobile', async ({ page }, testInfo) => {
  test.skip(!isMobileProject(testInfo.project.name), 'Mobile only scenario');

  await clearAllState(page);
  await gotoHash(page, '/');
  await expectPath(page, '/welcome');
  await startUsingMicroquest(page);
  await expectPath(page, '/quests');

  await expect(page.getByText('Guided Tutorial')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /^Quests$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Today$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /^History$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'More' })).toBeVisible();
});
