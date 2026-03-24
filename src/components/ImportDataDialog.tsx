import {
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from 'react';
import { FileJson, TriangleAlert, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQuests } from '@/context';
import { parseQuestDataImport, type QuestDataSnapshot } from '@/lib/dataTransfer';
import { cn } from '@/utils';
import { toast } from 'sonner';

interface ImportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDataDialog({ open, onOpenChange }: ImportDataDialogProps) {
  const { replaceAllData } = useQuests();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const validationRequestRef = useRef(0);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [pendingSnapshot, setPendingSnapshot] = useState<QuestDataSnapshot | null>(null);
  const [importError, setImportError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const resetState = () => {
    validationRequestRef.current += 1;
    setSelectedFileName('');
    setPendingSnapshot(null);
    setImportError('');
    setIsDragging(false);
    setIsValidating(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      resetState();
    }
  };

  const validateFile = async (file: File) => {
    const requestId = validationRequestRef.current + 1;
    validationRequestRef.current = requestId;

    setSelectedFileName(file.name);
    setPendingSnapshot(null);
    setImportError('');
    setIsValidating(true);

    try {
      const jsonText = await file.text();
      const snapshot = parseQuestDataImport(jsonText);

      if (validationRequestRef.current !== requestId) {
        return;
      }

      setPendingSnapshot(snapshot);
    } catch (error) {
      if (validationRequestRef.current !== requestId) {
        return;
      }

      const message =
        error instanceof Error ? error.message : 'We could not validate that backup file.';

      setImportError(message);
      toast.error('Import file rejected', {
        description: message,
      });
    } finally {
      if (validationRequestRef.current === requestId) {
        setIsValidating(false);
      }
    }
  };

  const handleFileSelection = (file: File | null) => {
    if (!file) {
      return;
    }

    void validateFile(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';
    handleFileSelection(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelection(event.dataTransfer.files?.[0] ?? null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    fileInputRef.current?.click();
  };

  const handleImport = () => {
    if (!pendingSnapshot) {
      return;
    }

    replaceAllData(pendingSnapshot);
    handleOpenChange(false);
    toast.success('Data imported', {
      description: `Restored ${pendingSnapshot.quests.length} quests and ${pendingSnapshot.completions.length} history entries.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl gap-5">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border/80 lg:hidden" />
        <DialogHeader className="pr-8">
          <DialogTitle>Import Microquest data</DialogTitle>
          <DialogDescription>
            Upload a JSON backup exported from this app. Importing replaces your current
            quests, today&apos;s quest, and completion history on this device.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept=".json,application/json"
          className="sr-only"
          onChange={handleInputChange}
        />

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>This import replaces your current local data. Export first if you want a backup.</p>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
              return;
            }
            setIsDragging(false);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDrop={handleDrop}
          className={cn(
            'group rounded-2xl border border-dashed p-6 text-center shadow-soft transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            isDragging
              ? 'border-primary bg-primary/10 shadow-glow'
              : 'border-border/80 bg-card hover:border-primary/40 hover:bg-primary/5',
          )}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Upload className="h-6 w-6" />
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-base font-semibold text-foreground">Drop your JSON file here</p>
            <p className="text-sm text-muted-foreground">
              Click to browse, or drag and drop a backup exported by Microquest.
            </p>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            .json files only
          </p>
        </div>

        {isValidating && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            Validating your backup file...
          </div>
        )}

        {selectedFileName && (
          <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-soft">
                <FileJson className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{selectedFileName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pendingSnapshot
                    ? `${pendingSnapshot.quests.length} quests, ${pendingSnapshot.completions.length} history entries`
                    : isValidating
                      ? 'Validating backup...'
                      : importError
                        ? 'Validation failed'
                        : 'Ready for validation'}
                </p>
                {pendingSnapshot && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pendingSnapshot.todayQuestId
                      ? 'Includes a selected today quest.'
                      : 'Does not include a selected today quest.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {importError && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {importError}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="btn-quest"
            onClick={handleImport}
            disabled={!pendingSnapshot || isValidating}
          >
            Import data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
