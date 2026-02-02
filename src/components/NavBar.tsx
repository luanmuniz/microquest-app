import { NavLink } from 'react-router-dom';
import { Scroll, Sun, History, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Quests', icon: Scroll },
  { to: '/today', label: 'Today', icon: Sun },
  { to: '/history', label: 'History', icon: History },
];

export function Navbar() {
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
        </div>
      </nav>
    </header>
  );
}
