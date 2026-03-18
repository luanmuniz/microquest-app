import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  CircleHelp,
  Database,
  Download,
  History,
  Scroll,
  Sparkles,
  Sun,
  Trash2,
} from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { useQuests } from '@/context';
import { clearOnboardingState } from '@/lib/onboarding';
import { toast } from 'sonner';

const navItems = [
  { to: '/quests', label: 'Quests', icon: Scroll },
  { to: '/today', label: 'Today', icon: Sun },
  { to: '/history', label: 'History', icon: History },
];

export function Navbar() {
  const { startFresh, quests, todayQuestId, completions } = useQuests();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCleanDataDialogOpen, setIsCleanDataDialogOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleExportData = () => {
    try {
      const appState = {
        quests,
        todayQuestId,
        completions,
      };
      const json = JSON.stringify(appState, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];

      link.href = url;
      link.download = `microquest-data-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setIsUserMenuOpen(false);

      toast.success('Data exported', {
        description: 'Your MicroQuest data was downloaded as a JSON file.',
      });
    } catch {
      toast.error('Export failed', {
        description: 'We could not generate your export file. Please try again.',
      });
    }
  };

  const handleStartFresh = () => {
    startFresh();
    clearOnboardingState();
    toast.success('Data cleaned', {
      description: 'All app state was reset. You will see onboarding again.',
    });
    setIsCleanDataDialogOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-soft">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">MicroQuest</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              data-tutorial-id={
                to === '/today'
                  ? 'nav-today'
                  : to === '/history'
                    ? 'nav-history'
                    : undefined
              }
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-soft'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/welcome"
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
          >
            <CircleHelp className="h-4 w-4" />
            <span className="hidden md:inline">How it works</span>
          </NavLink>

          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-1 px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Data</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>

            {isUserMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 rounded-xl border border-border/70 bg-card p-1 shadow-medium animate-scale-in"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleExportData}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                  Export data
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsCleanDataDialogOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Clean data
                </button>
              </div>
            )}
          </div>

          <AlertDialog
            open={isCleanDataDialogOpen}
            onOpenChange={setIsCleanDataDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clean all app data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove your quests, today's selection,
                  completion history, and onboarding progress from this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleStartFresh}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clean data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </nav>
    </header>
  );
}
