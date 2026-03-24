import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scroll, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import { markWelcomeSeen } from '@/lib/onboarding';
import { useIsMobile } from '@/hooks/useMobile';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isWelcomePage = location.pathname === '/welcome';

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {isWelcomePage ? (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
          <nav className="container mx-auto flex h-14 items-center justify-between px-3 sm:px-4 lg:h-16">
            <Link to="/welcome" className="flex items-center gap-2">
	      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-soft lg:h-9 lg:w-9">
          <Scroll className="h-4 w-4 text-primary-foreground lg:h-5 lg:w-5" />
	      </div>
	      <span className="text-base font-bold tracking-tight lg:text-lg">Microquest</span>
            </Link>

            <Button asChild className="btn-quest h-9 px-4 text-sm lg:h-10">
              <Link to="/quests" onClick={markWelcomeSeen}>
                Enter App
              </Link>
            </Button>
          </nav>
        </header>
      ) : (
        <Navbar />
      )}
      <main
        className={cn(
          'container mx-auto px-3 sm:px-4',
          isWelcomePage ? 'py-8 lg:py-14' : 'py-6 lg:py-8',
          !isWelcomePage && isMobile
            ? 'pb-[calc(6rem+env(safe-area-inset-bottom))]'
            : undefined,
        )}
      >
        {children}
      </main>
    </div>
  );
}
