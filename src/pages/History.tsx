import { useQuests } from '@/context';
import { HistoryEntry } from '@/components/HistoryEntry';
import { EmptyState } from '@/components/Quests/EmptyState';
import { History } from 'lucide-react';

export default function HistoryPage() {
  const { completions } = useQuests();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="page-header">Quest History</h1>
        <p className="text-muted-foreground mt-1">
          {completions.length} completed quest{completions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {completions.length === 0 ? (
        <EmptyState
          icon={<History className="h-8 w-8" />}
          title="No completed quests yet"
          description="Complete your first quest to see your journey here. Every step counts!"
          actionLabel="View Today's Quest"
          actionTo="/today"
        />
      ) : (
        <div className="space-y-3">
          {completions.map(completion => (
            <HistoryEntry key={completion.id} completion={completion} />
          ))}
        </div>
      )}
    </div>
  );
}
