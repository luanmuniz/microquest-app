import { useState, useEffect, useCallback } from 'react';
import { createQuestDataSnapshot, type QuestDataSnapshot } from '@/lib/dataTransfer';

const STORAGE_KEY = 'microquest-data';

export interface Quest {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isSample?: boolean;
  isFavorite?: boolean;
}

export interface QuestCompletion {
  id: string;
  questId: string;
  questTitle: string;
  completedAt: string;
  reflection: string;
}

interface QuestState {
  quests: Quest[];
  todayQuestId: string | null;
  completions: QuestCompletion[];
}

interface CompleteTodayOptions {
  keepToday?: boolean;
}

const EMPTY_STATE: QuestState = {
  quests: [],
  todayQuestId: null,
  completions: [],
};

const STARTER_QUESTS = [
  {
    title: 'Take a 10-minute walk',
    description:
      'Step outside and enjoy some fresh air. Notice three things you see along the way.',
  },
  {
    title: 'Write in a journal',
    description:
      'Spend 5 minutes writing about your day or anything on your mind.',
  },
  {
    title: 'Drink a full glass of water',
    description: 'Hydration quest! Fill up a glass and drink it mindfully.',
  },
];

const createDefaultState = (): QuestState => {
  const createdAt = new Date().toISOString();

  return {
    quests: STARTER_QUESTS.map((quest) => ({
      id: crypto.randomUUID(),
      title: quest.title,
      description: quest.description,
      createdAt,
      isSample: true,
      isFavorite: false,
    })),
    todayQuestId: null,
    completions: [],
  };
};

const normalizeQuest = (value: unknown): Quest | null => {
  if (!value || typeof value !== 'object') return null;

  const quest = value as Partial<Record<string, unknown>>;
  const title = typeof quest.title === 'string' ? quest.title.trim() : '';
  if (!title) return null;

  return {
    id: typeof quest.id === 'string' && quest.id ? quest.id : crypto.randomUUID(),
    title,
    description: typeof quest.description === 'string' ? quest.description : '',
    createdAt:
      typeof quest.createdAt === 'string' && quest.createdAt
        ? quest.createdAt
        : new Date().toISOString(),
    isSample: Boolean(quest.isSample),
    isFavorite: quest.isFavorite === true,
  };
};

const normalizeCompletion = (value: unknown): QuestCompletion | null => {
  if (!value || typeof value !== 'object') return null;

  const completion = value as Partial<Record<string, unknown>>;

  return {
    id: typeof completion.id === 'string' && completion.id ? completion.id : crypto.randomUUID(),
    questId: typeof completion.questId === 'string' ? completion.questId : '',
    questTitle:
      typeof completion.questTitle === 'string' && completion.questTitle.trim()
        ? completion.questTitle.trim()
        : 'Completed quest',
    completedAt:
      typeof completion.completedAt === 'string' && completion.completedAt
        ? completion.completedAt
        : new Date().toISOString(),
    reflection: typeof completion.reflection === 'string' ? completion.reflection : '',
  };
};

const normalizeStoredState = (value: unknown): QuestState | null => {
  if (!value || typeof value !== 'object') return null;

  const stored = value as {
    quests?: unknown;
    completions?: unknown;
    todayQuestId?: unknown;
  };

  const quests = Array.isArray(stored.quests)
    ? stored.quests
        .map(normalizeQuest)
        .filter((quest): quest is Quest => quest !== null)
    : [];

  const completions = Array.isArray(stored.completions)
    ? stored.completions
        .map(normalizeCompletion)
        .filter((completion): completion is QuestCompletion => completion !== null)
    : [];

  const todayQuestId =
    typeof stored.todayQuestId === 'string' &&
    quests.some((quest) => quest.id === stored.todayQuestId)
      ? stored.todayQuestId
      : null;

  return {
    quests,
    todayQuestId,
    completions,
  };
};

const getInitialState = (): QuestState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultState();

    const parsed = JSON.parse(stored);
    const normalized = normalizeStoredState(parsed);

    return normalized ?? createDefaultState();
  } catch {
    // Invalid JSON or restricted storage environment.
    return createDefaultState();
  }
};

export function useQuestStore() {
  const [state, setState] = useState(getInitialState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors (private mode, restricted environments, etc.)
    }
  }, [state]);

  // Quest operations
  const addQuest = useCallback((title: string, description: string) => {
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date().toISOString(),
      isSample: false,
      isFavorite: false,
    };
    setState((prev) => ({
      ...prev,
      quests: [...prev.quests, newQuest],
    }));
    return newQuest;
  }, []);

  const updateQuest = useCallback((id: string, title: string, description: string) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.map((q) =>
        q.id === id ? { ...q, title, description, isSample: false } : q
      ),
    }));
  }, []);

  const toggleFavoriteQuest = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.map((q) =>
        q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
      ),
    }));
  }, []);

  const deleteQuest = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.filter((q) => q.id !== id),
      // Clear today if this quest was selected
      todayQuestId: prev.todayQuestId === id ? null : prev.todayQuestId,
    }));
  }, []);

  // Today operations
  const setTodayQuest = useCallback((questId: string | null) => {
    setState((prev) => ({
      ...prev,
      todayQuestId: questId,
    }));
  }, []);

  const getTodayQuest = useCallback((): Quest | null => {
    if (!state.todayQuestId) return null;
    return state.quests.find((q) => q.id === state.todayQuestId) || null;
  }, [state.quests, state.todayQuestId]);

  // Completion operations
  const completeToday = useCallback((reflection: string, options: CompleteTodayOptions = {}) => {
    const todayQuest = getTodayQuest();
    if (!todayQuest) return;
    const { keepToday = false } = options;

    const completion: QuestCompletion = {
      id: crypto.randomUUID(),
      questId: todayQuest.id,
      questTitle: todayQuest.title,
      completedAt: new Date().toISOString(),
      reflection,
    };

    setState((prev) => ({
      ...prev,
      completions: [completion, ...prev.completions],
      todayQuestId: keepToday ? todayQuest.id : null,
    }));
  }, [getTodayQuest]);

  const updateCompletionReflection = useCallback(
    (completionId: string, reflection: string) => {
      setState((prev) => ({
        ...prev,
        completions: prev.completions.map((completion) =>
          completion.id === completionId
            ? { ...completion, reflection }
            : completion,
        ),
      }));
    },
    [],
  );

  const deleteCompletion = useCallback((completionId: string) => {
    setState((prev) => ({
      ...prev,
      completions: prev.completions.filter(
        (completion) => completion.id !== completionId,
      ),
    }));
  }, []);

  const startFresh = useCallback(() => {
    setState(EMPTY_STATE);
  }, []);

  const replaceAllData = useCallback((snapshot: QuestDataSnapshot) => {
    setState(createQuestDataSnapshot(snapshot));
  }, []);

  return {
    quests: state.quests,
    todayQuestId: state.todayQuestId,
    completions: state.completions,
    todayQuest: getTodayQuest(),
    addQuest,
    updateQuest,
    toggleFavoriteQuest,
    deleteQuest,
    setTodayQuest,
    completeToday,
    updateCompletionReflection,
    deleteCompletion,
    startFresh,
    replaceAllData,
  };
}
