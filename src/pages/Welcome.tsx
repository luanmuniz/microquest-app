import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  History,
  Scroll,
  Sparkles,
  Sun,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useQuests } from '@/context';
import { markTutorialSeen, markWelcomeSeen } from '@/lib/onboarding';
import { toast } from 'sonner';

const steps = [
  {
    title: 'Build Your Quest List',
    description:
      'Create small, actionable quests for habits and goals you want to build.',
    icon: Scroll,
  },
  {
    title: "Pick Today's Focus",
    description:
      'Select one quest to focus on for today so your energy goes in one clear direction.',
    icon: Sun,
  },
  {
    title: 'Complete And Reflect',
    description:
      'Mark it complete, add a quick reflection, and watch your progress in history.',
    icon: CheckCircle2,
  },
];

export default function WelcomePage() {
  const { startFresh } = useQuests();
  const navigate = useNavigate();

  const handleStartFresh = () => {
    startFresh();
    markWelcomeSeen();
    markTutorialSeen();
    toast.success('Fresh start ready', {
      description: 'Demo data was cleared. You can now start from an empty quest list.',
    });
    navigate('/quests');
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-in space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-today-highlight p-8 shadow-medium md:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Welcome to MicroQuest
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Small quests, clear daily momentum.
          </h1>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            MicroQuest helps you turn intentions into action with one focused
            daily quest. Build your quest list, choose your daily focus, and
            keep a history of completed wins.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="btn-quest h-11 px-6 text-base">
                <Link to="/quests" onClick={markWelcomeSeen}>
                  Start Using MicroQuest
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="h-11 px-6 text-base">
                    I already know the app
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start fresh without demo data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear your current quests, today selection, and history so
                      you can begin from an empty state.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep current data</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStartFresh} className="btn-quest">
                      Clear and start fresh
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <p className="text-sm text-muted-foreground">
              No account required. Your data stays on this device.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          How it works
        </h2>
        <p className="mt-2 text-muted-foreground">
          A simple loop designed to make progress feel manageable and consistent.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Starter suggestions included</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              New users begin with a few sample quests to make onboarding easier.
              You can edit or delete them anytime and add your own.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
