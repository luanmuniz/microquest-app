import { useMemo, useState } from 'react';
import { useQuests } from '@/context';
import { QuestCard } from '@/components/Quests/QuestCard';
import { QuestForm } from '@/components/Quests/QuestForm';
import { EmptyState } from '@/components/Quests/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Quest } from '@/hooks/useQuestStore';
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
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Info, Plus, Scroll, Search } from 'lucide-react';
import { useTutorial } from '@/tutorial/TutorialProvider';
import { toast } from 'sonner';

const normalizeSearchValue = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, ' ');

const isOrderedSubsequence = (needle: string, haystack: string) => {
  if (!needle) return true;

  let needleIndex = 0;
  for (const char of haystack) {
    if (char === needle[needleIndex]) {
      needleIndex += 1;
      if (needleIndex === needle.length) {
        return true;
      }
    }
  }

  return false;
};

const getQuestSearchCandidates = (quest: Quest) => {
  const normalizedTitle = normalizeSearchValue(quest.title);
  const normalizedDescription = normalizeSearchValue(quest.description);
  const titleWords = normalizedTitle.split(' ').filter(Boolean);
  const descriptionWords = normalizedDescription.split(' ').filter(Boolean);
  const collapsedTitle = normalizedTitle.replace(/\s+/g, '');
  const collapsedDescription = normalizedDescription.replace(/\s+/g, '');

  const candidates = [
    normalizeSearchValue(`${quest.title} ${quest.description}`),
    ...titleWords,
    ...descriptionWords,
  ];

  if (collapsedTitle) {
    candidates.push(collapsedTitle);
  }

  if (collapsedDescription) {
    candidates.push(collapsedDescription);
  }

  return candidates;
};

const matchesQueryToken = (token: string, searchCandidates: string[]) => {
  if (!token) return true;
  if (searchCandidates.some((candidate) => candidate.includes(token))) return true;
  if (token.length < 3) return false;

  return searchCandidates.some(
    (candidate) =>
      candidate.startsWith(token[0]) && isOrderedSubsequence(token, candidate),
  );
};

const matchesQuestQuery = (quest: Quest, normalizedQuery: string) => {
  if (!normalizedQuery) return true;

  const searchCandidates = getQuestSearchCandidates(quest);
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  return queryTokens.every((token) => matchesQueryToken(token, searchCandidates));
};

export default function QuestsPage() {
  const {
    quests,
    todayQuestId,
    addQuest,
    updateQuest,
    toggleFavoriteQuest,
    deleteQuest,
    setTodayQuest,
  } = useQuests();
  const { currentStepId, tutorialQuestId } = useTutorial();
  const [showForm, setShowForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [deletingQuestId, setDeletingQuestId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const hasSampleQuests = quests.some((quest) => quest.isSample);
  const normalizedSearchQuery = useMemo(
    () => normalizeSearchValue(searchQuery),
    [searchQuery],
  );
  const filteredQuests = useMemo(
    () => quests.filter((quest) => matchesQuestQuery(quest, normalizedSearchQuery)),
    [quests, normalizedSearchQuery],
  );
  const favoriteFirstQuests = useMemo(() => {
    const favoriteQuests: Quest[] = [];
    const regularQuests: Quest[] = [];

    filteredQuests.forEach((quest) => {
      if (quest.isFavorite) {
        favoriteQuests.push(quest);
        return;
      }

      regularQuests.push(quest);
    });

    return [...favoriteQuests, ...regularQuests];
  }, [filteredQuests]);
  const isFiltering = normalizedSearchQuery.length > 0;
  const headerQuestCount = isFiltering
    ? `${filteredQuests.length} of ${quests.length} quest${quests.length !== 1 ? 's' : ''}`
    : `${quests.length} quest${quests.length !== 1 ? 's' : ''}`;

  const handleCreate = (title: string, description: string) => {
    addQuest(title, description);
    setShowForm(false);
    toast.success('Quest created', {
      description: `"${title}" has been added to your quest list.`
    });
  };

  const handleUpdate = (title: string, description: string) => {
    if (editingQuest) {
      updateQuest(editingQuest.id, title, description);
      setEditingQuest(null);
      toast.success('Quest updated');
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
    toast.success("Today's quest set", {
      description: quest ? `"${quest.title}" is now your focus.` : undefined
    });
  };

  const handleToggleFavorite = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    toggleFavoriteQuest(questId);

    if (!quest) return;

    if (quest.isFavorite) {
      toast.success('Removed from favorites', {
        description: `"${quest.title}" was removed from your favorites.`,
      });
      return;
    }

    toast.success('Added to favorites', {
      description: `"${quest.title}" was moved to the top of your list.`,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="page-header">Your Quests</h1>
          <p className="text-muted-foreground mt-1">
            {headerQuestCount} in your collection
          </p>
        </div>
        
        {quests.length > 0 && (
          <Button
            onClick={() => setShowForm(true)}
            className="btn-quest w-full lg:w-auto"
            data-tutorial-id={currentStepId === 'create-quest' ? 'create-quest-button' : undefined}
          >
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
          description="Create your first quest to start your journey. Small daily challenges lead to big changes."
          actionLabel="Create Your First Quest"
          onAction={() => setShowForm(true)}
          actionDataTutorialId={currentStepId === 'create-quest' ? 'create-quest-button' : undefined}
        />
      ) : (
        <>
          {hasSampleQuests && (
            <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  Starter suggestions are included to help you begin. You can edit
                  or delete any of them and add your own quests anytime.
                </p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="quest-search" className="sr-only">
              Search quests
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="quest-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search quests..."
                aria-label="Search quests"
                className="h-9 pl-9"
              />
            </div>
          </div>

          {favoriteFirstQuests.length > 0 ? (
            <div className="space-y-3">
              {favoriteFirstQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isToday={quest.id === todayQuestId}
                  onToggleFavorite={() => handleToggleFavorite(quest.id)}
                  onSetToday={() => handleSetToday(quest.id)}
                  onEdit={() => setEditingQuest(quest)}
                  onDelete={() => setDeletingQuestId(quest.id)}
                  setTodayTutorialTarget={
                    currentStepId === 'set-today' && tutorialQuestId === quest.id
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              No quests match "{searchQuery.trim()}". Try a different keyword.
            </div>
          )}
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="gap-5"
          data-tutorial-id={
            currentStepId === 'create-quest-modal' ? 'create-quest-modal' : undefined
          }
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border/80 lg:hidden" />
          <DialogHeader className="pr-8">
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
        <DialogContent className="gap-5">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border/80 lg:hidden" />
          <DialogHeader className="pr-8">
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
          <AlertDialogClose aria-label="Close delete quest dialog" />
          <AlertDialogHeader className="pr-8">
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
