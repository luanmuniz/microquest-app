import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, MessageSquare, Calendar } from 'lucide-react';
import type { QuestCompletion } from '@/hooks/useQuestStore';

interface HistoryEntryProps {
  completion: QuestCompletion;
  tutorialTarget?: boolean;
}

export function HistoryEntry({ completion, tutorialTarget = false }: HistoryEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = format(new Date(completion.completedAt), 'MMM d, yyyy');
  const formattedTime = format(new Date(completion.completedAt), 'h:mm a');

  return (
    <div 
      className="quest-card cursor-pointer animate-fade-in"
      onClick={() => setIsExpanded(!isExpanded)}
      data-tutorial-id={tutorialTarget ? 'history-entry' : undefined}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate">
            {completion.questTitle}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span>{formattedTime}</span>
          </div>
        </div>
        
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          {completion.reflection && (
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border animate-scale-in">
          <div className="text-sm">
            <span className="font-medium text-foreground">Reflection:</span>
            <p className="mt-1 text-muted-foreground">
              {completion.reflection || 'No reflection recorded.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
