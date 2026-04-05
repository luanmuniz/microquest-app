import { expect, type Page } from '@playwright/test';

export const APP_BASE_PATH = '/microquest-app/';
export const DATA_STORAGE_KEY = 'microquest-data';
export const WELCOME_STORAGE_KEY = 'microquest-welcome-seen';
export const TUTORIAL_STORAGE_KEY = 'microquest-tutorial-seen';

export interface QuestSnapshotQuest {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isSample?: boolean;
  isFavorite?: boolean;
}

export interface QuestSnapshotCompletion {
  id: string;
  questId: string;
  questTitle: string;
  completedAt: string;
  reflection: string;
}

export interface QuestDataSnapshot {
  quests: QuestSnapshotQuest[];
  todayQuestId: string | null;
  completions: QuestSnapshotCompletion[];
}

export interface SeedStateOptions {
  snapshot?: QuestDataSnapshot;
  welcomeSeen?: boolean;
  tutorialSeen?: boolean;
  reload?: boolean;
}

const DEFAULT_TIMESTAMP = '2026-03-24T10:00:00.000Z';

export function createQuest(
  id: string,
  title: string,
  description = '',
  overrides?: Partial<QuestSnapshotQuest>,
): QuestSnapshotQuest {
  return {
    id,
    title,
    description,
    createdAt: overrides?.createdAt ?? DEFAULT_TIMESTAMP,
    isSample: overrides?.isSample,
    isFavorite: overrides?.isFavorite,
  };
}

export function createCompletion(
  id: string,
  questId: string,
  questTitle: string,
  reflection = '',
  completedAt = DEFAULT_TIMESTAMP,
): QuestSnapshotCompletion {
  return {
    id,
    questId,
    questTitle,
    completedAt,
    reflection,
  };
}

export function createSnapshot(
  quests: QuestSnapshotQuest[],
  todayQuestId: string | null = null,
  completions: QuestSnapshotCompletion[] = [],
): QuestDataSnapshot {
  return {
    quests,
    todayQuestId,
    completions,
  };
}

export function isMobileProject(projectName: string): boolean {
  return projectName.includes('mobile');
}

export function isDesktopProject(projectName: string): boolean {
  return !isMobileProject(projectName);
}

export async function gotoHash(page: Page, hashPath: `/${string}` | '/' = '/'): Promise<void> {
  if (hashPath === '/') {
    await page.goto(APP_BASE_PATH, { waitUntil: 'domcontentloaded' });
    return;
  }

  await page.goto(`${APP_BASE_PATH}#${hashPath}`, { waitUntil: 'domcontentloaded' });
}

export async function seedState(page: Page, options: SeedStateOptions = {}): Promise<void> {
  const {
    snapshot,
    welcomeSeen = false,
    tutorialSeen = false,
    reload = true,
  } = options;

  await page.goto(APP_BASE_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate(
    ({
      snapshotToWrite,
      seenWelcome,
      seenTutorial,
      dataKey,
      welcomeKey,
      tutorialKey,
    }) => {
      if (typeof snapshotToWrite === 'undefined') {
        localStorage.removeItem(dataKey);
      } else {
        localStorage.setItem(dataKey, JSON.stringify(snapshotToWrite));
      }

      if (seenWelcome) {
        localStorage.setItem(welcomeKey, 'true');
      } else {
        localStorage.removeItem(welcomeKey);
      }

      if (seenTutorial) {
        localStorage.setItem(tutorialKey, 'true');
      } else {
        localStorage.removeItem(tutorialKey);
      }
    },
    {
      snapshotToWrite: snapshot,
      seenWelcome: welcomeSeen,
      seenTutorial: tutorialSeen,
      dataKey: DATA_STORAGE_KEY,
      welcomeKey: WELCOME_STORAGE_KEY,
      tutorialKey: TUTORIAL_STORAGE_KEY,
    },
  );

  if (reload) {
    await page.reload({ waitUntil: 'domcontentloaded' });
  }
}

export async function clearAllState(page: Page): Promise<void> {
  await seedState(page);
}

export async function expectPath(page: Page, expectedPath: `/${string}`): Promise<void> {
  await expect(page).toHaveURL(new RegExp(`#${expectedPath}$`));
}

export async function readStoredSnapshot(page: Page): Promise<QuestDataSnapshot | null> {
  const raw = await page.evaluate((dataKey) => localStorage.getItem(dataKey), DATA_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as QuestDataSnapshot;
}
