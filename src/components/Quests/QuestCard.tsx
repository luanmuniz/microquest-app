import { Button } from '@/components/ui/button';
import type { Quest } from '@/hooks/useQuestStore';
import { Sun, Pencil, Trash2, Check } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  isToday?: boolean;
  onSetToday?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  setTodayTutorialTarget?: boolean;
}

export function QuestCard({
  quest,
  isToday,
  onSetToday,
  onEdit,
  onDelete,
  setTodayTutorialTarget,
}: QuestCardProps) {
  return (
    <div 
      className={`quest-card animate-fade-in ${
        isToday ? 'ring-2 ring-primary/50 bg-today-highlight' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 pr-1">
            <h3 className="break-words font-semibold text-foreground">{quest.title}</h3>
            {isToday && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                <Check className="h-3 w-3" />
                Today
              </span>
            )}
            {quest.isSample && (
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                Starter
              </span>
            )}
          </div>
          {quest.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {quest.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-muted/70 p-1 lg:rounded-none lg:bg-transparent lg:p-0">
          {!isToday && onSetToday && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSetToday}
              className="h-9 w-9 text-muted-foreground hover:bg-primary/10 hover:text-primary lg:h-8 lg:w-auto lg:px-2.5"
              title="Set as Today's Quest"
              data-tutorial-id={setTodayTutorialTarget ? 'set-today-quest' : undefined}
            >
              <Sun className="h-4 w-4" />
              <span className="hidden lg:inline">Set today</span>
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground lg:h-8 lg:w-auto lg:px-2.5"
              title="Edit Quest"
            >
              <Pencil className="h-4 w-4" />
              <span className="hidden lg:inline">Edit</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-9 w-9 text-muted-foreground hover:bg-destructive/15 hover:text-destructive lg:h-8 lg:w-auto lg:px-2.5"
              title="Delete Quest"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden lg:inline">Delete</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
