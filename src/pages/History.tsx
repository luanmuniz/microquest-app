import { useState } from 'react';
import { useQuests } from '@/context';
import { HistoryEntry } from '@/components/HistoryEntry';
import { EmptyState } from '@/components/Quests/EmptyState';
import { History } from 'lucide-react';
import { useTutorial } from '@/tutorial/TutorialProvider';
import type { QuestCompletion } from '@/hooks/useQuestStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function HistoryPage() {
  const {
    completions,
    updateCompletionReflection,
    deleteCompletion,
  } = useQuests();
  const { tutorialCompletionId } = useTutorial();
  const [editingCompletion, setEditingCompletion] = useState<QuestCompletion | null>(null);
  const [editingReflection, setEditingReflection] = useState('');
  const [deletingCompletionId, setDeletingCompletionId] = useState<string | null>(null);
  const deletingCompletion = completions.find(
    (completion) => completion.id === deletingCompletionId,
  );

  const handleOpenEditDialog = (completion: QuestCompletion) => {
    setEditingCompletion(completion);
    setEditingReflection(completion.reflection);
  };

  const handleEditDialogChange = (open: boolean) => {
    if (open) return;
    setEditingCompletion(null);
    setEditingReflection('');
  };

  const handleSaveReflection = () => {
    if (!editingCompletion) return;

    const normalizedReflection =
      editingReflection.trim().length > 0 ? editingReflection : '';

    updateCompletionReflection(editingCompletion.id, normalizedReflection);
    setEditingCompletion(null);
    setEditingReflection('');

    toast.success('Reflection updated');
  };

  const handleDeleteCompletion = () => {
    if (!deletingCompletionId) return;

    const completionToDelete = completions.find(
      (completion) => completion.id === deletingCompletionId,
    );

    deleteCompletion(deletingCompletionId);
    setDeletingCompletionId(null);

    if (editingCompletion?.id === deletingCompletionId) {
      setEditingCompletion(null);
      setEditingReflection('');
    }

    toast.success('History entry deleted', {
      description: completionToDelete
        ? `"${completionToDelete.questTitle}" was removed from your history.`
        : undefined,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 lg:mb-8">
        <h1 className="page-header">Quest History</h1>
        <p className="text-muted-foreground mt-1">
          {completions.length} completed quest{completions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {completions.length === 0 ? (
        <EmptyState
          icon={<History className="h-8 w-8" />}
          title="No completed quests yet"
          description="Complete your first quest to see your journey here. Every step counts."
          actionLabel="View Today's Quest"
          actionTo="/today"
        />
      ) : (
        <div className="space-y-3">
          {completions.map(completion => (
            <HistoryEntry
              key={completion.id}
              completion={completion}
              tutorialTarget={completion.id === tutorialCompletionId}
              onEdit={() => handleOpenEditDialog(completion)}
              onDelete={() => setDeletingCompletionId(completion.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!editingCompletion} onOpenChange={handleEditDialogChange}>
        <DialogContent className="gap-5">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border/80 lg:hidden" />
          <DialogHeader className="pr-8">
            <DialogTitle>Edit reflection</DialogTitle>
            <DialogDescription>
              Update your notes for this completed quest.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="history-reflection" className="text-sm font-medium text-foreground">
              Reflection
            </label>
            <Textarea
              id="history-reflection"
              value={editingReflection}
              onChange={(event) => setEditingReflection(event.target.value)}
              rows={4}
              placeholder="How did it go? What did you learn or feel?"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleEditDialogChange(false)}>
              Cancel
            </Button>
            <Button className="btn-quest" onClick={handleSaveReflection}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingCompletionId}
        onOpenChange={(open) => {
          if (!open) setDeletingCompletionId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogClose aria-label="Close delete history entry dialog" />
          <AlertDialogHeader className="pr-8">
            <AlertDialogTitle>Delete this history entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
              {deletingCompletion
                ? ` "${deletingCompletion.questTitle}" will be permanently removed from your history.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompletion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
