import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, MessageSquare, Calendar } from 'lucide-react';

interface HistoryEntryProps {
  completion: any;
}

export function HistoryEntry({ completion }: HistoryEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = format(new Date(completion.completedAt), 'MMM d, yyyy');
  const formattedTime = format(new Date(completion.completedAt), 'h:mm a');

  return (
    <div 
      className="quest-card cursor-pointer animate-fade-in"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {completion.questTitle}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span>{formattedTime}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
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
