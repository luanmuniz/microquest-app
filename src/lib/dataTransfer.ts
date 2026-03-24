import type { Quest, QuestCompletion } from '@/hooks/useQuestStore';

export interface QuestDataSnapshot {
  quests: Quest[];
  todayQuestId: string | null;
  completions: QuestCompletion[];
}

const INVALID_EXPORT_MESSAGE = 'This file is not a valid Microquest backup.';
const INVALID_JSON_MESSAGE = 'This file is not valid JSON.';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const hasString = (value: unknown): value is string => typeof value === 'string';

export function createQuestDataSnapshot(snapshot: QuestDataSnapshot): QuestDataSnapshot {
  return {
    quests: snapshot.quests.map((quest) => ({ ...quest })),
    todayQuestId: snapshot.todayQuestId,
    completions: snapshot.completions.map((completion) => ({ ...completion })),
  };
}

export function stringifyQuestDataExport(snapshot: QuestDataSnapshot): string {
  return JSON.stringify(createQuestDataSnapshot(snapshot), null, 2);
}

const parseQuest = (value: unknown): Quest => {
  if (!isRecord(value)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  if (
    !hasText(value.id) ||
    !hasText(value.title) ||
    !hasString(value.description) ||
    !hasText(value.createdAt)
  ) {
    throw new Error('This backup contains an invalid quest entry.');
  }

  if (typeof value.isSample !== 'undefined' && typeof value.isSample !== 'boolean') {
    throw new Error('This backup contains an invalid quest entry.');
  }

  return {
    id: value.id,
    title: value.title,
    description: value.description,
    createdAt: value.createdAt,
    ...(typeof value.isSample === 'boolean' ? { isSample: value.isSample } : {}),
  };
};

const parseCompletion = (value: unknown): QuestCompletion => {
  if (!isRecord(value)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  if (
    !hasText(value.id) ||
    !hasText(value.questId) ||
    !hasText(value.questTitle) ||
    !hasText(value.completedAt) ||
    !hasString(value.reflection)
  ) {
    throw new Error('This backup contains an invalid completion entry.');
  }

  return {
    id: value.id,
    questId: value.questId,
    questTitle: value.questTitle,
    completedAt: value.completedAt,
    reflection: value.reflection,
  };
};

export function parseQuestDataImport(jsonText: string): QuestDataSnapshot {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(INVALID_JSON_MESSAGE);
  }

  if (!isRecord(parsed)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  if (!Array.isArray(parsed.quests) || !Array.isArray(parsed.completions)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  if (parsed.todayQuestId !== null && !hasText(parsed.todayQuestId)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  const quests = parsed.quests.map(parseQuest);
  const completions = parsed.completions.map(parseCompletion);
  const todayQuestId = typeof parsed.todayQuestId === 'string' ? parsed.todayQuestId : null;

  if (todayQuestId && !quests.some((quest) => quest.id === todayQuestId)) {
    throw new Error('This backup references a today quest that does not exist.');
  }

  return createQuestDataSnapshot({
    quests,
    todayQuestId,
    completions,
  });
}
