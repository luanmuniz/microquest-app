import {
  CSSProperties,
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useQuests } from '@/context';
import {
  hasSeenTutorial,
  hasSeenWelcome,
  markTutorialSeen,
} from '@/lib/onboarding';
import { useIsMobile } from '@/hooks/useMobile';
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
  restartTutorial: () => void;
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
      'Do you want to clean this tutorial data and start using Microquest with a fresh slate?',
  },
];

const defaultContextValue: TutorialContextValue = {
  isActive: false,
  currentStepId: null,
  tutorialQuestId: null,
  tutorialCompletionId: null,
  restartTutorial: () => {},
};

const TutorialContext = createContext<TutorialContextValue>(defaultContextValue);

function shouldRunTutorial(isMobile: boolean) {
  return !isMobile && hasSeenWelcome() && !hasSeenTutorial();
}

export function TutorialProvider({ children }: { children: ReactNode }) {
  const { quests, todayQuestId, completions, startFresh } = useQuests();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isActive, setIsActive] = useState(() => shouldRunTutorial(isMobile));
  const [stepIndex, setStepIndex] = useState(0);
  const [tutorialQuestId, setTutorialQuestId] = useState<string | null>(null);
  const [tutorialCompletionId, setTutorialCompletionId] = useState<string | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetStepId, setTargetStepId] = useState<TutorialStepId | null>(null);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
  const initialQuestIdsRef = useRef<Set<string>>(new Set());
  const currentStep = tutorialSteps[stepIndex];
  const isTutorialActive = !isMobile && isActive;

  const resetTutorialState = useCallback(() => {
    setIsActive(false);
    setStepIndex(0);
    setTutorialQuestId(null);
    setTutorialCompletionId(null);
    setTargetRect(null);
    setTargetStepId(null);
    setIsSkipDialogOpen(false);
    initialQuestIdsRef.current = new Set();
  }, []);

  const restartTutorial = useCallback(() => {
    if (isMobile) {
      markTutorialSeen();
      resetTutorialState();
      return;
    }

    setIsActive(true);
    setStepIndex(0);
    setTutorialQuestId(null);
    setTutorialCompletionId(null);
    setTargetRect(null);
    setTargetStepId(null);
    setIsSkipDialogOpen(false);
    initialQuestIdsRef.current = new Set(quests.map((quest) => quest.id));
  }, [isMobile, quests, resetTutorialState]);

  const finishTutorial = useCallback(() => {
    markTutorialSeen();
    resetTutorialState();
  }, [resetTutorialState]);

  const advanceStep = useCallback((expectedStepId: TutorialStepId) => {
    setStepIndex((previousIndex) => {
      if (tutorialSteps[previousIndex]?.id !== expectedStepId) {
        return previousIndex;
      }

      return Math.min(previousIndex + 1, tutorialSteps.length - 1);
    });
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (!hasSeenTutorial()) {
      markTutorialSeen();
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetTutorialState();
  }, [isMobile, resetTutorialState]);

  useEffect(() => {
    if (
      !isTutorialActive &&
      shouldRunTutorial(isMobile) &&
      location.pathname !== '/welcome'
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      restartTutorial();
    }
  }, [isMobile, isTutorialActive, location.pathname, restartTutorial]);

  useEffect(() => {
    if (!isTutorialActive || !currentStep) {
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
    advanceStep,
    completions,
    currentStep,
    isTutorialActive,
    location.pathname,
    quests,
    tutorialQuestId,
    todayQuestId,
  ]);

  useEffect(() => {
    if (!isTutorialActive || !currentStep?.targetSelector) {
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

      const targetPosition = window.getComputedStyle(targetElement).position;
      const isFixedTarget = targetPosition === 'fixed';
      let targetElementRect = targetElement.getBoundingClientRect();
      const isOffscreen =
        targetElementRect.bottom < 0 ||
        targetElementRect.top > window.innerHeight ||
        targetElementRect.right < 0 ||
        targetElementRect.left > window.innerWidth;

      if (isOffscreen && !isFixedTarget) {
        targetElement.scrollIntoView({
          block: 'center',
          inline: 'nearest',
          behavior: 'auto',
        });
        targetElementRect = targetElement.getBoundingClientRect();
      }

      if (
        isMobile &&
        !isFixedTarget &&
        targetElementRect.bottom > window.innerHeight - 260
      ) {
        targetElement.scrollIntoView({
          block: 'center',
          inline: 'nearest',
          behavior: 'auto',
        });
        targetElementRect = targetElement.getBoundingClientRect();
      }

      if (
        isMobile &&
        (currentStep.id === 'open-today' || currentStep.id === 'open-history')
      ) {
        const insetX = Math.min(16, targetElementRect.width * 0.18);
        const insetTop = 4;
        const insetBottom = 6;
        const adjustedWidth = Math.max(44, targetElementRect.width - insetX * 2);
        const adjustedHeight = Math.max(
          36,
          targetElementRect.height - insetTop - insetBottom,
        );

        targetElementRect = new DOMRect(
          targetElementRect.left + insetX,
          targetElementRect.top + insetTop,
          adjustedWidth,
          adjustedHeight,
        );
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
  }, [currentStep, isTutorialActive, isMobile, location.pathname]);

  useEffect(() => {
    if (
      !isTutorialActive ||
      !currentStep?.targetSelector ||
      !currentStep.advanceOnTargetClick
    ) {
      return;
    }

    // For navigation steps, only advance when route actually changes.
    // This prevents progressing the tutorial on touchstart/pointerdown
    // without the page transition completing.
    if (currentStep.id === 'open-today' || currentStep.id === 'open-history') {
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

    targetElement.addEventListener('click', handleTargetClick, {
      once: true,
    });

    return () => {
      targetElement.removeEventListener('click', handleTargetClick);
    };
  }, [advanceStep, currentStep, isTutorialActive, location.pathname, targetRect]);

  useEffect(() => {
    if (!isTutorialActive) {
      document.body.classList.remove('tutorial-active');
      return;
    }

    document.body.classList.add('tutorial-active');

    return () => {
      document.body.classList.remove('tutorial-active');
    };
  }, [isTutorialActive]);

  const cardStyle = useMemo<CSSProperties>(() => {
    if (isMobile) {
      const isLargeTarget = Boolean(
        targetRect && targetRect.height > window.innerHeight * 0.45,
      );
      const shouldDockTop = Boolean(
        targetRect &&
          (targetRect.top > window.innerHeight * 0.55 || isLargeTarget),
      );

      return {
        left: 12,
        right: 12,
        top: shouldDockTop
          ? 'calc(env(safe-area-inset-top) + 12px)'
          : 'auto',
        bottom: shouldDockTop
          ? 'auto'
          : 'calc(env(safe-area-inset-bottom) + 12px)',
        width: 'auto',
        maxHeight: '46svh',
        overflowY: 'auto',
      };
    }

    if (!targetRect) {
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 360,
        maxWidth: 'calc(100vw - 2rem)',
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
      maxWidth: 'calc(100vw - 2rem)',
    };
  }, [isMobile, targetRect]);

  const highlightStyle = useMemo<CSSProperties | null>(() => {
    if (!targetRect) {
      return null;
    }

    const isBottomNavStep =
      isMobile &&
      (currentStep?.id === 'open-today' || currentStep?.id === 'open-history');
    const isCreateQuestModalStep =
      isMobile && currentStep?.id === 'create-quest-modal';

    if (isCreateQuestModalStep) {
      const top = Math.max(0, targetRect.top - 2);

      return {
        top,
        left: 0,
        width: window.innerWidth,
        height: Math.max(0, window.innerHeight - top),
        borderRadius: '1.5rem 1.5rem 0 0',
      };
    }

    const viewportMargin = isBottomNavStep ? 4 : 8;
    const outlinePadding = isBottomNavStep ? 3 : 6;
    const maxWidth = Math.max(0, window.innerWidth - viewportMargin * 2);
    const maxHeight = Math.max(0, window.innerHeight - viewportMargin * 2);
    const width = Math.min(targetRect.width + outlinePadding * 2, maxWidth);
    const height = Math.min(targetRect.height + outlinePadding * 2, maxHeight);
    const left = Math.min(
      Math.max(viewportMargin, targetRect.left - outlinePadding),
      window.innerWidth - width - viewportMargin,
    );
    const top = Math.min(
      Math.max(viewportMargin, targetRect.top - outlinePadding),
      window.innerHeight - height - viewportMargin,
    );

    return {
      top,
      left,
      width,
      height,
      borderRadius: isBottomNavStep ? 18 : 12,
    };
  }, [currentStep?.id, isMobile, targetRect]);

  const shouldHighlightTarget = Boolean(
    currentStep?.targetSelector &&
      targetRect &&
      targetStepId === currentStep.id &&
      !isSkipDialogOpen,
  );
  const shouldShowCleanupPrompt = currentStep?.id === 'cleanup-prompt';
  const shouldRenderGuideCard = !isSkipDialogOpen && (
    shouldHighlightTarget ||
    shouldShowCleanupPrompt ||
    Boolean(currentStep?.manualAdvance)
  );

  const handleSkipTutorial = () => {
    setIsSkipDialogOpen(true);
  };

  const handleSkipKeepData = () => {
    setIsSkipDialogOpen(false);
    finishTutorial();
    toast.success('Tutorial skipped', {
      description: 'You can still use the app normally and explore on your own.',
    });
  };

  const handleSkipCleanData = () => {
    setIsSkipDialogOpen(false);
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
      description: 'You now have a fresh workspace to start using Microquest.',
    });
  };

  return (
    <TutorialContext.Provider
      value={{
        isActive: isTutorialActive,
        currentStepId: isTutorialActive ? currentStep?.id ?? null : null,
        tutorialQuestId: isTutorialActive ? tutorialQuestId : null,
        tutorialCompletionId: isTutorialActive ? tutorialCompletionId : null,
        restartTutorial,
      }}
    >
      {children}

      {isTutorialActive && currentStep && shouldRenderGuideCard && (
        <>
          {shouldHighlightTarget ? (
            <div className="pointer-events-none fixed inset-0 z-[80]">
              <div
                className="absolute rounded-xl border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] transition-all duration-200"
                style={highlightStyle ?? undefined}
              />
            </div>
          ) : (
            <div className="pointer-events-none fixed inset-0 z-[80] bg-black/40" />
          )}

          <div
            className="fixed z-[90] rounded-2xl border border-border/80 bg-card p-4 shadow-medium pointer-events-auto lg:p-5"
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

            {currentStep.id === 'cleanup-prompt' ? (
              <div className="mt-5 flex flex-col gap-2 lg:flex-row lg:justify-end">
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

      <AlertDialog open={isSkipDialogOpen} onOpenChange={setIsSkipDialogOpen}>
        <AlertDialogContent className="max-w-xl">
          <AlertDialogClose aria-label="Close skip tutorial dialog" />
          <AlertDialogHeader className="pr-8">
            <AlertDialogTitle>Skip tutorial?</AlertDialogTitle>
            <AlertDialogDescription>
              You can stop the guided tutorial now and either keep the tutorial
              data you created so far or remove it and continue with a fresh
              workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="lg:flex-wrap lg:gap-2 lg:space-x-0">
            <AlertDialogCancel>Continue tutorial</AlertDialogCancel>
            <Button
              type="button"
              variant="outline"
              className="w-full lg:w-auto"
              onClick={handleSkipKeepData}
            >
              Skip and keep data
            </Button>
            <Button
              type="button"
              className="btn-quest w-full lg:w-auto"
              onClick={handleSkipCleanData}
            >
              Skip and clean data
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}
