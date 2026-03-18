import { createContext, useContext, ReactNode } from 'react';
import { useQuestStore } from '@/hooks/useQuestStore';

type QuestContextValue = ReturnType<typeof useQuestStore>;

const QuestContext = createContext<QuestContextValue | null>(null);

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
