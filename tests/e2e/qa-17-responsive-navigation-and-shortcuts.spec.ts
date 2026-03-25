import { expect, type Page, test } from '@playwright/test';
import { createSnapshot, expectPath, gotoHash, seedState } from '../helpers/state';
import { createBaseCompletion, createBaseQuest } from '../helpers/fixtures';
import { openDataActionDialog } from '../helpers/ui';

async function clickPrimaryNav(page: Page, label: 'Quests' | 'Today' | 'History') {
  await page.getByRole('link', { name: new RegExp(`^${label}$`) }).first().click();
}

test('QA-17 Desktop And Mobile Navigation', async ({ page }, testInfo) => {
  const questToday = createBaseQuest('q-nav-1', 'Navigation Today Quest', 'Used for today page');
  const questSecondary = createBaseQuest(
    'q-nav-2',
    'Navigation Secondary Quest',
    'Used for history entry',
  );
  const completion = createBaseCompletion(
    'c-nav-1',
    questSecondary.id,
    questSecondary.title,
    'Navigation reflection.',
  );

  await seedState(page, {
    snapshot: createSnapshot([questToday, questSecondary], questToday.id, [completion]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await clickPrimaryNav(page, 'Today');
  await expectPath(page, '/today');
  await clickPrimaryNav(page, 'History');
  await expectPath(page, '/history');

  if (testInfo.project.name.includes('mobile')) {
    await page.getByRole('button', { name: 'More' }).click();
    await expect(page.getByRole('menuitem', { name: 'How it works' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Import data' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Export data' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Clean data' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'How it works' }).click();
  } else {
    await page.getByRole('link', { name: 'How it works' }).click();
  }

  await expectPath(page, '/welcome');
  await page.getByRole('link', { name: 'Enter App' }).click();
  await expectPath(page, '/quests');

  await openDataActionDialog(page, testInfo.project.name, 'Import data');
  await expect(page.getByRole('heading', { name: 'Import Microquest data' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();

  await openDataActionDialog(page, testInfo.project.name, 'Export data');
  await expect(page.getByRole('heading', { name: 'Export your data?' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();

  await openDataActionDialog(page, testInfo.project.name, 'Clean data');
  await expect(page.getByRole('heading', { name: 'Clean all app data?' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();

  await gotoHash(page, '/today');
  await page.getByRole('link', { name: "Want to change today's quest?" }).click();
  await expectPath(page, '/quests');
});
