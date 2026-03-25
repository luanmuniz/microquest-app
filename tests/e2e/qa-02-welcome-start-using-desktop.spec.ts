import { expect, test } from '@playwright/test';
import { clearAllState, expectPath, gotoHash, isDesktopProject } from '../helpers/state';
import { startUsingMicroquest } from '../helpers/ui';

test('QA-02 Welcome Start Using Flow On Desktop', async ({ page }, testInfo) => {
  test.skip(!isDesktopProject(testInfo.project.name), 'Desktop only scenario');

  await clearAllState(page);
  await gotoHash(page, '/');
  await startUsingMicroquest(page);
  await expectPath(page, '/quests');
  await expect(page.getByText('Guided Tutorial')).toBeVisible();
  await expect(page.getByText('Create your first quest')).toBeVisible();
});
