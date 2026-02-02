import { useState } from 'react';
import { useQuests } from '@/context';
import { QuestCard } from '@/components/Quests/QuestCard';
import { QuestForm } from '@/components/Quests/QuestForm';
import { EmptyState } from '@/components/Quests/EmptyState';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Scroll } from 'lucide-react';
import { toast } from 'sonner';

export default function QuestsPage() {
  const { quests, todayQuestId, addQuest, updateQuest, deleteQuest, setTodayQuest } = useQuests();
  const [showForm, setShowForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [deletingQuestId, setDeletingQuestId] = useState<string | null>(null);

  const handleCreate = (title: string, description: string) => {
    addQuest(title, description);
    setShowForm(false);
    toast.success('Quest created!', {
      description: `"${title}" has been added to your quest list.`
    });
  };

  const handleUpdate = (title: string, description: string) => {
    if (editingQuest) {
      updateQuest(editingQuest.id, title, description);
      setEditingQuest(null);
      toast.success('Quest updated!');
    }
  };

  const handleDelete = () => {
    if (deletingQuestId) {
      const quest = quests.find(q => q.id === deletingQuestId);
      deleteQuest(deletingQuestId);
      setDeletingQuestId(null);
      toast.success('Quest deleted', {
        description: quest ? `"${quest.title}" has been removed.` : undefined
      });
    }
  };

  const handleSetToday = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    setTodayQuest(questId);
    toast.success("Today's quest set!", {
      description: quest ? `"${quest.title}" is now your focus.` : undefined
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Your Quests</h1>
          <p className="text-muted-foreground mt-1">
            {quests.length} quest{quests.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>
        
        {quests.length > 0 && (
          <Button onClick={() => setShowForm(true)} className="btn-quest">
            <Plus className="mr-2 h-4 w-4" />
            New Quest
          </Button>
        )}
      </div>

      {/* Quest List or Empty State */}
      {quests.length === 0 ? (
        <EmptyState
          icon={<Scroll className="h-8 w-8" />}
          title="No quests yet"
          description="Create your first quest to start your journey. Small daily challenges lead to big changes!"
          actionLabel="Create Your First Quest"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {quests.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isToday={quest.id === todayQuestId}
              onSetToday={() => handleSetToday(quest.id)}
              onEdit={() => setEditingQuest(quest)}
              onDelete={() => setDeletingQuestId(quest.id)}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Quest</DialogTitle>
            <DialogDescription>
              Add a new challenge to your quest collection.
            </DialogDescription>
          </DialogHeader>
          <QuestForm 
            onSubmit={handleCreate} 
            onCancel={() => setShowForm(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingQuest} onOpenChange={() => setEditingQuest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quest</DialogTitle>
            <DialogDescription>
              Update your quest details.
            </DialogDescription>
          </DialogHeader>
          {editingQuest && (
            <QuestForm
              initialTitle={editingQuest.title}
              initialDescription={editingQuest.description}
              onSubmit={handleUpdate}
              onCancel={() => setEditingQuest(null)}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingQuestId} onOpenChange={() => setDeletingQuestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this quest?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The quest will be permanently removed from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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
