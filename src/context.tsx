import React, { createContext, useContext, ReactNode } from 'react';
import { useQuestStore } from '@/hooks/useQuestStore';

const QuestContext = createContext(null);

export function QuestProvider({ children }: { children: ReactNode }) {
  const store = useQuestStore();

  return (
    <QuestContext.Provider value={store}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuests() {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
}
