import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { deleteQuest, questCard } from '../helpers/ui';
import { createBaseQuest } from '../helpers/fixtures';

test('QA-10 Quest Deletion Including Selected-Today Edge Case', async ({ page }) => {
  const questToday = createBaseQuest('q-del-1', 'Today Quest', 'This is selected');
  const questOther = createBaseQuest('q-del-2', 'Other Quest', 'This will be removed first');
  await seedState(page, {
    snapshot: createSnapshot([questToday, questOther], questToday.id),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await deleteQuest(page, 'Other Quest');
  await expect(page.getByRole('heading', { name: 'Other Quest' })).toHaveCount(0);
  await expect(
    questCard(page, 'Today Quest').locator('span').filter({ hasText: /^Today$/ }),
  ).toBeVisible();

  await deleteQuest(page, 'Today Quest');
  await expect(page.getByRole('heading', { name: 'Today Quest' })).toHaveCount(0);

  await gotoHash(page, '/today');
  await expect(page.getByText('No quest selected for today')).toBeVisible();
});
