import { api } from "@/api";

const STORAGE_KEY = "gelly-fish-completed-challenges";
const SOLUTIONS_STORAGE_KEY = "gelly-fish-challenge-solutions";

/**
 * Get completed challenge IDs from browser storage
 */
export function getCompletedChallengesFromStorage(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const ids = JSON.parse(stored) as string[];
      return new Set(ids);
    }
  } catch (error) {
    console.error("Error reading completed challenges from storage:", error);
  }
  return new Set<string>();
}

/**
 * Save completed challenge ID to browser storage
 */
export function saveCompletedChallengeToStorage(challengeId: string): void {
  try {
    const completed = getCompletedChallengesFromStorage();
    completed.add(challengeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
  } catch (error) {
    console.error("Error saving completed challenge to storage:", error);
  }
}

/**
 * Save solution to browser storage
 */
export function saveSolutionToStorage(
  challengeId: string,
  solution: string
): void {
  try {
    const stored = localStorage.getItem(SOLUTIONS_STORAGE_KEY);
    const solutions = stored
      ? (JSON.parse(stored) as Record<string, string>)
      : {};
    solutions[challengeId] = solution;
    localStorage.setItem(SOLUTIONS_STORAGE_KEY, JSON.stringify(solutions));
  } catch (error) {
    console.error("Error saving solution to storage:", error);
  }
}

/**
 * Get solution from browser storage
 */
export function getSolutionFromStorage(challengeId: string): string | null {
  try {
    const stored = localStorage.getItem(SOLUTIONS_STORAGE_KEY);
    if (stored) {
      const solutions = JSON.parse(stored) as Record<string, string>;
      return solutions[challengeId] || null;
    }
  } catch (error) {
    console.error("Error reading solution from storage:", error);
  }
  return null;
}

/**
 * Save progress to Gadget API if user is signed in
 */
export async function saveProgressToAPI(
  challengeId: string,
  userId: string,
  solution: string
): Promise<void> {
  try {
    await api.progress.upsert({
      challenge: { _link: challengeId },
      user: { _link: userId },
      isComplete: true,
      solution: solution,
      on: ["challenge", "user"],
    });
  } catch (error) {
    console.error("Error saving progress to API:", error);
    throw error;
  }
}

/**
 * Get solution from Gadget API
 */
export async function getSolutionFromAPI(
  challengeId: string,
  userId: string
): Promise<string | null> {
  try {
    const progressRecord = await api.progress.maybeFindFirst({
      filter: {
        challengeId: { equals: challengeId },
        userId: { equals: userId },
        isComplete: { equals: true },
      },
      select: {
        solution: true,
      },
    });

    return progressRecord?.solution || null;
  } catch (error) {
    console.error("Error fetching solution from API:", error);
    return null;
  }
}

/**
 * Get completed challenge IDs from Gadget API
 */
export async function getCompletedChallengesFromAPI(
  userId: string
): Promise<Set<string>> {
  try {
    const progressRecords = await api.progress.findMany({
      filter: {
        userId: { equals: userId },
        isComplete: { equals: true },
      },
    });

    const challengeIds = progressRecords
      .map((p) => p.challengeId)
      .filter((id): id is string => !!id);

    return new Set(challengeIds);
  } catch (error) {
    console.error("Error fetching completed challenges from API:", error);
    return new Set<string>();
  }
}

/**
 * Mark a challenge as completed
 * - Anonymous users: saves to localStorage only
 * - Signed-in users: saves to API only (account is source of truth)
 */
export async function markChallengeCompleted(
  challengeId: string,
  userId?: string,
  solution?: string
): Promise<void> {
  if (userId && solution) {
    // Signed-in user: save to API only (account is source of truth)
    await saveProgressToAPI(challengeId, userId, solution);
  } else {
    // Anonymous user: save to localStorage
    saveCompletedChallengeToStorage(challengeId);
    if (solution) {
      saveSolutionToStorage(challengeId, solution);
    }
  }
}

/**
 * Get stored solution for a challenge
 * - Anonymous users: checks localStorage
 * - Signed-in users: checks API only (account is source of truth)
 */
export async function getStoredSolution(
  challengeId: string,
  userId?: string
): Promise<string | null> {
  if (userId) {
    // Signed-in user: check API only
    return await getSolutionFromAPI(challengeId, userId);
  }

  // Anonymous user: check localStorage
  return getSolutionFromStorage(challengeId);
}

/**
 * Get all completed challenge IDs
 * - Anonymous users: returns localStorage data
 * - Signed-in users: returns API data only (account is source of truth)
 */
export async function getCompletedChallenges(
  userId?: string
): Promise<Set<string>> {
  if (userId) {
    // Signed-in user: return API data only
    return await getCompletedChallengesFromAPI(userId);
  }

  // Anonymous user: return localStorage data
  return getCompletedChallengesFromStorage();
}

/**
 * Check if a specific challenge is completed
 */
export async function isChallengeCompleted(
  challengeId: string,
  userId?: string
): Promise<boolean> {
  const completed = await getCompletedChallenges(userId);
  return completed.has(challengeId);
}

/**
 * Clear all progress from browser storage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SOLUTIONS_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing progress from storage:", error);
  }
}

/**
 * Get all solutions from browser storage
 */
export function getAllSolutionsFromStorage(): Record<string, string> {
  try {
    const stored = localStorage.getItem(SOLUTIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Record<string, string>;
    }
  } catch (error) {
    console.error("Error reading solutions from storage:", error);
  }
  return {};
}

/**
 * Sync localStorage progress to user account on login
 * Syncs all local completions to the account (upsert handles duplicates safely)
 * Then clears localStorage so account becomes single source of truth
 */
export async function syncLocalStorageToAccount(userId: string): Promise<{
  synced: boolean;
  count: number;
}> {
  const localChallenges = getCompletedChallengesFromStorage();
  const localSolutions = getAllSolutionsFromStorage();

  // Nothing to sync
  if (localChallenges.size === 0) {
    return { synced: false, count: 0 };
  }

  let syncedCount = 0;

  // Sync each local challenge to the account
  // upsert will safely handle duplicates without overwriting existing solutions
  for (const challengeId of localChallenges) {
    const solution = localSolutions[challengeId];
    if (solution) {
      try {
        await saveProgressToAPI(challengeId, userId, solution);
        syncedCount++;
      } catch (error) {
        console.error(`Error syncing challenge ${challengeId}:`, error);
      }
    }
  }

  // Clear localStorage - account is now the source of truth
  clearLocalStorage();

  return { synced: syncedCount > 0, count: syncedCount };
}
