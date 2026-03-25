import { expect, test } from '@playwright/test';
import { clearAllState, expectPath, gotoHash, isDesktopProject } from '../helpers/state';

test('QA-01 First Launch Routing On Desktop', async ({ page }, testInfo) => {
  await clearAllState(page);
  await gotoHash(page, '/');
  await expectPath(page, '/welcome');
  await expect(page.getByRole('button', { name: 'Start Using Microquest' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'I already know the app' })).toBeVisible();
});
