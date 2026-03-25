import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { questCard, setTodayForQuest } from '../helpers/ui';
import { createBaseQuest } from '../helpers/fixtures';

test('QA-11 Set Today Quest And Replace The Selection', async ({ page }) => {
  const firstQuest = createBaseQuest('q-today-1', 'Stretch for 5 minutes', 'First focus');
  const secondQuest = createBaseQuest('q-today-2', 'Read 10 pages', 'Second focus');
  await seedState(page, {
    snapshot: createSnapshot([firstQuest, secondQuest]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');
  await setTodayForQuest(page, 'Stretch for 5 minutes');
  await expect(
    questCard(page, 'Stretch for 5 minutes').locator('span').filter({ hasText: /^Today$/ }),
  ).toBeVisible();

  await setTodayForQuest(page, 'Read 10 pages');
  await expect(
    questCard(page, 'Read 10 pages').locator('span').filter({ hasText: /^Today$/ }),
  ).toBeVisible();
  await expect(
    questCard(page, 'Stretch for 5 minutes').locator('span').filter({ hasText: /^Today$/ }),
  ).toHaveCount(0);

  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: 'Read 10 pages' })).toBeVisible();
});
