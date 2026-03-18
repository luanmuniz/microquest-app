import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  CircleHelp,
  Database,
  Download,
  History,
  Menu,
  Scroll,
  Sparkles,
  Sun,
  Trash2,
  X,
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
import { useIsMobile } from '@/hooks/useMobile';
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
  const isMobile = useIsMobile();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCleanDataDialogOpen, setIsCleanDataDialogOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isMobile) return;

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
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !isUserMenuOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    document.body.style.setProperty('overflow', 'hidden');

    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isMobile, isUserMenuOpen]);

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

  const handleOpenHowItWorks = () => {
    setIsUserMenuOpen(false);
    navigate('/welcome');
  };

  const menuActionClassName =
    'flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted';

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-lg">
        <nav className="container mx-auto flex h-14 items-center justify-between px-3 sm:px-4 lg:h-16">
          <Link to="/quests" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-soft lg:h-9 lg:w-9">
              <Sparkles className="h-4 w-4 text-primary-foreground lg:h-5 lg:w-5" />
            </div>
            <span className="text-base font-bold tracking-tight lg:text-lg">MicroQuest</span>
          </Link>

          {isMobile ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-2 px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              <Menu className="h-4 w-4" />
              <span>More</span>
            </Button>
          ) : (
            <div className="flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsUserMenuOpen(false)}
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
                  <span>{label}</span>
                </NavLink>
              ))}
              <NavLink
                to="/welcome"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
              >
                <CircleHelp className="h-4 w-4" />
                <span>How it works</span>
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
                  <span>Data</span>
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
            </div>
          )}
        </nav>
      </header>

      {isMobile && (
        <>
	  <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur-lg">
	    <div className="mx-auto flex max-w-2xl items-stretch justify-between px-1 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsUserMenuOpen(false)}
                  data-tutorial-id={
                    to === '/today'
                      ? 'nav-today'
                      : to === '/history'
                        ? 'nav-history'
                        : undefined
                  }
                  className={({ isActive }) =>
		    `mx-1 flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 text-xs font-medium transition-colors ${
                      isActive
			? 'bg-primary/10 text-primary'
			: 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
		  <Icon className="h-4 w-4" />
		  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {isUserMenuOpen && (
            <div className="fixed inset-0 z-[60]">
              <button
                type="button"
                aria-label="Close menu"
                className="absolute inset-0 bg-black/45"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border border-border/70 bg-card p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-medium animate-scale-in">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Menu
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div role="menu" className="space-y-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleOpenHowItWorks}
                    className={menuActionClassName}
                  >
                    <CircleHelp className="h-4 w-4" />
                    How it works
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleExportData}
                    className={menuActionClassName}
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
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clean data
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <AlertDialog
        open={isCleanDataDialogOpen}
        onOpenChange={setIsCleanDataDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clean all app data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your quests, today&apos;s selection,
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
    </>
  );
}
