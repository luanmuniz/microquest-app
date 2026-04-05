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
  secondaryActionLabel?: string;
  secondaryActionTo?: string;
  onSecondaryAction?: () => void;
  secondaryActionDataTutorialId?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionTo, 
  onAction,
  actionDataTutorialId,
  secondaryActionLabel,
  secondaryActionTo,
  onSecondaryAction,
  secondaryActionDataTutorialId,
}: EmptyStateProps) {
  const hasPrimaryAction = Boolean(actionLabel && (actionTo || onAction));
  const hasSecondaryAction = Boolean(
    secondaryActionLabel && (secondaryActionTo || onSecondaryAction),
  );

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      
      {(hasPrimaryAction || hasSecondaryAction) && (
        <div className="mt-6 flex w-full max-w-sm flex-col gap-2 lg:w-auto lg:max-w-none lg:flex-row">
          {hasPrimaryAction &&
            (actionTo ? (
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
            ))}

          {hasSecondaryAction &&
            (secondaryActionTo ? (
              <Button asChild variant="outline" className="w-full lg:w-auto">
                <Link to={secondaryActionTo} data-tutorial-id={secondaryActionDataTutorialId}>
                  {secondaryActionLabel}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={onSecondaryAction}
                variant="outline"
                className="w-full lg:w-auto"
                data-tutorial-id={secondaryActionDataTutorialId}
              >
                {secondaryActionLabel}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
