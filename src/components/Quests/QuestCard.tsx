import { Button } from '@/components/ui/button';
import { Sun, Pencil, Trash2, Check } from 'lucide-react';

interface QuestCardProps {
  quest: any;
  isToday?: boolean;
  onSetToday?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function QuestCard({ quest, isToday, onSetToday, onEdit, onDelete }: QuestCardProps) {
  return (
    <div 
      className={`quest-card animate-fade-in ${
        isToday ? 'ring-2 ring-primary/50 bg-today-highlight' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{quest.title}</h3>
            {isToday && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                <Check className="h-3 w-3" />
                Today
              </span>
            )}
          </div>
          {quest.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {quest.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isToday && onSetToday && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSetToday}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
              title="Set as Today's Quest"
            >
              <Sun className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Edit Quest"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              title="Delete Quest"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
