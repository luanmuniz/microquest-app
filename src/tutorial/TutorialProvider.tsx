import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuests } from '@/context';
import {
  hasSeenTutorial,
  hasSeenWelcome,
  markTutorialSeen,
} from '@/lib/onboarding';
import { toast } from 'sonner';

type TutorialStepId =
  | 'create-quest'
  | 'create-quest-modal'
  | 'set-today'
  | 'open-today'
  | 'complete-quest'
  | 'open-history'
  | 'see-history'
  | 'cleanup-prompt';

interface TutorialStep {
  id: TutorialStepId;
  title: string;
  description: string;
  targetSelector?: string;
  manualAdvance?: boolean;
  advanceOnTargetClick?: boolean;
}

interface TutorialContextValue {
  isActive: boolean;
  currentStepId: TutorialStepId | null;
  tutorialQuestId: string | null;
  tutorialCompletionId: string | null;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'create-quest',
    title: 'Create your first quest',
    description: 'Click the highlighted button to open the quest creation modal.',
    targetSelector: '[data-tutorial-id="create-quest-button"]',
    advanceOnTargetClick: true,
  },
  {
    id: 'create-quest-modal',
    title: 'Create your first quest',
    description:
      'Fill the quest title and (optionally) description, then submit the form in the highlighted modal.',
    targetSelector: '[data-tutorial-id="create-quest-modal"]',
  },
  {
    id: 'set-today',
    title: "Mark it as today's quest",
    description: "Use the highlighted sun button on the quest you just created.",
    targetSelector: '[data-tutorial-id="set-today-quest"]',
    advanceOnTargetClick: true,
  },
  {
    id: 'open-today',
    title: "Open Today's Quest page",
    description: 'Click the highlighted Today menu item.',
    targetSelector: '[data-tutorial-id="nav-today"]',
    advanceOnTargetClick: true,
  },
  {
    id: 'complete-quest',
    title: 'Fill the reflection and complete quest',
    description:
      'Write a short reflection, then click the highlighted Complete Quest button.',
    targetSelector: '[data-tutorial-id="today-quest-card"]',
  },
  {
    id: 'open-history',
    title: 'See it in history',
    description: 'Click the highlighted History menu item.',
    targetSelector: '[data-tutorial-id="nav-history"]',
    advanceOnTargetClick: true,
  },
  {
    id: 'see-history',
    title: 'Confirm your result',
    description: 'Your completed quest with reflection appears here. Click continue when ready.',
    targetSelector: '[data-tutorial-id="history-entry"]',
    manualAdvance: true,
  },
  {
    id: 'cleanup-prompt',
    title: 'Tutorial Complete',
    description:
      'Do you want to clean this tutorial data and start using MicroQuest with a fresh slate?',
  },
];

const defaultContextValue: TutorialContextValue = {
  isActive: false,
  currentStepId: null,
  tutorialQuestId: null,
  tutorialCompletionId: null,
};

const TutorialContext = createContext<TutorialContextValue>(defaultContextValue);

function shouldRunTutorial() {
  return hasSeenWelcome() && !hasSeenTutorial();
}

export function TutorialProvider({ children }: { children: ReactNode }) {
  const { quests, todayQuestId, completions, startFresh } = useQuests();
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(() => shouldRunTutorial());
  const [stepIndex, setStepIndex] = useState(0);
  const [tutorialQuestId, setTutorialQuestId] = useState<string | null>(null);
  const [tutorialCompletionId, setTutorialCompletionId] = useState<string | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetStepId, setTargetStepId] = useState<TutorialStepId | null>(null);
  const [showSkipCleanupPrompt, setShowSkipCleanupPrompt] = useState(false);
  const initialQuestIdsRef = useRef<Set<string>>(new Set());
  const currentStep = tutorialSteps[stepIndex];

  const activateTutorial = useCallback(() => {
    setIsActive(true);
    setStepIndex(0);
    setTutorialQuestId(null);
    setTutorialCompletionId(null);
    initialQuestIdsRef.current = new Set(quests.map((quest) => quest.id));
  }, [quests]);

  const resetTutorialState = () => {
    setIsActive(false);
    setStepIndex(0);
    setTutorialQuestId(null);
    setTutorialCompletionId(null);
    setTargetRect(null);
    setTargetStepId(null);
    setShowSkipCleanupPrompt(false);
    initialQuestIdsRef.current = new Set();
  };

  const finishTutorial = () => {
    markTutorialSeen();
    resetTutorialState();
  };

  const advanceStep = useCallback((expectedStepId: TutorialStepId) => {
    setStepIndex((previousIndex) => {
      if (tutorialSteps[previousIndex]?.id !== expectedStepId) {
        return previousIndex;
      }

      return Math.min(previousIndex + 1, tutorialSteps.length - 1);
    });
  }, []);

  useEffect(() => {
    if (!isActive && shouldRunTutorial() && location.pathname !== '/welcome') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      activateTutorial();
    }
  }, [activateTutorial, isActive, location.pathname]);

  useEffect(() => {
    if (!isActive || !currentStep) {
      return;
    }

    if (!tutorialQuestId) {
      const createdQuest = quests.find(
        (quest) => !initialQuestIdsRef.current.has(quest.id),
      );

      if (createdQuest) {
        setTutorialQuestId((currentId) => currentId ?? createdQuest.id);
      }
    }

    if (currentStep.id === 'create-quest-modal') {
      if (tutorialQuestId) {
        advanceStep('create-quest-modal');
      }
      return;
    }

    if (currentStep.id === 'set-today') {
      if (tutorialQuestId && todayQuestId === tutorialQuestId) {
        advanceStep('set-today');
      }
      return;
    }

    if (currentStep.id === 'open-today') {
      if (location.pathname === '/today') {
        advanceStep('open-today');
      }
      return;
    }

    if (currentStep.id === 'complete-quest') {
      if (!tutorialQuestId) return;

      const completion = completions.find(
        (entry) =>
          entry.questId === tutorialQuestId && entry.reflection.trim().length > 0,
      );

      if (completion) {
        setTutorialCompletionId((currentId) => currentId ?? completion.id);
        advanceStep('complete-quest');
      }
      return;
    }

    if (currentStep.id === 'open-history') {
      if (location.pathname === '/history') {
        advanceStep('open-history');
      }
    }
  }, [
    completions,
    currentStep,
    isActive,
    location.pathname,
    quests,
    tutorialQuestId,
    todayQuestId,
  ]);

  useEffect(() => {
    if (!isActive || !currentStep?.targetSelector) {
      return;
    }

    let rafId: number | null = null;

    const resolveTargetElement = () => {
      const matchingElements = Array.from(
        document.querySelectorAll<HTMLElement>(currentStep.targetSelector!),
      );

      if (matchingElements.length === 0) {
        return null;
      }

      const visibleElements = matchingElements.filter((element) => {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        return (
          styles.display !== 'none' &&
          styles.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0
        );
      });

      const candidates = visibleElements.length > 0 ? visibleElements : matchingElements;

      return (
        candidates.find((element) =>
          element.matches(
            'button, a, input, textarea, select, [role="button"], [role="menuitem"]',
          ),
        ) ?? candidates[0]
      );
    };

    const updateTargetRect = () => {
      const targetElement = resolveTargetElement();

      if (!targetElement) {
        setTargetRect(null);
        setTargetStepId(null);
        return;
      }

      let targetElementRect = targetElement.getBoundingClientRect();
      const isOffscreen =
        targetElementRect.bottom < 0 ||
        targetElementRect.top > window.innerHeight ||
        targetElementRect.right < 0 ||
        targetElementRect.left > window.innerWidth;

      if (isOffscreen) {
        targetElement.scrollIntoView({
          block: 'center',
          inline: 'nearest',
          behavior: 'auto',
        });
        targetElementRect = targetElement.getBoundingClientRect();
      }

      setTargetRect(targetElementRect);
      setTargetStepId(currentStep.id);
    };

    const scheduleTargetRectUpdate = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(updateTargetRect);
    };

    scheduleTargetRectUpdate();
    window.addEventListener('resize', scheduleTargetRectUpdate);
    window.addEventListener('scroll', scheduleTargetRectUpdate, true);

    const observer = new MutationObserver(scheduleTargetRectUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-state'],
    });

    return () => {
      window.removeEventListener('resize', scheduleTargetRectUpdate);
      window.removeEventListener('scroll', scheduleTargetRectUpdate, true);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      observer.disconnect();
    };
  }, [currentStep, isActive, location.pathname]);

  useEffect(() => {
    if (
      !isActive ||
      !currentStep?.targetSelector ||
      !currentStep.advanceOnTargetClick
    ) {
      return;
    }

    const targetElement = document.querySelector(
      currentStep.targetSelector,
    ) as HTMLElement | null;

    if (!targetElement) {
      return;
    }

    const handleTargetClick = () => {
      advanceStep(currentStep.id);
    };

    targetElement.addEventListener('pointerdown', handleTargetClick, {
      once: true,
    });

    return () => {
      targetElement.removeEventListener('pointerdown', handleTargetClick);
    };
  }, [advanceStep, currentStep, isActive, location.pathname, targetRect]);

  useEffect(() => {
    if (!isActive) {
      document.body.classList.remove('tutorial-active');
      return;
    }

    document.body.classList.add('tutorial-active');

    return () => {
      document.body.classList.remove('tutorial-active');
    };
  }, [isActive]);

  const cardStyle = useMemo(() => {
    if (!targetRect) {
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 360,
      };
    }

    const cardWidth = 360;
    const minMargin = 16;
    const estimatedHeight = 220;
    const belowTargetTop = targetRect.bottom + 14;
    const top =
      belowTargetTop + estimatedHeight < window.innerHeight - minMargin
        ? belowTargetTop
        : Math.max(minMargin, targetRect.top - estimatedHeight - 14);
    const left = Math.min(
      Math.max(minMargin, targetRect.left),
      window.innerWidth - cardWidth - minMargin,
    );

    return {
      left,
      top,
      width: cardWidth,
    };
  }, [targetRect]);

  const shouldHighlightTarget = Boolean(
    currentStep?.targetSelector &&
      targetRect &&
      targetStepId === currentStep.id &&
      !showSkipCleanupPrompt,
  );
  const shouldShowCleanupPrompt = currentStep?.id === 'cleanup-prompt';
  const shouldRenderGuideCard =
    shouldHighlightTarget ||
    shouldShowCleanupPrompt ||
    showSkipCleanupPrompt ||
    Boolean(currentStep?.manualAdvance);

  const handleSkipTutorial = () => {
    setShowSkipCleanupPrompt(true);
  };

  const handleSkipKeepData = () => {
    finishTutorial();
    toast.success('Tutorial skipped', {
      description: 'You can still use the app normally and explore on your own.',
    });
  };

  const handleSkipCleanData = () => {
    startFresh();
    finishTutorial();
    navigate('/quests');
    toast.success('Tutorial skipped and data cleaned', {
      description: 'Tutorial quests were removed. You can start with a clean workspace.',
    });
  };

  const handleKeepTutorialData = () => {
    finishTutorial();
    navigate('/quests');
    toast.success('You are ready to go', {
      description: 'Tutorial is complete. Keep building your own quests.',
    });
  };

  const handleCleanTutorialData = () => {
    startFresh();
    finishTutorial();
    navigate('/quests');
    toast.success('Tutorial data cleaned', {
      description: 'You now have a fresh workspace to start using MicroQuest.',
    });
  };

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStepId: isActive ? currentStep?.id ?? null : null,
        tutorialQuestId,
        tutorialCompletionId,
      }}
    >
      {children}

      {isActive && currentStep && shouldRenderGuideCard && (
        <>
          {shouldHighlightTarget ? (
            <div className="pointer-events-none fixed inset-0 z-[80]">
              <div
                className="absolute rounded-xl border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] transition-all duration-200"
                style={{
                  top: Math.max(8, targetRect.top - 6),
                  left: Math.max(8, targetRect.left - 6),
                  width: targetRect.width + 12,
                  height: targetRect.height + 12,
                }}
              />
            </div>
          ) : (
            <div className="pointer-events-none fixed inset-0 z-[80] bg-black/40" />
          )}

          <div
            className="fixed z-[90] rounded-2xl border border-border/80 bg-card p-5 shadow-medium pointer-events-auto"
            style={cardStyle}
          >
            <div className="text-xs font-medium uppercase tracking-wide text-primary">
              Guided Tutorial
            </div>
            <h3 className="mt-1 text-lg font-semibold text-foreground">
              {currentStep.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {currentStep.description}
            </p>

            {showSkipCleanupPrompt ? (
              <div>
                <h4 className="mt-4 text-sm font-medium text-foreground">
                  Before skipping, do you want to clean tutorial quest data?
                </h4>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="ghost" onClick={() => setShowSkipCleanupPrompt(false)}>
                    Continue tutorial
                  </Button>
                  <Button variant="outline" onClick={handleSkipKeepData}>
                    Skip and keep data
                  </Button>
                  <Button className="btn-quest" onClick={handleSkipCleanData}>
                    Skip and clean data
                  </Button>
                </div>
              </div>
            ) : currentStep.id === 'cleanup-prompt' ? (
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={handleKeepTutorialData}>
                  Keep tutorial data
                </Button>
                <Button className="btn-quest" onClick={handleCleanTutorialData}>
                  Clean data and start
                </Button>
              </div>
            ) : (
              <div className="mt-5 flex items-center justify-between gap-2">
                <Button variant="ghost" onClick={handleSkipTutorial}>
                  Skip tutorial
                </Button>
                {currentStep.manualAdvance ? (
                  <Button
                    className="btn-quest"
                    onClick={() => advanceStep(currentStep.id)}
                  >
                    Continue
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Complete the highlighted action to continue.
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}
