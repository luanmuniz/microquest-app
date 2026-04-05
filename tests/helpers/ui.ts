import { expect, type Page } from '@playwright/test';
import { isMobileProject } from './state';

export async function startUsingMicroquest(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Start Using Microquest' }).click();
}

export async function openCreateQuestDialog(page: Page): Promise<void> {
  const newQuestButton = page.getByRole('button', { name: 'New Quest' });
  if (await newQuestButton.count()) {
    await newQuestButton.first().click();
  } else {
    await page.getByRole('button', { name: 'Create Your First Quest' }).click();
  }

  await expect(page.getByRole('heading', { name: 'Create New Quest' })).toBeVisible();
}

export async function createQuestViaDialog(
  page: Page,
  title: string,
  description = '',
): Promise<void> {
  await openCreateQuestDialog(page);
  await page.getByLabel('Quest Title *').fill(title);
  await page.getByLabel('Description (optional)').fill(description);
  await page.getByRole('button', { name: 'Create Quest' }).click();
}

export function questCard(page: Page, questTitle: string) {
  return page.locator('.quest-card').filter({ hasText: questTitle }).first();
}

export async function setTodayForQuest(page: Page, questTitle: string): Promise<void> {
  await questCard(page, questTitle).locator('button[title="Set as Today\'s Quest"]').click();
}

export async function toggleFavoriteForQuest(page: Page, questTitle: string): Promise<void> {
  await questCard(page, questTitle)
    .locator('button[title="Add to favorites"], button[title="Remove from favorites"]')
    .click();
}

export async function editQuest(
  page: Page,
  existingTitle: string,
  nextTitle: string,
  nextDescription: string,
): Promise<void> {
  await questCard(page, existingTitle).locator('button[title="Edit Quest"]').click();
  await expect(page.getByRole('heading', { name: 'Edit Quest' })).toBeVisible();
  await page.getByLabel('Quest Title *').fill(nextTitle);
  await page.getByLabel('Description (optional)').fill(nextDescription);
  await page.getByRole('button', { name: 'Save Changes' }).click();
}

export async function deleteQuest(page: Page, questTitle: string): Promise<void> {
  await questCard(page, questTitle).locator('button[title="Delete Quest"]').click();
  await expect(page.getByRole('heading', { name: 'Delete this quest?' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
}

export async function openDataActionDialog(
  page: Page,
  projectName: string,
  actionLabel: 'Import data' | 'Export data' | 'Clean data',
): Promise<void> {
  const menuItem = page.getByRole('menuitem', { name: actionLabel });

  if (isMobileProject(projectName)) {
    await page.getByRole('button', { name: 'More' }).click();
  } else {
    await page.getByRole('button', { name: 'Backup' }).click();
    if (!(await menuItem.isVisible().catch(() => false))) {
      await page.getByRole('button', { name: 'Backup' }).click();
    }
  }

  await expect(menuItem).toBeVisible();
  await menuItem.click();
}
