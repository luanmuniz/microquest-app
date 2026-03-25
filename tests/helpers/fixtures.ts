import { createCompletion, createQuest } from './state';

const BASE_QUEST_DATE = '2026-03-24T10:00:00.000Z';
const BASE_COMPLETION_DATE = '2026-03-24T12:00:00.000Z';

export function createBaseQuest(id: string, title: string, description = '') {
  return createQuest(id, title, description, { createdAt: BASE_QUEST_DATE });
}

export function createBaseCompletion(
  id: string,
  questId: string,
  questTitle: string,
  reflection = '',
) {
  return createCompletion(id, questId, questTitle, reflection, BASE_COMPLETION_DATE);
}
