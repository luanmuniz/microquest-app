export const WELCOME_STORAGE_KEY = 'microquest-welcome-seen';
export const TUTORIAL_STORAGE_KEY = 'microquest-tutorial-seen';

export function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(WELCOME_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markWelcomeSeen(): void {
  try {
    localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage errors (private mode, restricted environments, etc.)
  }
}

export function hasSeenTutorial(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markTutorialSeen(): void {
  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage errors (private mode, restricted environments, etc.)
  }
}

export function clearOnboardingState(): void {
  try {
    localStorage.removeItem(WELCOME_STORAGE_KEY);
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  } catch {
    // Ignore storage errors (private mode, restricted environments, etc.)
  }
}
