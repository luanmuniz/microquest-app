import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Navbar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import { markWelcomeSeen } from '@/lib/onboarding';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isWelcomePage = location.pathname === '/welcome';

  return (
    <div className="min-h-screen bg-background">
      {isWelcomePage ? (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
          <nav className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/welcome" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-soft">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">MicroQuest</span>
            </Link>

            <Button asChild className="btn-quest">
              <Link to="/quests" onClick={markWelcomeSeen}>
                Enter App
              </Link>
            </Button>
          </nav>
        </header>
      ) : (
        <Navbar />
      )}
      <main className={cn('container mx-auto px-4', isWelcomePage ? 'py-10 md:py-14' : 'py-8')}>
        {children}
      </main>
    </div>
  );
}
