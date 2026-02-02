import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuests } from '@/context';
import { EmptyState } from '@/components/Quests/EmptyState';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sun, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function TodayPage() {
  const { todayQuest, completeToday } = useQuests();
  const [reflection, setReflection] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    
    // Small delay for animation
    setTimeout(() => {
      completeToday(reflection);
      setReflection('');
      setIsCompleting(false);
      toast.success('Quest completed! 🎉', {
        description: 'Your achievement has been recorded in history.'
      });
    }, 300);
  };

  if (!todayQuest) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="page-header">Today's Quest</h1>
          <p className="text-muted-foreground mt-1">Your daily focus</p>
        </div>
        
        <EmptyState
          icon={<Sun className="h-8 w-8" />}
          title="No quest selected for today"
          description="Pick a quest from your collection to focus on today. One step at a time!"
          actionLabel="Choose a Quest"
          actionTo="/"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="page-header">Today's Quest</h1>
        <p className="text-muted-foreground mt-1">Focus on this challenge today</p>
      </div>

      {/* Today's Quest Card */}
      <div className={`today-card animate-fade-in ${isCompleting ? 'opacity-50 scale-98' : ''}`}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary shadow-glow">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{todayQuest.title}</h2>
            {todayQuest.description && (
              <p className="mt-2 text-muted-foreground">{todayQuest.description}</p>
            )}
          </div>
        </div>

        {/* Reflection + Complete */}
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reflection" className="text-foreground">
              Reflection (optional)
            </Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="How did it go? What did you learn or feel?"
              rows={3}
              className="bg-background/50"
            />
          </div>

          <Button 
            onClick={handleComplete} 
            disabled={isCompleting}
            className="w-full btn-quest h-12 text-base"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Complete Quest
          </Button>
        </div>
      </div>

      {/* Link to pick another */}
      <div className="mt-6 text-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Want to change today's quest?
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
