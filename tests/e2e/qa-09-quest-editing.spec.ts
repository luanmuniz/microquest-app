import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { editQuest } from '../helpers/ui';
import { createBaseQuest } from '../helpers/fixtures';

test('QA-09 Quest Editing', async ({ page }) => {
  const quest = createBaseQuest('q-edit-1', 'Original Quest Title', 'Original quest description');
  await seedState(page, {
    snapshot: createSnapshot([quest]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await editQuest(
    page,
    'Original Quest Title',
    'Updated Quest Title',
    'Updated quest description',
  );

  await expect(page.getByText('Updated Quest Title')).toBeVisible();
  await expect(page.getByText('Original Quest Title')).toHaveCount(0);
});
