import { expect, test } from '@playwright/test';
import { createSnapshot, gotoHash, seedState } from '../helpers/state';
import { createBaseQuest } from '../helpers/fixtures';
import { questCard, setTodayForQuest } from '../helpers/ui';

test('QA-26 Quest List Live Fuzzy Search', async ({ page }) => {
  const firstQuest = createBaseQuest(
    'q-search-1',
    'Read 10 pages',
    'Read before bed without distractions.',
  );
  const secondQuest = createBaseQuest(
    'q-search-2',
    'Morning stretch',
    'Do a short full-body stretch after work.',
  );
  const thirdQuest = createBaseQuest(
    'q-search-3',
    'Drink water',
    'Hydration quest and mindful pause.',
  );

  await seedState(page, {
    snapshot: createSnapshot([firstQuest, secondQuest, thirdQuest]),
    welcomeSeen: true,
    tutorialSeen: true,
  });

  await gotoHash(page, '/quests');

  const searchInput = page.getByRole('textbox', { name: 'Search quests' });
  await expect(searchInput).toBeVisible();
  await expect(page.getByText('3 quests in your collection')).toBeVisible();

  await searchInput.fill('read');
  await expect(questCard(page, 'Read 10 pages')).toBeVisible();
  await expect(questCard(page, 'Morning stretch')).toHaveCount(0);
  await expect(questCard(page, 'Drink water')).toHaveCount(0);
  await expect(page.getByText('1 of 3 quests in your collection')).toBeVisible();

  await searchInput.fill('full-body');
  await expect(questCard(page, 'Morning stretch')).toBeVisible();
  await expect(questCard(page, 'Read 10 pages')).toHaveCount(0);
  await expect(questCard(page, 'Drink water')).toHaveCount(0);

  await searchInput.fill('drkwtr');
  await expect(questCard(page, 'Drink water')).toBeVisible();
  await expect(questCard(page, 'Read 10 pages')).toHaveCount(0);
  await expect(questCard(page, 'Morning stretch')).toHaveCount(0);

  await searchInput.fill('quest-zzz-no-match');
  await expect(page.getByText('No quests match "quest-zzz-no-match". Try a different keyword.')).toBeVisible();
  await expect(page.locator('.quest-card')).toHaveCount(0);
  await expect(page.getByText('0 of 3 quests in your collection')).toBeVisible();

  await searchInput.fill('');
  await expect(page.getByText('3 quests in your collection')).toBeVisible();
  await expect(questCard(page, 'Read 10 pages')).toBeVisible();
  await expect(questCard(page, 'Morning stretch')).toBeVisible();
  await expect(questCard(page, 'Drink water')).toBeVisible();

  await searchInput.fill('morning');
  await setTodayForQuest(page, 'Morning stretch');
  await expect(
    questCard(page, 'Morning stretch').locator('span').filter({ hasText: /^Today$/ }),
  ).toBeVisible();

  await gotoHash(page, '/today');
  await expect(page.getByRole('heading', { name: 'Morning stretch' })).toBeVisible();
});
