import { useState, type MouseEvent } from 'react';
import { format } from 'date-fns';
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Calendar,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { QuestCompletion } from '@/hooks/useQuestStore';
import { Button } from '@/components/ui/button';

interface HistoryEntryProps {
  completion: QuestCompletion;
  tutorialTarget?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function HistoryEntry({
  completion,
  tutorialTarget = false,
  onEdit,
  onDelete,
}: HistoryEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasReflection = completion.reflection.trim().length > 0;
  const formattedDate = format(new Date(completion.completedAt), 'MMM d, yyyy');
  const formattedTime = format(new Date(completion.completedAt), 'h:mm a');
  const handleActionClick = (
    event: MouseEvent<HTMLButtonElement>,
    callback?: () => void,
  ) => {
    event.stopPropagation();
    callback?.();
  };

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
        
        <div className="flex shrink-0 items-center gap-1 self-end sm:self-center">
          {hasReflection && (
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => handleActionClick(event, onEdit)}
              className="h-8 w-8 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              title="Edit reflection"
              aria-label="Edit reflection"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => handleActionClick(event, onDelete)}
              className="h-8 w-8 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
              title="Delete entry"
              aria-label="Delete entry"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
              {hasReflection ? completion.reflection : 'No reflection recorded.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
