import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  actionDataTutorialId?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionTo, 
  onAction,
  actionDataTutorialId,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      
      {actionLabel && (actionTo || onAction) && (
        <div className="mt-6">
          {actionTo ? (
            <Button asChild className="btn-quest w-full lg:w-auto">
              <Link to={actionTo} data-tutorial-id={actionDataTutorialId}>
                {actionLabel}
              </Link>
            </Button>
          ) : (
            <Button
              onClick={onAction}
              className="btn-quest w-full lg:w-auto"
              data-tutorial-id={actionDataTutorialId}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
