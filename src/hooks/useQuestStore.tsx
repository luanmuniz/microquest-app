import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'microquest-data';

const getInitialState = (): any => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid JSON, return default
    }
  }
  
  // Return empty state with sample quests for first-time users
  return {
    quests: [
      {
        id: crypto.randomUUID(),
        title: 'Take a 10-minute walk',
        description: 'Step outside and enjoy some fresh air. Notice three things you see along the way.',
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Write in a journal',
        description: 'Spend 5 minutes writing about your day or anything on your mind.',
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Drink a full glass of water',
        description: 'Hydration quest! Fill up a glass and drink it mindfully.',
        createdAt: new Date().toISOString(),
      },
    ],
    todayQuestId: null,
    completions: [],
  };
};

export function useQuestStore() {
  const [state, setState] = useState(getInitialState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Quest operations
  const addQuest = useCallback((title: string, description: string) => {
    const newQuest: any = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      quests: [...prev.quests, newQuest],
    }));
    return newQuest;
  }, []);

  const updateQuest = useCallback((id: string, title: string, description: string) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q => 
        q.id === id ? { ...q, title, description } : q
      ),
    }));
  }, []);

  const deleteQuest = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.filter(q => q.id !== id),
      // Clear today if this quest was selected
      todayQuestId: prev.todayQuestId === id ? null : prev.todayQuestId,
    }));
  }, []);

  // Today operations
  const setTodayQuest = useCallback((questId: string | null) => {
    setState(prev => ({
      ...prev,
      todayQuestId: questId,
    }));
  }, []);

  const getTodayQuest = useCallback((): any | null => {
    if (!state.todayQuestId) return null;
    return state.quests.find(q => q.id === state.todayQuestId) || null;
  }, [state.quests, state.todayQuestId]);

  // Completion operations
  const completeToday = useCallback((reflection: string) => {
    const todayQuest = getTodayQuest();
    if (!todayQuest) return;

    const completion: any = {
      id: crypto.randomUUID(),
      questId: todayQuest.id,
      questTitle: todayQuest.title,
      completedAt: new Date().toISOString(),
      reflection,
    };

    setState(prev => ({
      ...prev,
      completions: [completion, ...prev.completions],
      todayQuestId: null, // Reset today after completion
    }));
  }, [getTodayQuest]);

  return {
    quests: state.quests,
    todayQuestId: state.todayQuestId,
    completions: state.completions,
    todayQuest: getTodayQuest(),
    addQuest,
    updateQuest,
    deleteQuest,
    setTodayQuest,
    completeToday,
  };
}
